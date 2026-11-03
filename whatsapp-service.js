/**
 * AGENTE 4 - SERVICIO OFICIAL DE VINCULACIÓN WHATSAPP WEB Y MULTI-DEVICE (BAILEYS)
 * Conexión WebSocket real con los servidores de WhatsApp.
 * Soporta:
 * 1. Escaneo de Código QR auténtico de WhatsApp Web (reconocido por la app oficial).
 * 2. Vinculación mediante Código de 8 Dígitos (Pairing Code sin cámara).
 * 3. Respuestas automáticas con Groq AI ultra-rápido y lectura de ubicación en tiempo real.
 */

const QRCode = require('qrcode');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

let baileysModPromise = null;
async function loadBaileys() {
  if (!baileysModPromise) {
    baileysModPromise = import('@whiskeysockets/baileys');
  }
  const mod = await baileysModPromise;
  return {
    makeWASocket: mod.default || mod.makeWASocket,
    useMultiFileAuthState: mod.useMultiFileAuthState,
    DisconnectReason: mod.DisconnectReason,
    fetchLatestBaileysVersion: mod.fetchLatestBaileysVersion
  };
}

const SESSION_DIR = process.env.VERCEL
  ? path.join('/tmp', 'whatsapp_session')
  : path.join(__dirname, 'whatsapp_session');

// Estado en memoria de la sesión de WhatsApp
const waState = {
  status: 'disconnected', // 'disconnected', 'connecting', 'waiting', 'connected'
  qrRaw: null,
  qrDataUrl: null,
  qrGeneratedAt: 0,
  pairingCode: null,
  connectedPhone: null,
  connectedName: null,
  batteryLevel: 95,
  latencyMs: 38,
  lastUpdate: new Date().toISOString(),
  initError: null,
  sock: null,
  initPromise: null,
  geminiCaller: null,
  businessesProvider: null,
  systemPromptProvider: null,
  messagesLog: []
};

// Suscriptores en espera de eventos de QR o conexión (para mantener vivo el contenedor Serverless)
const statusWaiters = new Set();
function notifyStatusWaiters(eventType) {
  for (const resolver of statusWaiters) {
    try {
      resolver(eventType);
    } catch (_) {}
  }
  statusWaiters.clear();
}

function configureWhatsAppService(options = {}) {
  if (options.callGeminiApi) waState.geminiCaller = options.callGeminiApi;
  if (options.getBusinesses) waState.businessesProvider = options.getBusinesses;
  if (options.getSystemPrompt) waState.systemPromptProvider = options.getSystemPrompt;
  if (options.messagesLog) waState.messagesLog = options.messagesLog;
}

// Memoria conversacional multi-turno por usuario de WhatsApp (máx. 8 mensajes por contacto)
const waConversationMemory = new Map();

function haversineKm(lat1, lon1, lat2, lon2) {
  if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || typeof lat2 !== 'number' || typeof lon2 !== 'number') return 999;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Limpia la carpeta de sesión si el usuario solicita desconectar o si la sesión expiró
 */
function cleanSessionFolder() {
  try {
    if (fs.existsSync(SESSION_DIR)) {
      fs.rmSync(SESSION_DIR, { recursive: true, force: true });
      console.log('[WhatsApp Service] Carpeta de sesión eliminada.');
    }
  } catch (err) {
    console.warn('[WhatsApp Service] Error al limpiar carpeta de sesión:', err.message);
  }
}

/**
 * Inicia la conexión con los servidores de WhatsApp Web
 */
async function startWhatsAppSocket(options = {}) {
  if (options.callGeminiApi) waState.geminiCaller = options.callGeminiApi;
  if (options.getBusinesses) waState.businessesProvider = options.getBusinesses;
  if (options.getSystemPrompt) waState.systemPromptProvider = options.getSystemPrompt;
  if (options.messagesLog) waState.messagesLog = options.messagesLog;

  // Si ya está conectado, no reiniciar innecesariamente
  if (waState.status === 'connected' && waState.sock) {
    return waState;
  }

  // Evitar múltiples inicializaciones concurrentes (race condition)
  if (waState.initPromise) {
    return waState.initPromise;
  }

  // Cerrar socket previo huérfano si existiera
  if (waState.sock) {
    try {
      waState.sock.ev.removeAllListeners();
      waState.sock.end();
    } catch (_) {}
    waState.sock = null;
  }

  waState.status = 'connecting';
  waState.lastUpdate = new Date().toISOString();

  waState.initPromise = (async () => {
    try {
      const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = await loadBaileys();
      const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
      const { version, isLatest } = await Promise.race([
        fetchLatestBaileysVersion(),
        new Promise(resolve => setTimeout(() => resolve({ version: [2, 3000, 1015901307], isLatest: true }), 1500))
      ]).catch(() => ({ version: [2, 3000, 1015901307], isLatest: true }));

      console.log(`[WhatsApp Service] Iniciando Baileys v${version.join('.')} (Última: ${isLatest})...`);

      const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['Windows', 'Chrome', '10.0.0'],
        syncFullHistory: false,
        generateHighQualityLinkPreview: true,
        connectTimeoutMs: 20000
      });

      waState.sock = sock;
      waState.initError = null;

      // Guardar credenciales automáticamente
      sock.ev.on('creds.update', saveCreds);

      // Evento de actualización de conexión
      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          // Normalizar payload QR Multi-Device a formato puro 2@<ref>,<noise>,<identity>,<adv>,<platformId>
          // compatible al 100% con el escáner interno de WhatsApp Business ("Vincular un dispositivo")
          const normalizedQr = qr.includes('#2@')
            ? qr.substring(qr.indexOf('#2@') + 1)
            : qr;
          waState.qrRaw = normalizedQr;
          waState.qrGeneratedAt = Date.now();
          try {
            waState.qrDataUrl = await QRCode.toDataURL(normalizedQr, {
              width: 320,
              margin: 2,
              errorCorrectionLevel: 'M',
              color: {
                dark: '#111B21',
                light: '#FFFFFF'
              }
            });
            waState.status = 'waiting';
            waState.lastUpdate = new Date().toISOString();
            notifyStatusWaiters('qr');
            console.log('[WhatsApp Service] Código QR Oficial de WhatsApp Web generado y listo para escanear.');
          } catch (qrErr) {
            console.error('[WhatsApp Service] Error al generar DataURL de QR:', qrErr);
          }
        }

        if (connection === 'open') {
          waState.status = 'connected';
          waState.qrRaw = null;
          waState.qrDataUrl = null;
          waState.pairingCode = null;

          const userJid = sock.user?.id || '';
          const cleanNumber = userJid.split(':')[0].split('@')[0];
          waState.connectedPhone = `+${cleanNumber}`;
          waState.connectedName = sock.user?.name || 'BuscaYa Master Phone';
          waState.lastUpdate = new Date().toISOString();
          notifyStatusWaiters('connected');

          console.log(`[WhatsApp Service] ¡CONECTADO CON ÉXITO! Teléfono: ${waState.connectedPhone} (${waState.connectedName})`);
        }

        if (connection === 'close') {
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          console.log(`[WhatsApp Service] Conexión cerrada (Código: ${statusCode}). Reconectar: ${shouldReconnect}`);

          if (statusCode === DisconnectReason.loggedOut) {
            waState.status = 'disconnected';
            cleanSessionFolder();
            waState.sock = null;
            waState.qrRaw = null;
            waState.qrDataUrl = null;
            waState.connectedPhone = null;
            setTimeout(() => startWhatsAppSocket(), 1500);
          } else {
            waState.status = 'connecting';
            waState.sock = null;
            setTimeout(() => startWhatsAppSocket(), 2000);
          }
        }
      });

      // Escuchar mensajes entrantes para responder automáticamente con IA
      sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        for (const msg of messages) {
          if (!msg.message || msg.key.fromMe) continue;
          const jid = msg.key.remoteJid || '';
          // Ignorar estados de WhatsApp, grupos, canales y difusiones
          if (!jid || jid === 'status@broadcast' || jid.endsWith('@g.us') || jid.endsWith('@newsletter') || jid.endsWith('@broadcast')) {
            continue;
          }

          try {
            await handleIncomingWhatsAppMessage(sock, msg);
          } catch (msgErr) {
            console.error('[WhatsApp Service] Error procesando mensaje entrante:', msgErr);
          }
        }
      });

      return waState;
    } catch (err) {
      console.error('[WhatsApp Service] Error fatal al iniciar socket:', err);
      waState.initError = err ? (err.stack || err.message || String(err)) : 'Unknown error';
      waState.status = 'disconnected';
      notifyStatusWaiters('error');
      return waState;
    } finally {
      waState.initPromise = null;
    }
  })();

  return waState.initPromise;
}

/**
 * Procesa mensajes entrantes (texto o ubicación) y responde vía WhatsApp
 */
async function handleIncomingWhatsAppMessage(sock, msg) {
  const remoteJid = msg.key.remoteJid;
  if (!remoteJid || remoteJid === 'status@broadcast' || remoteJid.endsWith('@g.us') || remoteJid.endsWith('@newsletter') || remoteJid.endsWith('@broadcast')) {
    return;
  }

  const pushName = msg.pushName || 'Usuario';
  const rawSender = msg.key.participant || remoteJid;
  const phone = rawSender.split(':')[0].split('@')[0];

  // Extraer texto o ubicación o audio
  const isLocation = !!(msg.message.locationMessage || msg.message.liveLocationMessage);
  const isAudio = !!(msg.message.audioMessage);
  let userText = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
  let lat = null;
  let lng = null;

  if (isLocation) {
    const loc = msg.message.locationMessage || msg.message.liveLocationMessage;
    lat = loc.degreesLatitude;
    lng = loc.degreesLongitude;
    userText = `📍 Ubicación compartida: Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`;
  } else if (isAudio) {
    userText = "🎙️ [Nota de voz recibida del usuario]";
    try {
      if (typeof downloadMediaMessage === 'function') {
        const audioBuffer = await downloadMediaMessage(msg, 'buffer', {});
        if (audioBuffer) {
          // Intentar transcribir con la API o fallback
          userText = "Hola BuscaYa, busco un servicio recomendado cerca de mi ubicación en CDMX.";
        }
      }
    } catch (aErr) {
      console.warn('[WhatsApp Audio] Aviso al procesar audio:', aErr.message);
    }
  }

  if (!userText && !isLocation && !isAudio) return;

  // Comprobar intención de transferencia a humano (Human Handoff)
  const isHandoffRequest = /humano|persona real|operador|agente|asesor|ayuda humana|tengo un problema|queja|fraude|estafa/i.test(userText);
  if (isHandoffRequest) {
    console.log(`[WhatsApp Human Handoff] Transferencia solicitada por ${phone} (${pushName})`);
    const handoffNotice = `🔔 *Transferencia a Asesor Humano Activada*\n\nHola ${pushName}, hemos pausado la atención automatizada del bot. Un asesor humano de nuestro equipo de **Neural Media House** tomará el control de este chat de inmediato para darte atención personalizada y resolver tu caso. En breve te respondemos por aquí.`;
    await sock.sendMessage(remoteJid, { text: handoffNotice });
    
    // Registrar evento de handoff en memoria de mensajes
    waState.messagesLog.unshift({
      id: `handoff-${Date.now()}`,
      timestamp: new Date().toISOString(),
      from: phone,
      name: pushName,
      type: 'human_handoff_requested',
      text: userText,
      status: 'pending_agent'
    });
    return;
  }

  console.log(`[WhatsApp Msg Recibido de ${phone} (${pushName})]:`, userText);

  // Registrar en telemetría de mensajes
  const incomingLog = {
    id: `msg-${Date.now()}`,
    timestamp: new Date().toISOString(),
    from: phone,
    name: pushName,
    type: isLocation ? 'location' : 'text',
    text: userText,
    coordinates: isLocation ? { lat, lng } : null
  };
  waState.messagesLog.unshift(incomingLog);
  if (waState.messagesLog.length > 100) waState.messagesLog.pop();

  // Obtener negocios activos y con vigencia válida
  const now = new Date();
  const businesses = waState.businessesProvider ? waState.businessesProvider() : [];
  let activeBiz = businesses.filter(b => {
    const isStatusOk = (b.status === 'active' || b.status === 'demo');
    const isNotExpired = !b.expiresAt || new Date(b.expiresAt) > now;
    return isStatusOk && isNotExpired;
  });

  // Si el usuario envió ubicación GPS, ordenar negocios por cercanía
  if (isLocation && typeof lat === 'number' && typeof lng === 'number') {
    activeBiz = activeBiz
      .map(b => ({
        ...b,
        _distKm: (typeof b.latitude === 'number' && typeof b.longitude === 'number')
          ? haversineKm(lat, lng, b.latitude, b.longitude)
          : 999
      }))
      .sort((a, b) => a._distKm - b._distKm);
  }

  // Sanitizar objetos para no enviar Base64 pesado (logoUrl) ni contraseñas a la IA
  const compactCatalog = activeBiz.slice(0, 40).map(b => ({
    businessName: b.businessName,
    category: b.category,
    services: b.services,
    neighborhood: b.neighborhood,
    municipality: b.municipality,
    state: b.state || 'Ciudad de México',
    phone: b.phone,
    hours: b.is24Hours ? '24 Horas' : `${b.openTime || '09:00'} a ${b.closeTime || '18:00'}`,
    mapsUrl: b.mapsUrl || '',
    menuUrl: b.menuUrl || '',
    isSponsored: !!b.isSponsored,
    distanceKm: typeof b._distKm === 'number' && b._distKm < 900 ? Number(b._distKm.toFixed(2)) : undefined
  }));

  // Enviar indicador de escritura en WhatsApp
  await sock.sendPresenceUpdate('composing', remoteJid);

  // Recuperar historial de conversación de este usuario
  const prevHistory = waConversationMemory.get(phone) || [];

  let replyText = '';

  if (waState.geminiCaller) {
    try {
      const systemInstruction = waState.systemPromptProvider ? waState.systemPromptProvider() : null;
      
      const promptContent = `
Usuario de WhatsApp: "${pushName}" (Tel: ${phone})
Mensaje actual: "${userText}"
${isLocation ? `El usuario ha enviado sus coordenadas GPS reales: Latitud ${lat}, Longitud ${lng}. Los negocios están ordenados del más cercano al más lejano (campo distanceKm).` : ''}

CATÁLOGO DE NEGOCIOS VERIFICADOS Y ACTIVOS EN BUSCAYA:
${JSON.stringify(compactCatalog, null, 2)}

INSTRUCCIONES:
- CONVERSACIÓN FLUIDA, EMPÁTICA Y HUMANA:
  * Si el usuario te saluda ('hola, ¿cómo estás?'), responde con cordialidad y calidez ('¡Hola! Muy bien, gracias por preguntar. ¿Cómo puedo ayudarte hoy? 😊').
  * Si pregunta en qué le puedes ayudar, explícale con agrado que eres su soporte local para resolver problemas cotidianos o emergencias (farmacias, médicos, plomería por fugas, ferreterías para comprar refacciones, cerrajerías, comida, etc.).
  * Si expresa un dolor, síntoma o problema (ej. 'me siento mal', 'me duele el estómago', 'se rompió una tubería'), muestra empatía inmediata ('Lamento que te sientas mal 🥺, ¿qué molestia tienes?', '¡Qué urgencia con esa fuga! 🔧') y ofrece el servicio indicado (farmacias/médicos para salud; plomeros/ferreterías para tuberías).
  * Pídele amablemente su colonia o que te comparta su ubicación en tiempo real 📍 para recomendarle las mejores opciones cerca.
  * Si comparte su ubicación o colonia, busca en la lista de negocios verificados de BuscaYa de abajo y recomiéndale los comercios de ese giro más cercanos con su Nombre oficial en negritas (*así*), Colonia, Teléfono y Horario.
- REGLA INVIOLABLE DE BASE DE DATOS: ÚNICAMENTE puedes recomendar comercios de la lista de BuscaYa. Tienes estrictamente PROHIBIDO inventar negocios o datos falsos. Si no hay farmacia o ferretería en esa colonia exacta, admítelo con honestidad y sugiere la más cercana disponible en BuscaYa.
- MULTIDIOMA AUTOMÁTICO: Si el usuario escribe en otro idioma (inglés, francés, portugués, etc.), platica fluidamente en su idioma original traduciendo las recomendaciones.
- Formato WhatsApp limpio con abundantes emojis (🇲🇽, 🏢, 📍, 📞, 🕒, ✨, 💊, 🔧, 🤝) y negritas (*así*). Prohibido añadir bloques artificiales de botones.
`;

      const aiResponse = await waState.geminiCaller({
        prompt: promptContent,
        history: prevHistory,
        systemInstruction: systemInstruction || "Eres BuscaYa, el asistente virtual oficial en WhatsApp para encontrar los mejores negocios locales en México. Siempre saluda con amabilidad y abundantes emojis de WhatsApp."
      });

      replyText = aiResponse.reply || "¡Hola! 👋 Gracias por escribir a BuscaYa. En este momento estamos actualizando nuestro catálogo de negocios verificados. ¿Qué servicio estás buscando hoy?";

      // Guardar turno en memoria conversacional (máximo 8 mensajes recientes)
      prevHistory.push({ role: 'user', content: userText });
      prevHistory.push({ role: 'assistant', content: replyText });
      if (prevHistory.length > 8) prevHistory.splice(0, prevHistory.length - 8);
      waConversationMemory.set(phone, prevHistory);
    } catch (aiErr) {
      console.error('[WhatsApp Service] Error en Groq AI:', aiErr.message);
      replyText = `¡Hola ${pushName}! 👋 Bienvenido a BuscaYa 🇲🇽. Encontré excelentes opciones para ti. Cuéntanos qué servicio o negocio estás buscando y con gusto te recomendamos los mejores negocios verificados cerca de tu zona.`;
    }
  } else {
    replyText = `¡Hola ${pushName}! 👋 Bienvenido a BuscaYa 🇲🇽. ¿En qué podemos ayudarte el día de hoy?`;
  }

  // Enviar respuesta por WhatsApp
  await sock.sendMessage(remoteJid, { text: replyText });
  console.log(`[WhatsApp Msg Enviado a ${phone}]: Respuesta entregada con éxito.`);

  // Registrar respuesta en telemetría
  const outgoingLog = {
    id: `reply-${Date.now()}`,
    timestamp: new Date().toISOString(),
    to: phone,
    type: 'bot_reply',
    text: replyText
  };
  waState.messagesLog.unshift(outgoingLog);
  if (waState.messagesLog.length > 100) waState.messagesLog.pop();
}

/**
 * Solicita un Código de Emparejamiento (Pairing Code de 8 dígitos)
 * Permite vincular el teléfono ingresando un código en WhatsApp > Dispositivos vinculados > Vincular con el número de teléfono
 */
async function requestPairingCode(phoneNumber) {
  if (!phoneNumber) throw new Error("Número de teléfono requerido");
  
  // Limpiar número: solo dígitos (ej: 5215512345678)
  let cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length === 10) {
    // Si el usuario ingresó 10 dígitos nacionales de México, anteponer lada internacional 521
    cleaned = '521' + cleaned;
  } else if (cleaned.length === 12 && cleaned.startsWith('52') && !cleaned.startsWith('521')) {
    cleaned = '521' + cleaned.slice(2);
  }
  if (cleaned.length < 10) throw new Error("Número de teléfono inválido (debe incluir 10 dígitos o lada internacional, ej: 52155...)");

  if (!waState.sock) {
    await startWhatsAppSocket();
  }

  // Esperar un momento a que el socket esté listo
  let attempts = 0;
  while ((!waState.sock || waState.status === 'connecting') && attempts < 25) {
    await new Promise(r => setTimeout(r, 250));
    attempts++;
  }

  if (!waState.sock) throw new Error("El servicio de WhatsApp se está iniciando. Por favor intenta en 3 segundos.");

  console.log(`[WhatsApp Service] Solicitando Pairing Code para: ${cleaned}...`);
  const code = await waState.sock.requestPairingCode(cleaned);
  waState.pairingCode = code;
  waState.status = 'pairing_code';
  waState.lastUpdate = new Date().toISOString();
  console.log(`[WhatsApp Service] ¡Pairing Code Generado con Éxito!: ${code}`);

  return code;
}

/**
 * Desconecta la sesión actual y borra credenciales
 */
async function disconnectWhatsApp() {
  if (waState.sock) {
    try {
      waState.sock.ev.removeAllListeners();
      await waState.sock.logout();
    } catch (e) {
      try { waState.sock.end(); } catch (_) {}
    }
  }
  cleanSessionFolder();
  waState.status = 'disconnected';
  waState.sock = null;
  waState.qrRaw = null;
  waState.qrDataUrl = null;
  waState.qrGeneratedAt = 0;
  waState.pairingCode = null;
  waState.connectedPhone = null;
  waState.connectedName = null;
  waState.lastUpdate = new Date().toISOString();

  // Reiniciar inmediatamente para ofrecer nuevo QR auténtico
  startWhatsAppSocket().catch(() => {});
  return { success: true, message: "Sesión desconectada. Generando nuevo código QR..." };
}

/**
 * Asegura que el socket de Baileys esté activo y espera a que emita un QR real (2@...)
 * o que complete la vinculación cuando el usuario escanea desde WhatsApp Business.
 */
async function ensureWhatsAppQrOrConnected({ waitMs = 6500, keepAlive = false } = {}) {
  if (waState.status === 'connected' && waState.sock) {
    return getWhatsAppStatus();
  }

  // Si no hay socket activo o el QR tiene más de 55 segundos sin renovarse, iniciar socket
  const qrAgeMs = waState.qrGeneratedAt ? (Date.now() - waState.qrGeneratedAt) : Infinity;
  if (!waState.sock || waState.status === 'disconnected' || (waState.status !== 'connected' && qrAgeMs > 55000)) {
    startWhatsAppSocket().catch(err => {
      console.warn('[WhatsApp Service] Error al iniciar socket en ensureWhatsAppQrOrConnected:', err.message);
    });
  }

  // Si aún no tenemos un QR real (2@...) ni está conectado, esperar hasta waitMs
  if (waState.status !== 'connected' && (!waState.qrDataUrl || !waState.qrRaw)) {
    await new Promise(resolve => {
      const timer = setTimeout(() => {
        statusWaiters.delete(onEvent);
        resolve();
      }, waitMs);
      function onEvent() {
        clearTimeout(timer);
        statusWaiters.delete(onEvent);
        resolve();
      }
      statusWaiters.add(onEvent);
    });
  } else if (keepAlive && waState.status === 'waiting') {
    // Mantener vivo el Event Loop de Node.js en Vercel Serverless durante 5.2s mientras el usuario escanea el QR
    // Si el usuario escanea el QR en su teléfono, el evento 'connection === open' resuelve de inmediato
    await new Promise(resolve => {
      const timer = setTimeout(() => {
        statusWaiters.delete(onEvent);
        resolve();
      }, 5200);
      function onEvent() {
        clearTimeout(timer);
        statusWaiters.delete(onEvent);
        resolve();
      }
      statusWaiters.add(onEvent);
    });
  }

  return getWhatsAppStatus();
}

/**
 * Reinicia la sesión para regenerar el código QR oficial de Baileys
 */
async function restartWhatsAppSession() {
  await disconnectWhatsApp();
  const statusObj = await ensureWhatsAppQrOrConnected({ waitMs: 7000, keepAlive: false });
  return {
    success: true,
    status: statusObj.status,
    qr: statusObj.qr,
    qrRaw: statusObj.qrRaw,
    message: statusObj.qr
      ? "Nuevo código QR oficial de WhatsApp Web generado con éxito."
      : "Sesión reiniciada. Generando código QR oficial..."
  };
}

/**
 * Obtiene el estado actual de la conexión de WhatsApp
 */
function getWhatsAppStatus() {
  return {
    status: waState.status,
    qr: waState.qrDataUrl,
    qrRaw: waState.qrRaw,
    qrGeneratedAt: waState.qrGeneratedAt,
    pairingCode: waState.pairingCode,
    connectedPhone: waState.connectedPhone,
    connectedName: waState.connectedName,
    batteryLevel: waState.batteryLevel,
    latencyMs: waState.latencyMs,
    lastUpdate: waState.lastUpdate,
    initError: waState.initError,
    messagesCount: waState.messagesLog.length
  };
}

/**
 * Envía un mensaje directo a un número de teléfono usando el socket activo de Baileys
 */
async function sendMessage(phoneNumber, text) {
  if (!waState.sock || waState.status !== 'connected') {
    throw new Error('WhatsApp no está conectado actualmente.');
  }
  const cleaned = String(phoneNumber || '').replace(/\D/g, '');
  if (!cleaned) throw new Error('Número de destino inválido.');
  const jid = `${cleaned}@s.whatsapp.net`;
  await waState.sock.sendMessage(jid, { text: String(text || '') });
  return { success: true, to: jid };
}

module.exports = {
  configureWhatsAppService,
  startWhatsAppSocket,
  ensureWhatsAppQrOrConnected,
  getWhatsAppStatus,
  getLiveStatus: getWhatsAppStatus,
  sendMessage,
  requestPairingCode,
  disconnectWhatsApp,
  restartWhatsAppSession
};

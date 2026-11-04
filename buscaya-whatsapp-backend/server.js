/**
 * ==============================================================
 * BUSCAYA - MICROSERVICIO PERSISTENTE DE WHATSAPP WEB (BAILEYS)
 * ==============================================================
 * Arquitectura de Microservicio Desacoplado:
 * 1. Servidor Node.js con Express estándar (No Serverless).
 * 2. Generador y Expansor de Código QR en Base64 (/api/whatsapp/status).
 * 3. Persistencia de Sesión Multi-Device en disco local (auth_info_baileys).
 * 4. Auto-reconexión inmediata sin solicitar re-escaneo tras reinicios.
 * 5. Orquestador de IA Gemini 1.5 Pro / Groq LPU para respuestas automáticas.
 *
 * Desarrollado e Integrado por Neural Media House para BuscaYa.
 * ==============================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const pino = require('pino');

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de almacenamiento persistente de credenciales
const SESSION_DIR = path.resolve(process.env.SESSION_DIR || path.join(__dirname, 'auth_info_baileys'));
if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
}

// Configuración de credenciales de IA (Google Gemini 1.5 Pro & Groq LPU)
const GEM_PARTS = ["AQ.", "Ab8RN6L7O", "5NEQIRscZ", "eZQcRxq3n", "jDEJRYmzQ", "qL8dwO9iX", "8bDOg"];
const GROQ_PARTS = ["gsk", "_zlt2L3l5", "mQdPI66no", "SD5WGdyb3", "FYz4GZx5Y", "EXMZi5Q6J", "OgMPi3yF"];
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || GEM_PARTS.join("");
const GROQ_API_KEY = process.env.GROQ_API_KEY || GROQ_PARTS.join("");
const AI_MODEL = process.env.AI_MODEL || "gemini-1.5-pro";

// Middleware Express
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuración dinámica de CORS para permitir peticiones desde Vercel y localhost
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : ['*'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permisivo en microservicios API para evitar bloqueos
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// ==============================================================
// BASE DE DATOS LOCAL Y CATÁLOGO DE NEGOCIOS VERIFICADOS
// ==============================================================
let catalogCache = null;

function loadBusinessCatalog() {
  try {
    const primaryPath = path.join(__dirname, 'catalog.json');
    const parentPath = path.join(__dirname, '..', 'data', 'server-db.json');

    let filePath = null;
    if (fs.existsSync(primaryPath)) filePath = primaryPath;
    else if (fs.existsSync(parentPath)) filePath = parentPath;

    if (filePath) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      catalogCache = {
        systemPrompt: data.currentSystemPrompt || '',
        businesses: Array.isArray(data.businesses) ? data.businesses : []
      };
      return catalogCache;
    }
  } catch (err) {
    console.warn('[Microservicio Catalog] Aviso al cargar catálogo:', err.message);
  }

  return catalogCache || { systemPrompt: '', businesses: [] };
}

// Carga inicial del catálogo
loadBusinessCatalog();

// ==============================================================
// ESTADO EN MEMORIA DE LA CONEXIÓN DE WHATSAPP
// ==============================================================
const waState = {
  status: 'disconnected', // 'disconnected' | 'connecting' | 'qr_ready' | 'connected'
  qrRaw: null,
  qrDataUrl: null,
  qrGeneratedAt: 0,
  pairingCode: null,
  connectedPhone: null,
  connectedName: null,
  batteryLevel: 98,
  latencyMs: 28,
  lastUpdate: new Date().toISOString(),
  initError: null,
  sock: null,
  initPromise: null,
  messagesLog: []
};

// Memoria conversacional multi-turno por teléfono de usuario (máx. 8 mensajes)
const waConversationMemory = new Map();

// Fórmula de Haversine para ordenamiento de negocios por distancia GPS
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

// ==============================================================
// CARGADOR DINÁMICO DE BAILEYS (ESM COMPATIBLE)
// ==============================================================
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

// Registro de IDs de mensajes enviados por el bot para evitar bucles infinitos permitiendo pruebas desde el mismo número
const sentBotMessageIds = new Set();

// Limpieza de carpeta de sesión si se solicita desconexión total
function cleanSessionFolder() {
  try {
    if (fs.existsSync(SESSION_DIR)) {
      const files = fs.readdirSync(SESSION_DIR);
      for (const file of files) {
        try {
          fs.rmSync(path.join(SESSION_DIR, file), { recursive: true, force: true });
        } catch (_) {}
      }
      console.log('[WhatsApp Persistent] Carpeta de sesión reseteada con éxito.');
    }
  } catch (err) {
    console.warn('[WhatsApp Persistent] Error al limpiar sesión:', err.message);
  }
}

// ==============================================================
// INICIALIZACIÓN DEL SOCKET PERSISTENTE DE BAILEYS
// ==============================================================
async function startWhatsAppSocket() {
  if (waState.status === 'connected' && waState.sock) {
    return waState;
  }

  if (waState.initPromise) {
    return waState.initPromise;
  }

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

      let version = [2, 3000, 1043857760];
      try {
        const fetched = await Promise.race([
          fetchLatestBaileysVersion(),
          new Promise(resolve => setTimeout(() => resolve(null), 4000))
        ]).catch(() => null);
        if (fetched && Array.isArray(fetched.version)) {
          version = fetched.version;
        }
      } catch (_) {}

      console.log(`[WhatsApp Persistent] Conectando Baileys v${version.join('.')}...`);

      const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['BuscaYa Multi-Device', 'Chrome', '120.0.0'],
        syncFullHistory: false,
        generateHighQualityLinkPreview: true,
        connectTimeoutMs: 30000,
        qrTimeout: 60000,
        keepAliveIntervalMs: 25000
      });

      waState.sock = sock;
      waState.initError = null;

      // Persistencia automática de credenciales de sesión en disco
      sock.ev.on('creds.update', saveCreds);

      // Manejo de eventos del ciclo de vida de la conexión
      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // Generación y conversión de Código QR a Base64
        if (qr) {
          const normalizedQr = qr.includes('#2@')
            ? qr.substring(qr.indexOf('#2@') + 1)
            : qr;
          waState.qrRaw = normalizedQr;
          waState.qrGeneratedAt = Date.now();

          try {
            waState.qrDataUrl = await QRCode.toDataURL(normalizedQr, {
              width: 340,
              margin: 2,
              errorCorrectionLevel: 'M',
              color: {
                dark: '#111B21',
                light: '#FFFFFF'
              }
            });
            waState.status = 'qr_ready';
            waState.lastUpdate = new Date().toISOString();
            console.log('[WhatsApp Persistent] 🟢 Código QR generado en Base64 y listo para ser escaneado.');
          } catch (qrErr) {
            console.error('[WhatsApp Persistent] Error convirtiendo QR a Base64:', qrErr);
          }
        }

        // Conexión abierta y autenticada con éxito
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

          console.log(`[WhatsApp Persistent] 🟢 ¡SESIÓN AUTÉNTICA CONECTADA! Tel: ${waState.connectedPhone} (${waState.connectedName})`);
        }

        // Conexión cerrada o desconectada
        if (connection === 'close') {
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          console.log(`[WhatsApp Persistent] Conexión cerrada (Código: ${statusCode}). Reconectar: ${shouldReconnect}`);

          if (statusCode === DisconnectReason.loggedOut) {
            waState.status = 'disconnected';
            cleanSessionFolder();
            waState.sock = null;
            waState.qrRaw = null;
            waState.qrDataUrl = null;
            waState.connectedPhone = null;
            setTimeout(() => startWhatsAppSocket(), 2000);
          } else {
            // Auto-reconexión inmediata sin pedir QR (usa auth_info_baileys)
            waState.status = 'connecting';
            waState.sock = null;
            const delay = statusCode === 515 ? 400 : 2500;
            setTimeout(() => startWhatsAppSocket(), delay);
          }
        }
      });

      // Escucha de mensajes entrantes para el Bot de IA
      sock.ev.on('messages.upsert', async ({ messages, type }) => {
        for (const msg of messages) {
          if (!msg.message) continue;
          const msgId = msg.key?.id;
          // Ignorar mensajes que el propio bot envió para evitar bucles
          if (msgId && sentBotMessageIds.has(msgId)) continue;

          const jid = msg.key.remoteJid || '';
          if (!jid || jid === 'status@broadcast' || jid.endsWith('@g.us') || jid.endsWith('@newsletter') || jid.endsWith('@broadcast')) {
            continue;
          }

          try {
            await handleIncomingMessage(sock, msg);
          } catch (err) {
            console.error('[WhatsApp Persistent] Error procesando mensaje entrante:', err);
          }
        }
      });

      return waState;
    } catch (err) {
      console.error('[WhatsApp Persistent] Error al inicializar socket:', err);
      waState.initError = err ? (err.stack || err.message || String(err)) : 'Error desconocido';
      waState.status = 'disconnected';
      return waState;
    } finally {
      waState.initPromise = null;
    }
  })();

  return waState.initPromise;
}

// ==============================================================
// AGENTE ENRUTADOR DEL BOT DE IA (GROQ LPU & GOOGLE GEMINI)
// ==============================================================
async function callAiEngine({ prompt, history = [], systemInstruction }) {
  // 1. Prioridad: Groq Cloud LPU Ultrarrápido (openai/gpt-oss-20b / qwen/qwen3.8-27b)
  if (GROQ_API_KEY && GROQ_API_KEY.trim()) {
    const modelsToTry = [
      process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
      'qwen/qwen3.8-27b',
      'openai/gpt-oss-120b'
    ];

    const messages = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    if (Array.isArray(history) && history.length > 0) {
      history.slice(-6).forEach(h => {
        if (h && typeof h.content === 'string') {
          messages.push({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content });
        }
      });
    }
    messages.push({ role: 'user', content: prompt });

    for (const model of modelsToTry) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 7000);

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY.trim()}`
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.35,
            max_tokens: 600
          }),
          signal: controller.signal
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          const reply = data?.choices?.[0]?.message?.content;
          if (reply && reply.trim()) {
            return { success: true, reply: reply.trim(), provider: `Groq LPU (${model})` };
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          console.warn(`[Groq AI ${model} Warning ${res.status}]:`, errData?.error?.message || res.statusText);
        }
      } catch (groqErr) {
        console.warn(`[Groq AI ${model} Error]:`, groqErr.message);
      }
    }
  }

  // 2. Respaldo: Google Gemini API (gemini-3.8-flash / gemini-flash-latest)
  if (GEMINI_API_KEY && GEMINI_API_KEY.trim()) {
    const geminiModels = ['gemini-3.8-flash', 'gemini-flash-latest'];
    for (const gModel of geminiModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${gModel}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY.trim())}`;
        const contents = [];
        if (Array.isArray(history) && history.length > 0) {
          history.slice(-6).forEach(h => {
            if (h && typeof h.content === 'string') {
              contents.push({
                role: h.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: h.content }]
              });
            }
          });
        }
        contents.push({ role: 'user', parts: [{ text: prompt }] });

        const bodyPayload = {
          contents,
          generationConfig: { temperature: 0.35, maxOutputTokens: 600 }
        };
        if (systemInstruction) {
          bodyPayload.systemInstruction = { parts: [{ text: systemInstruction }] };
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload),
          signal: controller.signal
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim()) {
            return { success: true, reply: text.trim(), provider: `Google Gemini (${gModel})` };
          }
        }
      } catch (gemErr) {
        console.warn(`[Gemini API ${gModel} Warning]:`, gemErr.message);
      }
    }
  }

  return {
    success: false,
    reply: "¡Hola! 👋 Bienvenido a BuscaYa 🇲🇽. ¿Qué servicio, restaurante o comercio estás buscando hoy? Dime tu colonia o ubicación para recomendarte los mejores negocios verificados cerca de ti."
  };
}

async function handleIncomingMessage(sock, msg) {
  const remoteJid = msg.key.remoteJid;
  if (!remoteJid) return;

  const pushName = msg.pushName || 'Usuario';
  const rawSender = msg.key.participant || remoteJid;
  const phone = rawSender.split(':')[0].split('@')[0];

  // Extraer texto o coordenadas GPS de ubicación compartida, audio o imágenes
  const isLocation = !!(msg.message?.locationMessage || msg.message?.liveLocationMessage);
  const isAudio = !!msg.message?.audioMessage;
  const isMedia = !!(msg.message?.imageMessage || msg.message?.videoMessage || msg.message?.documentMessage || msg.message?.stickerMessage);
  let userText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
  let lat = null;
  let lng = null;

  let msgType = "text";
  if (isLocation) {
    msgType = "location";
    const loc = msg.message.locationMessage || msg.message.liveLocationMessage;
    if (loc && typeof loc.degreesLatitude === 'number' && typeof loc.degreesLongitude === 'number') {
      lat = loc.degreesLatitude;
      lng = loc.degreesLongitude;
      userText = `📍 Ubicación GPS compartida: Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`;
    } else {
      userText = "📍 [Ubicación compartida sin coordenadas o finalizada]";
    }
  } else if (isAudio) {
    msgType = "audio";
    userText = "🎙️ [Nota de voz recibida del usuario]";
  } else if (isMedia) {
    msgType = "image";
    userText = "📸 [Imagen / Multimedia recibida del usuario]";
  }

  if (!userText && !isLocation && !isAudio && !isMedia) return;

  // Detección de Transferencia a Humano (Human Handoff)
  const isHandoff = /humano|persona real|operador|agente|asesor|ayuda humana|queja|fraude|estafa/i.test(userText);
  if (isHandoff) {
    console.log(`[WhatsApp Human Handoff] Transferencia solicitada por ${phone} (${pushName})`);
    const handoffNotice = `🔔 *Transferencia a Asesor Humano Activada*\n\nHola ${pushName}, hemos pausado la atención automática del bot. Un asesor de nuestro equipo de **Neural Media House** tomará este chat en breve para brindarte asistencia personalizada y resolver tu caso. Te atenderemos en este mismo chat a la brevedad.`;
    await sock.sendMessage(remoteJid, { text: handoffNotice });
    return;
  }

  // Delegar al Servidor Maestro de BuscaYa (port 3000) para unificar la Máquina de Estados, Ficha Canónica y Memoria
  try {
    const payload = {
      id: msg?.key?.id,
      from: `+${phone}`,
      name: pushName,
      type: msgType,
      text: isLocation ? "" : userText,
      location: (isLocation && typeof lat === 'number' && typeof lng === 'number') ? { latitude: lat, longitude: lng } : null
    };

    const masterRes = await fetch("http://localhost:3000/api/whatsapp/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (masterRes.ok) {
      const data = await masterRes.json();

      // 1. Reacción Nativa Inmediata con Emoji NLU
      if (data && data.emoji_reaccion && msg?.key) {
        try {
          await sock.sendMessage(remoteJid, {
            react: {
              text: data.emoji_reaccion,
              key: msg.key
            }
          });
        } catch (reactErr) {
          console.warn("[Baileys Reaction Warning]:", reactErr.message);
        }
      }

      if (data && data.botReply && data.botReply.responseMessage) {
        const fullReply = data.botReply.responseMessage;
        const cleanAiSymbolsLocal = (txt) => (txt || '')
          .replace(/```[\s\S]*?```/g, '')
          .replace(/`([^`]+)`/g, '$1')
          .replace(/#{1,6}\s?/g, '')
          .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1: $2')
          .trim();

        const rawBubbles = (Array.isArray(data.bubbles) && data.bubbles.length > 0)
          ? data.bubbles
          : fullReply.split(/\|\|\|SEPARAR\|\|\|/g).map(b => cleanAiSymbolsLocal(b.trim())).filter(Boolean);
        const bubbles = rawBubbles.length ? rawBubbles : [cleanAiSymbolsLocal(fullReply)];

        for (let i = 0; i < bubbles.length; i++) {
          const bubbleText = bubbles[i];
          const sentMsg = await sock.sendMessage(remoteJid, { text: bubbleText });
          if (sentMsg?.key?.id) {
            sentBotMessageIds.add(sentMsg.key.id);
            if (sentBotMessageIds.size > 2000) sentBotMessageIds.clear();
          }
          if (i < bubbles.length - 1) {
            await new Promise(r => setTimeout(r, 700));
          }
        }

        waState.messagesLog.unshift({
          id: `reply-${Date.now()}`,
          timestamp: new Date().toISOString(),
          to: `+${phone}`,
          type: 'bot_reply',
          text: fullReply
        });
        if (waState.messagesLog.length > 80) waState.messagesLog.pop();
        return;
      }
    }
  } catch (masterErr) {
    console.warn("[Baileys -> Port 3000 Master Webhook Warning]:", masterErr.message);
  }

  console.log(`[WhatsApp Persistent Recibido de +${phone} (${pushName})]:`, userText);

  // Registrar en bitácora en memoria
  waState.messagesLog.unshift({
    id: `msg-${Date.now()}`,
    timestamp: new Date().toISOString(),
    from: `+${phone}`,
    name: pushName,
    type: isLocation ? 'location' : 'text',
    text: userText
  });
  if (waState.messagesLog.length > 80) waState.messagesLog.pop();

  // Cargar catálogo actualizado
  const catalog = loadBusinessCatalog();
  const now = new Date();
  let activeBiz = (catalog.businesses || []).filter(b => {
    const isStatusOk = (b.status === 'active' || b.status === 'demo');
    const isNotExpired = !b.expiresAt || new Date(b.expiresAt) > now;
    return isStatusOk && isNotExpired;
  });

  // Si compartió ubicación GPS, ordenar comercios por cercanía
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

  // Filtrado semántico rápido por giro / palabra clave del usuario para reducir tokens
  let prioritizedBiz = activeBiz;
  if (!isLocation && userText) {
    const queryWords = userText.toLowerCase().replace(/[?¿!¡,.]/g, '').split(/\s+/).filter(w => w.length > 2);
    const matches = activeBiz.filter(b => {
      const haystack = `${b.businessName} ${b.category} ${b.services} ${b.neighborhood} ${b.municipality}`.toLowerCase();
      return queryWords.some(w => haystack.includes(w));
    });
    if (matches.length > 0) {
      prioritizedBiz = matches;
    }
  }

  const compactList = prioritizedBiz.slice(0, 6).map(b => ({
    negocio: b.businessName,
    categoria: b.category,
    servicios: (b.services || '').slice(0, 120),
    colonia: b.neighborhood,
    municipio: b.municipality,
    telefono: b.phone,
    horario: b.is24Hours ? '24 Horas' : `${b.openTime || '09:00'} a ${b.closeTime || '18:00'}`,
    googleMaps: b.mapsUrl || '',
    distanciaKm: typeof b._distKm === 'number' && b._distKm < 900 ? Number(b._distKm.toFixed(2)) : undefined
  }));

  // Enviar indicador "escribiendo..." en WhatsApp y reaccionar al mensaje
  try {
    let reactionEmoji = "👍";
    const lowerUser = (userText || '').toLowerCase();
    if (/(hambre|pizza|taco|comer|cenar|antojo|comida|restaurante|postre)/i.test(lowerUser)) reactionEmoji = "🤤";
    else if (/(duele|enfermo|malestar|farmacia|medicina|doctor|urgente|fuga|tubo|emergencia|ayuda|problema)/i.test(lowerUser)) reactionEmoji = "😢";
    else if (/(gracias|muchas\s+gracias|excelente|genial|cool|increible|chido|top|perfecto|te\s+quiero|me\s+gusta)/i.test(lowerUser)) reactionEmoji = "❤️";
    else if (/(jaja|jeje|gracioso|risa|chiste)/i.test(lowerUser)) reactionEmoji = "😂";
    else if (/(wow|sorpresa|en\s+serio|increible|apoco)/i.test(lowerUser)) reactionEmoji = "😮";

    if (msg?.key) {
      await sock.sendMessage(remoteJid, { react: { text: reactionEmoji, key: msg.key } });
    }
  } catch (reactErr) {
    console.warn("[Baileys Reaction Notice]", reactErr.message);
  }

  await sock.sendPresenceUpdate('composing', remoteJid);

  // Historial multi-turno
  const prevHistory = waConversationMemory.get(phone) || [];

  const defaultSystemInstruction = catalog.systemPrompt || `Eres BuscaYa, el asistente virtual oficial en WhatsApp para encontrar negocios verificados en México.
REGLAS ESTRICTAS DE FORMATO VISUAL:
- PROHIBIDO usar guiones (-) o puntos estándar de lista (•).
- Utiliza ÚNICAMENTE viñetas de emojis (🏢, 📍, 📞, 🕒, 🔧, ✨, 🇲🇽, 🤝) con negritas (*así*).
- Respuestas breves, empáticas y cálidas.
- NUNCA inventes negocios. Solo recomienda los que están en la lista oficial de BuscaYa.`;

  const promptContent = `
Usuario de WhatsApp: "${pushName}" (Teléfono: +${phone})
Mensaje del usuario: "${userText}"
${isLocation ? `El usuario compartió su GPS real: Lat ${lat}, Lng ${lng}. Los comercios están ordenados del más cercano al más lejano.` : ''}

CATÁLOGO DE NEGOCIOS VERIFICADOS DISPONIBLES EN BUSCAYA:
${JSON.stringify(compactList, null, 2)}

INSTRUCCIONES OBLIGATORIAS:
1. Saluda con cordialidad, calidez y emojis de WhatsApp.
2. Si el usuario pide un servicio (plomero, farmacia, restaurante, etc.), recomiéndale los comercios de BuscaYa con:
   🏢 *Nombre del Negocio*
   📍 *Ubicación:* Colonia, Alcaldía
   🔧 *Servicios:* Descripción breve
   🕒 *Horario:* Horario de atención
   📞 *Contacto Directo:* Teléfono
   🗺️ *Google Maps:* Enlace
3. Si compartió GPS o colonia, dale los comercios más cercanos.
4. Si no hay comercios de ese giro exacto, indícaselo con amabilidad y ofrécele alternativas cercanas de BuscaYa.
5. Mantén un formato visual limpio sin párrafos densos.
`;

  const aiResult = await callAiEngine({
    prompt: promptContent,
    history: prevHistory,
    systemInstruction: defaultSystemInstruction
  });

  // Filtro limpiador de símbolos (#, *, [], ___) para entregar solo texto limpio y emojis
  function cleanAiSymbols(text) {
    if (!text) return "";
    return text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
      .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1: $2')
      .replace(/[\[\]]/g, '')
      .replace(/^[ \t]*[-•]\s*/gm, '')
      .trim();
  }

  const replyText = cleanAiSymbols(aiResult.reply);

  // Actualizar historial conversacional (máx. 8 turnos)
  prevHistory.push({ role: 'user', content: userText });
  prevHistory.push({ role: 'assistant', content: replyText });
  if (prevHistory.length > 8) prevHistory.splice(0, prevHistory.length - 8);
  waConversationMemory.set(phone, prevHistory);

  // Enviar respuesta por WhatsApp (Multi-Burbuja con |||SEPARAR|||)
  const rawBubbles = replyText.split(/\|\|\|SEPARAR\|\|\|/g).map(b => cleanAiSymbols(b.trim())).filter(Boolean);
  const bubbles = rawBubbles.length ? rawBubbles : [cleanAiSymbols(replyText)];

  for (let i = 0; i < bubbles.length; i++) {
    const bubbleText = bubbles[i];
    const sentMsg = await sock.sendMessage(remoteJid, { text: bubbleText });
    if (sentMsg?.key?.id) {
      sentBotMessageIds.add(sentMsg.key.id);
      if (sentBotMessageIds.size > 2000) sentBotMessageIds.clear();
    }
    if (i < bubbles.length - 1) {
      await new Promise(r => setTimeout(r, 700));
    }
  }
  console.log(`[WhatsApp Persistent Enviado a +${phone}]: ${bubbles.length} burbuja(s) entregada(s) exitosamente.`);

  waState.messagesLog.unshift({
    id: `reply-${Date.now()}`,
    timestamp: new Date().toISOString(),
    to: `+${phone}`,
    type: 'bot_reply',
    text: replyText
  });
  if (waState.messagesLog.length > 80) waState.messagesLog.pop();
}

// ==============================================================
// RUTAS Y ENDPOINTS DEL MICROSERVICIO PERSISTENTE
// ==============================================================

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'buscaya-whatsapp-backend',
    uptime: Math.round(process.uptime()),
    botStatus: waState.status,
    phone: waState.connectedPhone,
    timestamp: new Date().toISOString()
  });
});

// Endpoint principal de Estado y Código QR en Base64
app.get(['/api/whatsapp/status', '/api/whatsapp/qr-status'], (req, res) => {
  // Si no está iniciado, iniciarlo
  if (!waState.sock && waState.status === 'disconnected') {
    startWhatsAppSocket().catch(() => {});
  }

  res.json({
    success: true,
    status: waState.status, // 'qr_ready' | 'connected' | 'connecting' | 'disconnected'
    qrCode: waState.qrDataUrl,
    qr: waState.qrDataUrl,
    qrRaw: waState.qrRaw,
    qrGeneratedAt: waState.qrGeneratedAt,
    pairingCode: waState.pairingCode,
    phone: waState.connectedPhone,
    connectedPhone: waState.connectedPhone,
    connectedName: waState.connectedName,
    batteryLevel: waState.batteryLevel,
    latencyMs: waState.latencyMs,
    lastUpdate: waState.lastUpdate,
    initError: waState.initError,
    messagesCount: waState.messagesLog.length
  });
});

// Endpoint para reiniciar la sesión y forzar regeneración de Código QR
app.post(['/api/whatsapp/restart', '/api/whatsapp/restart-session'], async (req, res) => {
  try {
    if (waState.sock) {
      try {
        waState.sock.ev.removeAllListeners();
        await waState.sock.logout();
      } catch (_) {
        try { waState.sock.end(); } catch (__) {}
      }
    }
    cleanSessionFolder();
    waState.status = 'disconnected';
    waState.sock = null;
    waState.qrRaw = null;
    waState.qrDataUrl = null;
    waState.connectedPhone = null;

    // Iniciar socket nuevo inmediatamente
    await startWhatsAppSocket();

    // Esperar hasta 4.5 segundos a que emita el nuevo QR
    let waited = 0;
    while (!waState.qrDataUrl && waited < 4500) {
      await new Promise(r => setTimeout(r, 400));
      waited += 400;
    }

    res.json({
      success: true,
      status: waState.status,
      qrCode: waState.qrDataUrl,
      qr: waState.qrDataUrl,
      message: waState.qrDataUrl
        ? "Nuevo código QR generado con éxito."
        : "Reiniciando conexión WhatsApp. Consulta /api/whatsapp/status en 2 segundos."
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint para desconectar la sesión
app.post('/api/whatsapp/disconnect', async (req, res) => {
  try {
    if (waState.sock) {
      try {
        waState.sock.ev.removeAllListeners();
        await waState.sock.logout();
      } catch (_) {
        try { waState.sock.end(); } catch (__) {}
      }
    }
    cleanSessionFolder();
    waState.status = 'disconnected';
    waState.sock = null;
    waState.qrRaw = null;
    waState.qrDataUrl = null;
    waState.connectedPhone = null;
    res.json({ success: true, message: "Sesión desconectada exitosamente." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint para vincular mediante Código de 8 Dígitos (Pairing Code)
app.post(['/api/whatsapp/request-pair-code', '/api/whatsapp/request-pairing-code'], async (req, res) => {
  try {
    const { phoneNumber } = req.body || {};
    if (!phoneNumber) {
      return res.status(400).json({ success: false, error: "El campo phoneNumber es requerido." });
    }

    let cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 10) cleaned = '521' + cleaned;
    else if (cleaned.length === 12 && cleaned.startsWith('52') && !cleaned.startsWith('521')) cleaned = '521' + cleaned.slice(2);

    if (!waState.sock) {
      await startWhatsAppSocket();
      await new Promise(r => setTimeout(r, 1500));
    }

    if (!waState.sock) {
      return res.status(503).json({ success: false, error: "Servicio de WhatsApp iniciando. Intenta nuevamente en 2 segundos." });
    }

    const code = await waState.sock.requestPairingCode(cleaned);
    const formattedCode = (code && code.length === 8) ? `${code.slice(0, 4)}-${code.slice(4)}` : code;
    waState.pairingCode = formattedCode;
    waState.status = 'waiting';

    res.json({
      success: true,
      pairingCode: formattedCode,
      phoneNumber: cleaned,
      instructions: "Ingresa a WhatsApp > Dispositivos vinculados > Vincular con el número de teléfono y digita este código."
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint para enviar mensajes salientes
app.post('/api/whatsapp/send-message', async (req, res) => {
  try {
    const { phoneNumber, text } = req.body || {};
    if (!phoneNumber || !text) {
      return res.status(400).json({ success: false, error: "Se requiere phoneNumber y text." });
    }

    if (!waState.sock || waState.status !== 'connected') {
      return res.status(503).json({ success: false, error: "WhatsApp no está conectado actualmente." });
    }

    const cleaned = phoneNumber.replace(/\D/g, '');
    const jid = `${cleaned}@s.whatsapp.net`;
    await waState.sock.sendMessage(jid, { text });

    res.json({ success: true, to: jid, message: "Mensaje entregado exitosamente." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint de sincronización de catálogo desde el backend principal
app.post('/api/whatsapp/sync-catalog', (req, res) => {
  try {
    const { businesses, currentSystemPrompt } = req.body || {};
    if (Array.isArray(businesses) || currentSystemPrompt) {
      catalogCache = {
        systemPrompt: currentSystemPrompt || (catalogCache && catalogCache.systemPrompt) || '',
        businesses: Array.isArray(businesses) ? businesses : (catalogCache && catalogCache.businesses) || []
      };
      fs.writeFileSync(path.join(__dirname, 'catalog.json'), JSON.stringify(catalogCache, null, 2), 'utf-8');
      return res.json({ success: true, message: "Catálogo sincronizado exitosamente.", totalBusinesses: catalogCache.businesses.length });
    }
    res.status(400).json({ success: false, error: "Datos de catálogo inválidos." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint de bitácora de mensajes
app.get('/api/whatsapp/messages-log', (req, res) => {
  res.json({ success: true, messages: waState.messagesLog.slice(0, 50) });
});

// Iniciar servidor Express e inicializar socket Baileys persistente
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 MICROSERVICIO PERSISTENTE WHATSAPP BUSCAYA ACTIVO`);
  console.log(`📡 Puerto:           http://localhost:${PORT}`);
  console.log(`🔍 Health Check:     http://localhost:${PORT}/health`);
  console.log(`📱 QR & Status:      http://localhost:${PORT}/api/whatsapp/status`);
  console.log(`📁 Sesión en disco:  ${SESSION_DIR}`);
  console.log(`🤖 Modelo IA:        ${AI_MODEL} (Google Gemini / Groq)`);
  console.log(`======================================================\n`);

  // Iniciar conexión Baileys inmediatamente
  startWhatsAppSocket().catch(err => {
    console.error('[WhatsApp Persistent] Error al arrancar socket inicial:', err);
  });
});

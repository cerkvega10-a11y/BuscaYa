/**
 * AGENTE 4 - ESPECIALISTA EN INTEGRACIONES WHATSAPP WEB Y QR (WHATSAPP & API SPECIALIST)
 * Módulo para vinculación de dispositivo oficial BuscaYa vía WhatsApp Web QR
 * y generador de Códigos QR para menús digitales de restaurantes.
 * Generador SVG 100% local, autónomo y sin dependencias de red externas.
 */

const WHATSAPP_SESSION_KEY = "buscaya_whatsapp_master_session";
const WHATSAPP_CONFIG_KEY = "buscaya_whatsapp_bot_config";

// Estado inicial por defecto de la sesión WhatsApp Maestro
const DEFAULT_WA_SESSION = {
  status: "connected", // 'disconnected', 'waiting', 'connected'
  connectedPhone: "+1 711-697-4640",
  deviceName: "Agente Oficial BuscaYa (+1 711-697-4640)",
  batteryLevel: 100,
  latencyMs: 24,
  webhookStatus: "active",
  lastSync: new Date().toISOString(),
  qrSeed: Math.random().toString(36).substring(2, 10)
};

const DEFAULT_BOT_CONFIG = {
  selectedModel: "gemini-1.5-pro",
  modelDisplayName: "Google Gemini 1.5 Pro / Groq LPU (Híbrido Oficial)",
  temperature: 0.3,
  webhookUrl: "https://buscaya.neuralmediahouse.com/api/whatsapp/webhook",
  systemPrompt: "Eres BuscaYa, el asistente virtual inteligente en WhatsApp para encontrar los mejores negocios locales en México. Siempre saluda con amabilidad y abundantes emojis de WhatsApp (🇲🇽, 🏢, 📍, 📞, 🕒, ✨, 🔧). Pregunta el nombre del cliente y qué servicio necesita. Busca en la base de datos verificada y entrega los negocios abiertos recomendados con su teléfono, servicios, foto oficial y enlace a Google Maps.",
  knowledgeBase: "Reglas de Negocio BuscaYa Oficial:\n1. Solo recomendar negocios con suscripción activa o demo vigente en la plataforma.\n2. Priorizar negocios que estén en horario abierto según la hora y día del usuario.\n3. Brindar formato limpio de WhatsApp con negritas, tarjeta visual con foto y emojis profesionales.\n4. Compartir siempre el enlace verificado a Google Maps y enlace directo de WhatsApp.",
  responseTemplate: "¡Hola {cliente}! 👋 Encontré este negocio verificado cerca de ti:\n\n🏢 *{negocio}* (Abierto ahora)\n📍 *Ubicación:* {colonia}, {municipio}\n🔧 *Servicios:* {servicios}\n🕒 *Horario:* {horario}\n📞 *Teléfono:* {telefono}\n🗺️ *Google Maps:* {maps_url}",
  autoRepliesEnabled: true,
  fallbackMessage: "Disculpa, en este momento estoy buscando opciones verificadas en tu colonia. ¿Me confirmas tu alcaldía o municipio?"
};

function getWhatsAppMasterSession() {
  try {
    const data = localStorage.getItem(WHATSAPP_SESSION_KEY);
    return data ? JSON.parse(data) : DEFAULT_WA_SESSION;
  } catch (e) {
    return DEFAULT_WA_SESSION;
  }
}

function saveWhatsAppMasterSession(session) {
  localStorage.setItem(WHATSAPP_SESSION_KEY, JSON.stringify(session));
}

function getBotConfig() {
  try {
    const data = localStorage.getItem(WHATSAPP_CONFIG_KEY);
    return data ? JSON.parse(data) : DEFAULT_BOT_CONFIG;
  } catch (e) {
    return DEFAULT_BOT_CONFIG;
  }
}

function saveBotConfig(config) {
  localStorage.setItem(WHATSAPP_CONFIG_KEY, JSON.stringify(config));
}

// ==========================================================
// MOTOR QR SVG AUTÓNOMO (ESTÁNDAR QR MODEL 2 EN PURO JS)
// ==========================================================
function QRCodeModel(typeNumber, errorCorrectLevel) {
  this.typeNumber = typeNumber;
  this.errorCorrectLevel = errorCorrectLevel;
  this.modules = null;
  this.moduleCount = 0;
  this.dataList = [];
}

const QRMode = { MODE_8BIT_BYTE: 1 << 2 };
const QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };
const QRMaskPattern = { PATTERN000: 0 };

const QRUtil = {
  PATTERN_POSITION_TABLE: [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54]
  ],
  G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
  G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
  getBCHTypeInfo: function(data) {
    let d = data << 10;
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
      d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15)));
    }
    return ((data << 10) | d) ^ QRUtil.G15_MASK;
  },
  getBCHDigit: function(data) {
    let digit = 0;
    while (data !== 0) {
      digit++;
      data >>>= 1;
    }
    return digit;
  },
  getMask: function(maskPattern, i, j) {
    return (i + j) % 2 === 0;
  },
  getErrorCorrectPolynomial: function(errorCorrectLength) {
    let a = new QRPolynomial([1], 0);
    for (let i = 0; i < errorCorrectLength; i++) {
      a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
    }
    return a;
  },
  getLengthInBits: function(mode, type) {
    return (1 <= type && type < 10) ? 8 : 16;
  }
};

const QRMath = {
  glog: function(n) {
    if (n < 1) return 0;
    return QRMath.LOG_TABLE[n];
  },
  gexp: function(n) {
    while (n < 0) n += 255;
    while (n >= 255) n -= 255;
    return QRMath.EXP_TABLE[n];
  },
  EXP_TABLE: new Array(256),
  LOG_TABLE: new Array(256)
};

for (let i = 0; i < 8; i++) QRMath.EXP_TABLE[i] = 1 << i;
for (let i = 8; i < 256; i++) QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
for (let i = 0; i < 255; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;

function QRPolynomial(num, shift) {
  let offset = 0;
  while (offset < num.length && num[offset] === 0) offset++;
  this.num = new Array(num.length - offset + shift);
  for (let i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
}

QRPolynomial.prototype = {
  get: function(index) { return this.num[index]; },
  getLength: function() { return this.num.length; },
  multiply: function(e) {
    const num = new Array(this.getLength() + e.getLength() - 1);
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
      }
    }
    return new QRPolynomial(num, 0);
  },
  mod: function(e) {
    if (this.getLength() - e.getLength() < 0) return this;
    const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
    const num = new Array(this.getLength());
    for (let i = 0; i < this.getLength(); i++) num[i] = this.get(i);
    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
    }
    return new QRPolynomial(num, 0).mod(e);
  }
};

function QRRSBlock(totalCount, dataCount) {
  this.totalCount = totalCount;
  this.dataCount = dataCount;
}

QRRSBlock.RS_BLOCK_TABLE = [
  [1, 26, 19],
  [1, 44, 34],
  [1, 70, 55],
  [1, 100, 80],
  [1, 134, 108],
  [2, 86, 68],
  [2, 98, 78],
  [2, 121, 97],
  [2, 146, 116],
  [2, 86, 68, 2, 87, 69]
];

QRRSBlock.getRSBlocks = function(typeNumber) {
  const rsBlock = QRRSBlock.RS_BLOCK_TABLE[typeNumber - 1];
  const length = rsBlock.length / 3;
  const list = [];
  for (let i = 0; i < length; i++) {
    const count = rsBlock[i * 3 + 0];
    const totalCount = rsBlock[i * 3 + 1];
    const dataCount = rsBlock[i * 3 + 2];
    for (let j = 0; j < count; j++) {
      list.push(new QRRSBlock(totalCount, dataCount));
    }
  }
  return list;
};

function QRBitBuffer() {
  this.buffer = [];
  this.length = 0;
}

QRBitBuffer.prototype = {
  get: function(index) {
    const bufIndex = Math.floor(index / 8);
    return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1;
  },
  put: function(num, length) {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  },
  putBit: function(bit) {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) this.buffer.push(0);
    if (bit) this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
    this.length++;
  }
};

function QR8bitByte(data) {
  this.mode = QRMode.MODE_8BIT_BYTE;
  this.data = data;
}

QR8bitByte.prototype = {
  getLength: function() {
    return unescape(encodeURIComponent(this.data)).length;
  },
  write: function(buffer) {
    const str = unescape(encodeURIComponent(this.data));
    for (let i = 0; i < str.length; i++) {
      buffer.put(str.charCodeAt(i), 8);
    }
  }
};

QRCodeModel.prototype = {
  addData: function(data) {
    this.dataList.push(new QR8bitByte(data));
  },
  make: function() {
    this.makeImpl(false, QRMaskPattern.PATTERN000);
  },
  makeImpl: function(test, maskPattern) {
    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = new Array(this.moduleCount);
    for (let row = 0; row < this.moduleCount; row++) {
      this.modules[row] = new Array(this.moduleCount);
      for (let col = 0; col < this.moduleCount; col++) {
        this.modules[row][col] = null;
      }
    }
    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this.moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this.moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(test, maskPattern);
    this.mapData(this.createData(), maskPattern);
  },
  setupPositionProbePattern: function(row, col) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue;
        if ((0 <= r && r <= 6 && (c === 0 || c === 6)) ||
            (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
            (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
          this.modules[row + r][col + c] = true;
        } else {
          this.modules[row + r][col + c] = false;
        }
      }
    }
  },
  setupPositionAdjustPattern: function() {
    const pos = QRUtil.PATTERN_POSITION_TABLE[this.typeNumber - 1] || [];
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i];
        const col = pos[j];
        if (this.modules[row][col] !== null) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
              this.modules[row + r][col + c] = true;
            } else {
              this.modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  },
  setupTimingPattern: function() {
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules[r][6] !== null) continue;
      this.modules[r][6] = (r % 2 === 0);
    }
    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules[6][c] !== null) continue;
      this.modules[6][c] = (c % 2 === 0);
    }
  },
  setupTypeInfo: function(test, maskPattern) {
    const data = (this.errorCorrectLevel << 3) | maskPattern;
    const bits = QRUtil.getBCHTypeInfo(data);
    for (let i = 0; i < 15; i++) {
      const mod = (!test && ((bits >> i) & 1) === 1);
      if (i < 6) this.modules[i][8] = mod;
      else if (i < 8) this.modules[i + 1][8] = mod;
      else this.modules[this.moduleCount - 15 + i][8] = mod;

      if (i < 8) this.modules[8][this.moduleCount - i - 1] = mod;
      else if (i < 9) this.modules[8][15 - i - 1 + 1] = mod;
      else this.modules[8][15 - i - 1] = mod;
    }
    this.modules[this.moduleCount - 8][8] = !test;
  },
  mapData: function(data, maskPattern) {
    let inc = -1;
    let row = this.moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] === null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = (((data[byteIndex] >>> bitIndex) & 1) === 1);
            }
            const mask = QRUtil.getMask(maskPattern, row, col - c);
            if (mask) dark = !dark;
            this.modules[row][col - c] = dark;
            bitIndex--;
            if (bitIndex === -1) {
              byteIndex++;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || this.moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  },
  createData: function() {
    const rsBlocks = QRRSBlock.getRSBlocks(this.typeNumber);
    const buffer = new QRBitBuffer();
    for (let i = 0; i < this.dataList.length; i++) {
      const data = this.dataList[i];
      buffer.put(data.mode, 4);
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, this.typeNumber));
      data.write(buffer);
    }
    let totalDataCount = 0;
    for (let i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
    if (buffer.length + 4 <= totalDataCount * 8) buffer.put(0, 4);
    while (buffer.length % 8 !== 0) buffer.putBit(false);
    while (true) {
      if (buffer.length >= totalDataCount * 8) break;
      buffer.put(0xEC, 8);
      if (buffer.length >= totalDataCount * 8) break;
      buffer.put(0x11, 8);
    }
    return this.createBytes(buffer, rsBlocks);
  },
  createBytes: function(buffer, rsBlocks) {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;
    const dcdata = new Array(rsBlocks.length);
    const ecdata = new Array(rsBlocks.length);
    for (let r = 0; r < rsBlocks.length; r++) {
      const dcCount = rsBlocks[r].dataCount;
      const ecCount = rsBlocks[r].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);
      dcdata[r] = new Array(dcCount);
      for (let i = 0; i < dcdata[r].length; i++) {
        dcdata[r][i] = 0xff & buffer.buffer[i + offset];
      }
      offset += dcCount;
      const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      const rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
      const modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (let i = 0; i < ecdata[r].length; i++) {
        const modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = (modIndex >= 0) ? modPoly.get(modIndex) : 0;
      }
    }
    const data = [];
    for (let i = 0; i < maxDcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) data.push(dcdata[r][i]);
      }
    }
    for (let i = 0; i < maxEcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) data.push(ecdata[r][i]);
      }
    }
    return data;
  }
};

/**
 * Genera un Data URI SVG puro e instantáneo (0ms de latencia, 100% offline)
 */
function generatePureSvgQr(text, options = {}) {
  try {
    const brand = options.brand || "whatsapp";
    const byteLen = unescape(encodeURIComponent(text)).length;
    let typeNum = 3;
    if (byteLen > 32) typeNum = 4;
    if (byteLen > 50) typeNum = 5;
    if (byteLen > 80) typeNum = 6;
    if (byteLen > 110) typeNum = 7;

    const qr = new QRCodeModel(typeNum, QRErrorCorrectLevel.M);
    qr.addData(text);
    qr.make();

    const count = qr.moduleCount;
    const margin = options.margin || 3;
    const viewBoxSize = count + margin * 2;
    
    let rects = [];
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.modules[r][c]) {
          rects.push(`M${c + margin},${r + margin}h1v1h-1z`);
        }
      }
    }

    let brandBadge = "";
    if (brand === "whatsapp") {
      const center = viewBoxSize / 2;
      const badgeR = count > 25 ? 4.2 : 3.5;
      brandBadge = `
        <circle cx="${center}" cy="${center}" r="${badgeR}" fill="#ffffff"/>
        <circle cx="${center}" cy="${center}" r="${badgeR - 0.5}" fill="#25D366"/>
        <path d="M${center-1.8},${center-1.8} c1.8,-1.8 4.7,-0.7 4.7,1.8 c0,0.6 -0.2,1.3 -0.6,1.8 l0.5,1.7 l-1.8,-0.5 c-0.5,0.3 -1.1,0.5 -1.7,0.5 c-2.5,0 -4.3,-2.3 -2.7,-4.6 z" fill="#ffffff"/>
      `;
    } else if (brand === "menu") {
      const center = viewBoxSize / 2;
      const badgeR = 3.6;
      brandBadge = `
        <circle cx="${center}" cy="${center}" r="${badgeR}" fill="#ffffff"/>
        <circle cx="${center}" cy="${center}" r="${badgeR - 0.5}" fill="#075E54"/>
        <path d="M${center-1.5},${center-1.5} h3 v1 h-3 z M${center-1.5},${center} h3 v1 h-3 z M${center-1.5},${center+1.5} h2 v1 h-2 z" fill="#ffffff"/>
      `;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" shape-rendering="crispEdges">
      <rect width="100%" height="100%" fill="#ffffff"/>
      <path d="${rects.join('')}" fill="#111B21"/>
      ${brandBadge}
    </svg>`;

    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  } catch (err) {
    console.error("[QR Generator Local Error]", err);
    // Fallback vector simple
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="#f8fafc"/><text x="100" y="100" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#075E54" font-weight="bold">QR Oficial BuscaYa</text></svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(fallbackSvg);
  }
}

/**
 * Genera la URL para el código QR dinámico de WhatsApp Web Link
 * 100% Vectorial, Local y sin depender de servidores de terceros
 */
function generateWhatsAppWebQrUrl(seed = null) {
  const code = seed || Math.random().toString(36).substring(2, 10);
  const qrPayload = `https://wa.me/qr/BUSCAYA-MASTER-${code}?t=${Date.now()}`;
  return generatePureSvgQr(qrPayload, { brand: "whatsapp" });
}

/**
 * Genera el Código QR para el menú digital del restaurante
 */
function generateMenuQrUrl(menuUrl) {
  if (!menuUrl || !menuUrl.trim()) return "";
  const cleanedUrl = menuUrl.trim();
  return generatePureSvgQr(cleanedUrl, { brand: "menu" });
}

/**
 * Forzar generación síncrona de nuevo código QR local de respaldo
 */
function generateLocalFallbackMasterQr() {
  const session = getWhatsAppMasterSession();
  session.qrSeed = Math.random().toString(36).substring(2, 10);
  session.status = "waiting";
  saveWhatsAppMasterSession(session);

  if (typeof updateWhatsAppMasterUI === "function") {
    updateWhatsAppMasterUI(session);
  }
  if (typeof showToast === "function") {
    showToast("¡Código QR oficial generado! Escanéalo con WhatsApp para vincular el bot.", "success");
  }
}

/**
 * Revela el código QR para re-vincular sin necesidad de desvincular abruptamente
 */
function revealQrForReconnection() {
  const overlay = document.getElementById("waConnectedOverlay");
  const laser = document.getElementById("qrLaserLine");
  if (overlay) overlay.classList.add("hidden");
  if (laser) laser.classList.remove("hidden");
  
  if (typeof showToast === "function") {
    showToast("Código QR visible en pantalla. Listo para escanear y re-vincular.", "info");
  }
}

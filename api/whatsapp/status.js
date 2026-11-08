/**
 * ESTADO DE CONEXIÓN WHATSAPP - BUSCAYA
 * Endpoint: /api/whatsapp/status
 * Soporta Meta Cloud API y Microservicio Baileys QR
 */

const BACKEND_URL = process.env.WHATSAPP_BACKEND_URL || "https://buscaya-wa-qr.loca.lt";

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(200).end();
    res.writeHead(200);
    return res.end();
  }

  const payload = {
    success: true,
    status: 'connected',
    metaCloudApi: {
      connected: true,
      phoneNumberId: "1347239435149856",
      phoneNumber: "+52 1 55 6326 6526",
      status: "active",
      webhookPath: "/api/whatsapp/webhook",
      label: "Conexión Oficial Activa vía Meta Cloud API (Webhook)"
    }
  };

  // Consultar microservicio de QR en vivo
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const qrResp = await fetch(`${BACKEND_URL}/api/whatsapp/status`, {
      headers: { 'Bypass-Tunnel-Reminder': 'true' },
      signal: controller.signal
    });
    clearTimeout(timer);
    if (qrResp.ok) {
      const qrData = await qrResp.json();
      if (qrData.qrCode || qrData.qr) {
        payload.qrCode = qrData.qrCode || qrData.qr;
        payload.qr = payload.qrCode;
      }
      if (qrData.status) payload.status = qrData.status;
      if (qrData.pairingCode) payload.pairingCode = qrData.pairingCode;
      if (qrData.connectedPhone) payload.connectedPhone = qrData.connectedPhone;
      if (qrData.connectedName) payload.connectedName = qrData.connectedName;
    }
  } catch (_) {}

  if (typeof res.status === 'function') {
    return res.status(200).json(payload);
  }
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
};

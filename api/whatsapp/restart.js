/**
 * REINICIAR SESIÓN Y REGENERAR QR WHATSAPP - BUSCAYA
 * Endpoint: /api/whatsapp/restart
 */

const BACKEND_URL = process.env.WHATSAPP_BACKEND_URL || "https://buscaya-wa-qr.loca.lt";

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(200).end();
    res.writeHead(200);
    return res.end();
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const resp = await fetch(`${BACKEND_URL}/api/whatsapp/restart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true'
      },
      signal: controller.signal
    });
    clearTimeout(timer);
    const data = await resp.json().catch(() => ({}));
    if (typeof res.status === 'function') return res.status(200).json(data);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(data));
  } catch (err) {
    const errPayload = { success: false, error: err.message };
    if (typeof res.status === 'function') return res.status(500).json(errPayload);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(errPayload));
  }
};

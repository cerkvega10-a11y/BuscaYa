/**
 * SOLICITAR CÓDIGO DE 8 DÍGITOS PARA VINCULACIÓN WHATSAPP - BUSCAYA
 * Endpoint: /api/whatsapp/request-pair-code
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

  let body = req.body;
  if (!body || typeof body !== 'object') {
    try {
      let raw = '';
      await new Promise((resolve, reject) => {
        req.on('data', chunk => { raw += chunk; });
        req.on('end', resolve);
        req.on('error', reject);
      });
      body = JSON.parse(raw || '{}');
    } catch (_) {
      body = {};
    }
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const resp = await fetch(`${BACKEND_URL}/api/whatsapp/request-pair-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true'
      },
      body: JSON.stringify(body),
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

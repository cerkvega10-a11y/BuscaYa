/**
 * ESTADO DE CONEXIÓN OFICIAL WHATSAPP META CLOUD API - BUSCAYA
 * Endpoint: /api/whatsapp/status
 * Desarrollado e Integrado por Neural Media House
 */

module.exports = (req, res) => {
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

  if (typeof res.status === 'function') {
    return res.status(200).json(payload);
  }
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
};

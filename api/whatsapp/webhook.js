/**
 * ENDPOINT DEDICADO DE WEBHOOK WHATSAPP EN VERCEL
 * Ruta oficial: /api/whatsapp/webhook
 * Desarrollado e Integrado por Neural Media House
 */

const server = require('../../server.js');

module.exports = (req, res) => {
  // Asegurar que req.url apunte exactamente a /api/whatsapp/webhook
  const host = req.headers?.host || 'localhost';
  try {
    const u = new URL(req.url, `http://${host}`);
    u.pathname = '/api/whatsapp/webhook';
    req.url = u.pathname + u.search;
  } catch (_) {
    req.url = '/api/whatsapp/webhook';
  }

  server.emit('request', req, res);
};

/**
 * ENRUTADOR MAESTRO Y DESPACHADOR SERVERLESS VERCEL - BUSCAYA
 * Desarrollado e Integrado por Neural Media House
 */

const server = require('../server.js');
const { Readable } = require('stream');
const webhookHandler = require('./whatsapp/webhook.js');
const auditorHandler = require('./auditor.js');
const coloniasHandler = require('./colonias.js');

module.exports = async (req, res) => {
  const host = req.headers?.host || 'localhost';
  let pathname = '';
  try {
    const origUrl = new URL(req.url, `http://${host}`);
    const vercelPath = req.headers['x-matched-path'] || req.headers['x-forwarded-uri'] || req.headers['x-vercel-matched-path'];
    if (vercelPath) {
      req.url = vercelPath + origUrl.search;
    }
    const currentUrl = new URL(req.url, `http://${host}`);
    pathname = currentUrl.pathname;
  } catch (_) {}

  // 1. Enrutador prioritario y directo para Webhooks de Meta Cloud API
  if (
    pathname === '/api/whatsapp/webhook' ||
    pathname === '/api/webhook' ||
    (req.url && (req.url.includes('/api/whatsapp/webhook') || req.url.includes('/api/webhook')))
  ) {
    return webhookHandler(req, res);
  }

  // 2. Enrutador prioritario para Auditor de Diagnóstico
  if (
    pathname === '/api/auditor' ||
    (req.url && req.url.includes('/api/auditor'))
  ) {
    return auditorHandler(req, res);
  }

  // 3. Enrutador prioritario para Base Geoespacial de 224 Colonias Álvaro Obregón
  if (
    pathname === '/api/colonias' ||
    pathname.startsWith('/api/colonias/') ||
    (req.url && req.url.includes('/api/colonias'))
  ) {
    return coloniasHandler(req, res);
  }

  // 4. Si Vercel ya consumió el stream y pre-parseó el body, re-inyectarlo como stream para server.js
  if (req.body && typeof req.body === 'object' && req.method === 'POST') {
    const bodyStr = JSON.stringify(req.body);
    const stream = new Readable();
    stream._read = () => {};
    stream.push(bodyStr);
    stream.push(null);

    stream.headers = req.headers;
    stream.method = req.method;
    stream.url = req.url;
    stream.connection = req.connection;
    stream.socket = req.socket;
    stream.httpVersion = req.httpVersion;

    server.emit('request', stream, res);
    return;
  }

  server.emit('request', req, res);
};

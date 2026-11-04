/**
 * DESPACHADOR SERVERLESS BACKEND VERCEL - BUSCAYA
 * Desarrollado e Integrado por Neural Media House
 */

const server = require('../server.js');
const { Readable } = require('stream');

module.exports = async (req, res) => {
  const host = req.headers?.host || 'localhost';
  try {
    const urlObj = new URL(req.url, `http://${host}`);
    const explicitPath = urlObj.searchParams.get('path');
    if (explicitPath) {
      urlObj.searchParams.delete('path');
      req.url = explicitPath + (urlObj.search ? (explicitPath.includes('?') ? '&' : '?') + urlObj.search.slice(1) : '');
    } else {
      const vercelPath = req.headers['x-matched-path'] || req.headers['x-forwarded-uri'] || req.headers['x-vercel-matched-path'];
      if (vercelPath && vercelPath !== '/api' && vercelPath !== '/api/index' && vercelPath !== '/api/serverless-backend') {
        req.url = vercelPath + urlObj.search;
      }
    }
  } catch (_) {}

  // Si Vercel ya consumió el stream y pre-parseó el body, re-inyectarlo como stream para server.js
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

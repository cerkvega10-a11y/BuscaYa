/**
 * ENDPOINT DE NEGOCIOS REGISTRADOS - BUSCAYA
 * Endpoint: /api/businesses
 * Desarrollado e Integrado por Neural Media House
 */

const { queryBuscaYaDatabase } = require('../server.js');

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

  const results = queryBuscaYaDatabase({ limit: 100 });
  const responseData = (results && results.businesses) ? results.businesses : [];

  if (typeof res.status === 'function') {
    return res.status(200).json(responseData);
  }
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(responseData));
};

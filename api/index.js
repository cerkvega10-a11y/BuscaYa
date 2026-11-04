const server = require('../server.js');

module.exports = (req, res) => {
  const host = req.headers?.host || 'localhost';
  try {
    const origUrl = new URL(req.url, `http://${host}`);
    const vercelPath = req.headers['x-matched-path'] || req.headers['x-forwarded-uri'] || req.headers['x-vercel-matched-path'];
    if (vercelPath && !vercelPath.includes('[...all]')) {
      req.url = vercelPath + origUrl.search;
    }
  } catch (_) {}

  server.emit('request', req, res);
};

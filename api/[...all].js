const server = require('../server.js');

module.exports = (req, res) => {
  // Restaurar la ruta original desempaquetando los headers o params de Vercel
  const host = req.headers?.host || 'localhost';
  try {
    const origUrl = new URL(req.url, `http://${host}`);
    const vercelPath = req.headers['x-matched-path'] || req.headers['x-forwarded-uri'] || req.headers['x-vercel-matched-path'];

    if (vercelPath && !vercelPath.includes('[...all]')) {
      origUrl.searchParams.delete('all');
      req.url = vercelPath + origUrl.search;
    } else if (origUrl.pathname.includes('[...all]')) {
      const allParam = origUrl.searchParams.get('all');
      if (allParam) {
        origUrl.searchParams.delete('all');
        req.url = `/api/${allParam}` + origUrl.search;
      }
    }
  } catch (err) {
    console.warn('[Vercel Dispatcher] Error al desempaquetar ruta:', err.message);
  }

  // Canalizar cualquier petición de subruta /api/* a la instancia del servidor HTTP de BuscaYa
  server.emit('request', req, res);
};

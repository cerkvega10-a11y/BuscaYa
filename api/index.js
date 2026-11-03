const server = require('../server.js');

module.exports = (req, res) => {
  // Canalizar petición a la instancia del servidor HTTP de BuscaYa
  server.emit('request', req, res);
};

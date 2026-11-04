/**
 * API DE COLONIAS Y GEODATOS OFICIALES - BUSCAYA
 * Endpoint: /api/colonias/alvaro-obregon
 * Desarrollado e Integrado por Neural Media House
 */

const fs = require('fs');
const path = require('path');

let coloniasData = null;

function getColoniasData() {
  if (coloniasData) return coloniasData;
  try {
    const filePath = path.join(process.cwd(), 'data', 'colonias-alvaro-obregon.json');
    if (fs.existsSync(filePath)) {
      coloniasData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return coloniasData;
    }
  } catch (err) {
    console.error('[API Colonias] Error leyendo archivo de colonias:', err);
  }
  return {
    municipality: "Álvaro Obregón",
    state: "Ciudad de México",
    totalColonias: 0,
    colonias: []
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(200).end();
    res.writeHead(200);
    return res.end();
  }

  const data = getColoniasData();
  const url = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`);
  const q = url.searchParams.get('q') || url.searchParams.get('query') || '';

  let results = data.colonias || [];
  if (q.trim()) {
    const cleanQ = q.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    results = results.filter(c => {
      const norm = (c.normalized || c.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const matchesName = norm.includes(cleanQ);
      const matchesAlias = Array.isArray(c.aliases) && c.aliases.some(a => a.toLowerCase().includes(cleanQ));
      const matchesCp = c.cp && c.cp.includes(cleanQ);
      return matchesName || matchesAlias || matchesCp;
    });
  }

  const responsePayload = {
    success: true,
    municipality: data.municipality || "Álvaro Obregón",
    state: data.state || "Ciudad de México",
    total: results.length,
    colonias: results,
    attribution: "Neural Media House"
  };

  if (typeof res.status === 'function') {
    return res.status(200).json(responsePayload);
  }
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(responsePayload));
};

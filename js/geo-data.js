/**
 * AGENTE 2 - INGENIERO DE DATOS GEOGRÁFICOS Y PERSISTENCIA (DATA & GIS SPECIALIST)
 * Base de datos relacional y catálogo geográfico para BuscaYa.
 * Estructura en cascada: Estado -> Municipio / Alcaldía -> Colonia (+ Opción manual)
 */

const MEXICO_GEO_DATA = {
  "Ciudad de México": {
    "Álvaro Obregón": [
      "Santa Fe",
      "Jardines del Pedregal",
      "San Ángel",
      "San Ángel Inn",
      "Florida",
      "Guadalupe Inn",
      "Olivar de los Padres",
      "Las Águilas",
      "Plateros",
      "San Bartolo Ameyalco",
      "Tetelpan",
      "Lomas de Plateros",
      "Observatorio",
      "Alfonso XIII",
      "Molino de Rosas",
      "Tolteca",
      "Bella Vista",
      "Colinas del Sur",
      "Corpus Christi",
      "Lomas de Santa Fe",
      "Pueblo Nuevo",
      "Santa Lucía",
      "Tlacopac",
      "Axotla",
      "Chimalistac",
      "Progreso Tizapán",
      "Barrio Norte",
      "Golondrinas"
    ],
    "La Magdalena Contreras": [
      "San Jerónimo Lídice",
      "San Jerónimo Aculco",
      "Pedregal de San Nicolás",
      "Barranca Seca",
      "La Malinche",
      "San Nicolás Totolapan",
      "San Bernabé Ocotepec",
      "Cuauhtémoc",
      "Lomas Quebradas",
      "El Tanque",
      "Las Cruces",
      "Los Padres",
      "Cerro del Judío",
      "La Guadalupe",
      "El Rosal",
      "Pueblo Nuevo Alto",
      "Barros Sierra",
      "Potrerillo",
      "El Toro"
    ],
    "Benito Juárez": [
      "Del Valle Centro",
      "Del Valle Norte",
      "Del Valle Sur",
      "Narvarte Poniente",
      "Narvarte Oriente",
      "Nápoles",
      "Mixcoac",
      "San José Insurgentes",
      "Portales Norte",
      "Portales Sur",
      "Álamos",
      "Insurgentes San Borja"
    ],
    "Coyoacán": [
      "Villa Coyoacán",
      "Del Carmen",
      "Santa Catarina",
      "Copilco Universidad",
      "Paseos de Taxqueña",
      "Campestre Churubusco",
      "Culhuacán",
      "Pedregal de Santo Domingo"
    ],
    "Cuauhtémoc": [
      "Roma Norte",
      "Roma Sur",
      "Condesa",
      "Hipódromo Condesa",
      "Juárez",
      "Centro Histórico",
      "San Rafael",
      "Santa María la Ribera",
      "Tabacalera",
      "Doctores"
    ],
    "Miguel Hidalgo": [
      "Polanco",
      "Lomas de Chapultepec",
      "Anzures",
      "San Miguel Chapultepec",
      "Escandón",
      "Tacubaya",
      "Granada",
      "Ampliación Granada"
    ],
    "Cuajimalpa de Morelos": [
      "Bosques de las Lomas",
      "Lomas del Chamizal",
      "San Mateo Tlaltenango",
      "San Pedro Cuajimalpa",
      "Zentlapatl",
      "Contadero",
      "El Yaqui"
    ],
    "Tlalpan": [
      "Tlalpan Centro",
      "Pedregal de San Ángel",
      "Héroes de Padierna",
      "Fuentes del Pedregal",
      "Villa Coapa",
      "San Andrés Totoltepec"
    ],
    "Iztapalapa": [
      "Leyes de Reforma",
      "San Juanico",
      "Santa Martha Acatitla",
      "Lomas de Zaragoza",
      "Cerro de la Estrella"
    ],
    "Iztacalco": [
      "Agrícola Oriental",
      "Granjas México",
      "Viaducto Piedad",
      "Militar Marte",
      "Santa Anita"
    ],
    "Venustiano Carranza": [
      "Jardín Balbuena",
      "Moctezuma 1ra Sección",
      "Moctezuma 2da Sección",
      "Romero Rubio"
    ],
    "Gustavo A. Madero": [
      "Lindavista",
      "Industrial",
      "Guadalupe Tepeyac",
      "Tepeyac Insurgentes",
      "La Villa"
    ],
    "Azcapotzalco": [
      "Clavería",
      "Azcapotzalco Centro",
      "El Recreo",
      "Ángel Zimbrón",
      "Nueva Santa María"
    ],
    "Xochimilco": [
      "Xochimilco Centro",
      "Santa María Nativitas",
      "San Lucas Xochimanca",
      "Santiago Tulyehualco"
    ],
    "Tláhuac": [
      "San Pedro Tláhuac",
      "San Francisco Tlaltenco",
      "Zapotitlán",
      "Los Reyes"
    ],
    "Milpa Alta": [
      "Villa Milpa Alta",
      "San Antonio Tecómitl",
      "San Salvador Cuauhtenco"
    ]
  },
  "Estado de México": {
    "Naucalpan de Juárez": [
      "Ciudad Satélite",
      "Lomas Verdes",
      "Echegaray",
      "La Florida",
      "San Mateo",
      "Boulevares"
    ],
    "Tlalnepantla de Baz": [
      "Valle Dorado",
      "Arboledas",
      "San Jerónimo Tepetlacalco",
      "Tlalnepantla Centro"
    ],
    "Huixquilucan": [
      "Interlomas",
      "La Herradura",
      "Bosque Real",
      "Jesús del Monte",
      "Huixquilucan Centro"
    ],
    "Toluca": [
      "Toluca Centro",
      "San Mateo Oxtotitlán",
      "Capultitlán",
      "Santa Ana Tlapaltitlán"
    ],
    "Metepec": [
      "Metepec Centro",
      "La Providencia",
      "San Carlos",
      "Árbol de la Vida"
    ],
    "Ecatepec de Morelos": [
      "Las Américas",
      "Jardines de Morelos",
      "San Cristóbal",
      "Valle de Aragón"
    ]
  },
  "Jalisco": {
    "Guadalajara": [
      "Americana",
      "Providencia",
      "Ladrón de Guevara",
      "Centro",
      "Monraz",
      "Chapultepec"
    ],
    "Zapopan": [
      "Puerta de Hierro",
      "Valle Real",
      "Ciudad Granja",
      "Jardines del Sol",
      "La Estancia"
    ]
  },
  "Nuevo León": {
    "Monterrey": [
      "San Jerónimo",
      "Cumbres",
      "Mitras Centro",
      "Obispado",
      "Contry",
      "Centro"
    ],
    "San Pedro Garza García": [
      "Del Valle",
      "Valle Oriente",
      "Fuentes del Valle",
      "Colorines"
    ]
  },
  "Puebla": {
    "Puebla": [
      "Angelópolis",
      "La Paz",
      "Centro Histórico",
      "Anzures",
      "El Mirador"
    ],
    "San Andrés Cholula": [
      "Lomas de Angelópolis",
      "San Andrés Centro",
      "Tlaxcalancingo"
    ]
  },
  "Querétaro": {
    "Querétaro": [
      "Juriquilla",
      "El Campanario",
      "Centro Histórico",
      "Álamos",
      "Milenio III"
    ],
    "Corregidora": [
      "El Pueblito",
      "Candiles",
      "Tejeda"
    ]
  },
  "Yucatán": {
    "Mérida": [
      "Montebello",
      "Altabrisa",
      "García Ginerés",
      "Centro",
      "Campestre"
    ]
  },
  "Veracruz": {
    "Veracruz": [
      "Boca del Río",
      "Reforma",
      "Centro Histórico",
      "Costa de Oro"
    ]
  },
  "Guanajuato": {
    "León": [
      "Campestre",
      "Jardines del Moral",
      "Centro",
      "León Moderno"
    ]
  },
  "Quintana Roo": {
    "Benito Juárez (Cancún)": [
      "Zona Hotelera",
      "Supermanzana 15",
      "Supermanzana 20",
      "Puerto Cancún"
    ]
  },
  "Aguascalientes": { "Aguascalientes": ["Centro", "Bosques", "Campestre"] },
  "Baja California": { "Tijuana": ["Zona Río", "Playas de Tijuana", "Otay"], "Mexicali": ["Centro", "Nueva", "Justo Sierra"] },
  "Baja California Sur": { "La Paz": ["Centro", "El Esterito"], "Los Cabos": ["San José del Cabo", "Cabo San Lucas"] },
  "Campeche": { "Campeche": ["Centro Histórico", "San Román", "Santa Ana"] },
  "Chiapas": { "Tuxtla Gutiérrez": ["Moctezuma", "Las Terrazas", "Centro"] },
  "Chihuahua": { "Chihuahua": ["San Felipe", "Panamericana", "Centro"], "Juárez": ["Campos Elíseos", "Campestre"] },
  "Coahuila": { "Saltillo": ["República", "Los Doctores"], "Torreón": ["Campestre La Rosita", "Centro"] },
  "Colima": { "Colima": ["Lomas Verdes", "Centro", "Jardines Vista Hermosa"] },
  "Durango": { "Durango": ["Centro", "Los Ángeles", "Guadalupe"] },
  "Guerrero": { "Acapulco de Juárez": ["Costera", "Diamante", "Condesa"] },
  "Hidalgo": { "Pachuca de Soto": ["San Javier", "Real de Minas", "Centro"] },
  "Michoacán": { "Morelia": ["Chapultepec Sur", "Las Américas", "Centro"] },
  "Morelos": { "Cuernavaca": ["Vista Hermosa", "Delicias", "Centro"] },
  "Nayarit": { "Tepic": ["San Juan", "Ciudad del Valle", "Centro"] },
  "Oaxaca": { "Oaxaca de Juárez": ["Reforma", "Jalatlaco", "Centro Histórico"] },
  "San Luis Potosí": { "San Luis Potosí": ["Lomas", "Tequisquiapan", "Centro"] },
  "Sinaloa": { "Culiacán": ["Tres Ríos", "Chapultepec", "Centro"], "Mazatlán": ["Zona Dorada", "Marina"] },
  "Sonora": { "Hermosillo": ["Centenario", "Pitic", "Valle Grande"] },
  "Tabasco": { "Centro (Villahermosa)": ["Tabasco 2000", "Atasta", "Centro"] },
  "Tamaulipas": { "Reynosa": ["Del Prado", "Aztlán"], "Tampico": ["Lomas de Rosales", "Centro"] },
  "Tlaxcala": { "Tlaxcala": ["Centro", "Apetatitlán", "Ocotlán"] },
  "Zacatecas": { "Zacatecas": ["Sierra de Álica", "Centro Histórico"] }
};

/**
 * Catálogo ampliado oficial de más de 18 categorías de negocio en BuscaYa
 */
const BUSINESS_CATEGORIES = [
  "Plomeros y Gasfitería",
  "Herrería y Forja Metálica",
  "Restaurantes, Cafeterías y Bares",
  "Abogados y Asesoría Jurídica",
  "Contadores y Consultoría Fiscal",
  "Veterinarios y Mascotas",
  "Médicos, Odontólogos y Salud",
  "Electricistas y Alta Tensión",
  "Mecánicos, Talleres y Grúas",
  "Cerrajerías y Aperturas Urgentes",
  "Pintores e Impermeabilización",
  "Carpintería y Muebles a Medida",
  "Aire Acondicionado y Climas (HVAC)",
  "Limpieza Residencial y Comercial",
  "Fumigación y Control de Plagas",
  "Fotografía, Video y Eventos",
  "Gimnasios, Fitness y Entrenadores",
  "Belleza, Barberías y Spas",
  "Seguridad Privada y Alarmas",
  "Escuelas, Cursos y Clases Particulares"
];

// ==============================================================
// CONTROL MAESTRO DE ZONAS DE COBERTURA (LANZAMIENTO CONTROLADO)
// ==============================================================
const COVERAGE_ZONES_KEY = "buscaya_coverage_zones";

// Configuración inicial por defecto: Únicamente Ciudad de México -> Álvaro Obregón activo
const DEFAULT_COVERAGE_ZONES = {
  "Ciudad de México": {
    enabled: true,
    municipalities: {
      "Álvaro Obregón": true,
      "La Magdalena Contreras": false,
      "Benito Juárez": false,
      "Coyoacán": false,
      "Cuauhtémoc": false,
      "Miguel Hidalgo": false,
      "Cuajimalpa de Morelos": false,
      "Tlalpan": false,
      "Iztapalapa": false,
      "Iztacalco": false,
      "Venustiano Carranza": false,
      "Gustavo A. Madero": false,
      "Azcapotzalco": false,
      "Xochimilco": false,
      "Tláhuac": false,
      "Milpa Alta": false
    }
  },
  "Estado de México": {
    enabled: false,
    municipalities: {
      "Naucalpan de Juárez": false,
      "Tlalnepantla de Baz": false,
      "Huixquilucan": false,
      "Toluca": false
    }
  }
};

function getCoverageZones() {
  try {
    const raw = localStorage.getItem(COVERAGE_ZONES_KEY);
    if (!raw) {
      localStorage.setItem(COVERAGE_ZONES_KEY, JSON.stringify(DEFAULT_COVERAGE_ZONES));
      return JSON.parse(JSON.stringify(DEFAULT_COVERAGE_ZONES));
    }
    const data = JSON.parse(raw);
    // Garantizar que la estructura contenga al menos Ciudad de México
    if (!data["Ciudad de México"]) {
      data["Ciudad de México"] = DEFAULT_COVERAGE_ZONES["Ciudad de México"];
    }
    return data;
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_COVERAGE_ZONES));
  }
}

function saveCoverageZones(zones) {
  localStorage.setItem(COVERAGE_ZONES_KEY, JSON.stringify(zones));
}

function getActiveCoverageStates() {
  const zones = getCoverageZones();
  return Object.keys(zones).filter(state => {
    if (!zones[state] || !zones[state].enabled) return false;
    const munObj = zones[state].municipalities || {};
    return Object.values(munObj).some(isActive => isActive === true);
  });
}

function getActiveCoverageMunicipalities(stateName) {
  const zones = getCoverageZones();
  if (!zones[stateName] || !zones[stateName].enabled) return [];
  const munObj = zones[stateName].municipalities || {};
  return Object.keys(munObj).filter(mun => munObj[mun] === true).sort();
}

/**
 * Función utilitaria para poblar selectores en cascada
 * Soporta modo restringido por zonas de cobertura para registro público
 */
function initCascadingGeo(stateSelectId, munSelectId, colSelectId, customColContainerId, customColInputId, options = {}) {
  const stateSelect = document.getElementById(stateSelectId);
  const munSelect = document.getElementById(munSelectId);
  const colSelect = document.getElementById(colSelectId);
  const customColContainer = customColContainerId ? document.getElementById(customColContainerId) : null;
  const customColInput = customColInputId ? document.getElementById(customColInputId) : null;

  if (!stateSelect || !munSelect || !colSelect) return;

  const restrictByCoverage = !!options.restrictByCoverage;

  // Llenar estados
  stateSelect.innerHTML = '<option value="">-- Selecciona Estado --</option>';
  
  let availableStates = [];
  if (restrictByCoverage) {
    availableStates = getActiveCoverageStates();
  } else {
    availableStates = Object.keys(MEXICO_GEO_DATA).sort();
  }

  availableStates.forEach(state => {
    const opt = document.createElement('option');
    opt.value = state;
    opt.textContent = state;
    stateSelect.appendChild(opt);
  });

  // Si solo hay un estado activo en modo restringido, preseleccionarlo automáticamente
  if (restrictByCoverage && availableStates.length === 1) {
    stateSelect.value = availableStates[0];
  }

  // Manejar cambio de Estado
  const handleStateChange = () => {
    const selectedState = stateSelect.value;
    munSelect.innerHTML = '<option value="">-- Selecciona Municipio/Alcaldía --</option>';
    colSelect.innerHTML = '<option value="">-- Primero elige Municipio/Alcaldía --</option>';
    colSelect.disabled = true;
    if (customColContainer) customColContainer.classList.add('hidden');
    if (customColInput) customColInput.value = '';

    if (!selectedState) {
      munSelect.disabled = true;
      return;
    }

    let municipalities = [];
    if (restrictByCoverage) {
      municipalities = getActiveCoverageMunicipalities(selectedState);
    } else if (MEXICO_GEO_DATA[selectedState]) {
      municipalities = Object.keys(MEXICO_GEO_DATA[selectedState]).sort();
    }

    if (municipalities.length === 0) {
      munSelect.innerHTML = '<option value="">-- Sin municipios con cobertura activa --</option>';
      munSelect.disabled = true;
      return;
    }

    munSelect.disabled = false;
    municipalities.forEach(mun => {
      const opt = document.createElement('option');
      opt.value = mun;
      opt.textContent = mun;
      munSelect.appendChild(opt);
    });

    // Si solo hay un municipio activo, preseleccionarlo automáticamente
    if (restrictByCoverage && municipalities.length === 1) {
      munSelect.value = municipalities[0];
      handleMunChange();
    }
  };

  stateSelect.onchange = handleStateChange;

  // Manejar cambio de Municipio
  const handleMunChange = () => {
    const selectedState = stateSelect.value;
    const selectedMun = munSelect.value;
    colSelect.innerHTML = '<option value="">-- Selecciona Colonia --</option>';
    if (customColContainer) customColContainer.classList.add('hidden');
    if (customColInput) customColInput.value = '';

    if (!selectedState || !selectedMun || !MEXICO_GEO_DATA[selectedState] || !MEXICO_GEO_DATA[selectedState][selectedMun]) {
      colSelect.disabled = true;
      return;
    }

    colSelect.disabled = false;
    const colonias = MEXICO_GEO_DATA[selectedState][selectedMun];
    colonias.forEach(col => {
      const opt = document.createElement('option');
      opt.value = col;
      opt.textContent = col;
      colSelect.appendChild(opt);
    });

    // Opción para escribir manualmente
    const customOpt = document.createElement('option');
    customOpt.value = "__OTHER__";
    customOpt.textContent = "+ Otra colonia (Escribir manualmente)";
    colSelect.appendChild(customOpt);
  };

  munSelect.onchange = handleMunChange;

  // Manejar cambio de Colonia
  colSelect.onchange = () => {
    if (colSelect.value === "__OTHER__") {
      if (customColContainer) {
        customColContainer.classList.remove('hidden');
        if (customColInput) customColInput.focus();
      }
    } else {
      if (customColContainer) customColContainer.classList.add('hidden');
      if (customColInput) customColInput.value = '';
    }
  };

  // Disparar carga inicial si ya hay un estado seleccionado
  if (stateSelect.value) {
    handleStateChange();
  }
}

/**
 * Generador de enlace verificado de Google Maps
 */
function buildGoogleMapsUrl(street, number, neighborhood, municipality, state) {
  const parts = [street, number, neighborhood, municipality, state, "México"].filter(Boolean);
  const query = encodeURIComponent(parts.join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

// ==========================================================
// CATÁLOGO DE COORDENADAS GPS Y GEOCODIFICACIÓN INVERSA (CDMX)
// ==========================================================

const CDMX_COORDINATES_CATALOG = [
  // Álvaro Obregón
  { neighborhood: "San Ángel", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3496, lng: -99.1915 },
  { neighborhood: "San Ángel Inn", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3524, lng: -99.1963 },
  { neighborhood: "Santa Fe", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3600, lng: -99.2600 },
  { neighborhood: "Lomas de Santa Fe", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3645, lng: -99.2580 },
  { neighborhood: "Las Águilas", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3564, lng: -99.2155 },
  { neighborhood: "Olivar de los Padres", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3361, lng: -99.2238 },
  { neighborhood: "Florida", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3582, lng: -99.1793 },
  { neighborhood: "Guadalupe Inn", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3621, lng: -99.1865 },
  { neighborhood: "Jardines del Pedregal", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3245, lng: -99.2089 },
  { neighborhood: "San Bartolo Ameyalco", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3412, lng: -99.2598 },
  { neighborhood: "Tetelpan", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3444, lng: -99.2198 },
  { neighborhood: "Plateros", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3658, lng: -99.2023 },
  { neighborhood: "Tolteca", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3812, lng: -99.1945 },
  { neighborhood: "Chimalistac", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3465, lng: -99.1834 },
  { neighborhood: "Tlacopac", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3545, lng: -99.1923 },

  // La Magdalena Contreras
  { neighborhood: "San Jerónimo Lídice", municipality: "La Magdalena Contreras", state: "Ciudad de México", lat: 19.3289, lng: -99.2223 },
  { neighborhood: "San Jerónimo Aculco", municipality: "La Magdalena Contreras", state: "Ciudad de México", lat: 19.3241, lng: -99.2154 },
  { neighborhood: "Pedregal de San Nicolás", municipality: "La Magdalena Contreras", state: "Ciudad de México", lat: 19.3145, lng: -99.2312 },
  { neighborhood: "San Nicolás Totolapan", municipality: "La Magdalena Contreras", state: "Ciudad de México", lat: 19.2987, lng: -99.2456 },
  { neighborhood: "Santa Teresa", municipality: "La Magdalena Contreras", state: "Ciudad de México", lat: 19.3089, lng: -99.2178 },
  { neighborhood: "Barranca Seca", municipality: "La Magdalena Contreras", state: "Ciudad de México", lat: 19.3056, lng: -99.2398 },
  { neighborhood: "Cuauhtémoc", municipality: "La Magdalena Contreras", state: "Ciudad de México", lat: 19.3122, lng: -99.2389 },
  { neighborhood: "El Rosal", municipality: "La Magdalena Contreras", state: "Ciudad de México", lat: 19.3178, lng: -99.2345 },

  // Benito Juárez
  { neighborhood: "Del Valle", municipality: "Benito Juárez", state: "Ciudad de México", lat: 19.3756, lng: -99.1678 },
  { neighborhood: "Del Valle Centro", municipality: "Benito Juárez", state: "Ciudad de México", lat: 19.3756, lng: -99.1678 },
  { neighborhood: "Del Valle Norte", municipality: "Benito Juárez", state: "Ciudad de México", lat: 19.3895, lng: -99.1652 },
  { neighborhood: "Del Valle Sur", municipality: "Benito Juárez", state: "Ciudad de México", lat: 19.3665, lng: -99.1712 },
  { neighborhood: "Narvarte", municipality: "Benito Juárez", state: "Ciudad de México", lat: 19.3956, lng: -99.1578 },
  { neighborhood: "Narvarte Poniente", municipality: "Benito Juárez", state: "Ciudad de México", lat: 19.3956, lng: -99.1578 },
  { neighborhood: "Narvarte Oriente", municipality: "Benito Juárez", state: "Ciudad de México", lat: 19.3942, lng: -99.1489 },
  { neighborhood: "Nápoles", municipality: "Benito Juárez", state: "Ciudad de México", lat: 19.3912, lng: -99.1765 },
  { neighborhood: "Insurgentes Mixcoac", municipality: "Benito Juárez", state: "Ciudad de México", lat: 19.3723, lng: -99.1834 },
  { neighborhood: "Mixcoac", municipality: "Benito Juárez", state: "Ciudad de México", lat: 19.3752, lng: -99.1869 },

  // Coyoacán
  { neighborhood: "Coyoacán Centro", municipality: "Coyoacán", state: "Ciudad de México", lat: 19.3501, lng: -99.1623 },
  { neighborhood: "Villa Coyoacán", municipality: "Coyoacán", state: "Ciudad de México", lat: 19.3501, lng: -99.1623 },
  { neighborhood: "Del Carmen", municipality: "Coyoacán", state: "Ciudad de México", lat: 19.3567, lng: -99.1654 },
  { neighborhood: "Pedregal de Santo Domingo", municipality: "Coyoacán", state: "Ciudad de México", lat: 19.3245, lng: -99.1689 },
  { neighborhood: "Copilco Universidad", municipality: "Coyoacán", state: "Ciudad de México", lat: 19.3367, lng: -99.1789 },

  // Cuauhtémoc
  { neighborhood: "Roma Norte", municipality: "Cuauhtémoc", state: "Ciudad de México", lat: 19.4189, lng: -99.1612 },
  { neighborhood: "Condesa", municipality: "Cuauhtémoc", state: "Ciudad de México", lat: 19.4123, lng: -99.1723 },
  { neighborhood: "Juárez", municipality: "Cuauhtémoc", state: "Ciudad de México", lat: 19.4278, lng: -99.1634 },

  // Miguel Hidalgo
  { neighborhood: "Polanco", municipality: "Miguel Hidalgo", state: "Ciudad de México", lat: 19.4334, lng: -99.1956 },
  { neighborhood: "Lomas de Chapultepec", municipality: "Miguel Hidalgo", state: "Ciudad de México", lat: 19.4189, lng: -99.2189 }
];

const MUNICIPALITY_CENTROIDS = {
  "Álvaro Obregón": { lat: 19.3580, lng: -99.2030 },
  "La Magdalena Contreras": { lat: 19.3140, lng: -99.2290 },
  "Benito Juárez": { lat: 19.3800, lng: -99.1650 },
  "Coyoacán": { lat: 19.3450, lng: -99.1600 },
  "Cuauhtémoc": { lat: 19.4200, lng: -99.1550 },
  "Miguel Hidalgo": { lat: 19.4280, lng: -99.2000 }
};

/**
 * Fórmula de Haversine para calcular distancia exacta en kilómetros entre dos coordenadas GPS
 */
function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  if (typeof lat1 !== "number" || typeof lon1 !== "number" || typeof lat2 !== "number" || typeof lon2 !== "number") {
    return 999;
  }
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formatea la distancia calculada en texto legible para el usuario de WhatsApp
 */
function formatDistanceDisplay(distanceKm) {
  if (typeof distanceKm !== "number" || isNaN(distanceKm) || distanceKm >= 900) return "";
  if (distanceKm < 1) {
    const meters = Math.max(50, Math.round(distanceKm * 1000));
    return `a solo ${meters} metros de tu ubicación`;
  }
  return `a ${distanceKm.toFixed(1)} km de tu ubicación`;
}

/**
 * Geocodificación Inversa: Convierte coordenadas (Lat/Lng) en Colonia, Alcaldía y Estado de CDMX
 */
function reverseGeocodeCoordinates(latitude, longitude) {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return {
      neighborhood: "San Ángel",
      municipality: "Álvaro Obregón",
      state: "Ciudad de México",
      distanceKm: 0,
      formattedAddress: "San Ángel, Álvaro Obregón, CDMX",
      latitude: 19.3496,
      longitude: -99.1915
    };
  }

  let closest = null;
  let minDistance = Infinity;

  CDMX_COORDINATES_CATALOG.forEach(point => {
    const dist = calculateHaversineDistanceKm(latitude, longitude, point.lat, point.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = point;
    }
  });

  if (!closest) {
    closest = CDMX_COORDINATES_CATALOG[0];
    minDistance = 0;
  }

  return {
    neighborhood: closest.neighborhood,
    municipality: closest.municipality,
    state: closest.state,
    distanceKm: minDistance,
    distanceMeters: Math.round(minDistance * 1000),
    formattedAddress: `${closest.neighborhood}, ${closest.municipality}, CDMX`,
    latitude: latitude,
    longitude: longitude
  };
}

/**
 * Obtiene las coordenadas de una colonia o municipio
 */
function getCoordinatesForNeighborhood(neighborhood, municipality, state) {
  if (neighborhood) {
    const cleanCol = neighborhood.toLowerCase().trim();
    const match = CDMX_COORDINATES_CATALOG.find(c => c.neighborhood.toLowerCase() === cleanCol);
    if (match) return { latitude: match.lat, longitude: match.lng };
  }

  if (municipality && MUNICIPALITY_CENTROIDS[municipality]) {
    return { latitude: MUNICIPALITY_CENTROIDS[municipality].lat, longitude: MUNICIPALITY_CENTROIDS[municipality].lng };
  }

  return { latitude: 19.3496, longitude: -99.1915 }; // Default San Ángel
}

/**
 * Generador de enlace directo a Google Maps con direcciones de navegación
 */
function buildGoogleMapsDirectionsUrl(originLat, originLng, destLat, destLng, destName) {
  if (originLat && originLng && destLat && destLng) {
    return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}`;
  }
  const query = encodeURIComponent(destName || "Negocio en CDMX");
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

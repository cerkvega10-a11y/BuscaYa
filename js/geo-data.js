/**
 * AGENTE 2 - INGENIERO DE DATOS GEOGRÁFICOS Y PERSISTENCIA (DATA & GIS SPECIALIST)
 * Base de datos relacional y catálogo geográfico para BuscaYa.
 * Estructura en cascada: Estado -> Municipio / Alcaldía -> Colonia (+ Opción manual)
 */

const MEXICO_GEO_DATA = {
  "Ciudad de México": {
    "Álvaro Obregón": [
      
      "1ra Victoria",
      "2da Cañada",
      "2da Victoria",
      "Acuilotla",
      "Agrícola",
      "Alfonso XIII",
      "Altavista",
      "Ampliación Alpes",
      "Ampliación Corpus Christy",
      "Ampliación Golondrinas",
      "Ampliación Jalalpa",
      "Ampliación Las Águilas",
      "Ampliación Lomas de Becerra",
      "Ampliación Piloto Adolfo López Mateos",
      "Ampliación Tepeaca",
      "Ampliación Tetelpan",
      "Ampliación Victoria",
      "Arturo Martínez",
      "Arvide",
      "Atlamaya",
      "Axotla",
      "Balcones de Cehuayo",
      "Barrio Melchor Ocampo",
      "Barrio Norte",
      "Barrio Norte San Pedro",
      "Batallón de San Patricio",
      "Belem de las Flores",
      "Bellavista",
      "Bosque",
      "Bosques de Tarango",
      "Bosques de Tetlameya",
      "Calzada de los Corceles",
      "Campamento 2 de Octubre",
      "Campestre",
      "Cañada de San Rafael",
      "Cañada del Olivar",
      "Capula",
      "Carola",
      "Casas Alemán",
      "Cerrada de San Jerónimo",
      "Chamontoya",
      "Chimalistac",
      "Colina del Sur",
      "Colinas de Tarango",
      "Concepción",
      "Cooperativa Cehuayo",
      "Corpus Christy",
      "Cove",
      "Cristo Rey",
      "Cruz Manca",
      "Cuevitas",
      "Desierto de los Leones",
      "Dos Ríos",
      "El Árbol",
      "El Batán",
      "El Capulín",
      "El Cuernito",
      "El Encino",
      "El Manzanito",
      "El Mirador",
      "El Mirador 2da Sección",
      "El Paraíso",
      "El Pirul",
      "El Pirul 1ra Sección",
      "El Pirul 2da Sección",
      "El Pocito",
      "El Queso",
      "El Rincón",
      "El Rincón de la Huerta",
      "El Rodeo",
      "El Tejocote",
      "Ermita Tizapán",
      "Ex-Hacienda de Guadalupe Chimalistac",
      "Flor de María",
      "Florida",
      "Francisco Villa",
      "Galeana",
      "Guadalupe Inn",
      "Guanajuato",
      "Hacienda del Ciervo",
      "Hidalgo",
      "Huichapan",
      "Isidro Fabela",
      "Jalalpa",
      "Jalalpa el Grande",
      "Jalalpa Tepito",
      "Jardines del Pedregal",
      "Jardines del Pedregal de San Ángel",
      "José María Pino Suárez",
      "La Angostura",
      "La Angostura El Encino",
      "La Cabaña",
      "La Cañada",
      "La Cascada",
      "La Conchita",
      "La Herradura",
      "La Huerta",
      "La Joya",
      "La Joyita",
      "La Lagunilla",
      "La Loma",
      "La Loma de Santa Fe",
      "La Martinica",
      "La Mexicana",
      "La Otra Banda",
      "La Palmita",
      "La Palmita Cehuayo",
      "La Peñita",
      "La Presa",
      "La Providencia",
      "La Retama",
      "Las Águilas",
      "Las Águilas 1ra Sección",
      "Las Águilas 2da Sección",
      "Las Águilas 3ra Sección",
      "Las Golondrinas",
      "Las Golondrinas 1ra Sección",
      "Las Golondrinas 2da Sección",
      "Las Palmas",
      "Lomas Altas",
      "Lomas de Becerra",
      "Lomas de Capula",
      "Lomas de Cehuayo",
      "Lomas de Chamontoya",
      "Lomas de Guadalupe",
      "Lomas de la Era",
      "Lomas de las Águilas",
      "Lomas de Los Ángeles Tetelpan",
      "Lomas de Nuevo México",
      "Lomas de Plateros",
      "Lomas de San Ángel Inn",
      "Lomas de Santa Fe",
      "Lomas de Santo Domingo",
      "Lomas de Tarango",
      "Loreto",
      "Los Alpes",
      "Los Cedros",
      "Madero",
      "María G. de García Caraveo",
      "Mártires de Tacubaya",
      "Merced Gómez",
      "Merced Gómez Sur",
      "Miguel Hidalgo",
      "Minas de Cristo",
      "Molino de Rosas",
      "Observatorio",
      "Olivar de los Padres",
      "Olivar del Conde",
      "Olivar del Conde 1ra Sección",
      "Olivar del Conde 2da Sección",
      "Olivar del Conde 3ra Sección",
      "Paraíso",
      "Parque La Mexicana",
      "Paseo de las Lomas",
      "Paseo de las Lomas Santa Fe",
      "Piedra Grande",
      "Piloto Adolfo López Mateos",
      "Plateros",
      "Polvareda",
      "Ponciano Arriaga",
      "Potrero del Llano",
      "Prados de la Montaña",
      "Presidentes",
      "Presidentes 1ra Sección",
      "Presidentes 2da Sección",
      "Progreso Tizapán",
      "Pueblo Nuevo",
      "Pueblo San Bartolo Ameyalco",
      "Pueblo Santa Lucía",
      "Pueblo Santa Rosa Xochiac",
      "Puente Colorado",
      "Punta de Cehuayo",
      "Rancho del Carmen",
      "Rancho San Francisco",
      "Reacomodo Cuauhtémoc",
      "Reacomodo El Cuernito",
      "Reacomodo Merced Gómez",
      "Reacomodo Tepeaca",
      "Real del Monte",
      "Rincón de Centokani",
      "Rincón de la Bolsa",
      "San Ángel",
      "San Ángel Inn",
      "San Ángel Sur",
      "San Bartolo Ameyalco",
      "San Bartolo Ameyalco Centro",
      "San Bartolo Atepehuacan",
      "San Carlos",
      "San Clemente Norte",
      "San Clemente Sur",
      "San Jerónimo Aculco",
      "San Jerónimo Lídice (Límite AO)",
      "San Pedro de los Pinos",
      "Santa Fe",
      "Santa Fe Cuajimalpa",
      "Santa Fe La Loma",
      "Santa Fe Peña Blanca",
      "Santa Fe Tlacuitlapa",
      "Santa Lucía",
      "Santa María Nonoalco",
      "Santa Rosa Xochiac",
      "Tarango",
      "Tepaca",
      "Tepeaca",
      "Tepetates",
      "Tepetongo",
      "Tetelpan",
      "Tierra Nueva",
      "Tizapán San Ángel",
      "Tlacopac",
      "Tlacopac Tlacuitlapa",
      "Tlacoyaque",
      "Tlacuitlapa",
      "Tolteca",
      "Torres de Potrero",
      "Unidad Habitacional Plateros",
      "Unidad Habitacional Santa Fe",
      "Valle de Santa Fe",
      "Vasco de Quiroga",
      "Villa Solidaridad",
      "Villa Verdún",
      "Zavaleta",
      "Zedec Santa Fe",
      "Zenón Delgado"
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
  // Álvaro Obregón (Catálogo Completo Oficial 224 Colonias - Neural Media House)
  { neighborhood: "1ra Victoria", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.382, lng: -99.201 },
  { neighborhood: "2da Cañada", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.362, lng: -99.236 },
  { neighborhood: "2da Victoria", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.384, lng: -99.203 },
  { neighborhood: "Acuilotla", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.365, lng: -99.237 },
  { neighborhood: "Agrícola", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.356, lng: -99.188 },
  { neighborhood: "Alfonso XIII", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.372, lng: -99.196 },
  { neighborhood: "Altavista", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3515, lng: -99.195 },
  { neighborhood: "Ampliación Alpes", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.361, lng: -99.195 },
  { neighborhood: "Ampliación Corpus Christy", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.364, lng: -99.241 },
  { neighborhood: "Ampliación Golondrinas", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.369, lng: -99.229 },
  { neighborhood: "Ampliación Jalalpa", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.361, lng: -99.233 },
  { neighborhood: "Ampliación Las Águilas", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.353, lng: -99.224 },
  { neighborhood: "Ampliación Lomas de Becerra", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.381, lng: -99.211 },
  { neighborhood: "Ampliación Piloto Adolfo López Mateos", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.36, lng: -99.229 },
  { neighborhood: "Ampliación Tepeaca", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.359, lng: -99.247 },
  { neighborhood: "Ampliación Tetelpan", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.342, lng: -99.223 },
  { neighborhood: "Ampliación Victoria", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.385, lng: -99.205 },
  { neighborhood: "Arturo Martínez", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.393, lng: -99.202 },
  { neighborhood: "Arvide", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.374, lng: -99.217 },
  { neighborhood: "Atlamaya", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.35, lng: -99.202 },
  { neighborhood: "Axotla", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3535, lng: -99.177 },
  { neighborhood: "Balcones de Cehuayo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.364, lng: -99.239 },
  { neighborhood: "Barrio Melchor Ocampo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.368, lng: -99.23 },
  { neighborhood: "Barrio Norte", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3735, lng: -99.209 },
  { neighborhood: "Barrio Norte San Pedro", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.375, lng: -99.208 },
  { neighborhood: "Batallón de San Patricio", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.383, lng: -99.197 },
  { neighborhood: "Belem de las Flores", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.392, lng: -99.208 },
  { neighborhood: "Bellavista", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.388, lng: -99.199 },
  { neighborhood: "Bosque", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.385, lng: -99.205 },
  { neighborhood: "Bosques de Tarango", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.362, lng: -99.211 },
  { neighborhood: "Bosques de Tetlameya", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.337, lng: -99.226 },
  { neighborhood: "Calzada de los Corceles", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.338, lng: -99.229 },
  { neighborhood: "Campamento 2 de Octubre", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.394, lng: -99.204 },
  { neighborhood: "Campestre", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.354, lng: -99.19 },
  { neighborhood: "Cañada de San Rafael", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.339, lng: -99.228 },
  { neighborhood: "Cañada del Olivar", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.341, lng: -99.231 },
  { neighborhood: "Capula", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.375, lng: -99.225 },
  { neighborhood: "Carola", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.381, lng: -99.19 },
  { neighborhood: "Casas Alemán", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.382, lng: -99.199 },
  { neighborhood: "Cerrada de San Jerónimo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.333, lng: -99.206 },
  { neighborhood: "Chamontoya", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.336, lng: -99.259 },
  { neighborhood: "Chimalistac", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.351, lng: -99.182 },
  { neighborhood: "Colina del Sur", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3512, lng: -99.2212 },
  { neighborhood: "Colinas de Tarango", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.363, lng: -99.213 },
  { neighborhood: "Concepción", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.349, lng: -99.184 },
  { neighborhood: "Cooperativa Cehuayo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.366, lng: -99.238 },
  { neighborhood: "Corpus Christy", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.365, lng: -99.239 },
  { neighborhood: "Cove", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.395, lng: -99.199 },
  { neighborhood: "Cristo Rey", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.382, lng: -99.192 },
  { neighborhood: "Cruz Manca", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.355, lng: -99.269 },
  { neighborhood: "Cuevitas", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.371, lng: -99.232 },
  { neighborhood: "Desierto de los Leones", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.34, lng: -99.235 },
  { neighborhood: "Dos Ríos", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.362, lng: -99.242 },
  { neighborhood: "El Árbol", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.335, lng: -99.227 },
  { neighborhood: "El Batán", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.342, lng: -99.198 },
  { neighborhood: "El Capulín", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.389, lng: -99.206 },
  { neighborhood: "El Cuernito", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.379, lng: -99.212 },
  { neighborhood: "El Encino", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.339, lng: -99.27 },
  { neighborhood: "El Manzanito", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.343, lng: -99.261 },
  { neighborhood: "El Mirador", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.366, lng: -99.228 },
  { neighborhood: "El Mirador 2da Sección", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.365, lng: -99.229 },
  { neighborhood: "El Paraíso", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.386, lng: -99.21 },
  { neighborhood: "El Pirul", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.372, lng: -99.235 },
  { neighborhood: "El Pirul 1ra Sección", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.372, lng: -99.234 },
  { neighborhood: "El Pirul 2da Sección", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.371, lng: -99.236 },
  { neighborhood: "El Pocito", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.361, lng: -99.244 },
  { neighborhood: "El Queso", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.378, lng: -99.215 },
  { neighborhood: "El Rincón", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.34, lng: -99.251 },
  { neighborhood: "El Rincón de la Huerta", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3375, lng: -99.2265 },
  { neighborhood: "El Rodeo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.367, lng: -99.235 },
  { neighborhood: "El Tejocote", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.38, lng: -99.213 },
  { neighborhood: "Ermita Tizapán", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3395, lng: -99.1955 },
  { neighborhood: "Ex-Hacienda de Guadalupe Chimalistac", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3545, lng: -99.184 },
  { neighborhood: "Flor de María", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.348, lng: -99.205 },
  { neighborhood: "Florida", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3582, lng: -99.1793 },
  { neighborhood: "Francisco Villa", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.376, lng: -99.214 },
  { neighborhood: "Galeana", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.363, lng: -99.238 },
  { neighborhood: "Guadalupe Inn", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3621, lng: -99.1865 },
  { neighborhood: "Guanajuato", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.366, lng: -99.219 },
  { neighborhood: "Hacienda del Ciervo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3365, lng: -99.2255 },
  { neighborhood: "Hidalgo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.39, lng: -99.21 },
  { neighborhood: "Huichapan", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.382, lng: -99.211 },
  { neighborhood: "Isidro Fabela", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.381, lng: -99.214 },
  { neighborhood: "Jalalpa", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3635, lng: -99.2312 },
  { neighborhood: "Jalalpa el Grande", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3635, lng: -99.2312 },
  { neighborhood: "Jalalpa Tepito", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3645, lng: -99.234 },
  { neighborhood: "Jardines del Pedregal", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3245, lng: -99.2089 },
  { neighborhood: "Jardines del Pedregal de San Ángel", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3245, lng: -99.2089 },
  { neighborhood: "José María Pino Suárez", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.389, lng: -99.195 },
  { neighborhood: "La Angostura", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.337, lng: -99.255 },
  { neighborhood: "La Angostura El Encino", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.338, lng: -99.256 },
  { neighborhood: "La Cabaña", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.336, lng: -99.247 },
  { neighborhood: "La Cañada", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.369, lng: -99.236 },
  { neighborhood: "La Cascada", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.337, lng: -99.246 },
  { neighborhood: "La Conchita", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.377, lng: -99.205 },
  { neighborhood: "La Herradura", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3355, lng: -99.2245 },
  { neighborhood: "La Huerta", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.337, lng: -99.228 },
  { neighborhood: "La Joya", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.367, lng: -99.249 },
  { neighborhood: "La Joyita", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3645, lng: -99.221 },
  { neighborhood: "La Lagunilla", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.342, lng: -99.263 },
  { neighborhood: "La Loma", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.359, lng: -99.255 },
  { neighborhood: "La Loma de Santa Fe", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.359, lng: -99.255 },
  { neighborhood: "La Martinica", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.377, lng: -99.217 },
  { neighborhood: "La Mexicana", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3585, lng: -99.2675 },
  { neighborhood: "La Otra Banda", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.345, lng: -99.195 },
  { neighborhood: "La Palmita", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.368, lng: -99.234 },
  { neighborhood: "La Palmita Cehuayo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3675, lng: -99.2345 },
  { neighborhood: "La Peñita", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.388, lng: -99.215 },
  { neighborhood: "La Presa", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.368, lng: -99.225 },
  { neighborhood: "La Providencia", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3405, lng: -99.2615 },
  { neighborhood: "La Retama", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3385, lng: -99.226 },
  { neighborhood: "Las Águilas", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3564, lng: -99.2155 },
  { neighborhood: "Las Águilas 1ra Sección", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.357, lng: -99.213 },
  { neighborhood: "Las Águilas 2da Sección", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.356, lng: -99.217 },
  { neighborhood: "Las Águilas 3ra Sección", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.355, lng: -99.221 },
  { neighborhood: "Las Golondrinas", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.368, lng: -99.224 },
  { neighborhood: "Las Golondrinas 1ra Sección", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.368, lng: -99.224 },
  { neighborhood: "Las Golondrinas 2da Sección", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.367, lng: -99.227 },
  { neighborhood: "Las Palmas", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.338, lng: -99.249 },
  { neighborhood: "Lomas Altas", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.365, lng: -99.25 },
  { neighborhood: "Lomas de Becerra", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3789, lng: -99.2089 },
  { neighborhood: "Lomas de Capula", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.374, lng: -99.222 },
  { neighborhood: "Lomas de Cehuayo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.366, lng: -99.237 },
  { neighborhood: "Lomas de Chamontoya", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.334, lng: -99.258 },
  { neighborhood: "Lomas de Guadalupe", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.363, lng: -99.189 },
  { neighborhood: "Lomas de la Era", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.329, lng: -99.274 },
  { neighborhood: "Lomas de las Águilas", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.352, lng: -99.228 },
  { neighborhood: "Lomas de Los Ángeles Tetelpan", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.346, lng: -99.221 },
  { neighborhood: "Lomas de Nuevo México", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.366, lng: -99.251 },
  { neighborhood: "Lomas de Plateros", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.367, lng: -99.201 },
  { neighborhood: "Lomas de San Ángel Inn", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.345, lng: -99.208 },
  { neighborhood: "Lomas de Santa Fe", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.361, lng: -99.258 },
  { neighborhood: "Lomas de Santo Domingo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.38, lng: -99.208 },
  { neighborhood: "Lomas de Tarango", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.36, lng: -99.213 },
  { neighborhood: "Loreto", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.344, lng: -99.193 },
  { neighborhood: "Los Alpes", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.364, lng: -99.193 },
  { neighborhood: "Los Cedros", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.341, lng: -99.264 },
  { neighborhood: "Madero", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.372, lng: -99.212 },
  { neighborhood: "María G. de García Caraveo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.373, lng: -99.219 },
  { neighborhood: "Mártires de Tacubaya", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.386, lng: -99.202 },
  { neighborhood: "Merced Gómez", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3621, lng: -99.2012 },
  { neighborhood: "Merced Gómez Sur", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.361, lng: -99.202 },
  { neighborhood: "Miguel Hidalgo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.334, lng: -99.232 },
  { neighborhood: "Minas de Cristo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.38, lng: -99.194 },
  { neighborhood: "Molino de Rosas", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.369, lng: -99.203 },
  { neighborhood: "Observatorio", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.398, lng: -99.197 },
  { neighborhood: "Olivar de los Padres", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3361, lng: -99.2238 },
  { neighborhood: "Olivar del Conde", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3712, lng: -99.2156 },
  { neighborhood: "Olivar del Conde 1ra Sección", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3712, lng: -99.2156 },
  { neighborhood: "Olivar del Conde 2da Sección", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.369, lng: -99.219 },
  { neighborhood: "Olivar del Conde 3ra Sección", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.368, lng: -99.221 },
  { neighborhood: "Paraíso", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.386, lng: -99.212 },
  { neighborhood: "Parque La Mexicana", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3585, lng: -99.2675 },
  { neighborhood: "Paseo de las Lomas", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.372, lng: -99.259 },
  { neighborhood: "Paseo de las Lomas Santa Fe", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.372, lng: -99.259 },
  { neighborhood: "Piedra Grande", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3685, lng: -99.208 },
  { neighborhood: "Piloto Adolfo López Mateos", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.361, lng: -99.227 },
  { neighborhood: "Plateros", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3658, lng: -99.2023 },
  { neighborhood: "Polvareda", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.367, lng: -99.23 },
  { neighborhood: "Ponciano Arriaga", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.384, lng: -99.198 },
  { neighborhood: "Potrero del Llano", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.343, lng: -99.248 },
  { neighborhood: "Prados de la Montaña", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.361, lng: -99.264 },
  { neighborhood: "Presidentes", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.364, lng: -99.223 },
  { neighborhood: "Presidentes 1ra Sección", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.364, lng: -99.223 },
  { neighborhood: "Presidentes 2da Sección", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.363, lng: -99.225 },
  { neighborhood: "Progreso Tizapán", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.341, lng: -99.198 },
  { neighborhood: "Pueblo Nuevo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3615, lng: -99.248 },
  { neighborhood: "Pueblo San Bartolo Ameyalco", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3412, lng: -99.2598 },
  { neighborhood: "Pueblo Santa Lucía", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.369, lng: -99.231 },
  { neighborhood: "Pueblo Santa Rosa Xochiac", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.328, lng: -99.278 },
  { neighborhood: "Puente Colorado", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3505, lng: -99.231 },
  { neighborhood: "Punta de Cehuayo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.367, lng: -99.24 },
  { neighborhood: "Rancho del Carmen", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.336, lng: -99.227 },
  { neighborhood: "Rancho San Francisco", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.335, lng: -99.265 },
  { neighborhood: "Reacomodo Cuauhtémoc", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.383, lng: -99.206 },
  { neighborhood: "Reacomodo El Cuernito", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3795, lng: -99.2125 },
  { neighborhood: "Reacomodo Merced Gómez", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.363, lng: -99.204 },
  { neighborhood: "Reacomodo Tepeaca", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.358, lng: -99.248 },
  { neighborhood: "Real del Monte", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.387, lng: -99.209 },
  { neighborhood: "Rincón de Centokani", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.337, lng: -99.2285 },
  { neighborhood: "Rincón de la Bolsa", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.338, lng: -99.227 },
  { neighborhood: "San Ángel", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3496, lng: -99.1915 },
  { neighborhood: "San Ángel Inn", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3524, lng: -99.1963 },
  { neighborhood: "San Ángel Sur", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.348, lng: -99.192 },
  { neighborhood: "San Bartolo Ameyalco", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3412, lng: -99.2598 },
  { neighborhood: "San Bartolo Ameyalco Centro", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3412, lng: -99.2598 },
  { neighborhood: "San Bartolo Atepehuacan", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.34, lng: -99.262 },
  { neighborhood: "San Carlos", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.335, lng: -99.245 },
  { neighborhood: "San Clemente Norte", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.354, lng: -99.21 },
  { neighborhood: "San Clemente Sur", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.351, lng: -99.212 },
  { neighborhood: "San Jerónimo Aculco", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.332, lng: -99.205 },
  { neighborhood: "San Jerónimo Lídice (Límite AO)", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.33, lng: -99.215 },
  { neighborhood: "San Pedro de los Pinos", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.387, lng: -99.186 },
  { neighborhood: "Santa Fe", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.36, lng: -99.26 },
  { neighborhood: "Santa Fe Cuajimalpa", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.363, lng: -99.265 },
  { neighborhood: "Santa Fe La Loma", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.359, lng: -99.255 },
  { neighborhood: "Santa Fe Peña Blanca", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.362, lng: -99.262 },
  { neighborhood: "Santa Fe Tlacuitlapa", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.368, lng: -99.239 },
  { neighborhood: "Santa Lucía", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.369, lng: -99.231 },
  { neighborhood: "Santa María Nonoalco", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.379, lng: -99.188 },
  { neighborhood: "Santa Rosa Xochiac", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.328, lng: -99.278 },
  { neighborhood: "Tarango", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.364, lng: -99.214 },
  { neighborhood: "Tepaca", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.338, lng: -99.266 },
  { neighborhood: "Tepeaca", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.36, lng: -99.246 },
  { neighborhood: "Tepetates", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.363, lng: -99.243 },
  { neighborhood: "Tepetongo", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.341, lng: -99.252 },
  { neighborhood: "Tetelpan", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3444, lng: -99.2198 },
  { neighborhood: "Tierra Nueva", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.33, lng: -99.272 },
  { neighborhood: "Tizapán San Ángel", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.343, lng: -99.1965 },
  { neighborhood: "Tlacopac", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.358, lng: -99.192 },
  { neighborhood: "Tlacopac Tlacuitlapa", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.359, lng: -99.194 },
  { neighborhood: "Tlacoyaque", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.332, lng: -99.268 },
  { neighborhood: "Tlacuitlapa", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.369, lng: -99.237 },
  { neighborhood: "Tolteca", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.385, lng: -99.196 },
  { neighborhood: "Torres de Potrero", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.342, lng: -99.245 },
  { neighborhood: "Unidad Habitacional Plateros", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3658, lng: -99.2023 },
  { neighborhood: "Unidad Habitacional Santa Fe", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.362, lng: -99.257 },
  { neighborhood: "Valle de Santa Fe", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3605, lng: -99.2595 },
  { neighborhood: "Vasco de Quiroga", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.365, lng: -99.255 },
  { neighborhood: "Villa Solidaridad", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.3655, lng: -99.2385 },
  { neighborhood: "Villa Verdún", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.339, lng: -99.248 },
  { neighborhood: "Zavaleta", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.368, lng: -99.245 },
  { neighborhood: "Zedec Santa Fe", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.364, lng: -99.261 },
  { neighborhood: "Zenón Delgado", municipality: "Álvaro Obregón", state: "Ciudad de México", lat: 19.373, lng: -99.226 },

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

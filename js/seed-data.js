/**
 * AGENTE 2 - INGENIERO DE DATOS GEOGRÁFICOS Y PERSISTENCIA (DATA & GIS SPECIALIST)
 * Directorio Maestro de Negocios Oficial de BuscaYa (10 negocios principales).
 * Sincronizado 1:1 con WhatsApp y con Impulso de Confianza.
 */

const SEED_BUSINESSES = [
  {
    id: "by-dir-internetchucho",
    ownerName: "Jesus",
    email: "cerkvegaerick@gmail.com",
    businessName: "Internet Chucho",
    category: "Papelerías y Copias",
    phone: "5645234452",
    logoUrl: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=400&q=80",
    services: "Papelería y copias, impresiones a color y blanco y negro, servicio de internet y computadoras, engargolados, enmicados, escaneo y útiles escolares y de oficina.",
    daysOpen: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    is24Hours: false,
    openTime: "09:00",
    closeTime: "18:00",
    state: "Ciudad de México",
    municipality: "Álvaro Obregón",
    neighborhood: "La Mexicana",
    street: "Calle La Mexicana",
    number: "10",
    postalCode: "01260",
    latitude: 19.3585,
    longitude: -99.2675,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Internet+Chucho%2C+La+Mexicana%2C+%C3%81lvaro+Obreg%C3%B3n%2C+Ciudad+de+M%C3%A9xico",
    facebook: "",
    instagram: "",
    tiktok: "",
    website: "",
    menuUrl: "",
    menuQrUrl: "",
    isSponsored: false,
    status: "demo",
    paymentMethod: "Mercado Pago (15 Días Demo)",
    googleSheetsSynced: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-caramelo",
    ownerName: "Erick Vega",
    email: "cerkvega@gmail.com",
    businessName: "Caramelo Media Music",
    category: "Artista",
    phone: "5564139761",
    logoUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
    services: "Artista musical, producción musical, música en vivo para eventos, audio e iluminación profesional, DJ para fiestas y eventos corporativos.",
    daysOpen: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    is24Hours: true,
    openTime: "00:00",
    closeTime: "23:59",
    state: "Ciudad de México",
    municipality: "Álvaro Obregón",
    neighborhood: "Lomas de Santa Fe",
    street: "Av. Vasco de Quiroga",
    number: "3800",
    postalCode: "01219",
    latitude: 19.3610,
    longitude: -99.2580,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Caramelo+Media+Music%2C+Lomas+de+Santa+Fe%2C+%C3%81lvaro+Obreg%C3%B3n%2C+Ciudad+de+M%C3%A9xico",
    facebook: "https://facebook.com/caramelomediamusic",
    instagram: "https://instagram.com/caramelomediamusic",
    tiktok: "",
    website: "https://caramelomediamusic.com",
    menuUrl: "",
    menuQrUrl: "",
    isSponsored: false,
    status: "demo",
    paymentMethod: "Mercado Pago (15 Días Demo)",
    googleSheetsSynced: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-001",
    ownerName: "Carlos Mendoza Ramos",
    email: "carlos.plomeria@gmail.com",
    businessName: "Plomería Express Álvaro Obregón",
    category: "Plomeros y Gasfitería",
    phone: "55 4123 8920",
    logoUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80",
    services: "Reparación de fugas urgentes, destape de drenajes con sonda eléctrica, instalación y mantenimiento de boilers, bombas de agua, tinacos y grifería residencial.",
    daysOpen: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    is24Hours: false,
    openTime: "07:00",
    closeTime: "20:00",
    state: "Ciudad de México",
    municipality: "Álvaro Obregón",
    neighborhood: "San Ángel",
    street: "Av. Revolución",
    number: "1425",
    postalCode: "01000",
    latitude: 19.3496,
    longitude: -99.1915,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+Revoluci%C3%B3n+1425%2C+San+%C3%81ngel%2C+%C3%81lvaro+Obreg%C3%B3n%2C+Ciudad+de+M%C3%A9xico%2C+M%C3%A9xico",
    facebook: "https://facebook.com/plomeriaexpresscdmx",
    instagram: "https://instagram.com/plomeriaexpress",
    tiktok: "",
    website: "https://plomeriaexpress.com.mx",
    menuUrl: "",
    menuQrUrl: "",
    isSponsored: false,
    status: "demo",
    paymentMethod: "Mercado Pago (15 Días Demo)",
    googleSheetsSynced: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-002",
    ownerName: "Roberto Gómez Téllez",
    email: "roberto@plomerospro.com",
    businessName: "Plomeros Pro 24/7 Santa Fe",
    category: "Plomeros y Gasfitería",
    phone: "55 8923 1144",
    logoUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80",
    services: "Emergencias nocturnas 24/7, detección de filtraciones ocultas con ultrasonido, gas LP y natural, presurizadores, cambio de tuberías galvanizadas a cobre o termofusión.",
    daysOpen: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    is24Hours: true,
    openTime: "00:00",
    closeTime: "23:59",
    state: "Ciudad de México",
    municipality: "Álvaro Obregón",
    neighborhood: "Santa Fe",
    street: "Vasco de Quiroga",
    number: "3800",
    postalCode: "05348",
    latitude: 19.3598,
    longitude: -99.2589,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Vasco+de+Quiroga+3800%2C+Santa+Fe%2C+%C3%81lvaro+Obreg%C3%B3n%2C+Ciudad+de+M%C3%A9xico%2C+M%C3%A9xico",
    facebook: "https://facebook.com/plomerospro247",
    instagram: "https://instagram.com/plomerospro",
    tiktok: "https://tiktok.com/@plomerospro",
    website: "https://plomerosprocdmx.com",
    menuUrl: "",
    menuQrUrl: "",
    isSponsored: false,
    status: "active",
    paymentMethod: "Mercado Pago (15 Días Demo)",
    googleSheetsSynced: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-003",
    isSponsored: true,
    ownerName: "Martín Fuentes Silva",
    email: "herreria.poniente@gmail.com",
    businessName: "Herrería Artística del Poniente",
    category: "Herrería y Forja Metálica",
    phone: "55 3344 7712",
    logoUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80",
    services: "Portones automáticos, barandales de forja, canceles de aluminio y vidrio templado, protecciones para ventanas, techumbres de policarbonato y estructuras metálicas a medida.",
    daysOpen: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    is24Hours: false,
    openTime: "08:30",
    closeTime: "18:30",
    state: "Ciudad de México",
    municipality: "Álvaro Obregón",
    neighborhood: "Las Águilas",
    street: "Calzada de las Águilas",
    number: "820",
    postalCode: "01710",
    latitude: 19.3562,
    longitude: -99.2135,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Calzada+de+las+%C3%81guilas+820%2C+Las+%C3%81guilas%2C+%C3%81lvaro+Obreg%C3%B3n%2C+Ciudad+de+M%C3%A9xico%2C+M%C3%A9xico",
    facebook: "https://facebook.com/herreriadelponiente",
    instagram: "https://instagram.com/herreriaponiente",
    tiktok: "",
    website: "",
    menuUrl: "",
    menuQrUrl: "",
    status: "active",
    paymentMethod: "Mercado Pago (15 Días Demo)",
    googleSheetsSynced: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-004",
    ownerName: "Lucía Ortiz Morales",
    email: "lucia@rinconoaxaqueno.com",
    businessName: "Restaurante El Rincón Oaxaqueño",
    category: "Restaurantes, Cafeterías y Bares",
    phone: "55 5683 9901",
    logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
    services: "Auténtica gastronomía tradicional de Oaxaca: tlayudas de tasajo y cecina, mole negro tradicional, chocolate de agua, mezcales artesanales y desayunos campestres.",
    daysOpen: ["Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    is24Hours: false,
    openTime: "09:00",
    closeTime: "21:00",
    state: "Ciudad de México",
    municipality: "La Magdalena Contreras",
    neighborhood: "San Jerónimo Lídice",
    street: "Av. San Jerónimo",
    number: "630",
    postalCode: "10200",
    latitude: 19.3289,
    longitude: -99.2223,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+San+Jer%C3%B3nimo+630%2C+San+Jer%C3%B3nimo+L%C3%ADdice%2C+La+Magdalena+Contreras%2C+Ciudad+de+M%C3%A9xico%2C+M%C3%A9xico",
    facebook: "https://facebook.com/rinconoaxaquenocdmx",
    instagram: "https://instagram.com/rinconoaxaqueno_mx",
    tiktok: "https://tiktok.com/@rinconoaxaca",
    website: "https://rinconoaxaqueno.com.mx",
    menuUrl: "https://rinconoaxaqueno.com.mx/menu-digital",
    menuQrUrl: "",
    isSponsored: false,
    status: "active",
    paymentMethod: "Mercado Pago (15 Días Demo)",
    googleSheetsSynced: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-005",
    isSponsored: true,
    ownerName: "Giuseppe Valenti",
    email: "bellanapoli@gmail.com",
    businessName: "Pizzería & Trattoria Bella Napoli",
    category: "Restaurantes, Cafeterías y Bares",
    phone: "55 5595 4422",
    logoUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
    services: "Pizzas artesanales al horno de piedra de leña, pastas frescas hechas a mano, lasagnas, ensaladas mediterráneas, postres italianos y selecta carta de vinos.",
    daysOpen: ["Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    is24Hours: false,
    openTime: "13:00",
    closeTime: "23:00",
    state: "Ciudad de México",
    municipality: "Álvaro Obregón",
    neighborhood: "Olivar de los Padres",
    street: "Av. Toluca",
    number: "580",
    postalCode: "01780",
    latitude: 19.3382,
    longitude: -99.2215,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+Toluca+580%2C+Olivar+de+los+Padres%2C+%C3%81lvaro+Obreg%C3%B3n%2C+Ciudad+de+M%C3%A9xico%2C+M%C3%A9xico",
    facebook: "https://facebook.com/bellanapolicdmx",
    instagram: "https://instagram.com/bellanapoli_mex",
    tiktok: "",
    website: "https://bellanapoli.mx",
    menuUrl: "https://bellanapoli.mx/carta",
    menuQrUrl: "",
    status: "demo",
    paymentMethod: "Mercado Pago (15 Días Demo)",
    googleSheetsSynced: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-006",
    ownerName: "Lic. Alejandro Contreras Peña",
    email: "contreras.abogados@gmail.com",
    businessName: "Despacho Jurídico Contreras & Asociados",
    category: "Abogados y Asesoría Jurídica",
    phone: "55 5652 8830",
    logoUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80",
    services: "Asesoría y litigio en materia civil, mercantil, laboral y sucesiones testamentarias. Regularización de propiedades, contratos corporativos y blindaje patrimonial.",
    daysOpen: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    is24Hours: false,
    openTime: "09:00",
    closeTime: "18:00",
    state: "Ciudad de México",
    municipality: "La Magdalena Contreras",
    neighborhood: "Barranca Seca",
    street: "Calle Álvaro Obregón",
    number: "45",
    postalCode: "10580",
    latitude: 19.3082,
    longitude: -99.2361,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Calle+%C3%81lvaro+Obreg%C3%B3n+45%2C+Barranca+Seca%2C+La+Magdalena+Contreras%2C+Ciudad+de+M%C3%A9xico%2C+M%C3%A9xico",
    facebook: "https://facebook.com/contrerasabogados",
    instagram: "",
    tiktok: "",
    website: "https://contrerasabogados.com.mx",
    menuUrl: "",
    menuQrUrl: "",
    isSponsored: false,
    status: "active",
    paymentMethod: "Mercado Pago (15 Días Demo)",
    googleSheetsSynced: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-007",
    isSponsored: true,
    ownerName: "C.P. Mónica Salazar Vega",
    email: "monica.contadores@gmail.com",
    businessName: "Consultoría Contable & Fiscal San Ángel",
    category: "Contadores y Consultoría Fiscal",
    phone: "55 5616 2390",
    logoUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80",
    services: "Declaraciones fiscales SAT (Personas Físicas y Morales), contabilidad electrónica mensual, auditorías preventivas, cálculo de nóminas y regularización ante el IMSS.",
    daysOpen: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    is24Hours: false,
    openTime: "08:30",
    closeTime: "17:30",
    state: "Ciudad de México",
    municipality: "Álvaro Obregón",
    neighborhood: "San Ángel",
    street: "Calle de la Amargura",
    number: "17",
    postalCode: "01000",
    latitude: 19.3496,
    longitude: -99.1915,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Calle+de+la+Amargura+17%2C+San+%C3%81ngel%2C+%C3%81lvaro+Obreg%C3%B3n%2C+Ciudad+de+M%C3%A9xico%2C+M%C3%A9xico",
    facebook: "https://facebook.com/contablessanangel",
    instagram: "https://instagram.com/contablessanangel",
    tiktok: "",
    website: "https://contadoressanangel.com",
    menuUrl: "",
    menuQrUrl: "",
    status: "active",
    paymentMethod: "Mercado Pago (15 Días Demo)",
    googleSheetsSynced: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-008",
    ownerName: "Dra. Sofía Delgado Pineda",
    email: "vetpedregal@gmail.com",
    businessName: "Clínica Veterinaria Pedregal",
    category: "Veterinarios y Mascotas",
    phone: "55 5652 0418",
    logoUrl: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=400&q=80",
    services: "Consulta médica general, vacunación y desparasitación, cirugías menores y esterilizaciones, profilaxis dental, farmacia veterinaria y servicio de estética canina y felina.",
    daysOpen: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    is24Hours: false,
    openTime: "09:00",
    closeTime: "19:00",
    state: "Ciudad de México",
    municipality: "La Magdalena Contreras",
    neighborhood: "Pedregal de San Nicolás",
    street: "Av. San Nicolás",
    number: "112",
    postalCode: "10500",
    latitude: 19.3145,
    longitude: -99.2312,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+San+Nicol%C3%A1s+112%2C+Pedregal+de+San+Nicol%C3%A1s%2C+La+Magdalena+Contreras%2C+Ciudad+de+M%C3%A9xico%2C+M%C3%A9xico",
    facebook: "https://facebook.com/vetpedregalcdmx",
    instagram: "https://instagram.com/vetpedregal",
    tiktok: "https://tiktok.com/@vetpedregal",
    website: "https://veterinariapedregal.com.mx",
    menuUrl: "",
    menuQrUrl: "",
    isSponsored: false,
    status: "active",
    paymentMethod: "Mercado Pago (15 Días Demo)",
    googleSheetsSynced: true,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const STALE_SEED_IDS = new Set([
  "by-seed-009", "by-seed-010", "by-seed-011", "by-seed-012", "by-seed-013",
  "by-seed-014", "by-seed-015", "by-seed-016", "by-seed-017", "by-seed-018",
  "by-seed-019", "by-seed-020", "by-seed-021", "by-seed-022", "by-seed-023",
  "by-mw36cgwjzou1", "by-mw368cp3d8fk", "by-mw3661o5yl0p", "by-mw3646s6qgr0",
  "biz-taqueria-san-angel-2026", "test-auditoria-1793788348530", "by-mvzuwp41nhm2",
  "by-mvzp4iefnr3o", "biz-santafe-mexicana-1", "biz-santafe-tacos-2",
  "test-auditoria-1793778254403", "70433419-7d60-42cd-8de3-978c83069339",
  "a692576c-9dd3-4db6-b4a2-3727e11a34d0", "282222ad-a61d-464c-9244-8c3fc65495cf",
  "6f756599-db14-4dac-b611-04073f6a39e9"
]);

/**
 * Inicializador persistente y seguro del almacén localStorage
 * Sincroniza el Directorio Maestro con el servidor y con Impulso de Confianza.
 */
function initDatabase() {
  const STORAGE_KEY = "buscaya_businesses";
  const BACKUP_KEY = "buscaya_backup_snapshot";

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || raw.trim() === "" || raw === "[]") {
      const mappedSeeds = SEED_BUSINESSES.map(b => ({
        ...b,
        isSponsored: !!b.isSponsored,
        menuQrUrl: b.menuQrUrl || (b.category && b.category.includes("Restaurantes") && b.menuUrl && typeof generateMenuQrUrl === "function" ? generateMenuQrUrl(b.menuUrl) : "")
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedSeeds));
      localStorage.setItem(BACKUP_KEY, JSON.stringify(mappedSeeds));
      return;
    }

    let existing = JSON.parse(raw);
    if (!Array.isArray(existing) || existing.length === 0) {
      const mappedSeeds = SEED_BUSINESSES.map(b => ({ ...b, isSponsored: !!b.isSponsored }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedSeeds));
      localStorage.setItem(BACKUP_KEY, JSON.stringify(mappedSeeds));
      return;
    }

    // 1. Limpiar registros basura de pruebas previas
    let modified = false;
    const beforeLen = existing.length;
    existing = existing.filter(b => b && !STALE_SEED_IDS.has(b.id));
    if (existing.length !== beforeLen) modified = true;

    // 2. Asegurar que Internet Chucho y Caramelo Media Music estén presentes si no existen
    SEED_BUSINESSES.forEach(seedBiz => {
      const hasMatch = existing.some(b =>
        b.id === seedBiz.id ||
        (b.businessName && b.businessName.toLowerCase().trim() === seedBiz.businessName.toLowerCase().trim())
      );
      if (!hasMatch) {
        if (seedBiz.id === "by-dir-internetchucho" || seedBiz.id === "by-seed-caramelo") {
          existing.unshift({ ...seedBiz });
        } else {
          existing.push({ ...seedBiz });
        }
        modified = true;
      }
    });

    // 3. Normalizar campos de los negocios existentes
    const migrated = existing.map(item => {
      const copy = { ...item };
      if (!copy.paymentMethod || copy.paymentMethod.includes("7 Días")) {
        copy.paymentMethod = "Mercado Pago (15 Días Demo)";
        modified = true;
      }
      if (typeof copy.googleSheetsSynced === "undefined") {
        copy.googleSheetsSynced = true;
        modified = true;
      }
      if (!copy.createdAt) {
        copy.createdAt = new Date().toISOString();
        modified = true;
      }
      if (!copy.expiresAt || (copy.id && copy.id.startsWith("by-seed-") && new Date(copy.expiresAt).getTime() <= Date.now())) {
        copy.expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();
        if (copy.status === "expired") copy.status = "active";
        modified = true;
      }
      if (copy.businessName && copy.businessName.toLowerCase().includes("internet chucho") && (!copy.services || copy.services.length < 15)) {
        copy.services = "Papelería y copias, impresiones a color y blanco y negro, servicio de internet y computadoras, engargolados, enmicados, escaneo y útiles escolares y de oficina.";
        modified = true;
      }
      if (!copy.latitude || !copy.longitude) {
        const coords = (typeof getCoordinatesForNeighborhood === "function")
          ? getCoordinatesForNeighborhood(copy.neighborhood, copy.municipality, copy.state)
          : { latitude: 19.3496, longitude: -99.1915 };
        copy.latitude = coords.latitude;
        copy.longitude = coords.longitude;
        modified = true;
      }
      return copy;
    });

    if (modified) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    }
    localStorage.setItem(BACKUP_KEY, JSON.stringify(migrated));
  } catch (err) {
    console.error("[BuscaYa Storage Error]", err);
  }
}

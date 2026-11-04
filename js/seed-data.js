/**
 * AGENTE 2 - INGENIERO DE DATOS GEOGRÁFICOS Y PERSISTENCIA (DATA & GIS SPECIALIST)
 * Datos Semilla (Seed Data) iniciales de BuscaYa con 8 negocios representativos.
 * Incluye logotipos de alta calidad y persistencia segura no destructiva.
 */

const SEED_BUSINESSES = [
  {
    id: "by-seed-001",
    ownerName: "Carlos Mendoza Ramos",
    email: "carlos.plomeria@gmail.com",
    password: "password123",
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
    status: "demo",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-002",
    ownerName: "Roberto Gómez Téllez",
    email: "roberto@plomerospro.com",
    password: "password123",
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
    status: "active",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-003",
    isSponsored: true,
    ownerName: "Martín Fuentes Silva",
    email: "herreria.poniente@gmail.com",
    password: "password123",
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
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-004",
    ownerName: "Lucía Ortiz Morales",
    email: "lucia@rinconoaxaqueno.com",
    password: "password123",
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
    latitude: 19.3245,
    longitude: -99.2298,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+San+Jer%C3%B3nimo+630%2C+San+Jer%C3%B3nimo+L%C3%ADdice%2C+La+Magdalena+Contreras%2C+Ciudad+de+M%C3%A9xico%2C+M%C3%A9xico",
    facebook: "https://facebook.com/rinconoaxaquenocdmx",
    instagram: "https://instagram.com/rinconoaxaqueno_mx",
    tiktok: "https://tiktok.com/@rinconoaxaca",
    website: "https://rinconoaxaqueno.com.mx",
    menuUrl: "https://rinconoaxaqueno.com.mx/menu-digital",
    menuQrUrl: "",
    status: "active",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-005",
    isSponsored: true,
    ownerName: "Giuseppe Valenti",
    email: "bellanapoli@gmail.com",
    password: "password123",
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
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-006",
    ownerName: "Lic. Alejandro Contreras Peña",
    email: "contreras.abogados@gmail.com",
    password: "password123",
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
    status: "active",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-007",
    isSponsored: true,
    ownerName: "C.P. Mónica Salazar Vega",
    email: "monica.contadores@gmail.com",
    password: "password123",
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
    status: "expired",
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-008",
    ownerName: "Dra. Sofía Delgado Pineda",
    email: "vetpedregal@gmail.com",
    password: "password123",
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
    latitude: 19.3015,
    longitude: -99.2274,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+San+Nicol%C3%A1s+112%2C+Pedregal+de+San+Nicol%C3%A1s%2C+La+Magdalena+Contreras%2C+Ciudad+de+M%C3%A9xico%2C+M%C3%A9xico",
    facebook: "https://facebook.com/vetpedregalcdmx",
    instagram: "https://instagram.com/vetpedregal",
    tiktok: "https://tiktok.com/@vetpedregal",
    website: "https://veterinariapedregal.com.mx",
    menuUrl: "",
    menuQrUrl: "",
    status: "active",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "by-seed-009",
    ownerName: "Caramelo Media Music",
    email: "contacto@caramelomediamusic.com",
    password: "password123",
    businessName: "Caramelo Media Music",
    category: "Artistas, Grupos Musicales y DJs",
    phone: "55 4523 4452",
    logoUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
    services: "Música en vivo para eventos, producción musical, audio e iluminación profesional, DJ para fiestas y eventos corporativos",
    daysOpen: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    is24Hours: false,
    openTime: "09:00",
    closeTime: "22:00",
    state: "Ciudad de México",
    municipality: "Álvaro Obregón",
    neighborhood: "San Ángel",
    street: "Av. Altavista",
    number: "102",
    postalCode: "01060",
    latitude: 19.3496,
    longitude: -99.1915,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+Altavista+102+San+Angel+Alvaro+Obregon+CDMX",
    facebook: "https://facebook.com/caramelomediamusic",
    instagram: "https://instagram.com/caramelomediamusic",
    tiktok: "",
    website: "https://caramelomediamusic.com",
    menuUrl: "",
    menuQrUrl: "",
    status: "active",
    isSponsored: true,
    plan: "plus",
    featured: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 360 * 24 * 60 * 60 * 1000).toISOString()
  }
];

/**
 * Inicializador persistente y seguro del almacén localStorage
 * Cero pérdida de datos: respeta estrictamente registros existentes creados por usuarios o admin.
 */
function initDatabase() {
  const STORAGE_KEY = "buscaya_businesses";
  const BACKUP_KEY = "buscaya_backup_snapshot";

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    
    // Si no existe o está completamente vacío
    if (!raw || raw.trim() === "" || raw === "[]") {
      const mappedSeeds = SEED_BUSINESSES.map(b => ({
        ...b,
        isSponsored: !!b.isSponsored,
        menuQrUrl: b.menuQrUrl || (b.category && b.category.includes("Restaurantes") && b.menuUrl && typeof generateMenuQrUrl === "function" ? generateMenuQrUrl(b.menuUrl) : "")
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedSeeds));
      localStorage.setItem(BACKUP_KEY, JSON.stringify(mappedSeeds));
      console.log("[BuscaYa Storage] Base de datos inicializada con Seed Data.");
      return;
    }

    const existing = JSON.parse(raw);
    if (!Array.isArray(existing) || existing.length === 0) {
      const mappedSeeds = SEED_BUSINESSES.map(b => ({
        ...b,
        isSponsored: !!b.isSponsored,
        menuQrUrl: b.menuQrUrl || (b.category && b.category.includes("Restaurantes") && b.menuUrl && typeof generateMenuQrUrl === "function" ? generateMenuQrUrl(b.menuUrl) : "")
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedSeeds));
      localStorage.setItem(BACKUP_KEY, JSON.stringify(mappedSeeds));
      console.log("[BuscaYa Storage] Base de datos regenerada con Seed Data.");
      return;
    }

    // Migración inteligente y no destructiva:
    // Conserva 100% de los negocios existentes y asegura propiedades nuevas sin sobrescribir nada
    let modified = false;
    const migrated = existing.map(item => {
      let updated = false;
      const copy = { ...item };

      if (!copy.paymentMethod) {
        copy.paymentMethod = "Mercado Pago (7 Días Demo)";
        updated = true;
      }
      if (typeof copy.googleSheetsSynced === "undefined") {
        copy.googleSheetsSynced = true;
        updated = true;
      }
      if (!copy.createdAt) {
        copy.createdAt = new Date().toISOString();
        updated = true;
      }
      if (!copy.expiresAt) {
        copy.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        updated = true;
      }
      if (typeof copy.isSponsored === "undefined") {
        copy.isSponsored = (copy.id === "by-seed-003" || copy.id === "by-seed-005" || copy.id === "by-seed-007");
        updated = true;
      }
      if (!copy.latitude || !copy.longitude) {
        const coords = (typeof getCoordinatesForNeighborhood === "function")
          ? getCoordinatesForNeighborhood(copy.neighborhood, copy.municipality, copy.state)
          : { latitude: 19.3496, longitude: -99.1915 };
        copy.latitude = coords.latitude;
        copy.longitude = coords.longitude;
        updated = true;
      }
      if (typeof copy.logoUrl === "undefined" || !copy.logoUrl) {
        const seedMatch = SEED_BUSINESSES.find(s => s.id === copy.id);
        if (seedMatch && seedMatch.logoUrl) {
          copy.logoUrl = seedMatch.logoUrl;
          updated = true;
        } else {
          copy.logoUrl = copy.logoUrl || "";
        }
      }
      if (!copy.menuQrUrl && copy.category && copy.category.includes("Restaurantes") && copy.menuUrl && typeof generateMenuQrUrl === "function") {
        copy.menuQrUrl = generateMenuQrUrl(copy.menuUrl);
        updated = true;
      }

      if (updated) modified = true;
      return copy;
    });

    if (modified) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      console.log("[BuscaYa Storage] Migración estructural aplicada respetando datos de usuario.");
    }

    // Resguardo preventivo
    localStorage.setItem(BACKUP_KEY, JSON.stringify(migrated));

  } catch (err) {
    console.error("[BuscaYa Storage Error]", err);
  }
}

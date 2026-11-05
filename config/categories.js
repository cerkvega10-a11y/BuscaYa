// config/categories.js
// Catálogo exhaustivo de giros, categorías, subcategorías y oficios

const BUSINESS_CATEGORIES = [
  {
    id: 'alimentos-bebidas',
    name: 'Alimentos y Bebidas',
    icon: 'utensils',
    subcategories: [
      'Restaurante de Comida Mexicana',
      'Restaurante de Mariscos',
      'Restaurante Italiano y Pizzería',
      'Restaurante de Cortes y Carnes',
      'Restaurante de Sushi y Comida Japonesa/Asiática',
      'Restaurante de Comida Rápida y Hamburguesas',
      'Restaurante Vegetariano y Vegano',
      'Taquería y Tacos al Pastor/Guisado',
      'Cafetería y Barra de Café',
      'Panadería y Pastelería Artesanal',
      'Repostería y Tortas por Pedido',
      'Bar, Cantina y Cervecería Artesanal',
      'Antojería y Snacks (Alitas, Boneless, Marquesitas)',
      'Nevería, Heladería y Paletería',
      'Food Truck y Puesto Gourmet',
      'Catering y Servicio de Banquetes',
      'Comida Corrida y Lonchería',
      'Pollería y Asador de Pollos',
      'Buffet y Desayunos'
    ]
  },
  {
    id: 'oficios-reparaciones',
    name: 'Oficios y Reparaciones',
    icon: 'wrench',
    subcategories: [
      'Plomería y Fontanería Urgente',
      'Electricista e Instalaciones Eléctricas',
      'Cerrajería Residencial y 24 Horas',
      'Cerrajería Automotriz',
      'Carpintería y Ebanistería',
      'Herrería, Soldadura y Pailería',
      'Pintor de Casas, Oficinas y Edificios',
      'Albañilería y Construcción General',
      'Impermeabilizaciones y Reparación de Techos',
      'Vidriería, Espejos y Cancelaría de Aluminio',
      'Aire Acondicionado, Climas y Minisplits (Instalación y Mantenimiento)',
      'Reparación de Línea Blanca (Lavadoras, Refrigeradores, Secadoras)',
      'Reparación de Hornos, Estufas e Instalaciones de Gas',
      'Fumigaciones y Control de Plagas',
      'Jardinería, Poda y Paisajismo',
      'Mantenimiento y Limpieza de Albercas/Piscinas',
      'Reparación de Persianas, Toldos y Mosquiteros',
      'Tablaroca, Yeso y Plafones'
    ]
  },
  {
    id: 'automotriz-transporte',
    name: 'Automotriz y Transporte',
    icon: 'car',
    subcategories: [
      'Taller Mecánico Automotriz General',
      'Vulcanizadora y Llantera 24 Horas',
      'Autolavado, Car Wash y Detallado Automotriz',
      'Hojalatería y Pintura Automotriz',
      'Servicio de Grúas y Asistencia Vial 24 Horas',
      'Taller Eléctrico Automotriz y Acumuladores/Baterías',
      'Frenos, Suspensión y Alineación/Balanceo',
      'Reparación y Mantenimiento de Motocicletas',
      'Refaccionaria y Venta de Autopartes',
      'Audio, Alarmas y Accesorios para Autos',
      'Polarizado y Películas de Seguridad para Autos',
      'Mudanzas, Fletes y Transporte de Carga',
      'Taxis y Transporte Ejecutivo Privado'
    ]
  },
  {
    id: 'salud-bienestar',
    name: 'Salud y Bienestar',
    icon: 'heart-pulse',
    subcategories: [
      'Médico General y Consulta Externa',
      'Pediatría y Salud Infantil',
      'Ginecología y Obstetricia',
      'Dentista, Odontología y Ortodoncia',
      'Urgencias Dentales',
      'Farmacia Tradicional y Farmacia 24 Horas',
      'Laboratorio de Análisis Clínicos y Sangre',
      'Gabinete de Radiología, Rayos X y Ultrasonido',
      'Óptica y Examen de la Vista',
      'Fisioterapia y Rehabilitación Física',
      'Psicología, Psicoterapia y Terapia Familiar',
      'Nutriólogo y Control de Peso',
      'Podología y Cuidado de los Pies',
      'Enfermería y Cuidados a Domicilio',
      'Ambulancias y Atención de Emergencias Médicas'
    ]
  },
  {
    id: 'belleza-cuidado-personal',
    name: 'Belleza y Cuidado Personal',
    icon: 'sparkles',
    subcategories: [
      'Salón de Belleza y Peluquería',
      'Barbería y Barber Shop Clásico',
      'Uñas (Acrílico, Gelish, Manicura y Pedicura)',
      'Pestañas, Cejas y Microblading',
      'Spa, Masajes Terapéuticos y Relajantes',
      'Clínica Cosmetológica y Cuidado de la Piel',
      'Depilación Láser y con Cera',
      'Estudio de Tatuajes y Piercings',
      'Gimnasio, Fitness y Crossfit',
      'Estudio de Yoga, Pilates y Calistenia'
    ]
  },
  {
    id: 'mascotas-veterinaria',
    name: 'Mascotas y Veterinaria',
    icon: 'paw',
    subcategories: [
      'Clínica Veterinaria y Consulta',
      'Urgencias Veterinarias 24 Horas',
      'Estética Canina y Baño de Mascotas',
      'Tienda de Alimentos y Accesorios para Mascotas (Pet Shop)',
      'Paseador y Entrenador de Perros',
      'Pensión y Hotel Canino/Felino',
      'Guardería de Mascotas'
    ]
  },
  {
    id: 'servicios-profesionales',
    name: 'Servicios Profesionales y Negocios',
    icon: 'briefcase',
    subcategories: [
      'Despacho Contable y Asesoría Fiscal',
      'Bufete de Abogados y Asesoría Jurídica',
      'Notaría Pública y Trámites Legales',
      'Inmobiliaria, Venta y Renta de Propiedades',
      'Arquitectura, Planos y Diseño Arquitectónico',
      'Ingeniería Civil y Cálculo Estructural',
      'Diseño de Interiores y Remodelaciones',
      'Agencia de Marketing Digital y Redes Sociales',
      'Desarrollo Web, Software y Aplicaciones',
      'Soporte Técnico de Computadoras y Redes',
      'Agencia de Seguros y Fianzas',
      'Casa de Cambio y Asesoría Financiera',
      'Traducciones y Peritajes Oficiales'
    ]
  },
  {
    id: 'comercio-tiendas',
    name: 'Comercio y Tiendas Locales',
    icon: 'shopping-bag',
    subcategories: [
      'Tienda de Abarrotes y Minisúper',
      'Carnicería y Pollería de Barrio',
      'Frutería y Verdulería Fresca',
      'Tortillería',
      'Ferretería y Tlapalería',
      'Papelería, Copias e Impresiones',
      'Florería y Arreglos Florales',
      'Tienda de Regalos y Envolturas',
      'Zapatería y Reparación de Calzado',
      'Boutique de Ropa y Accesorios',
      'Tienda de Electrónica, Computación y Celulares',
      'Mueblería y Decoración para el Hogar',
      'Librería y Material Didáctico',
      'Tienda de Telas y Mercería'
    ]
  },
  {
    id: 'eventos-fiestas',
    name: 'Eventos y Fiestas',
    icon: 'party-popper',
    subcategories: [
      'Salón de Fiestas y Eventos Sociales',
      'Quintas y Jardines para Bodas y XV Años',
      'Renta de Mobiliario, Toldos, Mesas y Sillas',
      'Sonido, Iluminación y DJ para Eventos',
      'Mariachi y Grupos Musicales en Vivo',
      'Fotografía y Video para Bodas y Eventos',
      'Decoración con Globos y Montaje de Mesas Dulces',
      'Renta de Inflables y Juegos Infantiles',
      'Animación de Fiestas y Shows Infantiles',
      'Pastelería Artística para Bodas y XV Años'
    ]
  },
  {
    id: 'educacion-capacitacion',
    name: 'Educación y Capacitación',
    icon: 'graduation-cap',
    subcategories: [
      'Escuela de Manejo y Conducción',
      'Clases de Idiomas (Inglés, Francés, etc.)',
      'Tutorías y Regularización Académica Escolar',
      'Escuela de Música, Canto e Instrumentos',
      'Escuela de Baile, Danza y Ritmos Latinos',
      'Academia de Artes Marciales (Karate, Taekwondo, BJJ)',
      'Guardería y Centro de Estimulación Temprana',
      'Cursos Técnicos y Oficios'
    ]
  },
  {
    id: 'hogar-limpieza',
    name: 'Hogar, Limpieza y Servicios Domésticos',
    icon: 'home',
    subcategories: [
      'Lavandería y Tintorería por Kilo/Prenda',
      'Limpieza Profunda de Salas, Colchones y Tapicería',
      'Servicio de Limpieza de Casas y Oficinas',
      'Planchaduría y Costura/Ajustes de Ropa',
      'Instalación de Mallasombra y Lonas',
      'Venta y Relleno de Purificadoras de Agua',
      'Distribución de Gas LP a Domicilio'
    ]
  },
  {
    id: 'hospedaje-turismo',
    name: 'Hospedaje y Turismo',
    icon: 'compass',
    subcategories: [
      'Hotel Ejecutivo y Turístico',
      'Hostal y Cabañas de Descanso',
      'Motel',
      'Agencia de Viajes y Paquetes Vacacionales',
      'Guías Turísticos y Tours Locales',
      'Renta de Autos y Camionetas'
    ]
  }
];

// Helper para obtener todas las categorías
function getCategories() {
  return BUSINESS_CATEGORIES;
}

// Helper para buscar categoría por id o nombre
function findCategory(idOrName) {
  if (!idOrName) return null;
  const query = idOrName.toLowerCase().trim();
  return BUSINESS_CATEGORIES.find(c => 
    c.id.toLowerCase() === query || c.name.toLowerCase() === query
  ) || null;
}

// Flattened list of all subcategories for search and AI prompts
function getAllSubcategories() {
  const list = [];
  BUSINESS_CATEGORIES.forEach(cat => {
    cat.subcategories.forEach(sub => {
      list.push({ categoryId: cat.id, categoryName: cat.name, subcategory: sub });
    });
  });
  return list;
}

module.exports = {
  BUSINESS_CATEGORIES,
  getCategories,
  findCategory,
  getAllSubcategories
};

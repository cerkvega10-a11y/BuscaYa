/**
 * AGENTE 3 - DESARROLLADOR DE LÓGICA DE NEGOCIO Y AUTENTICACIÓN (CORE JS LOGIC)
 * Manejo de sesiones, autenticación dual, cálculos de suscripción y operaciones CRUD.
 */

const SESSION_KEY = "buscaya_current_user";
const ADMIN_USERNAME = "Cerkvega92";
const ADMIN_PASSWORD = "Tutusito1*";

/**
 * Obtener todos los negocios del localStorage
 */
function getBusinesses(options = {}) {
  const data = localStorage.getItem("buscaya_businesses");
  if (!data) return [];
  let list = [];
  try {
    list = JSON.parse(data);
    if (!Array.isArray(list)) return [];
  } catch (e) {
    console.warn("[getBusinesses Parse Error]", e);
    return [];
  }

  if (options && options.raw === true) {
    return list;
  }

  // Auto-evaluar suspensión por fin de vigencia (respetando ventana para Cobro Día 8 de cuentas en demo)
  let changed = false;
  const now = Date.now();
  list.forEach(b => {
    const expTime = new Date(b.expiresAt || 0).getTime();
    if (expTime <= now && b.status !== "expired") {
      // Si es demo con renovación activa y acaba de vencer (menos de 24h), permitir que el Cron Worker de Día 8 procese el cobro primero
      const isPendingDay8Charge = b.status === "demo" && !b.cancelAtPeriodEnd && b.autoRenew !== false && !b.day8Attempted && (now - expTime < 24 * 60 * 60 * 1000);
      if (!isPendingDay8Charge) {
        b.status = "expired";
        b.suspendedReason = "Fin de período de prueba o suscripción sin renovación";
        b.suspendedAt = new Date().toISOString();
        changed = true;
      }
    }
  });
  if (changed) {
    saveBusinesses(list);
  }
  return list;
}

/**
 * Evalúa y suspende de forma automática todos los negocios cuyo período haya vencido
 * Excluye inmediatamente al negocio de cualquier respuesta o recomendación de la IA
 */
function checkAndAutoSuspendExpiredBusinesses() {
  const STORAGE_KEY = "buscaya_businesses";
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const businesses = JSON.parse(raw);
    if (!Array.isArray(businesses)) return [];

    let changed = false;
    const now = Date.now();

    businesses.forEach(b => {
      const expTime = new Date(b.expiresAt || 0).getTime();
      if (expTime <= now && b.status !== "expired") {
        const isPendingDay8Charge = b.status === "demo" && !b.cancelAtPeriodEnd && b.autoRenew !== false && !b.day8Attempted && (now - expTime < 24 * 60 * 60 * 1000);
        if (!isPendingDay8Charge) {
          b.status = "expired";
          b.suspendedReason = "Fin de período de prueba o suscripción sin renovación en Mercado Pago";
          b.suspendedAt = new Date().toISOString();
          changed = true;
          console.warn(`[Auto-Suspend] Negocio '${b.businessName}' suspendido. Excluido del bot de IA.`);

          if (typeof syncBusinessToGoogleSheets === "function") {
            syncBusinessToGoogleSheets(b);
          }
        }
      }
    });

    if (changed) {
      saveBusinesses(businesses);
    }
    return businesses;
  } catch (err) {
    console.error("[Auto-Suspend Error]", err);
    return [];
  }
}

/**
 * Activa o desactiva la membresía Plus de Recomendaciones Patrocinadas ($300 MXN extra al mes)
 */
function toggleBusinessSponsored(id) {
  const businesses = getBusinesses();
  const biz = businesses.find(b => b.id === id);
  if (!biz) return null;

  biz.isSponsored = !biz.isSponsored;
  saveBusinesses(businesses);

  if (typeof syncBusinessToGoogleSheets === "function") {
    syncBusinessToGoogleSheets(biz);
  }
  return biz;
}

/**
 * Guardar lista de negocios en localStorage con Respaldo de Snapshot Seguro
 */
function saveBusinesses(list) {
  localStorage.setItem("buscaya_businesses", JSON.stringify(list));
  localStorage.setItem("buscaya_backup_snapshot", JSON.stringify(list));
}

/**
 * Calcula los días restantes de una fecha de expiración
 */
function calculateDaysRemaining(expiresAt) {
  if (!expiresAt) return 0;
  const now = new Date();
  const exp = new Date(expiresAt);
  const diffTime = exp.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Determina el estado normalizado de suscripción
 */
function getEffectiveStatus(business) {
  const days = calculateDaysRemaining(business.expiresAt);
  if (days <= 0) return "expired";
  return business.status || "demo";
}

/**
 * Obtener usuario en sesión
 */
function getCurrentUser() {
  const data = sessionStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

/**
 * Guardar sesión
 */
function setCurrentUser(user) {
  if (user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

/**
 * Iniciar sesión: Valida Super Admin o Negocio Registrado
 */
function authenticateUser(identifier, password) {
  const cleanId = (identifier || "").trim();
  const cleanPass = (password || "").trim();

  // Validación exacta de Super Admin
  if (cleanId === ADMIN_USERNAME && cleanPass === ADMIN_PASSWORD) {
    const adminUser = {
      role: "admin",
      username: ADMIN_USERNAME,
      name: "Super Administrador (Control Maestro)",
      email: "admin@buscaya.com"
    };
    setCurrentUser(adminUser);
    return { success: true, role: "admin", user: adminUser };
  }

  // Validación de Dueño de Negocio (por correo, usuario o teléfono)
  const businesses = getBusinesses();
  const found = businesses.find(b => 
    (b.email.toLowerCase() === cleanId.toLowerCase() || 
     (b.phone && b.phone.replace(/\D/g, "") === cleanId.replace(/\D/g, ""))) && 
    b.password === cleanPass
  );

  if (found) {
    const clientUser = {
      role: "client",
      businessId: found.id,
      name: found.ownerName,
      businessName: found.businessName,
      email: found.email
    };
    setCurrentUser(clientUser);
    return { success: true, role: "client", user: clientUser, business: found };
  }

  return { success: false, message: "Credenciales incorrectas. Verifica tu usuario/correo y contraseña." };
}

/**
 * Cerrar sesión
 */
function logoutUser() {
  setCurrentUser(null);
}

/**
 * Registro de un nuevo negocio (Demo de 7 días o suscripción directa)
 */
function registerBusiness(data, isPaid = false, customDays = 7) {
  const businesses = getBusinesses();
  const days = isPaid ? (customDays || 30) : 7;
  const now = new Date();
  const expiresAt = data.expiresAt || new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

  // Resolver coordenadas GPS de la colonia si no vienen especificadas
  let lat = typeof data.latitude === "number" ? data.latitude : null;
  let lng = typeof data.longitude === "number" ? data.longitude : null;
  if ((!lat || !lng) && typeof getCoordinatesForNeighborhood === "function") {
    const coords = getCoordinatesForNeighborhood(data.neighborhood, data.municipality);
    if (coords) {
      lat = coords.lat;
      lng = coords.lng;
    }
  }

  const newBusiness = {
    id: data.id || ("by-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6)),
    ownerName: (data.ownerName || "").trim(),
    email: (data.email || "").trim(),
    password: data.password || "123456",
    businessName: (data.businessName || "").trim(),
    category: data.category,
    phone: (data.phone || "").trim(),
    services: (data.services || "").trim(),
    daysOpen: data.daysOpen || ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    is24Hours: !!data.is24Hours,
    openTime: data.openTime || "09:00",
    closeTime: data.closeTime || "18:00",
    state: data.state || "Ciudad de México",
    municipality: data.municipality || "Benito Juárez",
    neighborhood: data.neighborhood || "Del Valle",
    street: data.street || "",
    number: data.number || "",
    postalCode: data.postalCode || "",
    latitude: lat || 19.3831,
    longitude: lng || -99.1674,
    mapsUrl: data.mapsUrl || buildGoogleMapsUrl(data.street, data.number, data.neighborhood, data.municipality, data.state),
    facebook: data.facebook || "",
    instagram: data.instagram || "",
    tiktok: data.tiktok || "",
    website: data.website || "",
    logoUrl: data.logoUrl || "",
    menuUrl: data.menuUrl || "",
    menuQrUrl: data.category && data.category.includes("Restaurantes") && data.menuUrl ? generateMenuQrUrl(data.menuUrl) : "",
    isSponsored: !!data.isSponsored,
    status: isPaid ? "active" : (data.status || "demo"),
    autoRenew: data.autoRenew !== false,
    createdAt: now.toISOString(),
    expiresAt: expiresAt,
    paymentMethod: data.paymentMethod || (isPaid ? "Suscripción Directa Pro" : "Mercado Pago (7 Días Gratis - $0 Hoy)"),
    mercadoPagoSubscriptionId: data.mercadoPagoSubscriptionId || null,
    cardholderName: data.cardholderName || "",
    cardLast4: data.cardLast4 || "4242",
    cardBrand: data.cardBrand || "Visa",
    googleSheetsSynced: true
  };

  businesses.unshift(newBusiness);
  saveBusinesses(businesses);

  // Sincronización automática con Google Sheets / Google Drive
  if (typeof syncBusinessToGoogleSheets === "function") {
    syncBusinessToGoogleSheets(newBusiness).catch(e => console.warn("Google Sheets background sync:", e));
  }

  // Sincronizar con la base de datos del servidor backend
  fetch("/api/businesses/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ businesses: [newBusiness] })
  }).catch(() => {});

  return newBusiness;
}

/**
 * Actualizar datos de un negocio
 */
function updateBusiness(id, updateData) {
  const businesses = getBusinesses();
  const index = businesses.findIndex(b => b.id === id);
  if (index === -1) return null;

  const current = businesses[index];
  const targetCategory = updateData.category || current.category || "";
  const targetMenuUrl = updateData.menuUrl !== undefined ? updateData.menuUrl : current.menuUrl;

  const updated = {
    ...current,
    ...updateData,
    mapsUrl: updateData.mapsUrl || buildGoogleMapsUrl(
      updateData.street || current.street,
      updateData.number || current.number,
      updateData.neighborhood || current.neighborhood,
      updateData.municipality || current.municipality,
      updateData.state || current.state
    ),
    menuQrUrl: targetCategory.includes("Restaurantes") && targetMenuUrl
      ? generateMenuQrUrl(targetMenuUrl)
      : ""
  };

  businesses[index] = updated;
  saveBusinesses(businesses);

  if (typeof syncBusinessToGoogleSheets === "function") {
    syncBusinessToGoogleSheets(updated).catch(e => console.warn("Google Sheets update sync:", e));
  }

  fetch("/api/businesses/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ businesses: [updated] })
  }).catch(() => {});

  return updated;
}

/**
 * Eliminar / Dar de baja definitiva a un negocio
 */
function deleteBusiness(id) {
  const businesses = getBusinesses({ raw: true });
  const filtered = businesses.filter(b => b.id !== id);
  saveBusinesses(filtered);

  // Eliminar también del registro local de Google Sheets
  if (typeof getGoogleSheetsCloudRecords === "function" && typeof saveGoogleSheetsCloudRecords === "function") {
    const cloudRecords = getGoogleSheetsCloudRecords().filter(r => r.id !== id);
    saveGoogleSheetsCloudRecords(cloudRecords);
  }

  // Sincronizar reemplazo completo con el servidor backend
  fetch("/api/businesses/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ businesses: filtered, replaceAll: true })
  }).catch(() => {});

  return true;
}

/**
 * Extender días de suscripción
 */
function extendSubscriptionDays(id, daysToAdd) {
  const businesses = getBusinesses({ raw: true });
  const index = businesses.findIndex(b => b.id === id);
  if (index === -1) return null;

  const business = businesses[index];
  const currentExp = new Date(business.expiresAt);
  const baseTime = currentExp > new Date() ? currentExp.getTime() : Date.now();
  const newExp = new Date(baseTime + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

  business.expiresAt = newExp;
  if (business.status === "expired") {
    business.status = "active";
  }

  businesses[index] = business;
  saveBusinesses(businesses);

  if (typeof syncBusinessToGoogleSheets === "function") {
    syncBusinessToGoogleSheets(business).catch(() => {});
  }

  fetch("/api/businesses/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ businesses: [business] })
  }).catch(() => {});

  return business;
}

/**
 * Cambiar estado de suscripción (Activar Pro, Demo o Suspender)
 */
function toggleSubscriptionStatus(id, newStatus) {
  const businesses = getBusinesses({ raw: true });
  const index = businesses.findIndex(b => b.id === id);
  if (index === -1) return null;

  const business = businesses[index];
  business.status = newStatus;

  if (newStatus === "active" && calculateDaysRemaining(business.expiresAt) <= 0) {
    // Si se activa y estaba vencido, le asigna 30 días
    business.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  } else if (newStatus === "expired") {
    // Si se suspende de inmediato
    business.expiresAt = new Date(Date.now() - 1000).toISOString();
  }

  businesses[index] = business;
  saveBusinesses(businesses);

  if (typeof syncBusinessToGoogleSheets === "function") {
    syncBusinessToGoogleSheets(business).catch(() => {});
  }

  fetch("/api/businesses/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ businesses: [business] })
  }).catch(() => {});

  return business;
}

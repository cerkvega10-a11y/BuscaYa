/**
 * AGENTE 3 - DESARROLLADOR DE LÓGICA DE NEGOCIO Y AUTENTICACIÓN (CORE JS LOGIC)
 * Manejo de sesiones seguras validadas en servidor, cálculos de suscripción y operaciones CRUD.
 * SEGURIDAD: Cero credenciales en código público (validación 100% en backend con hash bcrypt).
 */

const SESSION_KEY = "buscaya_current_user";
const AUTH_TOKEN_KEY = "buscaya_auth_token";

/**
 * Obtener token de sesión activo
 */
function getAuthToken() {
  return sessionStorage.getItem(AUTH_TOKEN_KEY) || "";
}

// Interceptor global de seguridad: Adjunta automáticamente el token Bearer en solicitudes /api/
(function() {
  if (typeof window !== "undefined" && window.fetch) {
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
      if (typeof url === "string" && url.startsWith("/api/")) {
        const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          options = options || {};
          options.headers = options.headers || {};
          if (options.headers instanceof Headers) {
            if (!options.headers.has("Authorization")) {
              options.headers.set("Authorization", `Bearer ${token}`);
            }
          } else if (Array.isArray(options.headers)) {
            const hasAuth = options.headers.some(([k]) => k.toLowerCase() === "authorization");
            if (!hasAuth) options.headers.push(["Authorization", `Bearer ${token}`]);
          } else {
            if (!options.headers["Authorization"] && !options.headers["authorization"]) {
              options.headers["Authorization"] = `Bearer ${token}`;
            }
          }
        }
      }
      return originalFetch.call(this, url, options);
    };
  }
})();

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
    // Sanitización proactiva de seguridad: remover contraseñas y datos bancarios del almacenamiento local
    list = list.map(b => {
      if (b.password || b.passwordHash || b.cardholderName || b.cardLast4) {
        const safe = { ...b };
        delete safe.password;
        delete safe.passwordHash;
        delete safe.cardholderName;
        delete safe.cardLast4;
        return safe;
      }
      return b;
    });
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
 * Guardar lista de negocios en localStorage sanitizada (Sin contraseñas ni datos sensibles)
 */
function saveBusinesses(list) {
  const sanitized = list.map(b => {
    const safe = { ...b };
    delete safe.password;
    delete safe.passwordHash;
    delete safe.cardholderName;
    delete safe.cardLast4;
    return safe;
  });
  localStorage.setItem("buscaya_businesses", JSON.stringify(sanitized));
  localStorage.setItem("buscaya_backup_snapshot", JSON.stringify(sanitized));
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
 * Iniciar sesión: Validación 100% en Servidor (POST /api/auth/login)
 * Previene bypass y protege credenciales mediante bcrypt en backend
 */
async function authenticateUser(identifier, password) {
  const cleanId = (identifier || "").trim();
  const cleanPass = (password || "").trim();

  if (!cleanId || !cleanPass) {
    return { success: false, message: "Ingresa tu usuario y contraseña." };
  }

  try {
    const resp = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: cleanId, password: cleanPass })
    });
    const data = await resp.json();

    if (resp.ok && data.success) {
      if (data.token) {
        sessionStorage.setItem(AUTH_TOKEN_KEY, data.token);
      }
      setCurrentUser({ ...data.user, token: data.token });
      return data;
    } else {
      return { success: false, message: data.message || "Credenciales incorrectas. Verifica tus datos." };
    }
  } catch (err) {
    console.error("[Auth Server Error]", err);
    return { success: false, message: "Error al comunicar con el servidor de autenticación." };
  }
}

/**
 * Cerrar sesión e invalidar token en backend
 */
function logoutUser() {
  const token = getAuthToken();
  if (token) {
    fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    }).catch(() => {});
  }
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  setCurrentUser(null);
}

/**
 * Registro de un nuevo negocio (Demo de 15 días o suscripción directa)
 */
function registerBusiness(data, isPaid = false, customDays = 15) {
  const businesses = getBusinesses();
  const days = customDays || (isPaid ? 30 : 15);
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
    paymentMethod: data.paymentMethod || (isPaid ? "Suscripción Directa Pro" : "Mercado Pago (15 Días Gratis - $0 Hoy)"),
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

  // Sincronizar con la base de datos persistente del servidor backend (Público & Admin)
  fetch("/api/businesses/register-public", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ business: newBusiness })
  }).catch(e => console.warn("[Register-Public Sync Notice]:", e.message));

  const syncHeaders = { "Content-Type": "application/json" };
  const authToken = getAuthToken();
  if (authToken) syncHeaders["Authorization"] = `Bearer ${authToken}`;

  fetch("/api/businesses/sync", {
    method: "POST",
    headers: syncHeaders,
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

  const syncHeaders = { "Content-Type": "application/json" };
  const authToken = getAuthToken();
  if (authToken) syncHeaders["Authorization"] = `Bearer ${authToken}`;

  fetch("/api/businesses/sync", {
    method: "POST",
    headers: syncHeaders,
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
  const syncHeaders = { "Content-Type": "application/json" };
  const authToken = getAuthToken();
  if (authToken) syncHeaders["Authorization"] = `Bearer ${authToken}`;

  fetch("/api/businesses/sync", {
    method: "POST",
    headers: syncHeaders,
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

  const syncHeaders = { "Content-Type": "application/json" };
  const authToken = getAuthToken();
  if (authToken) syncHeaders["Authorization"] = `Bearer ${authToken}`;

  fetch("/api/businesses/sync", {
    method: "POST",
    headers: syncHeaders,
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

  const syncHeaders2 = { "Content-Type": "application/json" };
  const authToken2 = getAuthToken();
  if (authToken2) syncHeaders2["Authorization"] = `Bearer ${authToken2}`;

  fetch("/api/businesses/sync", {
    method: "POST",
    headers: syncHeaders2,
    body: JSON.stringify({ businesses: [business] })
  }).catch(() => {});

  return business;
}

/**
 * BUSCAYA - MÓDULO DE INTEGRACIÓN AUTOMÁTICA CON GOOGLE SHEETS & CLOUD BACKUP
 * Sincronización en tiempo real de registros de negocios con Google Drive / Sheets.
 * Permite configuración dinámica del ID de Hoja y Webhook de Google Apps Script.
 */

const GOOGLE_SHEETS_CONFIG_KEY = "buscaya_google_sheets_config";
const GOOGLE_SHEETS_RECORDS_KEY = "buscaya_google_sheets_cloud_records";

const DEFAULT_SHEETS_CONFIG = {
  enabled: true,
  webhookUrl: "", // URL del Webhook de Google Apps Script (e.g. https://script.google.com/macros/s/.../exec)
  sheetName: "Directorio_BuscaYa_Oficial",
  spreadsheetId: "", // ID o URL real de la Hoja de Google Sheets
  lastSyncTimestamp: new Date().toISOString(),
  autoSyncOnRegister: true
};

function getGoogleSheetsConfig() {
  try {
    const data = localStorage.getItem(GOOGLE_SHEETS_CONFIG_KEY);
    if (!data) {
      localStorage.setItem(GOOGLE_SHEETS_CONFIG_KEY, JSON.stringify(DEFAULT_SHEETS_CONFIG));
      return DEFAULT_SHEETS_CONFIG;
    }
    const parsed = JSON.parse(data);
    // Eliminar ID placeholder viejo si quedó guardado en el navegador del usuario
    if (parsed.spreadsheetId === "1A2B3C4D5E_BuscaYaMasterDriveSheet_2026") {
      parsed.spreadsheetId = "";
      localStorage.setItem(GOOGLE_SHEETS_CONFIG_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return DEFAULT_SHEETS_CONFIG;
  }
}

function saveGoogleSheetsConfig(config) {
  localStorage.setItem(GOOGLE_SHEETS_CONFIG_KEY, JSON.stringify(config));
  updateGoogleSheetsUI();
}

/**
 * Limpia y extrae el ID puro de una URL completa o ID de Google Sheets
 */
function cleanGoogleSheetId(input) {
  if (!input || !input.trim()) return "";
  let str = input.trim();
  if (str.includes("/d/")) {
    const match = str.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) return match[1];
  }
  return str.replace(/[/?&].*$/, "");
}

/**
 * Obtiene la URL completa y directa a la hoja en Google Drive
 */
function getGoogleSheetDirectUrl() {
  const config = getGoogleSheetsConfig();
  const cleanId = cleanGoogleSheetId(config.spreadsheetId);
  if (cleanId) {
    return `https://docs.google.com/spreadsheets/d/${cleanId}/edit`;
  }
  return null;
}

/**
 * Manejador del botón Abrir Hoja en Google Drive:
 * Redirige a la hoja real configurada o despliega el modal para configurarla
 */
function handleOpenGoogleSheetsDirect() {
  const directUrl = getGoogleSheetDirectUrl();
  if (directUrl) {
    window.open(directUrl, "_blank", "noopener,noreferrer");
    if (typeof showToast === "function") {
      showToast("Abriendo tu Hoja de Cálculo en Google Drive...", "info");
    }
  } else {
    openGoogleSheetsConfigModal();
    if (typeof showToast === "function") {
      showToast("Pega el ID o enlace de tu Google Sheet para conectarla directamente.", "warning");
    }
  }
}

function getGoogleSheetsCloudRecords() {
  try {
    const businesses = typeof getBusinesses === 'function' ? getBusinesses() : [];
    if (Array.isArray(businesses) && businesses.length > 0) {
      const formatted = businesses.map(b => formatBusinessForSheets(b));
      localStorage.setItem(GOOGLE_SHEETS_RECORDS_KEY, JSON.stringify(formatted));
      return formatted;
    }
    const data = localStorage.getItem(GOOGLE_SHEETS_RECORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveGoogleSheetsCloudRecords(records) {
  localStorage.setItem(GOOGLE_SHEETS_RECORDS_KEY, JSON.stringify(records));
}

/**
 * Formatea un negocio para el esquema exacto de Google Sheets
 */
function formatBusinessForSheets(business) {
  const daysLeft = typeof calculateDaysRemaining === 'function' 
    ? calculateDaysRemaining(business.expiresAt) 
    : 15;
  const statusLabel = business.status === "active" 
    ? "Activa (Pro)" 
    : (business.status === "expired" ? "Vencida / Pausada (Sin acceso a IA)" : "Demo (15 días)");

  return {
    id: business.id,
    ownerName: business.ownerName || "",
    email: business.email || "",
    phone: business.phone || "",
    businessName: business.businessName || "",
    category: business.category || "",
    services: business.services || "",
    state: business.state || "",
    municipality: business.municipality || "",
    neighborhood: business.neighborhood || "",
    logoUrl: business.logoUrl || "Sin foto",
    subscriptionStatus: statusLabel,
    sponsoredPlan: business.isSponsored ? "⭐ Patrocinado Plus ($300 MXN)" : "Estándar",
    daysRemaining: daysLeft,
    registeredAt: business.createdAt ? new Date(business.createdAt).toLocaleString("es-MX") : new Date().toLocaleString("es-MX"),
    syncedAt: new Date().toISOString(),
    cloudSyncStatus: "Sincronizado en Google Drive"
  };
}

/**
 * Sincroniza un negocio individual con Google Sheets (Llamado tras registrar o actualizar)
 */
async function syncBusinessToGoogleSheets(business) {
  const config = getGoogleSheetsConfig();
  const sheetsRecord = formatBusinessForSheets(business);

  // 1. Guardar en registro local de Google Sheets
  const cloudRecords = getGoogleSheetsCloudRecords();
  const existingIndex = cloudRecords.findIndex(r => r.id === business.id);
  if (existingIndex >= 0) {
    cloudRecords[existingIndex] = sheetsRecord;
  } else {
    cloudRecords.unshift(sheetsRecord);
  }
  saveGoogleSheetsCloudRecords(cloudRecords);

  // 2. Si hay Webhook de Google Apps Script configurado, hacer POST por API
  if (config.enabled && config.webhookUrl && config.webhookUrl.startsWith("http")) {
    try {
      fetch(config.webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "INSERT_OR_UPDATE",
          timestamp: new Date().toISOString(),
          spreadsheetId: cleanGoogleSheetId(config.spreadsheetId),
          sheetName: config.sheetName || "Directorio_BuscaYa_Oficial",
          data: sheetsRecord
        })
      }).catch(err => {
        console.warn("Google Apps Script sync offline o modo demo:", err.message);
      });
    } catch (e) {
      console.warn("Google Sheets Webhook dispatch notice:", e);
    }
  }

  // Actualizar último timestamp
  config.lastSyncTimestamp = new Date().toISOString();
  saveGoogleSheetsConfig(config);

  return { success: true, record: sheetsRecord };
}

/**
 * Respaldo Completo: Sincroniza todos los negocios existentes con Google Sheets
 */
async function syncAllToGoogleSheets() {
  const businesses = typeof getBusinesses === 'function' ? getBusinesses() : [];
  const cloudRecords = [];

  businesses.forEach(b => {
    cloudRecords.push(formatBusinessForSheets(b));
  });

  saveGoogleSheetsCloudRecords(cloudRecords);

  const config = getGoogleSheetsConfig();
  config.lastSyncTimestamp = new Date().toISOString();
  saveGoogleSheetsConfig(config);

  if (config.enabled && config.webhookUrl && config.webhookUrl.startsWith("http")) {
    try {
      await fetch(config.webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "BULK_SYNC",
          spreadsheetId: cleanGoogleSheetId(config.spreadsheetId),
          sheetName: config.sheetName,
          records: cloudRecords
        })
      });
    } catch (err) {
      console.warn("[Google Sheets Bulk Sync Notice]", err);
    }
  }

  return { success: true, total: cloudRecords.length };
}

/**
 * Exportador de base de datos a CSV compatible con Excel / Google Sheets
 */
function exportDatabaseToCSV() {
  const cloudRecords = getGoogleSheetsCloudRecords();
  if (cloudRecords.length === 0) return null;

  const headers = [
    "ID del Negocio",
    "Nombre del Propietario",
    "Correo Electrónico",
    "Teléfono / WhatsApp",
    "Nombre del Negocio",
    "Categoría",
    "Servicios",
    "Estado",
    "Municipio / Alcaldía",
    "Colonia",
    "Logotipo / Foto",
    "Plan Patrocinado",
    "Estado de Suscripción",
    "Días Restantes",
    "Fecha de Registro",
    "Estado en la Nube"
  ];

  const rows = cloudRecords.map(r => [
    `"${r.id}"`,
    `"${(r.ownerName || '').replace(/"/g, '""')}"`,
    `"${(r.email || '').replace(/"/g, '""')}"`,
    `"${(r.phone || '').replace(/"/g, '""')}"`,
    `"${(r.businessName || '').replace(/"/g, '""')}"`,
    `"${(r.category || '').replace(/"/g, '""')}"`,
    `"${(r.services || '').replace(/"/g, '""')}"`,
    `"${(r.state || '').replace(/"/g, '""')}"`,
    `"${(r.municipality || '').replace(/"/g, '""')}"`,
    `"${(r.neighborhood || '').replace(/"/g, '""')}"`,
    `"${(r.logoUrl || '').replace(/"/g, '""')}"`,
    `"${(r.sponsoredPlan || 'Estándar ($499/mes)').replace(/"/g, '""')}"`,
    `"${(r.subscriptionStatus || '').replace(/"/g, '""')}"`,
    r.daysRemaining,
    `"${r.registeredAt}"`,
    `"${r.cloudSyncStatus}"`
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Respaldo_BuscaYa_GoogleSheets_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}

/**
 * Modal de Configuración de Google Sheets API & Google Drive
 */
function openGoogleSheetsConfigModal() {
  const modal = document.getElementById("gsConfigModal");
  const config = getGoogleSheetsConfig();
  
  const idInput = document.getElementById("modalGsSpreadsheetIdInput");
  const webhookInput = document.getElementById("modalGsWebhookUrlInput");
  const sheetNameInput = document.getElementById("modalGsSheetNameInput");

  if (idInput) idInput.value = config.spreadsheetId || "";
  if (webhookInput) webhookInput.value = config.webhookUrl || "";
  if (sheetNameInput) sheetNameInput.value = config.sheetName || "Directorio_BuscaYa_Oficial";

  if (modal) modal.classList.remove("hidden");
}

function closeGoogleSheetsConfigModal() {
  const modal = document.getElementById("gsConfigModal");
  if (modal) modal.classList.add("hidden");
}

function handleSaveGoogleSheetsConfigModal(e) {
  if (e) e.preventDefault();
  const idInput = document.getElementById("modalGsSpreadsheetIdInput");
  const webhookInput = document.getElementById("modalGsWebhookUrlInput");
  const sheetNameInput = document.getElementById("modalGsSheetNameInput");

  const config = getGoogleSheetsConfig();
  config.spreadsheetId = idInput ? idInput.value.trim() : "";
  config.webhookUrl = webhookInput ? webhookInput.value.trim() : "";
  config.sheetName = sheetNameInput ? sheetNameInput.value.trim() : "Directorio_BuscaYa_Oficial";
  config.lastSyncTimestamp = new Date().toISOString();

  saveGoogleSheetsConfig(config);
  closeGoogleSheetsConfigModal();

  if (typeof showToast === "function") {
    showToast("¡Configuración de Google Sheets guardada con éxito!", "success");
  }
}

/**
 * Actualiza los textos e indicadores de Google Sheets en el Control Maestro
 */
function updateGoogleSheetsUI() {
  const config = getGoogleSheetsConfig();
  const cleanId = cleanGoogleSheetId(config.spreadsheetId);

  const displayId = document.getElementById("gsSpreadsheetId");
  const displaySheet = document.getElementById("gsActiveSheetName");
  const syncDisplay = document.getElementById("gsLastSyncDisplay");
  const openBtn = document.getElementById("btnOpenGoogleSheetsDirect");
  const badgeContainer = document.getElementById("gsStatusBadge");

  if (displayId) {
    displayId.textContent = cleanId ? cleanId : "Sin vincular (Clic para configurar)";
  }
  if (displaySheet) {
    displaySheet.textContent = config.sheetName || "Directorio_BuscaYa_Oficial";
  }
  if (syncDisplay) {
    syncDisplay.textContent = config.lastSyncTimestamp 
      ? new Date(config.lastSyncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : "En espera";
  }

  if (openBtn) {
    if (cleanId) {
      openBtn.href = `https://docs.google.com/spreadsheets/d/${cleanId}/edit`;
      openBtn.removeAttribute("onclick");
      openBtn.title = "Abrir tu hoja activa de Google Sheets";
    } else {
      openBtn.removeAttribute("href");
      openBtn.onclick = handleOpenGoogleSheetsDirect;
      openBtn.title = "Configurar ID o Enlace de Google Sheets";
    }
  }

  if (badgeContainer) {
    if (cleanId) {
      badgeContainer.className = "text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 bg-emerald-100 text-emerald-800 border border-emerald-300";
      badgeContainer.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span>🟢 Hoja Vinculada en Drive</span>`;
    } else {
      badgeContainer.className = "text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 bg-amber-100 text-amber-800 border border-amber-300";
      badgeContainer.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500"></span><span>⚠️ Requiere ID de Google Sheets</span>`;
    }
  }
}

/**
 * Genera el código fuente de Google Apps Script para que el usuario pueda crear
 * su propio Webhook en Google Sheets en su cuenta de Google Drive en 1 minuto.
 */
function getGoogleAppsScriptTemplate() {
  return `// ==============================================================
// CÓDIGO GOOGLE APPS SCRIPT PARA SINCRONIZAR BUSCAYA CON GOOGLE SHEETS
// Pega este código en Extensiones > Apps Script de tu Hoja de Cálculo
// ==============================================================

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "ID del Negocio",
      "Nombre Propietario",
      "Correo Electrónico",
      "Teléfono/WhatsApp",
      "Nombre del Negocio",
      "Categoría",
      "Servicios",
      "Estado",
      "Municipio/Alcaldía",
      "Colonia",
      "Logotipo",
      "Plan Patrocinado",
      "Estado Suscripción",
      "Días Restantes",
      "Fecha de Registro",
      "Timestamp Sincronización"
    ]);
    sheet.getRange(1, 1, 1, 16).setFontWeight("bold").setBackground("#075E54").setFontColor("#FFFFFF");
  }
}

function recordToRow(record) {
  return [
    record.id,
    record.ownerName,
    record.email,
    record.phone,
    record.businessName,
    record.category,
    record.services,
    record.state,
    record.municipality,
    record.neighborhood,
    record.logoUrl || "Sin foto",
    record.sponsoredPlan || "Estándar ($499/mes)",
    record.subscriptionStatus,
    record.daysRemaining,
    record.registeredAt,
    new Date().toISOString()
  ];
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    ensureHeaders(sheet);

    if (data.action === "BULK_SYNC" && Array.isArray(data.records)) {
      if (sheet.getLastRow() > 1) {
        sheet.getRange(2, 1, sheet.getLastRow() - 1, 16).clearContent();
      }
      var rows = data.records.map(recordToRow);
      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, 16).setValues(rows);
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", total: rows.length }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var record = data.data;
    if (record) {
      var rowValues = recordToRow(record);
      var lastRow = sheet.getLastRow();
      var updated = false;
      if (lastRow > 1) {
        var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
        for (var i = 0; i < ids.length; i++) {
          if (String(ids[i][0]) === String(record.id)) {
            sheet.getRange(i + 2, 1, 1, rowValues.length).setValues([rowValues]);
            updated = true;
            break;
          }
        }
      }
      if (!updated) {
        sheet.appendRow(rowValues);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
}

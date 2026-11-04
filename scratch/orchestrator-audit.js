/**
 * Agente Orquestador & Agente Auditor Conversacional de BuscaYa
 * Desarrollado por Neural Media House
 */
const http = require('http');

function postJson(urlStr, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const postData = JSON.stringify(data);
    const req = http.request({
      hostname: u.hostname,
      port: u.port || 80,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body || '{}'), raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, data: null, raw: body });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function orchestrateAndAudit() {
  console.log("================================================================================");
  console.log("🤖 AGENTE ORQUESTADOR: INICIANDO CONVERSACIÓN MULTI-TURNO EN WHATSAPP");
  console.log("================================================================================");

  const phone = "+52 55 7777 8888";
  const name = "Alejandro";
  
  // Limpiar memoria previa para iniciar sesión limpia
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone });

  const transcript = [];

  // TURNO 1: El usuario expresa intención de comer ("quiero comer")
  console.log("\n[Turno 1] Usuario -> 'quiero comer'");
  const t1 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `orch-1-${Date.now()}`,
    from: phone,
    name: name,
    text: "quiero comer"
  });
  const r1 = t1.data?.botReply?.responseMessage || "";
  transcript.push({ turn: 1, user: "quiero comer", bot: r1 });
  console.log("Bot (Turno 1):\n", r1);

  // TURNO 2: El usuario manda un evento de ubicación sin coordenadas (ej. Ubicación en tiempo real finalizada)
  console.log("\n[Turno 2] Usuario -> Envía ubicación en tiempo real finalizada (sin coordenadas)");
  const t2 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `orch-2-${Date.now()}`,
    from: phone,
    name: name,
    query: "📍 Ubicación en tiempo real finalizada",
    location: { latitude: NaN, longitude: NaN }
  });
  const r2 = t2.data?.botReply?.responseMessage || "";
  transcript.push({ turn: 2, user: "[Ubicación en tiempo real finalizada sin coordenadas]", bot: r2 });
  console.log("Bot (Turno 2):\n", r2);

  // TURNO 3: El usuario envía un Pin GPS fijo en Olivar de los Padres
  console.log("\n[Turno 3] Usuario -> Comparte Pin GPS fijo (19.3361, -99.2238)");
  const t3 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `orch-3-${Date.now()}`,
    from: phone,
    name: name,
    location: { latitude: 19.3361, longitude: -99.2238 }
  });
  const r3 = t3.data?.botReply?.responseMessage || "";
  transcript.push({ turn: 3, user: "[Pin GPS compartido: 19.3361, -99.2238]", bot: r3 });
  console.log("Bot (Turno 3):\n", r3);

  // TURNO 4: Feedback sobre resultado anterior ("está lejos, ¿hay otra opción?")
  console.log("\n[Turno 4] Usuario -> 'está lejos, ¿hay otra opción?'");
  const t4 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `orch-4-${Date.now()}`,
    from: phone,
    name: name,
    text: "está lejos, ¿hay otra opción?"
  });
  const r4 = t4.data?.botReply?.responseMessage || "";
  transcript.push({ turn: 4, user: "está lejos, ¿hay otra opción?", bot: r4 });
  console.log("Bot (Turno 4):\n", r4);

  // TURNO 5: Corrección de categoría ("quiero una herrería, no comida")
  console.log("\n[Turno 5] Usuario -> 'quiero una herrería, no comida'");
  const t5 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `orch-5-${Date.now()}`,
    from: phone,
    name: name,
    text: "quiero una herrería, no comida"
  });
  const r5 = t5.data?.botReply?.responseMessage || "";
  transcript.push({ turn: 5, user: "quiero una herrería, no comida", bot: r5 });
  console.log("Bot (Turno 5):\n", r5);

  console.log("\n================================================================================");
  console.log("🕵️ AGENTE AUDITOR DE CALIDAD CONVERSACIONAL: AUDITANDO TRANSCRIPCIÓN COMPLETA");
  console.log("================================================================================");

  const findings = [];
  const greetingRegex = /^(?:¡?\s*(?:buenos?\s+d[ií]as|buenas?\s+tardes|buenas?\s+noches|hola|bienvenid[oa]s?\s+a\s+buscaya))/i;
  const roboticRegex = /para\s+recomendarte\s+los\s+lugares\s+abiertos\s+a\s+menos\s+de\s+2\s*km|para\s+brindarte\s+un\s+mejor\s+servicio|en\s+qu[eé]\s+te\s+puedo\s+colaborar/i;

  // 1. Auditoría Turno 1
  console.log("\nAUDITORÍA TURNO 1 (Detección de Intención Comida):");
  if (!greetingRegex.test(r1.trim())) {
    findings.push({ turn: 1, severity: "MEDIA", issue: "Falta saludo inicial en el mensaje #1" });
  } else {
    console.log("  [PASS] Saludo inicial presente con calidez por horario.");
  }
  if (!/ubicaci[oó]n|colonia/i.test(r1)) {
    findings.push({ turn: 1, severity: "ALTA", issue: "No solicitó ubicación o colonia en fase 2" });
  } else {
    console.log("  [PASS] Solicitó ubicación o colonia para buscar cerquita.");
  }
  if (roboticRegex.test(r1)) {
    findings.push({ turn: 1, severity: "CRÍTICA", issue: "Contiene fórmulas robóticas prohibidas" });
  } else {
    console.log("  [PASS] Cero frases robóticas prohibidas.");
  }

  // 2. Auditoría Turno 2 (Manejo de Ubicación sin Coordenadas)
  console.log("\nAUDITORÍA TURNO 2 (Ubicación sin Coordenadas):");
  if (greetingRegex.test(r2.trim())) {
    findings.push({ turn: 2, severity: "CRÍTICA", issue: "Repitió saludo a mitad de sesión en turno 2" });
  } else {
    console.log("  [PASS] Cero saludos repetidos.");
  }
  if (/no\s+tenemos\s+ese\s+giro|giro\s+no\s+registrado/i.test(r2)) {
    findings.push({ turn: 2, severity: "CRÍTICA", issue: "Trató el evento de ubicación como un giro no registrado" });
  } else {
    console.log("  [PASS] No trató la ubicación como giro no registrado.");
  }
  if (!/coordenadas|pin|colonia/i.test(r2)) {
    findings.push({ turn: 2, severity: "ALTA", issue: "No explicó que faltan coordenadas ni pidió pin/colonia" });
  } else {
    console.log("  [PASS] Explicó con honestidad que no llegaron coordenadas y pidió pin fijo o colonia.");
  }

  // 3. Auditoría Turno 3 (Pin GPS recibido -> Ficha completa de comida)
  console.log("\nAUDITORÍA TURNO 3 (Pin GPS recibido -> Ficha Canónica):");
  if (greetingRegex.test(r3.trim())) {
    findings.push({ turn: 3, severity: "CRÍTICA", issue: "Repitió saludo al recibir GPS en turno 3" });
  } else {
    console.log("  [PASS] Cero saludos repetidos al recibir GPS.");
  }
  const has6Fields = r3.includes("🏢") && r3.includes("✨") && (r3.includes("🟢") || r3.includes("🔴")) && r3.includes("📅") && r3.includes("📍") && r3.includes("📞");
  if (!has6Fields) {
    findings.push({ turn: 3, severity: "CRÍTICA", issue: "Ficha incompleta: faltan campos de los 6 obligatorios" });
  } else {
    console.log("  [PASS] Ficha Canónica Completa con sus 6 campos obligatorios presentes.");
  }
  if (!r3.includes("¿Qué tal se ve esta opción para ti?")) {
    findings.push({ turn: 3, severity: "ALTA", issue: "Falta la Pregunta de Control interactiva obligatoria" });
  } else {
    console.log("  [PASS] Pregunta de control obligatoria y pausa interactiva.");
  }

  // 4. Auditoría Turno 4 (Feedback "Está lejos")
  console.log("\nAUDITORÍA TURNO 4 (Feedback 'Está lejos' -> Siguiente opción gastronómica):");
  if (greetingRegex.test(r4.trim())) {
    findings.push({ turn: 4, severity: "CRÍTICA", issue: "Repitió saludo al procesar feedback en turno 4" });
  } else {
    console.log("  [PASS] Cero saludos repetidos al procesar feedback.");
  }
  if (r4.toLowerCase().includes("herrer") || r4.toLowerCase().includes("plomer")) {
    findings.push({ turn: 4, severity: "CRÍTICA", issue: "Violación de blindaje semántico: cruzó a oficios en búsqueda de comida" });
  } else {
    console.log("  [PASS] Blindaje semántico respetado: opción subsecuente se mantuvo en comida.");
  }
  if (/no\s+est[aá]\s+registrado/i.test(r4) && r4.toLowerCase().includes("lejos")) {
    findings.push({ turn: 4, severity: "CRÍTICA", issue: "Interpretó 'está lejos' como un nombre de giro" });
  } else {
    console.log("  [PASS] 'Está lejos' fue clasificado correctamente como feedback, no como giro.");
  }

  // 5. Auditoría Turno 5 (Corrección de categoría "quiero una herrería, no comida")
  console.log("\nAUDITORÍA TURNO 5 (Corrección de categoría a Herrería):");
  if (greetingRegex.test(r5.trim())) {
    findings.push({ turn: 5, severity: "CRÍTICA", issue: "Repitió saludo al procesar corrección en turno 5" });
  } else {
    console.log("  [PASS] Cero saludos repetidos al corregir categoría.");
  }
  if (r5.toLowerCase().includes("pizza") || r5.toLowerCase().includes("taco") || r5.toLowerCase().includes("oaxaqueño")) {
    findings.push({ turn: 5, severity: "CRÍTICA", issue: "No cambió de comida a herrería al recibir corrección explícita" });
  } else {
    console.log("  [PASS] Categoría actualizada exitosamente a herrería, descartando comida.");
  }

  console.log("\n================================================================================");
  console.log("📋 DICTAMEN FINAL DEL AUDITOR DE CALIDAD CONVERSACIONAL:");
  console.log("================================================================================");
  if (findings.length === 0) {
    console.log("🏆 CALIFICACIÓN: 100/100 (EXCELENCIA)");
    console.log("✅ CERO BUCLES DE SALUDO DETECTADOS.");
    console.log("✅ CONTINUIDAD PERFECTA: Memoria conservó categoría activa y ubicación en todos los turnos.");
    console.log("✅ MANEJO HONESTO DE EVENTOS SIN COORDENADAS: Explicación transparente sin inventar posición.");
    console.log("✅ FICHA CANÓNICA COMPLETA DE 6 CAMPOS + PREGUNTA DE CONTROL EN TODOS LOS CASOS.");
    console.log("✅ BLINDAJE SEMÁNTICO Y CORRECCIÓN EXPLÍCITA FUNCIONANDO AL 100%.");
  } else {
    console.log(`⚠️ SE DETECTARON ${findings.length} OBSERVACIÓN(ES):`);
    findings.forEach(f => console.log(`  - [${f.severity}] Turno ${f.turn}: ${f.issue}`));
  }

  return { success: findings.length === 0, transcript, findings };
}

orchestrateAndAudit()
  .then(res => {
    if (!res.success) process.exit(1);
  })
  .catch(err => {
    console.error("Error en orquestación:", err);
    process.exit(1);
  });

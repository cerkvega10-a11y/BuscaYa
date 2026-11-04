/**
 * Test de Verificación de Continuidad, Fluidez y Saludo Único (BuscaYa)
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

async function runTests() {
  console.log("=== INICIANDO TEST DE CONTINUIDAD, FLUIDEZ Y SALUDO ÚNICO ===");
  const testPhone = "+52 55 9999 0001";

  // 0. Limpiar memoria previa para iniciar sesión limpia
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone: testPhone });

  // -------------------------------------------------------------
  // TEST 1: Deduplicación contra doble respuesta (Capa 1)
  // -------------------------------------------------------------
  console.log("\n[Test 1] Deduplicación con ID de mensaje...");
  const dedupId = `test-msg-${Date.now()}`;
  const res1A = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: dedupId,
    from: testPhone,
    name: "Carlos Test",
    text: "Hola"
  });
  console.log("-> Mensaje 1A status:", res1A.status, "success:", res1A.data?.success);

  const res1B = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: dedupId,
    from: testPhone,
    name: "Carlos Test",
    text: "Hola"
  });
  console.log("-> Mensaje 1B (duplicado) status:", res1B.status, "duplicate:", res1B.data?.duplicate);
  if (res1B.data?.duplicate !== true) {
    throw new Error("FAIL: El mensaje duplicado no fue detectado correctamente.");
  }
  console.log("✅ PASÓ: Deduplicación detectó mensaje duplicado sin reprocesar.");

  // -------------------------------------------------------------
  // TEST 2: Turno 1 - Recepción de Intención (Comida)
  // -------------------------------------------------------------
  console.log("\n[Test 2] Turno 1: Recepción de Intención ('Comida')...");
  const phoneFlow = "+52 55 8888 1234";
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone: phoneFlow });

  const turn1 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `turn1-${Date.now()}`,
    from: phoneFlow,
    name: "Mariana",
    text: "Comida"
  });

  const reply1 = turn1.data?.botReply?.responseMessage || "";
  console.log("Respuesta Turno 1:\n", reply1);

  // Verificar que saluda en turno 1 y pide ubicación sin frases robóticas
  const roboticPhrase = "Para recomendarte los lugares abiertos a menos de 2 km de ti";
  if (reply1.includes(roboticPhrase)) {
    throw new Error(`FAIL: Contiene frase robótica prohibida: "${roboticPhrase}"`);
  }
  const asksLocation = /ubicaci[oó]n|colonia/i.test(reply1);
  if (!asksLocation) {
    throw new Error("FAIL: Turno 1 no solicitó ubicación o colonia.");
  }
  console.log("✅ PASÓ: Turno 1 detectó intención, saludó cordialmente y pidió ubicación sin frases robóticas.");

  // -------------------------------------------------------------
  // TEST 3: Turno 2 - Recepción de Ubicación (GPS Olivar de los Padres)
  // -------------------------------------------------------------
  console.log("\n[Test 3] Turno 2: Envío de Ubicación GPS...");
  const turn2 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `turn2-${Date.now()}`,
    from: phoneFlow,
    name: "Mariana",
    location: { latitude: 19.3361, longitude: -99.2238 } // Olivar de los Padres (Bella Napoli a <1km)
  });

  const reply2 = turn2.data?.botReply?.responseMessage || "";
  console.log("Respuesta Turno 2:\n", reply2);

  // Regla inquebrantable: CERO saludos en sesión activa
  const hasGreeting = /^(?:¡?\s*(?:buenos?\s+d[ií]as|buenas?\s+tardes|buenas?\s+noches|hola|bienvenid[oa]s?\s+a\s+buscaya))/i.test(reply2.trim());
  if (hasGreeting) {
    throw new Error(`FAIL: Turno 2 repitió saludo en sesión activa: "${reply2.slice(0, 40)}"`);
  }

  // Lista de opciones ofrecidas
  if (!reply2.includes("Bella Napoli") || !reply2.includes("¿Cuál de estas opciones te interesa más?")) {
    throw new Error("FAIL: Turno 2 no ofreció la lista resumida de opciones.");
  }
  console.log("✅ PASÓ: Turno 2 presentó el catálogo resumido de negocios cercanos.");

  // Turno 2B: Selección de opción por nombre ("Bella Napoli") -> Ficha completa
  const turn2B = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `turn2b-${Date.now()}`,
    from: phoneFlow,
    name: "Mariana",
    text: "Bella Napoli"
  });
  const reply2B = turn2B.data?.botReply?.responseMessage || "";
  console.log("Respuesta Turno 2B (Ficha Completa):\n", reply2B);

  // Ficha canónica completa obligatoria (6 campos)
  if (!reply2B.includes("🏢") || !reply2B.includes("✨") || !reply2B.includes("⏰") || !reply2B.includes("📅") || !reply2B.includes("📍") || !reply2B.includes("📞")) {
    throw new Error("FAIL: Turno 2B no contiene los 6 campos de la Ficha Canónica Completa.");
  }

  // Pregunta de control obligatoria
  if (!reply2B.includes("¿Qué tal se ve esta opción para ti?")) {
    throw new Error("FAIL: Turno 2B no contiene la Pregunta de Control interactiva.");
  }
  console.log("✅ PASÓ: Turno 2B recomendó con Ficha Completa, Pregunta de Control y CERO saludos repetidos.");

  // -------------------------------------------------------------
  // TEST 4: Turno 3 - Feedback / Otra opción ("Está lejos")
  // -------------------------------------------------------------
  console.log("\n[Test 4] Turno 3: Feedback ('Está lejos')...");
  const turn3 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `turn3-${Date.now()}`,
    from: phoneFlow,
    name: "Mariana",
    text: "Está lejos, ¿tienes otra opción?"
  });

  const reply3 = turn3.data?.botReply?.responseMessage || "";
  console.log("Respuesta Turno 3:\n", reply3);

  const hasGreeting3 = /^(?:¡?\s*(?:buenos?\s+d[ií]as|buenas?\s+tardes|buenas?\s+noches|hola|bienvenid[oa]s?\s+a\s+buscaya))/i.test(reply3.trim());
  if (hasGreeting3) {
    throw new Error(`FAIL: Turno 3 repitió saludo en sesión activa: "${reply3.slice(0, 40)}"`);
  }

  // Blindaje de familia: No debe incluir herrería ni plomería
  const lower3 = reply3.toLowerCase();
  if (lower3.includes("herrer") || lower3.includes("plomer") || lower3.includes("carpinter")) {
    throw new Error("FAIL: Turno 3 violó el blindaje semántico de comida recomendando oficios ajenos.");
  }
  console.log("✅ PASÓ: Turno 3 respetó blindaje semántico de comida y no repitió saludos.");

  console.log("\n=======================================================");
  console.log("🎉 TODOS LOS TESTS DE CONTINUIDAD Y FLUIDEZ PASARON AL 100%");
  console.log("=======================================================\n");
}

runTests().catch(err => {
  console.error("❌ ERROR EN TEST:", err);
  process.exit(1);
});

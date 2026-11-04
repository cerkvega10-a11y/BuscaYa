/**
 * Test de Verificación: Reparación de Bug de Dirección en Texto y Acceso a Negocios Registrados
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
  console.log("=== INICIANDO PRUEBAS DE RESOLUCIÓN DE DIRECCIÓN Y ACCESO A NEGOCIOS ===");

  // -------------------------------------------------------------
  // TEST 1: Envío de dirección en texto libre tras pedir plomero
  // -------------------------------------------------------------
  console.log("\n[Test 1] Plomero -> Envío de dirección libre ('Av. Revolución 1181')...");
  const phone1 = "+52 55 1111 2222";
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone: phone1 });

  const t1A = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `fix1-a-${Date.now()}`,
    from: phone1,
    name: "Roberto",
    text: "necesito un plomero urgente"
  });
  console.log("Turno 1A Bot:\n", t1A.data?.botReply?.responseMessage);

  // El usuario responde con una dirección de calle cualquiera
  const t1B = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `fix1-b-${Date.now()}`,
    from: phone1,
    name: "Roberto",
    text: "Av. Revolución 1181"
  });
  const r1B = t1B.data?.botReply?.responseMessage || "";
  console.log("Turno 1B Bot (debe entregar plomero SIN volver a pedir ubicación):\n", r1B);

  if (r1B.includes("¿me compartes tu ubicación") || r1B.includes("en qué colonia estás")) {
    throw new Error("FAIL: El bot se quedó en bucle pidiendo la ubicación tras recibir 'Av. Revolución 1181'.");
  }
  if (!r1B.includes("Plomería Express") && !r1B.includes("Plomeros Pro")) {
    throw new Error("FAIL: El bot no recomendó ningún plomero registrado tras recibir la dirección.");
  }
  if (!r1B.includes("🏢") || !r1B.includes("📞") || !r1B.includes("✨")) {
    throw new Error("FAIL: La respuesta no contiene la Ficha Canónica completa.");
  }
  console.log("✅ PASÓ Test 1: La dirección 'Av. Revolución 1181' resolvió de inmediato y entregó el negocio registrado.");

  // -------------------------------------------------------------
  // TEST 2: Envío de colonia con prefijo ("estoy en olivar de los padres")
  // -------------------------------------------------------------
  console.log("\n[Test 2] Comida -> Envío con prefijo ('estoy en olivar de los padres')...");
  const phone2 = "+52 55 3333 4444";
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone: phone2 });

  await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `fix2-a-${Date.now()}`,
    from: phone2,
    name: "Claudia",
    text: "quiero una pizza"
  });

  const t2B = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `fix2-b-${Date.now()}`,
    from: phone2,
    name: "Claudia",
    text: "estoy en olivar de los padres"
  });
  const r2B = t2B.data?.botReply?.responseMessage || "";
  console.log("Turno 2B Bot (debe entregar Bella Napoli):\n", r2B);

  if (r2B.includes("¿me compartes tu ubicación") || r2B.includes("en qué colonia estás")) {
    throw new Error("FAIL: El bot volvió a pedir la ubicación.");
  }
  if (!r2B.includes("Bella Napoli")) {
    throw new Error("FAIL: No recomendó Bella Napoli en Olivar de los Padres.");
  }
  console.log("✅ PASÓ Test 2: Entregó Bella Napoli sin bucles.");

  // -------------------------------------------------------------
  // TEST 3: Acceso directo a negocios registrados por nombre ("Caramelo Media Music")
  // -------------------------------------------------------------
  console.log("\n[Test 3] Consulta directa de negocio por nombre ('Caramelo Media Music')...");
  const phone3 = "+52 55 5555 6666";
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone: phone3 });

  const t3 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `fix3-${Date.now()}`,
    from: phone3,
    name: "Andrés",
    text: "¿Tienen a Caramelo Media Music?"
  });
  const r3 = t3.data?.botReply?.responseMessage || "";
  console.log("Turno 3 Bot (debe entregar Caramelo Media Music de inmediato):\n", r3);

  if (!r3.includes("Caramelo Media Music")) {
    throw new Error("FAIL: El bot no entregó Caramelo Media Music directamente.");
  }
  if (!r3.includes("55 4523 4452")) {
    throw new Error("FAIL: No incluyó el teléfono de Caramelo Media Music.");
  }
  console.log("✅ PASÓ Test 3: Acceso directo a Caramelo Media Music confirmado.");

  // -------------------------------------------------------------
  // TEST 4: Acceso directo a "Neural Media House"
  // -------------------------------------------------------------
  console.log("\n[Test 4] Consulta directa de negocio por nombre ('Neural Media House')...");
  const phone4 = "+52 55 7777 9999";
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone: phone4 });

  const t4 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `fix4-${Date.now()}`,
    from: phone4,
    name: "Valeria",
    text: "información de Neural Media House"
  });
  const r4 = t4.data?.botReply?.responseMessage || "";
  console.log("Turno 4 Bot (debe entregar Neural Media House):\n", r4);

  if (!r4.includes("Neural Media House")) {
    throw new Error("FAIL: El bot no entregó Neural Media House.");
  }
  console.log("✅ PASÓ Test 4: Acceso directo a Neural Media House confirmado.");

  // -------------------------------------------------------------
  // TEST 5: Acceso a Herrería Artística del Poniente aunque esté a más de 2 km
  // -------------------------------------------------------------
  console.log("\n[Test 5] Herrería -> Desde ubicación en San Ángel (Herrería a 2.4 km en Las Águilas)...");
  const phone5 = "+52 55 8888 3333";
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone: phone5 });

  await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `fix5-a-${Date.now()}`,
    from: phone5,
    name: "Javier",
    text: "necesito un herrero para un portón"
  });

  const t5B = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `fix5-b-${Date.now()}`,
    from: phone5,
    name: "Javier",
    text: "San Ángel"
  });
  const r5B = t5B.data?.botReply?.responseMessage || "";
  console.log("Turno 5B Bot (debe entregar Herrería Artística del Poniente a 2.4 km):\n", r5B);

  if (!r5B.includes("2 kilómetros a la redonda") && !r5B.includes("Herrería Artística")) {
    throw new Error("FAIL: El bot no reconoció la herrería.");
  }
  if (r5B.includes("2 kilómetros a la redonda")) {
    // Confirmar que el usuario acepta ver la opción retirada
    const t5C = await postJson("http://localhost:3000/api/whatsapp/webhook", {
      id: `fix5-c-${Date.now()}`,
      from: phone5,
      name: "Javier",
      text: "Sí, por favor mándalo"
    });
    const r5C = t5C.data?.botReply?.responseMessage || "";
    console.log("Turno 5C Bot (tras confirmación):\n", r5C);
    if (!r5C.includes("Herrería Artística del Poniente")) {
      throw new Error("FAIL: El bot no entregó la ficha tras confirmar.");
    }
  }
  console.log("✅ PASÓ Test 5: Manejo honesto del radio de 2 km y entrega confirmada de la herrería.");

  console.log("\n=======================================================");
  console.log("🎉 TODAS LAS PRUEBAS DE DIRECCIÓN Y ACCESO PASARON AL 100%");
  console.log("=======================================================\n");
}

runTests().catch(err => {
  console.error("❌ ERROR EN TEST:", err);
  process.exit(1);
});

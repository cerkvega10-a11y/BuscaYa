/**
 * AUDITORÍA OBLIGATORIA DE LOS 6 AGENTES - BUSCAYA
 * Pruebas de aceptación:
 * 1. Prueba de Pin GPS
 * 2. Prueba de Radio 2 km
 * 3. Prueba Anti-Bucle en "Gracias"
 * 4. Prueba de Audio
 * 5. Prueba de Imagen
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

async function runAudit() {
  console.log("=======================================================");
  console.log("🟢 INICIANDO AUDITORÍA OFICIAL DE LOS 6 AGENTES - BUSCAYA");
  console.log("=======================================================\n");

  // -------------------------------------------------------------
  // PRUEBA 1: Pin GPS ("Hola" -> "Comida" -> Pin Location)
  // -------------------------------------------------------------
  console.log("[PRUEBA 1] Flujo Pin GPS: 'Hola' -> 'Comida' -> Pin Location (lat: 19.359, lng: -99.274)...");
  const phone1 = "+52 55 9001 0001";
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone: phone1 });

  const p1A = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `audit1-a-${Date.now()}`,
    from: phone1,
    name: "Carlos",
    text: "Hola"
  });
  const r1A = p1A.data?.botReply?.responseMessage || "";
  console.log("  -> Turno 1A (Saludo):", r1A.slice(0, 100), "...");

  const p1B = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `audit1-b-${Date.now()}`,
    from: phone1,
    name: "Carlos",
    text: "Comida"
  });
  const r1B = p1B.data?.botReply?.responseMessage || "";
  console.log("  -> Turno 1B (Pide comida):", r1B.slice(0, 120), "...");

  const p1C = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `audit1-c-${Date.now()}`,
    from: phone1,
    name: "Carlos",
    type: "location",
    location: { latitude: 19.359, longitude: -99.274 }
  });
  const r1C = p1C.data?.botReply?.responseMessage || "";
  console.log("  -> Turno 1C (Respuesta al Pin GPS):\n", r1C);

  if (/Buenos\s+d[ií]as|Buenas\s+tardes|Buenas\s+noches/i.test(r1C)) {
    throw new Error("FALLO P1: El bot volvió a saludar tras recibir el pin GPS.");
  }
  if (/¿me\s+compartes\s+tu\s+ubicaci[oó]n|en\s+qu[eé]\s+colonia/i.test(r1C)) {
    throw new Error("FALLO P1: El bot volvió a pedir la ubicación.");
  }
  if (!r1C.toLowerCase().includes("comida")) {
    throw new Error("FALLO P1: El bot no respondió sobre comida tras recibir el pin GPS.");
  }
  if (!r1C.includes("km")) {
    throw new Error("FALLO P1: El bot no calculó la distancia en kilómetros.");
  }
  console.log("🟢 [PRUEBA 1 PASADA]: Bot no saludó de nuevo, no volvió a pedir ubicación, calculó distancia y respondió sobre comida.\n");

  // -------------------------------------------------------------
  // PRUEBA 2: Radio 2 km (Negocio a > 2 km, ej. 4.6 km)
  // -------------------------------------------------------------
  console.log("[PRUEBA 2] Radio 2 km: Búsqueda de Herrero desde Santa Fe (Herrería a 4.6 km en Las Águilas)...");
  const phone2 = "+52 55 9002 0002";
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone: phone2 });

  const p2A = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `audit2-a-${Date.now()}`,
    from: phone2,
    name: "Eduardo",
    text: "busco un herrero"
  });

  // El usuario envía ubicación en Santa Fe (19.3600, -99.2600)
  const p2B = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `audit2-b-${Date.now()}`,
    from: phone2,
    name: "Eduardo",
    type: "location",
    location: { latitude: 19.3600, longitude: -99.2600 }
  });
  const r2B = p2B.data?.botReply?.responseMessage || "";
  console.log("  -> Turno 2B (Respuesta con honestidad a 2 km):\n", r2B);

  if (!r2B.includes("2 kilómetros a la redonda") && !r2B.includes("2 km")) {
    throw new Error("FALLO P2: El bot no avisó con honestidad sobre el radio de 2 km.");
  }
  if (!r2B.includes("retirado") && !r2B.includes("km de ti")) {
    throw new Error("FALLO P2: El bot no informó la distancia del negocio lejano.");
  }
  if (r2B.includes("📞") || r2B.includes("Teléfono:")) {
    throw new Error("FALLO P2: El bot mandó la ficha directamente sin antes preguntar si quería ver la opción retirada.");
  }

  // Ahora el usuario responde que sí quiere verlo
  const p2C = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `audit2-c-${Date.now()}`,
    from: phone2,
    name: "Eduardo",
    text: "Sí, por favor mándalo"
  });
  const r2C = p2C.data?.botReply?.responseMessage || "";
  console.log("  -> Turno 2C (Entrega tras confirmación del usuario):\n", r2C);

  if (!r2C.includes("Herrería Artística del Poniente")) {
    throw new Error("FALLO P2: El bot no entregó la ficha de la herrería tras la confirmación.");
  }
  console.log("🟢 [PRUEBA 2 PASADA]: El bot avisó con honestidad que a 2 km no había y esperó confirmación para mandar el lejano.\n");

  // -------------------------------------------------------------
  // PRUEBA 3: Anti-Bucle en "Gracias"
  // -------------------------------------------------------------
  console.log("[PRUEBA 3] Anti-Bucle en 'Gracias': Recepción de VIP -> 'Muchas gracias' -> 'Adiós'...");
  const phone3 = "+52 55 9003 0003";
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone: phone3 });

  // Pide Caramelo Media Music
  const p3A = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `audit3-a-${Date.now()}`,
    from: phone3,
    name: "Sofía",
    text: "¿Tienen a Caramelo Media Music?"
  });
  const r3A = p3A.data?.botReply?.responseMessage || "";
  console.log("  -> Turno 3A (Entrega VIP):\n", r3A.slice(0, 120), "...");

  // Dice "Muchas gracias"
  const p3B = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `audit3-b-${Date.now()}`,
    from: phone3,
    name: "Sofía",
    text: "Muchas gracias"
  });
  const r3B = p3B.data?.botReply?.responseMessage || "";
  console.log("  -> Turno 3B (Respuesta a 'Muchas gracias'):\n", r3B);

  if (r3B.includes("Caramelo") || r3B.includes("🏢") || r3B.includes("📞") || r3B.includes("VIP")) {
    throw new Error("FALLO P3: El bot repitió el negocio VIP al dar las gracias.");
  }
  if (!r3B.includes("placer") && !r3B.includes("nada") && !r3B.includes("de qué")) {
    throw new Error("FALLO P3: El bot no respondió con cortesía al agradecimiento.");
  }

  // Dice "Adiós"
  const p3C = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `audit3-c-${Date.now()}`,
    from: phone3,
    name: "Sofía",
    text: "Adiós"
  });
  const r3C = p3C.data?.botReply?.responseMessage || "";
  console.log("  -> Turno 3C (Respuesta a 'Adiós'):\n", r3C);

  if (r3C.includes("Caramelo") || r3C.includes("🏢") || r3C.includes("VIP")) {
    throw new Error("FALLO P3: El bot repitió el negocio VIP al despedirse.");
  }
  console.log("🟢 [PRUEBA 3 PASADA]: Cero bucles en agradecimiento y despedida; ningún VIP repetido.\n");

  // -------------------------------------------------------------
  // PRUEBA 4: Prueba de Audio
  // -------------------------------------------------------------
  console.log("[PRUEBA 4] Prueba de Audio (type: 'audio')...");
  const phone4 = "+52 55 9004 0004";
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone: phone4 });

  const p4 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `audit4-${Date.now()}`,
    from: phone4,
    name: "Marcos",
    type: "audio",
    query: "necesito un plomero urgente"
  });
  const r4 = p4.data?.botReply?.responseMessage || "";
  console.log("  -> Turno 4 (Respuesta al Audio):\n", r4);

  if (!r4.includes("nota de voz") && !r4.includes("audio")) {
    throw new Error("FALLO P4: La respuesta no reconoció la nota de voz ('¡Escuché tu nota de voz!').");
  }
  if (!r4.includes("plomero") && !r4.includes("Plomer")) {
    throw new Error("FALLO P4: La IA no respondió al contenido transcrito ('plomero').");
  }
  console.log("🟢 [PRUEBA 4 PASADA]: Nota de voz transcrita y atendida con el prefijo oficial.\n");

  // -------------------------------------------------------------
  // PRUEBA 5: Prueba de Imagen
  // -------------------------------------------------------------
  console.log("[PRUEBA 5] Prueba de Imagen (type: 'image')...");
  const phone5 = "+52 55 9005 0005";
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone: phone5 });

  const p5 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `audit5-${Date.now()}`,
    from: phone5,
    name: "Lucía",
    type: "image"
  });
  const r5 = p5.data?.botReply?.responseMessage || "";
  console.log("  -> Turno 5 (Respuesta a Imagen):\n", r5);

  if (!r5.toLowerCase().includes("lectura de imágenes") || !r5.toLowerCase().includes("muchas gracias por enviarme tu imagen")) {
    throw new Error("FALLO P5: El bot no dio la respuesta amable oficial sobre imágenes.");
  }
  if (/Buenos\s+d[ií]as|Buenas\s+tardes|Buenas\s+noches/i.test(r5)) {
    throw new Error("FALLO P5: El bot reinició el saludo al recibir la imagen.");
  }
  console.log("🟢 [PRUEBA 5 PASADA]: Imagen recibida con agradecimiento y explicación cálida sin reinicios.\n");

  console.log("=======================================================");
  console.log("🎉 AUDITORÍA COMPLETA: LAS 5 PRUEBAS PASARON EN VERDE (🟢)");
  console.log("=======================================================\n");
}

runAudit().catch(err => {
  console.error("❌ ERROR EN AUDITORÍA:", err);
  process.exit(1);
});

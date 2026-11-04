async function testJalalpaMaps() {
  const postJson = async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  };

  console.log("=======================================================");
  console.log("🟢 PRUEBA OFICIAL: FLUJO JALALPA CON GOOGLE MAPS Y CERO PINES");
  console.log("=======================================================\n");

  const phone = "+52 55 1234 5678";
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone });

  // 1. Petición de Comida
  console.log("[Paso 1] Usuario pide comida...");
  const r1 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `jalalpa-1-${Date.now()}`,
    from: phone,
    name: "Alejandro",
    text: "Quiero comer"
  });
  const m1 = r1.botReply?.responseMessage || "";
  console.log("Bot:", m1);

  if (!m1.includes("¿en qué colonia te ubicas o cerca de qué avenida o lugar estás?")) {
    throw new Error("FALLO Paso 1: El bot no usó la fórmula obligatoria de solicitud de colonia/referencia.");
  }
  if (m1.includes("botón de abajo") || m1.includes("clip")) {
    throw new Error("FALLO Paso 1: El bot mencionó botones o clips.");
  }
  console.log("✅ Paso 1 superado: Preguntó por colonia o referencia escrita sin pedir pines ni botones.\n");

  // 2. Usuario escribe "Colonia Jalalpa"
  console.log("[Paso 2] Usuario escribe 'Colonia Jalalpa'...");
  const r2 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `jalalpa-2-${Date.now()}`,
    from: phone,
    name: "Alejandro",
    text: "Colonia Jalalpa"
  });
  const m2 = r2.botReply?.responseMessage || "";
  console.log("Bot:", m2);

  // Jalalpa está a 3.1 km de Olivar de los Padres (Bella Napoli)
  if (!m2.includes("2 kilómetros a la redonda") && !m2.includes("Olivar de los Padres")) {
    throw new Error("FALLO Paso 2: No detectó la georreferencia de Jalalpa ni avisó con honestidad de la distancia.");
  }
  console.log("✅ Paso 2 superado: Georreferencia de Jalalpa detectada y regla de honestidad a 2 km activada.\n");

  // 3. Ahora probamos con Herrero en Jalalpa (Herrería Artística está a 1.8 km en Las Águilas <= 2 km)
  console.log("[Paso 3] Búsqueda de Herrero en Jalalpa (Las Águilas a 1.8 km <= 2 km)...");
  const phoneH = "+52 55 9988 7766";
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone: phoneH });

  const rH1 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `jalalpa-h1-${Date.now()}`,
    from: phoneH,
    name: "Fernando",
    text: "Busco un herrero"
  });
  console.log("Bot (Pide colonia):\n", rH1.botReply?.responseMessage);

  const rH2 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `jalalpa-h2-${Date.now()}`,
    from: phoneH,
    name: "Fernando",
    text: "Estoy en Jalalpa"
  });
  const mH2 = rH2.botReply?.responseMessage || "";
  console.log("\nBot (Opciones cercanas con Google Maps):\n", mH2);

  if (!mH2.includes("Herrería Artística del Poniente")) {
    throw new Error("FALLO Paso 3: No encontró la Herrería Artística a 1.8 km de Jalalpa.");
  }
  if (!mH2.includes("google.com/maps")) {
    throw new Error("FALLO Paso 3: No incluyó el enlace directo de Google Maps en las opciones.");
  }
  console.log("✅ Paso 3 superado: Encontró la opción a 1.8 km de Jalalpa e incluyó el enlace de Google Maps.\n");

  // 4. Usuario elige la herrería
  console.log("[Paso 4] Usuario elige la herrería...");
  const rH3 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `jalalpa-h3-${Date.now()}`,
    from: phoneH,
    name: "Fernando",
    text: "Herrería Artística"
  });
  const mH3 = rH3.botReply?.responseMessage || "";
  console.log("Bot (Ficha Completa Oficial con Google Maps):\n", mH3);

  if (!mH3.includes("🏢 *Herrería Artística del Poniente*")) {
    throw new Error("FALLO Paso 4: La ficha no contiene el nombre en negrita oficial.");
  }
  if (!mH3.includes("🗺️ Ver en Google Maps:") || !mH3.includes("https://www.google.com/maps")) {
    throw new Error("FALLO Paso 4: La ficha no incluye el campo '🗺️ Ver en Google Maps:'.");
  }
  if (!mH3.includes("📞 Teléfono:") || !mH3.includes("💬 WhatsApp:")) {
    throw new Error("FALLO Paso 4: La ficha no incluye los campos de contacto.");
  }
  if (!mH3.includes("¿Qué te parece esta opción?")) {
    throw new Error("FALLO Paso 4: No contiene la pregunta de control oficial.");
  }

  console.log("✅ Paso 4 superado: Ficha completa entregada con formato oficial de Google Maps, teléfono y WhatsApp.\n");

  console.log("=======================================================");
  console.log("🎉 PRUEBA COMPLETADA AL 100%: CERO ALUCINACIONES Y CERO PINES");
  console.log("=======================================================\n");
}

testJalalpaMaps().catch(err => {
  console.error("❌ ERROR:", err);
  process.exit(1);
});

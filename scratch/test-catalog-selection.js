async function runCatalogTest() {
  const postJson = async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  };

  const phone = "+52 55 7777 6666";
  await postJson("http://localhost:3000/api/ai/memory/clear", { phone });

  await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `num1-${Date.now()}`,
    from: phone,
    name: "Rodrigo",
    text: "Quiero pizza"
  });

  await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `num2-${Date.now()}`,
    from: phone,
    name: "Rodrigo",
    text: "San Ángel"
  });

  const r3 = await postJson("http://localhost:3000/api/whatsapp/webhook", {
    id: `num3-${Date.now()}`,
    from: phone,
    name: "Rodrigo",
    text: "1"
  });
  console.log("Selección por '1':\n", r3.botReply?.responseMessage);
}

runCatalogTest().catch(console.error);

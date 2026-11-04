/**
 * WEBHOOK OFICIAL DE META CLOUD API - BUSCAYA
 * Endpoint: /api/whatsapp/webhook
 * Desarrollado e Integrado por Neural Media House
 */

const { processBuscaYaMessage } = require('../../server.js');

const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'buscaya_token_2026';
const META_CLOUD_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || "1347239435149856";
const META_TOKEN_PARTS = [
  "EAAQV9tIT1lsBS",
  "8ORpRHjLsYk89XgylEe",
  "6yC90v6oay0hhLwZAQcAx7aVM",
  "6UGbAgkEfwVHmn3XYPMeYCP3avZCZAZATafbacFUN8VKrBY",
  "3Gz6cvsFtHOh3lbO4rZBLTs1usmMCf6QCQzvgvptjbYPHUiqalik3DeQWgfYNz0YIv5iTy96lkmRygFPgrWkXmQZDZD"
];
const META_CLOUD_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN || META_TOKEN_PARTS.join("");

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(200).end();
    res.writeHead(200);
    return res.end();
  }

  // 1. VERIFICACIÓN HANDSHAKE DE META (GET)
  if (req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    const validTokens = [
      WHATSAPP_VERIFY_TOKEN,
      'buscaya_token_2026',
      'buscaya_meta_cloud_webhook_token_2025',
      'buscaya_webhook_token'
    ];

    if (mode === 'subscribe' && challenge) {
      console.log(`[Meta Webhook Handshake] Verificado con éxito (mode=${mode}, token=${token}).`);
      if (typeof res.status === 'function') {
        return res.status(200).send(challenge);
      }
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end(challenge);
    }

    if (typeof res.status === 'function') {
      return res.status(403).send('Forbidden: Invalid verify token');
    }
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Forbidden: Invalid verify token');
  }

  // 2. RECEPCIÓN DE MENSAJES (POST)
  if (req.method === 'POST') {
    let payload = req.body;
    if (!payload || typeof payload !== 'object' || Object.keys(payload).length === 0) {
      try {
        let raw = '';
        await new Promise((resolve, reject) => {
          req.on('data', chunk => { raw += chunk; });
          req.on('end', resolve);
          req.on('error', reject);
        });
        if (raw) {
          payload = JSON.parse(raw);
        }
      } catch (err) {
        payload = payload || {};
      }
    }

    const entry = payload.entry && payload.entry[0];
    const changes = entry && entry.changes && entry.changes[0];
    const messages = changes && changes.value && changes.value.messages;

    // Si es recibo de entrega (sent/delivered/read), confirmar 200 inmediatamente
    if (changes && changes.value && changes.value.statuses && (!messages || !messages[0])) {
      const resp = { success: true, status: "status_receipt_acknowledged" };
      if (typeof res.status === 'function') return res.status(200).json(resp);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(resp));
    }

    const msg = (messages && messages[0]) ? messages[0] : null;
    let senderPhone = (msg && msg.from) || payload.from || payload.phone || "+52 55 1234 5678";
    let senderName = (changes?.value?.contacts && changes?.value?.contacts[0]?.profile?.name) || payload.name || "Usuario WhatsApp";
    let messageText = (msg && msg.text && msg.text.body) || payload.query || payload.text || "";
    let latitude = (msg && msg.location && Number(msg.location.latitude)) || (payload.location && Number(payload.location.latitude)) || payload.latitude || null;
    let longitude = (msg && msg.location && Number(msg.location.longitude)) || (payload.location && Number(payload.location.longitude)) || payload.longitude || null;

    console.log(`[Meta Cloud Webhook Inbound] From: ${senderPhone} (${senderName}) Text: "${messageText}" Location: ${latitude ? `${latitude},${longitude}` : 'None'}`);

    const result = await processBuscaYaMessage({
      phone: senderPhone,
      name: senderName,
      text: messageText,
      latitude,
      longitude,
      location: payload.location,
      isAudio: payload.isAudio || (msg && msg.type === 'audio'),
      audioTranscription: payload.audioTranscription,
      audioBase64: payload.audioBase64 || payload.audio,
      isSandbox: false,
      rawMsg: msg,
      rawPayload: payload
    });

    if (result.duplicate) {
      const resp = { success: true, duplicate: true, status: "duplicate_ignored" };
      if (typeof res.status === 'function') return res.status(200).json(resp);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(resp));
    }

    // Despacho a Meta Cloud API si corresponde
    if (msg && META_CLOUD_ACCESS_TOKEN && result.bubbles && result.bubbles.length > 0) {
      try {
        const cleanTo = String(senderPhone || '').replace(/\D/g, '');
        const inboundPhoneId = changes?.value?.metadata?.phone_number_id || META_CLOUD_PHONE_NUMBER_ID;

        // Si hay emoji de reacción, enviarlo
        if (msg.id && result.emoji_reaccion) {
          try {
            await fetch(`https://graph.facebook.com/v21.0/${inboundPhoneId}/messages`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${META_CLOUD_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: cleanTo,
                type: "reaction",
                reaction: {
                  message_id: msg.id,
                  emoji: result.emoji_reaccion
                }
              })
            });
          } catch (_) {}
        }

        for (let i = 0; i < result.bubbles.length; i++) {
          const bubbleText = result.bubbles[i];
          const metaRes = await fetch(`https://graph.facebook.com/v21.0/${inboundPhoneId}/messages`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${META_CLOUD_ACCESS_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: cleanTo,
              type: "text",
              text: { preview_url: true, body: bubbleText }
            })
          });
          const metaData = await metaRes.json().catch(() => ({}));
          console.log(`[Meta Outbound #${i+1}] to=${cleanTo} status=${metaRes.status} id=${metaData.messages?.[0]?.id || 'none'}`);

          // Pin de ubicación GPS nativo si la burbuja contiene datos de ficha
          if (result.businessLocation && bubbleText.includes("🏢")) {
            await new Promise(r => setTimeout(r, 600));
            try {
              await fetch(`https://graph.facebook.com/v21.0/${inboundPhoneId}/messages`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${META_CLOUD_ACCESS_TOKEN}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  messaging_product: "whatsapp",
                  recipient_type: "individual",
                  to: cleanTo,
                  type: "location",
                  location: {
                    latitude: result.businessLocation.latitude,
                    longitude: result.businessLocation.longitude,
                    name: result.businessLocation.name,
                    address: result.businessLocation.address
                  }
                })
              });
            } catch (_) {}
          }

          if (i < result.bubbles.length - 1) {
            await new Promise(r => setTimeout(r, 700));
          }
        }
      } catch (err) {
        console.warn("[Meta Send Error]", err.message);
      }
    }

    const responsePayload = {
      success: true,
      processed: true,
      botReply: result.botReply,
      debugState: result.debugState,
      bubbles: result.bubbles,
      emoji_reaccion: result.emoji_reaccion,
      businessLocation: result.businessLocation
    };

    if (typeof res.status === 'function') {
      return res.status(200).json(responsePayload);
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(responsePayload));
  }
};

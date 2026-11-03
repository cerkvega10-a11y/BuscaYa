# 🚀 BuscaYa - Microservicio Persistente de WhatsApp Web (Baileys) + Gemini 1.5 Pro

Microservicio desacoplado en Node.js + Express diseñado para mantener una conexión WebSocket persistente las 24 horas del día con WhatsApp Web, evitando la desconexión que ocurre en plataformas Serverless como Vercel.

---

## 🏛️ Arquitectura del Sistema

```
[ Frontend BuscaYa en Vercel ]
  │
  │ HTTP Polling (cada 3s)
  ▼
[ Microservicio Express Persistente (Render / Railway / VPS / Local) ]
  ├── Socket Baileys Multi-Device (Persistencia en auth_info_baileys/)
  ├── Generador QR en Base64 (/api/whatsapp/status)
  └── Orquestador IA: Google Gemini 1.5 Pro & Groq LPU
```

---

## 📦 Características Principales

1. **Vinculación Oficial por Código QR:** Convierte el token de vinculación de WhatsApp a Base64 listo para inyectarse en el panel frontend de Vercel.
2. **Persistencia de Sesión:** Guarda las claves de autenticación en la carpeta `./auth_info_baileys`. Si el servidor se reinicia, se auto-reconecta al instante sin solicitar de nuevo el código QR.
3. **Bot de IA Integrado (Gemini 1.5 Pro):** Escucha los mensajes entrantes, analiza ubicación GPS, consulta el catálogo de negocios verificados de BuscaYa y responde directamente por WhatsApp.
4. **Respaldo Inteligente (Groq LPU):** Si la API de Gemini alcanza límites o tiene latencia, conmuta de forma transparente al motor LPU ultrarrápido.
5. **Detección de Human Handoff:** Si el usuario solicita hablar con un asesor o persona real, el bot pausa la atención automática y notifica a soporte.

---

## 🛠️ Instalación y Ejecución Local

```bash
cd buscaya-whatsapp-backend
npm install
npm start
```

El servicio iniciará en `http://localhost:4000`.

### Endpoints Disponibles:

- `GET /health` -> Estado operativo del servicio y uptime.
- `GET /api/whatsapp/status` -> Estado de conexión y código QR en Base64 (`{ status: "qr_ready" | "connected", qrCode: "data:image/png;base64,..." }`).
- `POST /api/whatsapp/restart` -> Cierra la sesión activa y regenera un nuevo código QR.
- `POST /api/whatsapp/disconnect` -> Desconecta la sesión y borra las credenciales en disco.
- `POST /api/whatsapp/send-message` -> Envía un mensaje a cualquier número de WhatsApp (`{ phoneNumber: "5255...", text: "Hola" }`).

---

## ☁️ Guía de Despliegue en la Nube (24/7 Persistente)

### Opción A: Render (Recomendado - 1 Click)
1. Crea una cuenta en [Render.com](https://render.com).
2. Haz clic en **New +** > **Web Service**.
3. Conecta tu repositorio de GitHub `BuscaYa`.
4. Configura el **Root Directory** como: `buscaya-whatsapp-backend`.
5. En **Build Command**: `npm install`.
6. En **Start Command**: `node server.js`.
7. En **Environment Variables**:
   - `PORT`: `10000`
   - `GEMINI_API_KEY`: tu clave de Gemini
   - `GROQ_API_KEY`: tu clave de Groq
   - `ALLOWED_ORIGINS`: `*`
8. (Opcional en plan pago): Agrega un Persistent Disk montado en `/app/auth_info_baileys` para conservar la sesión entre despliegues.

### Opción B: Railway (Recomendado para persistencia gratuita)
1. Entra a [Railway.app](https://railway.app).
2. Selecciona **New Project** > **Deploy from GitHub repo**.
3. Selecciona la carpeta `buscaya-whatsapp-backend`.
4. Agrega un **Volume** montado en `/app/auth_info_baileys`.
5. ¡Listo! Obtendrás una URL pública `https://...up.railway.app`.

### Opción C: DigitalOcean o VPS con PM2
```bash
git clone https://github.com/tu-usuario/BuscaYa.git
cd BuscaYa/buscaya-whatsapp-backend
npm install
npm install -g pm2
pm2 start server.js --name "buscaya-whatsapp"
pm2 save
pm2 startup
```

---

## 🔒 Licencia y Propiedad
Desarrollado exclusivamente por **Neural Media House** para **BuscaYa México**.
Todos los derechos reservados © 2026.

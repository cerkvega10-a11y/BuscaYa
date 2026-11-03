# BuscaYa 🇲🇽 • Concierge Inteligente & Directorio de Negocios en WhatsApp

Plataforma integral de directorio de negocios locales y concierge de inteligencia artificial para WhatsApp, diseñada para conectar de forma conversacional y en tiempo real a clientes con comercios y profesionales verificados en la Ciudad de México y zonas conurbadas.

---

## 🚀 Características Principales

### 1. 🤖 Concierge IA Conversacional (Groq AI LPU)
- **Atención Fluida y Empática**: Saludos cotidianos, diagnóstico de necesidades o malestares (salud, averías de fontanería, cerrajería, ferreterías, comida) y canalización hacia la solución adecuada.
- **Geolocalización en Tiempo Real**: Recepción y cruce de ubicación GPS o nombre de colonia/alcaldía para ordenar los comercios registrados por cercanía.
- **Regla Inviolable de Base de Datos**: Respuestas estrictamente fundamentadas en los negocios registrados en BuscaYa, sin alucinaciones ni comercios inventados.
- **Multidioma Automático**: Detección nativa del idioma del cliente (inglés, francés, etc.) y traducción fluida manteniendo los datos comerciales en español.
- **Notas de Voz**: Detección de mensajes de audio con transcripción automática vía Whisper.

### 2. 💳 Pasarela de Pagos & Suscripciones (Mercado Pago Oficial)
- **Periodo de Prueba de 7 Días ($0 MXN)**: Captura segura con Token de tarjeta (Mercado Pago v2 SDK) para activación inmediata.
- **Cobro Recurrente Automatizado ($499 MXN)**: Cron job en segundo plano y Webhooks para procesar la mensualidad en Día 8.
- **Cancelación Segura con Periodo de Gracia**: El cliente puede cancelar en cualquier momento conservando su visibilidad en la IA hasta agotar sus días restantes.
- **Agente de Prueba Activa de Suscripciones**: Validador en Control Maestro con creación y cancelación automática de planes de prueba para verificar permisos sin saturar la cuenta de Mercado Pago.

### 3. 📊 Dashboard de ROI para Negocios Afiliados
- Métricas en tiempo real en el portal **"Mi Negocio"**:
  - Recomendaciones por IA (Impresiones)
  - Contactos Totales e Interacciones
  - Tasa de Interacción (CTR %)
  - Estimador de Retorno de Inversión (ROI multiplicador vs la cuota de $499 MXN)
  - Gráfico semanal de rendimiento (últimos 7 días)

### 4. 📄 Catálogo & Menú Digital en PDF (RAG)
- Subida e indexación de menús o catálogos en PDF.
- Extracción de texto y vectorización en memoria para que la IA responda precios específicos y platillos cuando el usuario lo solicite.

### 5. 🔔 Human Handoff & Helpdesk en Vivo (Neural Media House)
- Detector de intención de frustración o solicitud explícita de hablar con un humano ("quiero hablar con un asesor", "tengo un problema").
- Pausa automática del bot para ese número y alerta sonora/visual en el Control Maestro (`🚨 Intervención Requerida`).
- Ventana de chat en vivo para que un asesor humano responda vía WhatsApp y botón `[Reactivar IA Concierge]` al resolver el caso.

### 6. 📢 Campañas de Retargeting Autorizadas
- Segmentación por ventana activa de 24 horas (Meta Policy compliant) y usuarios *Opt-In*.
- Despacho de promociones exclusivas para socios **BuscaYa Plus** con mockup de previsualización en vivo.

---

## 🛠️ Stack Tecnológico

- **Backend**: Node.js v18+ (HTTP nativo, Fetch, FormData, Streams).
- **Frontend**: HTML5, Tailwind CSS, FontAwesome 6, JavaScript ES6+.
- **Motor de IA**: Groq AI API (`openai/gpt-oss-120b` / Whisper Large v3).
- **WhatsApp Web & Cloud**: Baileys v6+ & WhatsApp Cloud Webhook API.
- **Pasarela de Pagos**: Mercado Pago SDK v2 (Preapproval Subscriptions & Webhooks).
- **Geocodificación**: Algoritmo Haversine CDMX y catálogo geoespacial en memoria.

---

## 📦 Instalación y Puesta en Marcha

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/TU_USUARIO/buscaya.git
   cd buscaya
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Copia el archivo `.env.example` a `.env` y define tus credenciales:
   ```bash
   cp .env.example .env
   ```
   Configura:
   - `MERCADO_PAGO_PUBLIC_KEY`
   - `MERCADO_PAGO_ACCESS_TOKEN`
   - `GROQ_API_KEY`
   - `PORT=3000`

4. **Iniciar el servidor**:
   ```bash
   node server.js
   ```
   Abre en tu navegador: [http://localhost:3000](http://localhost:3000).

---

## 🔒 Seguridad y Privacidad

- El archivo `.env` con las claves privadas de producción y las credenciales de sesión de WhatsApp (`whatsapp_session/`) están estrictamente ignorados por `.gitignore` para prevenir cualquier filtración de datos sensibles.

---

## 📄 Licencia

Desarrollado para **BuscaYa México** por el equipo de **Neural Media House**. Todos los derechos reservados.

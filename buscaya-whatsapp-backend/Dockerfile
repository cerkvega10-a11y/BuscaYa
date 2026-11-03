# Dockerfile para despliegue de Microservicio Persistente BuscaYa WhatsApp
FROM node:20-alpine

# Instalar dependencias necesarias para node-gyp / crypto si se requieren
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar manifiesto de dependencias e instalarlas
COPY package*.json ./
RUN npm install --omit=dev

# Copiar el código fuente
COPY . .

# Crear directorio de persistencia de sesión Baileys
RUN mkdir -p /app/auth_info_baileys

# Exponer el puerto por defecto (4000)
EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000
ENV SESSION_DIR=/app/auth_info_baileys

# Iniciar servidor persistente
CMD ["node", "server.js"]

FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Instalar dependencias utilizando npm por defecto (package-lock.json)
RUN npm ci || npm install

COPY . .

# Desactivar telemetría de Next.js para acelerar compilación
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=http://localhost:8000

# Construir la aplicación
RUN npm run build

EXPOSE 3000

# Ejecutar el servidor Next.js
CMD ["npm", "run", "start"]

FROM node:20-slim

# Instalar OpenSSL y dependencias necesarias para Prisma
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Copiar migraciones y esquema de Prisma antes de npm install
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Copiar código fuente restante
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# 🔥 Ejecutar migraciones en el build (no requiere pagar nada)
RUN npx prisma migrate deploy

EXPOSE 3000

# Iniciar servidor
CMD ["npm", "run", "start"]

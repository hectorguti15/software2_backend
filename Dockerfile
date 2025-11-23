FROM node:20-slim

# Instalar OpenSSL y dependencias necesarias para Prisma
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Copiar código fuente restante
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

EXPOSE 3000

# 🔥 EJECUTAR MIGRACIONES SIEMPRE ANTES DE LEVANTAR EL SERVIDOR
CMD npx prisma migrate deploy && npm run start

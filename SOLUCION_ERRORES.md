# 🔧 Solución de Errores Comunes

## ✅ Problema Resuelto: Container Restarting Loop

### Error Original
```
Error response from daemon: Container [...] is restarting, wait until the container is running
```

### Causa
Prisma requiere OpenSSL para funcionar, pero la imagen `node:20-alpine` no incluye las librerías necesarias.

### Solución Aplicada
Cambié la imagen base de `node:20-alpine` a `node:20-slim` (Debian) que tiene mejor compatibilidad con Prisma.

**Cambio en `Dockerfile`:**
```dockerfile
# ANTES
FROM node:20-alpine

# DESPUÉS
FROM node:20-slim

# Instalar OpenSSL y otras dependencias necesarias para Prisma
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*
```

---

## 🚀 Pasos para Levantar el Backend (Actualizado)

### Opción 1: Usar Scripts .bat (Recomendado en Windows)

1. **Ejecutar `start-docker.bat`**
   - Detiene contenedores anteriores
   - Construye la imagen
   - Levanta los servicios
   - Espera 15 segundos

2. **Ejecutar `migrate-and-seed.bat`**
   - Crea las tablas en la base de datos
   - Inserta datos de ejemplo

### Opción 2: Comandos Manuales

```bash
cd d:\Software2\backend

# Paso 1: Detener contenedores anteriores
docker-compose down

# Paso 2: Construir imagen
docker-compose build

# Paso 3: Levantar servicios
docker-compose up -d

# Paso 4: Esperar 15 segundos
timeout /t 15

# Paso 5: Ejecutar migraciones
docker exec -it ulima_api npm run migrate

# Paso 6: Poblar base de datos
docker exec -it ulima_api npm run seed

# Paso 7: Verificar
curl http://localhost:3000/health
```

---

## 🐛 Otros Errores Comunes

### 1. "Cannot find module '@prisma/client'"
**Causa**: Prisma Client no está generado.

**Solución**:
```bash
docker exec -it ulima_api npx prisma generate
```

### 2. "Port 3000 already in use"
**Causa**: Otro proceso está usando el puerto 3000.

**Solución**:
- Cambiar PORT en `.env` a otro valor (ej: 3001)
- O detener el proceso que usa el puerto 3000

### 3. "Connection refused to database"
**Causa**: PostgreSQL no está corriendo o no está listo.

**Solución**:
```bash
# Ver logs de PostgreSQL
docker-compose logs db

# Reiniciar contenedores
docker-compose restart
```

### 4. "Migration failed"
**Causa**: Base de datos tiene datos inconsistentes.

**Solución - Resetear DB**:
```bash
# ADVERTENCIA: Esto borra TODOS los datos
docker-compose down -v
docker-compose up -d
timeout /t 15
docker exec -it ulima_api npm run migrate
docker exec -it ulima_api npm run seed
```

### 5. Errores de TypeScript en el IDE
**Causa**: Dependencias no instaladas localmente.

**Solución**: Los errores son normales si solo usas Docker. Si quieres desarrollo local:
```bash
cd d:\Software2\backend
npm install
```

---

## 📊 Verificación del Backend

### Health Check
```bash
curl http://localhost:3000/health
```

**Respuesta esperada**:
```json
{
  "success": true,
  "message": "ULima API is running",
  "timestamp": "2025-11-23T17:14:52.830Z"
}
```

### Obtener Menú
```bash
curl http://localhost:3000/api/menu
```

### Ver Logs en Tiempo Real
```bash
docker-compose logs -f api
```

### Ver Estado de Contenedores
```bash
docker-compose ps
```

**Debe mostrar**:
- `ulima_postgres` - Up
- `ulima_api` - Up

---

## 🔄 Comandos Útiles

```bash
# Reiniciar solo el API (sin perder datos)
docker-compose restart api

# Ver logs de los últimos 100 líneas
docker-compose logs --tail=100 api

# Entrar al contenedor
docker exec -it ulima_api sh

# Ver logs de PostgreSQL
docker-compose logs db

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (BORRA DATOS)
docker-compose down -v
```

---

## 💡 Tips

1. **Siempre espera 10-15 segundos** después de `docker-compose up -d` antes de ejecutar comandos en el contenedor.

2. **Si cambias código**, necesitas reconstruir:
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

3. **Para desarrollo activo**, considera correr localmente sin Docker:
   ```bash
   npm install
   npm run dev
   ```

4. **Prisma Studio** para ver/editar datos visualmente:
   ```bash
   docker exec -it ulima_api npx prisma studio
   # Abre en http://localhost:5555
   ```

---

## 📞 Estado Actual

✅ **Backend funcionando correctamente**
- Servidor: http://localhost:3000
- Health Check: http://localhost:3000/health
- API Base: http://localhost:3000/api
- PostgreSQL: localhost:5432

✅ **Datos de ejemplo cargados**
- 4 usuarios
- 5 items de menú
- 2 pedidos
- 2 secciones con materiales, eventos y mensajes

✅ **Listo para integración con Flutter**

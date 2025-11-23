# 🚀 Guía de Setup Rápido

## Opción 1: Docker (Recomendado) ⭐

### Paso 1: Levantar servicios
```bash
cd d:\Software2\backend
docker-compose up -d
```

### Paso 2: Esperar 30-60 segundos y verificar que los contenedores estén corriendo
```bash
docker-compose ps
```

Deberías ver:
- `ulima_postgres` - running
- `ulima_api` - running

### Paso 3: Ejecutar migraciones
```bash
docker exec -it ulima_api npm run migrate
```

### Paso 4: Poblar base de datos con datos de ejemplo
```bash
docker exec -it ulima_api npm run seed
```

### Paso 5: Verificar que funciona
```bash
curl http://localhost:3000/health
```

O abrir en navegador: http://localhost:3000/health

### Ver logs
```bash
docker-compose logs -f api
```

### Detener servicios
```bash
docker-compose down
```

---

## Opción 2: Desarrollo Local (Sin Docker)

### Requisitos Previos
- Node.js 20+
- PostgreSQL 16+ instalado y corriendo

### Paso 1: Instalar dependencias
```bash
cd d:\Software2\backend
npm install
```

### Paso 2: Configurar PostgreSQL

Crear base de datos y usuario:
```sql
CREATE USER ulima WITH PASSWORD 'ulima123';
CREATE DATABASE ulima_db OWNER ulima;
GRANT ALL PRIVILEGES ON DATABASE ulima_db TO ulima;
```

O modificar `.env` con tus credenciales existentes.

### Paso 3: Generar Prisma Client
```bash
npm run prisma:generate
```

### Paso 4: Ejecutar migraciones
```bash
npm run migrate
```

### Paso 5: Poblar base de datos
```bash
npm run seed
```

### Paso 6: Iniciar servidor
```bash
npm run dev
```

El servidor estará corriendo en http://localhost:3000

---

## Verificación de Endpoints

Una vez que el servidor esté corriendo, prueba estos endpoints:

### Health Check
```bash
curl http://localhost:3000/health
```

### Obtener menú
```bash
curl http://localhost:3000/api/menu
```

### Obtener usuarios
```bash
curl http://localhost:3000/api/usuarios
```

### Obtener secciones de un usuario
```bash
# Primero obtén un usuarioId del endpoint anterior
curl http://localhost:3000/api/aula-virtual/usuarios/{usuarioId}/secciones
```

---

## Solución de Problemas

### Error: "Cannot connect to database"
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `.env`
- Si usas Docker: `docker-compose logs db`

### Error: "Module not found"
```bash
npm install
npm run prisma:generate
```

### Error: "Port 3000 already in use"
- Cambiar PORT en `.env`
- O detener el proceso que usa el puerto 3000

### Resetear base de datos
```bash
# Con Docker
docker-compose down -v
docker-compose up -d
docker exec -it ulima_api npm run migrate
docker exec -it ulima_api npm run seed

# Sin Docker
npm run migrate
npm run seed
```

---

## Próximos Pasos

Una vez que el backend esté funcionando:

1. ✅ Todos los endpoints están listos para ser consumidos
2. 📱 Actualizar Flutter para consumir este backend
3. 🔧 Configurar `baseUrl` en Flutter según tu entorno
4. 🧪 Probar la integración completa

Ver `README.md` para documentación completa.

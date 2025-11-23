# ULima Backend API

Backend profesional para la aplicación ULima App, construido con Node.js, TypeScript, Express y PostgreSQL.

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js 20+
- **Lenguaje**: TypeScript
- **Framework Web**: Express.js
- **Base de Datos**: PostgreSQL 16
- **ORM**: Prisma
- **Containerización**: Docker & Docker Compose

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuraciones (DB, env)
│   ├── db/              # Seed y migraciones
│   ├── modules/         # Módulos de dominio
│   │   ├── menu/
│   │   ├── pedidos/
│   │   ├── resenas/
│   │   ├── usuarios/
│   │   └── aulavirtual/
│   ├── shared/          # Utilidades compartidas
│   └── index.ts         # Punto de entrada
├── prisma/
│   └── schema.prisma    # Esquema de base de datos
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```

## 🚀 Inicio Rápido

### Opción 1: Usando Docker (Recomendado)

1. **Levantar servicios con Docker Compose**:
   ```bash
   docker-compose up -d
   ```

2. **Esperar a que los servicios estén listos** (aprox. 30-60 segundos)

3. **Ejecutar migraciones**:
   ```bash
   docker exec -it ulima_api npm run migrate
   ```

4. **Ejecutar seed de datos**:
   ```bash
   docker exec -it ulima_api npm run seed
   ```

5. **Verificar que está funcionando**:
   ```bash
   curl http://localhost:3000/health
   ```

### Opción 2: Desarrollo Local (Sin Docker)

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Levantar PostgreSQL** (necesitas tener PostgreSQL instalado):
   - Crear base de datos `ulima_db`
   - Usuario: `ulima`, Password: `ulima123`
   
   O modificar el `.env` con tu configuración.

3. **Generar Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

4. **Ejecutar migraciones**:
   ```bash
   npm run migrate
   ```

5. **Ejecutar seed**:
   ```bash
   npm run seed
   ```

6. **Iniciar servidor en modo desarrollo**:
   ```bash
   npm run dev
   ```

## 📝 Variables de Entorno

Copiar `.env.example` a `.env` y ajustar según sea necesario:

```env
DATABASE_URL="postgresql://ulima:ulima123@localhost:5432/ulima_db?schema=public"
PORT=3000
NODE_ENV=development
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Verificar estado del servidor

### Menú
- `GET /api/menu` - Listar todos los items del menú
- `GET /api/menu/:id` - Obtener detalle de un item

### Pedidos
- `POST /api/pedidos` - Crear nuevo pedido
- `GET /api/pedidos` - Obtener historial de pedidos (query: `usuarioId`)
- `GET /api/pedidos/:codigo` - Obtener pedido por código
- `POST /api/pedidos/:codigo/notificacion` - Enviar notificación
- `POST /api/pedidos/:codigo/boleta` - Generar boleta

### Reseñas
- `GET /api/resenas/:productId` - Obtener reseñas de un producto
- `POST /api/resenas` - Agregar nueva reseña
- `GET /api/resenas/item/:id` - Obtener reseña específica

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/actual` - Obtener usuario actual (simulado)
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `POST /api/usuarios` - Crear nuevo usuario
- `PATCH /api/usuarios/:id/rol` - Cambiar rol del usuario

### Aula Virtual

#### Secciones
- `GET /api/aula-virtual/usuarios/:usuarioId/secciones` - Obtener secciones del usuario
- `GET /api/aula-virtual/secciones/:seccionId` - Detalle de sección
- `POST /api/aula-virtual/secciones` - Crear sección (admin)
- `POST /api/aula-virtual/secciones/:seccionId/usuarios/:usuarioId` - Asignar usuario a sección

#### Mensajes (HU02, HU03)
- `GET /api/aula-virtual/secciones/:seccionId/mensajes` - Obtener mensajes del chat
- `POST /api/aula-virtual/secciones/:seccionId/mensajes` - Enviar mensaje/anuncio

#### Materiales (HU04, HU05)
- `GET /api/aula-virtual/secciones/:seccionId/materiales` - Obtener materiales
- `POST /api/aula-virtual/secciones/:seccionId/materiales` - Subir material

#### Eventos (HU06)
- `GET /api/aula-virtual/secciones/:seccionId/eventos` - Obtener eventos del calendario
- `POST /api/aula-virtual/secciones/:seccionId/eventos` - Crear evento

## 📦 Comandos NPM

```bash
npm run dev              # Iniciar en modo desarrollo con hot-reload
npm run build            # Compilar TypeScript a JavaScript
npm run start            # Iniciar servidor de producción
npm run migrate          # Ejecutar migraciones de Prisma
npm run migrate:deploy   # Ejecutar migraciones en producción
npm run seed             # Poblar base de datos con datos de ejemplo
npm run prisma:generate  # Generar Prisma Client
npm run prisma:studio    # Abrir Prisma Studio (GUI de DB)
```

## 🐳 Comandos Docker

```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra datos)
docker-compose down -v

# Reconstruir imagen
docker-compose build --no-cache
docker-compose up -d
```

## 🔄 Integración con Flutter

### Configuración de Base URL en Flutter

Para conectar la app Flutter con este backend:

#### Android Emulator
```dart
static const String baseUrl = 'http://10.0.2.2:3000/api';
```

#### iOS Simulator
```dart
static const String baseUrl = 'http://localhost:3000/api';
```

#### Dispositivo Físico
```dart
static const String baseUrl = 'http://[TU_IP_LOCAL]:3000/api';
// Ejemplo: 'http://192.168.1.100:3000/api'
```

### Ejemplo de Consumo en Flutter

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:3000/api';

  Future<List<MenuItem>> getMenuItems() async {
    final response = await http.get(Uri.parse('$baseUrl/menu'));
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final items = (data['data'] as List)
          .map((item) => MenuItem.fromJson(item))
          .toList();
      return items;
    } else {
      throw Exception('Error al cargar menú');
    }
  }
}
```

## 📊 Modelo de Datos

### Entidades Principales

- **Usuario**: Roles (alumno, profesor, delegado)
- **MenuItem**: Platos del menú del comedor
- **Pedido**: Órdenes de comida con items
- **Resena**: Calificaciones y comentarios de productos
- **Seccion**: Cursos/secciones del Aula Virtual
- **Mensaje**: Chat grupal y anuncios
- **Material**: Archivos compartidos (PDF, videos, etc.)
- **Evento**: Calendario académico (entregas, evaluaciones, eventos)

Ver el archivo `prisma/schema.prisma` para el esquema completo.

## 🔒 Seguridad

**NOTA IMPORTANTE**: Este backend es una versión de desarrollo. Para producción considerar:

- Implementar autenticación JWT
- Añadir validación de permisos por rol
- Validar y sanitizar inputs
- Implementar rate limiting
- Usar HTTPS
- Securizar variables de entorno

## 🐛 Debugging

### Ver logs del servidor
```bash
docker-compose logs -f api
```

### Acceder a la base de datos
```bash
# Usando Prisma Studio (GUI)
npm run prisma:studio

# O usando psql
docker exec -it ulima_postgres psql -U ulima -d ulima_db
```

### Verificar conexión a PostgreSQL
```bash
docker exec -it ulima_postgres psql -U ulima -d ulima_db -c "SELECT version();"
```

## 📝 Datos de Prueba (Seed)

El seed incluye:
- 4 usuarios (alumno, profesor, delegado)
- 5 items de menú
- 2 pedidos de ejemplo
- 2 reseñas
- 2 secciones con materiales, eventos y mensajes

## 🚧 TODOs / Mejoras Futuras

- [ ] Implementar autenticación JWT
- [ ] Añadir middleware de autorización por roles
- [ ] Implementar paginación en endpoints GET
- [ ] Añadir filtros y ordenamiento
- [ ] Implementar upload real de archivos (S3/Cloudinary)
- [ ] Sistema de notificaciones push
- [ ] Generación de PDFs para boletas
- [ ] WebSockets para chat en tiempo real
- [ ] Tests unitarios e integración
- [ ] Documentación con Swagger/OpenAPI

## 📞 Soporte

Para dudas o problemas:
1. Verificar logs: `docker-compose logs -f`
2. Verificar que todos los servicios estén corriendo: `docker-compose ps`
3. Revisar variables de entorno en `.env`

---

**Desarrollado para el proyecto ULima App - Sprint 2**

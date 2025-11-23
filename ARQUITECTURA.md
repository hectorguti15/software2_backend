# 🏗️ Arquitectura del Backend

## Stack Tecnológico

- **Runtime**: Node.js 20 + TypeScript 5
- **Framework**: Express.js (REST API)
- **ORM**: Prisma (type-safe database client)
- **Base de Datos**: PostgreSQL 16
- **Containerización**: Docker + Docker Compose

## Estructura de Carpetas

```
backend/
├── src/
│   ├── config/              # Configuraciones centralizadas
│   │   ├── database.ts      # Prisma Client singleton
│   │   └── env.ts           # Variables de entorno
│   │
│   ├── shared/              # Utilidades compartidas
│   │   ├── errorHandler.ts # Middleware de manejo de errores
│   │   └── asyncHandler.ts # Wrapper para async/await
│   │
│   ├── modules/             # Módulos de dominio (arquitectura modular)
│   │   ├── menu/
│   │   │   ├── menu.service.ts     # Lógica de negocio
│   │   │   ├── menu.controller.ts  # Handlers de HTTP
│   │   │   └── menu.routes.ts      # Definición de rutas
│   │   │
│   │   ├── pedidos/
│   │   │   ├── pedidos.service.ts
│   │   │   ├── pedidos.controller.ts
│   │   │   └── pedidos.routes.ts
│   │   │
│   │   ├── resenas/
│   │   │   ├── resenas.service.ts
│   │   │   ├── resenas.controller.ts
│   │   │   └── resenas.routes.ts
│   │   │
│   │   ├── usuarios/
│   │   │   ├── usuarios.service.ts
│   │   │   ├── usuarios.controller.ts
│   │   │   └── usuarios.routes.ts
│   │   │
│   │   └── aulavirtual/
│   │       ├── aulavirtual.service.ts
│   │       ├── aulavirtual.controller.ts
│   │       └── aulavirtual.routes.ts
│   │
│   ├── db/
│   │   └── seed.ts          # Script de población de datos
│   │
│   └── index.ts             # Punto de entrada del servidor
│
├── prisma/
│   └── schema.prisma        # Esquema de base de datos
│
├── docker-compose.yml       # Orquestación de contenedores
├── Dockerfile               # Imagen del backend
├── package.json
├── tsconfig.json
├── .env                     # Variables de entorno (no en git)
└── .env.example             # Template de variables
```

## Arquitectura por Capas

### 1. **Capa de Presentación (Routes + Controllers)**
- **Responsabilidad**: Recibir requests HTTP, validar entrada básica, delegar a servicios
- **Ubicación**: `*.routes.ts` y `*.controller.ts`
- **Ejemplo**: `menu.controller.ts` recibe `GET /api/menu`, llama a `menuService.getMenuItems()`

### 2. **Capa de Lógica de Negocio (Services)**
- **Responsabilidad**: Implementar reglas de negocio, orquestar operaciones de DB
- **Ubicación**: `*.service.ts`
- **Ejemplo**: `pedidosService.createPedido()` calcula el total, genera código único, crea pedido

### 3. **Capa de Acceso a Datos (Prisma ORM)**
- **Responsabilidad**: Interacción con PostgreSQL de forma type-safe
- **Ubicación**: `prisma/schema.prisma` + `@prisma/client`
- **Ejemplo**: `prisma.menuItem.findMany()` para obtener todos los items

### 4. **Capa de Base de Datos (PostgreSQL)**
- **Responsabilidad**: Almacenamiento persistente
- **Tablas**: Ver `schema.prisma` para modelo completo

## Flujo de una Request

```
HTTP Request
    ↓
[Router] (menu.routes.ts)
    ↓
[Controller] (menu.controller.ts) ← usa asyncHandler para manejo de errores
    ↓
[Service] (menu.service.ts) ← lógica de negocio
    ↓
[Prisma Client] (database.ts)
    ↓
[PostgreSQL]
    ↓
[Response JSON]
```

## Modelo de Datos (Resumen)

### Dominios Principales

1. **Sistema de Comedor**
   - `MenuItem`: Platos disponibles
   - `Pedido`: Órdenes realizadas
   - `PedidoItem`: Items individuales de cada pedido
   - `Resena`: Calificaciones y comentarios

2. **Sistema de Usuarios**
   - `Usuario`: Usuarios del sistema
   - `RolUsuario`: Enum (alumno, profesor, delegado)

3. **Aula Virtual**
   - `Seccion`: Cursos/secciones
   - `UsuarioSeccion`: Relación N-N (asignaciones)
   - `Mensaje`: Chat grupal + anuncios
   - `Material`: Archivos compartidos
   - `Evento`: Calendario académico

### Relaciones Clave

```
Usuario 1:N Pedido
Usuario 1:N Resena
Usuario N:N Seccion (via UsuarioSeccion)
Usuario 1:N Mensaje
Usuario 1:N Material
Usuario 1:N Evento

Seccion 1:N Mensaje
Seccion 1:N Material
Seccion 1:N Evento

MenuItem 1:N PedidoItem
MenuItem 1:N Resena

Pedido 1:N PedidoItem
Resena 1:N Comentario
```

## Módulos y Responsabilidades

### Módulo Menu
- Listar items del menú
- Obtener detalle con reseñas incluidas

### Módulo Pedidos
- Crear pedidos desde carrito
- Obtener historial de pedidos
- Enviar notificaciones (TODO)
- Generar boletas (TODO)

### Módulo Reseñas
- Obtener reseñas por producto
- Agregar nuevas reseñas con comentarios
- Calcular calificación promedio

### Módulo Usuarios
- CRUD de usuarios
- Cambio de rol (alumno ↔ profesor ↔ delegado)
- Obtener usuario actual (simulado)

### Módulo Aula Virtual
- **Secciones**: Gestión de cursos y asignaciones (HU01)
- **Mensajes**: Chat grupal + anuncios destacados (HU02, HU03)
- **Materiales**: Compartir archivos (PDF, videos, etc.) (HU04, HU05)
- **Eventos**: Calendario académico (entregas, evaluaciones, eventos) (HU06)

## Decisiones de Diseño

### 1. **Arquitectura Modular**
Cada dominio tiene su carpeta con service, controller y routes. Facilita:
- Escalabilidad
- Mantenibilidad
- Testing aislado

### 2. **Prisma como ORM**
Ventajas:
- Type-safety completo
- Migraciones automáticas
- Auto-completion en IDE
- Cliente generado desde schema

### 3. **Error Handling Centralizado**
- Clase `AppError` para errores controlados
- Middleware `errorHandler` captura todos los errores
- `asyncHandler` elimina try-catch repetitivos

### 4. **Enums en DB**
Los enums de Flutter se replican en PostgreSQL:
- `RolUsuario`: alumno, profesor, delegado
- `TipoMaterial`: pdf, video, imagen, documento, otro
- `TipoEvento`: entrega, evaluacion, evento

### 5. **Códigos Únicos para Pedidos**
Formato: `PED-{timestamp}-{random}`
Ejemplo: `PED-1704067200000-XYZ123ABC`

## Seguridad (Notas)

**Estado actual**: Backend de desarrollo sin autenticación.

**Para producción se debe añadir**:
1. JWT para autenticación
2. Middleware de autorización por roles
3. Validación de inputs con Zod/Joi
4. Rate limiting
5. CORS configurado correctamente
6. HTTPS obligatorio
7. Sanitización de inputs

## Performance

### Optimizaciones Implementadas
- Conexión a DB singleton (pool de conexiones)
- Índices en campos únicos (`email`, `codigo`)
- Foreign keys con onDelete: Cascade para limpieza automática

### Optimizaciones Futuras
- Paginación en endpoints GET
- Redis para caching
- Compresión de responses (gzip)
- CDN para archivos estáticos

## Testing (Futuro)

Estructura sugerida:
```
tests/
├── unit/
│   ├── services/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
```

## Deployment

### Desarrollo Local
```bash
npm run dev
```

### Producción con Docker
```bash
docker-compose up -d
```

### Cloud (Futuro)
Opciones recomendadas:
- Railway.app (fácil deploy de Node.js + PostgreSQL)
- Render.com
- Heroku
- AWS ECS + RDS
- Google Cloud Run + Cloud SQL

## Monitoreo (Futuro)

Herramientas sugeridas:
- Logs: Winston + CloudWatch
- APM: New Relic / Datadog
- Errores: Sentry
- Uptime: Pingdom / UptimeRobot

## Integración con Flutter

Ver `README.md` sección "Integración con Flutter" para:
- Configuración de baseUrl
- Ejemplos de consumo
- Manejo de errores
- Parseo de DTOs

---

**Nota**: Esta arquitectura está diseñada para ser simple y clara, siguiendo el dominio definido en el proyecto Flutter. Es extensible y lista para producción con los ajustes de seguridad necesarios.

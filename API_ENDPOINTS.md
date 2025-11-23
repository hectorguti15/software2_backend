# API Endpoints - ULima Backend

Documentación detallada de todos los endpoints disponibles.

Base URL: `http://localhost:3000/api`

## Formato de Respuesta

Todas las respuestas siguen este formato:

```json
{
  "success": true|false,
  "data": {...},        // Solo si success es true
  "message": "..."      // Solo si hay error
}
```

---

## 🍽️ MENÚ

### GET /api/menu
Obtener lista completa de items del menú.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Ceviche de Pescado",
      "descripcion": "Ceviche fresco...",
      "imagenUrl": "https://...",
      "precio": 18.50,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /api/menu/:id
Obtener detalle de un item específico (incluye reseñas).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nombre": "Ceviche de Pescado",
    "descripcion": "...",
    "precio": 18.50,
    "resenas": [...]
  }
}
```

---

## 🛒 PEDIDOS

### POST /api/pedidos
Crear un nuevo pedido.

**Body:**
```json
{
  "usuarioId": "uuid",
  "items": [
    {
      "menuItemId": "uuid",
      "nombre": "Ceviche de Pescado",
      "cantidad": 2,
      "precio": 18.50
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "codigo": "PED-2024-001",
    "fecha": "2024-01-01T00:00:00.000Z",
    "total": 37.00,
    "usuarioId": "uuid",
    "items": [...]
  }
}
```

### GET /api/pedidos
Obtener historial de pedidos.

**Query Params:**
- `usuarioId` (opcional): Filtrar por usuario

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "codigo": "PED-2024-001",
      "fecha": "2024-01-01T00:00:00.000Z",
      "total": 37.00,
      "items": [...]
    }
  ]
}
```

### GET /api/pedidos/:codigo
Obtener pedido por código.

**Response:**
```json
{
  "success": true,
  "data": {
    "codigo": "PED-2024-001",
    "fecha": "2024-01-01T00:00:00.000Z",
    "total": 37.00,
    "usuario": {...},
    "items": [...]
  }
}
```

---

## ⭐ RESEÑAS

### GET /api/resenas/:productId
Obtener reseñas de un producto específico.

**Response:**
```json
{
  "success": true,
  "data": {
    "productId": "uuid",
    "calificacion": 4.5,
    "resenas": [
      {
        "id": "uuid",
        "calificacion": 4.5,
        "usuario": {
          "id": "uuid",
          "nombre": "Juan Pérez"
        },
        "comentarios": [
          {
            "comentario": "Muy bueno",
            "calificacion": 4.5
          }
        ]
      }
    ]
  }
}
```

### POST /api/resenas
Agregar nueva reseña.

**Body:**
```json
{
  "productId": "uuid",
  "usuarioId": "uuid",
  "calificacion": 4.5,
  "comentarios": [
    {
      "comentario": "Excelente producto",
      "calificacion": 4.5
    }
  ]
}
```

---

## 👥 USUARIOS

### GET /api/usuarios
Listar todos los usuarios.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "juan@ulima.edu.pe",
      "rol": "alumno",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /api/usuarios/actual
Obtener usuario actual (simulado - primer usuario en DB).

### GET /api/usuarios/:id
Obtener usuario por ID.

### POST /api/usuarios
Crear nuevo usuario.

**Body:**
```json
{
  "nombre": "Ana López",
  "email": "ana@ulima.edu.pe",
  "rol": "alumno"  // opcional: alumno | profesor | delegado
}
```

### PATCH /api/usuarios/:id/rol
Cambiar rol de un usuario.

**Body:**
```json
{
  "rol": "delegado"  // alumno | profesor | delegado
}
```

---

## 📚 AULA VIRTUAL

### Secciones

#### GET /api/aula-virtual/usuarios/:usuarioId/secciones
Obtener secciones asignadas a un usuario (HU01).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Sección 1",
      "codigo": "ING-SW1-01",
      "cursoNombre": "Ingeniería de Software 1",
      "profesorNombre": "María García",
      "delegadoNombre": "Carlos Mendoza"
    }
  ]
}
```

#### GET /api/aula-virtual/secciones/:seccionId
Obtener detalle de una sección.

#### POST /api/aula-virtual/secciones
Crear nueva sección.

**Body:**
```json
{
  "nombre": "Sección 3",
  "codigo": "ING-SW1-03",
  "cursoNombre": "Ingeniería de Software 1",
  "profesorNombre": "José Ramírez",
  "delegadoNombre": null
}
```

#### POST /api/aula-virtual/secciones/:seccionId/usuarios/:usuarioId
Asignar usuario a una sección.

---

### Mensajes (HU02, HU03)

#### GET /api/aula-virtual/secciones/:seccionId/mensajes
Obtener mensajes del chat grupal.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "contenido": "Bienvenidos al curso",
      "autorId": "uuid",
      "autorNombre": "María García",
      "seccionId": "uuid",
      "esAnuncio": true,
      "fecha": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

#### POST /api/aula-virtual/secciones/:seccionId/mensajes
Enviar mensaje o anuncio.

**Body:**
```json
{
  "contenido": "Hola a todos",
  "autorId": "uuid",
  "autorNombre": "Juan Pérez",
  "esAnuncio": false
}
```

---

### Materiales (HU04, HU05)

#### GET /api/aula-virtual/secciones/:seccionId/materiales
Obtener materiales compartidos.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Introducción a UML.pdf",
      "tipo": "pdf",
      "url": "https://...",
      "autorId": "uuid",
      "autorNombre": "María García",
      "fechaSubida": "2024-01-10T08:00:00.000Z"
    }
  ]
}
```

**Tipos de material:** `pdf`, `video`, `imagen`, `documento`, `otro`

#### POST /api/aula-virtual/secciones/:seccionId/materiales
Subir nuevo material.

**Body:**
```json
{
  "nombre": "Tutorial.pdf",
  "tipo": "pdf",
  "url": "https://...",
  "autorId": "uuid",
  "autorNombre": "María García"
}
```

---

### Eventos (HU06)

#### GET /api/aula-virtual/secciones/:seccionId/eventos
Obtener eventos del calendario académico.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "titulo": "Entrega del Proyecto Final",
      "descripcion": "Subir proyecto completo...",
      "fecha": "2024-02-15T23:59:00.000Z",
      "tipo": "entrega",
      "autorId": "uuid",
      "seccionId": "uuid"
    }
  ]
}
```

**Tipos de evento:** `entrega`, `evaluacion`, `evento`

#### POST /api/aula-virtual/secciones/:seccionId/eventos
Crear nuevo evento.

**Body:**
```json
{
  "titulo": "Examen Parcial",
  "descripcion": "Examen de los temas 1-5",
  "fecha": "2024-02-01T10:00:00.000Z",
  "tipo": "evaluacion",
  "autorId": "uuid"
}
```

---

## Códigos de Estado HTTP

- `200` - OK (operación exitosa)
- `201` - Created (recurso creado)
- `400` - Bad Request (datos inválidos)
- `404` - Not Found (recurso no encontrado)
- `500` - Internal Server Error (error del servidor)

---

## Notas para Integración con Flutter

1. **Formato de fechas**: ISO 8601 (`2024-01-15T10:00:00.000Z`)
2. **IDs**: UUIDs generados por el servidor
3. **Enums**: 
   - Rol: `alumno`, `profesor`, `delegado`
   - Tipo Material: `pdf`, `video`, `imagen`, `documento`, `otro`
   - Tipo Evento: `entrega`, `evaluacion`, `evento`

4. **Campos opcionales**: Pueden ser `null` (ej: `delegadoNombre`)

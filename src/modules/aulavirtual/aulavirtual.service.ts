import prisma from '../../config/database';
import { AppError } from '../../shared/errorHandler';
import { TipoEvento, TipoMaterial } from '@prisma/client';

// ==================== INTERFACES ====================
interface CreateMensajeDto {
  contenido: string;
  autorId: string;
  autorNombre: string;
  esAnuncio?: boolean;
}

interface CreateMaterialDto {
  nombre: string;
  tipo: TipoMaterial | string; // Acepta string para validar y convertir
  url: string;
  autorId: string;
  autorNombre: string;
}

interface CreateEventoDto {
  titulo: string;
  descripcion: string;
  fecha: Date | string; // Acepta string (ISO 8601) o Date
  tipo: TipoEvento | string; // Acepta string para validar y convertir
  autorId: string;
}

export class AulavirtualService {
  // ==================== SECCIONES ====================
  
  // GET /api/aula-virtual/usuarios/:usuarioId/secciones
  // HU01: Obtener secciones del usuario (asignación automática)
  async getSeccionesUsuario(usuarioId: string) {
    const usuarioSecciones = await prisma.usuarioSeccion.findMany({
      where: { usuarioId },
      include: {
        seccion: true,
      },
    });

    return usuarioSecciones.map((us) => us.seccion);
  }

  // GET /api/aula-virtual/secciones/:seccionId
  async getSeccionDetail(seccionId: string) {
    const seccion = await prisma.seccion.findUnique({
      where: { id: seccionId },
    });

    if (!seccion) {
      throw new AppError('Sección no encontrada', 404);
    }

    return seccion;
  }

  // POST /api/aula-virtual/secciones - Crear nueva sección (admin)
  async createSeccion(data: {
    nombre: string;
    codigo: string;
    cursoNombre: string;
    profesorNombre: string;
    delegadoNombre?: string;
  }) {
    // Verificar que el código no exista
    const existing = await prisma.seccion.findUnique({
      where: { codigo: data.codigo },
    });

    if (existing) {
      throw new AppError('El código de sección ya existe', 400);
    }

    const seccion = await prisma.seccion.create({
      data,
    });

    return seccion;
  }

  // POST /api/aula-virtual/secciones/:seccionId/usuarios/:usuarioId
  // Asignar usuario a una sección
  async asignarUsuarioSeccion(seccionId: string, usuarioId: string) {
    // Verificar que la sección y el usuario existen
    const seccion = await prisma.seccion.findUnique({ where: { id: seccionId } });
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });

    if (!seccion || !usuario) {
      throw new AppError('Sección o usuario no encontrado', 404);
    }

    // Verificar que no esté ya asignado
    const existing = await prisma.usuarioSeccion.findFirst({
      where: { seccionId, usuarioId },
    });

    if (existing) {
      throw new AppError('El usuario ya está asignado a esta sección', 400);
    }

    const asignacion = await prisma.usuarioSeccion.create({
      data: {
        seccionId,
        usuarioId,
      },
    });

    return asignacion;
  }

  // ==================== MENSAJES ====================

  // GET /api/aula-virtual/secciones/:seccionId/mensajes
  // HU02: Obtener mensajes del chat (historial completo)
  async getMensajes(seccionId: string) {
    const mensajes = await prisma.mensaje.findMany({
      where: { seccionId },
      orderBy: { fecha: 'asc' },
    });

    return mensajes;
  }

  // POST /api/aula-virtual/secciones/:seccionId/mensajes
  // HU02, HU03: Enviar mensaje o anuncio
  async enviarMensaje(seccionId: string, data: CreateMensajeDto) {
    const seccion = await prisma.seccion.findUnique({ where: { id: seccionId } });
    if (!seccion) {
      throw new AppError('Sección no encontrada', 404);
    }

    const mensaje = await prisma.mensaje.create({
      data: {
        contenido: data.contenido,
        autorId: data.autorId,
        autorNombre: data.autorNombre,
        seccionId,
        esAnuncio: data.esAnuncio || false,
      },
    });

    return mensaje;
  }

  // ==================== MATERIALES ====================

  // GET /api/aula-virtual/secciones/:seccionId/materiales
  // HU04, HU05: Obtener materiales compartidos
  async getMateriales(seccionId: string) {
    const materiales = await prisma.material.findMany({
      where: { seccionId },
      orderBy: { fechaSubida: 'desc' },
    });

    return materiales;
  }

  // POST /api/aula-virtual/secciones/:seccionId/materiales
  // HU04: Subir material (profesor/delegado)
  async subirMaterial(seccionId: string, data: CreateMaterialDto) {
    // Validar campos obligatorios
    if (!data.nombre || !data.tipo || !data.url || !data.autorId || !data.autorNombre) {
      throw new AppError('Faltan campos obligatorios: nombre, tipo, url, autorId, autorNombre', 400);
    }

    const seccion = await prisma.seccion.findUnique({ where: { id: seccionId } });
    if (!seccion) {
      throw new AppError('Sección no encontrada', 404);
    }

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({ where: { id: data.autorId } });
    if (!usuario) {
      throw new AppError('Usuario (autor) no encontrado', 404);
    }

    // TODO: Verificar que el usuario tiene permisos (profesor/delegado)

    // Validar que el tipo sea válido
    const tiposValidos = ['pdf', 'video', 'imagen', 'documento', 'otro'];
    if (!tiposValidos.includes(data.tipo.toLowerCase())) {
      throw new AppError(`Tipo de material inválido. Debe ser uno de: ${tiposValidos.join(', ')}`, 400);
    }

    try {
      const material = await prisma.material.create({
        data: {
          nombre: data.nombre,
          tipo: data.tipo as TipoMaterial,
          url: data.url,
          autorId: data.autorId,
          autorNombre: data.autorNombre,
          seccionId,
        },
      });

      return material;
    } catch (error: any) {
      console.error('[subirMaterial] Error al crear material en DB:', error);
      throw new AppError(`Error al guardar material: ${error.message}`, 500);
    }
  }

  // ==================== EVENTOS ====================

  // GET /api/aula-virtual/secciones/:seccionId/eventos
  // HU06: Obtener eventos del calendario
  async getEventos(seccionId: string) {
    const eventos = await prisma.evento.findMany({
      where: { seccionId },
      orderBy: { fecha: 'asc' },
    });

    return eventos;
  }

  // POST /api/aula-virtual/secciones/:seccionId/eventos
  // HU04, HU06: Crear evento (profesor/delegado)
  async crearEvento(seccionId: string, data: CreateEventoDto) {
    // Validar campos obligatorios
    if (!data.titulo || !data.descripcion || !data.fecha || !data.tipo || !data.autorId) {
      throw new AppError('Faltan campos obligatorios: titulo, descripcion, fecha, tipo, autorId', 400);
    }

    const seccion = await prisma.seccion.findUnique({ where: { id: seccionId } });
    if (!seccion) {
      throw new AppError('Sección no encontrada', 404);
    }

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({ where: { id: data.autorId } });
    if (!usuario) {
      throw new AppError('Usuario (autor) no encontrado', 404);
    }

    // TODO: Verificar que el usuario tiene permisos (profesor/delegado)

    // Convertir fecha de string a Date si es necesario
    let fechaDate: Date;
    if (typeof data.fecha === 'string') {
      // Normalizar formato ISO 8601 (eliminar microsegundos si existen)
      let fechaString = data.fecha;
      // Si tiene microsegundos (más de 3 dígitos después del punto), truncar a milisegundos
      fechaString = fechaString.replace(/(\.\d{3})\d+/, '$1');
      // Asegurar que termine en Z si no tiene timezone
      if (!fechaString.endsWith('Z') && !fechaString.includes('+') && !fechaString.includes('-', 10)) {
        fechaString += 'Z';
      }
      
      fechaDate = new Date(fechaString);
      if (isNaN(fechaDate.getTime())) {
        throw new AppError('Fecha inválida. Use formato ISO 8601', 400);
      }
    } else {
      fechaDate = data.fecha;
    }

    // Validar que el tipo sea válido
    const tiposValidos = ['entrega', 'evaluacion', 'evento'];
    if (!tiposValidos.includes(data.tipo.toLowerCase())) {
      throw new AppError(`Tipo de evento inválido. Debe ser uno de: ${tiposValidos.join(', ')}`, 400);
    }

    try {
      const evento = await prisma.evento.create({
        data: {
          titulo: data.titulo,
          descripcion: data.descripcion,
          fecha: fechaDate,
          tipo: data.tipo as TipoEvento,
          autorId: data.autorId,
          seccionId,
        },
      });

      return evento;
    } catch (error: any) {
      console.error('[crearEvento] Error al crear evento en DB:', error);
      throw new AppError(`Error al guardar evento: ${error.message}`, 500);
    }
  }
}

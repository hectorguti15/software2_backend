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
  tipo: TipoMaterial;
  url: string;
  autorId: string;
  autorNombre: string;
}

interface CreateEventoDto {
  titulo: string;
  descripcion: string;
  fecha: Date;
  tipo: TipoEvento;
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
    const seccion = await prisma.seccion.findUnique({ where: { id: seccionId } });
    if (!seccion) {
      throw new AppError('Sección no encontrada', 404);
    }

    // TODO: Verificar que el usuario tiene permisos (profesor/delegado)

    const material = await prisma.material.create({
      data: {
        nombre: data.nombre,
        tipo: data.tipo,
        url: data.url,
        autorId: data.autorId,
        autorNombre: data.autorNombre,
        seccionId,
      },
    });

    return material;
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
    const seccion = await prisma.seccion.findUnique({ where: { id: seccionId } });
    if (!seccion) {
      throw new AppError('Sección no encontrada', 404);
    }

    // TODO: Verificar que el usuario tiene permisos (profesor/delegado)

    const evento = await prisma.evento.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        fecha: data.fecha,
        tipo: data.tipo,
        autorId: data.autorId,
        seccionId,
      },
    });

    return evento;
  }
}

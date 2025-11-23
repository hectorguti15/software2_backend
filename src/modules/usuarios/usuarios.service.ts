import prisma from '../../config/database';
import { AppError } from '../../shared/errorHandler';
import { RolUsuario } from '@prisma/client';

interface CreateUsuarioDto {
  nombre: string;
  email: string;
  rol?: RolUsuario;
}

interface UpdateRolDto {
  rol: RolUsuario;
}

export class UsuariosService {
  // GET /api/usuarios/:id - Obtener usuario por ID
  async getUsuarioById(id: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true,
      },
    });

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return usuario;
  }

  // GET /api/usuarios/actual - Obtener usuario actual (simulado)
  // TODO: En producción esto debería usar autenticación JWT
  async getUsuarioActual() {
    // Devuelve el primer usuario o uno por defecto
    const usuario = await prisma.usuario.findFirst({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
      },
    });

    if (!usuario) {
      throw new AppError('No hay usuarios en el sistema', 404);
    }

    return usuario;
  }

  // POST /api/usuarios - Crear nuevo usuario
  async createUsuario(data: CreateUsuarioDto) {
    const existingUser = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('El email ya está registrado', 400);
    }

    const usuario = await prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        rol: data.rol || RolUsuario.alumno,
      },
    });

    return usuario;
  }

  // PATCH /api/usuarios/:id/rol - Cambiar rol del usuario
  async updateRol(id: string, data: UpdateRolDto) {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: {
        rol: data.rol,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
      },
    });

    return usuario;
  }

  // GET /api/usuarios - Listar usuarios (opcional, para admin)
  async getUsuarios() {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });

    return usuarios;
  }
}

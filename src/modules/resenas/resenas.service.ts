import prisma from '../../config/database';
import { AppError } from '../../shared/errorHandler';

interface CreateResenaDto {
  productId: string;
  usuarioId: string;
  calificacion: number;
  comentarios: {
    comentario: string;
    calificacion: number;
  }[];
}

export class ResenasService {
  // GET /api/resenas/:productId - Obtener reseñas de un producto
  async getResenasByProduct(productId: string) {
    const resenas = await prisma.resena.findMany({
      where: { productId },
      include: {
        comentarios: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calcular calificación promedio
    const avgCalificacion =
      resenas.length > 0
        ? resenas.reduce((sum, r) => sum + r.calificacion, 0) / resenas.length
        : 0;

    return {
      productId,
      calificacion: avgCalificacion,
      resenas,
    };
  }

  // POST /api/resenas - Agregar nueva reseña
  async createResena(data: CreateResenaDto) {
    // Verificar que el producto existe
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: data.productId },
    });

    if (!menuItem) {
      throw new AppError('Producto no encontrado', 404);
    }

    const resena = await prisma.resena.create({
      data: {
        productId: data.productId,
        usuarioId: data.usuarioId,
        calificacion: data.calificacion,
        comentarios: {
          create: data.comentarios,
        },
      },
      include: {
        comentarios: true,
      },
    });

    return resena;
  }

  // GET /api/resenas/item/:id - Obtener ResenaItem completo (formato Flutter)
  async getResenaItem(id: string) {
    const resena = await prisma.resena.findUnique({
      where: { id },
      include: {
        comentarios: true,
      },
    });

    if (!resena) {
      throw new AppError('Reseña no encontrada', 404);
    }

    return resena;
  }
}

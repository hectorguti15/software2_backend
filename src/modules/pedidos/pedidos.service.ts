import prisma from '../../config/database';
import { AppError } from '../../shared/errorHandler';

interface CreatePedidoDto {
  usuarioId: string;
  items: {
    menuItemId: string;
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
}

export class PedidosService {
  // POST /api/pedidos - Crear pedido desde carrito
  async createPedido(data: CreatePedidoDto) {
    const total = data.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const codigo = `PED-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const pedido = await prisma.pedido.create({
      data: {
        codigo,
        total,
        usuarioId: data.usuarioId,
        items: {
          create: data.items.map((item) => ({
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
            menuItemId: item.menuItemId,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return pedido;
  }

  // GET /api/pedidos?usuarioId=... - Obtener historial de pedidos
  async getHistorial(usuarioId?: string) {
    const where = usuarioId ? { usuarioId } : {};

    const pedidos = await prisma.pedido.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    return pedidos;
  }

  // GET /api/pedidos/:codigo - Obtener pedido por código
  async getPedidoByCodigo(codigo: string) {
    const pedido = await prisma.pedido.findUnique({
      where: { codigo },
      include: {
        items: true,
        usuario: true,
      },
    });

    if (!pedido) {
      throw new AppError('Pedido no encontrado', 404);
    }

    return pedido;
  }

  // TODO: Implementar envío de notificaciones (integración futura)
  async enviarNotificacion(codigo: string) {
    const pedido = await this.getPedidoByCodigo(codigo);
    // TODO: Integrar servicio de notificaciones push
    return { message: 'Notificación enviada', pedido };
  }

  // TODO: Implementar generación de boleta (integración futura)
  async generarYEnviarBoleta(codigo: string) {
    const pedido = await this.getPedidoByCodigo(codigo);
    // TODO: Generar PDF de boleta y enviar por email
    return { message: 'Boleta generada y enviada', pedido };
  }
}

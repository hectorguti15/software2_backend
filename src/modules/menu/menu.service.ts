import prisma from '../../config/database';
import { AppError } from '../../shared/errorHandler';

export class MenuService {
  // GET /api/menu - Obtener todos los items del menú
  async getMenuItems() {
    const items = await prisma.menuItem.findMany({
      orderBy: { nombre: 'asc' },
    });
    return items;
  }

  // GET /api/menu/:id - Obtener detalle de un item
  async getMenuItemDetail(id: string) {
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        resenas: {
          include: {
            comentarios: true,
          },
        },
      },
    });

    if (!item) {
      throw new AppError('Item del menú no encontrado', 404);
    }

    return item;
  }
}

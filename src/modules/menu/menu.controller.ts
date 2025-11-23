import { Request, Response } from 'express';
import { MenuService } from './menu.service';
import { asyncHandler } from '../../shared/asyncHandler';

const menuService = new MenuService();

export const getMenuItems = asyncHandler(async (req: Request, res: Response) => {
  const items = await menuService.getMenuItems();
  res.json({
    success: true,
    data: items,
  });
});

export const getMenuItemDetail = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await menuService.getMenuItemDetail(id);
  res.json({
    success: true,
    data: item,
  });
});

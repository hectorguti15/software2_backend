import { Request, Response } from 'express';
import { ResenasService } from './resenas.service';
import { asyncHandler } from '../../shared/asyncHandler';

const resenasService = new ResenasService();

export const getResenasByProduct = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const data = await resenasService.getResenasByProduct(productId);
  res.json({
    success: true,
    data,
  });
});

export const createResena = asyncHandler(async (req: Request, res: Response) => {
  const resena = await resenasService.createResena(req.body);
  res.status(201).json({
    success: true,
    data: resena,
  });
});

export const getResenaItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const resena = await resenasService.getResenaItem(id);
  res.json({
    success: true,
    data: resena,
  });
});

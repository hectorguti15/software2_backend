import { Request, Response } from 'express';
import { PedidosService } from './pedidos.service';
import { asyncHandler } from '../../shared/asyncHandler';

const pedidosService = new PedidosService();

export const createPedido = asyncHandler(async (req: Request, res: Response) => {
  const pedido = await pedidosService.createPedido(req.body);
  res.status(201).json({
    success: true,
    data: pedido,
  });
});

export const getHistorial = asyncHandler(async (req: Request, res: Response) => {
  const { usuarioId } = req.query;
  const pedidos = await pedidosService.getHistorial(usuarioId as string | undefined);
  res.json({
    success: true,
    data: pedidos,
  });
});

export const getPedidoByCodigo = asyncHandler(async (req: Request, res: Response) => {
  const { codigo } = req.params;
  const pedido = await pedidosService.getPedidoByCodigo(codigo);
  res.json({
    success: true,
    data: pedido,
  });
});

export const enviarNotificacion = asyncHandler(async (req: Request, res: Response) => {
  const { codigo } = req.params;
  const result = await pedidosService.enviarNotificacion(codigo);
  res.json({
    success: true,
    data: result,
  });
});

export const generarBoleta = asyncHandler(async (req: Request, res: Response) => {
  const { codigo } = req.params;
  const result = await pedidosService.generarYEnviarBoleta(codigo);
  res.json({
    success: true,
    data: result,
  });
});

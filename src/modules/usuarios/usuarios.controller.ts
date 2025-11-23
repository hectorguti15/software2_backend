import { Request, Response } from 'express';
import { UsuariosService } from './usuarios.service';
import { asyncHandler } from '../../shared/asyncHandler';

const usuariosService = new UsuariosService();

export const getUsuarios = asyncHandler(async (req: Request, res: Response) => {
  const usuarios = await usuariosService.getUsuarios();
  res.json({
    success: true,
    data: usuarios,
  });
});

export const getUsuarioById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const usuario = await usuariosService.getUsuarioById(id);
  res.json({
    success: true,
    data: usuario,
  });
});

export const getUsuarioActual = asyncHandler(async (req: Request, res: Response) => {
  const usuario = await usuariosService.getUsuarioActual();
  res.json({
    success: true,
    data: usuario,
  });
});

export const createUsuario = asyncHandler(async (req: Request, res: Response) => {
  const usuario = await usuariosService.createUsuario(req.body);
  res.status(201).json({
    success: true,
    data: usuario,
  });
});

export const updateRol = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const usuario = await usuariosService.updateRol(id, req.body);
  res.json({
    success: true,
    data: usuario,
  });
});

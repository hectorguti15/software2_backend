import { Request, Response } from 'express';
import { AulavirtualService } from './aulavirtual.service';
import { asyncHandler } from '../../shared/asyncHandler';

const aulavirtualService = new AulavirtualService();

// ==================== SECCIONES ====================

export const getSeccionesUsuario = asyncHandler(async (req: Request, res: Response) => {
  const { usuarioId } = req.params;
  const secciones = await aulavirtualService.getSeccionesUsuario(usuarioId);
  res.json({
    success: true,
    data: secciones,
  });
});

export const getSeccionDetail = asyncHandler(async (req: Request, res: Response) => {
  const { seccionId } = req.params;
  const seccion = await aulavirtualService.getSeccionDetail(seccionId);
  res.json({
    success: true,
    data: seccion,
  });
});

export const createSeccion = asyncHandler(async (req: Request, res: Response) => {
  const seccion = await aulavirtualService.createSeccion(req.body);
  res.status(201).json({
    success: true,
    data: seccion,
  });
});

export const asignarUsuarioSeccion = asyncHandler(async (req: Request, res: Response) => {
  const { seccionId, usuarioId } = req.params;
  const asignacion = await aulavirtualService.asignarUsuarioSeccion(seccionId, usuarioId);
  res.status(201).json({
    success: true,
    data: asignacion,
  });
});

// ==================== MENSAJES ====================

export const getMensajes = asyncHandler(async (req: Request, res: Response) => {
  const { seccionId } = req.params;
  const mensajes = await aulavirtualService.getMensajes(seccionId);
  res.json({
    success: true,
    data: mensajes,
  });
});

export const enviarMensaje = asyncHandler(async (req: Request, res: Response) => {
  const { seccionId } = req.params;
  const mensaje = await aulavirtualService.enviarMensaje(seccionId, req.body);
  res.status(201).json({
    success: true,
    data: mensaje,
  });
});

// ==================== MATERIALES ====================

export const getMateriales = asyncHandler(async (req: Request, res: Response) => {
  const { seccionId } = req.params;
  const materiales = await aulavirtualService.getMateriales(seccionId);
  res.json({
    success: true,
    data: materiales,
  });
});

export const subirMaterial = asyncHandler(async (req: Request, res: Response) => {
  const { seccionId } = req.params;
  const material = await aulavirtualService.subirMaterial(seccionId, req.body);
  res.status(201).json({
    success: true,
    data: material,
  });
});

// ==================== EVENTOS ====================

export const getEventos = asyncHandler(async (req: Request, res: Response) => {
  const { seccionId } = req.params;
  const eventos = await aulavirtualService.getEventos(seccionId);
  res.json({
    success: true,
    data: eventos,
  });
});

export const crearEvento = asyncHandler(async (req: Request, res: Response) => {
  const { seccionId } = req.params;
  const evento = await aulavirtualService.crearEvento(seccionId, req.body);
  res.status(201).json({
    success: true,
    data: evento,
  });
});

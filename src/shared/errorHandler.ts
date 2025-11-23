import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Error desconocido
  console.error('ERROR 💥:', err);
  console.error('Stack:', err.stack);
  
  // En desarrollo, mostrar más detalles
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  return res.status(500).json({
    success: false,
    message: isDevelopment && err.message ? err.message : 'Error interno del servidor',
    ...(isDevelopment && { error: err.message, stack: err.stack }),
  });
};

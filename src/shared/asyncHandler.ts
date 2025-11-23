import { Request, Response, NextFunction } from 'express';

// Wrapper para manejar errores async en routes
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

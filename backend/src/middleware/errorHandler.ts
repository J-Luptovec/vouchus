import { Request, Response } from 'express';

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (err: AppError, _req: Request, res: Response): void => {
  console.error(err);
  const status = err.status ?? 500;
  const message = status < 500 ? err.message : 'Internal server error';
  res.status(status).json({ error: message });
};

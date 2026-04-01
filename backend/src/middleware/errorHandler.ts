import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError | ZodError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  console.error(err);

  if (err instanceof ZodError) {
    res.status(422).json({ error: err.errors[0].message });
    return;
  }

  const status = err.status ?? 500;
  const message = status < 500 ? err.message : 'Internal server error';
  res.status(status).json({ error: message });
};

import { Response, Request, NextFunction } from 'express';

const errorLogger = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  let errorMessage = 'Something went wrong';
  if (err instanceof Error) {
    errorMessage += ' Error: ' + err.message;
    return res.status(500).send(errorMessage);
  }

  next(err);
};

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'Unknown Endpoint' });
};

export { errorLogger, unknownEndpoint };
import { Router } from 'express';
import File from '../models/File';

const fileRouter = Router();

//Get all files that exist
fileRouter.get('/', async (_req, res, next) => {
  try{
    const files = await File.findAll();
    res.status(200).send(files);
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

export default fileRouter;
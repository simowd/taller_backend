import { Router } from 'express';

const folderRouter = Router();

folderRouter.get('/', async (req, res, next) => {
  try {
    const user = req.user;
    if(user){
      console.log(user);
    }
    res.status(200).send('nice');
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

export default folderRouter;
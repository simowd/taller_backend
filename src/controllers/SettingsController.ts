import { Router } from 'express';
import Setting from '../models/Setting';

const settingsRouter = Router();

settingsRouter.get('/', async (req, _res, next) => {
  try{
    console.log('Ingresa');
    const user = req.user!;
    const userSettings = await Setting.findOne({where: {user_id_user: user.id_user}});
    console.log(userSettings);
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
  

});

export default settingsRouter;
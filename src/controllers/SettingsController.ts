import { Router } from 'express';
import Setting from '../models/Setting';
import _ from 'lodash';
import { updateSetting } from '../types/setting';

const settingsRouter = Router();
const ignoredFields = ['user_id_user', 'tr_id', 'tr_date', 'tr_user_id', 'tr_ip', 'password', 'status'];

settingsRouter.get('/', async (req, res, next) => {
  try{
    const user = req.user!;
    const userSettings = await Setting.findOne({where: {user_id_user: user.id_user}});
    
    if(userSettings){
      const filteredSettings = _.omit(userSettings?.toJSON(), ignoredFields);
      res.status(200).send(filteredSettings);
    }

    res.status(404).send();

  } catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

settingsRouter.put('/', async (req, res, next) => {
  try{
    const user = req.user!;
    const body = req.body;

    const data = updateSetting(body);
    await Setting.update({...data, ...req.transaction, tr_user_id: req.user?.id_user},{where: {user_id_user: user.id_user}});

    res.status(204).send();

  } catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

export default settingsRouter;
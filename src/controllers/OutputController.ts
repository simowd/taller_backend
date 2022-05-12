import { Router } from 'express';
import _ from 'lodash';
import passport from 'passport';
import Output from '../models/Output';

const outputRouter = Router();

const ignoredFields = ['path', 'tr_id', 'tr_date', 'tr_user_id', 'tr_ip', 'password', 'status'];

outputRouter.get('/:fileId/all', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    if (fileId) {
      const allOutputs = await Output.findAll({where: { file_id_file: fileId}});

      const filteredOutputs = allOutputs.map((output) => _.omit(output.toJSON(), ignoredFields));

      res.status(200).send(filteredOutputs);
    }
    else {
      res.status(400).send('Params not added');
    }
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

export default outputRouter;
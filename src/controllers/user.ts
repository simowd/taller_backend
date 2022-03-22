import { Router } from 'express';
import { User, Country, Gender, Language } from '../models/index';
import _ from 'lodash';

const userRouter = Router();

//Get user information
userRouter.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      include: [
        {
          model: Country,
          attributes: ['id_country']
        },
        {
          model: Gender,
          attributes: ['id_gender']
        },
        {
          model: Language,
          attributes: ['id_language']
        },
      ]
    });
    
    if (user){
      const filteredUser = _.omit(user.toJSON(),['tr_id', 'tr_date','tr_user_id', 'tr_ip', 'password', 'status']);
      res.send(filteredUser);
    }
    else {
      res.status(404).send('User not found');
    }
  }
  catch (error: unknown) {
    let errorMessage = 'Something went wrong';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default userRouter;
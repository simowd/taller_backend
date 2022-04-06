import { Router } from 'express';
import { User } from '../models/index';
import _ from 'lodash';
import { imageUploader } from '../utils/upload';
import { NewUser, toNewUser } from '../types/user';
import bcrypt from 'bcrypt';
import { unlink } from 'fs';

const userRouter = Router();

//bcrypt hash rounds
const saltRounds = 10;
const ignoredFields = ['tr_id', 'tr_date', 'tr_user_id', 'tr_ip', 'password', 'status'];

//Get user information
userRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);

    if (user) {
      //clean unnecesary data for the user
      const filteredUser = _.omit(user.toJSON(), ignoredFields);
      res.send(filteredUser);
    }
    else {
      res.status(404).send('User not found');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

//Get all users
userRouter.get('/', async (_req, res, next) => {
  try{
    const allUsers = await User.findAll({ where: {} });
    res.status(200).send(allUsers);
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }

});

//Post a new user
userRouter.post('/', imageUploader.single('avatar'), async (req, res, next) => {
  try {
    const newUserRequest: NewUser = toNewUser(req.body);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let picturePath: string | null = null;

    //Check if picture was uploaded
    if(req?.file?.path) {
      picturePath = req.file.path;
    }
    //check if user already exists
    const user = await User.findOne({ where: { username: newUserRequest.username }});

    if (user) {
      if(picturePath){
        unlink(picturePath, (err) => {
          if (err) console.log(err);
        });
      }      
      return res.status(409).send('User already exists');
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(newUserRequest.password, saltRounds);

    newUserRequest.password = hashedPassword;

    //create the new user
    const newUser = await User.create({...newUserRequest, picture: picturePath, status: 1,});
    const filteredUser = _.omit(newUser.toJSON(), ignoredFields);
    
    res.status(200).send(filteredUser);
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      if(req.file?.path){
        unlink(req.file?.path, (err) => {
          if (err) console.log(err);
        });
      }
      next(error);
    }
  }
});

export default userRouter;
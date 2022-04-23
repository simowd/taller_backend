import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SECRET } from '../utils/config';
import User from '../models/User';

const loginRouter = Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const issueJWT = (user: any) => {
  const id = user.id_user;
  const expiresIn = '7d';

  const payload = {
    sub: id,
    username: user.username,
    language_id_language: user.language_id_language,
    iat: Date.now()
  };

  const signedToken = jwt.sign(payload, SECRET);

  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn
  };
};

loginRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const user = await User.findOne({ where: { username: body.username } });
    if (!user) {
      return res.status(404).send({ success: false, error: 'User not found' });
    }

    const isPasswordCorrect = user === null ? false : await bcrypt.compare(body.password, user.password);

    if (isPasswordCorrect) {
      const token = issueJWT(user);
      res.status(200).send({ success: true, token: token, user_id: user.id_user, locale: user.language_id_language });
    }
    else {
      res.status(401).send({ success: false, error: 'Password is incorrect' });
    }
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

export default loginRouter;

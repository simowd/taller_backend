import { PassportStatic } from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User';
import { SECRET } from './config';

//Define passport-jwt options
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET
};

//Define passport session handler
const passportBuilder = async (passport: PassportStatic) => {
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try{
      const user = await User.findByPk(jwt_payload.sub);
      if(user){
        return done(null, user);
      } 
      else{
        return done(null, false);
      }
    }
    catch (error: unknown){
      if(error instanceof Error){
        console.log(error);
      }

      return done(error, false);
    }
  }));
};

export { passportBuilder };

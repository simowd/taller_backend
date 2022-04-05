import { parseNumber, parseString } from '../utils/parsers';
import _ from 'lodash';

interface NewUser {
  name?: string,
  last_name?: string,
  username: string,
  email: string,
  password: string,
  avatar?: object,
  country_id_country: string,
  gender_id_gender: number,
  language_id_language: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewUser = (user: any): NewUser => {
  const newUser: NewUser = {
    name: user.name,
    last_name: user.last_name,
    username: parseString(user.username, _.findKey(user, user.username)),
    email: parseString(user.email, _.findKey(user, user.email)),
    password: parseString(user.password, _.findKey(user, user.password)),
    avatar: user.avatar,
    country_id_country: parseString(user.id_country, _.findKey(user, user.id_country)),
    gender_id_gender: parseNumber(user.id_gender, _.findKey(user, user.id_gender)),
    language_id_language: parseString(user.id_language, _.findKey(user, user.id_language))

  };
  return newUser;
};

export { NewUser, toNewUser};
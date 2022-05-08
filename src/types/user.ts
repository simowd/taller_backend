import { parseNumber, parseString } from '../utils/parsers';

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

interface ChangePassword {
  old_password: string,
  new_password: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewUser = (user: any): NewUser => {
  const newUser: NewUser = {
    name: user.name,
    last_name: user.last_name,
    username: parseString(user.username, 'username'),
    email: parseString(user.email, 'email'),
    password: parseString(user.password, 'password'),
    avatar: user.avatar,
    country_id_country: parseString(user.id_country, 'id_country'),
    gender_id_gender: parseNumber(user.id_gender, 'id_gender'),
    language_id_language: parseString(user.id_language, 'id_language')

  };
  return newUser;
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toChangePasswordRequest = (request: any) => {
  const newPassword: ChangePassword = {
    old_password: parseString(request.old_password, 'old_password'),
    new_password: parseString(request.new_password, 'new_password'),
  };
  return newPassword;
};

export { NewUser, ChangePassword, toNewUser, toChangePasswordRequest};
import supertest from 'supertest';
import app from '../app';
import User  from '../models/User';
import sequelize from '../utils/database';
import { createUsers } from '../utils/testSetup';
import fs from 'fs-extra';
import { path as appRoot } from 'app-root-path';

const api = supertest(app);

beforeAll(async () => {
  try {
    await User.destroy({ where: {} });
    await sequelize.query('ALTER TABLE user AUTO_INCREMENT = 1;');
    for (const user of createUsers) {
      console.log('muere x2');
      await api.post('/api/v1/users').field(user).attach('avatar', `${__dirname}/media/user.png`);
    }
    console.log('User data has been re-created');
  }
  catch (e) {
    console.error(e);
  }

});

describe('[/api/v1/users] Test user endpoints', () => {

  test('Get one user from (GET)[/api/v1/users/:id]', async () => {
    const response = await api.get('/api/v1/users/1');
    expect(response.statusCode).toBe(200);
  });

  test('Get one user from (GET)[/api/v1/users]', async () => {
    const response = await api.get('/api/v1/users');
    expect(response.body.length).toBe(2);
  });

  test('Create new user from (POST)[/api/v1/users]', async () => {
    const userRequest = {
      name: 'Test',
      last_name: 'Jest',
      username: 'jestabc123',
      email: 'jest@gmail.com',
      password: 'nodejs',
      id_country: 'ES',
      id_language: 'en',
      id_gender: 2,
    };

    //Send the data and attach picture
    const response = await api.post('/api/v1/users').field(userRequest).attach('avatar', `${__dirname}/media/user.png`);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe('jestabc123');
  });

  test('Change password for a user (PUT)[/api/v1/users/password]', async () => {
    
    //Setup User information
    const userData = {
      username: 'ana123',
      password: 'anita:O'
    };

    const changePassword = {
      old_password: 'anita:O',
      new_password: 'anita'
    };

    //Login user onto the system
    const loginUser = await api.post('/api/v1/login').send(userData);
    //change password and attach token
    const response = await api.put('/api/v1/users/password').send(changePassword).set('Authorization', loginUser.body.token.token);

    expect(response.statusCode).toBe(204);
    
    //Login with old password and expect it to fail
    const failedLoginUser = await api.post('/api/v1/login').send(userData);
    expect(failedLoginUser.statusCode).not.toBe(200);

    //Setup New user information and login
    const newUserData = {
      username: 'ana123',
      password: 'anita'
    };
    const successfulLogin = await api.post('/api/v1/login').send(newUserData);
    expect(successfulLogin.statusCode).toBe(200);
    expect(successfulLogin.body.success).toBeTruthy();
  });
});

afterAll(async () => {
  await sequelize.close();
  await fs.emptyDir(`${appRoot}/public/images/`);
  console.log('Deleted image files');
});
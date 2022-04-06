import supertest from 'supertest';
import app from '../app';
import { User } from '../models/index';
import sequelize from '../utils/database';
import { createUsers } from '../utils/testSetup';
import fs from 'fs-extra';
import { path as appRoot } from 'app-root-path';

const api = supertest(app);

beforeAll(async () => {
  try {
    await User.destroy({ where: {} });
    await sequelize.query('ALTER TABLE user AUTO_INCREMENT = 1;');
    for(const user of createUsers) {
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

  test('Get one user from (GET)[/api/v1/users]',async () => {
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

    const response = await api.post('/api/v1/users').field(userRequest).attach('avatar', `${__dirname}/media/user.png`);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe('jestabc123');
  });
});

afterAll(async () => {
  await sequelize.close();
  await fs.emptyDir(`${appRoot}/public/images/`);
  console.log('Deleted image files');
});
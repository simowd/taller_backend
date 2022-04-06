import supertest from 'supertest';
import app from '../app';
import { User } from '../models/index';
import sequelize from '../utils/database';
import { createUsers } from '../utils/testSetup';

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
  catch (e: unknown) {
    if(e instanceof Error){
      console.error(e.name);
    }
    
  }

});

describe('[/api/v1/login] Test user endpoints', () => {
  test('Login user and get token (POST)[/api/v1/login]', async () => {
    const response = await api.post('/api/v1/login').send({
      username: 'ana123',
      password: 'anita:O'
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});


afterAll(async () => {
  await sequelize.close();
});
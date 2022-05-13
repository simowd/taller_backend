import supertest from 'supertest';
import app from '../app';
import { createUsers, deleteDatabaseData, endTestSequence } from '../utils/testSetup';

const api = supertest(app);

beforeAll(async () => {
  try{
    await deleteDatabaseData();
    for(const user of createUsers) {
      await api.post('/api/v1/users').field(user).attach('avatar', `${__dirname}/media/user.png`);
    }
  }
  catch (e: unknown) {
    if(e instanceof Error){
      console.error(e.name);
    }  
  }
});

describe('[/api/v1/settings] Test settings endpoints', () => {
  test('Ger one authenticated user settings (GET)[/api/v1/settings]', async () => {
    //Login user
    const userAuth = await api.post('/api/v1/login').send({username: 'juanito123', password: 'juanchitowapo'});

    //Verify that the token was gotten
    expect(userAuth.statusCode).toBe(200);
    expect(userAuth.body.token).toBeDefined();

    //Get user token
    const token = userAuth.body.token.token;

    const settings = await api.get('/api/v1/settings').set({ Authorization: token});

    //Verify that the settings were obtained
    expect(settings.statusCode).toBe(200);
    expect(settings.body).toBeDefined();


  });
});

afterAll(async () => {
  await endTestSequence();
});
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
  test('Get one authenticated user settings (GET)[/api/v1/settings]', async () => {
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

  test('Update one setting that is owned by the user (PUT)[/api/v1/settings]', async () => {
    //Login user
    const userAuth = await api.post('/api/v1/login').send({username: 'juanito123', password: 'juanchitowapo'});

    //Verify that the token was gotten
    expect(userAuth.statusCode).toBe(200);
    expect(userAuth.body.token).toBeDefined();

    //Get user token
    const token = userAuth.body.token.token;

    //Get user settings
    const settings = await api.get('/api/v1/settings').set({ Authorization: token});

    //Verify that the setting to change is valued 1
    expect(settings.statusCode).toBe(200);
    expect(settings.body.audio_feedback).toBe(1);

    const update = {
      audio_feedback: 0
    };

    const updateSettings = await api.put('/api/v1/settings').set({ Authorization: token}).send(update);

    expect(updateSettings.statusCode).toBe(204);

    //Get new user settings
    const newSettings = await api.get('/api/v1/settings').set({ Authorization: token});

    expect(newSettings.statusCode).toBe(200);
    expect(newSettings.body.audio_feedback).toBe(0);
  });
});

afterAll(async () => {
  await endTestSequence();
});
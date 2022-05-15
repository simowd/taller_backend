import supertest from 'supertest';
import app from '../app';
import { createUsers, deleteDatabaseData, endTestSequence } from '../utils/testSetup';

const api = supertest(app);

beforeAll(async () => {
  try {
    await deleteDatabaseData();
    for (const user of createUsers) {
      await api.post('/api/v1/users').field(user).attach('avatar', `${__dirname}/media/user.png`);
    }
  }
  catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.name);
    }
  }
});

describe('[/api/v1/editor] Test editor endpoints', () => {
  test('Get all folders and files from user (GET)[/api/v1/editor/file/:fileId]', async () => {
    //Login user
    const userAuth = await api.post('/api/v1/login').send({ username: 'juanito123', password: 'juanchitowapo' });

    //Verify that the token was gotten
    expect(userAuth.statusCode).toBe(200);
    expect(userAuth.body.token).toBeDefined();

    //Get user token
    const token = userAuth.body.token.token;

    const folders = await api.get('/api/v1/editor/file').set({ Authorization: token });

    //Verify that the folder was gotten
    expect(folders.statusCode).toBe(200);
    expect(folders.body).toBeDefined();

    //Verify that there's critical information inside the body
    expect(folders.body[0].folder_name).toBe('Sketchbook');
    expect(folders.body[0].storage).toBeDefined();

    expect(folders.body[0].files.length).toBeGreaterThanOrEqual(0);
  });
});

afterAll(async () => {
  await endTestSequence();
});
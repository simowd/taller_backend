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

describe('[/api/v1/projects] Test projects endpoints', () => {
  test('Get all folders and files from user (GET)[/api/v1/projects]', async () => {
    //Login user
    const userAuth = await api.post('/api/v1/login').send({ username: 'juanito123', password: 'juanchitowapo' });

    //Verify that the token was gotten
    expect(userAuth.statusCode).toBe(200);
    expect(userAuth.body.token).toBeDefined();

    //Get user token
    const token = userAuth.body.token.token;

    const folders = await api.get('/api/v1/projects').set({ Authorization: token });

    //Verify that the folder was gotten
    expect(folders.statusCode).toBe(200);
    expect(folders.body).toBeDefined();

    //Verify that there's critical information inside the body
    expect(folders.body[0].folder_name).toBe('Sketchbook');
    expect(folders.body[0].storage).toBeDefined();

    expect(folders.body[0].files.length).toBeGreaterThanOrEqual(0);
  });

  test('Create new folder by user (POST)[/api/v1/projects]', async () => {
    //Login user
    const userAuth = await api.post('/api/v1/login').send({ username: 'juanito123', password: 'juanchitowapo' });

    //Verify that the token was gotten
    expect(userAuth.statusCode).toBe(200);
    expect(userAuth.body.token).toBeDefined();

    //Get user token
    const token = userAuth.body.token.token;

    const newProjectData = {
      folder_name: 'New Project',
      private: false
    };

    const folders = await api.post('/api/v1/projects').set({ Authorization: token }).send(newProjectData);

    //Verify that the folder was gotten
    expect(folders.statusCode).toBe(200);
    expect(folders.body).toBeDefined();

    //Verify that there's critical information inside the body
    expect(folders.body.id_folder).toBeDefined();
    expect(folders.body.storage).toBeDefined();
    expect(folders.body.folder_name).toBe('New Project');
  });

  test('Update folder by user (PUT)[/api/v1/projects/:projectId]', async () => {
    //Login user
    const userAuth = await api.post('/api/v1/login').send({ username: 'juanito123', password: 'juanchitowapo' });

    //Verify that the token was gotten
    expect(userAuth.statusCode).toBe(200);
    expect(userAuth.body.token).toBeDefined();

    //Get user token
    const token = userAuth.body.token.token;

    //Get all folders from user
    const folders = await api.get('/api/v1/projects').set({ Authorization: token });

    //Verify that the folder was gotten
    expect(folders.statusCode).toBe(200);
    expect(folders.body).toBeDefined();

    //Get a folder and update it
    const updateData = {
      folder_name: 'New folder name',
      private: true
    };

    const folder = folders.body.find((folder: any) => folder.folder_name === 'New Project');

    const newFolder = await api.put(`/api/v1/projects/${folder.id_folder}`).set({ Authorization: token }).send(updateData);

    expect(newFolder.statusCode).toBe(204);
  });

  test('Delete folder by user (DELETE)[/api/v1/projects/:projectId]', async () => {
    //Login user
    const userAuth = await api.post('/api/v1/login').send({ username: 'juanito123', password: 'juanchitowapo' });

    //Verify that the token was gotten
    expect(userAuth.statusCode).toBe(200);
    expect(userAuth.body.token).toBeDefined();

    //Get user token
    const token = userAuth.body.token.token;

    //Get all folders from user
    const folders = await api.get('/api/v1/projects').set({ Authorization: token });

    //Verify that the folder was gotten
    expect(folders.statusCode).toBe(200);
    expect(folders.body).toBeDefined();

    const folder = folders.body.find((folder: any) => folder.folder_name === 'New folder name');

    const newFolder = await api.delete(`/api/v1/projects/${folder.id_folder}`).set({ Authorization: token });

    expect(newFolder.statusCode).toBe(204);
  });
});

afterAll(async () => {
  await endTestSequence();
});
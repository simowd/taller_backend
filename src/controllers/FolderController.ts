import { Router } from 'express';
import passport from 'passport';
import Folder from '../models/Folder';
import { toNewFolder } from '../types/folder';
import { authUser } from '../utils/middleware';
import { v4 as uuidv4 } from 'uuid';
import blobServiceClient from '../utils/azure_blob';
import _ from 'lodash';
import fileRouter from './FileController';
import File from '../models/File';

const folderRouter = Router();

const ignoredFields = ['path', 'user_id_user', 'tr_id', 'tr_date', 'tr_user_id', 'tr_ip', 'password', 'status'];

folderRouter.use('/:folderId/files', fileRouter);

//List all folders of a user
folderRouter.get('/', async (req, res, next) => {
  try {
    const user = await authUser(req);
    if (user) {
      const allFolders = await Folder.findAll({
        where: {
          user_id_user: user.id_user, status: 1
        },
        include: [File]
      });

      const filteredFolders = allFolders.map((folder) => {
        return _.omit(folder.toJSON(), ignoredFields);
      });

      res.status(200).send(filteredFolders);
    }
    else {
      res.status(404).send('User not found');
    }

  }
  catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

//Create new project
folderRouter.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const body = req.body;
    const newFolderData = toNewFolder(body);

    //Get info so we don't have duplicate names
    const possibleFolderDuplicate = await Folder.findOne({ where: { user_id_user: req.user?.id_user, folder_name: newFolderData.folder_name } });

    if (!possibleFolderDuplicate) {

      //create unique id for folder
      const containerId = uuidv4();

      //Create container on Azure
      const containerClientResponse = blobServiceClient.getContainerClient(containerId);

      await containerClientResponse.createIfNotExists();

      //Prepare the date to be uploaded to the database
      const folderData = {
        user_id_user: req.user?.id_user,
        path: containerClientResponse.url,
        status: 1,
        storage: containerId,
        ...newFolderData,
        ...req.transaction,
        tr_user_id: req.user?.id_user,
      };

      //Create Folder on the Backend
      const newFolder = await Folder.create(
        folderData, { returning: true, }
      );

      const filteredFolder = _.omit(newFolder.toJSON(), ignoredFields);

      res.status(200).send(filteredFolder);
    }
    else {
      res.status(409).send('Folder name already exists');
    }
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

//Delete project
folderRouter.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const id = req.params.id;
    //Find if the folder exists
    const folder = await Folder.findByPk(id);
    if (folder) {
      //Verify that the logged user owns the folder
      if (folder.user_id_user === req.user?.id_user) {
        //verify that there's a param
        if (id) {
          //update the resource
          await Folder.update({ status: 0, ...req.transaction, tr_user_id: req.user?.id_user }, { where: { id_folder: id } });

          res.status(204).send();
        }
      }
      else {
        res.status(401).send('Unauthorized');
      }
    }
    else {
      res.status(404).send();
    }
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

//Update project
folderRouter.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const id = req.params.id;
    //Find if the folder exists
    const folder = await Folder.findByPk(id);
    if (folder) {
      //Verify that the logged user owns the folder
      if (folder.user_id_user === req.user?.id_user) {
        //Verify that the folder was not deleted logically
        if (folder.status) {
          //verify that there's a param
          if (id) {
            //Update the folder parsing the body
            const body = req.body;
            const updateData = toNewFolder(body);
            const allFolders = await Folder.findAll({
              where: {
                user_id_user: req.user.id_user, status: 1
              },
            });
            //Verify if file name does not exist on the desired folder
            if (updateData.folder_name) {
              const fileNames = allFolders.map((file) => file.folder_name);

              if (fileNames.indexOf(updateData.folder_name) >= 0) {
                res.status(409).send('Folder already exists');
              }
            }

            await Folder.update({ ...updateData, ...req.transaction, tr_user_id: req.user?.id_user }, { where: { id_folder: id } });

            res.status(204).send();
          }
        }
        else {
          res.status(404).send('Folder does not exist');
        }
      }
      else {
        res.status(401).send('Unauthorized');
      }

    }
    else {
      res.status(404).send('Folder does not exist');
    }
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

export default folderRouter;
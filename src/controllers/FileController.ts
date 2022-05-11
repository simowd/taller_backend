import { Request, Router } from 'express';
import _ from 'lodash';
import passport from 'passport';
import File from '../models/File';
import Folder from '../models/Folder';
import { FileRequestParams, toNewFile, toUpdateFile } from '../types/file';
import blobServiceClient from '../utils/azure_blob';
import { v4 as uuidv4 } from 'uuid';

const fileRouter = Router({ mergeParams: true });

const ignoredFields = ['path', 'tr_id', 'tr_date', 'tr_user_id', 'tr_ip', 'password', 'status'];

//Get all files that exist
fileRouter.get('/', async (_req, res, next) => {
  try {
    const files = await File.findAll();
    const filteredFiles = files.map((file) => {
      return _.omit(file.toJSON(), ignoredFields);
    });
    res.status(200).send(filteredFiles);
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

//Create new file for a project
fileRouter.post('/', passport.authenticate('jwt', { session: false }), async (req: Request<FileRequestParams>, res, next) => {
  try {
    const folderId = req.params.folderId;
    //Find if the file exists
    const folder = await Folder.findByPk(folderId, { include: [File] });
    if (folder) {
      //Verify that the logged user owns the file
      if (folder.user_id_user === req.user?.id_user) {
        //verify that there's a param
        if (folderId) {

          const newData = toNewFile(req.body);

          const ifExists = folder.files.map((file) => file.file_name).indexOf(newData.file_name);

          if (ifExists <= -1) {
            const blobContainerClient = blobServiceClient.getContainerClient(folder.storage);

            const fileName = uuidv4();

            const newBlockBlobClient = blobContainerClient.getBlockBlobClient(fileName);

            const content = '';

            await newBlockBlobClient.upload(content, content.length, { blobHTTPHeaders: { blobContentType: 'text/x-python' } });

            const newFile = await File.create({
              user_id_user: req.user.id_user,
              folder_id_folder: folderId,
              path: newBlockBlobClient.url,
              storage: fileName,
              status: 1,
              ...newData,
              ...req.transaction,
              tr_user_id: req.user.id_user,
            });

            const filteredFile = _.omit(newFile.toJSON(), ignoredFields);

            res.status(200).send(filteredFile);
          }
          else {
            res.status(409).send('File name already exists');
          }

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

//Delete File from database (logically)
fileRouter.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const id = req.params.id;

    //Find if the file exists
    const file = await File.findByPk(id);
    if (file && file.status) {
      //Verify that the logged user owns the file
      if (file.user_id_user === req.user?.id_user) {
        //verify that there's a param
        if (id) {
          //update the resource
          await File.update({ status: 0, ...req.transaction, tr_user_id: req.user?.id_user }, { where: { id_file: id } });

          res.status(204).send();
        }
      }
      else {
        res.status(401).send('Unauthorized');
      }
    }
    else {
      res.status(404).send('File does not exist');
    }
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

//Update file information
fileRouter.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const id = req.params.id;

    const updateData = toUpdateFile(req.body);

    //Find if the file exists
    const file = await File.findByPk(id, {
      include: {
        model: Folder,
        include: [{
          model: File,
          attributes: ['file_name']
        }]
      }
    });
    if (file) {
      //Verify that the logged user owns the file
      if (file.user_id_user === req.user?.id_user) {
        //verify that there's a param
        if (id) {
          //Verify if file name does not exist on the desired folder
          if (updateData.file_name) {
            const fileNames = file.folder.files.map((file) => file.file_name);

            if (fileNames.indexOf(updateData.file_name) >= 0) {
              res.status(409).send('File already exists');
            }
          }
          //update the resource
          await File.update({ ...updateData, ...req.transaction, tr_user_id: req.user?.id_user }, { where: { id_file: id } });

          res.status(204).send();
        }
      }
      else {
        res.status(401).send('Unauthorized');
      }
    }
    else {
      res.status(404).send('File does not exist');
    }
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

export default fileRouter;
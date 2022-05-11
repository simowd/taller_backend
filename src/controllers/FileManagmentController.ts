import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import File from '../models/File';
import Folder from '../models/Folder';
import { FileRequestParams } from '../types/file';
import blobServiceClient from '../utils/azure_blob';
import fs from 'fs-extra';
import { path as pathRoot } from 'app-root-path';
import { fileUploader } from '../utils/upload';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

const fileManagmentRouter = Router();

const ignoredFields = ['path', 'tr_id', 'tr_date', 'tr_user_id', 'tr_ip', 'password', 'status'];

//Download specified file
fileManagmentRouter.get('/download/file/:fileId', passport.authenticate('jwt', { session: false }), async (req: Request<FileRequestParams>, res, next) => {
  try {
    const id = req.params.fileId;
    //Find if the file exists
    const file = await File.findByPk(id, { include: Folder });
    if (file && file.status) {
      //Verify that the logged user owns the file or the file is public
      if (file.user_id_user === req.user?.id_user || !file.private) {
        //verify that there's a param
        if (id) {
          //Possible path
          const projectPath = `${pathRoot}/tmp/${file.folder.storage}`;
          const filePath = `${projectPath}/${file.file_name}`;
          //Get the container where the file is stored
          const containerClient = blobServiceClient.getContainerClient(file.folder.storage);

          //Get the file as a stream
          const blockBlobClient = containerClient.getBlockBlobClient(file.storage);

          const buffer = await blockBlobClient.downloadToBuffer();

          //Create directory in the specified path
          await fs.ensureDir(projectPath);

          //Save file on the the temporal system path
          await fs.outputFile(filePath, buffer);

          res.download(filePath);
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

//Upload file to project
fileManagmentRouter.post('/upload/file/:projectId', [fileUploader.single('file'), passport.authenticate('jwt', { session: false })], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.projectId;
    //Find if the folder exists
    const folder = await Folder.findByPk(id, {
      include: {
        model: File,
        attributes: ['file_name'],
        where: { status: 1 }
      }
    });
    if (folder && folder.status) {
      //Verify that the logged user owns the folder
      if (folder.user_id_user === req.user?.id_user) {
        //verify that there's a param
        if (id) {
          //Verify that the file name is unique
          const currentFile = req.file;
          const file_names = folder.files.map((file) => {
            return file.file_name;
          });
          //Check that the file has a name
          if (currentFile?.originalname) {
            //Verify that file doesn't exist (with the same name)
            if (file_names.indexOf(currentFile.originalname) >= 0) {
              res.status(409).send('File with the same name already exists on the project');
            }
          }

          if (currentFile?.buffer) {
            //Create id for the new file
            const fileId = uuidv4();

            //Upload file to Azure
            const containerClient = blobServiceClient.getContainerClient(folder.storage);

            const blockBlobClient = containerClient.getBlockBlobClient(fileId);

            await blockBlobClient.uploadData(currentFile?.buffer);

            console.log(blockBlobClient);
            console.log(containerClient);

            const dbFileData = {
              user_id_user: req.user.id_user,
              folder_id_folder: id,
              path: blockBlobClient.url,
              storage: fileId,
              file_name: currentFile.originalname,
              private: true,
              status: 1,
              ...req.transaction,
              tr_user_id: req.user.id_user
            };

            const newFile = await File.create(dbFileData);
            const filteredFile = _.omit(newFile.toJSON(), ignoredFields);

            res.status(200).send({ ...filteredFile, fileString: currentFile.buffer.toString() });

          }
          else {
            res.status(400).send();
          }

          res.status(200).send();
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
      console.log(error);
      next(error);
    }
  }
});

export default fileManagmentRouter;
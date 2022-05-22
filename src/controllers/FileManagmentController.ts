import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import File from '../models/File';
import Folder from '../models/Folder';
import { FileRequestParams } from '../types/file';
import { blobBufferDownloader, blobContainerCreator, blobDataUploader, blobFileUploader } from '../utils/azure_blob';
import fs from 'fs-extra';
import { path as pathRoot } from 'app-root-path';
import { fileUploader } from '../utils/upload';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import Zip from 'adm-zip';
import path from 'path';

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

          const buffer = await blobBufferDownloader(file.folder.storage, file.storage);

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
        required: false,
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

          console.log(currentFile);

          //Check if the folder has files
          if (folder.files.length > 0) {
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
          }

          if (currentFile?.buffer) {
            //Create id for the new file
            const fileId = uuidv4();

            //Upload file to Azure
            const blockBlobClient = await blobDataUploader(folder.storage, fileId, currentFile.buffer);

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
            res.status(400).send('Buffer is empty');
          }

          res.status(200).send();
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

fileManagmentRouter.get('/download/project/:idFolder', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const idFolder = req.params.idFolder;
    if (idFolder) {
      //Get project info  and the files in it
      const folder = await Folder.findByPk(idFolder, {
        include: {
          model: File,
          where: { status: 1 }
        }
      });

      //Verify if folder exists
      if (folder) {
        //Verify if the user owns the project or if it is public
        if (folder.user_id_user === req.user?.id_user || !folder.private) {

          //Initialize ZIP file
          const zip = new Zip();
          const targetPath = `${pathRoot}/tmp/${folder.storage}/${folder.folder_name}.zip`;

          //Get all individual files blob id
          const fileReferences = folder.files.map((file) => ({ storage: file.storage, file_name: file.file_name }));

          //Download each file as a buffer and add it to the zip file
          for (const file of fileReferences) {
            //Download from Azure
            const fileBuffer = await blobBufferDownloader(folder.storage, file.storage);

            zip.addFile(file.file_name, fileBuffer);
          }

          //Save the file on the tmp folder and then send it to the user.
          await zip.writeZip(targetPath);
          res.download(targetPath);
        }
        else {
          res.send(401).send('Unauthorized');
        }
      }
      else {
        res.status(404).send('Folder does not exist');
      }
    }
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

//Save a project from a zip file to Azure and the Database
fileManagmentRouter.post('/upload/project/', [fileUploader.single('file'), passport.authenticate('jwt', { session: false })], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if (file) {
      if (file.mimetype === 'application/zip') {
        //Get file
        const fileName = path.parse(file.originalname).name;
        const projectsUser = await Folder.findAll({ where: { user_id_user: req.user?.id_user, status: 1 } });

        const filteredNames = projectsUser.map((folder) => folder.folder_name);

        //Verify that the file is unique in name
        if (filteredNames.indexOf(fileName) <= -1) {

          //Azure blob setup
          const newContainerId = uuidv4();
          const containerClient = await blobContainerCreator(newContainerId);

          const folder = await Folder.create({
            user_id_user: req.user?.id_user,
            folder_name: fileName,
            path: containerClient.url,
            storage: newContainerId,
            creation_date: new Date(Date.now()),
            private: true,
            status: 1,
            ...req.transaction,
            tr_user_id: req.user?.id_user
          });

          //Get the zip sent by the user
          const zip = new Zip(file.buffer);
          const files = zip.getEntries();

          const dataToCreate = [];

          for (const file of files) {

            const fileData = file.getData().toString();

            const blobId = uuidv4();
            const blockBlobClient = await blobFileUploader(newContainerId, blobId, fileData);

            dataToCreate.push({
              folder_id_folder: folder.id_folder,
              user_id_user: req.user?.id_user,
              file_name: file.entryName,
              path: blockBlobClient.url,
              storage: blobId,
              creation_date: new Date(Date.now()),
              private: true,
              status: 1,
              ...req.transaction,
              tr_user_id: req.user?.id_user
            });
          }

          const allFiles = await File.bulkCreate(dataToCreate, { returning: true });

          const fileData = allFiles.map((file) => _.omit(file.toJSON(), ignoredFields));
          const filteredFolder = _.omit(folder.toJSON(), ignoredFields) as any;

          filteredFolder.files = fileData;

          res.status(200).send(filteredFolder);
        }
        else {
          res.status(409).send('Folder already exists');
        }

      }
      else {
        res.status(400).send('Folder does not match zip extension');
      }
    }
    else {
      res.status(400).send('Folder not provided');
    }
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

export default fileManagmentRouter;
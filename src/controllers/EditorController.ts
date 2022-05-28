import { Router } from 'express';
import _ from 'lodash';
import File from '../models/File';
import Folder from '../models/Folder';
import { blobBufferDownloader } from '../utils/azure_blob';
import { lazyAuthUser } from '../utils/middleware';

const editorRouter = Router();

const ignoredFields = ['user_id_user', 'status', 'tr_id', 'tr_date', 'tr_user_id', 'tr_ip', 'password', 'status'];

editorRouter.get('/file/:fileId', async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    const file = await File.findOne({ where: { id_file: fileId, status: 1 }, include: { model: Folder, required: false, where: { status: 1 } } });

    if (file) {
      const auth = await lazyAuthUser(req);
      
      if (!file.private || auth?.id_user === file.user_id_user) {
        const fileBuffer = await blobBufferDownloader(file.folder.storage, file.storage);

        const data = {
          id_file: file.id_file,
          file_name: file.file_name,
          path: file.path,
          content: fileBuffer.toString(),
        };

        res.status(200).send(data);
      }
      else {
        res.status(401).send();
      }

    }
    else {
      res.status(404).send('File not found');
    }
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});


editorRouter.get('/project/:idProject', async (req, res, next) => {
  try {
    const projectId = req.params.idProject;
    const folder = await Folder.findOne({
      where: { id_folder: projectId, status: 1 },
      include: [{
        model: File,
        required: false,
        where: { status: 1 }
      }]
    });

    const files: Array<any> = new Array<any>();
    const auth = await lazyAuthUser(req);

    if (folder) {
      if (folder.user_id_user === auth?.id_user || !folder.private){
        for (const file of folder.files) {
          const data = await blobBufferDownloader(folder.storage, file.storage);
          
          const transferFileData = {
            ...file.toJSON(),
            content: data.toString()
          };
  
          const filteredFileData = _.omit(transferFileData, ignoredFields);
  
          files.push(filteredFileData);
        }
  
        const filteredFolder =  _.omit(folder.toJSON(), ignoredFields);
  
        const newFolder = {
          ...filteredFolder,
          files: files
        };
  
        res.status(200).send(newFolder);
      }
      else {
        res.status(203).send();
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

export default editorRouter;
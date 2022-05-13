import { Router } from 'express';
import File from '../models/File';
import Folder from '../models/Folder';
import { blobBufferDownloader } from '../utils/azure_blob';
import { lazyAuthUser } from '../utils/middleware';

const editorRouter = Router();

editorRouter.get('/file/:fileId', async(req, res, next) => {
  try {
    const fileId = req.params.fileId;
    const file = await File.findOne({where: { id_file: fileId, status: 1 }, include: { model: Folder, required: false, where: { status: 1 }}});

    if (file) {
      const auth = await lazyAuthUser(req);
      if( !file.private || auth){
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
        res.status(409).send();
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

export default editorRouter;
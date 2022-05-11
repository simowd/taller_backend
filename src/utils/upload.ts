import multer from 'multer';
import { path as appRoot } from 'app-root-path';
import { v4 as uuidv4 } from 'uuid';
import { extension } from 'mime-types';

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, `${appRoot}/public/images/`);
  },
  filename: (_req, file, cb) => {
    const uniqueFileName = Date.now() + '-' + uuidv4();
    cb(null, `${file.fieldname}-${uniqueFileName}.${extension(file.mimetype)}`);
  }
});

const fileLoader = multer.memoryStorage();

const imageUploader = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5242880 //5 Megabytes
  }
});

const fileUploader = multer({
  storage: fileLoader,
  limits: {
    fileSize: 10485760 // 10Megabytes}
  }
});

export { imageUploader, fileUploader };
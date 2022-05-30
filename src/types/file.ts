import { parseNumber, parseString } from '../utils/parsers';

interface FileRequestBody {
  file_name: string;
  private: boolean;
}

interface FileUpdateRequestBody {
  file_name?: string;
  private?: boolean;
}

interface FileRequestParams {
  folderId?: string;
  fileId?: string;
}

interface FileSocketBody {
  file_storage: string;
  folder_storage: string;
  value: string;
}

const toNewFile = (body: any): FileRequestBody => {
  const newFile: FileRequestBody = {
    file_name: parseString(body.file_name),
    private: !!body.private
  };

  return newFile;
};

const toUpdateFile = (body: any): FileUpdateRequestBody => {
  const newFile: FileUpdateRequestBody = <any>{};

  if(body.file_name){
    newFile.file_name = parseString(body.file_name);
  }
  if(body.private !== null || body.private !== undefined){
    console.log(body.private);
    if (body.private === 0){
      newFile.private = false;  
    }
    else {
      newFile.private = !!parseNumber(body.private);
    }
  }

  return newFile;
};

export { FileRequestParams, FileRequestBody, FileUpdateRequestBody, FileSocketBody, toNewFile, toUpdateFile };
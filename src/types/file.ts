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
}

const toNewFile = (body: any): FileRequestBody => {
  const newFile: FileRequestBody = {
    file_name: parseString(body.file_name),
    private: !!parseNumber(body.private)
  };

  return newFile;
};

const toUpdateFile = (body: any): FileUpdateRequestBody => {
  const newFile: FileUpdateRequestBody = <any>{};

  if(body.file_name){
    newFile.file_name = parseString(body.file_name);
  }
  if(body.private){
    newFile.private = !!parseNumber(body.private);
  }

  return newFile;
};

export { FileRequestParams, FileRequestBody, FileUpdateRequestBody,toNewFile, toUpdateFile };
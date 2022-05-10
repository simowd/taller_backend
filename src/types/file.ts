import { parseNumber, parseString } from '../utils/parsers';

interface FileRequestBody {
  file_name: string;
  private: boolean;
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

export { FileRequestParams, FileRequestBody, toNewFile };
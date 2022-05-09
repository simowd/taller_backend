import { parseNumber, parseString } from '../utils/parsers';

interface Folder {
  id_folder: number;
  user_id_user: number;
  folder_name: string;
  path: string;
  storage: string;
  creation_date: Date;
  private: number;
  tr_id: string;
  tr_date: Date;
  tr_user_id: number;
  tr_ip: string;
}

interface NewFolder {
  folder_name: string;
  private: number;
}

const toNewFolder = (body: any): NewFolder => {
  const data: NewFolder = {
    folder_name: parseString(body.folder_name),
    private: parseNumber(body.private)
  };

  return data;
};

export { toNewFolder, Folder };
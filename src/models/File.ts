import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import Folder from './Folder';
import User from './User';

@Table({ tableName: 'file', timestamps: false })
class File extends Model {
  
  @PrimaryKey
  @AutoIncrement
  @Column
    id_file: number;

  @ForeignKey(() => Folder)
  @Column
    folder_id_folder: number;

  @BelongsTo(() => Folder)
    folder: Folder;

  @ForeignKey(() => User)
    user_id_user: number;

  @BelongsTo(() => User)
    user: User;

  @Column(DataType.STRING(255))
    file_name: string;

  @Column(DataType.STRING(255))
    path: string;

  @Column(DataType.STRING(255))
    storage: string;

  @Column(DataType.DATE)
    creation_date: Date;

  @Column
    private: boolean;
  
  @Column(DataType.STRING(255))
    tr_id: string;

  @Column
    tr_date: Date;

  @Column(DataType.INTEGER)
    tr_user_id: number;

  @Column(DataType.STRING(50))
    tr_ip: string;
}

export default File;
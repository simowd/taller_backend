import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import User from './User';

@Table({tableName: 'folder', timestamps: false})
class Folder extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
    id_folder: number;
  
  @ForeignKey(() => User)
  @Column
    user_id_user: number;

  @BelongsTo(() => User)
    user: User;

  @Column(DataType.STRING(255))
    path: string;
  
  @Column(DataType.STRING(255))
    storage: string;

  @Column
    creation_date: Date;
  
  @Column(DataType.TINYINT)
    private: number;

  @Column(DataType.STRING(255))
    tr_id: string;

  @Column
    tr_date: Date;

  @Column(DataType.INTEGER)
    tr_user_id: number;

  @Column(DataType.STRING(50))
    tr_ip: string;
}

export default Folder;
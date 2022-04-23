import { Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import User from './User';

@Table({tableName: 'language'})
class Language extends Model {
  @PrimaryKey
  @Column(DataType.STRING(5))
    id_language: string;

  @Column(DataType.STRING(255))
    language: string;

  @Column(DataType.INTEGER)
    tr_id: number;

  @Column
    tr_date: Date;

  @Column(DataType.INTEGER)
    tr_user_id: number;

  @Column(DataType.STRING(50))
    tr_ip: string;

  @HasMany(() => User)
    users: User[];
}

export default Language;
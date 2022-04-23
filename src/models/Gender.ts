import { Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import User from './User';

@Table({tableName: 'gender', timestamps: false})
class Gender extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
    id_gender: number;

  @Column(DataType.STRING(25))
    gender: string;

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

export default Gender;
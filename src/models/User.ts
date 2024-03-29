import { AutoIncrement, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import Country from './Country';
import File from './File';
import Folder from './Folder';
import Gender from './Gender';
import Language from './Language';

@Table({tableName: 'user', timestamps: false})
class User extends Model {
  
  @PrimaryKey
  @AutoIncrement
  @Column
    id_user: number;

  @ForeignKey(() => Country)
  @Column
    country_id_country: string;

  @ForeignKey(() => Language)
  @Column
    language_id_language: string;

  @ForeignKey(() => Gender)
  @Column
    gender_id_gender: number;

  @Column(DataType.STRING(50))
    name: string;

  @Column(DataType.STRING(50))
    last_name: string;

  @Column(DataType.STRING(50))
    username: string;

  @Column(DataType.STRING(100))
    email: string;

  @Column(DataType.STRING(255))
    password: string;

  @Column(DataType.STRING(255))
    picture: string;

  @Column(DataType.INTEGER)
    status: number;

  @Default(1)
  @Column(DataType.INTEGER)
    tour_home: number;

  @Default(1)
  @Column(DataType.INTEGER)
    tour_editor: number;

  @Column(DataType.STRING(255))
    tr_id: string;

  @Column
    tr_date: Date;

  @Column(DataType.INTEGER)
    tr_user_id: number;

  @Column(DataType.STRING(50))
    tr_ip: string;

  @BelongsTo(() => Country)
    country: Country;

  @BelongsTo(() => Language)
    language: Language;

  @BelongsTo(() => Gender)
    gender: Gender;
  
  @HasMany(() => Folder)
    folders: Folder[];

  @HasMany(() => File)
    files: File[];
}

export default User;
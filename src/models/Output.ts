import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import File from './File';

@Table({ tableName: 'output', timestamps: false })
class Output extends Model {

  @AutoIncrement
  @PrimaryKey
  @Column
    id_output: number;

  @ForeignKey(() => File)
  @Column
    file_id_file: number;

  @BelongsTo(() => File)
    file: File;

  @Column
    status: number;

  @Column(DataType.STRING(255))
    result: string;

  @Column(DataType.STRING(255))
    tr_id: string;

  @Column
    tr_date: Date;

  @Column(DataType.INTEGER)
    tr_user_id: number;

  @Column(DataType.STRING(50))
    tr_ip: string;

}

export default Output;
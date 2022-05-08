import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import User from './User';

@Table({ tableName: 'setting', timestamps: false })
class Setting extends Model {
  @PrimaryKey
  @Column
    id_setting: number;

  @ForeignKey(() => User)
  @Column
    user_id_user: number;

  @BelongsTo(() => User)
    user: User;

  @Column
    dark_light: number;

  @Column
    audio_feedback: number;

  @Column
    animations: number;

  @Column
    high_contrast: number;

  @Column
    font_size: number;

  @Column
    font_type: string;

  @Column(DataType.STRING(255))
    tr_id: string;

  @Column
    tr_date: Date;

  @Column(DataType.INTEGER)
    tr_user_id: number;

  @Column(DataType.STRING(50))
    tr_ip: string;

}

export default Setting;
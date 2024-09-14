import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table
class User extends Model {
  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  email!: string;
  @Column(DataType.STRING)
  profile_id!:string
}

export default User;

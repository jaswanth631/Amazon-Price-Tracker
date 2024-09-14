import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import UserProduct from "./UserProduct";

@Table({ tableName: "Users" })
export default class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  cpassword!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone?: string;

  @HasMany(() => UserProduct)
  userProducts?: UserProduct[];
}

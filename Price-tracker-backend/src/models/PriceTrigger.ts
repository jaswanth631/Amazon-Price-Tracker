import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from "sequelize-typescript";
import UserProduct from "./UserProduct";

@Table
export default class PriceTrigger extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => UserProduct)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_product_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  trigger_price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  trigger_condition!: number;

  @BelongsTo(() => UserProduct)
  userProduct!: UserProduct;
}

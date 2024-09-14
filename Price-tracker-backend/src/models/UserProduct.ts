import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import User from "./User";
import { Product } from "./Product";
import PriceTrigger from "./PriceTrigger";

@Table
export default class UserProduct extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Product)
  @Column
  product_id!: string;

  @BelongsTo(() => Product)
  product!: Product;

  @HasMany(() => PriceTrigger)
  priceTriggers!: PriceTrigger[];
}

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Product } from "./Product"; // Assuming Product is another model you have

@Table({
  tableName: "Alerts",
  timestamps: true, // Adds createdAt and updatedAt fields
})
export class Alert extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  asin!: string;

  @BelongsTo(() => Product)
  product!: Product;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  alertPrice!: number; // The price at which the user wants to be notified

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isActive!: boolean; // To manage if the alert is still active after the price drop
}

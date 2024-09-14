// import {
//   Table,
//   Column,
//   Model,
//   ForeignKey,
//   DataType,
//   HasMany,
//   Index,
//   BelongsTo,
// } from "sequelize-typescript";
// import Platform from "./Platform";
// import ProductPrice from "./ProductPrice";

// @Table({
//   indexes: [{ fields: ["platform_product_id"], unique: true }],
// })
// export default class Product extends Model {
//   @Column({ autoIncrement: true })
//   id!: number;

//   @Column({ type: DataType.STRING })
//   name!: string;

//   @Column({ type: DataType.STRING, primaryKey: true })
//   platform_product_id!: string;

//   @ForeignKey(() => Platform)
//   @Column
//   platform_id!: number;

//   @BelongsTo(() => Platform)
//   platform!: Platform;

//   @HasMany(() => ProductPrice)
//   productPrices!: ProductPrice[];
// }
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from "sequelize-typescript";

@Table
export class Product extends Model {
  @PrimaryKey

  @Column({ type: DataType.STRING, allowNull: false })
  asin!: string;
  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.STRING })
  price!: string;

  @Column({ type: DataType.STRING })
  image!: string;

  @Column({ type: DataType.FLOAT })
  rating!: number;

  @Column({ type: DataType.STRING })
  reviewCount!: string;

  @Column({ type: DataType.STRING })
  currentPrice!: string;

  @Column({ type: DataType.STRING })
  originalPrice!: string;

  @Column({ type: DataType.STRING })
  currency!: string;

  @Column({ type: DataType.STRING })
  discountRate!: string;
}

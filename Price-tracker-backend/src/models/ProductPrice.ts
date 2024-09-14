// import {
//   Table,
//   Column,
//   Model,
//   ForeignKey,
//   BelongsTo,
//   DataType,
// } from "sequelize-typescript";
// import Product from "./Product";

// @Table
// export default class ProductPrice extends Model {
//   @Column({ autoIncrement: true })
//   id!: number;

//   @ForeignKey(() => Product)
//   @Column({ primaryKey: true })
//   product_id!: string;

//   @BelongsTo(() => Product)
//   Product!: Product;

//   @Column(DataType.FLOAT)
//   currentPrice!: number;

//   @Column(DataType.FLOAT)
//   originalPrice!: number;

//   @Column(DataType.FLOAT)
//   lowestPrice!: number;

//   @Column(DataType.FLOAT)
//   highestPrice!: number;

//   @Column(DataType.FLOAT)
//   averagePrice!: number;

//   @Column(DataType.FLOAT)
//   discountRate!: number;
// }
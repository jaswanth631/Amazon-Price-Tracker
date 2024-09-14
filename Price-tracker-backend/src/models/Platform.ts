// import { Table, Column, Model, HasMany, DataType } from "sequelize-typescript";
// import Product from "./Product";

// @Table
// export default class Platform extends Model {
//   @Column({ primaryKey: true, autoIncrement: true })
//   id!: number;

//   @Column(DataType.STRING)
//   name!: string;

//   @HasMany(() => Product)
//   products!: Product[];
// }
import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table
export default class Platform extends Model {
  @Column({ autoIncrement: true, primaryKey: true })
  id!: number;

  @Column(DataType.STRING)
  name!: string;
}

import { Sequelize } from "sequelize-typescript";
import Platform from "../models/Platform";
import { Product } from "../models/Product";
import UserProduct from "../models/UserProduct";
import PriceTrigger from "../models/PriceTrigger";
import User from "../models/User";
const Database = "Track2";
// Database connection
export const sequelize = new Sequelize(`${Database}`, "postgres", "12345", {
  host: "localhost",
  dialect: "postgres",
  port: 5433,
  models: [Platform, Product, UserProduct, PriceTrigger, User],
});

// const initialize = async () => {
//   try {
//     const database = await sequelize.query(`CREATE DATABASE ${Database}`);
//     console.log("Database created successfully.", database);
//     sequelize.authenticate();
//     await sequelize.sync({ force: true });
//     console.log("Tables synchronized successfully.");
//   } catch (error: any) {
//     if (error.parent.code === "42P04") {
//       console.log("Database already exists..");
//     } else if (error.parent.code === "3D000") {
//       const createDatabase = await sequelize.query(
//         `CREATE DATABASE ${Database}`
//       ); // still not working some changes need to be done
//       console.log("Database created successfully.", createDatabase);
//     }
//   }
// };
// initialize();

sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

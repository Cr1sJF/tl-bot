import { Application } from "express";
import fs from "fs";
import path from "path";

const basename = path.basename(__filename);

export default async (app: Application) => {
  fs.readdirSync(__dirname)
    .filter((file: string) => {
      return file.indexOf(".") !== 0 && file !== basename;
    })
    .forEach((file: any) => {
      const controller = require(path.join(__dirname, file)).default;
      app.use(controller.basePath, controller.router);
    });
};

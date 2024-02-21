import { Application } from "express";
import RoutesLoader from "./routes";
import DataBase from "./db";
import Logger from "../models/Loggers/Logger";

const log = new Logger("INDEX");

export default async (app: Application) => {
  try {
    await DataBase();
    await RoutesLoader(app);

    const port = process.env.PORT || 3001;

    app
      .listen(port, () => {
        log.info(`✅ SERVER RUNNING ON PORT ${port}`);
      })
      .on("error", (err) => {
        log.error(err);
        process.exit(1);
      });
  } catch (error: any) {
    log.error(`🚨FATAL ERROR INITIALIZING APP🚨`, error.message);
  }
};

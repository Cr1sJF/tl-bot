import { Application } from 'express';
import RoutesLoader from './routes';
import DataBase from './db';
import Logger from '../models/Loggers/Logger';
import axios from 'axios';

const log = new Logger('INDEX');

export default async (app: Application) => {
  try {
    await DataBase();
    await RoutesLoader(app);

    const port = process.env.PORT || 3001;

    app
      .listen(port, () => {
        log.info(`✅ SERVER RUNNING ON PORT ${port}`);

        // setInterval(async () => {
        //   try {
        //     log.info('PING...');
        //     const data = await axios.get(
        //       'https://tl-bot-g5x5.onrender.com/utils/ping',
        //       {
        //         timeout: 0,
        //       }
        //     );

        //     log.info(data.data);
        //   } catch (error: any) {
        //     log.error("Error in ping", error);
        //   }
        // }, 30000);
      })
      .on('error', (err) => {
        log.error(err);
        process.exit(1);
      });
  } catch (error: any) {
    log.error(`🚨FATAL ERROR INITIALIZING APP🚨`, error.message);
  }
};

import express, { Application } from 'express';
import Log from '../../models/Loggers/Logger';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
// import TelegramBotProvider from '../../providers/bot/Telegram';

const log = new Log('Middleware');

export default async (app: Application) => {
  try {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(bodyParser.text({ type: 'text/plain' }));
    app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
      })
    );

    // const TLBOT = new TelegramBotProvider();
    // log.info('TL BOT LOADED', TLBOT ? 'True' : 'False');
  } catch (error: any) {
    log.error('Error creando Middleware', error);
  }
};

import express, { Application } from 'express';
import Log from '../../models/Loggers/Logger';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';

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
  } catch (error: any) {
    log.error('Error creando Middleware', error);
  }
};

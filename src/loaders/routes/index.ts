import { Application, Request, Response } from 'express';
import Logger from '../../models/Loggers/Logger';
// import jwt from 'jsonwebtoken';
import Middelware from './middleware';
import Routes from '../../controllers';
const log = new Logger('ROUTES');

export const validarToken = async (
  _: Request,
  __: Response,
  next: Function
) => {
  // if (req.url === "/appSettings/login") return next();

  // const token = req.headers.authorization?.split(" ")[1];
  // if (!token) {
  //   return res.status(401).json({ error: "Missing token" });
  // }

  // jwt.verify(token, process.env.PASSPHRASE!, (err, _) => {
  //   if (err) {
  //     return res.status(403).json({ error: "Token no válido" });
  //   }
  // });
  next();
};

export default async (app: Application) => {
  try {
    log.info('LOADING ROUTES...');
    Middelware(app);
    // app.use(validarToken);
    await Routes(app);
    await log.info('✅ ROUTES LOADED');
  } catch (error: any) {
    log.error('Error inicializando BD', error);
  }
};

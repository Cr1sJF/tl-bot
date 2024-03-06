import { ObjectLiteral, Repository } from 'typeorm';
import { getInstance } from '../../../loaders/db';
import Log from '../../Loggers/Logger';

const log = new Log('DB');
export default class BaseModel {
  static log: Log = log;
  static getInstance<T extends ObjectLiteral>(): Repository<T> {
    const db = getInstance();
    return db.getRepository(this) as Repository<T>;
  }

  static getClient() {
    return getInstance();
  }
}

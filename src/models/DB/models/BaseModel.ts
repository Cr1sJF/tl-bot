import { ObjectLiteral, Repository } from 'typeorm';
import { getInstance } from '../../../loaders/db';

export default class BaseModel {
  static getInstance<T extends ObjectLiteral>(): Repository<T> {
    const db = getInstance();
    return db.getRepository(this) as Repository<T>;
  }
}

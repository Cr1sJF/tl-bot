import { DataSource } from 'typeorm';
import fs from 'fs';
import path from 'path';
import User from '../models/DB/models/User';

let DB_INSTANCE: DataSource;

const loadModels = async () => {
  const models: any[] = [];
  fs.readdirSync(path.normalize(process.cwd() + '/src/models/DB/models'))
    .filter((file: string) => {
      return file.indexOf('.') !== 0 && file !== 'BaseModel.ts';
    })
    .forEach((file: any) => {
      const controller = require(path.normalize(
        process.cwd() + '/src/models/DB/models/' + file
      )).default;
      models.push(controller);
    });

  return models;
};

const init = async () => {
  try {
    const models = await loadModels();

    const db = new DataSource({
      type: 'postgres',
      url: process.env.DB_URL,
      synchronize: false,
      entities: models,
      logging: true,
    });
    await db.initialize();

    console.log('Database connected');

    DB_INSTANCE = db;
  } catch (error) {
    console.log('Error connecting to database', error);
  }
};
export default init;

export const getInstance = () => {
  return DB_INSTANCE;
};

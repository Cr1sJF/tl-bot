import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ISession } from '@grammyjs/storage-typeorm';
import BaseModel from './BaseModel';

@Entity('session')
export class Session extends BaseModel implements ISession {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column('varchar')
  key!: string;

  @Column('text')
  value!: string;
}

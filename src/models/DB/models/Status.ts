import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import Request from './Request';
import Report from './Report';
import BaseModel from './BaseModel';

export enum STATUS {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  IN_PROGRESS = 'IN_PROGRESS',
  FAILED = 'FAILED',
}

@Entity('status')
@Unique('uniqueStatus', ['name'])
export default class Status extends BaseModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100 })
  label!: string;

  @OneToMany(() => Request, (request) => request.status)
  requests!: Request[];

  @OneToMany(() => Report, (report) => report.status)
  reports!: Report[];

  public static async getStatus(name: STATUS): Promise<Status | null> {
    const repository = Status.getInstance<Status>();

    return await repository.findOne({
      where: { name },
    });
  }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import Status, { STATUS } from './Status';
import BaseModel from './BaseModel';
import User from './User';

@Entity('requests')
export default class Request extends BaseModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Status, (status) => status.requests)
  status!: Status;

  @Column({ name: 'tmdbId' })
  tmdbId!: number;

  @Column({ length: 100 })
  type!: string;

  @Column()
  season?: number;

  @ManyToMany(() => User, (user) => user.requests)
  users!: User[];

  public static async registerRequest(
    tmdbId: number,
    type: string,
    chatId: number,
    season?: number
  ): Promise<Request | null> {
    try {
      const repository = Request.getInstance<Request>();
      const status = await Status.getStatus(STATUS.PENDING);

      const request = new Request();
      request.tmdbId = tmdbId;
      request.type = type;
      request.status = status!;
      request.season = season;
      await repository.save(request);

      const userStatus = await User.saveRequest(chatId, request);

      if (userStatus) {
        return request;
      } else {
        return null;
      }
    } catch (error: any) {
      Request.log.db('Error registering request', error);
      return null;
    }
  }
}

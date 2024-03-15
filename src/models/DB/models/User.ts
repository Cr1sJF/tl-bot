import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import Report from './Report';
import BaseModel from './BaseModel';
import Request from './Request';
import Notification from './Notification';

@Entity('users')
export default class User extends BaseModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  jellyId!: string;

  @Column()
  chatId!: number;

  @Column()
  name!: string;

  @Column()
  lastName!: string;

  @Column()
  country!: string;

  @OneToMany(() => Report, (report) => report.user)
  reports!: Report[];

  @ManyToMany(() => Request, (request) => request.users)
  @JoinTable({
    name: 'user_requests_request',
    joinColumns: [{ name: 'userId' }],
    inverseJoinColumns: [{ name: 'requestId' }],
  })
  requests!: Request[];

  @ManyToMany(() => Notification, (notification) => notification.users)
  @JoinTable({
    name: 'user_notifications_notifications',
    joinColumns: [{ name: 'userId' }],
    inverseJoinColumns: [{ name: 'notificationId' }],
  })
  notifications!: Notification[];

  public async save(): Promise<User> {
    try {
      const repo = User.getInstance();
      const record = await repo.save(this);

      return record;
    } catch (error) {
      console.error('Error saving user', error);

      throw new Error('Error saving user');
    }
  }

  public static async find(include?: string): Promise<User[]> {
    try {
      const repo = User.getInstance<User>();

      const records = await repo.find({
        relations: [include || ''],
      });

      return records;
    } catch (error) {
      console.error('Error finding user', error);

      return [];
    }
  }

  public static async validateLogin(chatId?: number): Promise<boolean> {
    try {
      const repo = User.getInstance();
      const user = await repo.find({
        where: {
          chatId: chatId,
        },
      });

      return user.length > 0;
    } catch (error) {
      console.error('Error finding user', error);

      return false;
    }
  }

  public static async saveRequest(
    chatId: number,
    request: Request
  ): Promise<boolean> {
    try {
      const repo = User.getInstance();
      const user = await repo.findOne({
        where: {
          chatId: chatId,
        },
        relations: ['requests'],
      });

      user?.requests?.push(request);

      await repo.save(user!);

      return true;
    } catch (error: any) {
      User.log.db('Error saving request', error);
      return false;
    }
  }

  public static async saveNotification(user: User): Promise<boolean> {
    try {
      const repo = User.getInstance();

      await repo.save(user);
      return true;
    } catch (error: any) {
      User.log.db('Error saving notification', error);
      return false;
    }
  }

  public static async addNotification(
    user: User,
    notification: Notification
  ): Promise<boolean> {
    try {
      const repo = User.getInstance();
      user.notifications?.push(notification);
      await repo.save(user);

      return true;
    } catch (error: any) {
      User.log.db('Error adding notification', error);
      return false;
    }
  }

  public static async removeNotification(
    user: User,
    notification: Notification
  ): Promise<boolean> {
    try {
      const repo = User.getInstance();
      user.notifications = user.notifications?.filter(
        (n) => n.id !== notification.id
      );

      await repo.save(user);

      return true;
    } catch (error: any) {
      User.log.db('Error removing notification', error);
      return false;
    }
  }
}

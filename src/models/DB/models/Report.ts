import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import User from './User';
import Status, { STATUS } from './Status';
import BaseModel from './BaseModel';

@Entity('reports')
export default class Report extends BaseModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.reports, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Status, (status) => status.reports, { onDelete: 'CASCADE' })
  status!: Status;

  @Column({ length: 5000 })
  description!: string;

  @Column({ length: 50 })
  type!: string;

  public static async register(
    chatId: number,
    type: string,
    description: string
  ): Promise<Report | null> {
    try {
      const status = await Status.getStatus(STATUS.PENDING);
      const user = await User.getInstance<User>().findOne({
        where: { chatId },
      });

      const report = new Report();
      report.description = description;
      report.type = type;
      report.user = user!;
      report.status = status!;

      await Report.getInstance().save(report);

      return report;
    } catch (error: any) {
      Report.log.db('Error registering report', error);

      return null;
    }
  }
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import  User from './User';
import  Status  from './Status';
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
}

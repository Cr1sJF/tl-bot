import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import BaseModel from './BaseModel';
import User from './User';

@Entity('notifications')
export default class Notification extends BaseModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    type!: string;

    @ManyToMany(() => User, (user) => user.notifications)
    users!: User[]
}
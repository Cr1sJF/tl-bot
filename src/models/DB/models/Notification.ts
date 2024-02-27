import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import BaseModel from './BaseModel';

@Entity('notifications')
export default class Notification extends BaseModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    type!: string;
}
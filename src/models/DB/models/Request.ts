import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import  Status from './Status';
import BaseModel from './BaseModel';

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

}
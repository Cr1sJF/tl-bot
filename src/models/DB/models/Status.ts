import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import Request from './Request';
import Report from './Report';
import BaseModel from './BaseModel';

@Entity('status')
@Unique('uniqueStatus', ['name'])
export default class Status extends BaseModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @OneToMany(() => Request, (request) => request.status)
    requests!: Request[];

    @OneToMany(() => Report, (report) => report.status)
    reports!: Report[];
}

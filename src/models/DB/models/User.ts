import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import Report from './Report';
import BaseModel from './BaseModel';
import Request from './Request';
import Notification from './Notification';

@Entity('users')
export default class User extends BaseModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'jellyId', length: 1000 })
    jellyId!: string;

    @Column({ name: 'chatId', length: 1000 })
    chatId!: string;

    @Column({ length: 100 })
    name!: string;

    @Column({ name: 'lastName', length: 100 })
    lastName!: string;

    @OneToMany(() => Report, (report) => report.user)
    reports!: Report[];

    @ManyToMany(() => Request)
    @JoinTable()
    requests!: Request[]

    @ManyToMany(() => Notification)
    @JoinTable()
    notifications!: Notification[]


    public async save(): Promise<User> {
        try {
            const repo = User.getInstance();
            const record = await repo.save(this);

            return record;
        } catch (error) {
            console.error("Error saving user", error);

            throw new Error("Error saving user");
        }
    }

    public static async find(): Promise<User[]> {
        try {
            const repo = User.getInstance<User>();

            const records = await repo.find();

            return records;
        } catch (error) {
            console.error("Error finding user", error);

            return []
        }
    }

    public static async validateLogin(chatId?: number): Promise<boolean> {
        try {
            const repo = User.getInstance();
            const user = await repo.find({
                where: {
                    chatId: chatId
                }
            });

            return user.length > 0
        } catch (error) {
            console.error("Error finding user", error);

            return false;
        }
    }

}




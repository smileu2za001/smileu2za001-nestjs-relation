import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Task } from '../tasks/task.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToMany(type => Task, TASK => TASK.user, { eager: true })
    tasks: Task[];

    async validatePassword(PASSWORD: string): Promise<boolean> {
        const hash = await bcrypt.hash(PASSWORD, this.salt);
        return hash === this.password;
    }
}

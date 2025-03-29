import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Sport } from '../../sports/entities/sport.entity';
import { User } from '../../users/entities/user.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity()
export class ClassSchedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;

    @Column()
    location: string;

    @ManyToOne(() => Sport, { eager: true })
    sport: Sport;

    @ManyToOne(() => User, { eager: true }) // professor
    teacher: User;

    @OneToMany(() => Attendance, (attendance) => attendance.classSchedule)
    attendances: Attendance[];
}

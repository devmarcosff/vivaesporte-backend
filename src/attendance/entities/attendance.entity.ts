import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { ClassSchedule } from '../../class-schedule/entities/class-schedule.entity';
import { Student } from 'src/students/entities/student.entity';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'JUSTIFIED';

@Entity()
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Student, { eager: true })
    student: Student;

    @ManyToOne(() => ClassSchedule, (classSchedule) => classSchedule.attendances)
    classSchedule: ClassSchedule;

    @Column({ type: 'enum', enum: ['PRESENT', 'ABSENT', 'JUSTIFIED'] })
    status: AttendanceStatus;
}

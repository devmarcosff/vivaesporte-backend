import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { ClassSchedule } from '../class-schedule/entities/class-schedule.entity';
import { Student } from 'src/students/entities/student.entity';
import { RegisterAttendanceDto } from './dto/register-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private repo: Repository<Attendance>,

    @InjectRepository(Student)
    private studentRepo: Repository<Student>,

    @InjectRepository(ClassSchedule)
    private scheduleRepo: Repository<ClassSchedule>,
  ) { }

  async create(dto: CreateAttendanceDto) {
    const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
    const schedule = await this.scheduleRepo.findOne({ where: { id: dto.classScheduleId } });

    if (!student || !schedule) throw new NotFoundException('Aluno ou aula não encontrada');

    const attendance = this.repo.create({
      student,
      classSchedule: schedule,
      status: dto.status,
    });

    return this.repo.save(attendance);
  }

  async listByClassSchedule(classId: number) {
    return this.repo.find({
      where: { classSchedule: { id: classId } },
      relations: ['student', 'classSchedule'],
    });
  }

  async registerOrUpdate(dto: RegisterAttendanceDto) {
    const existing = await this.repo.findOne({
      where: {
        student: { id: dto.studentId },
        classSchedule: { id: dto.classScheduleId },
      },
      relations: ['student', 'classSchedule'],
    });

    const student = await this.studentRepo.findOne({
      where: { id: dto.studentId },
      relations: ['sports'],
    });

    const schedule = await this.scheduleRepo.findOne({
      where: { id: dto.classScheduleId },
      relations: ['teacher', 'sport'],
    });

    if (!student || !schedule) throw new NotFoundException('Aluno ou aula não encontrada');

    if (dto.teacherId !== schedule.teacher.id) {
      throw new UnauthorizedException('Você não tem permissão para registrar presença nesta aula.');
    }

    const alunoInscrito = student.sports.some(
      (sport) => sport.id === schedule.sport.id,
    );

    if (!alunoInscrito) {
      throw new BadRequestException('Aluno não está inscrito neste esporte.');
    }

    if (existing) {
      existing.status = dto.status;
      return this.repo.save(existing);
    }

    const attendance = this.repo.create({
      student,
      classSchedule: schedule,
      status: dto.status,
    });

    return this.repo.save(attendance);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateAttendanceDto) {
    const attendance = await this.repo.findOne({ where: { id } });
    if (!attendance) throw new NotFoundException('Registro de presença não encontrado');

    if (dto.status) attendance.status = dto.status;
    return this.repo.save(attendance);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
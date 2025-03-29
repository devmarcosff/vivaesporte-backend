import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassSchedule } from './entities/class-schedule.entity';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';
import { Sport } from '../sports/entities/sport.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ClassScheduleService {
  constructor(
    @InjectRepository(ClassSchedule)
    private classRepo: Repository<ClassSchedule>,

    @InjectRepository(Sport)
    private sportRepo: Repository<Sport>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async create(dto: CreateClassScheduleDto) {
    const sport = await this.sportRepo.findOneByOrFail({ id: Number(dto.sportId) });
    const teacher = await this.userRepo.findOneByOrFail({ id: Number(dto.teacherId) });

    const schedule = this.classRepo.create({
      ...dto,
      sport,
      teacher,
    });

    return this.classRepo.save(schedule);
  }

  async findByProfessor(teacherId: number) {
    return this.classRepo.find({
      where: { teacher: { id: teacherId } },
      relations: ['sport'],
      order: { date: 'ASC' },
    });
  }

  findAll() {
    return this.classRepo.find({
      relations: ['sport', 'teacher'],
      order: { date: 'ASC', startTime: 'ASC' },
    });
  }

  findOne(id: number) {
    return this.classRepo.findOne({
      where: { id },
      relations: ['sport', 'teacher'],
    });
  }

  findOneWithAttendances(id: number) {
    return this.classRepo.findOne({
      where: { id },
      relations: ['attendances', 'attendances.student'],
    });
  }

  async update(id: number, dto: UpdateClassScheduleDto) {
    const aula = await this.classRepo.findOne({ where: { id } });
    if (!aula) throw new NotFoundException('Aula não encontrada');

    if (dto.sportId) {
      const sport = await this.sportRepo.findOne({ where: { id: Number(dto.sportId) } });
      if (!sport) throw new NotFoundException('Modalidade não encontrada');
      aula.sport = sport;
    }

    if (dto.teacherId) {
      const teacher = await this.userRepo.findOne({ where: { id: Number(dto.teacherId) } });
      if (!teacher) throw new NotFoundException('Professor não encontrado');
      aula.teacher = teacher;
    }

    Object.assign(aula, {
      date: dto.date ?? aula.date,
      location: dto.location ?? aula.location,
    });

    return this.classRepo.save(aula);
  }

  async remove(id: number) {
    return this.classRepo.delete(id);
  }
}

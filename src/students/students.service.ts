import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { Sport } from 'src/sports/entities/sport.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
    @InjectRepository(Sport)
    private sportRepo: Repository<Sport>,
  ) { }

  async create(createStudentDto: CreateStudentDto) {
    const existing = await this.studentRepo.findOne({ where: { document: createStudentDto.document } });
    if (existing) return existing;

    const student = this.studentRepo.create(createStudentDto);

    if (createStudentDto.sportIds?.length) {
      if (createStudentDto.sportIds.length > 2) throw new Error('Máximo de 2 esportes permitidos');
      student.sports = await this.sportRepo.findByIds(createStudentDto.sportIds);
    }

    return this.studentRepo.save(student);
  }

  async findByDocument(document: string) {
    return this.studentRepo.findOne({ where: { document } });
  }

  findAll() {
    return this.studentRepo.find({ relations: ['sports'] });
  }

  findOne(id: number) {
    return this.studentRepo.findOne({ where: { id }, relations: ['sports'] });
  }

  async update(id: number, data: UpdateStudentDto) {
    const student = await this.studentRepo.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Aluno não encontrado');

    Object.assign(student, data);

    if (data.sportIds) {
      if (data.sportIds.length > 2) throw new Error('Máximo de 2 esportes permitidos');
      student.sports = await this.sportRepo.findByIds(data.sportIds);
    }

    return this.studentRepo.save(student);
  }

  async remove(id: number) {
    return this.studentRepo.delete(id);
  }
}

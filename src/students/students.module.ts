import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Sport } from 'src/sports/entities/sport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Sport])],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule { }

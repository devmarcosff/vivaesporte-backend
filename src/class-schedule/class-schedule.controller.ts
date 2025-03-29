import { Controller, Get, Post, Body, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { ClassScheduleService } from './class-schedule.service';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('class-schedule')
export class ClassScheduleController {
  constructor(private readonly service: ClassScheduleService) { }

  // ADMIN_SECRETARIA - PRIVADO
  @Roles('ADMIN_SECRETARIA')
  @Post()
  create(@Body() dto: CreateClassScheduleDto) {
    return this.service.create(dto);
  }

  @Roles('ADMIN_SECRETARIA')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // PROFESSOR - PRIVADO
  @Roles('PROFESSOR')
  @Get('minhas')
  listarAulasDoProfessor(@Req() req) {
    return this.service.findByProfessor(req.user.userId);
  }

  // ADMIN_SECRETARIA & PROFESSOR - PRIVADO
  @Get(':id/attendance')
  @Roles('ADMIN_SECRETARIA', 'PROFESSOR')
  findOneWithAttendance(@Param('id') id: number) {
    return this.service.findOneWithAttendances(id);
  }

  // TODOS - PUBLICO
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClassScheduleDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

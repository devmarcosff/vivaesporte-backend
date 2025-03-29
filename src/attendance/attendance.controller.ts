import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { RegisterAttendanceDto } from './dto/register-attendance.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) { }

  @Roles('PROFESSOR')
  @Post()
  create(@Body() dto: CreateAttendanceDto) {
    return this.service.create(dto);
  }

  @Roles('PROFESSOR')
  @Get('class/:classScheduleId')
  async listByClass(@Param('classScheduleId') classId: number) {
    return this.service.listByClassSchedule(classId);
  }

  @Roles('PROFESSOR')
  @Post('register')
  async register(@Body() dto: RegisterAttendanceDto) {
    return this.service.registerOrUpdate(dto);
  }

  @Roles('ADMIN_SECRETARIA')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Roles('ADMIN_SECRETARIA')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAttendanceDto) {
    return this.service.update(+id, dto);
  }

  @Roles('ADMIN_SECRETARIA')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

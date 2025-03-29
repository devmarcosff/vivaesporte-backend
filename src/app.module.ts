import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { getDatabaseConfig } from './config/database.config';
import { StudentsModule } from './students/students.module';
import { SportsModule } from './sports/sports.module';
import { ClassScheduleModule } from './class-schedule/class-schedule.module';
import { UsersModule } from './users/users.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
    }),
    StudentsModule,
    SportsModule,
    ClassScheduleModule,
    UsersModule,
    AttendanceModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { AttendanceStatus } from '../entities/attendance.entity';

export class CreateAttendanceDto {
  studentId: number;
  classScheduleId: number;
  status: AttendanceStatus;
}

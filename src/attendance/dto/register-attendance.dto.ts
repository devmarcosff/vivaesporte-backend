export class RegisterAttendanceDto {
  classScheduleId: number;
  studentId: number;
  status: 'PRESENT' | 'ABSENT' | 'JUSTIFIED';
  teacherId: number; // por enquanto
}
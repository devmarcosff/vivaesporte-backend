import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN_SECRETARIA' | 'PROFESSOR';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // hash futuramente

  @Column({ type: 'enum', enum: ['SUPER_ADMIN', 'ADMIN_SECRETARIA', 'PROFESSOR'] })
  role: UserRole;
}

import { Sport } from 'src/sports/entities/sport.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  birthDate: string;;

  @Column()
  document: string;

  @Column()
  address: string;

  @Column()
  bloodType: string;

  @Column()
  shift: string;

  @Column()
  school: string;

  @Column()
  registrationNumber: string;

  @Column()
  filiation: string;

  @Column()
  contact: string;

  @Column({ nullable: true })
  photoUrl: string;

  @ManyToMany(() => Sport)
  @JoinTable()
  sports: Sport[];
}

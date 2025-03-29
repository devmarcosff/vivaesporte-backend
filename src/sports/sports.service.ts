import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sport } from './entities/sport.entity';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';

@Injectable()
export class SportsService {
  constructor(
    @InjectRepository(Sport)
    private sportRepo: Repository<Sport>,
  ) { }

  async create(createSportDto: CreateSportDto) {
    const existing = await this.sportRepo.findOne({ where: { name: createSportDto.name } });

    if (existing) {
      return existing; // Se já existir, retorna ele
    }

    const sport = this.sportRepo.create(createSportDto);
    return this.sportRepo.save(sport);
  }

  findAll() {
    return this.sportRepo.find();
  }

  findOne(id: number) {
    return this.sportRepo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateSportDto) {
    const sport = await this.sportRepo.findOne({ where: { id } });
    if (!sport) throw new Error('Modalidade não encontrada');
    Object.assign(sport, dto);
    return this.sportRepo.save(sport);
  }

  remove(id: number) {
    return this.sportRepo.delete(id);
  }
}

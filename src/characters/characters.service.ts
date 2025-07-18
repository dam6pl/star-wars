import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/character.entity';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private charactersRepository: Repository<Character>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const character = this.charactersRepository.create(createCharacterDto);

    return this.charactersRepository.save(character);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<[Character[], number]> {
    return this.charactersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Character> {
    const character = await this.charactersRepository.findOne({
      where: { id },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    return character;
  }

  async update(
    id: number,
    updateCharacterDto: UpdateCharacterDto,
  ): Promise<Character> {
    const character = await this.findOne(id);
    Object.assign(character, updateCharacterDto);

    return this.charactersRepository.save(character);
  }

  async remove(id: number): Promise<void> {
    const result = await this.charactersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }
  }
}

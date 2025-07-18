import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageDto } from '../common/dto/page.dto';
import { CharacterDto } from './dto/character.dto';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/character.entity';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private charactersRepository: Repository<Character>,
  ) {}

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CharacterDto>> {
    const [characters, total] = await this.charactersRepository.findAndCount({
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
      order: { name: 'ASC' },
    });

    return new PageDto(
      plainToInstance(CharacterDto, characters, {
        excludeExtraneousValues: true,
      }),
      pageOptionsDto.page ?? 1,
      pageOptionsDto.take ?? 10,
      total,
    );
  }

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const character = this.charactersRepository.create(createCharacterDto);
    const createdCharacter = await this.charactersRepository.save(character);

    return plainToInstance(CharacterDto, createdCharacter, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number): Promise<CharacterDto> {
    const character = await this.charactersRepository.findOne({
      where: { id },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    return plainToInstance(CharacterDto, character, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: number,
    updateCharacterDto: UpdateCharacterDto,
  ): Promise<CharacterDto> {
    const character = await this.findOne(id);
    Object.assign(character, updateCharacterDto);
    const updatedCharacter = await this.charactersRepository.save(character);

    return plainToInstance(CharacterDto, updatedCharacter, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.charactersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }
  }
}

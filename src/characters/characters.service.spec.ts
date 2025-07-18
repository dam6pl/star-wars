import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import {
  mockCharacter,
  mockCharacters,
  mockCreateCharacterDto,
  mockUpdateCharacterDto,
} from '../../test/utils/mock-data';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageDto } from '../common/dto/page.dto';
import { CharactersService } from './characters.service';
import { Character } from './entities/character.entity';

describe('CharactersService', () => {
  let service: CharactersService;
  let repository: Repository<Character>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: getRepositoryToken(Character),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
    repository = module.get<Repository<Character>>(
      getRepositoryToken(Character),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new character', async () => {
      mockRepository.create.mockReturnValue(mockCharacter);
      mockRepository.save.mockResolvedValue(mockCharacter);

      const result = await service.create(mockCreateCharacterDto);

      expect(repository.create).toHaveBeenCalledWith(mockCreateCharacterDto);
      expect(repository.save).toHaveBeenCalledWith(mockCharacter);
      expect(result).toEqual(mockCharacter);
    });
  });

  describe('findAll', () => {
    it('should return paginated characters', async () => {
      const pageOptionsDto = plainToInstance(PageOptionsDto, {
        page: 1,
        take: 10,
      });
      const pageDto = plainToInstance(PageDto, {
        data: mockCharacters,
        total: 2,
        page: 1,
        take: 10,
      });
      mockRepository.findAndCount.mockResolvedValue([mockCharacters, 2]);

      const result = await service.findAll(pageOptionsDto);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: pageOptionsDto.take,
        order: { name: 'ASC' },
      });
      expect(result).toEqual(pageDto);
    });
  });

  describe('findOne', () => {
    it('should return a character by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockCharacter);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockCharacter);
    });

    it('should throw NotFoundException when character is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a character', async () => {
      const updatedCharacter = { ...mockCharacter, ...mockUpdateCharacterDto };
      mockRepository.findOne.mockResolvedValue(mockCharacter);
      mockRepository.save.mockResolvedValue(updatedCharacter);

      const result = await service.update(1, mockUpdateCharacterDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith(updatedCharacter);
      expect(result).toEqual(updatedCharacter);
    });

    it('should throw NotFoundException when character to update is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, mockUpdateCharacterDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a character', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when character to delete is not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});

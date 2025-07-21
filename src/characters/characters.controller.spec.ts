import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import {
  mockCharacter,
  mockCharacters,
  mockCreateCharacterDto,
  mockUpdateCharacterDto,
} from '../../test/utils/mock-data';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageDto } from '../common/dto/page.dto';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';

describe('CharactersController', () => {
  let controller: CharactersController;
  let service: CharactersService;

  const mockCharactersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        {
          provide: CharactersService,
          useValue: mockCharactersService,
        },
      ],
    }).compile();

    controller = module.get<CharactersController>(CharactersController);
    service = module.get<CharactersService>(CharactersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new character', async () => {
      mockCharactersService.create.mockResolvedValue(mockCharacter);

      const result = await controller.create(mockCreateCharacterDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateCharacterDto);
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
      mockCharactersService.findAll.mockResolvedValue(pageDto);

      const result = await controller.findAll(pageOptionsDto);

      expect(service.findAll).toHaveBeenCalledWith(pageOptionsDto);
      expect(result).toEqual(pageDto);
    });

    it('should use default pagination values', async () => {
      const pageOptionsDto = plainToInstance(PageOptionsDto, {});
      const pageDto = plainToInstance(PageDto, {
        data: mockCharacters,
        total: 2,
        page: 1,
        take: 10,
      });
      mockCharactersService.findAll.mockResolvedValue(pageDto);

      const result = await controller.findAll(pageOptionsDto);

      expect(service.findAll).toHaveBeenCalledWith(pageOptionsDto);
      expect(result).toEqual(pageDto);
    });
  });

  describe('findOne', () => {
    it('should return a character by id', async () => {
      mockCharactersService.findOne.mockResolvedValue(mockCharacter);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCharacter);
    });
  });

  describe('update', () => {
    it('should update a character', async () => {
      const updatedCharacter = { ...mockCharacter, ...mockUpdateCharacterDto };
      mockCharactersService.update.mockResolvedValue(updatedCharacter);

      const result = await controller.update(1, mockUpdateCharacterDto);

      expect(service.update).toHaveBeenCalledWith(1, mockUpdateCharacterDto);
      expect(result).toEqual(updatedCharacter);
    });
  });

  describe('remove', () => {
    it('should delete a character', async () => {
      mockCharactersService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});

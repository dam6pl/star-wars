import { Test, TestingModule } from '@nestjs/testing';
import {
  mockCharacter,
  mockCharacters,
  mockCreateCharacterDto,
  mockUpdateCharacterDto,
} from '../../test/utils/mock-data';
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
      const page = 1;
      const limit = 10;
      mockCharactersService.findAll.mockResolvedValue([mockCharacters, 2]);

      const result = await controller.findAll(page, limit);

      expect(service.findAll).toHaveBeenCalledWith(page, limit);
      expect(result).toEqual({
        data: mockCharacters,
        total: 2,
        page: 1,
        limit: 10,
      });
    });

    it('should use default pagination values', async () => {
      mockCharactersService.findAll.mockResolvedValue([mockCharacters, 2]);

      const result = await controller.findAll(undefined, undefined);

      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual({
        data: mockCharacters,
        total: 2,
        page: 1,
        limit: 10,
      });
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

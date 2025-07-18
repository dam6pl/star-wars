import { CreateCharacterDto } from '../../src/characters/dto/create-character.dto';
import { UpdateCharacterDto } from '../../src/characters/dto/update-character.dto';
import {
  Character,
  Episode,
} from '../../src/characters/entities/character.entity';

export const mockCharacter: Character = {
  id: 1,
  name: 'Luke Skywalker',
  episodes: [Episode.NEWHOPE, Episode.EMPIRE, Episode.JEDI],
  planet: 'Tatooine',
  createdAt: new Date('2024-03-18T10:00:00Z'),
  updatedAt: new Date('2024-03-18T10:00:00Z'),
};

export const mockCharacters: Character[] = [
  mockCharacter,
  {
    id: 2,
    name: 'Darth Vader',
    episodes: [Episode.NEWHOPE, Episode.EMPIRE, Episode.JEDI],
    planet: undefined,
    createdAt: new Date('2024-03-18T10:00:00Z'),
    updatedAt: new Date('2024-03-18T10:00:00Z'),
  },
];

export const mockCreateCharacterDto: CreateCharacterDto = {
  name: 'Luke Skywalker',
  episodes: [Episode.NEWHOPE, Episode.EMPIRE, Episode.JEDI],
  planet: 'Tatooine',
};

export const mockUpdateCharacterDto: UpdateCharacterDto = {
  name: 'Luke Skywalker Updated',
  episodes: [Episode.NEWHOPE, Episode.EMPIRE],
};

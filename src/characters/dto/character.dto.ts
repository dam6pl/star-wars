import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Episode } from '../entities/character.entity';

export class CharacterDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  episodes: Episode[];

  @Expose()
  @ApiProperty()
  planet?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

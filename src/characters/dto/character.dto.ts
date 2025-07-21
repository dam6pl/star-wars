import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Episode } from '../entities/character.entity';

export class CharacterDto {
  @Expose()
  @ApiProperty({ description: 'The ID of the character' })
  id: number;

  @Expose()
  @ApiProperty({ description: 'The name of the character' })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'List of episodes the character appears in',
    enum: Episode,
    isArray: true,
  })
  episodes: Episode[];

  @Expose()
  @ApiPropertyOptional({ description: 'The home planet of the character' })
  planet?: string;

  @Expose()
  @ApiProperty({ description: 'The date the character was created' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'The date the character was last updated' })
  updatedAt: Date;
}

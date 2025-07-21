import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Episode } from '../entities/character.entity';

export class CreateCharacterDto {
  @ApiProperty({ description: 'The name of the character' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'List of episodes the character appears in',
    enum: Episode,
    isArray: true,
  })
  @IsArray()
  @IsEnum(Episode, { each: true })
  episodes: Episode[];

  @ApiPropertyOptional({ description: 'The home planet of the character' })
  @IsOptional()
  @IsString()
  planet?: string;
}

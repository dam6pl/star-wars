import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CharacterDto } from 'src/characters/dto/character.dto';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all characters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of characters.',
    type: [CharacterDto],
  })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<{
    data: CharacterDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [characters, total] = await this.charactersService.findAll(
      page,
      limit,
    );

    return {
      data: characters,
      total,
      page: page || 1,
      limit: limit || 10,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new character' })
  @ApiResponse({
    status: 201,
    description: 'The character has been successfully created.',
    type: CharacterDto,
  })
  create(
    @Body() createCharacterDto: CreateCharacterDto,
  ): Promise<CharacterDto> {
    return this.charactersService.create(createCharacterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a character by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found character.',
    type: CharacterDto,
  })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CharacterDto> {
    return this.charactersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a character' })
  @ApiResponse({
    status: 200,
    description: 'The character has been successfully updated.',
    type: CharacterDto,
  })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ): Promise<CharacterDto> {
    return this.charactersService.update(id, updateCharacterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a character' })
  @ApiResponse({
    status: 202,
    description: 'The character has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  @HttpCode(202)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.charactersService.remove(id);
  }
}

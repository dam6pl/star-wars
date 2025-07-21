import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageDto } from '../common/dto/page.dto';
import { CharactersService } from './characters.service';
import { CharacterDto } from './dto/character.dto';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all characters' })
  @ApiResponse({
    status: 200,
    description: 'List of characters.',
    type: PageDto<CharacterDto>,
  })
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CharacterDto>> {
    return await this.charactersService.findAll(pageOptionsDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new character' })
  @ApiResponse({
    status: 201,
    description: 'The character has been successfully created.',
    type: CharacterDto,
  })
  async create(
    @Body() createCharacterDto: CreateCharacterDto,
  ): Promise<CharacterDto> {
    return await this.charactersService.create(createCharacterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a character by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found character.',
    type: CharacterDto,
  })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CharacterDto> {
    return await this.charactersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a character' })
  @ApiResponse({
    status: 200,
    description: 'The character has been successfully updated.',
    type: CharacterDto,
  })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ): Promise<CharacterDto> {
    return await this.charactersService.update(id, updateCharacterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a character' })
  @ApiResponse({
    status: 202,
    description: 'The character has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  @HttpCode(202)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.charactersService.remove(id);
  }
}

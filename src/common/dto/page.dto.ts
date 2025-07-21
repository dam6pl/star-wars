import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PageDto<T> {
  @Expose()
  @ApiProperty({ isArray: true, description: 'List of items' })
  readonly data: T[];

  @Expose()
  @ApiProperty({ type: Number, description: 'Current page number' })
  page: number;

  @Expose()
  @ApiProperty({ type: Number, description: 'Number of items per page' })
  take: number;

  @Expose()
  @ApiProperty({ type: Number, description: 'Total number of items' })
  total: number;

  constructor(data: T[], page: number, take: number, total: number) {
    this.data = data;
    this.page = page;
    this.take = take;
    this.total = total;
  }
}

import { ApiProperty } from '@nestjs/swagger';

export interface Pagination {
  skip?: number;
  limit?: number;
}

export class PaginationDto {
  @ApiProperty({
    name: 'skip',
    description: 'The number of items to skip',
    minimum: 0,
    maximum: 100,
    default: 0,
    required: false,
  })
  skip?: number;

  @ApiProperty({
    name: 'limit',
    description: 'The number of items to limit to',
    minimum: 0,
    maximum: 100,
    default: 0,
    required: false,
  })
  limit?: number;
}

import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiQueryParams() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number for pagination',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Limit of items per page',
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      description: 'Field to sort by',
      example: '-name',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Search query',
      example: 'name:vinyl',
    }),
  );
}

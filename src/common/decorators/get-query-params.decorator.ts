import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { QueryParams, SortParamOrder } from '../../types';

const DEFAULT_PAGE = '1';
const DEFAULT_PAGE_LIMIT = '9';

export const GetQueryParams = createParamDecorator(
  (_, context: ExecutionContext): QueryParams => {
    const req = context.switchToHttp().getRequest();

    const paginationParams: QueryParams = {
      page: parseInt(req.query.page?.toString() ?? DEFAULT_PAGE),
      limit: parseInt(req.query.limit?.toString() ?? DEFAULT_PAGE_LIMIT),
      sort: [],
      search: [],
    };

    // create array of sort
    if (req.query.sort) {
      const sortArray = req.query.sort.toString().split(',');
      paginationParams.sort = sortArray.map((sortItem) => {
        const sortBy = sortItem.charAt(0);
        switch (sortBy) {
          case '-':
            return {
              field: sortItem.slice(1),
              by: SortParamOrder.ASC,
            };
          default:
            return {
              field: sortItem.trim(),
              by: SortParamOrder.DESC,
            };
        }
      });
    }

    // create array of search
    if (req.query.search) {
      const searchArray = req.query.search.toString().split(',');
      paginationParams.search = searchArray.map((searchItem) => {
        const field = searchItem.split(':')[0];
        const value = searchItem.split(':')[1];
        return {
          field,
          value,
        };
      });
    }

    return paginationParams;
  },
);

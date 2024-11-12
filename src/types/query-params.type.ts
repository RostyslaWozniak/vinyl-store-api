export enum SortParamOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export type QueryParams = {
  page?: number;
  limit?: number;
  sort?: { field: string; by: SortParamOrder }[];
  search?: { field: string; value: string }[];
};

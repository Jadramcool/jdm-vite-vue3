export interface BasicModel {
  [key: string]: any;
}

export interface Pagination {
  page?: number;
  pageSize?: number;
  totalRecords?: number;
  totalPages?: number;
}

export interface List<T> extends BasicModel {
  data: T[];
  pagination?: Pagination;
}

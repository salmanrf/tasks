export interface PaginationRequest {
  page: number | string;

  limit: number | string;

  sort_field: string;

  sort_order: "ASC" | "DESC";
}

export class PaginatedResponse<T> {
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
  sort_field: string;
  sort_order: string;
  items: T[];
}

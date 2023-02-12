import { z } from "zod";
import { PaginationRequest } from "./pagination.dto";

export const FindTasksSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sort_field: z.string(),
    sort_order: z.string(),
  }),
});

export interface FindTasksDto extends PaginationRequest {
  title: string;
  description: string;
  finished: boolean;
}

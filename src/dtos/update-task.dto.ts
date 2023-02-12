import { z } from "zod";

export const UpdateTaskSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "movie must be specified.",
      })
      .max(255)
      .optional(),
    description: z
      .string({
        required_error: "description must be specified.",
      })
      .optional(),
    finished: z.boolean().optional(),
  }),
});

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  finished?: boolean;
}

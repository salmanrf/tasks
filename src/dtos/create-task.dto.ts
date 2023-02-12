import { z } from "zod";

export const CreateTaskSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "title must be specified.",
      })
      .max(255),
    description: z.string({
      required_error: "description must be specified.",
    }),
    finished: z.boolean().optional(),
  }),
});

export interface CreateTaskDto {
  title: string;
  description: string;
  finished: boolean;
}

import { z } from "zod";

export const createAnalysisSchema = z.object({
  observation: z.string().trim().max(1000).optional(),
});

export type CreateAnalysisRequest = z.infer<typeof createAnalysisSchema>;

export type CreateAnalysisResponse = {
  analysisId: string;
  status: "queued";
  observation: string;
};
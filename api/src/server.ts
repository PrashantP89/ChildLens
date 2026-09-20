import express from "express";
import {
  createAnalysisSchema,
  type CreateAnalysisResponse,
} from "./analysis.schemas.js";

const app = express();
const port = 3001;

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "childlens-api",
  });
});

app.get("/", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "childlens-api",
  });
});

app.post("/api/analyses", (request, response) => {
  const result = createAnalysisSchema.safeParse(request.body);

  if (!result.success) {
    return response.status(400).json({
      status: "error",
      errors: result.error.issues,
    });
  }

  const responseBody: CreateAnalysisResponse = {
    analysisId: crypto.randomUUID(),
    status: "queued",
    observation: result.data.observation ?? "",
  };

  return response.status(202).json(responseBody);
});

app.listen(port, () => {
  console.log(`ChildLens API listening on http://localhost:${port}`);
});
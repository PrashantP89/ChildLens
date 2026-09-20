import express from "express";
import {z} from "zod";

const app = express();
const port = 3001;

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "childlens-api"
  })
});

app.get("/", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "childlens-api"
  })
});
const createAnalysisSchema = z.object({
  observation: z.string().trim().max(1000).optional()
});
app.get("/api/analysis", (_request, response) => {
   
const result = createAnalysisSchema.safeParse(_request.body);

  if (!result.success) {
    return response.status(400).json({
      status: "error",
      errors: result.error.issues
    });
  }
  response.status(202).json({
    status: "ok",
    service: "childlens-api",
    observation: result.data.observation ?? ""
  })
});

app.listen(port, ()=> {
  console.log(`ChildLens API listening on http://localhost:${port}`);
});
import { useState } from "react";
import validatePhoto from "./validatePhoto";

type AnalysisStatus = "idle" | "analyzing" | "completed" | "failed";

function QuickCheckPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [observation, setObservation] = useState<string>("");
  const [status, setStatus] = useState<AnalysisStatus>("idle");

  function handleAnalysis() {
    if (!selectedFile || status === "analyzing") {
      return;
    }
    setStatus("analyzing");
    // Simulate analysis process
   setTimeout(() => {
  setStatus("completed");
}, 2000);
  }
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    resetObservationStatus();
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setSelectedFile(null);
      setFileError(null);
      return;
    }

    const error = validatePhoto(file);
    setFileError(error);
    setSelectedFile(error ? null : file);
  }
  function handleObservationChange(
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    setObservation(event.target.value);
    resetObservationStatus();
  }
  function resetObservationStatus() {
    setStatus("idle");
  }
  return (
    <div>
      <h1>Quick Check</h1>
      <p className="page-subtitle">
        Capture -{">"} analyze -{">"} act
      </p>
      <div className="capture-layout">
        <section className="photo-upload" aria-labelledby="upload-heading">
          <h2 id="upload-heading">Take or upload a photo</h2>
          <p>Tummy time · sitting · reaching</p>
          <input
            type="file"
            accept="image/*"
            aria-label="Choose an activity photo"
            onChange={handleFileChange}
            disabled={status === "analyzing"}
          />
          {selectedFile && <p>Selected: {selectedFile.name}</p>}
          {fileError && (
            <p className="error" role="alert">
              {fileError}
            </p>
          )}
        </section>
        <section className="observation-context">
          <h2>Optional context</h2>
          <label htmlFor="observation">Short note</label>
          <textarea
            id="observation"
            rows={5}
            placeholder="What did you notice?"
            value={observation}
            onChange={handleObservationChange}
            disabled={status === "analyzing"}
          />
        </section>
      </div>
      <button
        type="button"
        className="analyze-button"
        disabled={!selectedFile || status === "analyzing"}
        onClick={handleAnalysis}
      >
        Analyze observation →
      </button>
      <p role="status">
        {status === "analyzing" && "Analyzing observation..."}
        {status === "completed" && "Sample analysis completed."}
        {status === "failed" && "Analysis failed."}
      </p>
    </div>
  );
}
export default QuickCheckPage;

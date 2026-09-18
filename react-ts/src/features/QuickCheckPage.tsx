import { useState } from "react";

function QuickCheckPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [observation, setObservation] = useState<string>("");
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
            onChange={(e) => {
              // if (e.target.files && e.target.files.length > 0) {
              setSelectedFile(e.target.files?.[0] ?? null);
              // }
            }}
          />
          {selectedFile && <p>Selected: {selectedFile.name}</p>}
        </section>
        <section className="observation-context">
          <h2>Optional context</h2>
          <label htmlFor="observation">Short note</label>
          <textarea
            id="observation"
            rows={5}
            placeholder="What did you notice?"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
          />
        </section>
      </div>
    </div>
  );
}
export default QuickCheckPage;

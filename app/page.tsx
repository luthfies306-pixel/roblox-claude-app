"use client";

import { FormEvent, useState } from "react";

const targets = [
  "StarterPlayerScripts",
  "StarterGui",
  "RojoFolder",
  "CustomExport",
];

export default function HomePage() {
  const [prompt, setPrompt] = useState(
    "Buat script untuk player sprint. Tekan Shift untuk sprint, stamina turun, lalu pulih saat berhenti. Gunakan StarterPlayerScripts."
  );
  const [target, setTarget] = useState("StarterPlayerScripts");
  const [filename, setFilename] = useState("SprintController.lua");
  const [status, setStatus] = useState("Ready");
  const [result, setResult] = useState("");
  const [savedPath, setSavedPath] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("Generating...");
    setResult("");
    setSavedPath("");
    setDownloadUrl("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, target, filename }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || "Unknown error");
      }

      setStatus("Generated successfully");
      setResult(payload.code || "");
      setSavedPath(payload.savedPath || "");
      setDownloadUrl(payload.downloadUrl || "");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStatus(`Error: ${message}`);
    }
  }

  return (
    <main className="page-shell">
      <div className="panel">
        <h1>Roblox Claude App</h1>
        <p className="subtitle">
          Prompt → Claude → generate code → save to target folder → export package
        </p>

        <form onSubmit={onSubmit} className="form-grid">
          <label>
            Target folder
            <select value={target} onChange={(e) => setTarget(e.target.value)}>
              {targets.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            File name
            <input value={filename} onChange={(e) => setFilename(e.target.value)} />
          </label>

          <label className="full-width">
            Prompt
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={7} />
          </label>

          <button type="submit" className="primary-button">
            Generate & Save
          </button>
        </form>

        <div className="status-box">
          <strong>Status:</strong> {status}
          {savedPath ? <div>Saved path: {savedPath}</div> : null}
          {downloadUrl ? (
            <a href={downloadUrl} target="_blank" rel="noreferrer">
              Download package
            </a>
          ) : null}
        </div>

        {result ? (
          <div className="result-box">
            <h3>Generated output</h3>
            <pre>{result}</pre>
          </div>
        ) : null}
      </div>
    </main>
  );
}

import React from "react";
import { RedactionProvider } from "./context/RedactionContext";
import FileUploader from "./components/FileUploader";
import RedactionConfigPanel from "./components/RedactionConfigPanel";
import RedactionPreview from "./components/RedactionPreview";
import DownloadButton from "./components/DownloadButton";

export default function App() {
  return (
    <RedactionProvider>
      <div style={{ maxWidth: 1200, margin: "auto", padding: 20 }}>
        <h1>PDF Redaction POC (Mock Frontend)</h1>
        <FileUploader />
        <RedactionConfigPanel />
        <RedactionPreview />
        <DownloadButton />
      </div>
    </RedactionProvider>
  );
}

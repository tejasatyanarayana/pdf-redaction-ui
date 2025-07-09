import React from "react";
import PDFViewer from "./PDFViewer";
import { useRedaction } from "../context/RedactionContext";

export default function RedactionPreview() {
  const { files, manualRedactions, redactionConfig, addManualRedaction } =
    useRedaction();

  if (files.length === 0) return <p>No files uploaded</p>;

  return (
    <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
      {files.map(({ url, file }) => (
        <div key={url} style={{ flex: 1 }}>
          <h4>{file.name}</h4>
          <div style={{ display: "flex", gap: 10 }}>
            <div>
              <h5>Original</h5>
              <PDFViewer fileUrl={url} manualRedactions={{}} />
            </div>
            <div>
              <h5>Redacted (mock)</h5>
              <PDFViewer
                fileUrl={url}
                manualRedactions={manualRedactions[url] || {}}
                onAddRedaction={addManualRedaction}
              />
              <p style={{ fontStyle: "italic", marginTop: 5 }}>
                Redactions shown as red translucent boxes
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

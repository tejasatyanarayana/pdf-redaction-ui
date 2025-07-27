import React from "react";
import { useRedaction } from "../context/RedactionContext";

export default function DownloadButton() {
  const { files } = useRedaction();

  const downloadFile = async (file) => {
    const filename = file.name;

    try {
      const backendBaseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendBaseUrl}/${filename}`);
      if (!response.ok) {
        throw new Error("File not found or server error");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `redacted_${filename}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download the redacted file.");
    }
  };

  if (files.length === 0) return null;

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Download Files</h3>
      {files.map(({ file }) => (
        <button
          key={file.name}
          onClick={() => downloadFile(file)}
          style={{ marginRight: 10, marginBottom: 10 }}
        >
          Download {file.name}
        </button>
      ))}
    </div>
  );
}

import React from "react";
import { useRedaction } from "../context/RedactionContext";

export default function DownloadButton() {
  const { files } = useRedaction();

  const downloadFile = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
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

import React, { useState } from "react";
import PDFViewer from "./PDFViewer";
import { useRedaction } from "../context/RedactionContext";

export default function RedactionPreview() {
  const { files, manualRedactions, addManualRedaction } = useRedaction();
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  if (files.length === 0) return null;

  const currentFile = files[currentFileIndex];

  const handleFileChange = (step) => {
    const newIndex = currentFileIndex + step;
    if (newIndex >= 0 && newIndex < files.length) {
      setCurrentFileIndex(newIndex);
      setCurrentPage(1); // reset to first page on file change
    }
  };

  const handlePageChange = (step) => {
    setCurrentPage((prev) => Math.max(1, Math.min(prev + step, totalPages)));
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Redaction Preview</h3>

      {/* 🗂️ File Navigation */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 10,
          alignItems: "center",
        }}
      >
        <button
          onClick={() => handleFileChange(-1)}
          disabled={currentFileIndex === 0}
        >
          ⬅ Prev File
        </button>
        <span>
          Viewing file: <strong>{currentFile?.file?.name}</strong> (
          {currentFileIndex + 1} of {files.length})
        </span>
        <button
          onClick={() => handleFileChange(1)}
          disabled={currentFileIndex === files.length - 1}
        >
          Next File ➡
        </button>
      </div>

      {/* 📄 Page Navigation */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <button
          onClick={() => handlePageChange(-1)}
          disabled={currentPage === 1}
        >
          ⬅ Prev Page
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === totalPages}
        >
          Next Page ➡
        </button>
      </div>

      {/* 👁️ Side-by-side PDF Viewers */}
      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ flex: 1 }}>
          <h5>Original</h5>
          <PDFViewer
            fileUrl={currentFile.url}
            manualRedactions={{}} // no overlays
            currentPage={currentPage}
            setTotalPages={setTotalPages}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h5>Redacted</h5>
          <PDFViewer
            fileUrl={currentFile.redactedUrl || currentFile.url}
            manualRedactions={manualRedactions[currentFile.url] || {}}
            onAddRedaction={addManualRedaction}
            currentPage={currentPage}
            setTotalPages={setTotalPages}
          />
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import PDFViewer from "./PDFViewer";
import { useRedaction } from "../context/RedactionContext";

export default function RedactionPreview() {
  const { redactionConfig, files, manualRedactions, addManualRedaction } = useRedaction();

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [redactionComplete, setRedactionComplete] = useState(false);
  const [redactedFilename, setRedactedFilename] = useState(null);
  const [redactedFiles, setRedactedFiles] = useState([]);
  const [redactingAll, setRedactingAll] = useState(false);
  const [redactedBlobUrl, setRedactedBlobUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (redactedBlobUrl) {
        URL.revokeObjectURL(redactedBlobUrl);
      }
    };
  }, [redactedBlobUrl]);

  if (!files || files.length === 0) return null;
  const currentFile = files[currentFileIndex];
  if (!currentFile) return null;

  const handleRedact = async () => {
    const filename = currentFile?.file?.name;
    const boxesByPage = manualRedactions[currentFile.url] || {};
    const manual_boxes = [];
   
    for (const [pageStr, rects] of Object.entries(boxesByPage)) {
      const page = parseInt(pageStr, 10) - 1;
      rects.forEach((r) => {
        manual_boxes.push({
          page,
          x0: r.left,
          y0: r.top,
          x1: r.left + r.width,
          y1: r.top + r.height,
        });
      });
    }

    const payload = {
      filename,
      keywords: redactionConfig.keywords || "",
      page_range: redactionConfig.page_range || "",
      remove_graphics: !!redactionConfig.remove_graphics,
      manual_boxes,
    };

    try {
      const backendBaseUrl = process.env.REACT_APP_BACKEND_URL  || "http://localhost:8000";
      console.log("Backend URL3:", process.env.REACT_APP_BACKEND_URL);
      const res = await fetch(`${backendBaseUrl}/redact/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Redaction failed");
      const result = await res.json();
      const redactedName = result.redacted_file?.split("redacted_")[1] || filename;

      setRedactedFilename(redactedName);
      setRedactionComplete(true);
      console.log("Backend URL2:", process.env.REACT_APP_BACKEND_URL);
      const blobRes = await fetch(`${backendBaseUrl}/download/${redactedName}`);
      if (!blobRes.ok) throw new Error("Blob fetch failed");

      const blob = await blobRes.blob();
      const blobUrl = URL.createObjectURL(blob);
      setRedactedBlobUrl(blobUrl);
    } catch (err) {
      console.error("Error during redaction:", err);
      alert("Redaction failed.");
    }
  };

  const handleDownload = async () => {
    try {
      const backendBaseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
      console.log("Backend URL2:", process.env.REACT_APP_BACKEND_URL);
      const res = await fetch(`${backendBaseUrl}/download/${redactedFilename}`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `redacted_${redactedFilename}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download redacted file.");
    }
  };

  const handleFileChange = (step) => {
    const newIndex = currentFileIndex + step;
    if (newIndex >= 0 && newIndex < files.length) {
      setCurrentFileIndex(newIndex);
      setCurrentPage(1);
      setRedactionComplete(false);
      setRedactedFilename(null);
      setRedactedBlobUrl(null);
      setRedactedFilename(null);
      setRedactedBlobUrl(null);
      setRedactionComplete(false);
    }
  };

  const handlePageChange = (step) => {
    setCurrentPage((prev) => Math.max(1, Math.min(prev + step, totalPages)));
  };

  // const handleRedactAll = async () => {
  //   setRedactingAll(true);
  //   const redactedList = [];

  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     const filename = file.file.name;
  //     const boxesByPage = manualRedactions[file.url] || {};
  //     const manual_boxes = [];

  //     for (const [pageStr, rects] of Object.entries(boxesByPage)) {
  //       const page = parseInt(pageStr, 10) - 1;
  //       rects.forEach((r) => {
  //         manual_boxes.push({
  //           page,
  //           x0: r.left,
  //           y0: r.top,
  //           x1: r.left + r.width,
  //           y1: r.top + r.height,
  //         });
  //       });
  //     }

  //     const payload = {
  //       filename,
  //       keywords: redactionConfig.keywords || "",
  //       page_range: redactionConfig.page_range || "",
  //       remove_graphics: !!redactionConfig.remove_graphics,
  //       manual_boxes,
  //     };

  //     try {
  //       const res = await fetch("http://localhost:8000/redact/manual", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       });

  //       if (!res.ok) throw new Error("Failed to redact " + filename);

  //       const result = await res.json();
  //       redactedList.push(result.redacted_file?.split("redacted_")[1] || filename);
  //     } catch (err) {
  //       console.error("Redaction failed for:", filename, err);
  //     }
  //   }

  //   setRedactedFiles(redactedList);
  //   setRedactingAll(false);
  // };

  // const handleDownloadAll = async () => {
  //   for (let filename of redactedFiles) {
  //     try {
  //       const res = await fetch(`http://localhost:8000/download/${filename}`);
  //       if (!res.ok) throw new Error("Download failed for " + filename);

  //       const blob = await res.blob();
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = `redacted_${filename}`;
  //       document.body.appendChild(a);
  //       a.click();
  //       a.remove();
  //       window.URL.revokeObjectURL(url);
  //     } catch (err) {
  //       console.error("Failed to download:", filename, err);
  //     }
  //   }
  // };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Redaction Preview</h3>

      {/* File Navigation */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
        <button onClick={() => handleFileChange(-1)} disabled={currentFileIndex === 0}>
          ⬅ Prev File
        </button>
        <span>
          Viewing file: <strong>{currentFile?.file?.name}</strong> ({currentFileIndex + 1} of {files.length})
        </span>
        <button onClick={() => handleFileChange(1)} disabled={currentFileIndex === files.length - 1}>
          Next File ➡
        </button>
      </div>

      {/* Page Navigation */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <button onClick={() => handlePageChange(-1)} disabled={currentPage === 1}>
          ⬅ Prev Page
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(1)} disabled={currentPage === totalPages}>
          Next Page ➡
        </button>
      </div>

      {/* Side-by-side PDFs */}
      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ flex: 1 }}>
          <h5>Original</h5>
        <PDFViewer
  fileUrl={currentFile.url}
  manualRedactions={manualRedactions[currentFile.url] || {}} // ← Render existing boxes
  onAddRedaction={addManualRedaction}                      // ← Enable drawing
  currentPage={currentPage}
  setTotalPages={setTotalPages}
/>
        </div>

        <div style={{ flex: 1 }}>
          <h5>Redacted</h5>
          {redactionComplete && redactedBlobUrl ? (
            <PDFViewer
              fileUrl={redactedBlobUrl}
              manualRedactions={{}}
              currentPage={currentPage}
              setTotalPages={() => {}}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: (800 / 1.414),
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
                border: "1px dashed #ccc",
              }}
            >
              <span>Redacted output will appear here</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={handleRedact}>🚨 Redact</button>
        {redactionComplete && redactedFilename && (
          <button onClick={handleDownload} style={{ marginLeft: 20 }}>
            ⬇️ Download Redacted File
          </button>
        )}
      </div>

      {/* <div style={{ marginTop: 30 }}>
        <button onClick={handleRedactAll} disabled={redactingAll}>
          🔴 Redact All Files
        </button>

        {redactedFiles.length > 0 && (
          <button onClick={handleDownloadAll} style={{ marginLeft: 20 }}>
            ⬇️ Download All Redacted Files
          </button>
        )}
      </div> */}
    </div>
  );
}

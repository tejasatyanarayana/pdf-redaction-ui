import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [selectedText, setSelectedText] = useState("");

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleTextSelect = () => {
    const text = window.getSelection().toString().trim();
    if (text) {
      setSelectedText(text);
      console.log("Selected text:", text);
    }
  };

  return (
    <div onMouseUp={handleTextSelect}>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (_, i) => (
          <Page key={`page_${i + 1}`} pageNumber={i + 1} width={600} />
        ))}
      </Document>

      {selectedText && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
          }}
        >
          <strong>Selected Text:</strong>
          <p>{selectedText}</p>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;

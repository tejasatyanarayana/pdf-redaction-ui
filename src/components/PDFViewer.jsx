import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Manual selection and overlays support
export default function PDFViewer({
  fileUrl,
  manualRedactions = {},
  onAddRedaction,
  width = 600,
}) {
  const [numPages, setNumPages] = useState(null);
  const [pageSizes, setPageSizes] = useState({});
  const [selecting, setSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);
  const containerRef = useRef();

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Save page sizes after render for scaling mouse coords
  const onPageRenderSuccess = (page, index) => {
    const viewport = page.getViewport({ scale: 1 });
    setPageSizes((sizes) => ({
      ...sizes,
      [index + 1]: { width: viewport.width, height: viewport.height },
    }));
  };

  // Mouse event handlers to draw rectangle selection
  const onMouseDown = (e, pageNum) => {
    if (e.button !== 0) return; // left click only
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelecting(true);
    setStartPoint({ x, y, pageNum });
    setCurrentRect(null);
  };

  const onMouseMove = (e, pageNum) => {
    if (!selecting || !startPoint || startPoint.pageNum !== pageNum) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const left = Math.min(x, startPoint.x);
    const top = Math.min(y, startPoint.y);
    const width = Math.abs(x - startPoint.x);
    const height = Math.abs(y - startPoint.y);
    setCurrentRect({ left, top, width, height, pageNum });
  };

  const onMouseUp = () => {
    if (selecting && currentRect) {
      onAddRedaction &&
        onAddRedaction(fileUrl, currentRect.pageNum, currentRect);
    }
    setSelecting(false);
    setStartPoint(null);
    setCurrentRect(null);
  };

  // Render redaction overlays
  const renderOverlays = (pageNum) => {
    const overlays = (manualRedactions[pageNum] || []).map((r, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          border: "2px solid red",
          backgroundColor: "rgba(255,0,0,0.3)",
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
          pointerEvents: "none",
        }}
      />
    ));
    // Also render current selecting rect if on this page
    if (currentRect && currentRect.pageNum === pageNum) {
      overlays.push(
        <div
          key="current"
          style={{
            position: "absolute",
            border: "2px dashed blue",
            backgroundColor: "rgba(0,0,255,0.2)",
            left: currentRect.left,
            top: currentRect.top,
            width: currentRect.width,
            height: currentRect.height,
            pointerEvents: "none",
          }}
        />
      );
    }
    return overlays;
  };

  return (
    <div ref={containerRef}>
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (_, i) => {
          const pageNum = i + 1;
          return (
            <div
              key={`page_${pageNum}`}
              style={{ position: "relative", marginBottom: 20 }}
              onMouseDown={(e) => onMouseDown(e, pageNum)}
              onMouseMove={(e) => onMouseMove(e, pageNum)}
              onMouseUp={onMouseUp}
            >
              <Page
                pageNumber={pageNum}
                width={width}
                onRenderSuccess={(page) => onPageRenderSuccess(page, i)}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: width,
                  height: pageSizes[pageNum]?.height || 0,
                }}
              >
                {renderOverlays(pageNum)}
              </div>
            </div>
          );
        })}
      </Document>
    </div>
  );
}

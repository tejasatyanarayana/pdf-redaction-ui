import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({
  fileUrl,
  manualRedactions = {},
  onAddRedaction,
  currentPage = 1,
  setTotalPages,
  width = 600,
}) {
  const [pageSize, setPageSize] = useState({});
  const [selecting, setSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setTotalPages?.(numPages);
  };

  const onPageRenderSuccess = (page) => {
    const vp = page.getViewport({ scale: 1 });
    setPageSize({ width: vp.width, height: vp.height });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelecting(true);
    setStartPoint({ x, y });
    setCurrentRect(null);
  };

  const handleMouseMove = (e) => {
    if (!selecting || !startPoint) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const left = Math.min(x, startPoint.x);
    const top = Math.min(y, startPoint.y);
    const width = Math.abs(x - startPoint.x);
    const height = Math.abs(y - startPoint.y);
    setCurrentRect({ left, top, width, height });
  };

  const handleMouseUp = () => {
    if (selecting && currentRect) {
      onAddRedaction?.(fileUrl, currentPage, currentRect);
    }
    setSelecting(false);
    setStartPoint(null);
    setCurrentRect(null);
  };

  const renderOverlays = () => {
    const rects = manualRedactions[currentPage] || [];
    return (
      <>
        {rects.map((r, i) => (
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
        ))}
        {currentRect && (
          <div
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
        )}
      </>
    );
  };

  return (
    <div>
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <div
          style={{ position: "relative", cursor: "crosshair" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Page
            pageNumber={currentPage}
            width={width}
            onRenderSuccess={onPageRenderSuccess}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: width,
              height: pageSize.height || 0,
            }}
          >
            {renderOverlays()}
          </div>
        </div>
      </Document>
    </div>
  );
}

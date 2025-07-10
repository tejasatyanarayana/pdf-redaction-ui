import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({
  fileUrl,
  manualRedactions = {},
  onAddRedaction = null,
  currentPage = 1,
  setTotalPages = () => {},
  width = 600,
}) {
  const [pageSize, setPageSize] = useState({});
  const [selecting, setSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setTotalPages(numPages);
  };

  const onPageRenderSuccess = (page) => {
    const vp = page.getViewport({ scale: 1 });
    setPageSize({ width: vp.width, height: vp.height });
  };

  const handleMouseDown = (e) => {
    if (!onAddRedaction || e.button !== 0) return;
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
    if (!onAddRedaction || !selecting || !currentRect || !pageSize.width || !pageSize.height) {
      setSelecting(false);
      return;
    }
const renderedWidth = width;
    const renderedHeight = (pageSize.height / pageSize.width) * width;

    const scaleX = pageSize.width / renderedWidth;
const scaleY = pageSize.height / renderedHeight;

    const screenYTop = currentRect.top;
    const screenYBottom = currentRect.top + currentRect.height;

    const pdfX0 = currentRect.left * scaleX;
    const pdfX1 = (currentRect.left + currentRect.width) * scaleX;

    const pdfY0 = pageSize.height - (screenYBottom * scaleY);
    const pdfY1 = pageSize.height - (screenYTop * scaleY);

    const adjustedRect = {
      x0: pdfX0,
      y0: pdfY0,
      x1: pdfX1,
      y1: pdfY1,
      left: currentRect.left,
      top: currentRect.top,
      width: currentRect.width,
      height: currentRect.height,
    };

    onAddRedaction(fileUrl, currentPage, adjustedRect);
    console.log("Screen box:", currentRect);
    console.log("PDF box:", adjustedRect);

    setSelecting(false);
    setStartPoint(null);
    setCurrentRect(null);
  };

  const renderOverlays = () => {
    const rects = manualRedactions?.[currentPage] || [];

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

  const overlayHeight =
    pageSize.width && pageSize.height
      ? (pageSize.height / pageSize.width) * width
      : 0;

  return (
    <div>
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <div
          style={{ position: "relative", cursor: onAddRedaction ? "crosshair" : "default" }}
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
              width,
              height: overlayHeight,
            }}
          >
            {renderOverlays()}
          </div>
        </div>
      </Document>
    </div>
  );
}

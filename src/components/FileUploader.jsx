import { useRedaction } from "../context/RedactionContext";
import { PDFDocument, PageSizes } from "pdf-lib";
import React, { useState } from "react";

export default function FileUploader() {
  const { setFiles } = useRedaction();
  const [isUploading, setIsUploading] = useState(false);


const convertPdfToA4 = async (file) => {
  const originalBytes = await file.arrayBuffer();
  const originalPdf = await PDFDocument.load(originalBytes, { ignoreEncryption: true });
  const a4Pdf = await PDFDocument.create();

  const a4Width = PageSizes.A4[0]; // 595.28
  const a4Height = PageSizes.A4[1]; // 841.89

  const totalPages = originalPdf.getPageCount();

  for (let i = 0; i < totalPages; i++) {
    const originalPage = originalPdf.getPage(i);
    const { width, height } = originalPage.getSize();

    // Embed the page from the original PDF
    const embeddedPage = await a4Pdf.embedPage(originalPage);

    const scale = Math.min(a4Width / width, a4Height / height);

    const x = (a4Width - width * scale) / 2;
    const y = (a4Height - height * scale) / 2;

    const a4Page = a4Pdf.addPage([a4Width, a4Height]);

    // Draw the embedded page
    a4Page.drawPage(embeddedPage, {
      x,
      y,
      xScale: scale,
      yScale: scale,
    });
  }

  const resizedPdfBytes = await a4Pdf.save();
  return new Blob([resizedPdfBytes], { type: "application/pdf" });
};
 const uploadFileToBackend = async (file) => {
  try {
   
    const resizedPdfBlob = await convertPdfToA4(file);
    const formData = new FormData();
    const fileResized = new File([resizedPdfBlob], file.name, { type: "application/pdf" });
    formData.append("file", fileResized, file.filename);
    const backendBaseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
    console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);
  
    const res = await fetch(`${backendBaseUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();
    console.log("Uploaded:", data);
        return {
      ...data,
      resizedFile: fileResized,
    };
  } catch (err) {
    console.error("Upload error:", err);
    return null;
  }
};
const onChange = async (e) => {
  setIsUploading(true);
  const selectedFiles = Array.from(e.target.files);
  const uploadedFileEntries = [];

  for (const file of selectedFiles) {
    const uploadResult = await uploadFileToBackend(file);
    if (uploadResult) {
      uploadedFileEntries.push({
        file: uploadResult.resizedFile,
        url: URL.createObjectURL(uploadResult.resizedFile),
        backendPath: `uploads/${uploadResult.filename}`,
      });
    }
  }

  setFiles(uploadedFileEntries);
  setIsUploading(false);
};

 return (
  <div>
    <h3>Upload PDF files</h3>
    <input
      type="file"
      multiple
      accept="application/pdf"
      onChange={onChange}
      disabled={isUploading}
    />
    
    {isUploading && (
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
        <div className="spinner" />
        <span>Uploading and resizing...</span>
      </div>
    )}
  </div>
);
}

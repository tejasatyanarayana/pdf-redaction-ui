import React from "react";
import { useRedaction } from "../context/RedactionContext";

export default function FileUploader() {
  const { setFiles } = useRedaction();

  const uploadFileToBackend = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      console.log("Uploaded:", data);
      return data;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const onChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const uploadedFileEntries = [];

    for (const file of selectedFiles) {
      const uploadResult = await uploadFileToBackend(file);
      if (uploadResult) {
        uploadedFileEntries.push({
          file,
          url: URL.createObjectURL(file), // For local preview
          backendPath: `uploads/${uploadResult.filename}`, // Optional: for future API reference
        });
      }
    }

    setFiles(uploadedFileEntries);
  };

  return (
    <div>
      <h3>Upload PDF files</h3>
      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={onChange}
      />
    </div>
  );
}

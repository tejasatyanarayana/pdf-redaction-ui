import React from "react";
import { useRedaction } from "../context/RedactionContext";

export default function FileUploader() {
  const { setFiles } = useRedaction();

  const onChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setFiles(selectedFiles);
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

import React from "react";
import { RedactionProvider } from "./context/RedactionContext";
import FileUploader from "./components/FileUploader";
import RedactionConfigPanel from "./components/RedactionConfigPanel";
import RedactionPreview from "./components/RedactionPreview";

export default function App() {
  return (
    <RedactionProvider>
      <div
        style={{
          maxWidth: 1400,
          margin: "auto",
          padding: 30,
          fontFamily: "Segoe UI, sans-serif",
          backgroundColor: "#f4f6f8",
          borderRadius: 10,
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 30,
            color: "#2c3e50",
            fontSize: 32,
          }}
        >
          PDF Redaction POC
        </h1>

        <div
          style={{
            background: "#ffffff",
            padding: 24,
            borderRadius: 10,
            boxShadow: "0 0 10px rgba(0,0,0,0.08)",
            marginBottom: 24,
          }}
        >
          <FileUploader />
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: 24,
            borderRadius: 10,
            boxShadow: "0 0 10px rgba(0,0,0,0.08)",
            marginBottom: 24,
          }}
        >
          <RedactionConfigPanel />
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: 24,
            borderRadius: 10,
            boxShadow: "0 0 10px rgba(0,0,0,0.08)",
            overflowX: "auto",
          }}
        >
          <RedactionPreview />
        </div>
      </div>
    </RedactionProvider>
  );
}

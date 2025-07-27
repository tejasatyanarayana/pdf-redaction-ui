import React from "react";
import { RedactionProvider } from "./context/RedactionContext";
import FileUploader from "./components/FileUploader";
import RedactionConfigPanel from "./components/RedactionConfigPanel";
import RedactionPreview from "./components/RedactionPreview";
import styles from "./App.module.css";

export default function App() {
  return (
    <RedactionProvider>
      <div className={styles.container}>
        <h1 className={styles.heading}>
            PDF Redaction POC
            <span className={styles.subheading}>by Teja Satyanarayana</span>
        </h1>
        
        <div className={styles.section}>
          <FileUploader />
        </div>

        <div className={styles.section}>
          <RedactionConfigPanel />
        </div>

        <div className={`${styles.section} ${styles.preview}`}>
          <RedactionPreview />
        </div>
      </div>
    </RedactionProvider>
  );
}
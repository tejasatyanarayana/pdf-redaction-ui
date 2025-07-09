import React, { createContext, useContext, useState } from "react";

const RedactionContext = createContext();

export const useRedaction = () => useContext(RedactionContext);

export const RedactionProvider = ({ children }) => {
  const [files, setFiles] = useState([]); // [{ file, url }]
  const [redactionConfig, setRedactionConfig] = useState({
    placeholderText: "[REDACTED]",
  });
  const [manualRedactions, setManualRedactions] = useState({});
  // { fileUrl: { pageNum: [{ x, y, width, height }] } }

  const addManualRedaction = (fileUrl, pageNum, rect) => {
    setManualRedactions((prev) => {
      const fileReds = prev[fileUrl] || {};
      const pageReds = fileReds[pageNum] || [];
      return {
        ...prev,
        [fileUrl]: {
          ...fileReds,
          [pageNum]: [...pageReds, rect],
        },
      };
    });
  };

  return (
    <RedactionContext.Provider
      value={{
        files,
        setFiles,
        redactionConfig,
        setRedactionConfig,
        manualRedactions,
        addManualRedaction,
      }}
    >
      {children}
    </RedactionContext.Provider>
  );
};

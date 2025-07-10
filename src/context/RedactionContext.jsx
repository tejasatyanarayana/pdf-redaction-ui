import React, { createContext, useContext, useState } from "react";

const RedactionContext = createContext();

export const useRedaction = () => useContext(RedactionContext);

export const RedactionProvider = ({ children }) => {
  const [files, setFiles] = useState([]); // [{ file, url }]
  const [redactionConfig, setRedactionConfig] = useState({
    keywords: "",
    page_range: "",
    remove_graphics: false,
  });

  const [manualRedactions, setManualRedactions] = useState({});
  // { fileUrl: { pageNum: [{ x0, y0, x1, y1, left, top, width, height }] } }

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

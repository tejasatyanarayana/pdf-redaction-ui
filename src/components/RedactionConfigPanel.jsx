import React from "react";
import { useRedaction } from "../context/RedactionContext";

export default function RedactionConfigPanel() {
  const { redactionConfig, setRedactionConfig } = useRedaction();

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setRedactionConfig({ ...redactionConfig, [field]: value });
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Redaction Settings</h3>

      <label>
        Redaction Keywords (comma-separated):{" "}
        <input
          type="text"
          value={redactionConfig.keywords || ""}
          onChange={handleChange("keywords")}
        />
      </label>
      <br />

      <label>
        Page Range (e.g., 1-3,5):{" "}
        <input
          type="text"
          value={redactionConfig.page_range || ""}
          onChange={handleChange("page_range")}
        />
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={!!redactionConfig.remove_graphics}
          onChange={handleChange("remove_graphics")}
        />
        {" "}Remove Images / Logos
      </label>
    </div>
  );
}

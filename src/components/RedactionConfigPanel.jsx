import React from "react";
import { useRedaction } from "../context/RedactionContext";

export default function RedactionConfigPanel() {
  const { redactionConfig, setRedactionConfig } = useRedaction();

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Redaction Settings</h3>
      <label>
        Placeholder text:{" "}
        <input
          value={redactionConfig.placeholderText}
          onChange={(e) =>
            setRedactionConfig({ placeholderText: e.target.value })
          }
        />
      </label>
    </div>
  );
}

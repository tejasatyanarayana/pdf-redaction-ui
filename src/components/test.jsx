const handleRedact = async () => {
  const currentFile = files[currentFileIndex];
  const filename = currentFile?.file?.name;

  const boxes = (manualRedactions[currentFile.url] || {});
  const manual_boxes = [];

  for (const [pageStr, rects] of Object.entries(boxes)) {
    const page = parseInt(pageStr, 10) - 1;
    rects.forEach((r) => {
      manual_boxes.push({
        page,
        x0: r.left,
        y0: r.top,
        x1: r.left + r.width,
        y1: r.top + r.height,
      });
    });
  }

  const payload = {
    filename,
    keywords: "",
    page_range: "",
    remove_graphics: true,
    manual_boxes,
  };

  try {
    const res = await fetch("http://localhost:8000/redact/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Redaction request failed");

    const result = await res.json();
    console.log("Redaction result:", result);
    // Optional: update current file redacted URL if needed
  } catch (err) {
    console.error("Error during redaction:", err);
  }
};

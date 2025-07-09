// Mock API simulates redaction by returning original file URL immediately
export async function mockRedactPdf(file) {
  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 500));
  return URL.createObjectURL(file);
}

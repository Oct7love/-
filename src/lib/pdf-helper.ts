export async function extractPdfText(buffer: Buffer): Promise<string> {
  // pdf-parse has issues in serverless environments - it tries to load test files.
  // Use the underlying pdf.js directly to avoid this.
  const pdfParse = (await import("pdf-parse")).default;

  const data = await pdfParse(buffer, {
    max: 0, // no page limit
  });
  return data.text;
}

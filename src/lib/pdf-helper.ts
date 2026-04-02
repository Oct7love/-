export async function extractPdfText(buffer: Buffer): Promise<string> {
  // pdf-parse has issues in Vercel serverless: it tries to load test fixtures.
  // Import the underlying pdf.js module directly to bypass this.
  const mod = await import("pdf-parse/lib/pdf-parse.js");
  const pdfParse = mod.default || mod;

  const data = await pdfParse(buffer);
  return data.text;
}

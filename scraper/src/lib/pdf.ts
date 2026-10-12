import { PDFDocument } from "pdf-lib";

/** Split a PDF into small chunks (large inline PDFs were rejected by Gemini in testing). */
export async function splitPdf(bytes: Uint8Array, pagesPerChunk = 1, maxPages = 8): Promise<Uint8Array[]> {
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = Math.min(src.getPageCount(), maxPages);
  const chunks: Uint8Array[] = [];
  for (let start = 0; start < total; start += pagesPerChunk) {
    const out = await PDFDocument.create();
    const idx = Array.from({ length: Math.min(pagesPerChunk, total - start) }, (_, i) => start + i);
    const pages = await out.copyPages(src, idx);
    pages.forEach((p) => out.addPage(p));
    chunks.push(await out.save());
  }
  return chunks;
}

export function isPdf(bytes: Uint8Array): boolean {
  return bytes.length > 4 && Buffer.from(bytes.subarray(0, 5)).toString() === "%PDF-";
}

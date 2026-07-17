import fs from "fs/promises";
import path from "path";

// Stored under the app directory so the PM2 user (uthabitivp) can write at runtime.
const STORAGE_ROOT =
  process.env.DOCUMENT_STORAGE_PATH ||
  path.join(process.cwd(), "var", "registration-documents");

export async function saveDocumentFile({ type, documentNumber, buffer }) {
  const folder = type === "INVOICE" ? "invoices" : "receipts";
  const safeName = documentNumber.replace(/[/\\?%*:|"<>]/g, "-");
  const fileName = `${safeName}.pdf`;
  const dirPath = path.join(STORAGE_ROOT, folder);
  const filePath = path.join(dirPath, fileName);

  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(filePath, buffer);

  return {
    fileName,
    filePath,
    absolutePath: filePath,
  };
}

export async function readDocumentFile(storedPath) {
  const absolutePath = path.isAbsolute(storedPath)
    ? storedPath
    : path.join(process.cwd(), storedPath);
  return fs.readFile(absolutePath);
}

import fs from "fs/promises";
import path from "path";

const STORAGE_ROOT = path.join(process.cwd(), "storage", "registration-documents");

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
    filePath: path.join("storage", "registration-documents", folder, fileName),
    absolutePath: filePath,
  };
}

export async function readDocumentFile(relativePath) {
  const absolutePath = path.join(process.cwd(), relativePath);
  return fs.readFile(absolutePath);
}

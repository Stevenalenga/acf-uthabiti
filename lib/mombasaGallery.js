import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import JSZip from "jszip";
import { parse as parseExif } from "exifr";
import { prisma } from "@/lib/prisma";

export const GALLERY_ACCESS_CODE = "9076";
export const MOMBASA_GALLERY_DIR = path.join(process.cwd(), "var", "mombasa-gallery");

const EXIF_DATE_FIELDS = ["DateTimeOriginal", "CreateDate", "DateTimeDigitized"];

const ALLOWED_IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
]);

const MIME_BY_EXTENSION = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".bmp": "image/bmp",
};

function safeFileName(name = "upload") {
  return String(name)
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "upload";
}

function normalizeExtension(name = "") {
  const ext = path.extname(String(name)).toLowerCase();
  return ext || ".jpg";
}

function isAllowedImage(name = "") {
  return ALLOWED_IMAGE_EXTENSIONS.has(normalizeExtension(name).toLowerCase());
}

async function ensureStorageDirectory() {
  await fs.mkdir(MOMBASA_GALLERY_DIR, { recursive: true });
}

async function getCaptureDate(storedName) {
  const targetPath = path.join(MOMBASA_GALLERY_DIR, storedName);

  try {
    const exif = await parseExif(targetPath, EXIF_DATE_FIELDS);
    const maybeDate =
      exif?.DateTimeOriginal || exif?.CreateDate || exif?.DateTimeDigitized || null;

    if (maybeDate instanceof Date && !Number.isNaN(maybeDate.getTime())) {
      return maybeDate;
    }
  } catch {
    return null;
  }

  return null;
}

export async function getGalleryItems() {
  const items = await prisma.mombasa_gallery_photo_tbl.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      photo_id: true,
      title: true,
      original_name: true,
      stored_name: true,
      mime_type: true,
      file_size: true,
      file_kind: true,
      uploaded_by: true,
      folder_name: true,
      createdAt: true,
    },
  });

  const withCaptureDates = await Promise.all(
    items.map(async (item) => {
      const captureDate = await getCaptureDate(item.stored_name);

      return {
        ...item,
        photo_id: Number(item.photo_id),
        createdAt: item.createdAt.toISOString(),
        captureAt: captureDate ? captureDate.toISOString() : null,
      };
    }),
  );

  withCaptureDates.sort((a, b) => {
    const aTimestamp = Date.parse(a.captureAt || a.createdAt);
    const bTimestamp = Date.parse(b.captureAt || b.createdAt);

    if (aTimestamp !== bTimestamp) {
      return aTimestamp - bTimestamp;
    }

    return a.photo_id - b.photo_id;
  });

  return withCaptureDates;
}

async function saveRecord({
  originalName,
  storedName,
  mimeType,
  fileSize,
  fileKind,
  uploadedBy,
}) {
  const result = await prisma.mombasa_gallery_photo_tbl.create({
    data: {
      original_name: safeFileName(originalName),
      stored_name: storedName,
      mime_type: mimeType,
      file_size: Number(fileSize || 0),
      file_kind: fileKind,
      uploaded_by: uploadedBy || "guest",
      folder_name: "ACF Mombasa 2026",
      title: safeFileName(originalName).replace(/\.[^.]+$/, "") || "ACF Mombasa 2026 photo",
    },
  });

  return {
    photo_id: Number(result.photo_id),
    title: result.title,
    original_name: result.original_name,
    stored_name: result.stored_name,
    mime_type: result.mime_type,
    file_size: result.file_size,
    file_kind: result.file_kind,
    uploaded_by: result.uploaded_by,
    folder_name: result.folder_name,
    createdAt: result.createdAt.toISOString(),
  };
}

async function saveUploadedBuffer({ originalName, buffer, uploadedBy = "guest" }) {
  await ensureStorageDirectory();
  const ext = normalizeExtension(originalName);
  const mimeType = MIME_BY_EXTENSION[ext] || "application/octet-stream";
  const storedName = `${randomUUID()}${ext}`;
  const targetPath = path.join(MOMBASA_GALLERY_DIR, storedName);
  await fs.writeFile(targetPath, buffer);

  return saveRecord({
    originalName,
    storedName,
    mimeType,
    fileSize: buffer.length,
    fileKind: ext === ".zip" ? "archive" : "image",
    uploadedBy,
  });
}

export async function saveGalleryFiles(files = [], uploadedBy = "guest") {
  const savedItems = [];

  for (const file of files) {
    if (!file || typeof file.arrayBuffer !== "function") continue;
    const fileName = String(file.name || "upload");
    const buffer = Buffer.from(await file.arrayBuffer());
    const fullName = safeFileName(fileName);
    const lowerName = fullName.toLowerCase();

    if (lowerName.endsWith(".zip")) {
      const zip = await JSZip.loadAsync(buffer);
      const zipEntries = Object.values(zip.files).filter((entry) => !entry.dir);
      const images = zipEntries.filter((entry) => isAllowedImage(entry.name));

      if (!images.length) {
        throw new Error(`No valid JPG/JPEG/PNG/GIF/WebP/BMP images were found inside ${fullName}.`);
      }

      for (const entry of images) {
        const extracted = await entry.async("uint8array");
        const entryName = safeFileName(entry.name);
        const saved = await saveUploadedBuffer({
          originalName: entryName,
          buffer: Buffer.from(extracted),
          uploadedBy,
        });
        savedItems.push(saved);
      }

      continue;
    }

    if (!isAllowedImage(fileName)) {
      throw new Error(`Unsupported file type: ${fullName}. Use JPG, JPEG, PNG, GIF, WEBP, BMP, or ZIP.`);
    }

    const saved = await saveUploadedBuffer({
      originalName: fullName,
      buffer,
      uploadedBy,
    });
    savedItems.push(saved);
  }

  return savedItems;
}

export async function getGalleryPhotoById(photoId) {
  const id = Number(photoId);
  if (!Number.isFinite(id)) return null;

  return prisma.mombasa_gallery_photo_tbl.findUnique({
    where: { photo_id: BigInt(id) },
  });
}

export async function readGalleryPhotoBuffer(photoId) {
  const record = await getGalleryPhotoById(photoId);
  if (!record) return null;

  const filePath = path.join(MOMBASA_GALLERY_DIR, record.stored_name);
  try {
    const buffer = await fs.readFile(filePath);
    return { buffer, record };
  } catch {
    return null;
  }
}

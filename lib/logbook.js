import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

const PHOTO_DIR =
  process.env.LOGBOOK_PHOTO_PATH ||
  path.join(process.cwd(), "var", "logbook-photos");

const PHOTO_TYPES = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

export function getLogbookToken() {
  return String(process.env.LOGBOOK_TOKEN || "").trim();
}

export function isValidLogbookToken(token) {
  const expected = getLogbookToken();
  const incoming = String(token || "").trim();
  if (!expected || !incoming || expected.length !== incoming.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ incoming.charCodeAt(i);
  }
  return mismatch === 0;
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function displayPhone(phone) {
  const value = clean(phone);
  if (!value || /^n\/a/i.test(value)) return "";
  return value;
}

export function normalizeEmail(email) {
  return clean(email).toLowerCase();
}

const REGISTRATION_SELECT = {
  participant_id: true,
  full_name: true,
  email: true,
  phone: true,
  organization: true,
  country: true,
  profession: true,
  other_profession: true,
  emergency_contact: true,
  createdAt: true,
};

function professionLabel(person) {
  if (!person) return "";
  if (person.profession === "Other") return person.other_profession || "Other";
  return person.profession || "";
}

function isSpeakerRole(role) {
  return /\bspeaker\b/i.test(String(role || ""));
}

function roleFromProfession(person) {
  const label = professionLabel(person);
  if (!label || /^unknown$/i.test(label) || /^other$/i.test(label)) return "";
  return label;
}

function parseSpeakerFlag(value, role) {
  if (value === true || value === 1 || value === "1" || value === "true") return true;
  if (value === false || value === 0 || value === "0" || value === "false") return false;
  return isSpeakerRole(role);
}

function toLogbookRow(entry, person) {
  return {
    key: `lb-${entry.logbook_id}`,
    logbookId: String(entry.logbook_id),
    participantId: person
      ? String(person.participant_id)
      : entry.participant_id
        ? String(entry.participant_id)
        : null,
    fullName: entry.full_name,
    email: entry.email,
    phone: displayPhone(entry.phone) || displayPhone(person?.phone),
    organization: entry.organization || person?.organization || "",
    country: entry.country || person?.country || "",
    role: clean(entry.role),
    isSpeaker: Boolean(entry.is_speaker) || isSpeakerRole(entry.role),
    profession: professionLabel(person),
    emergencyContact:
      clean(entry.emergency_contact) || clean(person?.emergency_contact),
    bio: entry.bio || "",
    photoFile: entry.photo_file || "",
    status: entry.status || "PUBLISHED",
    source: person ? "registration" : "logbook",
    registeredAt: person?.createdAt || entry.createdAt,
  };
}

export function toPublicLogbookRow(entry) {
  return {
    key: `lb-${entry.logbookId || entry.logbook_id}`,
    fullName: entry.fullName || entry.full_name,
    role: clean(entry.role),
    organization: clean(entry.organization),
    bio: entry.bio || "",
    isSpeaker: Boolean(entry.isSpeaker || entry.is_speaker),
    photoFile: entry.photoFile || entry.photo_file || "",
  };
}

export async function buildLogbookRows() {
  const [logbookEntries, registrations] = await Promise.all([
    prisma.participant_logbook_tbl.findMany({
      orderBy: { full_name: "asc" },
    }),
    prisma.participant_registration_tbl.findMany({
      select: REGISTRATION_SELECT,
    }),
  ]);

  const regById = new Map(
    registrations.map((person) => [String(person.participant_id), person])
  );
  const regByEmail = new Map(
    registrations.map((person) => [normalizeEmail(person.email), person])
  );

  const rows = logbookEntries.map((entry) => {
    const person =
      (entry.participant_id && regById.get(String(entry.participant_id))) ||
      regByEmail.get(normalizeEmail(entry.email));
    return toLogbookRow(entry, person);
  });

  rows.sort(compareLogbookRows);
  return rows;
}

export async function buildPublishedLogbookRows() {
  const rows = await buildLogbookRows();
  return rows
    .filter((row) => row.status === "PUBLISHED")
    .map(toPublicLogbookRow)
    .sort(comparePublicLogbookRows);
}

function hasProfileText(value) {
  return Boolean(String(value || "").replace(/\s+/g, " ").trim());
}

export function comparePublicLogbookRows(a, b) {
  const aScore =
    Number(hasProfileText(a.bio)) + Number(hasProfileText(a.role));
  const bScore =
    Number(hasProfileText(b.bio)) + Number(hasProfileText(b.role));
  if (bScore !== aScore) return bScore - aScore;
  const speakerDiff = Number(Boolean(b.isSpeaker)) - Number(Boolean(a.isSpeaker));
  if (speakerDiff) return speakerDiff;
  return a.fullName.localeCompare(b.fullName, undefined, { sensitivity: "base" });
}

export function compareLogbookRows(a, b) {
  const rankDiff = Number(Boolean(b.isSpeaker)) - Number(Boolean(a.isSpeaker));
  if (rankDiff) return rankDiff;
  return a.fullName.localeCompare(b.fullName, undefined, { sensitivity: "base" });
}

export { isSpeakerRole };

export async function searchRegistrationsForLogbook(query) {
  const q = clean(query);
  if (q.length < 2) return [];

  const registrations = await prisma.participant_registration_tbl.findMany({
    where: {
      OR: [
        { full_name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
        { organization: { contains: q } },
      ],
    },
    take: 25,
    orderBy: { full_name: "asc" },
    select: REGISTRATION_SELECT,
  });

  if (!registrations.length) return [];

  const inBook = await prisma.participant_logbook_tbl.findMany({
    where: {
      OR: [
        { email: { in: registrations.map((row) => row.email) } },
        {
          participant_id: {
            in: registrations.map((row) => row.participant_id),
          },
        },
      ],
    },
    select: { email: true, participant_id: true },
  });

  const inBookEmails = new Set(inBook.map((row) => normalizeEmail(row.email)));
  const inBookIds = new Set(
    inBook
      .filter((row) => row.participant_id != null)
      .map((row) => String(row.participant_id))
  );

  return registrations.map((person) => ({
    participantId: String(person.participant_id),
    fullName: person.full_name,
    email: person.email,
    phone: displayPhone(person.phone),
    organization: person.organization || "",
    country: person.country || "",
    emergencyContact: clean(person.emergency_contact),
    role: roleFromProfession(person),
    isSpeaker: false,
    profession: professionLabel(person),
    inLogbook:
      inBookEmails.has(normalizeEmail(person.email)) ||
      inBookIds.has(String(person.participant_id)),
  }));
}

export async function addFromRegistration({
  email,
  participantId,
  role,
  isSpeaker,
} = {}) {
  let person = null;

  if (participantId) {
    person = await prisma.participant_registration_tbl.findUnique({
      where: { participant_id: BigInt(participantId) },
      select: REGISTRATION_SELECT,
    });
  }

  if (!person) {
    const emailKey = normalizeEmail(email);
    if (!emailKey) {
      throw new Error("Search by email or pick a registered participant.");
    }
    const registrations = await prisma.participant_registration_tbl.findMany({
      select: REGISTRATION_SELECT,
    });
    person = registrations.find(
      (row) => normalizeEmail(row.email) === emailKey
    );
  }

  if (!person) {
    throw new Error("No registration found for that email.");
  }

  const existing = await prisma.participant_logbook_tbl.findFirst({
    where: {
      OR: [
        { email: normalizeEmail(person.email) },
        { participant_id: person.participant_id },
      ],
    },
  });

  if (existing) {
    if (existing.status !== "PUBLISHED") {
      const entry = await prisma.participant_logbook_tbl.update({
        where: { logbook_id: existing.logbook_id },
        data: {
          participant_id: person.participant_id,
          full_name: person.full_name,
          email: normalizeEmail(person.email),
          phone: displayPhone(person.phone) || existing.phone,
          organization: person.organization || existing.organization,
          country: person.country || existing.country,
          role: clean(role) || existing.role || roleFromProfession(person) || null,
          is_speaker: parseSpeakerFlag(isSpeaker, role) || existing.is_speaker,
          emergency_contact:
            clean(person.emergency_contact) || existing.emergency_contact,
          status: "PUBLISHED",
        },
      });
      return { entry, alreadyAdded: false, confirmed: true };
    }
    return { entry: existing, alreadyAdded: true };
  }

  const entry = await prisma.participant_logbook_tbl.create({
    data: {
      participant_id: person.participant_id,
      full_name: person.full_name,
      email: normalizeEmail(person.email),
      phone: displayPhone(person.phone) || null,
      organization: person.organization || null,
      country: person.country || null,
      role: clean(role) || roleFromProfession(person) || null,
      is_speaker: parseSpeakerFlag(isSpeaker, role),
      emergency_contact: clean(person.emergency_contact) || null,
      status: "PUBLISHED",
    },
  });

  return { entry, alreadyAdded: false };
}

export async function upsertLogbookEntry(payload) {
  const email = normalizeEmail(payload.email);
  if (!email || !email.includes("@")) {
    throw new Error("A valid email is required.");
  }

  const fullName = clean(payload.fullName || payload.full_name);
  if (!fullName) {
    throw new Error("Full name is required.");
  }

  const data = {
    full_name: fullName,
    email,
    phone: clean(payload.phone) || null,
    organization: clean(payload.organization) || null,
    country: clean(payload.country) || null,
    role: clean(payload.role) || null,
    is_speaker: parseSpeakerFlag(payload.isSpeaker, payload.role),
    bio: clean(payload.bio) || null,
    emergency_contact:
      clean(payload.emergencyContact || payload.emergency_contact) || null,
  };

  if (payload.photoFile) {
    data.photo_file = payload.photoFile;
  }

  if (
    payload.status === "PENDING" ||
    payload.status === "PUBLISHED" ||
    payload.status === "REJECTED"
  ) {
    data.status = payload.status;
  }

  const registrations = await prisma.participant_registration_tbl.findMany({
    select: { participant_id: true, email: true },
  });
  const existingRegistration = registrations.find(
    (row) => normalizeEmail(row.email) === email
  );
  if (existingRegistration) {
    data.participant_id = existingRegistration.participant_id;
  }

  let existingEntry = null;
  if (payload.logbookId) {
    existingEntry = await prisma.participant_logbook_tbl.findUnique({
      where: { logbook_id: BigInt(payload.logbookId) },
    });
  }
  if (!existingEntry) {
    existingEntry = await prisma.participant_logbook_tbl.findFirst({
      where: { email },
    });
  }

  if (existingEntry && normalizeEmail(existingEntry.email) !== email) {
    const clash = await prisma.participant_logbook_tbl.findFirst({
      where: { email },
    });
    if (clash && clash.logbook_id !== existingEntry.logbook_id) {
      throw new Error("That email is already in the logbook.");
    }
  }

  if (existingEntry) {
    return prisma.participant_logbook_tbl.update({
      where: { logbook_id: existingEntry.logbook_id },
      data,
    });
  }

  data.status = data.status || "PUBLISHED";
  return prisma.participant_logbook_tbl.create({ data });
}

export async function requestLogbookListing(payload) {
  const email = normalizeEmail(payload.email);
  if (!email || !email.includes("@")) {
    throw new Error("A valid email is required.");
  }

  const fullName = clean(payload.fullName || payload.full_name);
  if (!fullName) {
    throw new Error("Full name is required.");
  }

  const existing = await prisma.participant_logbook_tbl.findFirst({
    where: { email },
  });

  if (existing?.status === "PUBLISHED") {
    throw new Error("You are already listed in the participants logbook.");
  }
  if (existing?.status === "PENDING") {
    throw new Error(
      "Your request is already with the ACF team for confirmation."
    );
  }

  const registrations = await prisma.participant_registration_tbl.findMany({
    select: { participant_id: true, email: true },
  });
  const existingRegistration = registrations.find(
    (row) => normalizeEmail(row.email) === email
  );

  const data = {
    full_name: fullName,
    email,
    phone: clean(payload.phone) || null,
    organization: clean(payload.organization) || null,
    country: clean(payload.country) || null,
    role: clean(payload.role) || null,
    is_speaker: false,
    bio: clean(payload.bio) || null,
    emergency_contact:
      clean(payload.emergencyContact || payload.emergency_contact) || null,
    status: "PENDING",
    participant_id: existingRegistration?.participant_id || null,
  };
  if (payload.photoFile) data.photo_file = payload.photoFile;

  if (existing) {
    return prisma.participant_logbook_tbl.update({
      where: { logbook_id: existing.logbook_id },
      data,
    });
  }

  return prisma.participant_logbook_tbl.create({ data });
}

export async function setLogbookListingStatus({ logbookId, status }) {
  if (!logbookId) throw new Error("Logbook entry is required.");
  if (status !== "PUBLISHED" && status !== "REJECTED" && status !== "PENDING") {
    throw new Error("Invalid listing status.");
  }

  const existing = await prisma.participant_logbook_tbl.findUnique({
    where: { logbook_id: BigInt(logbookId) },
  });
  if (!existing) throw new Error("Logbook entry not found.");

  return prisma.participant_logbook_tbl.update({
    where: { logbook_id: existing.logbook_id },
    data: { status },
  });
}

export async function isPublishedLogbookPhoto(fileName) {
  const safe = path.basename(String(fileName || ""));
  if (!safe) return false;
  const entry = await prisma.participant_logbook_tbl.findFirst({
    where: { photo_file: safe, status: "PUBLISHED" },
    select: { logbook_id: true },
  });
  return Boolean(entry);
}

export async function saveLogbookPhoto(file) {
  if (!file || typeof file.arrayBuffer !== "function") {
    return null;
  }
  if (!file.size) return null;
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error("Profile photo must be 4MB or smaller.");
  }

  const ext = PHOTO_TYPES[String(file.type || "").toLowerCase()];
  if (!ext) {
    throw new Error("Use a JPG, PNG, WEBP, or GIF photo.");
  }

  const fileName = `${randomUUID()}.${ext}`;
  await fs.mkdir(PHOTO_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(PHOTO_DIR, fileName), buffer);
  return fileName;
}

export async function readLogbookPhoto(fileName) {
  const safe = path.basename(String(fileName || ""));
  if (!safe || safe !== fileName) return null;
  if (!/^[a-f0-9-]+\.(jpg|png|webp|gif)$/i.test(safe)) return null;
  const filePath = path.join(PHOTO_DIR, safe);
  try {
    return await fs.readFile(filePath);
  } catch {
    return null;
  }
}

export function photoContentType(fileName) {
  const ext = path.extname(String(fileName || "")).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

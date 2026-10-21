"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Briefcase,
  Mic2,
  Camera,
  UserPlus,
  Building2,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  organization: "",
  country: "",
  role: "",
  bio: "",
  photo: null,
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500";

const SPONSORS = [
  {
    name: "Africa Childcare Forum",
    href: "https://acf.uthabitiafrica.org/",
    src: "/images/partners/acf.png",
    cardClass: "bg-white",
  },
  {
    name: "Collaborative Action for Childcare",
    href: "https://cac.uthabitiafrica.org/",
    src: "/images/cac-logos.webp",
    cardClass: "bg-white",
  },
  {
    name: "UNICEF",
    href: "https://www.unicef.org/",
    src: "/images/partners/unicef.png",
    cardClass: "bg-[#00AEEF]",
  },
  {
    name: "County Government of Mombasa",
    href: "https://web.mombasa.go.ke/",
    src: "/images/partners/mombasa-county.png",
    cardClass: "bg-white",
  },
];

const PHOTO_UPLOAD_MAX_BYTES = 900 * 1024;

function initials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function hasProfileText(value) {
  return Boolean(String(value || "").replace(/\s+/g, " ").trim());
}

function comparePublicRows(a, b) {
  const aScore = Number(hasProfileText(a.bio)) + Number(hasProfileText(a.role));
  const bScore = Number(hasProfileText(b.bio)) + Number(hasProfileText(b.role));
  if (bScore !== aScore) return bScore - aScore;
  const speakerDiff = Number(Boolean(b.isSpeaker)) - Number(Boolean(a.isSpeaker));
  if (speakerDiff) return speakerDiff;
  return a.fullName.localeCompare(b.fullName, undefined, { sensitivity: "base" });
}

const BIO_PREVIEW_CHARS = 220;

function BioPreview({ text }) {
  const [open, setOpen] = useState(false);
  const value = String(text || "").trim();
  if (!value) return null;

  const long = value.length > BIO_PREVIEW_CHARS;
  const preview = long
    ? `${value.slice(0, BIO_PREVIEW_CHARS).replace(/\s+\S*$/, "")}…`
    : value;

  return (
    <div className="mt-3">
      <p className="text-sm leading-relaxed text-[#5c4a3d]">{open || !long ? value : preview}</p>
      {long ? (
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="mt-1 text-sm font-semibold text-[#E5553C] hover:text-[#d14b34]"
        >
          {open ? "Read less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
}

function Avatar({ photoFile, name }) {
  if (photoFile) {
    return (
      <img
        src={`/api/participants/logbook/photo/${photoFile}`}
        alt={name}
        className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-sm"
      />
    );
  }
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E5553C] text-lg font-semibold text-white">
      {initials(name) || "P"}
    </div>
  );
}

async function prepareLogbookPhoto(file) {
  if (!file) return null;
  if (!String(file.type || "").startsWith("image/")) return file;
  if (file.size <= PHOTO_UPLOAD_MAX_BYTES) return file;

  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not read that photo."));
      img.src = url;
    });

    const maxEdge = 1600;
    const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(image, 0, 0, width, height);

    let quality = 0.85;
    let blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    while (blob && blob.size > PHOTO_UPLOAD_MAX_BYTES && quality > 0.5) {
      quality -= 0.1;
      blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality)
      );
    }
    if (!blob) return file;
    return new File([blob], "profile.jpg", { type: "image/jpeg" });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function PublicLogbookClient() {
  const { showToast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formPreview, setFormPreview] = useState("");
  const formPhotoRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/participants/logbook");
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to load logbook");
        if (!cancelled) setRows(result.data || []);
      } catch (error) {
        if (!cancelled) {
          showToast({ type: "error", message: error.message });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter((row) =>
        !q
          ? true
          : [row.fullName, row.role, row.organization, row.bio]
              .join(" ")
              .toLowerCase()
              .includes(q)
      )
      .sort(comparePublicRows);
  }, [rows, search]);

  const stats = useMemo(
    () => ({
      people: rows.length,
      speakers: rows.filter((row) => row.isSpeaker).length,
    }),
    [rows]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormPhoto = (event) => {
    const file = event.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, photo: file }));
    setFormPreview(file ? URL.createObjectURL(file) : "");
  };

  const handleRequest = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const photo = await prepareLogbookPhoto(form.photo);
      const body = new FormData();
      body.append("fullName", form.fullName || "");
      body.append("email", form.email || "");
      body.append("phone", form.phone || "");
      body.append("organization", form.organization || "");
      body.append("country", form.country || "");
      body.append("role", form.role || "");
      body.append("bio", form.bio || "");
      if (photo) body.append("photo", photo);

      const res = await fetch("/api/participants/logbook", {
        method: "POST",
        body,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Could not submit request");
      setForm(EMPTY_FORM);
      setFormPreview("");
      setShowForm(false);
      showToast({
        type: "success",
        message:
          result.message ||
          "Request sent. You will appear here after the ACF team confirms it.",
      });
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4efe6] text-gray-900">
      <header className="border-b border-[#e4d9c8] bg-[#fffdf8]">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E5553C]">
                Participants directory
              </p>
              <h1 className="font-serif text-2xl font-semibold text-[#2c1810] sm:text-3xl">
                ACF Mombasa 2026 Logbook
              </h1>
              <p className="mt-1 text-sm text-[#6b5748]">
                PrideInn Flamingo Beach Resort &amp; Spa · 13–15 October 2026
              </p>
            </div>
            <a
              href="#request-listing"
              onClick={(event) => {
                event.preventDefault();
                setShowForm(true);
                document.getElementById("request-listing")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-[#E5553C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d14b34]"
            >
              <UserPlus size={16} />
              Request to be added
            </a>
          </div>

          <div className="mt-6 border-t border-[#eadfcf] pt-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a7463]">
              Sponsored and supported by
            </p>
            <div className="grid grid-cols-2 items-center gap-4 sm:grid-cols-4">
              {SPONSORS.map((sponsor) => (
                <a
                  key={sponsor.name}
                  href={sponsor.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={sponsor.name}
                  className={`flex h-20 items-center justify-center rounded-xl border border-[#eadfcf] px-3 py-2 transition hover:border-[#E5553C]/40 hover:shadow-sm ${sponsor.cardClass}`}
                >
                  <img
                    src={sponsor.src}
                    alt={sponsor.name}
                    className="max-h-14 w-full object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {[
            ["Participants", stats.people],
            ["Speakers", stats.speakers],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-[#eadfcf] bg-[#fffdf8] px-4 py-3 shadow-sm"
            >
              <p className="text-xs uppercase tracking-wide text-[#8a7463]">{label}</p>
              <p className="mt-1 font-serif text-3xl font-semibold text-[#2c1810]">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className={`${inputClass} pl-9`}
              placeholder="Search by name, role, organisation, or bio…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div id="request-listing">
          {showForm ? (
            <form
              onSubmit={handleRequest}
              className="mb-6 rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <UserPlus size={18} className="text-[#E5553C]" />
                Request to be added
              </div>
              <p className="mb-4 text-sm text-[#6b5748]">
                Fill in your details. The ACF team will confirm your listing
                before it appears here. Speaker tags are assigned by the team.
              </p>
              <div className="mb-4 flex items-center gap-4">
                {formPreview ? (
                  <img
                    src={formPreview}
                    alt="Preview"
                    className="h-20 w-20 rounded-full object-cover ring-2 ring-orange-100"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <Camera size={22} />
                  </div>
                )}
                <label className="text-sm font-medium">
                  Profile picture
                  <input
                    ref={formPhotoRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFormPhoto}
                    className="mt-1 block text-sm"
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Full name *
                  <input
                    required
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium">
                  Email *
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium">
                  Role / position
                  <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className={`${inputClass} mt-1`}
                    placeholder="e.g. Director, Policy Lead, Childcare provider"
                  />
                </label>
                <label className="text-sm font-medium">
                  Phone / contact
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium">
                  Organisation
                  <input
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium">
                  Country
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium sm:col-span-2">
                  Bio
                  <textarea
                    name="bio"
                    rows={3}
                    value={form.bio}
                    onChange={handleChange}
                    className={`${inputClass} mt-1`}
                    placeholder="Short profile for the public logbook"
                  />
                </label>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#E5553C] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? "Sending…" : "Submit request"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm(EMPTY_FORM);
                    setFormPreview("");
                  }}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
        </div>

        {loading && rows.length === 0 ? (
          <div className="rounded-2xl border border-[#eadfcf] bg-[#fffdf8] px-8 py-14 text-center text-[#8a7463]">
            Opening the register…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#eadfcf] bg-[#fffdf8] px-8 py-14 text-center text-[#8a7463]">
            {rows.length === 0
              ? "No confirmed listings yet. Request to be added and the ACF team will confirm your profile."
              : "No matching people."}
          </div>
        ) : (
          <ul className="space-y-4">
            {filtered.map((row) => (
              <li key={row.key}>
                <article className="w-full rounded-2xl border border-[#eadfcf] bg-[#fffdf8] p-5 shadow-[0_8px_24px_rgba(80,50,20,0.07)]">
                  <div className="flex items-start gap-4">
                    <Avatar photoFile={row.photoFile} name={row.fullName} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-serif text-lg font-semibold leading-snug text-[#2c1810]">
                          {row.fullName}
                        </h2>
                        {row.role ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#f4efe6] px-2.5 py-0.5 text-xs font-semibold text-[#6b5748] ring-1 ring-[#eadfcf]">
                            <Briefcase size={12} />
                            {row.role}
                          </span>
                        ) : null}
                        {row.isSpeaker ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E5553C] px-2.5 py-0.5 text-xs font-semibold text-white">
                            <Mic2 size={12} />
                            Speaker
                          </span>
                        ) : null}
                      </div>
                      {row.organization ? (
                        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#6b5748]">
                          <Building2 size={14} className="shrink-0" />
                          <span>{row.organization}</span>
                        </p>
                      ) : null}
                      <BioPreview text={row.bio} />
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

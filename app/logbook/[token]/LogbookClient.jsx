"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Mail,
  Phone,
  Building2,
  Globe,
  Search,
  Plus,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Camera,
  Check,
  Briefcase,
  Mic2,
  Clock,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  organization: "",
  country: "",
  role: "",
  isSpeaker: false,
  emergencyContact: "",
  bio: "",
  photo: null,
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500";

const PHOTO_UPLOAD_MAX_BYTES = 900 * 1024;

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

function SpeakerTag({ assigned, onToggle, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onToggle?.(!assigned);
      }}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
        assigned
          ? "bg-[#E5553C] text-white"
          : "bg-white text-[#8a7463] ring-1 ring-[#d9cbb8] hover:border-[#E5553C] hover:text-[#E5553C]"
      } disabled:opacity-60`}
    >
      <Mic2 size={12} />
      {assigned ? "Speaker" : "Mark Speaker"}
    </button>
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

function initials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Avatar({ token, photoFile, name, size = "md" }) {
  const dim = size === "lg" ? "h-20 w-20 text-xl" : "h-12 w-12 text-sm";
  if (photoFile) {
    return (
      <img
        src={`/api/logbook/${token}/photo/${photoFile}`}
        alt={name}
        className={`${dim} rounded-full object-cover ring-2 ring-white shadow-sm`}
      />
    );
  }
  return (
    <div
      className={`${dim} flex items-center justify-center rounded-full bg-[#E5553C] font-semibold text-white`}
    >
      {initials(name) || "P"}
    </div>
  );
}

export default function LogbookClient({ token }) {
  const { showToast } = useToast();
  const [rows, setRows] = useState([]);
  const [pending, setPending] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingEmail, setAddingEmail] = useState("");
  const [search, setSearch] = useState("");
  const [expandedKey, setExpandedKey] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formPreview, setFormPreview] = useState("");
  const formPhotoRef = useRef(null);

  const load = useCallback(
    async (q = search) => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (q.trim().length >= 2) query.set("q", q.trim());
        const res = await fetch(
          `/api/logbook/${token}${query.toString() ? `?${query}` : ""}`
        );
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to load logbook");
        setRows(result.data || []);
        setPending(result.pending || []);
        setMatches(result.matches || []);
      } catch (error) {
        showToast({ type: "error", message: error.message });
      } finally {
        setLoading(false);
      }
    },
    [showToast, token, search]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      load(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [load, search]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter((row) =>
        !q
          ? true
          : [
              row.fullName,
              row.email,
              row.phone,
              row.organization,
              row.country,
              row.role,
              row.bio,
              row.profession,
              row.emergencyContact,
            ]
              .join(" ")
              .toLowerCase()
              .includes(q)
      )
      .sort((a, b) => {
        const speakerDiff = Number(Boolean(b.isSpeaker)) - Number(Boolean(a.isSpeaker));
        if (speakerDiff) return speakerDiff;
        return a.fullName.localeCompare(b.fullName, undefined, { sensitivity: "base" });
      });
  }, [rows, search]);

  const stats = useMemo(
    () => ({
      speakers: rows.filter((row) => row.isSpeaker).length,
      withBio: rows.filter((row) => row.bio).length,
      withPhoto: rows.filter((row) => row.photoFile).length,
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

  const updateRow = (key, patch) => {
    setRows((prev) =>
      prev.map((item) => (item.key === key ? { ...item, ...patch } : item))
    );
  };

  const postEntry = async (fields, photoFile) => {
    const photo = await prepareLogbookPhoto(photoFile);
    const body = new FormData();
    if (fields.logbookId) body.append("logbookId", fields.logbookId);
    body.append("fullName", fields.fullName || "");
    body.append("email", fields.email || "");
    body.append("phone", fields.phone || "");
    body.append("organization", fields.organization || "");
    body.append("country", fields.country || "");
    body.append("role", fields.role || "");
    body.append("isSpeaker", fields.isSpeaker ? "1" : "0");
    body.append("bio", fields.bio || "");
    body.append("emergencyContact", fields.emergencyContact || "");
    if (photo) body.append("photo", photo);

    const res = await fetch(`/api/logbook/${token}`, {
      method: "POST",
      body,
    });
    const text = await res.text();
    let result = {};
    try {
      result = text ? JSON.parse(text) : {};
    } catch {
      result = {};
    }
    if (res.status === 413) {
      throw new Error(
        "That photo is too large to upload. Try a smaller JPG or PNG."
      );
    }
    if (!res.ok) throw new Error(result.error || "Could not save");
    setRows(result.data || []);
    if (Array.isArray(result.pending)) setPending(result.pending);
    return result;
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await postEntry(form, form.photo);
      setForm(EMPTY_FORM);
      setFormPreview("");
      setShowForm(false);
      showToast({ type: "success", message: "Participant saved to the logbook" });
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSpeakerToggle = async (row, assigned) => {
    const next = { ...row, isSpeaker: assigned };
    updateRow(row.key, { isSpeaker: assigned });
    setSaving(true);
    try {
      await postEntry(next);
      showToast({
        type: "success",
        message: assigned ? "Marked as Speaker" : "Speaker tag removed",
      });
    } catch (error) {
      updateRow(row.key, { isSpeaker: row.isSpeaker });
      showToast({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRow = async (row, photoFile) => {
    setSaving(true);
    try {
      await postEntry(row, photoFile);
      showToast({
        type: "success",
        message: photoFile ? "Profile photo saved" : "Profile updated",
      });
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleListingStatus = async (row, status) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/logbook/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "setStatus",
          logbookId: row.logbookId,
          status,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Could not update request");
      setRows(result.data || []);
      setPending(result.pending || []);
      showToast({
        type: "success",
        message:
          status === "PUBLISHED"
            ? `${row.fullName} is now listed on the public logbook`
            : `Declined listing request for ${row.fullName}`,
      });
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleAddFromRegistration = async (match) => {
    setAddingEmail(match.email);
    try {
      const res = await fetch(`/api/logbook/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addFromRegistration",
          email: match.email,
          participantId: match.participantId,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Could not add to logbook");
      setRows(result.data || []);
      if (Array.isArray(result.pending)) setPending(result.pending);
      setMatches((prev) =>
        prev.map((item) =>
          item.email.toLowerCase() === match.email.toLowerCase()
            ? { ...item, inLogbook: true }
            : item
        )
      );
      const added = (result.data || []).find(
        (row) => row.email.toLowerCase() === match.email.toLowerCase()
      );
      if (added) setExpandedKey(added.key);
      showToast({
        type: "success",
        message: result.alreadyAdded
          ? "Already in the participants logbook"
          : "Added to the participants logbook",
      });
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setAddingEmail("");
    }
  };

  return (
    <main className="min-h-screen bg-[#f4efe6] text-gray-900">
      <header className="border-b border-[#e4d9c8] bg-[#fffdf8]">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <a href="https://acf.uthabitiafrica.org/" className="shrink-0">
                <img
                  src="/images/partners/acf.png"
                  alt="Africa Childcare Forum"
                  className="h-14 w-14 rounded-full object-contain bg-white ring-1 ring-[#e4d9c8]"
                />
              </a>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E5553C]">
                  Private logbook · Assign Speaker yourselves
                </p>
                <h1 className="font-serif text-2xl font-semibold text-[#2c1810] sm:text-3xl">
                  ACF Mombasa 2026 Logbook
                </h1>
                <p className="mt-1 text-sm text-[#6b5748]">
                  PrideInn Flamingo Beach Resort &amp; Spa · 13–15 October 2026
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => load(search)}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-[#d9cbb8] bg-white px-3 py-2 text-sm hover:bg-[#faf6ef]"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
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
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[
            ["Speakers", stats.speakers],
            ["With bios", stats.withBio],
            ["With photos", stats.withPhoto],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-[#eadfcf] bg-[#fffdf8] px-4 py-3 shadow-sm"
            >
              <p className="text-xs uppercase tracking-wide text-[#8a7463]">{label}</p>
              <p className="mt-1 font-serif text-3xl font-semibold text-[#2c1810]">{value}</p>
            </div>
          ))}
        </div>

        {pending.length > 0 ? (
          <div className="mb-6 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
            <div className="border-b border-amber-100 bg-amber-50 px-4 py-3">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900">
                <Clock size={16} />
                Listing requests awaiting confirmation ({pending.length})
              </p>
              <p className="mt-1 text-xs text-amber-800/80">
                People who asked to be added on the public logbook at /participants/new.
                Confirm to publish name, role, bio, and Speaker tag there.
              </p>
            </div>
            <ul className="divide-y">
              {pending.map((row) => (
                <li
                  key={row.key}
                  className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-serif text-lg font-semibold text-[#2c1810]">
                        {row.fullName}
                      </p>
                      {row.role ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#f4efe6] px-2.5 py-0.5 text-xs font-semibold text-[#6b5748] ring-1 ring-[#eadfcf]">
                          <Briefcase size={12} />
                          {row.role}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-[#6b5748]">{row.email}</p>
                    {row.bio ? (
                      <p className="mt-2 text-sm text-[#5c4a3d]">{row.bio}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleListingStatus(row, "PUBLISHED")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#E5553C] px-3 py-2 text-sm font-semibold text-white hover:bg-[#d14b34] disabled:opacity-60"
                    >
                      <Check size={16} />
                      Confirm
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleListingStatus(row, "REJECTED")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                      <X size={16} />
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className={`${inputClass} pl-9`}
              placeholder="Search registrations by email or name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowForm((open) => !open)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E5553C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d14b34]"
          >
            <Plus size={16} />
            Add someone not registered
          </button>
        </div>

        {search.trim().length >= 2 && (
          <div className="mb-6 overflow-hidden rounded-2xl border bg-white">
            <div className="border-b bg-[#FFF8F5] px-4 py-3">
              <p className="text-sm font-semibold">Registration matches</p>
              <p className="text-xs text-gray-500">
                Add a registered participant to the logbook. Name, email, and
                contact come in automatically — you can edit them after.
              </p>
            </div>
            {loading && matches.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-500">Searching…</p>
            ) : matches.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-500">
                No registration found for that search.
              </p>
            ) : (
              <ul className="divide-y">
                {matches.map((match) => (
                  <li
                    key={match.participantId}
                    className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold">{match.fullName}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <Mail size={14} /> {match.email}
                        </span>
                        {match.phone ? (
                          <span className="inline-flex items-center gap-1">
                            <Phone size={14} /> {match.phone}
                          </span>
                        ) : (
                          <span className="text-gray-400">No contact yet</span>
                        )}
                        {match.organization ? (
                          <span className="inline-flex items-center gap-1">
                            <Building2 size={14} /> {match.organization}
                          </span>
                        ) : null}
                      </p>
                    </div>
                    {match.inLogbook ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-800">
                        <Check size={14} />
                        In logbook
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={addingEmail === match.email}
                        onClick={() => handleAddFromRegistration(match)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E5553C] px-3 py-2 text-sm font-semibold text-white hover:bg-[#d14b34] disabled:opacity-60"
                      >
                        <UserPlus size={16} />
                        {addingEmail === match.email
                          ? "Adding…"
                          : "Add to participants logbook"}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleRegister}
            className="mb-6 rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <UserPlus size={18} className="text-[#E5553C]" />
              Add someone not in registrations
            </div>
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
                <span className="mt-1 block text-xs font-normal text-gray-500">
                  Optional. JPG, PNG, WEBP or GIF. Large photos are resized automatically.
                </span>
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
                Phone / contact
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`${inputClass} mt-1`}
                  placeholder="Add a contact if available"
                />
              </label>
              <label className="text-sm font-medium">
                Emergency / other contact
                <input
                  name="emergencyContact"
                  value={form.emergencyContact}
                  onChange={handleChange}
                  className={`${inputClass} mt-1`}
                  placeholder="Add a contact if available"
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
                <span className="mt-1 block text-xs font-normal text-gray-500">
                  Job title or position. Separate from the Speaker tag.
                </span>
              </label>
              <div className="text-sm font-medium">
                Speaker tag
                <div className="mt-2">
                  <SpeakerTag
                    assigned={Boolean(form.isSpeaker)}
                    onToggle={(assigned) =>
                      setForm((prev) => ({
                        ...prev,
                        isSpeaker: assigned,
                      }))
                    }
                  />
                </div>
                <span className="mt-1 block text-xs font-normal text-gray-500">
                  Mark Speaker only when you assign that person.
                </span>
              </div>
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
                  placeholder="Short profile, role, or notes"
                />
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#E5553C] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save to logbook"}
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
        )}

        <div className="relative overflow-hidden rounded-2xl border border-[#d9cbb8] bg-[#fffdf8] shadow-[0_12px_40px_rgba(80,50,20,0.08)]">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-b from-[#E5553C] via-[#c44732] to-[#7a2a1c]" />
          <div className="pointer-events-none absolute inset-y-0 left-3 w-px bg-[#eadfcf]" />
          {loading && rows.length === 0 ? (
            <p className="px-8 py-14 text-center text-[#8a7463]">Opening the register…</p>
          ) : filtered.length === 0 ? (
            <p className="px-8 py-14 text-center text-[#8a7463]">
              {rows.length === 0
                ? "Search a registered participant by email or name, then add them. Mark Speaker yourselves."
                : "No matching people."}
            </p>
          ) : (
            <ul className="divide-y divide-[#eadfcf] pl-3">
                    {filtered.map((row) => {
                const open = expandedKey === row.key;
                return (
                  <li key={row.key} className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setExpandedKey(open ? null : row.key)}
                      className="flex w-full items-start justify-between gap-4 text-left"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <Avatar token={token} photoFile={row.photoFile} name={row.fullName} />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-serif text-lg font-semibold text-[#2c1810]">
                              {row.fullName}
                            </p>
                            {row.role ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#f4efe6] px-2.5 py-0.5 text-xs font-semibold text-[#6b5748] ring-1 ring-[#eadfcf]">
                                <Briefcase size={12} />
                                {row.role}
                              </span>
                            ) : null}
                            <SpeakerTag
                              assigned={Boolean(row.isSpeaker)}
                              disabled={saving}
                              onToggle={(assigned) => handleSpeakerToggle(row, assigned)}
                            />
                          </div>
                          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#6b5748]">
                            <span className="inline-flex items-center gap-1">
                              <Mail size={14} /> {row.email}
                            </span>
                            {row.phone ? (
                              <span className="inline-flex items-center gap-1">
                                <Phone size={14} /> {row.phone}
                              </span>
                            ) : (
                              <span className="text-[#b09a88]">No contact yet</span>
                            )}
                            {row.organization ? (
                              <span className="inline-flex items-center gap-1">
                                <Building2 size={14} /> {row.organization}
                              </span>
                            ) : null}
                            {row.country ? (
                              <span className="inline-flex items-center gap-1">
                                <Globe size={14} /> {row.country}
                              </span>
                            ) : null}
                          </p>
                          {row.bio ? (
                            <p className="mt-2 line-clamp-2 text-sm text-[#5c4a3d]">{row.bio}</p>
                          ) : null}
                        </div>
                      </div>
                      <span className="mt-1 shrink-0 text-[#b09a88]">
                        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </button>
                    {open ? (
                      <div className="mt-4 grid gap-3 rounded-xl bg-[#FFF8F5] p-4 sm:grid-cols-2">
                        <div className="flex items-center gap-4 sm:col-span-2">
                          <Avatar
                            token={token}
                            photoFile={row.photoFile}
                            name={row.fullName}
                            size="lg"
                          />
                          <label className="text-sm font-medium">
                            Profile picture
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="mt-1 block text-sm"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleSaveRow(row, file);
                                e.target.value = "";
                              }}
                            />
                            <span className="mt-1 block text-xs font-normal text-gray-500">
                              Optional. Large photos are resized automatically.
                            </span>
                          </label>
                        </div>
                        <label className="text-sm font-medium">
                          Full name
                          <input
                            className={`${inputClass} mt-1`}
                            value={row.fullName}
                            onChange={(e) => updateRow(row.key, { fullName: e.target.value })}
                          />
                        </label>
                        <label className="text-sm font-medium">
                          Email
                          <input
                            type="email"
                            className={`${inputClass} mt-1`}
                            value={row.email}
                            onChange={(e) => updateRow(row.key, { email: e.target.value })}
                          />
                        </label>
                        <label className="text-sm font-medium">
                          Role / position
                          <input
                            className={`${inputClass} mt-1`}
                            value={row.role}
                            placeholder="e.g. Director, Policy Lead"
                            onChange={(e) => updateRow(row.key, { role: e.target.value })}
                          />
                        </label>
                        <div className="text-sm font-medium">
                          Speaker tag
                          <div className="mt-2">
                            <SpeakerTag
                              assigned={Boolean(row.isSpeaker)}
                              disabled={saving}
                              onToggle={(assigned) => handleSpeakerToggle(row, assigned)}
                            />
                          </div>
                          <span className="mt-1 block text-xs font-normal text-gray-500">
                            Assign Speaker yourselves. This does not replace role / position.
                          </span>
                        </div>
                        <label className="text-sm font-medium">
                          Phone / contact
                          <input
                            className={`${inputClass} mt-1`}
                            value={row.phone}
                            placeholder="Add a contact if available"
                            onChange={(e) => updateRow(row.key, { phone: e.target.value })}
                          />
                        </label>
                        <label className="text-sm font-medium">
                          Emergency / other contact
                          <input
                            className={`${inputClass} mt-1`}
                            value={row.emergencyContact}
                            placeholder="Add a contact if available"
                            onChange={(e) =>
                              updateRow(row.key, { emergencyContact: e.target.value })
                            }
                          />
                        </label>
                        <p className="text-sm">
                          <span className="font-medium text-gray-500">Profession: </span>
                          {row.profession || "—"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-gray-500">Source: </span>
                          {row.source === "registration"
                            ? "Pulled from event registration"
                            : "Added in logbook"}
                        </p>
                        <label className="text-sm font-medium sm:col-span-2">
                          Bio
                          <textarea
                            rows={3}
                            className={`${inputClass} mt-1`}
                            value={row.bio}
                            onChange={(e) => updateRow(row.key, { bio: e.target.value })}
                          />
                        </label>
                        <div>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSaveRow(row)}
                            className="rounded-lg bg-[#E5553C] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            Save profile
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
                    })}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

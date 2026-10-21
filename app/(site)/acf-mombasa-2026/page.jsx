"use client";

import { Camera, Download, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ACCESS_CODE = "9076";

export default function MombasaGalleryPage() {
  const PAGE_SIZE = 18;

  const [accessCode, setAccessCode] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [pendingDownload, setPendingDownload] = useState(null);
  const [downloadError, setDownloadError] = useState("");
  const [downloadingKey, setDownloadingKey] = useState("");
  const agreeButtonRef = useRef(null);

  async function loadGallery() {
    try {
      const res = await fetch("/api/acf-mombasa-2026");
      const data = await res.json();
      setItems(data.items || []);
      setCurrentPage(1);
    } catch {
      setItems([]);
      setCurrentPage(1);
    }
  }

  useEffect(() => {
    if (accessGranted) {
      loadGallery();
    }
  }, [accessGranted]);

  useEffect(() => {
    if (!guidelinesOpen) return undefined;

    setAgreementChecked(false);
    setDownloadError("");

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleCloseGuidelines();
      }
    };

    const focusTimer = window.setTimeout(() => {
      agreeButtonRef.current?.focus();
    }, 0);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [guidelinesOpen]);

  const handleAccess = (event) => {
    event.preventDefault();
    if (accessCode.trim() === ACCESS_CODE) {
      setAccessGranted(true);
      setError("");
      return;
    }
    setError("Invalid access code. Please enter the correct number.");
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFiles.length) {
      setError("Select one or more JPG, JPEG, PNG, GIF, WEBP, BMP, or ZIP files.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("code", ACCESS_CODE);
      formData.append("uploadedBy", "mombasa-gallery-user");
      selectedFiles.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/acf-mombasa-2026", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not upload files.");
      }

      setSelectedFiles([]);
      event.target.reset();
      await loadGallery();
    } catch (uploadError) {
      setError(uploadError.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const queueDownload = (downloadRequest) => {
    if (downloadingKey) return;
    setPendingDownload(downloadRequest);
    setGuidelinesOpen(true);
  };

  const handleCloseGuidelines = () => {
    if (downloadingKey) return;
    setGuidelinesOpen(false);
    setPendingDownload(null);
    setAgreementChecked(false);
    setDownloadError("");
  };

  const triggerBrowserDownload = (url, fileName) => {
    const link = document.createElement("a");
    link.href = url;
    if (fileName) {
      link.download = fileName;
    }
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const executeDownload = async (downloadRequest) => {
    if (!downloadRequest) return;

    if (downloadRequest.type === "single") {
      const response = await fetch(`/api/acf-mombasa-2026/photo/${downloadRequest.photoId}`);
      if (!response.ok) {
        let message = "Could not download this photo. Please try again.";
        try {
          const data = await response.json();
          if (data?.error) message = data.error;
        } catch {
          // Ignore JSON parse failures and keep fallback message.
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      try {
        triggerBrowserDownload(objectUrl, downloadRequest.fileName);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
      return;
    }

    if (downloadRequest.type === "bulk") {
      const response = await fetch("/api/acf-mombasa-2026/download");
      if (!response.ok) {
        let message = "Could not download photos. Please try again.";
        try {
          const data = await response.json();
          if (data?.error) message = data.error;
        } catch {
          // Ignore JSON parse failures and keep fallback message.
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      try {
        triggerBrowserDownload(objectUrl, "acf-mombasa-2026-gallery.zip");
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    }
  };

  const handleAgreeAndDownload = async () => {
    if (!pendingDownload || !agreementChecked || downloadingKey) return;

    const key =
      pendingDownload.type === "single"
        ? `single-${pendingDownload.photoId}`
        : "bulk";

    setDownloadingKey(key);
    setDownloadError("");

    try {
      await executeDownload(pendingDownload);
      setGuidelinesOpen(false);
      setPendingDownload(null);
      setAgreementChecked(false);
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : "Download failed. Please try again.");
    } finally {
      setDownloadingKey("");
    }
  };

  if (!accessGranted) {
    return (
      <main className="min-h-screen bg-[#fff7f4] px-6 py-20 text-gray-900">
        <div className="mx-auto max-w-xl rounded-3xl border border-orange-200 bg-white p-10 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E5553C]">
            ACF Mombasa 2026
          </p>
          <h1 className="mt-4 text-3xl font-bold">Photo Access</h1>
          <p className="mt-3 text-gray-600">
            Enter the access code to upload and review the event photos for ACF Mombasa 2026.
          </p>

          <form onSubmit={handleAccess} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-gray-700">
              Access code
              <input
                type="password"
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-lg outline-none ring-0 focus:border-[#E5553C]"
                placeholder="Enter code"
              />
            </label>

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#E5553C] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#cc4a35]"
            >
              Unlock gallery
            </button>
          </form>
        </div>
      </main>
    );
  }

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageItems = items.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <main className="min-h-screen bg-[#fff7f4] px-4 py-10 text-gray-900 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E5553C]">
                ACF Mombasa 2026
              </p>
              <h1 className="mt-2 text-3xl font-bold md:text-4xl">Photo gallery</h1>
            </div>

            <button
              type="button"
              onClick={() => setAccessGranted(false)}
              className="inline-flex rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400"
            >
              Sign out
            </button>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100 sm:p-8">
          <h2 className="text-2xl font-bold">Upload photos</h2>
          <p className="mt-2 text-sm text-gray-600">
            Upload JPG, JPEG, PNG, GIF, WEBP, BMP, or ZIP files. ZIP uploads will be extracted automatically.
          </p>

          <form onSubmit={handleUpload} className="mt-6 space-y-5">
            <input
              type="file"
              accept=".zip,.jpg,.jpeg,.png,.gif,.webp,.bmp"
              multiple
              onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))}
              className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-xl file:border-0 file:bg-[#E5553C] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />

            {selectedFiles.length ? (
              <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50 px-4 py-3 text-sm text-gray-700">
                {selectedFiles.length} file(s) selected.
              </div>
            ) : null}

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={uploading}
              className="rounded-xl bg-[#E5553C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cc4a35] disabled:cursor-not-allowed disabled:bg-orange-300"
            >
              {uploading ? "Uploading..." : "Upload files"}
            </button>
          </form>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Uploaded photos</h2>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  queueDownload({
                    type: "bulk",
                    fileName: "acf-mombasa-2026-gallery.zip",
                  })
                }
                disabled={!items.length || Boolean(downloadingKey)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C83D2A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b53625] disabled:cursor-not-allowed disabled:bg-[#d89f96]"
              >
                <Download size={16} />
                Download all photos
              </button>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#E5553C]">
                {items.length} item(s)
              </span>
              {items.length ? (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Page {safePage} of {totalPages}
                </span>
              ) : null}
            </div>
          </div>

          {items.length ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {pageItems.map((item) => (
                <article key={item.photo_id} className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  <img
                    src={`/api/acf-mombasa-2026/photo/${item.photo_id}`}
                    alt={item.original_name}
                    className="h-64 w-full object-cover"
                  />
                  <div className="space-y-2 p-4">
                    <p className="line-clamp-2 text-sm font-semibold text-gray-900">{item.original_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.captureAt || item.createdAt).toLocaleString()} · {item.file_kind}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        queueDownload({
                          type: "single",
                          photoId: item.photo_id,
                          fileName: item.original_name,
                        })
                      }
                      disabled={Boolean(downloadingKey)}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#C83D2A] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#b53625] disabled:cursor-not-allowed disabled:bg-[#d89f96]"
                    >
                      <Download size={14} />
                      Download photo
                    </button>
                  </div>
                </article>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage <= 1}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const active = page === safePage;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                        active
                          ? "bg-[#E5553C] text-white"
                          : "border border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={safePage >= totalPages}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
              No photos uploaded yet.
            </div>
          )}
        </section>
      </div>

      {guidelinesOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-guidelines-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseGuidelines();
            }
          }}
        >
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={handleCloseGuidelines}
              disabled={Boolean(downloadingKey)}
              aria-label="Close media usage guidelines"
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X size={18} />
            </button>

            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f9ebe8] text-[#C83D2A]">
                  <Camera size={18} />
                </span>
                <h3 id="media-guidelines-title" className="text-xl font-bold text-gray-900">
                  Official Media Usage Guidelines
                </h3>
              </div>
            </div>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5 text-sm leading-6 text-gray-700">
              <p>
                The photographs in this gallery document the Africa Childcare Forum 2026, held in Mombasa, Kenya. These images are made available to support responsible communication, reporting and awareness of the Forum and its work.
              </p>

              <div>
                <p className="font-semibold text-gray-900">Permitted Uses</p>
                <p>
                  Photographs may be shared on social media, websites, newsletters, publications, reports and other non-commercial communications related to the Forum, childcare, early childhood development and participating organisations, subject to the applicable rights and permissions.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">Attribution and Acknowledgement</p>
                <p>
                  Where publishing photographs, acknowledge the Africa Childcare Forum and tag the official Forum accounts where appropriate.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">Editing and Representation</p>
                <p>
                  Do not edit, manipulate or present photographs in a way that misrepresents the event, changes the context of an individual&apos;s participation or implies an endorsement that has not been granted. Do not remove embedded copyright notices.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">Restricted Uses</p>
                <p>
                  Do not sell, sublicense or commercially redistribute the photographs as a standalone collection. Do not use them for commercial advertising, political campaigning, misleading endorsements or unlawful purposes without the necessary prior authorisation.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">Privacy and Child Safeguarding</p>
                <p>
                  Respect the privacy, dignity and safety of everyone depicted. Exercise particular care when sharing photographs of children or vulnerable individuals. All use must comply with applicable consent requirements, safeguarding policies and relevant law.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">Copyright and Ownership</p>
                <p>
                  Downloading a photograph does not transfer copyright or ownership. Rights remain with the applicable copyright holder. Uses outside the permissions provided here may require additional authorisation.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
              <label className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  ref={agreeButtonRef}
                  type="checkbox"
                  checked={agreementChecked}
                  onChange={(event) => setAgreementChecked(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#C83D2A] focus:ring-[#C83D2A]"
                />
                <span>
                  I have read and agree to the Media Usage Guidelines and will use the photographs responsibly.
                </span>
              </label>

              {downloadError ? (
                <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {downloadError}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseGuidelines}
                  disabled={Boolean(downloadingKey)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAgreeAndDownload}
                  disabled={!agreementChecked || Boolean(downloadingKey)}
                  className="rounded-lg bg-[#C83D2A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b53625] disabled:cursor-not-allowed disabled:bg-[#d89f96]"
                >
                  {downloadingKey ? "Preparing download..." : "Agree & Continue to Download"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

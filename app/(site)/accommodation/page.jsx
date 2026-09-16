"use client";

import { useState } from "react";
import {
  Hotel,
  MapPin,
  Calendar,
  Download,
  Mail,
  Phone,
  Footprints,
  Info,
  ExternalLink,
  Globe,
} from "lucide-react";
import {
  ACCOMMODATION_INTRO,
  ACCOMMODATION_HOTELS,
  ACCOMMODATION_GETTING_THERE,
} from "@/lib/accommodation";
import { useToast } from "@/components/ui/ToastProvider";

const ROOM_PREFERENCES = [
  "Single room",
  "Shared room (2 people)",
  "Shared room (3 people)",
  "Couples / 1-bedroom",
  "Family / multi-bedroom",
  "Not sure yet",
];

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  organization: "",
  hotel: "",
  checkIn: "",
  checkOut: "",
  guests: "",
  roomPreference: "",
  details: "",
};

export default function AccommodationPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email";
    }
    if (!form.phone.trim()) nextErrors.phone = "Phone is required";
    if (!form.hotel) nextErrors.hotel = "Please select a hotel";
    if (!form.details.trim()) nextErrors.details = "Please describe your request";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setLoading(true);
      const res = await fetch("/api/accommodation/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast({
          type: "error",
          message: data.error || "Could not send request",
        });
        return;
      }
      setForm(emptyForm);
      setSubmitted(true);
      showToast({
        type: "success",
        message: "Request sent — our team will follow up",
      });
    } catch {
      showToast({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white">
      <section className="bg-gradient-to-br from-[#FFF4F0] via-white to-[#FFECEA] pt-10 pb-14 border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="inline-block mb-4 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#E5553C] bg-white border border-orange-100 rounded-full">
            {ACCOMMODATION_INTRO.event}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {ACCOMMODATION_INTRO.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 text-gray-700 font-medium mb-4">
            <span className="inline-flex items-center gap-2">
              <Calendar size={16} className="text-[#E5553C]" />
              {ACCOMMODATION_INTRO.dates}
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-[#E5553C]" />
              {ACCOMMODATION_INTRO.venue}
            </span>
          </div>
          <p className="text-gray-600 max-w-4xl leading-relaxed mb-4">
            {ACCOMMODATION_INTRO.forumBlurb}
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <a
              href="/event-register"
              className="inline-flex items-center gap-2 bg-[#E5553C] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#cc4a35] transition"
            >
              Register Now
            </a>
            <a
              href="/#about"
              className="inline-flex items-center gap-2 border-2 border-[#E5553C] text-[#E5553C] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#FFECEA] transition"
            >
              Learn More
            </a>
            <a
              href="#booking-help"
              className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-800 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Request booking help
            </a>
          </div>
          <p className="text-gray-600 max-w-4xl leading-relaxed mb-8">
            {ACCOMMODATION_INTRO.summary}
          </p>
          <a
            href={ACCOMMODATION_INTRO.downloadPath}
            download={ACCOMMODATION_INTRO.downloadName}
            className="inline-flex items-center gap-2 bg-[#E5553C] text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-[#cc4a35] transition"
          >
            <Download size={18} />
            Download accommodation guide (PDF)
          </a>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <Hotel className="text-[#E5553C]" size={28} />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Summary Table
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#FFF4F0] text-gray-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Hotel</th>
                  <th className="px-4 py-3 font-semibold">Distance from Venue</th>
                  <th className="px-4 py-3 font-semibold">Price / Night</th>
                  <th className="px-4 py-3 font-semibold">Booking Email &amp; Phone</th>
                  <th className="px-4 py-3 font-semibold">Website</th>
                  <th className="px-4 py-3 font-semibold">Getting to Venue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {ACCOMMODATION_HOTELS.map((hotel) => (
                  <tr key={hotel.name} className="align-top hover:bg-orange-50/40">
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3 min-w-[220px]">
                        <img
                          src={hotel.image}
                          alt=""
                          className="h-14 w-20 rounded-lg object-cover shrink-0 border border-orange-100"
                          loading="lazy"
                        />
                        <span className="font-semibold text-gray-900 leading-snug">
                          {hotel.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{hotel.distance}</td>
                    <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
                      {hotel.priceLabel}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {hotel.contactPerson && (
                        <span className="block text-gray-800 font-medium mb-1">
                          {hotel.contactPerson}
                        </span>
                      )}
                      <a
                        href={`mailto:${hotel.email}`}
                        className="text-[#E5553C] hover:underline break-all"
                      >
                        {hotel.email}
                      </a>
                      <br />
                      <a
                        href={`tel:${hotel.phone.replace(/\s/g, "")}`}
                        className="text-gray-700 hover:underline"
                      >
                        {hotel.phone}
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      {hotel.website ? (
                        <a
                          href={hotel.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#E5553C] hover:underline text-sm font-medium"
                        >
                          Visit site
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-700">{hotel.transport}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500 flex items-start gap-2">
            <Info size={14} className="mt-0.5 shrink-0 text-[#E5553C]" />
            † {ACCOMMODATION_INTRO.footnote}
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#FFF4F0]/60">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Hotel Details
          </h2>
          <div className="grid gap-8">
            {ACCOMMODATION_HOTELS.map((hotel) => (
              <article
                key={hotel.name}
                className="bg-white border border-orange-100 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
                  <div className="relative min-h-[220px] md:min-h-full bg-gray-100">
                    <img
                      src={hotel.image}
                      alt={`${hotel.name} — property view`}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {hotel.name}
                      </h3>
                      {hotel.website && (
                        <a
                          href={hotel.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 shrink-0 text-sm font-semibold text-[#E5553C] hover:underline"
                        >
                          <Globe size={15} />
                          Visit website
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                    <ul className="space-y-3 text-gray-700 text-sm sm:text-base mb-4">
                      {hotel.details.map((line) => (
                        <li key={line} className="flex gap-2">
                          <span className="text-[#E5553C] mt-1.5">●</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>

                    {hotel.roomRates?.length > 0 && (
                      <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left font-semibold">
                                Room Type
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Price
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Board / Notes
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {hotel.roomRates.map((rate) => (
                              <tr key={rate.type}>
                                <td className="px-3 py-2 font-medium text-gray-900">
                                  {rate.type}
                                </td>
                                <td className="px-3 py-2 text-gray-700">
                                  {rate.price}
                                </td>
                                <td className="px-3 py-2 text-gray-600">
                                  {rate.notes}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-sm">
                      <span className="inline-flex items-center gap-2">
                        <Mail size={16} className="text-[#E5553C]" />
                        <a
                          href={`mailto:${hotel.email}`}
                          className="text-[#E5553C] hover:underline break-all"
                        >
                          {hotel.email}
                        </a>
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Phone size={16} className="text-[#E5553C]" />
                        <a
                          href={`tel:${hotel.phone.replace(/\s/g, "")}`}
                          className="hover:underline"
                        >
                          {hotel.phone}
                        </a>
                      </span>
                      {hotel.website && (
                        <a
                          href={hotel.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#E5553C] hover:underline break-all"
                        >
                          <Globe size={16} />
                          {hotel.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <Footprints className="text-[#E5553C]" size={28} />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Getting to the Conference Each Day
            </h2>
          </div>
          <ul className="space-y-4 text-gray-700 leading-relaxed max-w-4xl">
            {ACCOMMODATION_GETTING_THERE.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#E5553C] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href={ACCOMMODATION_INTRO.downloadPath}
              download={ACCOMMODATION_INTRO.downloadName}
              className="inline-flex items-center justify-center gap-2 bg-[#E5553C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cc4a35] transition"
            >
              <Download size={18} />
              Download PDF guide
            </a>
            <a
              href="#booking-help"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#E5553C] text-[#E5553C] px-6 py-3 rounded-lg font-semibold hover:bg-[#FFECEA] transition"
            >
              Request booking help
            </a>
          </div>
        </div>
      </section>

      <section id="booking-help" className="py-16 bg-[#FFF4F0]/60 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Request Accommodation Help
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Need help choosing or booking a hotel near the venue? Fill in the form
            below and our team will follow up. Your request is sent to the ACF
            accommodation support team.
          </p>

          {submitted ? (
            <div className="bg-white border border-green-200 rounded-2xl p-8 text-center">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Request received
              </p>
              <p className="text-gray-600 mb-6">
                Thank you. Steven and Janet have been notified and will get back
                to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-[#E5553C] font-semibold hover:underline"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-orange-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 overflow-visible"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    Full name*
                  </label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E5553C]/30 focus:border-[#E5553C]"
                    autoComplete="name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E5553C]/30 focus:border-[#E5553C]"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    Phone*
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E5553C]/30 focus:border-[#E5553C]"
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    Organization
                  </label>
                  <input
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E5553C]/30 focus:border-[#E5553C]"
                  />
                </div>
              </div>

              <fieldset>
                <legend className="block text-sm font-medium text-gray-800 mb-3">
                  Preferred hotel*
                </legend>
                <div className="space-y-2">
                  {ACCOMMODATION_HOTELS.map((hotel) => {
                    const selected = form.hotel === hotel.name;
                    return (
                      <label
                        key={hotel.name}
                        className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                          selected
                            ? "border-[#E5553C] bg-[#FFF4F0] ring-1 ring-[#E5553C]/40"
                            : "border-gray-200 hover:border-[#E5553C]/50 hover:bg-orange-50/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="hotel"
                          value={hotel.name}
                          checked={selected}
                          onChange={handleChange}
                          className="mt-1 shrink-0 accent-[#E5553C]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-gray-900 leading-snug break-words">
                            {hotel.name}
                          </span>
                          <span className="block text-xs text-gray-600 mt-0.5 leading-relaxed break-words">
                            {hotel.distance} · {hotel.priceLabel}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                  <label
                    className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                      form.hotel === "Not sure / Need advice"
                        ? "border-[#E5553C] bg-[#FFF4F0] ring-1 ring-[#E5553C]/40"
                        : "border-gray-200 hover:border-[#E5553C]/50 hover:bg-orange-50/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="hotel"
                      value="Not sure / Need advice"
                      checked={form.hotel === "Not sure / Need advice"}
                      onChange={handleChange}
                      className="mt-1 shrink-0 accent-[#E5553C]"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      Not sure / Need advice
                    </span>
                  </label>
                </div>
                {errors.hotel && (
                  <p className="mt-2 text-xs text-red-600">{errors.hotel}</p>
                )}
              </fieldset>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    Check-in date
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={form.checkIn}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E5553C]/30 focus:border-[#E5553C]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    Check-out date
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={form.checkOut}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E5553C]/30 focus:border-[#E5553C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                  Number of guests
                </label>
                <input
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  className="w-full sm:max-w-xs rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E5553C]/30 focus:border-[#E5553C]"
                />
              </div>

              <fieldset>
                <legend className="block text-sm font-medium text-gray-800 mb-3">
                  Room preference
                </legend>
                <div className="grid sm:grid-cols-2 gap-2">
                  {ROOM_PREFERENCES.map((opt) => {
                    const selected = form.roomPreference === opt;
                    return (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                          selected
                            ? "border-[#E5553C] bg-[#FFF4F0] ring-1 ring-[#E5553C]/40"
                            : "border-gray-200 hover:border-[#E5553C]/50 hover:bg-orange-50/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="roomPreference"
                          value={opt}
                          checked={selected}
                          onChange={handleChange}
                          className="shrink-0 accent-[#E5553C]"
                        />
                        <span className="text-sm text-gray-900 leading-snug break-words">
                          {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                  Request details*
                </label>
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us what you need help with — e.g. shared room matching, group booking, accessibility needs, budget range."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E5553C]/30 focus:border-[#E5553C]"
                />
                {errors.details && (
                  <p className="mt-1 text-xs text-red-600">{errors.details}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E5553C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#cc4a35] transition disabled:opacity-60"
              >
                {loading ? "Sending…" : "Submit booking request"}
              </button>
            </form>
          )}

          <p className="mt-10 text-sm text-gray-500">
            Compiled for the Uthabiti Africa ACF Mombasa 2026 planning team.
          </p>
        </div>
      </section>
    </main>
  );
}

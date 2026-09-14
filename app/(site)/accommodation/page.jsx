"use client";

import {
  Hotel,
  MapPin,
  Calendar,
  Download,
  Mail,
  Phone,
  Footprints,
  Info,
} from "lucide-react";
import {
  ACCOMMODATION_INTRO,
  ACCOMMODATION_HOTELS,
  ACCOMMODATION_GETTING_THERE,
} from "@/lib/accommodation";

export default function AccommodationPage() {
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
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 text-gray-700 font-medium mb-6">
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
                  <th className="px-4 py-3 font-semibold">Getting to Venue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {ACCOMMODATION_HOTELS.map((hotel) => (
                  <tr key={hotel.name} className="align-top hover:bg-orange-50/40">
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {hotel.name}
                    </td>
                    <td className="px-4 py-4 text-gray-700">{hotel.distance}</td>
                    <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
                      From KES {hotel.priceKes}
                      <br />
                      <span className="text-gray-500">(~US${hotel.priceUsd})</span>
                    </td>
                    <td className="px-4 py-4 text-gray-700">
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
                    <td className="px-4 py-4 text-gray-700">{hotel.transport}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500 flex items-start gap-2">
            <Info size={14} className="mt-0.5 shrink-0 text-[#E5553C]" />
            Rates are indicative online rates and change daily. Confirm current
            pricing and ask about a group/corporate rate for ACF delegates when
            booking.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#FFF4F0]/60">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Hotel Details
          </h2>
          <div className="grid gap-6">
            {ACCOMMODATION_HOTELS.map((hotel) => (
              <article
                key={hotel.name}
                className="bg-white border border-orange-100 rounded-2xl p-6 sm:p-8 shadow-sm"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {hotel.name}
                </h3>
                <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                  <li>
                    <strong>Distance from venue:</strong> {hotel.distance}
                  </li>
                  <li>
                    <strong>Price:</strong> From KES {hotel.priceKes} (~US$
                    {hotel.priceUsd}) per night (indicative online rate; ask
                    about a group/corporate rate for ACF delegates)
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
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
                  </li>
                  <li>
                    <strong>Notes:</strong> {hotel.notes}
                  </li>
                </ul>
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
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#E5553C] text-[#E5553C] px-6 py-3 rounded-lg font-semibold hover:bg-[#FFECEA] transition"
            >
              Contact us for booking help
            </a>
          </div>

          <p className="mt-10 text-sm text-gray-500">
            Compiled for the Uthabiti Africa ACF Mombasa 2026 planning team.
          </p>
        </div>
      </section>
    </main>
  );
}

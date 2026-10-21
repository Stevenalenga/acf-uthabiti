"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { FIELD_VISIT } from "@/lib/fieldVisit";

export default function FieldVisitsPage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="bg-[#FFF4F0] pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-[#E5553C] font-semibold tracking-wide">
            ACFMombasa2026 · Day 3 · {FIELD_VISIT.datesLabel}
          </p>
          <h1 className="text-4xl font-bold mt-3">Field Visit Sign-Up</h1>
          <p className="mt-4 text-lg text-gray-600">
            Register to visit childcare centres and related initiatives in and
            around Mombasa. Field visits are part of the Africa Childcare Forum
            2026, under the theme “Uniting for Care: Africa’s Call to the World.”
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 grid gap-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFECEA] p-3 rounded-lg">
                <MapPin className="text-[#E5553C]" size={22} />
              </div>
              <h2 className="text-xl font-bold">About the visits</h2>
            </div>
            <p className="mt-4 text-gray-700">
              Participants are invited to learn from organisations and
              initiatives working to strengthen childcare, early childhood
              development, community support systems, and children’s wellbeing.
            </p>
          </div>
          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold">Places</h2>
            <p className="mt-4 text-gray-700">
              Places may be limited. Complete the sign-up form to indicate your
              preferred visit. The ACF Secretariat will confirm participation.
            </p>
          </div>
        </div>

        <div className="bg-[#FFF4F0] rounded-2xl p-8">
          <h2 className="text-2xl font-bold">Book your field visit</h2>
          <p className="mt-3 text-gray-700">
            Use the onsite field visit form to register. This link is for
            delegates of Africa Childcare Forum Mombasa 2026.
          </p>
          <a
            href={FIELD_VISIT.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 bg-[#E5553C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cf4b35]"
          >
            Open the field visit form
            <ExternalLink size={16} />
          </a>
        </div>
      </section>
    </main>
  );
}

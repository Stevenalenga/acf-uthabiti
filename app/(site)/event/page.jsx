"use client";

import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

export default function ACFKigali2025Page() {
  return (
    <main className="bg-white">
      {/* Page Header */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-3xl">
            <span className="inline-block mb-4 text-sm font-semibold tracking-wide text-[#E5553C] uppercase">
                Past Convening
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                ACF Kigali 2025
            </h1>

            <p className="mt-6 text-lg text-gray-600">
                Building momentum for childcare justice — reflecting on Africa’s first
                continental convening on care.
            </p>
            </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About ACF Kigali 2025
            </h2>

            <p className="text-gray-600 mb-6">
              The Africa Childcare Forum Kigali 2025 marked a historic milestone as
              the first continental platform dedicated to advancing childcare as
              essential social infrastructure in Africa.
            </p>

            <p className="text-gray-600">
              Convening policymakers, practitioners, caregivers, researchers, and
              global partners, ACFKigali2025 created an honest space for dialogue,
              learning, and collaboration—centering lived experiences and elevating
              African-led solutions.
            </p>

            <div className="mt-8 flex flex-wrap gap-6 text-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="text-[#E5553C]" />
                <span>15 Dec 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-[#E5553C]" />
                <span>Kigali, Rwanda</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-[#E5553C]" />
                <span>Continental & Global Participants</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <img
              src="/images/mission-image.jpg"
              alt="ACF Kigali 2025"
              className="rounded-2xl shadow-lg w-full max-w-md object-cover"
            />
          </div>
        </div>
      </section>

      {/* Key Outcomes */}
      <section className="bg-[#FFF4F0] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Key Outcomes & Impact
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Elevated Local Voices",
                text:
                  "Caregivers, informal workers, and community leaders were centered as experts in shaping childcare solutions.",
              },
              {
                title: "Policy Momentum",
                text:
                  "Strengthened regional dialogue on positioning childcare as essential social infrastructure.",
              },
              {
                title: "African Innovation",
                text:
                  "Showcased community-led and scalable childcare models reflecting Africa’s diverse realities.",
              },
              {
                title: "Global Solidarity",
                text:
                  "Fostered meaningful partnerships between African actors and global allies.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy & Continuation */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            From Kigali to Mombasa
          </h2>

          <p className="text-gray-600 mb-8">
            ACFMombasa2026 is a strategic continuation of the momentum generated in
            Kigali. Building on lessons, relationships, and commitments from
            ACFKigali2025, the movement for childcare justice and equity continues
            with renewed purpose and global relevance.
          </p>

          <a
            href="/#register"
            className="inline-flex items-center gap-2 bg-[#E5553C] text-white font-semibold py-4 px-8 rounded-lg hover:bg-[#cf4b35] transition-colors"
          >
            Join Us at ACFMombasa2026
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}
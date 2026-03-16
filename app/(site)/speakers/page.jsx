"use client";

import { Users, Mic, Globe } from "lucide-react";

export default function SpeakersPage() {
  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="bg-[#FFF4F0] py-20 pt-34">
        <div className="max-w-6xl mx-auto px-4 text-center">

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Featured Speakers
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            The Africa Childcare Forum 2026 will convene distinguished leaders,
            policymakers, researchers, and practitioners shaping childcare
            systems and the care economy across Africa and globally.
          </p>

        </div>
      </section>


      {/* TO BE ANNOUNCED */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#FFF4F0] p-5 rounded-full">
              <Users className="text-[#E5553C]" size={36} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            Featured Speakers – To Be Announced
          </h2>

          <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
            We are currently confirming an exciting lineup of high-level
            speakers for the Africa Childcare Forum 2026. The Forum will
            feature influential leaders, experts, and policymakers committed
            to strengthening childcare systems across Africa.
          </p>

        </div>
      </section>


      {/* WHAT WILL BE INCLUDED */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4">

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="border border-gray-200 rounded-2xl p-8 text-center">
              <Mic className="mx-auto text-[#E5553C] mb-4" size={28}/>
              <h3 className="font-semibold text-gray-900 mb-2">
                Speaker Profiles
              </h3>
              <p className="text-gray-600 text-sm">
                Profiles of confirmed speakers including names,
                organizations, and leadership roles.
              </p>
            </div>

            <div className="border border-gray-200 rounded-2xl p-8 text-center">
              <Users className="mx-auto text-[#E5553C] mb-4" size={28}/>
              <h3 className="font-semibold text-gray-900 mb-2">
                Professional Biographies
              </h3>
              <p className="text-gray-600 text-sm">
                Background information highlighting each speaker’s expertise
                and contributions to childcare and social policy.
              </p>
            </div>

            <div className="border border-gray-200 rounded-2xl p-8 text-center">
              <Globe className="mx-auto text-[#E5553C] mb-4" size={28}/>
              <h3 className="font-semibold text-gray-900 mb-2">
                Global Representation
              </h3>
              <p className="text-gray-600 text-sm">
                Leaders from government, academia, civil society, and
                international organizations across Africa and beyond.
              </p>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
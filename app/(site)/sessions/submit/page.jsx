"use client";

import { ArrowLeft } from "lucide-react";

export default function SubmitSessionPage() {
  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="bg-[#FFF4F0] py-20 pt-32 text-center">
        <div className="max-w-3xl mx-auto px-6">

          <h1 className="text-4xl font-extrabold text-gray-900">
            Submit a Session Proposal
          </h1>

          <p className="mt-6 text-gray-600">
            Complete the form below to submit your proposal for a
            partner-led session at the Africa Childcare Forum 2026.
          </p>

        </div>
      </section>


      {/* FORM */}
      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="mb-8">

            <a
              href="/sessions"
              className="inline-flex items-center gap-2 text-[#E5553C] font-medium"
            >
              <ArrowLeft size={18} />
              Back to Sessions
            </a>

          </div>


          <div className="rounded-2xl overflow-hidden shadow-lg border">

            <iframe
              src="https://forms.gle/aeXgjVRdPandrtHK7"
              width="100%"
              height="900"
              frameBorder="0"
            >
              Loading…
            </iframe>

          </div>

        </div>

      </section>

    </main>
  );
}
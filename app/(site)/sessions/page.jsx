"use client";

import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

export default function SessionsPage() {
  return (
    <main className="bg-white">

      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block mb-4 text-sm font-semibold tracking-wide text-[#E5553C] uppercase">
              Forum Programme
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
              Forum Sessions
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              ACFMombasa2026 offers a series of engaging sessions to share knowledge,
              build skills, and foster collaboration among childcare professionals,
              caregivers, policymakers, and global partners.
            </p>
          </div>
        </div>
      </section>

      {/* Session Overview */}
      <section className="py-20 border-b">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About the Sessions
            </h2>
            <p className="text-gray-600 mb-4">
              Participants can engage in interactive workshops, panel discussions, innovation clinics, 
              and networking sessions designed to promote African-led solutions and actionable childcare strategies.
            </p>
            <p className="text-gray-600">
              Sessions focus on evidence-informed approaches, policy reforms, global collaboration, 
              and showcasing African innovation in childcare and the broader care economy.
            </p>

            <div className="mt-8 flex flex-wrap gap-6 text-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="text-[#E5553C]" />
                <span>15–18 September 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-[#E5553C]" />
                <span>PrideInn Paradise, Mombasa, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-[#E5553C]" />
                <span>Policymakers, NGOs, Academics, Innovators</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <img
              src="/images/ACF92-b.jpg"
              alt="ACFMombasa2026 Sessions"
              className="rounded-2xl shadow-lg w-full max-w-md object-cover"
            />
          </div>
        </div>
      </section>

      {/* Session Categories */}
      <section className="py-20 bg-[#FFF4F0]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Session Types
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Inspiring Keynotes",
                text: "Hear from world-renowned experts and leaders sharing insights and strategies for impactful change."
              },
              {
                title: "Interactive Workshops",
                text: "Hands-on sessions equipping participants with practical tools and techniques for effective childcare solutions."
              },
              {
                title: "Networking Opportunities",
                text: "Connect with like-minded professionals and organizations advancing childcare initiatives across Africa."
              },
              {
                title: "High-Level Paper Presentations",
                text: "Showcasing research and policy insights that inform strategies and strengthen systems."
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
              >
                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submission Guidelines */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Submit Your Session Proposal
          </h2>

          <p className="text-gray-600 mb-6">
            Organizations and initiatives are invited to submit proposals for sessions before, during, or after ACFMombasa2026.
            This is an opportunity to showcase innovations, share research, and influence Africa-led solutions in childcare and care systems.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-gray-700">
            {[
              {
                icon: "",
                title: "Proposal Length",
                text: "300–500 words outlining objectives, format, expected outcomes, and participating organizations."
              },
              {
                icon: "",
                title: "Session Duration",
                text: "Typically 60–90 minutes to allow for meaningful engagement."
              },
              {
                icon: "",
                title: "Integration",
                text: "Selected sessions will be integrated into pre-conference, conference, or post-conference program."
              },
              {
                icon: "",
                title: "Timeline",
                text: "Submit by 30 May 2025. Selection notification by 30 June 2025."
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="mailto:cac@uthabitiafrica.org"
              className="inline-flex items-center gap-2 bg-[#E5553C] text-white font-semibold py-4 px-8 rounded-lg hover:bg-[#cf4b35] transition"
            >
              Submit via Email
              <ArrowRight size={18} />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 ml-4 border border-gray-300 text-gray-800 font-semibold py-4 px-8 rounded-lg hover:bg-gray-50 transition"
            >
              Online Submission Form
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
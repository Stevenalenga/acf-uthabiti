"use client";

import { Users, Globe, MapPin, Calendar, ArrowRight } from "lucide-react";

export default function ExhibitionsPage() {
  return (
    <main className="bg-white">

      {/* Page Header */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block mb-4 text-sm font-semibold tracking-wide text-[#E5553C] uppercase">
              Engage & Showcase
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
              Exhibitions at ACFMombasa2026
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              Showcase your vision, expand your network, and reach key decision-makers in childcare at Africa’s premier forum.
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 border-b">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Exhibit at ACFMombasa2026?
            </h2>
            <p className="text-gray-600 mb-4">
              Join us as an exhibitor to showcase innovative solutions, engage with influential stakeholders, and contribute to shaping Africa’s childcare landscape.
            </p>
            <p className="text-gray-600 mb-6">
              Exhibitors gain visibility, access to decision-makers, networking opportunities, and a platform to demonstrate impact in the childcare sector.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 text-gray-700">
              {[
                { icon: <Users className="text-[#E5553C]" />, title: "Reach Key Decision-Makers", text: "Meet policymakers, industry leaders, and influential stakeholders driving change in childcare across Africa." },
                { icon: <Globe className="text-[#E5553C]" />, title: "Expand Your Network", text: "Build valuable connections with organizations, collaborators, and innovators from across the continent." },
                { icon: <MapPin className="text-[#E5553C]" />, title: "Showcase Your Impact", text: "Highlight projects, initiatives, and solutions that shape the future of childcare." },
                { icon: <Calendar className="text-[#E5553C]" />, title: "3 Days of Impact", text: "Engage with over 500 attendees, 30+ countries, and 100+ organizations during the Forum." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <img
              src="/images/exh.jpg"
              alt="ACFMombasa2026 Exhibitions"
              className="rounded-2xl shadow-lg w-full max-w-md object-cover"
            />
          </div>
        </div>
      </section>

      {/* Exhibitor Benefits */}
      <section className="py-20 bg-[#FFF4F0]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Exhibitor Benefits
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-700">
            {[
              "Dedicated Exhibition Space",
              "Vibrant Audience Access",
              "Brand Visibility",
              "Complimentary Conference Ticket",
              "Marketing Exposure",
              "Networking Opportunities"
            ].map((benefit, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-gray-900 mb-2">{benefit}</h3>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="/event-register"
              className="inline-flex items-center gap-2 bg-[#E5553C] text-white font-semibold py-4 px-8 rounded-lg hover:bg-[#cf4b35] transition"
            >
              Reserve Your Spot
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
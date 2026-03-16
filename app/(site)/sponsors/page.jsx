"use client";

import { Handshake, Globe, BookOpen, Megaphone } from "lucide-react";

export default function SponsorsPage() {
  const categories = [
    {
      title: "Strategic Partners",
      icon: Handshake,
      description:
        "Organizations providing strategic leadership, funding, and long-term commitment to advancing childcare systems across Africa.",
    },
    {
      title: "Knowledge Partners",
      icon: BookOpen,
      description:
        "Research institutions, think tanks, and organizations contributing evidence, insights, and technical expertise.",
    },
    {
      title: "Supporting Partners",
      icon: Globe,
      description:
        "Organizations supporting the Forum through collaboration, resources, and participation.",
    },
    {
      title: "Media Partners",
      icon: Megaphone,
      description:
        "Media organizations amplifying the Forum's impact and sharing stories shaping childcare conversations across Africa.",
    },
  ];

  return (
    <main className="bg-white">

      {/* Hero */}
      <section className="py-24 bg-[#FFF4F0]">
        <div className="max-w-7xl mx-auto px-4 text-center">

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Our Partners & Sponsors
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-700">
            ACFMombasa2026 is made possible through the collaboration of
            visionary partners committed to strengthening childcare systems
            across Africa. Together we are advancing policy, innovation,
            and investment for quality childcare.
          </p>

        </div>
      </section>

      {/* Sponsor Categories */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 space-y-24">

          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <div key={index}>

                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-[#FFF4F0] p-3 rounded-lg">
                    <Icon className="text-[#E5553C]" size={28} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {category.title}
                    </h2>

                    <p className="text-gray-600 mt-1 max-w-2xl">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Logos Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">

                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border rounded-xl h-24 flex items-center justify-center hover:shadow-md transition"
                    >
                      <span className="text-gray-400 text-sm">
                        Logo
                      </span>
                    </div>
                  ))}

                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#E5553C] text-white text-center">
        <div className="max-w-3xl mx-auto px-4">

          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
            Become a Sponsor
          </h2>

          <p className="text-lg mb-10">
            Join organizations across Africa and globally who are shaping
            the future of childcare through collaboration and innovation.
          </p>

          <a
            href="/contact"
            className="bg-white text-[#E5553C] font-semibold px-10 py-4 rounded-lg shadow hover:bg-[#FFECEA] transition"
          >
            Partner with Us
          </a>

        </div>
      </section>

    </main>
  );
}
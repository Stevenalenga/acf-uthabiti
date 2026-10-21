"use client";

import {
  Calendar,
  MapPin,
  Users,
  Lightbulb,
  Briefcase,
  Globe,
  Download,
  Mic,
  Handshake,
  ExternalLink
} from "lucide-react";
import { FIELD_VISIT } from "@/lib/fieldVisit";

export default function ProgrammePage() {

  const days = [
    {
      title: "Day 1 – Policy Leadership and Systems Transformation",
      date: "13 October 2026",
      icon: Globe,
      sessions: [
        "Opening Ceremony and Welcome Remarks",
        "High-Level Ministerial Dialogue on Childcare Systems in Africa",
        "Plenary Discussion: The Care Economy and Women’s Economic Empowerment",
        "Policy Roundtables on Childcare Financing and Governance",
        "Innovation Showcase featuring emerging childcare solutions",
        "Networking Reception"
      ]
    },
    {
      title: "Day 2 – Solutions, Partnerships, and Innovation",
      date: "14 October 2026",
      icon: Lightbulb,
      sessions: [
        "Partner-Led Sessions and Technical Workshops",
        "Research and Evidence Presentations",
        "Private Sector Engagement in Childcare",
        "Childcare Workforce Development and Professionalization",
        "Community-Led Childcare Innovations",
        "Financing Sustainable Childcare Systems",
        "Exhibition and Innovation Showcase"
      ]
    },
    {
      title: "Day 3 – Field Visits and Learning in Practice",
      date: "15 October 2026",
      icon: MapPin,
      sessions: [
        "Community-Based Childcare Programme Visits",
        "Early Childhood Development Initiative Tours",
        "Learning from Local Childcare Providers",
        "Guided Cultural Tour of Mombasa"
      ]
    }
  ];

  return (
    <main className="bg-white">

      {/* HERO */}
      <section
        className="relative h-[420px] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: "url('/images/acf-poster-mombasa-2026.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative max-w-4xl px-6">

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-up">
            Forum Programme
          </h1>

          <p className="text-lg md:text-xl text-gray-200">
            13–15 October 2026 • Mombasa, Kenya
          </p>

        </div>
      </section>

      {/* PROGRAMME OVERVIEW */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Programme Overview
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed">
            The Africa Childcare Forum 2026 will bring together policymakers,
            practitioners, researchers, investors, philanthropic organizations,
            and community leaders to advance childcare systems, Early Childhood
            Development (ECD), women’s economic empowerment, and the care
            economy across Africa.
          </p>

          <p className="text-gray-600 mt-6 leading-relaxed">
            The Forum provides a platform for policy dialogue, knowledge
            exchange, and partnership building to strengthen childcare services
            and support working families across the continent.
          </p>

          <p className="text-gray-500 mt-6 italic">
            The draft programme is now available to download. The overview below
            may still be refined as speakers and partners are confirmed.
          </p>

        </div>
      </section>

      {/* PROGRAMME AT A GLANCE */}
      <section className="py-24 bg-[#FFF4F0]">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Programme at a Glance
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">

            {days.map((day, i) => {
              const Icon = day.icon;

              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition duration-300 hover:-translate-y-2"
                >

                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#FFECEA] p-3 rounded-lg">
                      <Icon className="text-[#E5553C]" size={22} />
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900">
                        {day.title}
                      </h3>
                      <p className="text-sm text-gray-500">{day.date}</p>
                    </div>
                  </div>

                  <ul className="space-y-3 mt-6 text-gray-600 text-sm">
                    {day.sessions.map((session, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-[#E5553C]">•</span>
                        {session}
                      </li>
                    ))}
                  </ul>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              What to Expect
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

            {[
              {
                icon: Mic,
                title: "High-Level Policy Dialogues",
                text: "Engage with senior policymakers, global experts, and sector leaders on strategies to strengthen childcare systems and Early Childhood Development services across Africa."
              },
              {
                icon: Users,
                title: "Interactive Workshops",
                text: "Hands-on sessions sharing practical tools, innovative approaches, and lessons learned in improving childcare services and workforce development."
              },
              {
                icon: Handshake,
                title: "Partner-Led Sessions",
                text: "Organizations working in childcare, gender equality, and social development will host sessions highlighting research, policy solutions, and investments."
              },
              {
                icon: Lightbulb,
                title: "Innovation Showcase",
                text: "Discover African-led innovations transforming childcare services, early learning environments, and caregiver support systems."
              },
              {
                icon: MapPin,
                title: "Field Visits",
                text: "Visit childcare and Early Childhood Development initiatives in and around Mombasa to learn from community-driven models.",
                href: FIELD_VISIT.pagePath,
                cta: "Sign up for a field visit",
              }
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition"
                >

                  <Icon className="text-[#E5553C] mb-4" size={28} />

                  <h3 className="font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.text}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-[#E5553C] hover:underline"
                    >
                      {item.cta}
                      <ExternalLink size={14} />
                    </a>
                  ) : null}

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* FIELD VISIT SIGN-UP */}
      <section className="py-16 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Field visit registration
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Day 3 includes visits to childcare centres in the Mombasa area.
          Places may be limited — complete the sign-up form to book your place.
        </p>
        <a
          href={FIELD_VISIT.formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#E5553C] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#cf4b35] transition"
        >
          Open the field visit form
          <ExternalLink size={18} />
        </a>
      </section>

      {/* DOWNLOAD PROGRAMME */}
      <section className="py-20 bg-[#FFF4F0] text-center">

        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Draft Programme
        </h3>
        <p className="text-gray-600 mb-6">
          The draft programme for ACF Mombasa 2026 is available to download.
        </p>

        <a
          href="/documents/ACF-Mombasa-2026-Draft-Programme.pdf"
          download
          className="inline-flex items-center gap-2 bg-[#E5553C] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#cf4b35] transition"
        >
          <Download size={18} />
          Download Draft Programme
        </a>

      </section>

    </main>
  );
}
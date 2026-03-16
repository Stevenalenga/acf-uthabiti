"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Users,
  GraduationCap,
  MessageCircle,
  Globe,
  BookOpen,
  Network,
  ArrowRight,
} from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ConferenceDetailsPage() {
  return (
    <main className="bg-white">

      {/* Page Intro */}
      <section className="py-24 bg-[#FFF4F0]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 text-center"
        >
          <CalendarDays className="mx-auto text-[#E5553C] mb-6" size={42} />

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Pre-Conference Engagements
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-700">
            Leading up to ACFMombasa2026, partners across Africa will convene
            dialogues, workshops, and learning exchanges to surface national
            childcare priorities and strengthen preparation for the Forum.
          </p>
        </motion.div>
      </section>

      {/* Preparing for Forum */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Users className="text-[#E5553C]" />
              Preparing for the Forum
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Country partners are encouraged to organize events that bring
              together policymakers, practitioners, caregivers, and researchers
              to share evidence, discuss priorities, and highlight innovative
              childcare solutions ahead of ACFMombasa2026.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Country Led Events */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">

          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Country-Led Pre-Conference Events
          </h2>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Users,
                title: "National Dialogues",
                text: "Country-led discussions bringing policymakers, civil society, and caregivers together to shape childcare priorities.",
              },
              {
                icon: GraduationCap,
                title: "Workshops & Training",
                text: "Capacity-building sessions focused on workforce development, financing, and childcare service delivery.",
              },
              {
                icon: MessageCircle,
                title: "Roundtables & Exchanges",
                text: "Collaborative discussions sharing evidence, innovations, and best practices across regions.",
              },
            ].map((card, i) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={i}
                  variants={item}
                  whileHover={{ y: -8 }}
                  className="border rounded-2xl p-8 hover:shadow-xl transition bg-white"
                >
                  <Icon className="text-[#E5553C] mb-4" size={32} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600">{card.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CAC Flagship */}
      <section className="py-20 bg-[#FFF4F0]">
        <div className="max-w-6xl mx-auto px-4">

          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Globe className="text-[#E5553C]" />
            CAC Flagship Conferences
          </h2>

          <p className="text-gray-700 mb-10">
            The Collaborative Action for Childcare (CAC) has curated flagship
            conferences that countries may convene to align national discussions
            with continental childcare priorities.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              "National Policy Conference on Early Childhood Care, Education and Development (ECCED)",
              "Annual Collaborative Action for Childcare Conference",
              "National Women in Childcare Conference",
            ].map((itemText, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex gap-3"
              >
                <BookOpen className="text-[#E5553C]" />
                <p className="text-gray-700">{itemText}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white rounded-2xl p-8 shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Requirements for Flagship Conferences
            </h3>
            <p className="text-gray-700">
              Convening agencies must sign a Memorandum of Understanding (MoU)
              with CAC and Uthabiti Africa to ensure quality standards,
              intellectual property protection, and alignment with continental
              childcare priorities.
            </p>
          </div>
        </div>
      </section>

      {/* Webinars */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">

          <h2 className="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-3">
            <Network className="text-[#E5553C]" />
            Webinar Preparatory Sessions
          </h2>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {[
              {
                title: "Theme Orientation",
                text: "Deep dives into forum themes and childcare system priorities.",
              },
              {
                title: "Interactive Engagement",
                text: "Collaborative discussions and Q&A sessions.",
              },
              {
                title: "Networking Opportunities",
                text: "Connect early with participants across Africa.",
              },
              {
                title: "Resource Sharing",
                text: "Access research, tools, and preparatory materials.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={item}
                className="border rounded-xl p-6 hover:shadow-lg transition"
              >
                <h4 className="font-semibold text-gray-900 mb-2">
                  {card.title}
                </h4>
                <p className="text-gray-600">{card.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#E5553C] text-white text-center">
        <div className="max-w-3xl mx-auto px-4">

          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
            Ready to Host a Pre-Conference Event?
          </h2>

          <p className="text-lg mb-10">
            Collaborate with partners across Africa and help build momentum
            toward ACFMombasa2026.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/contact"
              className="bg-white text-[#E5553C] font-semibold px-8 py-4 rounded-lg shadow hover:bg-[#FFECEA] transition flex items-center gap-2 justify-center"
            >
              Organize Country Events
              <ArrowRight size={18} />
            </a>

            <a
              href="/contact"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-[#E5553C] transition"
            >
              Partner on Flagship Conferences
            </a>
          </div>

        </div>
      </section>

    </main>
  );
}
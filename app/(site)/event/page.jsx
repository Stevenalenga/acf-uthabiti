"use client";

import { useState } from "react";
import { Calendar, MapPin, Users, Globe, Mic, ArrowRight } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function ACFKigali2025Page() {

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const images = [
    "/images/kigali-forum/forum1.jpg",
    "/images/kigali-forum/forum2.jpg",
    "/images/kigali-forum/forum10.jpg",
    "/images/kigali-forum/forum4.jpg",
    "/images/kigali-forum/forum5.jpg",
    "/images/kigali-forum/forum6.jpg",
    "/images/kigali-forum/forum7.jpg",
    "/images/kigali-forum/forum11.jpg",
    "/images/kigali-forum/forum12.jpg",
  ];

  return (
    <main className="bg-white">

      <section
        className="relative h-[70vh] flex items-center"
        style={{
          backgroundImage: "url('/images/kigali-forum/kigali-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative max-w-7xl mx-auto px-6 text-white">

          <span className="text-sm font-semibold tracking-wide uppercase text-[#FFB4A6]">
            Previous Forum
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold mt-3">
            Africa Childcare Forum Kigali 2025
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-gray-200">
            Africa’s first continental convening dedicated to advancing
            childcare as essential social infrastructure.
          </p>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-200">

            <div className="flex items-center gap-2">
              <Calendar />
              15 December 2025
            </div>

            <div className="flex items-center gap-2">
              <MapPin />
              Kigali, Rwanda
            </div>

            <div className="flex items-center gap-2">
              <Users />
              450 Participants
            </div>

          </div>

        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            About the Forum
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto">
            The Africa Childcare Forum Kigali 2025 marked a historic milestone
            as the first continental platform focused on advancing childcare
            systems in Africa. The Forum convened policymakers, practitioners,
            caregivers, researchers, and global partners to exchange knowledge,
            strengthen partnerships, and elevate African-led childcare solutions.
          </p>

        </div>
      </section>

      {/* STATISTICS */}
      <section className="bg-[#FFF4F0] py-20">
        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-3xl font-bold text-center mb-12">
            Forum at a Glance
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white p-8 rounded-xl text-center shadow">
              <Users className="mx-auto text-[#E5553C] mb-4" size={36}/>
              <p className="text-4xl font-bold">450+</p>
              <p className="text-gray-600">Participants</p>
            </div>

            <div className="bg-white p-8 rounded-xl text-center shadow">
              <Globe className="mx-auto text-[#E5553C] mb-4" size={36}/>
              <p className="text-4xl font-bold">30+</p>
              <p className="text-gray-600">Countries Represented</p>
            </div>

            <div className="bg-white p-8 rounded-xl text-center shadow">
              <Mic className="mx-auto text-[#E5553C] mb-4" size={36}/>
              <p className="text-4xl font-bold">70+</p>
              <p className="text-gray-600">Speakers</p>
            </div>

          </div>

        </div>
      </section>


      {/* REAL GALLERY */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-3xl font-bold text-center mb-14">
            Forum Gallery
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {images.map((src, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl cursor-pointer group"
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
              >
                <img
                  src={src}
                  className="w-full h-72 object-cover transition duration-500 group-hover:scale-110"
                  alt="Forum"
                />
              </div>
            ))}

          </div>

        </div>

        {/* LIGHTBOX */}
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={images.map((src) => ({ src }))}
        />
      </section>


      {/* KEY OUTCOMES */}
      <section className="bg-[#FFF4F0] py-20">
        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-3xl font-bold text-center mb-12">
            Key Outcomes
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {[
              {
                title: "Elevating Local Voices",
                text: "Caregivers and community leaders shaped childcare solutions.",
              },
              {
                title: "Policy Momentum",
                text: "Strengthened regional dialogue on childcare systems.",
              },
              {
                title: "Innovation Showcase",
                text: "Highlighted scalable African childcare models.",
              },
              {
                title: "Global Partnerships",
                text: "Built collaborations between African and global actors.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            ))}

          </div>

        </div>
      </section>


      {/* CONTINUATION */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold mb-6">
            From Kigali to Mombasa
          </h2>

          <p className="text-gray-600 mb-8">
            The momentum generated in Kigali continues at the Africa Childcare
            Forum Mombasa 2026.
          </p>

          <a
            href="/#register"
            className="inline-flex items-center gap-2 bg-[#E5553C] text-white px-8 py-4 rounded-lg hover:bg-[#cf4b35]"
          >
            Join ACFMombasa2026
            <ArrowRight size={18}/>
          </a>

        </div>
      </section>

    </main>
  );
}
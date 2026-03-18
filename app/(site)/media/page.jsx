"use client";

import { FileText, Newspaper, FolderDown, Download, Users } from "lucide-react";

export default function MediaResources() {

  const resources = [
    {
      title: "ACFKigali2025",
      description: "The Kigali Commitments on Early Childhood Care & Development",
      icon: Users,
      file: "documents/The-Kigali-Commitments.pdf" 
    },
    {
      title: "Concept Note",
      description:
        "Overview of the Africa Childcare Forum, including objectives, themes, and expected outcomes.",
      icon: FileText,
      file: "/documents/concept-note.pdf"
    },
    {
      title: "Sponsorship Prospectus",
      description:
        "Information for organizations interested in partnering or sponsoring ACFMombasa2026.",
      icon: FolderDown,
      file: "/documents/sponsorship-prospectus.pdf"
    },
    {
      title: "Press Releases",
      description:
        "Official announcements and media statements related to the forum.",
      icon: Newspaper,
      file: "/documents/press-releases.pdf"
    },
    {
      title: "Forum Reports",
      description:
        "Reports and summaries from previous Africa Childcare Forum events.",
      icon: FileText,
      file: "/documents/forum-reports.pdf"
    }
  ];

  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="bg-[#FFF4F0] py-20 pt-34">
        <div className="max-w-6xl mx-auto px-4 text-center">

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Media & Resources
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Access key materials related to the Africa Childcare Forum,
            including concept notes, sponsorship opportunities, press
            resources, and official reports.
          </p>

        </div>
      </section>


      {/* RESOURCES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {resources.map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="group border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition duration-300 hover:-translate-y-2"
                >

                  {/* Icon */}
                  <div className="w-12 h-12 flex items-center justify-center bg-[#FFF4F0] rounded-lg mb-4">
                    <Icon size={22} className="text-[#E5553C]" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-6">
                    {item.description}
                  </p>

                  {/* Download */}
                  <a
                    href={item.file}
                    download
                    className="inline-flex items-center gap-2 text-[#E5553C] font-semibold hover:underline"
                  >
                    <Download size={16} />
                    Download
                  </a>

                </div>
              );
            })}

          </div>

        </div>
      </section>

    </main>
  );
}
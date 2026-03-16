"use client";

import {
  Calendar,
  MapPin,
  Users,
  Mic,
  Lightbulb,
  Handshake,
  Globe,
  Briefcase,
  ArrowRight
} from "lucide-react";

export default function SessionsPage() {

  const themes = [
    "Investing in Childcare as Economic Infrastructure",
    "Strengthening Early Childhood Development Systems",
    "Professionalizing the Childcare Workforce",
    "Climate Change and Resilient Childcare Systems",
    "Private Sector Engagement in Childcare",
    "Community-Led Childcare Innovations",
    "Childcare Solutions for Informal Workers",
    "Financing Sustainable Childcare Systems",
    "Inclusive Childcare Systems"
  ];

  const whoShouldSubmit = [
    "Civil society organizations",
    "Research institutions and universities",
    "Government agencies",
    "International development organizations",
    "Private sector partners",
    "Social enterprises and innovators",
    "Community-based organizations"
  ];

  const proposalRequirements = [
    "Session title",
    "Session format (panel, workshop, dialogue, showcase)",
    "Brief description of the session (150–250 words)",
    "Key objectives and expected outcomes",
    "Proposed speakers or facilitators",
    "Organization(s) leading the session"
  ];

  const selectionCriteria = [
    "Relevance to the forum theme",
    "Innovation and practical insights",
    "Diversity of speakers and perspectives",
    "Potential impact on childcare systems in Africa",
    "Opportunities for participant engagement"
  ];

  const benefits = [
    "Visibility at a major continental forum",
    "Lead a knowledge-sharing session with sector leaders",
    "Networking with policymakers, donors, and experts",
    "Share successful childcare models and innovations"
  ];

  return (
    <main className="bg-white">

      {/* HERO */}
      <section
        className="relative h-[420px] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: "url('/images/session1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative max-w-4xl px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Call for Session Proposals
          </h1>

          <p className="text-lg text-gray-200">
            Africa Childcare Forum 2026 • Mombasa, Kenya
          </p>
        </div>
      </section>


      {/* INTRO */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <p className="text-lg text-gray-600 leading-relaxed">
            The Africa Childcare Forum 2026 invites organizations,
            researchers, practitioners, and institutions working in
            childcare, Early Childhood Development (ECD), gender equality,
            the care economy, and social development to submit session
            proposals for the upcoming forum.
          </p>

          <p className="text-gray-600 mt-6 leading-relaxed">
            Selected sessions will form part of the official programme
            and will bring together leaders, policymakers, practitioners,
            and partners committed to strengthening childcare services
            and support systems for families and communities across Africa.
          </p>

        </div>
      </section>


      {/* TIMELINE */}
      <section className="py-20 bg-[#FFF4F0]">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Session Proposal Timeline
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="bg-white p-8 rounded-xl shadow">
              <Calendar className="text-[#E5553C] mb-3 mx-auto" size={28}/>
              <h3 className="font-semibold text-lg">
                Submission Deadline
              </h3>
              <p className="text-gray-600 mt-2">
                30 May 2026
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow">
              <Calendar className="text-[#E5553C] mb-3 mx-auto" size={28}/>
              <h3 className="font-semibold text-lg">
                Selection Notification
              </h3>
              <p className="text-gray-600 mt-2">
                30 June 2026
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* WHO SHOULD SUBMIT */}
      <section className="py-24">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Who Should Submit
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {whoShouldSubmit.map((item,i)=>(
              <div
                key={i}
                className="border rounded-lg p-5 flex items-center gap-3"
              >
                <Users className="text-[#E5553C]" size={18}/>
                {item}
              </div>
            ))}

          </div>

          <p className="text-center text-gray-600 mt-8">
            Collaborative proposals involving multiple organizations
            or cross-sector partnerships are strongly encouraged.
          </p>

        </div>

      </section>


      {/* SESSION FORMATS */}
      <section className="py-24 bg-[#FFF4F0]">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Types of Sessions
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {[
              {
                icon: Handshake,
                title: "Partner-Led Sessions",
                text: "Organizations share programmes, research findings and policy insights."
              },
              {
                icon: Briefcase,
                title: "Interactive Workshops",
                text: "Hands-on learning sessions sharing tools and models for childcare services."
              },
              {
                icon: Globe,
                title: "Learning Exchanges",
                text: "Discussions where practitioners and policymakers exchange lessons."
              },
              {
                icon: Lightbulb,
                title: "Innovation Showcases",
                text: "Presentations highlighting new approaches and technologies."
              }
            ].map((item,i)=>{
              const Icon = item.icon;

              return(
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                >
                  <Icon className="text-[#E5553C] mb-4" size={28}/>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.text}</p>
                </div>
              )
            })}

          </div>

        </div>

      </section>


      {/* SESSION THEMES */}
      <section className="py-24">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-16">
            Session Themes
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {themes.map((theme,i)=>(
              <div
                key={i}
                className="border rounded-xl p-6 hover:shadow-md transition"
              >
                <Lightbulb className="text-[#E5553C] mb-3"/>
                {theme}
              </div>
            ))}

          </div>

        </div>

      </section>


      {/* PROPOSAL REQUIREMENTS */}
      <section className="py-24 bg-[#FFF4F0]">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-12">
            Proposal Requirements
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {proposalRequirements.map((item,i)=>(
              <div key={i} className="flex gap-3">
                <Lightbulb className="text-[#E5553C]" size={18}/>
                {item}
              </div>
            ))}

          </div>

        </div>

      </section>


      {/* SELECTION CRITERIA */}
      <section className="py-24">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold mb-12">
            Selection Criteria
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-left">

            {selectionCriteria.map((item,i)=>(
              <div
                key={i}
                className="border rounded-lg p-5"
              >
                {item}
              </div>
            ))}

          </div>

        </div>

      </section>


      {/* BENEFITS */}
      <section className="py-24 bg-[#FFF4F0]">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold mb-12">
            What Selected Partners Receive
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {benefits.map((item,i)=>(
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow"
              >
                {item}
              </div>
            ))}

          </div>

        </div>

      </section>


      {/* SUBMISSION OPTIONS */}
      <section className="py-24">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold mb-4">
            Submit Your Session Proposal
          </h2>

          <p className="text-gray-600 mb-12">
            Deadline: <strong>30 May 2026</strong>
          </p>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="border rounded-2xl p-8">
              <h3 className="font-semibold text-lg mb-4">
                Submit via Email
              </h3>

              <a
                href="mailto:ACF@uthabitiafrica.org"
                className="inline-flex items-center gap-2 bg-[#E5553C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cf4b35]"
              >
                Submit by Email
              </a>
            </div>

            <div className="border rounded-2xl p-8">
              <h3 className="font-semibold text-lg mb-4">
                Submit via Online Form
              </h3>

              <a
                href="/sessions/submit"
                className="inline-flex items-center gap-2 border px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
              >
                Open Submission Form
                <ArrowRight size={18}/>
              </a>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
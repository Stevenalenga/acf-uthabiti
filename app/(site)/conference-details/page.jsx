"use client";

export default function ConferenceDetailsPage() {
  return (
    <main className="bg-white">
      {/* Page Intro */}
      <section className="py-24 bg-[#FFF4F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Pre-Conference Engagements
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-700">
            In preparation for ACFMombasa2026, country partners and stakeholders across
            Africa are encouraged to convene national, sub-national, and thematic
            pre-conference engagements that surface local childcare priorities and
            strengthen collective readiness for the Forum.
          </p>
        </div>
      </section>

      {/* Preparing for the Forum */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Preparing for the Forum
          </h2>
          <p className="text-gray-700 leading-relaxed">
            In the lead-up to ACFMombasa2026, country partners are encouraged to organize
            pre-conference events that bring together diverse stakeholders to discuss
            childcare priorities, share evidence and lived experiences, and prepare for
            meaningful engagement at the Forum. These events provide platforms for
            national or sub-national dialogues, workshops, and roundtables that highlight
            country-specific challenges, innovations, and best practices.
          </p>
        </div>
      </section>

      {/* Country-Led Events */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Country-Led Pre-Conference Events
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border rounded-2xl p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                National & Sub-National Dialogues
              </h3>
              <p className="text-gray-600">
                Convenings that bring together government actors, civil society,
                caregivers, and practitioners to discuss policy priorities, system gaps,
                and locally grounded solutions for childcare.
              </p>
            </div>

            <div className="border rounded-2xl p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Workshops & Training Sessions
              </h3>
              <p className="text-gray-600">
                Skill-building and capacity development events focused on childcare
                workforce strengthening, policy implementation, financing, and service
                delivery improvement.
              </p>
            </div>

            <div className="border rounded-2xl p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Roundtables & Learning Exchanges
              </h3>
              <p className="text-gray-600">
                Small, interactive spaces for sharing evidence, showcasing innovations,
                discussing best practices, and exploring collaborative solutions to
                shared childcare challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CAC Flagship Conferences */}
      <section className="py-20 bg-[#FFF4F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            CAC Flagship Conferences
          </h2>

          <p className="text-gray-700 mb-8">
            The{" "}
            <span className="font-semibold">
              Collaborative Action for Childcare
            </span>{" "}
            (CAC) has curated a set of flagship conferences that countries may choose to
            convene collectively. These high-impact convenings bring together diverse
            stakeholders around critical childcare themes and are designed to ensure
            quality, coherence, and continental alignment.
          </p>

          <ul className="space-y-4 text-gray-700 list-disc list-inside">
            <li>National Policy Conference on Early Childhood Care, Education and Development (ECCED)</li>
            <li>Annual Collaborative Action for Childcare Conference</li>
            <li>National Women in Childcare Conference</li>
          </ul>

          {/* Requirements */}
          <div className="mt-10 bg-white rounded-2xl p-8 shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Requirements for Flagship Conferences
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To organize any CAC flagship conference and benefit from the expertise and
              intellectual property held by CAC and{" "}
              <span className="font-semibold">
                uthabiti Africa
              </span>
              , convening agencies are required to sign a Memorandum of Understanding (MoU).
              This ensures adherence to quality standards, appropriate recognition, and
              alignment with continental childcare priorities.
            </p>
          </div>
        </div>
      </section>

      {/* Webinar Preparatory Sessions */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Webinar Preparatory Sessions
          </h2>

          <p className="text-gray-700 mb-10">
            Leading up to ACFMombasa2026, webinar preparatory sessions will be hosted to
            help participants familiarize themselves with the Forum’s themes, goals,
            and expected outcomes. Country partners are encouraged to mobilize
            stakeholders and contribute perspectives from their national contexts.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Theme Orientation</h4>
              <p className="text-gray-600">
                Deep dives into Forum themes and how they connect to country-specific
                childcare systems and realities.
              </p>
            </div>

            <div className="border rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Interactive Engagement</h4>
              <p className="text-gray-600">
                Participatory discussions, Q&A sessions, and collaborative planning
                spaces that strengthen shared understanding and readiness.
              </p>
            </div>

            <div className="border rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Networking Opportunities</h4>
              <p className="text-gray-600">
                Early connection with participants and partners across Africa ahead of
                the in-person Forum.
              </p>
            </div>

            <div className="border rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Resource Sharing</h4>
              <p className="text-gray-600">
                Access to preparatory materials, research, and tools to maximize
                participation and impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#E5553C] text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
            Ready to Host a Pre-Conference Event?
          </h2>
          <p className="text-lg mb-10">
            Let’s collaborate to build momentum for ACFMombasa2026 and strengthen
            Africa’s childcare movement.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/contact"
              className="bg-white text-[#E5553C] font-semibold px-8 py-4 rounded-lg shadow hover:bg-[#FFECEA] transition"
            >
              Organize Country Events
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
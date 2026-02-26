"use client";

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden pt-32">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E5553C]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-96 h-96 bg-[#E5553C]/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
            <div className="text-center lg:text-left">
              <p className="inline-block mb-4 px-4 py-2 text-sm font-semibold text-[#E5553C] bg-[#FFECEA] rounded-full">
                AFRICA CHILDCARE FORUM 2026
              </p>
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight">
                Uniting for Care: <br />
                <span className="text-[#E5553C]">
                  Africa’s Call to the World
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                The Second Africa Childcare Forum (ACFMombasa2026) is a continental and
                global co-learning platform accelerating quality, affordable, and
                inclusive childcare systems across Africa.
              </p>

              <div className="mt-4 text-gray-700 font-medium">
                📍 PrideInn Paradise Hotel &nbsp;|&nbsp; 📅 16 – 18 September 2026
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="#register"
                  className="inline-flex items-center justify-center bg-[#E5553C] text-white font-semibold px-8 py-4 rounded-lg shadow hover:bg-[#cc4a35] transition"
                >
                  Register Now
                </a>

                <a
                  href="#about"
                  className="inline-flex items-center justify-center border-2 border-[#E5553C] text-[#E5553C] font-semibold px-8 py-4 rounded-lg hover:bg-[#FFECEA] transition"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Visual Element */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 rounded-full bg-[#E5553C]/20"></div>
                <div className="absolute inset-6 rounded-full bg-[#E5553C]/30"></div>
                <div className="absolute inset-12 rounded-full bg-white border border-[#E5553C]/20 shadow-xl flex items-center justify-center text-center px-6">
                  <div>
                    <p className="text-3xl font-extrabold text-[#E5553C]">ACF</p>
                    <p className="mt-2 text-gray-600 font-medium">
                      Mombasa 2026
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E5553C]">
              About the Event
            </h2>
            <p className="mt-4 text-gray-700 text-lg sm:text-xl">
              The Second Africa Childcare Forum (ACFMombasa2026) builds on the momentum from ACFKigali2025,
              creating a continental and global co-learning platform to accelerate quality, affordable, 
              and inclusive childcare systems across Africa.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-[#FFECEA] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold text-[#E5553C] mb-2">
                Centering Communities
              </h3>
              <p className="text-gray-800">
                We amplify local voices, prioritize informal caregivers, and highlight culturally grounded solutions.
              </p>
            </div>

            <div className="bg-[#FFECEA] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold text-[#E5553C] mb-2">
                Transform Policy & Systems
              </h3>
              <p className="text-gray-800">
                Driving policy reforms to establish childcare as essential social infrastructure for all children.
              </p>
            </div>

            <div className="bg-[#FFECEA] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold text-[#E5553C] mb-2">
                Showcase African Innovation
              </h3>
              <p className="text-gray-800">
                Highlighting scalable, locally led approaches—from community models to digital solutions.
              </p>
            </div>

            <div className="bg-[#FFECEA] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold text-[#E5553C] mb-2">
                Ignite Global Collaboration
              </h3>
              <p className="text-gray-800">
                A platform for sharing knowledge where African experiences inform global strategies and partnerships.
              </p>
            </div>

            <div className="bg-[#FFECEA] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold text-[#E5553C] mb-2">
                Mutual Learning
              </h3>
              <p className="text-gray-800">
                Co-learning and unlearning platform that turns local insights into global solutions for childcare.
              </p>
            </div>

            <div className="bg-[#FFECEA] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold text-[#E5553C] mb-2">
                Shared Responsibility
              </h3>
              <p className="text-gray-800">
                Advancing the idea that quality childcare is a collective societal responsibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pre Conference Section */}
      <section id="preconference" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-wide text-[#E5553C] uppercase">
              Before the Main Event
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Pre-Conference Activities
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Engage with focused workshops, networking sessions, and preparatory
              discussions designed to maximize your experience at ACFMombasa2026.
              These activities help participants explore key childcare challenges and
              innovative solutions before the main forum.
            </p>
          </div>

          {/* Pre-Conference Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#FFF4F0] rounded-2xl p-6 shadow hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Orientation Workshops</h3>
              <p className="text-gray-600">
                Hands-on sessions to prepare participants for in-depth discussions at
                the forum. Learn practical tools and approaches to improve childcare.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FFF4F0] rounded-2xl p-6 shadow hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Networking Events</h3>
              <p className="text-gray-600">
                Connect with fellow caregivers, policymakers, NGOs, and global
                partners to share insights, experiences, and build meaningful
                collaborations.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FFF4F0] rounded-2xl p-6 shadow hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Focus Group Discussions</h3>
              <p className="text-gray-600">
                Small, interactive sessions on pressing childcare topics. Engage with
                experts and peers to co-create solutions before the main forum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E5553C]">
                Our Mission
              </h2>
              <p className="mt-6 text-gray-700 text-lg sm:text-xl">
                ACFMombasa2026 is Africa’s call to the world to unite for care. It is a bold, collective effort
                to ensure every child has access to quality, affordable childcare and every caregiver is supported,
                while inviting global partners to learn, share, and act together.
              </p>

              <p className="mt-4 text-gray-700 text-lg sm:text-xl">
                The Forum amplifies local voices, centers lived experiences, and advances solutions that are inclusive,
                culturally grounded, and gender-responsive.
              </p>
              <ul className="mt-6 space-y-4 list-disc list-inside text-gray-800 text-lg">
                <li>Shift power and visibility to local actors and communities</li>
                <li>Drive policy reforms that position childcare as essential social infrastructure</li>
                <li>Showcase African-led innovations that reflect diverse realities</li>
                <li>Strengthen accountability to turn global commitments into tangible local and national action</li>
              </ul>

              <p className="mt-6 text-gray-700 text-lg sm:text-xl">
                More than a conference, ACFMombasa2026 is a co-sharing, co-learning and unlearning platform where
                African experiences inform global solutions, and global collaboration accelerates change. Together, we
                can reimagine care as a shared responsibility that builds resilient, equitable societies on the continent
                and across the world.
              </p>
            </div>
            <div className="mt-12 lg:mt-0 lg:w-1/2 flex justify-center">
              <img
                src="/images/mission-image.jpg"
                alt="Africa Childcare Mission"
                className="rounded-xl shadow-2xl w-full max-w-md object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section id="objectives" className="bg-[#FFF4F0] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E5553C]">
              Our Objectives
            </h2>
            <p className="mt-4 text-gray-700 text-lg sm:text-xl">
              ACFMombasa2026 is Africa’s call to the world to unite for care. To drive meaningful change, the Forum aims to:
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-start">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E5553C] text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#E5553C] mb-2">Elevate Local Voices</h3>
              <p className="text-gray-800">
                Center caregivers, communities, and African innovators as leaders in shaping culturally grounded, inclusive, and gender-responsive childcare solutions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-start">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E5553C] text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#E5553C] mb-2">Transform Policy & Systems</h3>
              <p className="text-gray-800">
                Advocate for childcare as essential social infrastructure, advancing policies, financing, and frameworks that make quality care accessible to all.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-start">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E5553C] text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#E5553C] mb-2">Showcase African Innovation</h3>
              <p className="text-gray-800">
                Highlight scalable, locally led approaches—from community models to digital solutions—that reflect Africa’s diverse realities and inspire global adaptation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-start">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E5553C] text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#E5553C] mb-2">Ignite Global Collaboration</h3>
              <p className="text-gray-800">
                Create a co-sharing platform where African experiences inform worldwide strategies, and international partnerships accelerate action, accountability, and sustainable impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Sponsors Section */}
      <section id="sponsors" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Intro */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-wide text-[#E5553C] uppercase">
              Our Valued Partner
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Sponsors
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              We are proud to be convened by Collaborative Action for Childcare, 
              whose commitment to quality and inclusive childcare across Africa 
              makes ACFMombasa2026 possible.
            </p>
          </div>

          {/* Sponsor Card */}
          <div className="flex justify-center">
            <a
              href="https://cac.uthabitiafrica.org"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition transform hover:scale-105"
            >
              <img
                src="/images/cac-logos.png"
                alt="Collaborative Action for Childcare"
                className="h-32 w-auto mx-auto object-contain"
              />
              <p className="mt-4 text-center text-gray-700 font-medium">
                Learn more about our convening partner
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Sessions Section */}
      <section id="sessions" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Intro */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-wide text-[#E5553C] uppercase">
              Key Forum Activities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Forum Sessions
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              ACFMombasa2026 offers a variety of engaging sessions designed to
              share knowledge, build skills, and foster collaboration among childcare
              professionals, caregivers, policymakers, and global partners.
            </p>
          </div>

          {/* Session Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-[#FFF4F0] rounded-2xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Inspiring Keynotes</h3>
              <p className="text-gray-600">
                Hear from world-renowned experts and leaders in childcare and
                education, sharing insights and strategies for impactful change.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FFF4F0] rounded-2xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Workshops</h3>
              <p className="text-gray-600">
                Participate in hands-on sessions designed to equip you with practical
                tools and techniques for effective childcare solutions.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FFF4F0] rounded-2xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Networking Opportunities</h3>
              <p className="text-gray-600">
                Connect with like-minded professionals and organizations committed
                to advancing childcare initiatives across Africa.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#FFF4F0] rounded-2xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">High-Level Paper Presentations</h3>
              <p className="text-gray-600">
                Share groundbreaking research and policy insights that inform
                childcare strategies, strengthen systems, and inspire action across Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Highlights Section */}
      <section id="highlights" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E5553C]">
              Event Highlights
            </h2>
            <p className="mt-4 text-gray-700 text-lg sm:text-xl">
              Join ACFMombasa2026 to engage with inspiring leaders, hands-on workshops, and transformative learning opportunities.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Inspiring Keynotes */}
            <div className="bg-[#FFECEA] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 cursor-pointer">
              <div className="text-[#E5553C] text-3xl mb-4"></div>
              <h3 className="text-xl font-bold text-[#E5553C] mb-2">Inspiring Keynotes</h3>
              <p className="text-gray-800">
                Hear from world-renowned experts and leaders in childcare and education, sharing insights and strategies for impactful change.
              </p>
            </div>

            {/* Card 2: Interactive Workshops */}
            <div className="bg-[#FFECEA] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 cursor-pointer">
              <div className="text-[#E5553C] text-3xl mb-4"></div>
              <h3 className="text-xl font-bold text-[#E5553C] mb-2">Interactive Workshops</h3>
              <p className="text-gray-800">
                Participate in hands-on sessions designed to equip you with practical tools and techniques for effective childcare solutions.
              </p>
            </div>

            {/* Card 3: Networking Opportunities */}
            <div className="bg-[#FFECEA] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 cursor-pointer">
              <div className="text-[#E5553C] text-3xl mb-4"></div>
              <h3 className="text-xl font-bold text-[#E5553C] mb-2">Networking Opportunities</h3>
              <p className="text-gray-800">
                Connect with like-minded professionals and organizations committed to advancing childcare initiatives across Africa.
              </p>
            </div>

            {/* Card 4: High-Level Paper Presentations */}
            <div className="bg-[#FFECEA] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 cursor-pointer">
              <div className="text-[#E5553C] text-3xl mb-4"></div>
              <h3 className="text-xl font-bold text-[#E5553C] mb-2">High-Level Paper Presentations</h3>
              <p className="text-gray-800">
                Share groundbreaking research and policy insights that inform childcare strategies, strengthen systems, and inspire action across Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibitions Section */}
      <section id="exhibitions" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Intro */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-semibold tracking-wide text-[#E5553C] uppercase">
                Explore Innovations
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
                Exhibitions
              </h2>
              <p className="mt-4 text-gray-600 text-lg">
                Discover innovative products, services, and solutions transforming the
                childcare and education landscape across Africa. Engage with exhibitors,
                learn about best practices, and explore new opportunities for collaboration.
              </p>
            </div>

            {/* Exhibition Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-[#FFF4F0] rounded-2xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Childcare Technology</h3>
                <p className="text-gray-600">
                  Innovative digital solutions, apps, and tools to improve childcare
                  management and learning experiences for children and caregivers.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#FFF4F0] rounded-2xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Educational Products</h3>
                <p className="text-gray-600">
                  Exhibiting high-quality educational materials, toys, and learning
                  resources that support early childhood development.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#FFF4F0] rounded-2xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Care & Support Services</h3>
                <p className="text-gray-600">
                  Organizations providing innovative childcare services, community
                  support, and inclusive programs for families and caregivers.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-[#FFF4F0] rounded-2xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">NGO Initiatives</h3>
                <p className="text-gray-600">
                  Showcasing impactful programs and projects by NGOs that advance
                  childcare justice, equity, and quality across the continent.
                </p>
              </div>

              {/* Card 5 */}
              <div className="bg-[#FFF4F0] rounded-2xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Policy & Research</h3>
                <p className="text-gray-600">
                  Learn about evidence-based research, policy frameworks, and
                  innovations shaping childcare systems across Africa and beyond.
                </p>
              </div>

              {/* Card 6 */}
              <div className="bg-[#FFF4F0] rounded-2xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Community Projects</h3>
                <p className="text-gray-600">
                  Explore locally-led initiatives and community-based programs
                  improving childcare access, inclusion, and quality.
                </p>
              </div>
            </div>
          </div>
      </section>

      {/* Register Section */}
      <section id="register" className="bg-[#E5553C] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div className="lg:w-1/2 text-white">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                Join us at ACFMombasa2026
              </h2>
              <p className="mb-6 text-lg sm:text-xl">
                Click below to register and be part of Africa’s leading childcare forum.
              </p>
              <a
                href="/event-register"
                className="inline-block bg-white text-[#E5553C] font-semibold py-4 px-8 rounded-lg shadow-lg hover:bg-[#FFECEA] transition-colors"
              >
                Register Now
              </a>

              <div className="mt-10 space-y-5 text-left">
                <div className="flex items-start gap-4">
                  <span className="bg-white/20 p-2 rounded-full">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h2l3 7-2 1a11 11 0 005 5l1-2 7 3v2a2 2 0 01-2 2A16 16 0 013 5z" />
                    </svg>
                  </span>
                  <span>
                    <strong>Phone / WhatsApp:</strong><br />
                    (+254) 714-262-626
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="bg-white/20 p-2 rounded-full">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span>
                    <strong>Email:</strong><br />
                    cac@uthabitiafrica.org
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="bg-white/20 p-2 rounded-full">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.1 0 2-.9 2-2a2 2 0 10-4 0c0 1.1.9 2 2 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z" />
                    </svg>
                  </span>
                  <span>
                    <strong>Address:</strong><br />
                    Africa Childcare Forum c/o Collaborative Action for Childcare<br />
                    Office #1, Overbay Apartments, OV1 Junction of Rhapta & Church Road,<br />
                    Westlands, Nairobi
                  </span>
                </div>

              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:w-1/2 flex justify-center lg:justify-end">
              <a
                href="https://acf.uthabitiafrica.org"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center transition-transform transform hover:-translate-y-2"
              >
                <img
                  src="/images/cac-logos.png"
                  alt="Convener Logo"
                  className="h-32 sm:h-40 object-contain mb-4"
                />
                <p className="text-[#E5553C] font-semibold text-center">
                  Learn more about our convener →
                </p>
              </a>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
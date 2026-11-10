"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FEES,
  PHASE_WINDOWS,
} from "@/lib/documents/constants";
import {
  MapPin,
  Calendar,
  Users,
  Landmark,
  HandCoins,
  GraduationCap,
  ShieldCheck,
  HeartHandshake,
  Building2,
  MonitorSmartphone,
  Globe,
  Briefcase,
  Handshake,
  Target,
  ArrowRight,
} from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const themes = [
  {
    icon: HandCoins,
    title: "Financing Africa’s Childcare Future",
    text: "Mobilising public finance, private capital and development investment through government budgets, development finance, philanthropy, employer contributions and innovative financing.",
    areas: [
      "Improve domestic public expenditure on childcare.",
      "Explore blended finance, targeted subsidies and context-appropriate mechanisms.",
      "Coordinate governments, development partners, investors and philanthropies.",
      "Identify financing gaps and develop investment cases for resource mobilisation.",
    ],
    outcome: "A clearer understanding of financing gaps, viable funding mechanisms and coordinated investment opportunities at local and international levels.",
  },
  {
    icon: HeartHandshake,
    title: "Affordable Childcare Access",
    text: "Expand quality childcare for underserved families through scalable models that respond to different incomes and working arrangements.",
    areas: [
      "Expand community-based, home-based, public and private services.",
      "Improve access for informal-sector workers and low-income households.",
      "Explore subsidies, vouchers and other affordability mechanisms.",
      "Balance affordability for families with provider sustainability.",
    ],
    outcome: "Investment opportunities and scalable models for affordable childcare, particularly for underserved populations.",
  },
  {
    icon: Building2,
    title: "Childcare as Economic Infrastructure",
    text: "Position childcare as an economic enabler of employment, productivity, enterprise and inclusive growth.",
    areas: [
      "Examine the economic cost of inadequate childcare.",
      "Develop employer-supported and workplace childcare partnerships.",
      "Address the needs of women in informal employment and small businesses.",
      "Build evidence and investment cases for childcare’s economic value.",
    ],
    outcome: "Stronger engagement with finance ministries, employers and economic policymakers on childcare as productive infrastructure.",
  },
  {
    icon: Briefcase,
    title: "Childcare Enterprises and Innovation",
    text: "Unlock appropriate capital and business support for childcare providers, including women-led and small-scale enterprises.",
    areas: [
      "Improve access to affordable credit, grants and fit-for-purpose finance.",
      "Support business development, financial management and entrepreneurship.",
      "Invest in infrastructure, equipment, digital systems and operations.",
      "Develop public-private partnerships and innovative delivery models.",
    ],
    outcome: "Practical financing approaches and partnerships to help viable childcare enterprises grow and create jobs.",
  },
  {
    icon: GraduationCap,
    title: "Investing in the Childcare Workforce",
    text: "Build a skilled, recognised and sustainable workforce through training, professional development and decent working conditions.",
    areas: [
      "Expand competency-based caregiver training and certification.",
      "Recognise prior learning and establish professional pathways.",
      "Finance training for community- and home-based caregivers.",
      "Improve remuneration, working conditions and workforce retention.",
    ],
    outcome: "Investment opportunities for caregiver training, professional recognition and sustainable workforce development.",
  },
  {
    icon: Users,
    title: "Investing in Two Generations: Adolescent and Young Mothers",
    text: "Finance integrated, age-appropriate childcare pathways that help young mothers continue education, develop livelihoods and support their children.",
    areas: [
      "Link childcare with schools, vocational training and second-chance education.",
      "Connect childcare to livelihoods, apprenticeships and entrepreneurship.",
      "Coordinate childcare with health, nutrition, parenting and social protection.",
      "Involve young mothers in designing and evaluating solutions, with safeguarding and non-discrimination.",
    ],
    outcome: "An investment framework for integrated childcare, education continuation and livelihood support for young mothers and their children.",
  },
  {
    icon: ShieldCheck,
    title: "Quality, Safety and Sustainable Systems",
    text: "Ensure investment expands access while safeguarding children and maintaining developmentally appropriate, sustainable services.",
    areas: [
      "Finance implementation of childcare standards, registration and licensing.",
      "Strengthen safeguarding, supportive supervision and accountability.",
      "Invest in suitable infrastructure, sanitation, nutrition and learning materials.",
      "Develop data systems for access, affordability, quality and outcomes.",
    ],
    outcome: "Ways to finance quality assurance and safeguarding without creating unnecessary barriers for families or responsible providers.",
  },
  {
    icon: MonitorSmartphone,
    title: "Measuring Returns and Mobilising Investment at Scale",
    text: "Build the evidence and accountability needed to attract sustained investment and scale promising childcare solutions.",
    areas: [
      "Assess childcare’s effects on employment, productivity, households and child development.",
      "Identify models for piloting, evaluation and scale.",
      "Develop investment pipelines and proposals for funders.",
      "Set measurable targets, reporting and accountability arrangements.",
    ],
    outcome: "An evidence-informed African Childcare Investment Agenda with priority investments, potential partners and measurable commitments.",
  },
];

const objectives = [
  "Identify and prioritise high-value investment opportunities across Africa’s childcare ecosystem.",
  "Strengthen engagement between governments, financial institutions, employers, investors, philanthropies and development partners on childcare financing.",
  "Explore sustainable financing mechanisms for childcare access, provider growth, workforce development and quality assurance.",
  "Promote childcare as an investment that supports employment, productivity, women’s economic participation and children’s development.",
  "Advance investment models that enable adolescent and young mothers to continue education, develop livelihoods and access quality childcare.",
  "Develop practical investment cases, partnerships and financing proposals adaptable to different African country contexts.",
  "Establish a basis for an African Childcare Investment Agenda with measurable priorities, potential financing partners and progress tracking.",
];

const audiences = [
  { icon: Landmark, title: "Governments", text: "Leaders responsible for childcare policy, public finance, planning, ECD, education, gender, labour, health, social protection and local government." },
  { icon: Globe, title: "Regional institutions", text: "African Union and regional bodies shaping continental childcare and financing agendas." },
  { icon: Handshake, title: "Development partners", text: "International agencies, philanthropic organisations and funders ready to move from recognition to investment." },
  { icon: HandCoins, title: "Investors & finance", text: "Public and private investors, financial institutions and impact investors." },
  { icon: Briefcase, title: "Employers", text: "Business associations and employers interested in workplace childcare." },
  { icon: Users, title: "Adolescent and young mothers", text: "Young mothers seeking childcare that enables education, skills development, livelihoods and participation in economic life, with age-appropriate safeguarding." },
  { icon: Users, title: "Providers & networks", text: "Childcare providers, caregiver networks, social enterprises, training institutions, researchers and civil society — including parent, women’s and disability organisations." },
];

const outcomes = [
  "Stronger engagement among African governments, investors, employers and development partners on childcare investment.",
  "Improved understanding of financing gaps and opportunities across the childcare ecosystem.",
  "Greater visibility for scalable childcare delivery and enterprise models.",
  "Increased attention to caregiver workforce investment and professional development.",
  "Dedicated investment pathways for adolescent and young mothers and their children.",
  "Stronger consideration of childcare within economic development, public finance and employment agendas.",
  "Greater alignment around practical investment priorities and accountability.",
];

const crossCuttingPriorities = [
  "Equity and inclusion: prioritise families facing the greatest barriers to childcare access.",
  "Gender equality: recognise the relationship between childcare, women’s economic participation and shared caregiving.",
  "Child development and protection: ensure investments support children’s safety, well-being and development.",
  "Country ownership: adapt approaches to national policies, institutions and economic realities.",
  "Evidence and accountability: connect financing with transparent objectives and measurable results.",
  "Sustainability: promote financing and delivery models that continue beyond individual projects or funding cycles.",
];

const deliverables = [
  {
    title: "African Childcare Investment Agenda",
    text: "A practical framework identifying priority investment areas, financing opportunities, potential partners and recommended actions.",
  },
  {
    title: "Investment Opportunity Portfolio",
    text: "Selected investment concepts or proposals for further development by participating governments, providers and partners.",
  },
  {
    title: "Adolescent and Young Mothers Investment Framework",
    text: "A proposed model for financing integrated childcare, education continuation and livelihood support, informed by evidence and country contexts.",
  },
  {
    title: "Financing and Partnership Commitments",
    text: "Documented expressions of interest, partnership opportunities and voluntarily agreed financing or implementation commitments.",
  },
  {
    title: "Follow-Up and Accountability Framework",
    text: "A proposed mechanism for tracking progress on agreed actions, investment mobilisation and implementation.",
  },
];

const partnershipRoles = [
  {
    title: "Government of Uganda · proposed host",
    text: "Provide political leadership; convene ministries and public institutions; mobilise African governments and regional bodies; showcase national priorities; engage public finance and investment institutions; and help agree Forum outcomes.",
  },
  {
    title: "Collaborative Action for Childcare · proposed co-host",
    text: "Coordinate the pan-African ACF Steering Committee; mobilise non-state stakeholders; support provider, caregiver, employer, civil society, academic and community participation; develop the programme and knowledge exchange; and advance the African Childcare Investment Agenda.",
  },
  {
    title: "Uthabiti Africa Advisory Services Ltd · institutional and technical support",
    text: "Support government coordination and preparation; provide technical input on childcare systems, investment and workforce priorities; facilitate engagement and partnerships; and support investment cases, communications and follow-up.",
  },
];

const registrationTypes = [
  { key: "student", label: "Student" },
  { key: "eastAfrica", label: "East Africa" },
  { key: "other", label: "International" },
];

export default function ACFUganda2027Page() {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = Date.parse("2027-05-17T00:00:00+03:00") - Date.now();
      const totalSeconds = Math.max(0, Math.floor(remaining / 1000));

      setCountdown({
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-white text-gray-900">
      <section
        className="relative min-h-[78vh] flex items-center pt-28 overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(14,60,28,0.92), rgba(11,39,22,0.8), rgba(250,180,74,0.58)), url('/uganda2027/uganda.png')",
          backgroundSize: "cover, 420px 420px",
          backgroundPosition: "center, center right 8%",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_40%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 text-white">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-5 sm:gap-8">
            <img
              src="/uganda2027/uganda.png"
              alt="Uganda government emblem"
              className="h-32 w-32 rounded-full border-2 border-white/30 bg-white/10 p-2 shadow-lg sm:h-36 sm:w-36"
            />
            <img
              src="/uganda2027/acf-uganda-logo-white.png"
              alt="Africa Childcare Forum Uganda 2027 logo"
              className="h-28 w-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)] sm:h-36"
            />
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight max-w-4xl">
            Africa Childcare Forum
            <span className="block text-[#FFB4A6]">Uganda 2027</span>
          </h1>

          <p className="mt-6 text-xl sm:text-2xl font-semibold max-w-3xl">
            The Africa Promise: Financing Africa’s Childcare Future
          </p>

          <p className="mt-4 text-base sm:text-lg text-gray-200 max-w-2xl">
            Government-led. Ecosystem-designed. Evidence-driven. Locally owned.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm sm:text-base text-gray-200">
            <span className="inline-flex items-center gap-2">
              <MapPin size={18} className="text-[#E5553C]" />
              Speke Resort Munyonyo, Kampala, Uganda
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar size={18} className="text-[#E5553C]" />
              May 17–21, 2027 · 5 days
            </span>
            <span className="inline-flex items-center gap-2">
              <Users size={18} className="text-[#E5553C]" />
              ~250 local + 250 international delegates
            </span>
          </div>
          {countdown && (
            <div
              className="mt-7 inline-flex flex-col gap-2 rounded-xl border border-white/20 bg-black/20 px-5 py-4 backdrop-blur-sm"
              aria-label="Countdown to the Africa Childcare Forum Uganda 2027"
            >
              <span className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Countdown to the Forum
              </span>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-center">
                {Object.entries(countdown).map(([unit, value]) => (
                  <span key={unit} className="min-w-12">
                    <span className="block text-2xl font-bold tabular-nums sm:text-3xl">
                      {value}
                    </span>
                    <span className="text-xs capitalize text-white/75">{unit}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          <a
            href="/event-register"
            className="mt-8 inline-flex rounded-lg bg-[#E5553C] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#cc4a35]"
          >
            Register for Uganda 2027
          </a>
        </div>
      </section>

      <section id="pricing" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Registration fees
            </h2>
            <p className="mt-3 text-gray-600">
              Early Bird registration: {PHASE_WINDOWS.EarlyBird.label.replace("Early Bird: ", "")}
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#FFE3DF] shadow-sm">
            <table className="w-full min-w-[560px] text-left">
              <thead className="bg-[#FFF4F0]">
                <tr>
                  <th className="px-5 py-4 font-semibold text-gray-900">Registration phase</th>
                  {registrationTypes.map((type) => (
                    <th key={type.key} className="px-5 py-4 text-right font-semibold text-gray-900">
                      {type.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(PHASE_WINDOWS).map(([phase, window]) => (
                  <tr key={phase} className="border-t border-gray-100">
                    <th className="px-5 py-4 font-medium text-gray-700">{window.label}</th>
                    {registrationTypes.map((type) => (
                      <td key={type.key} className="px-5 py-4 text-right tabular-nums text-gray-900">
                        ${FEES[phase][type.key]} USD
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-[#FFF4F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { value: "500", label: "Target delegates", sub: "Local and international" },
              { value: "8", label: "Investment themes", sub: "From access to finance" },
              { value: "0–47", label: "Months of age", sub: "Priority focus for childcare" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#FFE3DF]">
                <p className="text-4xl font-extrabold text-[#E5553C]">{stat.value}</p>
                <p className="mt-2 font-semibold text-gray-900">{stat.label}</p>
                <p className="text-sm text-gray-500">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="background" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Background and rationale
            </h2>
            <div className="mt-8 space-y-5 text-gray-700 text-lg leading-relaxed">
              <p>
                Childcare is essential social and economic infrastructure: it supports children’s development, enables parents to participate in the economy, creates employment and strengthens family well-being. Yet millions of families across Africa still struggle to access affordable, safe and quality childcare.
              </p>
              <p>
                Investment remains insufficient, fragmented and uneven. Many providers have limited access to finance, appropriate infrastructure, professional training and business support, while families on low incomes and those working in the informal economy struggle to afford reliable services. Governments, employers, investors and development partners can work together on financing models that expand access and improve quality.
              </p>
              <p>
                Following the first Forum in Kigali and the second in Mombasa, the third Forum in Uganda will advance the conversation from identifying challenges to mobilising investment, financing sustainable solutions and demonstrating childcare’s economic and social value. ACFUganda2027 is part of CAC’s planned annual convenings towards quality, affordable childcare for all across the continent by 2035.
              </p>
              <p>
                The Forum will identify high-value investment opportunities, how they can be financed and practical commitments that can be implemented and scaled. It will give dedicated attention to childcare as an investment in two generations: children, and adolescent and young mothers who need childcare to continue education, develop livelihoods and participate in economic life.
              </p>
              <p>
                Uganda’s proposed hosting offers an opportunity to demonstrate national leadership, showcase its experience and priorities, and contribute to a shared African agenda for sustainable childcare investment.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="objectives" className="py-24 bg-[#FFF4F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-start gap-3 mb-4">
            <Target className="text-[#E5553C] mt-1 shrink-0" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Overall goal
            </h2>
          </div>
          <p className="text-xl text-gray-800 max-w-4xl leading-relaxed">
          To mobilise public, private and development finance for accessible, affordable, quality and sustainable childcare systems across Africa, recognising childcare as essential social and economic infrastructure.
          </p>

          <h3 className="mt-14 text-2xl font-bold text-gray-900">Specific objectives</h3>
          <ol className="mt-8 space-y-4">
            {objectives.map((text, i) => (
              <li key={i} className="flex gap-4 bg-white rounded-xl p-5 shadow-sm border border-[#FFE3DF]">
                <span className="shrink-0 w-9 h-9 rounded-full bg-[#E5553C] text-white font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-gray-700 leading-relaxed pt-1">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="themes" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
            Proposed themes
          </h2>
          <p className="mt-4 text-gray-600 text-center max-w-3xl mx-auto">
            Eight interconnected investment themes, focused on financing requirements, investors, implementers, expected returns and opportunities to scale.
          </p>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <motion.div key={theme.title} variants={item} whileHover={{ y: -8 }} className="border border-[#FFE3DF] rounded-2xl p-8 hover:shadow-xl transition bg-white">
                  <Icon className="text-[#E5553C] mb-4" size={32} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{theme.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{theme.text}</p>
                  <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600">
                    {theme.areas.map((area) => <li key={area}>{area}</li>)}
                  </ul>
                  <p className="mt-5 border-t border-[#FFE3DF] pt-4 text-sm leading-relaxed text-gray-700">
                    <strong>Desired outcome:</strong> {theme.outcome}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="bg-[#FFF4F0] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Cross-cutting priorities
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {crossCuttingPriorities.map((priority) => (
              <p key={priority} className="rounded-xl border border-[#FFE3DF] bg-white p-5 leading-relaxed text-gray-700">
                {priority}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="audience" className="py-24 bg-[#FFF4F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
            Primary audience and participants
          </h2>
          <p className="mt-4 text-gray-700 text-center max-w-3xl mx-auto">
            Finance ministries, planning authorities, financial institutions and investors are particularly important so discussions move from recognising childcare’s importance to identifying how it can be financed.
          </p>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiences.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title} className="bg-white rounded-2xl p-7 border border-[#FFE3DF] shadow-sm">
                  <Icon className="text-[#E5553C] mb-3" size={28} />
                  <h3 className="font-semibold text-gray-900 text-lg">{a.title}</h3>
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed">{a.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="outcomes" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10">
            Expected outcomes
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {outcomes.map((text, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-[#FFE3DF] hover:bg-[#FFF4F0] transition">
                <span className="text-[#E5553C] font-extrabold text-lg shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-gray-700 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="format" className="py-24 bg-[#FFF4F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Forum format
          </h2>
          <div className="mt-8 space-y-5 text-gray-700 text-lg leading-relaxed">
            <p>
              From May 17–21, 2027, the five-day Forum at Speke Resort Munyonyo will bring together government dialogue, financing and investment discussions, thematic sessions, country showcases, enterprise presentations, technical workshops and partnership roundtables.
            </p>
            <p>
              The programme will connect investment opportunities with financing requirements, potential investors and implementers, expected returns, and opportunities to scale. Its scope and final hosting arrangements will be agreed by the partners during planning.
            </p>
            <p>
              The Forum will distinguish between financing the event itself and mobilising capital for childcare programmes and enterprises beyond the event.
            </p>
          </div>
        </div>
      </section>

      <section id="partnerships" className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Proposed hosting and partnership arrangements
          </h2>
          <p className="mt-4 max-w-4xl leading-relaxed text-gray-600">
            ACFUganda2027 is proposed as a government-led, CAC-co-hosted continental Forum with institutional and technical support from Uthabiti Africa.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {partnershipRoles.map((role) => (
              <article key={role.title} className="rounded-2xl border border-[#FFE3DF] bg-white p-7 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900">{role.title}</h3>
                <p className="mt-3 leading-relaxed text-gray-600">{role.text}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-gray-500">
            The final hosting arrangement, governance structure, roles, financial responsibilities and decision-making procedures will be agreed jointly. CAC will work with relevant Ugandan stakeholders, including the ECD Network for Uganda, as appropriate.
          </p>
        </div>
      </section>

      <section id="deliverables" className="bg-[#FFF4F0] py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Proposed deliverables
          </h2>
          <p className="mt-4 max-w-4xl text-gray-600">
            The Forum will seek practical outputs that connect policy commitments and investment opportunities with implementation and measurable progress.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {deliverables.map((deliverable, index) => (
              <article key={deliverable.title} className="flex gap-4 rounded-xl border border-[#FFE3DF] bg-white p-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5553C] font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">{deliverable.title}</h3>
                  <p className="mt-2 leading-relaxed text-gray-600">{deliverable.text}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-sm text-gray-500">
            The scope and feasibility of these deliverables will be agreed during the planning phase.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Resource mobilisation and implementation
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-[#FFE3DF] p-7">
              <h3 className="text-xl font-bold text-gray-900">Sustainable investment</h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                Potential support may include government contributions, development partners and finance institutions, philanthropies, employers, private-sector sponsors and other investors. Planning will identify Forum costs, partner contributions, financing for childcare priorities, transparent fund management and ways to connect investment concepts with interested funders.
              </p>
            </div>
            <div className="rounded-2xl border border-[#FFE3DF] p-7">
              <h3 className="text-xl font-bold text-gray-900">Joint coordination</h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                A joint coordination mechanism is proposed, with representatives designated by the Government of Uganda, CAC and Uthabiti Africa and other stakeholders invited as agreed. The concept note proposes an initial virtual discussion with Government, followed by a Ministry-hosted meeting with potential Ugandan partners to review the concept, draft budget and preparation workplan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FFF4F0] py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              About the partners
            </h2>
            <p className="mt-4 leading-relaxed text-gray-700">
              Uthabiti Africa Advisory Services Ltd is an Africa-focused advisory organisation working to strengthen childcare systems through policy engagement, workforce development, institutional partnerships, resource mobilisation and ecosystem building, with an official presence in Nairobi and Kampala.
            </p>
            <p className="mt-4 leading-relaxed text-gray-700">
              The Collaborative Action for Childcare (CAC) is Uthabiti’s collaborative platform for stakeholders advancing childcare through collective action, policy engagement, knowledge exchange and partnerships across the childcare ecosystem.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-7">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Forum contact
            </h2>
            <p className="mt-4 font-semibold text-gray-800">Asayya Imaya</p>
            <p className="text-gray-600">Convenor, Collaborative Action for Childcare</p>
            <p className="text-gray-600">CEO, Uthabiti Africa Advisory Services</p>
            <a className="mt-4 block font-semibold text-[#E5553C] hover:underline" href="tel:+254714262626">
              +254 714 262 626
            </a>
            <a className="mt-1 block font-semibold text-[#E5553C] hover:underline" href="mailto:Asayya.Imaya@uthabitiafrica.org">
              Asayya.Imaya@uthabitiafrica.org
            </a>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold">The Africa Promise</h2>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed">
            The Africa Childcare Forum Uganda 2027 will create an opportunity to turn Africa’s childcare ambitions into a credible investment agenda. By bringing together governments, development partners, financial institutions, employers, investors and childcare providers, the Forum will seek practical ways to mobilise resources, strengthen enterprises, invest in the workforce and expand access to quality, affordable and inclusive childcare.
          </p>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed">
            Delivering on that promise requires us to finance the childcare systems that make children’s development possible, enable parents to work and learn, and create decent jobs and sustainable enterprises.
          </p>
          <a
            href="/acf-mombasa-2026"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-[#FFB4A6] hover:text-white"
          >
            Explore the ACF Mombasa 2026 event archive
            <ArrowRight size={18} />
          </a>
          <p className="mt-10 inline-flex items-center gap-2 text-[#FFB4A6] font-semibold">
            Kampala, Uganda · 2027
            <ArrowRight size={18} />
          </p>
        </div>
      </section>

      <section className="border-t border-[#e6e0db] bg-[#f9f4f1] py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
            In partnership with
          </p>
          <img
            src="/images/cac-logos.webp"
            alt="Collaborative Action for Childcare logo"
            className="mx-auto h-16 w-auto object-contain sm:h-20"
          />
        </div>
      </section>
    </main>
  );
}

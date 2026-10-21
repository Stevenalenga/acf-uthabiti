"use client";

import { motion } from "framer-motion";
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
  Scale,
  MonitorSmartphone,
  Globe,
  Briefcase,
  FileText,
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
    icon: GraduationCap,
    title: "Childcare Workforce",
    text: "Financing the professionalisation of childcare workers through recognised qualifications, competency-based training, recognition of prior learning, decent working conditions and career pathways — expanding dignified employment for women and young people.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Childcare",
    text: "Investing in standards, infrastructure, safeguarding, supervision and quality assurance so services are safe, nurturing and developmentally appropriate — including inclusion of children with disabilities.",
  },
  {
    icon: HeartHandshake,
    title: "Affordable Childcare",
    text: "Financing approaches that reduce the cost burden on families without undermining quality or provider viability: public subsidies, employer-supported childcare, community financing and targeted support, including for adolescent mothers.",
  },
  {
    icon: Building2,
    title: "Childcare Enterprises and Financing",
    text: "Positioning childcare as an investable sector and a source of jobs and local growth — closing financing gaps for micro-enterprises, home-based providers, social enterprises and larger operators.",
  },
  {
    icon: Scale,
    title: "Government, Policy and Systems",
    text: "Strengthening government leadership so childcare is a recognised public investment priority: policy implementation, budgets, regulation, coordination across ministries, and leveraging private and development finance.",
  },
  {
    icon: MonitorSmartphone,
    title: "Evidence, Digital and Innovation",
    text: "Using evidence, data and innovation to guide investment and accountability — digital platforms, childcare data systems, cost and market analysis, delivery models and impact measurement.",
  },
];

const objectives = [
  "Elevate childcare as an economic and social investment priority within national development plans, public budgets and continental agendas.",
  "Explore sustainable financing mechanisms for childcare, including public investment, employer contributions, blended finance, philanthropy and private-sector investment.",
  "Strengthen the financial viability of childcare enterprises, particularly home-based and community-based providers.",
  "Advance investment in a professional, skilled and fairly remunerated childcare workforce.",
  "Promote affordable, safe, quality and inclusive childcare services that respond to the needs of children, parents and caregivers.",
  "Strengthen government leadership, policy implementation and accountability for childcare financing and service delivery.",
  "Generate practical financing commitments, partnerships and follow-up actions to advance childcare investment in Uganda and across Africa.",
];

const audiences = [
  { icon: Landmark, title: "Governments", text: "Leaders responsible for childcare policy, public finance, planning, ECD, education, gender, labour, health, social protection and local government." },
  { icon: Globe, title: "Regional institutions", text: "African Union and regional bodies shaping continental childcare and financing agendas." },
  { icon: Handshake, title: "Development partners", text: "International agencies, philanthropic organisations and funders ready to move from recognition to investment." },
  { icon: HandCoins, title: "Investors & finance", text: "Public and private investors, financial institutions and impact investors." },
  { icon: Briefcase, title: "Employers", text: "Business associations and employers interested in workplace childcare." },
  { icon: Users, title: "Providers & networks", text: "Childcare providers, caregiver networks, social enterprises, training institutions, researchers and civil society — including parent, women’s and disability organisations." },
];

const outcomes = [
  "Greater recognition of childcare as an investment priority within public finance, economic development and social policy agendas.",
  "Practical financing pathways identifying how public budgets, development finance, employers, philanthropy and private investment can contribute to childcare systems.",
  "Stronger childcare enterprises through improved access to finance, business support and enabling policy environments.",
  "Increased investment in the workforce through training, qualifications, recognition of prior learning and decent work.",
  "More affordable and inclusive services through financing approaches that respond to families’ needs while sustaining provider viability.",
  "Stronger government leadership and accountability for financing and implementing childcare priorities.",
  "New partnerships and investment opportunities connecting governments, funders, financial institutions, employers and childcare providers.",
  "A Forum outcome and follow-up framework identifying practical actions, potential financing partners and mechanisms for tracking progress.",
];

const budgetRows = [
  ["Venue, catering and conference facilities", "65,000,000"],
  ["Delegate travel and accommodation support", "55,000,000"],
  ["Programme development, speakers and facilitation", "25,000,000"],
  ["Travel and participation for government delegations", "35,000,000"],
  ["Communications, branding and documentation", "15,000,000"],
  ["Logistics, transport and coordination", "25,000,000"],
  ["Monitoring, reporting and post-Forum follow-up", "10,000,000"],
  ["Contingency and miscellaneous costs", "16,684,000"],
];

export default function ACFUganda2027ReviewPage() {
  return (
    <main className="bg-white">
      <div className="fixed top-[4.5rem] sm:top-[5rem] left-0 right-0 z-40 bg-amber-500 text-amber-950 text-center text-xs sm:text-sm font-semibold py-2 px-4 shadow">
        Internal review draft — not linked from the public site and not indexed by search engines
      </div>

      <section
        className="relative min-h-[78vh] flex items-center pt-28"
        style={{
          backgroundImage: "url('/images/childcare-forum1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/65 to-black/40" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 text-white">
          <p className="inline-block mb-4 px-4 py-2 text-sm font-semibold tracking-wide uppercase text-[#FFB4A6] bg-white/10 rounded-full border border-white/20">
            Concept note · ACFUGANDA2027
          </p>

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
              Kampala, Uganda
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar size={18} className="text-[#E5553C]" />
              5 days
            </span>
            <span className="inline-flex items-center gap-2">
              <Users size={18} className="text-[#E5553C]" />
              ~250 local + 250 international delegates
            </span>
          </div>
        </div>
      </section>

      <section className="bg-[#FFF4F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { value: "500", label: "Target delegates", sub: "Local and international" },
              { value: "6", label: "Forum themes", sub: "From workforce to finance" },
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

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Background and rationale
            </h2>
            <div className="mt-8 space-y-5 text-gray-700 text-lg leading-relaxed">
              <p>
                Childcare is essential social and economic infrastructure. It supports children’s
                development, enables parents to participate in education and employment, strengthens
                women’s economic participation and creates opportunities for enterprise development
                and decent work. Yet across Africa, childcare remains underfunded, with many families
                unable to access affordable, quality services and many providers operating with
                limited resources, training and business support.
              </p>
              <p>
                The African childcare challenge is therefore not simply a question of service
                provision. It is also a question of financing: who invests in childcare, how
                resources are mobilised and allocated, and how public, private and community
                investment can work together to create accessible, inclusive and sustainable
                childcare systems.
              </p>
              <p>
                Africa Childcare Forum Uganda 2027 will provide a continental platform to address
                these questions. Building on the 2nd Africa Childcare Forum in Mombasa, Kenya, it
                will draw attention to government leadership, public financing, innovative
                investment, viable childcare enterprises and coordinated action across the
                ecosystem. Hosted in Uganda, the Forum will connect continental priorities with
                national policy and implementation, including Uganda’s Early Childhood Care and
                Education Policy.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-[#FFF4F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-start gap-3 mb-4">
            <Target className="text-[#E5553C] mt-1 shrink-0" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Overall objective
            </h2>
          </div>
          <p className="text-xl text-gray-800 max-w-4xl leading-relaxed">
            To mobilise political commitment, financing and cross-sector partnerships to build
            sustainable, quality, affordable and inclusive childcare systems across Africa.
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

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
            Proposed themes
          </h2>
          <p className="mt-4 text-gray-600 text-center max-w-3xl mx-auto">
            Six interlocking conversations on how Africa can finance quality, affordable and
            inclusive childcare.
          </p>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <motion.div
                  key={theme.title}
                  variants={item}
                  whileHover={{ y: -8 }}
                  className="border border-[#FFE3DF] rounded-2xl p-8 hover:shadow-xl transition bg-white"
                >
                  <Icon className="text-[#E5553C] mb-4" size={32} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{theme.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{theme.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-[#FFF4F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
            Primary audience and participants
          </h2>
          <p className="mt-4 text-gray-700 text-center max-w-3xl mx-auto">
            Finance ministries, planning authorities, financial institutions and investors are
            particularly important so discussions move from recognising childcare’s importance to
            identifying how it can be financed.
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

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10">
            Expected outcomes
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {outcomes.map((text, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-[#FFE3DF] hover:bg-[#FFF4F0] transition">
                <span className="text-[#E5553C] font-extrabold text-lg shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-gray-700 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#FFF4F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Format and partnership arrangements
          </h2>
          <div className="mt-8 space-y-5 text-gray-700 text-lg leading-relaxed">
            <p>
              The programme will combine high-level government dialogue, financing and investment
              discussions, thematic sessions, country showcases, enterprise presentations, technical
              workshops and partnership roundtables.
            </p>
            <p>
              A government-led steering and organising committee should guide the Forum, supported
              by Uthabiti Africa and strategic partners. The programme should create space for
              governments to articulate national priorities, investors and funders to discuss
              financing opportunities, and childcare providers to share practical experience of the
              capital, capabilities and support needed to deliver sustainable services.
            </p>
            <p>
              Lessons from Kenya’s progress in childcare policy, regulation and workforce
              development, alongside Seychelles’ experience in childminding standards and recognised
              qualifications, will inform discussions on the relationship between regulation,
              quality, workforce investment and sustainable financing.
            </p>
            <p className="text-base text-gray-600 bg-white rounded-xl p-5 border border-[#FFE3DF]">
              Planning note: the concept note describes a five-day gathering with approximately 500
              delegates, while the indicative budget below is a provisional estimate for a two-day
              Forum of about 250 delegates. Both figures are retained here for review.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="text-[#E5553C]" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Indicative budget
            </h2>
          </div>
          <p className="text-gray-600 mb-8">
            Provisional planning estimate for a two-day Forum involving approximately 250
            delegates: <strong>UGX 246,684,000</strong>. These figures are planning estimates, not
            approved expenditure or verified supplier quotations.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-[#FFE3DF] shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[#FFF4F0]">
                <tr>
                  <th className="px-5 py-4 font-semibold text-gray-900">Budget item</th>
                  <th className="px-5 py-4 font-semibold text-gray-900 text-right whitespace-nowrap">
                    Proposed allocation (UGX)
                  </th>
                </tr>
              </thead>
              <tbody>
                {budgetRows.map(([label, amount]) => (
                  <tr key={label} className="border-t border-gray-100">
                    <td className="px-5 py-3.5 text-gray-700">{label}</td>
                    <td className="px-5 py-3.5 text-gray-900 text-right tabular-nums">{amount}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-[#E5553C] bg-[#FFF4F0]">
                  <td className="px-5 py-4 font-bold text-gray-900">Total</td>
                  <td className="px-5 py-4 font-bold text-gray-900 text-right tabular-nums">
                    246,684,000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            The budget should be validated with the host government and partners, including
            anticipated sponsorships, in-kind contributions and funding responsibilities.
          </p>
        </div>
      </section>

      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold">The Africa Promise</h2>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed">
            Africa Childcare Forum Uganda 2027 will create an opportunity to turn Africa’s
            childcare ambitions into a credible investment agenda. By bringing together
            governments, development partners, financial institutions, employers, investors and
            childcare providers, the Forum will seek practical ways to mobilise resources,
            strengthen enterprises, invest in the workforce and expand access to quality,
            affordable and inclusive childcare.
          </p>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed">
            The Africa Promise is a commitment to Africa’s children, families and economies.
            Delivering on that promise requires us to finance the childcare systems that make
            children’s development possible, enable parents to work and learn, and create decent
            jobs and sustainable enterprises.
          </p>
          <p className="mt-10 inline-flex items-center gap-2 text-[#FFB4A6] font-semibold">
            Kampala, Uganda · 2027
            <ArrowRight size={18} />
          </p>
        </div>
      </section>
    </main>
  );
}

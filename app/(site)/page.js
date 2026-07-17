"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { ArrowRight, MapPin, Calendar, Users, Landmark, Lightbulb, Globe, BookOpen, HeartHandshake, CheckCircle, 
Mic, Presentation, Handshake, GraduationCap, MessageCircle, Briefcase, HandCoins, Network, FileText, MonitorSmartphone, 
HandHelping, FileSearch, Mail, Linkedin, Twitter, Instagram, Hash } from "lucide-react";
import Countdown from "@/components/ui/CountDown";
import StatCounter from "@/components/ui/StatCounter";
import { motion } from "framer-motion";
import Link from "next/link";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HomePage() {

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {

    e.preventDefault();

    let newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) return;

    try {
      setLoading(true);

      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        showToast("Failed to subscribe to newsletter!", "error");
        return;
      }

      showToast("Successfully Subscribed", "success");
      setEmail("");
      setSuccess(true);

    } catch (error) {
      showToast("Network error. Please try again.", "error");
    } finally{
      setLoading(false);
    }
  };

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-white pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fadeUp">
              <p className="inline-block mb-4 px-4 py-2 text-sm font-semibold text-[#E5553C] bg-[#FFECEA] rounded-full">
                AFRICA CHILDCARE FORUM 2026
              </p>
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight">
                Uniting for Care:
                <span className="text-[#E5553C] block">
                  Africa’s Call to the World
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-xl">
                The Second Africa Childcare Forum (ACFMombasa2026) is a continental
                and global co-learning platform accelerating quality, affordable,
                and inclusive childcare systems across Africa.
              </p>

              <div className="mt-4 flex items-center gap-2 text-gray-700 font-medium">
                <MapPin size={16} className="text-[#E5553C]"/>
                <span>PrideInn Paradise Hotel</span>
                <span className="mx-2">|</span>
                <Calendar size={16} className="text-[#E5553C]"/>
                <span>13 – 15 October 2026</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/event-register"
                  className="bg-[#E5553C] hover:bg-[#cc4a35] text-white font-semibold px-8 py-4 rounded-lg shadow transition"
                >
                  Register Now
                </a>
                <a
                  href="#about"
                  className="border-2 border-[#E5553C] text-[#E5553C] font-semibold px-8 py-4 rounded-lg hover:bg-[#FFECEA]"
                >
                  Learn More
                </a>
              </div>

              {/* STATS */}
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
                <StatCounter
                  end={450}
                  label="Participants"
                />
                <StatCounter
                  end={30}
                  label="Countries"
                />
                <StatCounter
                  end={70}
                  label="Speakers"
                />
              </div>
            </div>

            {/* RIGHT VISUAL */}
            <div className="relative flex justify-center">
              <div className="absolute -z-10 w-72 h-72 bg-[#E5553C]/20 blur-3xl rounded-full"></div>
              <img
                src="/images/acf-poster-11.jpeg"
                alt="Africa Childcare Forum Poster"
                className="rounded-2xl shadow-2xl w-full max-w-md animate-float"
              />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-2xl px-6 py-5 w-[90%] max-w-sm">
                <p className="text-center text-sm text-gray-500 font-semibold mb-3">
                  Event Starts In
                </p>
                <Countdown />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-24 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 0.35, scale: 1 }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            viewport={{ once: true }}
            className="absolute inset-0"
          >
          <img
            src="/images/africa.png"
            alt="World map highlighting Africa"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E5553C]">
              About the Event
            </h2>

            <p className="mt-5 text-gray-700 text-lg sm:text-xl leading-relaxed">
              The Second Africa Childcare Forum (ACFMombasa2026) builds on the
              momentum from ACFKigali2025, creating a continental and global
              co-learning platform to accelerate quality, affordable, and
              inclusive childcare systems across Africa.
            </p>
          </motion.div>
          
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                icon: Users,
                title: "Centering Communities",
                text: "We amplify local voices, prioritize informal caregivers, and highlight culturally grounded solutions.",
              },
              {
                icon: Landmark,
                title: "Transform Policy & Systems",
                text: "Driving policy reforms to establish childcare as essential social infrastructure for all children.",
              },
              {
                icon: Lightbulb,
                title: "Showcase African Innovation",
                text: "Highlighting scalable, locally led approaches—from community models to digital childcare solutions.",
              },
              {
                icon: Globe,
                title: "Ignite Global Collaboration",
                text: "A platform where African experiences inform global strategies and partnerships.",
              },
              {
                icon: BookOpen,
                title: "Mutual Learning",
                text: "A co-learning and unlearning platform that turns local insights into global solutions for childcare.",
              },
              {
                icon: HeartHandshake,
                title: "Shared Responsibility",
                text: "Advancing the idea that quality childcare is a collective societal responsibility.",
              },
            ].map((card, i) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={i}
                  variants={item}
                  whileHover={{ y: -10 }}
                  className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-md hover:shadow-xl transition border border-[#FFE3DF] group"
                >
                  <Icon
                    className="text-[#E5553C] mb-4 group-hover:scale-110 transition"
                    size={28}
                  />

                  <h3 className="text-xl font-bold text-[#E5553C] mb-2">
                    {card.title}
                  </h3>

                  <p className="text-gray-700">{card.text}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Venue CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mt-20 bg-[#FFF4F0] rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-8"
          >

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Experience ACFMombasa2026 in Beautiful Mombasa
              </h3>

              <p className="text-gray-600 max-w-xl">
                The Africa Childcare Forum 2026 will take place at 
                <strong> PrideInn Paradise Beach Resort & Spa</strong>, 
                one of Kenya’s premier conference destinations located along 
                the stunning Mombasa coastline.
              </p>
            </div>

            <a
              href="/venue"
              className="bg-[#E5553C] text-white px-7 py-3 rounded-lg font-semibold hover:bg-[#cc4a35] transition shadow-md"
            >
              View Venue Details
            </a>

          </motion.div>
        </div>
      </section>

      {/* Why Attend */}
      <section id="why-attend" className="bg-[#FFF6F4] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="/images/childcare-forum1.jpg"
                alt="Africa Childcare Forum participants"
                className="rounded-2xl shadow-xl object-cover w-full h-[420px]"
              />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E5553C]">
                Why Attend ACFMombasa2026
              </h2>

              <p className="mt-4 text-lg text-gray-700">
                Join leaders, policymakers, practitioners, and innovators working to
                strengthen childcare systems across Africa. The Forum offers a unique
                opportunity to shape the future of childcare policy, investment, and
                innovation.
              </p>
              <ul className="mt-8 space-y-4">

                <li className="flex items-start gap-3">
                  <CheckCircle className="text-[#E5553C] mt-1" size={20} />
                  <span className="text-gray-800">
                    Influence childcare policy across Africa
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle className="text-[#E5553C] mt-1" size={20} />
                  <span className="text-gray-800">
                    Connect with governments and global funders
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle className="text-[#E5553C] mt-1" size={20} />
                  <span className="text-gray-800">
                    Learn from innovative childcare models
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle className="text-[#E5553C] mt-1" size={20} />
                  <span className="text-gray-800">
                    Build partnerships across sectors
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle className="text-[#E5553C] mt-1" size={20} />
                  <span className="text-gray-800">
                    Showcase research, programs, and innovations
                  </span>
                </li>

              </ul>
            </div>

          </div>
        </div>
      </section>
      
      {/* Participation */}
      <section id="participation" className="relative py-24 overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.18 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="absolute inset-0"
        >
          <img
            src="/images/africa-network.jpg"
            alt="Africa collaboration network"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 1, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E5553C]">
              Expected Participation
            </h2>

            <p className="mt-4 text-lg text-gray-700">
              ACFMombasa2026 will bring together a diverse community of leaders,
              practitioners, researchers, and policymakers working to strengthen
              childcare systems across Africa and beyond.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 text-center"
          >
            {[
              { icon: Users, value: "500+", label: "Delegates" },
              { icon: Globe, value: "40+", label: "Countries Represented" },
              { icon: Mic, value: "80+", label: "Speakers" },
              { icon: Presentation, value: "30+", label: "Sessions" },
              { icon: Handshake, value: "20+", label: "Partners" },
            ].map((stat, i) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={i}
                  variants={item}
                  whileHover={{ y: -8 }}
                  className="bg-[#FFF6F4]/95 backdrop-blur-md p-8 rounded-2xl shadow-sm hover:shadow-xl transition"
                >
                  <Icon className="mx-auto text-[#E5553C] mb-4" size={32} />
                  <h3 className="text-3xl font-extrabold text-gray-900">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 mt-2">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Who To Attend */}
      <section id="who-should-attend" className="py-24 bg-[#FFF6F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold tracking-wide text-[#E5553C] uppercase">
              Participation
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Who Should Attend
            </h2>

            <p className="mt-4 text-gray-600 text-lg">
              ACFMombasa2026 brings together leaders and stakeholders committed to
              advancing quality childcare systems across Africa.
            </p>
          </motion.div>

          {/* Audience Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                icon: Landmark,
                title: "Government & Policymakers",
              },
              {
                icon: Users,
                title: "Childcare Providers",
              },
              {
                icon: HeartHandshake,
                title: "NGOs & Civil Society",
              },
              {
                icon: GraduationCap,
                title: "Researchers & Academics",
              },
              {
                icon: Briefcase,
                title: "Private Sector Employers",
              },
              {
                icon: HandCoins,
                title: "Foundations & Philanthropy",
              },
              {
                icon: Globe,
                title: "Multilateral & Development Organizations",
              },
            ].map((audience, i) => {
              const Icon = audience.icon;

              return (
                <motion.div
                  key={i}
                  variants={item}
                  whileHover={{ y: -8 }}
                  className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition border border-[#FFE3DF] group"
                >
                  <Icon
                    className="text-[#E5553C] mb-4 group-hover:scale-110 transition"
                    size={30}
                  />

                  <h3 className="text-lg font-semibold text-gray-900">
                    {audience.title}
                  </h3>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Pre Conference Section */}
      <section id="preconference" className="py-24 bg-white">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="text-sm font-semibold tracking-wide text-[#E5553C] uppercase">
                Preparing for the Forum
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
                Pre-Conference Engagements
              </h2>

              <p className="mt-4 text-gray-600 text-lg">
                Before ACFMombasa2026, partners across Africa will host
                dialogues, workshops, and learning exchanges to surface
                priorities and strengthen collaboration.
              </p>
            </motion.div>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >

              {[
                {
                  icon: Users,
                  title: "National Dialogues",
                  text: "Country-led discussions bringing policymakers, practitioners, and caregivers together to shape childcare priorities.",
                },
                {
                  icon: GraduationCap,
                  title: "Workshops & Training",
                  text: "Capacity-building sessions focused on workforce development, policy implementation, and service delivery.",
                },
                {
                  icon: MessageCircle,
                  title: "Learning Exchanges",
                  text: "Collaborative spaces to share research, innovations, and best practices across regions.",
                },
              ].map((itemData, i) => {
                const Icon = itemData.icon;

                return (
                  <motion.div
                    key={i}
                    variants={item}
                    whileHover={{ y: -10 }}
                    className="bg-[#FFF4F0] rounded-2xl p-8 shadow-md hover:shadow-xl transition group"
                  >
                    <Icon
                      className="text-[#E5553C] mb-4 group-hover:scale-110 transition"
                      size={32}
                    />

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {itemData.title}
                    </h3>

                    <p className="text-gray-600">{itemData.text}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <a
                href="/conference-details"
                className="inline-flex items-center gap-3 bg-[#E5553C] text-white font-semibold px-8 py-4 rounded-lg shadow hover:bg-[#cc4a35] transition"
              >
                Explore Pre-Conference Details
                <ArrowRight size={18} />
              </a>
            </motion.div>

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
      <section id="sponsors" className="py-24 bg-[#FFF4F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-wide text-[#E5553C] uppercase">
              Call for Sponsors
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Partner with ACFMombasa2026
            </h2>

            <p className="mt-6 text-gray-600 text-lg">
              Join leading organizations shaping the future of childcare in Africa.
              Sponsoring the Forum connects your organization with policymakers,
              innovators, and global partners advancing childcare systems across the continent.
            </p>
          </div>

          {/* Why Sponsor */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <div className="text-[#E5553C] text-3xl mb-4"><Globe size={28} /></div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Continental Visibility
              </h3>
              <p className="text-gray-600 text-sm">
                Showcase your organization as a leader supporting childcare across Africa.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <div className="text-[#E5553C] text-3xl mb-4"><Handshake size={28} /></div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Engage Decision-Makers
              </h3>
              <p className="text-gray-600 text-sm">
                Connect with governments, donors, researchers, and childcare leaders.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <div className="text-[#E5553C] text-3xl mb-4"><Lightbulb size={28} /></div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Drive Impact
              </h3>
              <p className="text-gray-600 text-sm">
                Support innovative solutions that strengthen childcare systems in Africa.
              </p>
            </div>

          </div>

          {/* Sponsor Categories */}
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Sponsorship Categories
            </h3>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Strategic Partners",
                "Knowledge Partners",
                "Supporting Partners",
                "Media Partners",
              ].map((tier) => (
                <span
                  key={tier}
                  className="bg-white border border-[#E5553C] text-[#E5553C] font-medium px-6 py-3 rounded-full"
                >
                  {tier}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 text-center">

            <a
              href="/sponsors"
              className="border-2 border-[#E5553C] text-[#E5553C] font-semibold px-8 py-4 rounded-lg hover:bg-[#E5553C] hover:text-white transition"
            >
              Learn More
            </a>

            <a
              href="/contact"
              className="bg-[#E5553C] text-white font-semibold px-10 py-4 rounded-lg shadow hover:bg-[#cc4a35] transition"
            >
              Become a Sponsor
            </a>

          </div>

        </div>
      </section>

      {/* Sessions Section */}
      <section id="sessions" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-sm font-semibold text-[#E5553C] uppercase tracking-wide">
              Forum Programme
            </p>

            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">
              Forum Sessions
            </h2>

            <p className="mt-5 text-lg text-gray-600">
              Under the theme <strong>“Uniting for Care: Africa’s Call to the World”</strong>,
              ACFMombasa2026 brings together diverse voices to advance childcare and
              strengthen the care economy across Africa.
            </p>
          </div>


          {/* Session Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {[
              {
                icon: Mic,
                title: "Keynotes & Panels",
                text: "High-level conversations with African and global leaders shaping childcare systems."
              },
              {
                icon: Users,
                title: "Interactive Workshops",
                text: "Practical and hands-on sessions focused on real-world learning."
              },
              {
                icon: BookOpen,
                title: "Research & Policy Dialogues",
                text: "Evidence-driven discussions informing childcare policy and reform."
              },
              {
                icon: Lightbulb,
                title: "Innovation & Clinics",
                text: "Showcasing scalable African-led childcare innovations and solutions."
              }
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="group bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2"
                >

                  <div className="bg-[#FFF4F0] w-12 h-12 flex items-center justify-center rounded-xl mb-4 group-hover:bg-[#E5553C] transition">
                    <Icon className="text-[#E5553C] group-hover:text-white" size={22}/>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.text}
                  </p>

                </div>
              );
            })}
          </div>


          {/* Submission Timeline */}
          <div className="mt-20">

            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-gray-900">
                Session Proposal Timeline
              </h3>
              <p className="text-gray-600 mt-2">
                Key dates for submitting and reviewing session proposals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">

              <div className="bg-[#FFF4F0] rounded-xl p-8 text-center shadow-sm">
                <Calendar className="text-[#E5553C] mx-auto mb-3" size={26}/>
                <h4 className="font-semibold text-lg text-gray-900">
                  Submission Deadline
                </h4>
                <p className="text-gray-600 mt-2">
                  30 May 2026
                </p>
              </div>

              <div className="bg-[#FFF4F0] rounded-xl p-8 text-center shadow-sm">
                <Calendar className="text-[#E5553C] mx-auto mb-3" size={26}/>
                <h4 className="font-semibold text-lg text-gray-900">
                  Selection Notification
                </h4>
                <p className="text-gray-600 mt-2">
                  30 June 2026
                </p>
              </div>

            </div>

          </div>


          {/* Event Banner */}
          <div className="mt-20 bg-[#FFF4F0] rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">

            <div className="flex flex-col sm:flex-row gap-6 text-gray-700">

              <div className="flex items-center gap-2">
                <MapPin className="text-[#E5553C]" size={20}/>
                PrideInn Paradise, Mombasa
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="text-[#E5553C]" size={20}/>
                13 - 15 October 2026
              </div>

            </div>

            <a
              href="/sessions"
              className="bg-[#E5553C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cc4a35] transition"
            >
              Submit a Session Proposal
            </a>

          </div>

        </div>
      </section>

      {/* Event Highlights Section */}
      <section id="highlights" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Event Highlights
            </h2>

            <p className="mt-4 text-gray-600 text-lg">
              ACFMombasa2026 will bring together leaders, practitioners, and
              innovators shaping the future of childcare and the care economy
              across Africa.
            </p>
          </div>


          {/* Highlight Cards */}
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                icon: Mic,
                title: "Inspiring Keynotes",
                text: "Hear from African and global leaders advancing childcare systems and the care economy.",
                image: "/images/kigali-forum/keynote.jpg",
              },
              {
                icon: Users,
                title: "Interactive Workshops",
                text: "Hands-on sessions equipping participants with practical tools and strategies.",
                image: "/images/kigali-forum/workshop.jpg",
              },
              {
                icon: Network,
                title: "Networking Opportunities",
                text: "Connect with policymakers, researchers, NGOs, and innovators across Africa.",
                image: "/images/kigali-forum/network.jpg",
              },
              {
                icon: FileText,
                title: "Research & Policy Presentations",
                text: "Explore groundbreaking research shaping childcare systems and policies.",
                image: "/images/kigali-forum/research.jpg",
              },
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2"
                >

                  {/* Image */}
                  <div className="h-65 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div className="p-6">

                    {/* Icon */}
                    <div className="w-10 h-10 flex items-center justify-center bg-[#FFF4F0] rounded-lg mb-4">
                      <Icon className="text-[#E5553C]" size={20} />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.text}
                    </p>

                  </div>
                </div>
              );
            })}

          </div>


          {/* Previous Event CTA */}
          <div className="mt-20 bg-[#FFF4F0] rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">

            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Building on the Momentum from Kigali
              </h3>

              <p className="text-gray-600 mt-2 max-w-xl">
                The Africa Childcare Forum Kigali 2025 convened hundreds of
                participants from across the continent to advance childcare
                systems and strengthen the care economy.
              </p>
            </div>

            <Link
              href="/event"
              className="inline-flex items-center gap-2 bg-[#E5553C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cc4a35] transition"
            >
              View ACFKigali2025
              <ArrowRight size={18}/>
            </Link>

          </div>

        </div>
      </section>

      {/* Exhibitions Section */}
      <section id="exhibitions" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-wide text-[#E5553C] uppercase">
              Explore Innovations
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Exhibitions
            </h2>

            <p className="mt-4 text-gray-600 text-lg">
              Discover innovative products, services, and solutions transforming
              the childcare and education landscape across Africa. Connect with
              exhibitors and explore opportunities for collaboration.
            </p>
          </div>


          {/* Exhibition Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {[
              {
                icon: MonitorSmartphone,
                title: "Childcare Technology",
                text: "Digital tools, apps, and platforms improving childcare management and early learning experiences."
              },
              {
                icon: BookOpen,
                title: "Educational Products",
                text: "Innovative educational materials, toys, and resources supporting early childhood development."
              },
              {
                icon: HeartHandshake,
                title: "Care & Support Services",
                text: "Organizations offering inclusive childcare programs and support services."
              },
              {
                icon: HandHelping,
                title: "NGO Initiatives",
                text: "Impactful NGO programs advancing childcare justice and equity across Africa."
              },
              {
                icon: FileSearch,
                title: "Policy & Research",
                text: "Evidence-based research, frameworks, and policy innovations shaping childcare systems."
              },
              {
                icon: Users,
                title: "Community Projects",
                text: "Locally-led initiatives improving childcare access, inclusion, and quality."
              }
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="group bg-[#FFF4F0] rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2"
                >

                  {/* Icon */}
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow mb-4 group-hover:bg-[#E5553C] transition">
                    <Icon
                      size={22}
                      className="text-[#E5553C] group-hover:text-white transition"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.text}
                  </p>

                </div>
              );
            })}

          </div>


          {/* CTA */}
          <div className="mt-16 text-center">
            <a
              href="/exhibitions-details"
              className="inline-flex items-center gap-2 bg-[#E5553C] text-white font-semibold py-4 px-8 rounded-lg hover:bg-[#cf4b35] transition"
            >
              Learn More & Reserve Your Spot
              <ArrowRight size={18}/>
            </a>
          </div>

        </div>
      </section>

      {/* Newsletter Subscription */}
      <section id="newsletter" className="py-24 bg-[#FFF4F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* LEFT CONTENT */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white p-3 rounded-lg shadow">
                  <Mail className="text-[#E5553C]" size={22} />
                </div>

                <span className="text-sm font-semibold uppercase tracking-wide text-[#E5553C]">
                  Stay Updated
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                Join the ACFMombasa2026 Newsletter
              </h2>

              <p className="mt-4 text-gray-600 text-lg">
                Subscribe to receive the latest updates about the Africa Childcare Forum,
                including speakers, programme announcements, and important deadlines.
              </p>

              {/* Benefits */}
              <ul className="mt-6 space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#E5553C]" />
                  Speaker announcements
                </li>

                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#E5553C]" />
                  Programme updates
                </li>

                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#E5553C]" />
                  Registration deadlines
                </li>

                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#E5553C]" />
                  Forum news and highlights
                </li>
              </ul>
            </div>


            {/* SIGNUP FORM */}
            <div className="bg-white rounded-2xl shadow-lg p-8">

              {success ? (

                <div className="text-center py-6">

                  <div className="flex justify-center mb-4">
                    <div className="bg-green-100 p-4 rounded-full">
                      <CheckCircle className="text-green-600" size={32} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    Subscription Successful 🎉
                  </h3>

                  <p className="text-gray-600 mt-2">
                    Thank you for subscribing to the ACFMombasa2026 newsletter.
                    You'll receive updates about speakers, programme announcements,
                    and important deadlines.
                  </p>

                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 bg-[#E5553C] text-white px-6 py-2 rounded-lg hover:bg-[#cf4b35] transition"
                  >
                    Subscribe Another Email
                  </button>

                </div>

              ) : (

                <form onSubmit={handleSubmit} className="space-y-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E5553C] focus:outline-none"
                    />

                    {errors.email && (
                      <small className="text-red-600">{errors.email}</small>
                    )}
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-[#E5553C] text-white font-semibold py-3 rounded-lg hover:bg-[#cf4b35] transition cursor-pointer disabled:opacity-60"
                  >
                    {loading ? "Subscribing..." : "Subscribe to Updates"}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    We respect your privacy. You can unsubscribe at any time.
                  </p>

                </form>

              )}

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
              {/* Social Media */}
            <div className="pt-6 border-t border-white/30">

              <p className="font-semibold mb-4 text-white">
                Follow the Conversation
              </p>

              <div className="flex items-center gap-6 flex-wrap">

                <a
                  href="https://linkedin.com/Collaborative Action for Childcare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                >
                  <Linkedin size={18} />
                  <span>Collaborative Action for Childcare</span>
                </a>

                <a
                  href="https://twitter.com/CA_Childcare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                >
                  <Twitter size={18} />
                  <span>@CA_Childcare</span>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                >
                  <Instagram size={18} />
                  <span>Collaborative Action for Childcare</span>
                </a>

              </div>

              {/* Hashtag */}
              <div className="flex items-center gap-2 mt-4 text-white/90">
                <Hash size={18}/>
                <span className="font-semibold">
                  Official Forum Hashtag: #ACFMombasa2026
                </span>
              </div>

            </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:w-1/2 flex justify-center lg:justify-end">
              <a
                href="https://cac.uthabitiafrica.org"
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
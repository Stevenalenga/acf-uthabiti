"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Menu,
  X,
  ArrowUp,
  ChevronDown,
  Calendar,
  Presentation,
  LayoutGrid,
  Globe,
  Users,
  Target,
  HandCoins,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [forumDetailsOpen, setForumDetailsOpen] = useState(false);
  const [previousConferencesOpen, setPreviousConferencesOpen] = useState(false);
  const isMombasaArchive = pathname.startsWith("/acf-mombasa-2026");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 300);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleNavClick = () => {
    setOpen(false);
    setForumDetailsOpen(false);
    setPreviousConferencesOpen(false);
  };
  const getSectionHref = (href) =>
    `${isMombasaArchive ? "/acf-mombasa-2026" : "/"}${href}`;

  const ugandaSections = [
  {
    name: "Registration & Fees",
    href: "#pricing",
    icon: HandCoins,
    desc: "Early Bird dates and registration fees",
  },
  {
    name: "Background",
    href: "#background",
    icon: Globe,
    desc: "Why childcare financing matters",
  },
  {
    name: "Objectives",
    href: "#objectives",
    icon: Target,
    desc: "The goals of the Uganda 2027 forum",
  },
  {
    name: "Themes",
    href: "#themes",
    icon: Presentation,
    desc: "Eight investment themes for childcare financing",
  },
  {
    name: "Participants",
    href: "#audience",
    icon: Users,
    desc: "Who the forum brings together",
  },
  {
    name: "Expected outcomes",
    href: "#outcomes",
    icon: Target,
    desc: "What the forum aims to achieve",
  },
  {
    name: "Format",
    href: "#format",
    icon: Calendar,
    desc: "How the five-day forum will work",
  },
];
  const mombasaSections = [
    {
      name: "Full event overview",
      href: "/acf-mombasa-2026",
      icon: Globe,
      desc: "Event background, highlights and key information",
    },
    {
      name: "Forum sessions",
      href: "#sessions",
      icon: Presentation,
      desc: "Explore session formats and topics",
    },
    {
      name: "Why attend",
      href: "#why-attend",
      icon: Target,
      desc: "The forum’s purpose and value",
    },
    {
      name: "Participation",
      href: "#participation",
      icon: Users,
      desc: "Ways to take part in the forum",
    },
    {
      name: "Who should attend",
      href: "#who-should-attend",
      icon: Users,
      desc: "Stakeholders and leaders at the forum",
    },
    {
      name: "Pre-conference",
      href: "#preconference",
      icon: Calendar,
      desc: "Preparatory dialogues and engagements",
    },
    {
      name: "Exhibitions",
      href: "#exhibitions",
      icon: LayoutGrid,
      desc: "Innovation and knowledge showcases",
    },
  ];
  const sections = isMombasaArchive ? mombasaSections : ugandaSections;

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-white"
        }`}
      >
        <div
          className={`w-full px-3 sm:px-4 lg:px-6 2xl:px-8 flex items-center gap-3 lg:gap-4 transition-all duration-300 ${
            scrolled ? "py-2.5" : "py-3.5"
          }`}
        >
          {/* LOGO */}
          <Link
            href="/"
            className="flex shrink-0 items-center rounded-lg bg-[#124126] px-2 py-1.5 sm:px-3"
          >
            <img
              src="/uganda2027/acf-uganda-logo-white.png"
              alt="Africa Childcare Forum Uganda 2027"
              className="h-10 w-auto max-w-[145px] object-contain transition-all duration-300 sm:h-12"
            />
          </Link>

          {/* DESKTOP NAV — same row as logo and Register */}
          <nav className="hidden md:flex min-w-0 flex-1 items-center justify-between gap-x-0.5 overflow-visible text-[11px] lg:gap-x-1 lg:text-[14px] leading-none">
            <Link
              href="/"
              className={`shrink-0 px-0.5 lg:px-1.5 py-2 font-semibold whitespace-nowrap ${
                pathname === "/"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              Home
            </Link>

            {/* MEGA DROPDOWN */}
            <div className="relative group shrink-0">
              <button
                type="button"
                aria-expanded={forumDetailsOpen}
                onClick={() => setForumDetailsOpen((value) => !value)}
                className="flex items-center justify-center gap-1 px-1 lg:px-2 py-2 font-semibold whitespace-nowrap text-gray-700 hover:text-[#E5553C]"
              >
                Forum Details
                <ChevronDown size={16} />
              </button>

              <div className={`absolute left-1/2 top-full z-20 w-[min(720px,70vw)] -translate-x-1/2 pt-2 transition-all duration-200 ${
                forumDetailsOpen
                  ? "visible opacity-100"
                  : "invisible pointer-events-none opacity-0"
              }`}>
                <div className="bg-white shadow-xl rounded-2xl p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {sections.map((item, i) => {
                      const Icon = item.icon;
                      const href = item.href.startsWith("#")
                        ? getSectionHref(item.href)
                        : item.href;

                      return (
                        <Link
                          key={i}
                          href={href}
                          onClick={handleNavClick}
                          className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
                        >
                          <div className="bg-[#FFF4F0] p-3 rounded-lg">
                            <Icon size={20} className="text-[#E5553C]" />
                          </div>

                          <div>
                            <p className="font-semibold text-base text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/blog"
              className={`shrink-0 px-0.5 lg:px-1.5 py-2 font-semibold whitespace-nowrap ${
                pathname.startsWith("/blog")
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              Blog
            </Link>

            <div className="relative group shrink-0">
              <button
                type="button"
                aria-expanded={previousConferencesOpen}
                onClick={() => setPreviousConferencesOpen((value) => !value)}
                className={`flex items-center gap-1 px-0.5 lg:px-1.5 py-2 font-semibold whitespace-nowrap ${
                  isMombasaArchive || pathname === "/kigali" || pathname === "/ACFKigali2025" || pathname === "/event"
                    ? "text-[#E5553C]"
                    : "text-gray-700 hover:text-[#E5553C]"
                }`}
              >
                Previous Conferences
                <ChevronDown size={16} />
              </button>
              <div className={`absolute left-0 top-full z-20 min-w-56 pt-2 transition-all duration-200 ${
                previousConferencesOpen
                  ? "visible opacity-100"
                  : "invisible pointer-events-none opacity-0"
              }`}>
                <div className="rounded-xl bg-white p-2 shadow-xl ring-1 ring-gray-100">
                  <Link
                    href="/ACFKigali2025"
                    onClick={handleNavClick}
                    className="block rounded-lg px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#E5553C]"
                  >
                    ACF Kigali 2025
                  </Link>
                  <Link
                    href="/acf-mombasa-2026"
                    onClick={handleNavClick}
                    className="block rounded-lg px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#E5553C]"
                  >
                    ACF Mombasa 2026
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              className={`shrink-0 px-0.5 lg:px-1.5 py-2 font-semibold whitespace-nowrap ${
                pathname === "/contact"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Pay Invoice + Register stay clear of the overflowing nav */}
          <div className="relative z-20 ml-auto md:ml-0 flex shrink-0 items-center gap-3 lg:gap-4">
            <Link
              href="/pay"
              className={`hidden md:inline-flex whitespace-nowrap px-1 lg:px-2 py-2 text-[12.5px] lg:text-[14px] font-semibold ${
                pathname === "/pay"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              Pay Invoice
            </Link>
            <Link
              href="/event-register"
              className="whitespace-nowrap bg-[#E5553C] text-white px-3 lg:px-4 py-2 rounded-lg text-[12.5px] lg:text-[14px] font-semibold shadow hover:bg-[#cc4a35] transition"
            >
              Register 2027
            </Link>
            <button
              className="md:hidden text-gray-700"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-6 py-6 space-y-6 text-base">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                Home
              </Link>

              <div>
                <button
                  type="button"
                  aria-expanded={forumDetailsOpen}
                  onClick={() => setForumDetailsOpen((value) => !value)}
                  className="mb-3 flex w-full items-center justify-between text-left text-sm font-semibold text-gray-500"
                >
                  Forum Details
                  <ChevronDown size={16} />
                </button>

                {forumDetailsOpen && <div className="space-y-3">
                  {sections.map((item, i) => {
                    const Icon = item.icon;
                    const href = item.href.startsWith("#")
                      ? getSectionHref(item.href)
                      : item.href;

                    return (
                      <Link
                        key={i}
                        href={href}
                        onClick={handleNavClick}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <Icon size={18} className="text-[#E5553C]" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>}
              </div>

              <Link
                href="/blog"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                Blog
              </Link>

              <div>
                <button
                  type="button"
                  aria-expanded={previousConferencesOpen}
                  onClick={() => setPreviousConferencesOpen((value) => !value)}
                  className="mb-3 flex w-full items-center justify-between text-left font-semibold text-gray-700"
                >
                  Previous Conferences
                  <ChevronDown size={16} />
                </button>
                {previousConferencesOpen && (
                  <div className="space-y-3 pl-3">
                    <Link
                      href="/ACFKigali2025"
                      onClick={handleNavClick}
                      className="block font-semibold text-gray-600"
                    >
                      ACF Kigali 2025
                    </Link>
                    <Link
                      href="/acf-mombasa-2026"
                      onClick={handleNavClick}
                      className="block font-semibold text-gray-600"
                    >
                      ACF Mombasa 2026
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                Contact
              </Link>

              <Link
                href="/pay"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                Pay Invoice
              </Link>

              <Link
                href="/event-register"
                onClick={() => setOpen(false)}
                className="block text-center bg-[#E5553C] text-white py-3 rounded-lg font-semibold"
              >
                Register for Uganda 2027
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Offset for fixed header */}
      <div className="h-[5.5rem] sm:h-[6rem]" aria-hidden />

      {/* SCROLL TO TOP */}
      {showTop && (
        <button
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          className="fixed bottom-6 right-6 z-50 bg-[#E5553C] text-white p-3 rounded-full shadow-lg hover:bg-[#cc4a35]"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}
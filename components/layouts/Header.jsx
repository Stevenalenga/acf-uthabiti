"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Menu,
  X,
  ArrowUp,
  ChevronDown,
  Calendar,
  Handshake,
  Presentation,
  LayoutGrid,
  Globe,
  Mail,
  Users,
  UsersRound,
  Hotel,
  MapPin,
} from "lucide-react";
import Countdown from "@/components/ui/CountDown";
import { FIELD_VISIT } from "@/lib/fieldVisit";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

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

  const handleNavClick = (href) => {
    setOpen(false);

    if (href.startsWith("#") && pathname !== "/") {
      router.push(`/${href}`);
    }
  };

  const sections = [
  {
    name: "Steering Committee",
    href: "/steering-committee",
    icon: UsersRound,
    desc: "Meet the steering committee for ACFMombasa2026",
  },
  {
    name: "Why Attend",
    href: "#why-attend",
    icon: Globe,
    desc: "Why the forum matters for Africa’s childcare future",
  },
  {
    name: "Participation",
    href: "#participation",
    icon: Users,
    desc: "Ways individuals and organizations can participate",
  },
  {
    name: "Who Should Attend",
    href: "#who-should-attend",
    icon: Users,
    desc: "Stakeholders and leaders invited to the forum",
  },
  {
    name: "Pre-Conference",
    href: "#preconference",
    icon: Calendar,
    desc: "Preparatory dialogues and engagements",
  },
  {
    name: "Accommodation",
    href: "/accommodation",
    icon: Hotel,
    desc: "Hotels near PrideInn Flamingo Beach Resort & Spa",
  },
  {
    name: "Field Visits",
    href: "/field-visits",
    icon: MapPin,
    desc: "Sign up to visit childcare centres in Mombasa",
  },
  {
    name: "Sponsors",
    href: "#sponsors",
    icon: Handshake,
    desc: "Partners supporting the forum",
  },
  {
    name: "Sessions",
    href: "#sessions",
    icon: Presentation,
    desc: "Forum discussions and panels",
  },
  {
    name: "Exhibitions",
    href: "#exhibitions",
    icon: LayoutGrid,
    desc: "Innovation and knowledge showcases",
  },
];

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
          <Link href="/" className="flex shrink-0 items-center">
            <img
              src="/images/partners/acf.png"
              alt="Africa Childcare Forum"
              className={`w-auto object-contain transition-all duration-300 ${
                scrolled ? "h-12" : "h-14"
              }`}
            />
          </Link>

          {/* DESKTOP NAV — same row as logo and Register */}
          <nav className="hidden md:flex min-w-0 flex-1 items-center justify-between gap-x-0.5 lg:gap-x-1 overflow-hidden text-[12.5px] lg:text-[14px] leading-none">
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
              <button className="flex items-center justify-center gap-1 px-1 lg:px-2 py-2 font-semibold whitespace-nowrap text-gray-700 hover:text-[#E5553C]">
                Forum Details
                <ChevronDown size={16} />
              </button>

              <div className="absolute left-1/2 top-full z-20 w-[min(720px,70vw)] -translate-x-1/2 pt-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                <div className="bg-white shadow-xl rounded-2xl p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {sections.map((item, i) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={i}
                          href={item.href}
                          onClick={() => handleNavClick(item.href)}
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
              href="/speakers"
              className={`shrink-0 px-0.5 lg:px-1.5 py-2 font-semibold whitespace-nowrap ${
                pathname === "/speakers"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              Speakers
            </Link>

            <Link
              href="/programme"
              className={`shrink-0 px-0.5 lg:px-1.5 py-2 font-semibold whitespace-nowrap ${
                pathname === "/programme"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              Programme
            </Link>

            <Link
              href="/tamarind-dinner"
              className={`shrink-0 px-0.5 lg:px-1.5 py-2 font-semibold whitespace-nowrap ${
                pathname === "/tamarind-dinner"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              Tamarind Dinner
            </Link>

            <Link
              href="/tamarind-dinner"
              className={`hidden xl:inline-flex shrink-0 px-0.5 lg:px-1.5 py-2 font-semibold whitespace-nowrap ${
                pathname === "/tamarind-dinner"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              Tamarind Dinner
            </Link>

            <Link
              href="/field-visits"
              className={`hidden xl:inline-flex shrink-0 px-0.5 lg:px-1.5 py-2 font-semibold whitespace-nowrap ${
                pathname === "/field-visits"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              Field Visits
            </Link>

            <Link
              href="/media"
              className={`hidden xl:inline-flex shrink-0 px-0.5 lg:px-1.5 py-2 font-semibold whitespace-nowrap ${
                pathname === "/media"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              Media
            </Link>

            <Link
              href="/kigali"
              className={`shrink-0 px-0.5 lg:px-1.5 py-2 font-semibold whitespace-nowrap ${
                pathname === "/kigali" ||
                pathname === "/ACFKigali2025" ||
                pathname === "/acfkigali2025" ||
                pathname === "/event"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              ACFKigali2025
            </Link>

            <Link
              href="/acfuganda2027"
              className={`shrink-0 px-0.5 lg:px-1.5 py-2 font-semibold whitespace-nowrap ${
                pathname === "/acfuganda2027" ||
                pathname === "/uganda" ||
                pathname === "/ACFUganda2027" ||
                pathname === "/uganda2027"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              ACFUganda2027
            </Link>

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
              Register
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
                <p className="text-sm font-semibold text-gray-500 mb-3">
                  Forum Details
                </p>

                <div className="space-y-3">
                  {sections.map((item, i) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <Icon size={18} className="text-[#E5553C]" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <Link
                href="/speakers"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                Speakers
              </Link>

              <Link
                href="/programme"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                Programme
              </Link>

              <Link
                href="/accommodation"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                Accommodation
              </Link>

              <Link
                href="/tamarind-dinner"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                Tamarind Dinner
              </Link>

              <Link
                href="/field-visits"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                Field Visits
              </Link>

              <Link
                href="/media"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                Media & Resources
              </Link>

              <Link
                href="/kigali"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                ACFKigali2025
              </Link>

              <Link
                href="/acfuganda2027"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                ACFUganda2027
              </Link>

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
                Register
              </Link>
            </div>
          </div>
        )}

        <div className="bg-[#E5553C] border-t border-white/10">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-2 sm:py-2.5">
            <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center">
              <Countdown variant="banner" />
              <a
                href={FIELD_VISIT.formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-white/20 sm:text-xs"
              >
                Field visit registration is still open: {FIELD_VISIT.formUrl}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Offset for fixed header + countdown strip */}
      <div className="h-[8.5rem] sm:h-[9rem]" aria-hidden />

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
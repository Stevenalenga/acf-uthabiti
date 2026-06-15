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
  Users, UsersRound
} from "lucide-react";

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

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
          scrolled ? "bg-white shadow-md py-2" : "bg-white py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <img
              src="/images/acf-logo.png"
              alt="Africa Childcare Forum"
              className={`transition-all duration-300 ${
                scrolled ? "h-10" : "h-14"
              }`}
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-10">
            <Link
              href="/"
              className={`font-semibold ${
                pathname === "/"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              Home
            </Link>

            {/* MEGA DROPDOWN */}
            <div className="relative group">
              <button className="flex items-center gap-1 font-semibold text-gray-700 hover:text-[#E5553C]">
                Forum Details
                <ChevronDown size={16} />
              </button>

              <div className="absolute left-0 top-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 bg-white shadow-xl rounded-2xl w-[720px] p-6">

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
                          <p className="font-semibold text-gray-900">
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

            <Link
              href="/speakers"
              className={`font-semibold ${
                pathname === "/speakers"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              Speakers
            </Link>

            <Link
              href="/programme"
              className={`font-semibold ${
                pathname === "/programme"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              Programme
            </Link>

            <Link
              href="/media"
              className={`font-semibold ${
                pathname === "/media"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              Media & Resources
            </Link>

            <Link
              href="/event"
              className={`font-semibold ${
                pathname === "/event"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              ACFKigali2025
            </Link>

            <Link
              href="/contact"
              className={`flex items-center gap-1 font-semibold ${
                pathname === "/contact"
                  ? "text-[#E5553C]"
                  : "text-gray-700 hover:text-[#E5553C]"
              }`}
            >
              {/* <Mail size={16} /> */}
              Contact
            </Link>

            {/* REGISTER BUTTON */}
            <a
              href="#register"
              onClick={() => handleNavClick("#register")}
              className="bg-[#E5553C] text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-[#cc4a35] transition"
            >
              Register
            </a>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="lg:hidden bg-white shadow-lg">
            <div className="px-6 py-6 space-y-6">
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
                href="/media"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                Media & Resources
              </Link>

              <Link
                href="/event"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                ACFKigali2025
              </Link>

              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block font-semibold text-gray-700"
              >
                Contact
              </Link>

              <a
                href="#register"
                onClick={() => handleNavClick("#register")}
                className="block text-center bg-[#E5553C] text-white py-3 rounded-lg font-semibold"
              >
                Register
              </a>
            </div>
          </div>
        )}
      </header>

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
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ArrowUp } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Pre-Conference", href: "#preconference" },
  { name: "Sponsors", href: "#sponsors" },
  { name: "Sessions", href: "#sessions" },
  { name: "Exhibitions", href: "#exhibitions" },
  { name: "ACFKigali2025", href: "/event" },
  { name: "Contact", href: "/contact" },
];

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

    // If hash link and not on home page → redirect to home
    if (href.startsWith("#") && pathname !== "/") {
      router.push(`/${href}`);
    }
  };

  const isActive = (href) => {
    // Exact page match
    if (!href.startsWith("#")) {
      return pathname === href;
    }

    // Hash links active only on home
    if (href.startsWith("#")) {
      return pathname === "/";
    }

    return false;
  };

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="/images/acf-logo.png"
                alt="Africa Childcare Forum"
                className={`w-auto object-contain transition-all duration-300 ease-in-out ${
                  scrolled ? "h-12 sm:h-10" : "h-16 sm:h-20"
                }`}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`font-semibold transition-colors ${
                    isActive(link.href)
                      ? "text-[#E5553C]"
                      : "text-gray-700 hover:text-[#E5553C]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <a
                href="#register"
                onClick={() => handleNavClick("#register")}
                className="bg-[#E5553C] text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-[#cc4a35] transition"
              >
                Register
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden text-gray-700`}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden bg-white shadow-xl">
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`block font-medium ${
                    isActive(link.href) ? "text-[#E5553C]" : "text-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

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
          className="fixed bottom-6 right-6 z-50 bg-[#E5553C] text-white p-3 rounded-full shadow-lg hover:bg-[#cc4a35] transition"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}
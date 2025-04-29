"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 250);
    };
    window.addEventListener("scroll", handleScroll);
    // Run on mount in case the page is already scrolled
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header
      className={`bg-white text-gray-800 shadow-md sticky top-0 z-50 transition-all duration-300`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <a
          href="https://ride-next-iota.vercel.app/reservations"
          className="text-2xl font-extrabold tracking-tight"
        >
          <div className="logo">
            <Image
              src="https://metrodtw.wizardcomm.in/wp-content/uploads/2025/01/MDS-LOGO-2022-1.png"
              alt="logo"
              width={100}
              height={58}
            />
          </div>
        </a>

        <div className="hidden md:flex space-x-6 text-sm">
          <a
            href="https://metrodtw.wizardcomm.in/"
            className="hover:text-[#00A0FF] transition"
          >
            Services
          </a>
          <a
            href="https://metrodtw.wizardcomm.in/fleet/"
            className="hover:text-[#00A0FF] transition"
          >
            Fleet
          </a>
          <a
            href="https://metrodtw.wizardcomm.in/rates/"
            className="hover:text-[#00A0FF] transition"
          >
            Rates
          </a>
          <a
            href="https://ride-next-iota.vercel.app/reservations/new-booking"
            className="hover:text-[#00A0FF] transition"
            target="_blank"
          >
            Reservations
          </a>
        </div>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 py-3 space-y-2 text-sm">
          <a href="/about" className="block hover:text-yellow-300 transition">
            About
          </a>
          <a
            href="/services"
            className="block hover:text-yellow-300 transition"
          >
            Services
          </a>
          <a href="/contact" className="block hover:text-yellow-300 transition">
            Contact
          </a>
        </div>
      )}
    </header>
  );
}

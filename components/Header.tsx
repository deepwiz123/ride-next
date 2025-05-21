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
          href="https://metrodtw.wizardcomm.in/"
          className="text-2xl font-extrabold tracking-tight text-gray-800"
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
        <div className="hidden md:flex space-x-6 text-sm text-black">
          {/* Services with Dropdown */}
          <div className="relative group">
            <button className="hover:text-[#00A0FF] dark:hover:text-[#33A7FF] transition focus:outline-none">
              Services
            </button>
            <div className="absolute left-0 mt-2 w-72 bg-white  dark:bg-black border border-gray-200 dark:border-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-200 z-50">
              <a
                href="https://metrodtw.wizardcomm.in/transportation-to-detroit-airport/"
                className="block px-4 py-2 text-sm text-black dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Airport Transportation
              </a>
              <a
                href="https://metrodtw.wizardcomm.in/detroit-airport-car-service/"
                className="block px-4 py-2 text-sm text-black dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Airport Car Service
              </a>
              <a
                href="https://metrodtw.wizardcomm.in/detroit-airport-taxi-service/%22"
                className="block px-4 py-2 text-sm text-black dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Airport Taxi Service
              </a>
              <a
                href="https://metrodtw.wizardcomm.in/airport/"
                className="block px-4 py-2 text-sm text-black dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Airport Transfers
              </a>
            </div>
          </div>

          {/* Other Nav Items */}
          <a
            href="https://metrodtw.wizardcomm.in/fleet/"
            className="hover:text-[#00A0FF] dark:hover:text-[#33A7FF] transition"
          >
            Fleet
          </a>
          <a
            href="https://metrodtw.wizardcomm.in/rates/"
            className="hover:text-[#00A0FF] dark:hover:text-[#33A7FF] transition"
          >
            Rates
          </a>
          <a className="text-[#00A0FF] dark:text-[#33A7FF] transition">
            Reservations
          </a>
        </div>

        <button
          className="md:hidden text-gray-800 dark:text-gray-100"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 py-3 space-y-2 text-sm text-gray-800 dark:text-gray-100">
          <a
            href="https://metrodtw.wizardcomm.in/"
            className="block hover:text-yellow-300 dark:hover:text-yellow-200 transition"
          >
            Services
          </a>
          <a
            href="https://metrodtw.wizardcomm.in/fleet/"
            className="block hover:text-yellow-300 dark:hover:text-yellow-200 transition"
          >
            Fleet
          </a>
          <a
            href="https://metrodtw.wizardcomm.in/rates/"
            className="block hover:text-yellow-300 dark:hover:text-yellow-200 transition"
          >
            Rates
          </a>
          <a
            href="https://ride-next-iota.vercel.app/reservations/new-booking"
            className="block text-yellow-300 dark:hover:text-yellow-200 transition"
            target="_blank"
          >
            Reservations
          </a>
        </div>
      )}
    </header>
  );
}

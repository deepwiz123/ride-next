'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <a href="/reservations" className="text-2xl font-extrabold tracking-tight">
          <span className="text-white">Ride</span>
          <span className="text-yellow-400">Booking</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-sm">
          <a href="/reservations/about" className="hover:text-yellow-300 transition">About</a>
          <a href="/reservations/services" className="hover:text-yellow-300 transition">Services</a>
          <a href="/reservations/contact" className="hover:text-yellow-300 transition">Contact</a>
        </div>


        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-600 px-4 py-3 space-y-2 text-sm">
          <a href="/about" className="block hover:text-yellow-300 transition">About</a>
          <a href="/services" className="block hover:text-yellow-300 transition">Services</a>
          <a href="/contact" className="block hover:text-yellow-300 transition">Contact</a>
        </div>
      )}
    </header>
  );
}

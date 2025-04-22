export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white text-center w-full">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Brand & Legal */}
        <div>
          <h2 className="text-xl font-bold">
            <span className="text-white">Ride</span>
            <span className="text-yellow-400">Booking</span>
          </h2>
          <p className="mt-2 text-gray-300">
            Making your journey seamless, reliable, and smart.
          </p>
          <p className="mt-4 text-gray-400">
            © {currentYear} Ride Booking. All rights reserved.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <h3 className="text-yellow-400 font-semibold mb-2">Quick Links</h3>
          <a href="/reservations/about" className="block hover:text-yellow-300 transition">
            About Us
          </a>
          <a
            href="/reservations/services"
            className="block hover:text-yellow-300 transition"
          >
            Services
          </a>
          <a href="/reservations/contact" className="block hover:text-yellow-300 transition">
            Contact
          </a>
        </div>

        {/* Socials & Contact */}
        <div className="space-y-2">
          <h3 className="text-yellow-400 font-semibold mb-2">Connect</h3>
          {/* Placeholder for future social media icons */}
          <p className="text-gray-300">Email: support@ridebooking.com</p>
          <p className="text-gray-300">Phone: +1 (800) 123-4567</p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 py-2 border-t border-indigo-600">
        Built with ❤️ by Ride Booking Team
      </div>
    </footer>
  );
}

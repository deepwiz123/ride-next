import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { BsInstagram } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[url('/reservations/footer-banner.png')] bg-cover bg-center w-full bg-white dark:bg-gray-900/95 shadow-md dark:shadow-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="logo">
            <Image
              src={
                typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
                  ? "/reservations/logo-white.png"
                  : "/reservations/logo-gray.png"
              }
              alt="logo"
              width={100}
              height={58}
            />
          </div>
          <p className="mt-2 text-[#6E6E6E] dark:text-gray-300">
            Provides premium, reliable transportation services across Southeast
            Michigan. Specializing in airport transfers, corporate travel, and
            special events.
          </p>
          <div>
            <ul className="flex gap-4 mt-2">
              <li className="w-[35px] h-[35px] rounded-full bg-[#4c4848] dark:bg-gray-700 flex flex-wrap justify-center items-center">
                <FaFacebook className="text-white dark:text-gray-100 text-[20px]" />
              </li>
              <li className="w-[35px] h-[35px] rounded-full bg-[#4c4848] dark:bg-gray-700 flex flex-wrap justify-center items-center">
                <BsInstagram className="text-white dark:text-gray-100 text-[20px]" />
              </li>
              <li className="w-[35px] h-[35px] rounded-full bg-[#4c4848] dark:bg-gray-700 flex flex-wrap justify-center items-center">
                <FaTwitter className="text-white dark:text-gray-100 text-[20px]" />
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-white dark:text-gray-100 font-semibold mb-2">Quick Links</h3>
          <a
            href="https://metrodtw.wizardcomm.in/about-us/"
            className="text-[#6E6E6E] dark:text-gray-300 block hover:text-white dark:hover:text-gray-100 transition"
          >
            About Us
          </a>
          <a
            href="https://metrodtw.wizardcomm.in/fleet/"
            className="text-[#6E6E6E] dark:text-gray-300 block hover:text-white dark:hover:text-gray-100 transition"
          >
            Fleet
          </a>
          <a
            href="https://metrodtw.wizardcomm.in/rates/"
            className="text-[#6E6E6E] dark:text-gray-300 block hover:text-white dark:hover:text-gray-100 transition"
          >
            Rates
          </a>
          <a
            href="https://ride-next-iota.vercel.app/reservations/new-booking"
            className="text-[#6E6E6E] dark:text-gray-300 block hover:text-white dark:hover:text-gray-100 transition"
          >
            Reservations
          </a>
        </div>
        <div className="space-y-2">
          <h3 className="text-white dark:text-gray-100 font-semibold mb-2">Our Services</h3>
          <a
            href="https://metrodtw.wizardcomm.in/services/airport-transfers/"
            className="text-[#6E6E6E] dark:text-gray-300 block hover:text-white dark:hover:text-gray-100 transition"
          >
            Transportation to Detroit Airport
          </a>
          <a
            href="https://metrodtw.wizardcomm.in/services/car-service/"
            className="text-[#6E6E6E] dark:text-gray-300 block hover:text-white dark:hover:text-gray-100 transition"
          >
            Detroit Airport Car Service
          </a>
          <a
            href="https://metrodtw.wizardcomm.in/services/taxi-service/"
            className="text-[#6E6E6E] dark:text-gray-300 block hover:text-white dark:hover:text-gray-100 transition"
          >
            Detroit Airport Taxi Service
          </a>
        </div>
        <div className="space-y-2">
          <h3 className="text-white dark:text-gray-100 font-semibold mb-2">Connect</h3>
          <div className="flex gap-2 text-[#6E6E6E] dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition">
            <MapPin className="text-[#6E6E6E] dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition" />
            Canton, MI 48187
          </div>
          <div className="flex gap-2 text-[#6E6E6E] dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition">
            <Mail className="text-[#6E6E6E] dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition" />
            <div>
              <p>Email address:</p>
              <p>info@metrodtwsedan.com</p>
            </div>
          </div>
          <div className="flex gap-2 text-[#6E6E6E] dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition">
            <Phone className="text-[#6E6E6E] dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition" />
            <div>
              <p>Contact No.</p>
              <p>(734) 945-6067</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-xs text-[#6E6E6E] dark:text-gray-300 border-t border-[#4c4848] dark:border-gray-600 flex flex-wrap justify-between items-center">
        <div>
          <p>
            Copyright © {currentYear} Metro DTW Sedan | All rights reserved.
          </p>
        </div>
        <div>
          <ul className="flex gap-2">
            <li className="text-[#6E6E6E] dark:text-gray-300">
              <a
                href="https://metrodtw.wizardcomm.in/privacy-policy/"
                className="text-[#6E6E6E] dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition"
              >
                Privacy Policy
              </a>
            </li>
            <li className="text-[#6E6E6E] dark:text-gray-300">
              <a
                href="https://metrodtw.wizardcomm.in/terms-condition/"
                className="text-[#6E6E6E] dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition"
              >
                Terms & Condition
              </a>
            </li>
            <li className="text-[#6E6E6E] dark:text-gray-300">
              <a
                href="https://metrodtw.wizardcomm.in/disclaimer/"
                className="text-[#6E6E6E] dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition"
              >
                Disclaimer
              </a>
            </li>
            <li className="text-[#6E6E6E] dark:text-gray-300">
              <a
                href="https://metrodtw.wizardcomm.in/contact-us/"
                className="text-[#6E6E6E] dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
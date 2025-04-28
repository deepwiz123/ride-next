import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { BsInstagram } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[url('/city-night.png')] bg-cover bg-center w-full">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="logo">
            <Image src="/reservations/logo-gray.png" alt="logo" width={100} height={58} />
          </div>
          <p className="mt-2 text-[#6E6E6E]">
            Provides premium, reliable transportation services across Southeast
            Michigan. Specializing in airport transfers, corporate travel, and
            special events.
          </p>
          <div>
            <ul className="flex gap-4 mt-2">
              <li className="w-[35px] h-[35px] rounded-full bg-[#4c4848] flex flex-wrap justify-center items-center">
                <FaFacebook className="text-white text-[20px]" />
              </li>
              <li className="w-[35px] h-[35px] rounded-full bg-[#4c4848] flex flex-wrap justify-center items-center">
                <BsInstagram className="text-white text-[20px]" />
              </li>
              <li className="w-[35px] h-[35px] rounded-full bg-[#4c4848] flex flex-wrap justify-center items-center">
                <FaTwitter className="text-white text-[20px]" />
              </li>
              <li></li>
            </ul>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-white font-semibold mb-2">Quick Links</h3>
          <a
            href="/about"
            className="text-[#6E6E6E] block hover:text-white transition"
          >
            About Us
          </a>
          <a
            href="/services"
            className="text-[#6E6E6E] block hover:text-white transition"
          >
            Fleet
          </a>
          <a
            href="/contact"
            className="text-[#6E6E6E] block hover:text-white transition"
          >
            Rates
          </a>
          <a
            href="/book"
            className="text-[#6E6E6E] block hover:text-white transition"
          >
            Reservations
          </a>
        </div>
        <div className="space-y-2">
          <h3 className="text-white font-semibold mb-2">OUR SERVICES</h3>
          <a
            href="/contact"
            className="text-[#6E6E6E] block hover:text-white transition"
          >
            Transportation to Detroit Airport
          </a>
          <a
            href="/contact"
            className="text-[#6E6E6E] block hover:text-white transition"
          >
            Detroit Airport Car Service
          </a>
          <a
            href="/contact"
            className="text-[#6E6E6E] block hover:text-white transition"
          >
            Detroit Airport Taxi Service
          </a>
        </div>
        <div className="space-y-2">
          <h3 className="text-white font-semibold mb-2">Connect</h3>
          <div className="flex gap-2 text-[#6E6E6E] block hover:text-white transition">
            <MapPin className="text-[#6E6E6E] block hover:text-white transition" />{" "}
            Canton, MI 48187
          </div>
          <div className=" flex gap-2 text-[#6E6E6E] block hover:text-white transition">
            <Mail className="text-[#6E6E6E] block hover:text-white transition" />
            <div>
              <p>Email address:</p>
              <p>info@metrodtwsedan.com</p>
            </div>
          </div>
          <div className=" flex gap-2 text-[#6E6E6E] block hover:text-white transition">
            <Phone className="text-[#6E6E6E] block hover:text-white transition" />
            <div>
              <p>Contact No.</p>
              <p>(734) 945-6067</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-xs text-[#6E6E6E] border-t border-[#4c4848] flex flex-wrap justify-between items-center">
        <div>
          <p>
            Copyright © {currentYear} Metro DTW Sedan | All rights reserved.
          </p>
        </div>
        <div>
          <ul className="flex gap-2">
            <li className="text-[#6E6E6E]">
              <a
                href="https://metrodtw.wizardcomm.in/privacy-policy/"
                className="text-[#6E6E6E] block hover:text-white transition"
              >
                Privacy Policy
              </a>
            </li>
            <li className="text-[#6E6E6E]">
              <a
                href="https://metrodtw.wizardcomm.in/terms-condition/"
                className="text-[#6E6E6E] block hover:text-white transition"
              >
                Terms & Condition
              </a>
            </li>
            <li className="text-[#6E6E6E]">
              <a
                href="https://metrodtw.wizardcomm.in/disclaimer/"
                className="text-[#6E6E6E] block hover:text-white transition"
              >
                Disclaimer
              </a>
            </li>
            <li className="text-[#6E6E6E]">
              <a
                href="https://metrodtw.wizardcomm.in/contact-us/"
                className="text-[#6E6E6E] block hover:text-white transition"
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

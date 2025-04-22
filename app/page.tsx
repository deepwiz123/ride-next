"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import Image from "next/image";

const images = [
  "/urban.png",
  "/airport.png",
  "/city-night.png",
  "/country-road.png",
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const { updateBookingData } = useBooking();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBooking = () => {
    const bookingId : string = Math.random().toString(36).substring(2, 10);
    updateBookingData({ bookingId });
    router.push(`/book/${bookingId}`);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden">

      {/* Background Image Slider */}
      {images.map((src, index) => (
          <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={src}
            alt={`Background ${index}`}
            fill
            className="object-cover"
          />
        </div>
      ))}


      {/* Content */}
      <section className="relative z-30 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
          Book Smarter. <span className="text-yellow-400">Ride Faster.</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-xl drop-shadow-md">
          Reliable rides, anytime, anywhere. Your journey begins now.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleBooking}
            className="bg-yellow-400 text-indigo-800 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition shadow-lg"
          >
            Book a Ride
          </button>
          <Link
            href="/about"
            className="font-medium text-white hover:text-yellow-400 transition self-center text-center"
          >
            Learn more
          </Link>
        </div>
      </section>
    </main>
  );
}

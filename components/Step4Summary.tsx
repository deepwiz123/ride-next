"use client";

import { motion } from "framer-motion";
import { useBooking } from "../context/BookingContext";
import axios from "axios";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Step4Summary() {
  const { bookingData, updateBookingData } = useBooking();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrev = () => {
    updateBookingData({ step: bookingData.step - 1 });
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post("/reservations/api/send-notifications", bookingData);
      alert("✅ Booking confirmed! Notifications sent.");
      updateBookingData({
        bookingId: "",
        step: 1,
        customer: { name: "", email: "", phone: "" },
        trip: {
          pickup: "",
          dropoff: "",
          passengers: 1,
          kids: 0,
          bags: 0,
          dateTime: "",
          hourly: false,
          hourlyRate: 0,
          durationHours: 0,
          durationMinutes: 0,
          stops: [],
        },
        car: { type: "", rate: 0, quantity: 1 },
      });
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      setError("⚠️ Error confirming booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full bg-white border border-gray-300 rounded-2xl p-6 space-y-6 text-gray-900 shadow-md"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <CheckCircle2 className="text-green-600 w-6 h-6" />
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Booking Summary
        </h2>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <p>
          <span className="font-medium text-gray-900">Customer:</span>{" "}
          {bookingData.bookingId}
        </p>
        <p>
          <span className="font-medium text-gray-900">Customer:</span>{" "}
          {bookingData.customer.name}
        </p>
        <p>
          <span className="font-medium text-gray-900">Email:</span>{" "}
          {bookingData.customer.email}
        </p>
        <p>
          <span className="font-medium text-gray-900">Phone:</span>{" "}
          {bookingData.customer.phone}
        </p>
        <p>
          <span className="font-medium text-gray-900">Pickup:</span>{" "}
          {bookingData.trip.pickup}
        </p>
        <p>
          <span className="font-medium text-gray-900">Dropoff:</span>{" "}
          {bookingData.trip.dropoff}
        </p>
        <p>
          <span className="font-medium text-gray-900">Passengers:</span>{" "}
          {bookingData.trip.passengers}
        </p>
        <p>
          <span className="font-medium text-gray-900">Car Type:</span>{" "}
          {bookingData.car.type}
        </p>
        <p>
          <span className="font-medium text-gray-900">Quantity:</span>{" "}
          {bookingData.car.quantity}
        </p>
        <p className="col-span-2">
          <span className="font-medium text-gray-900">Total Rate:</span>{" "}
          <span className="text-green-600 font-bold">
            ${bookingData.car.rate * bookingData.car.quantity}
          </span>
        </p>
      </div>

      {/* Terms */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-1">
          Terms & Conditions
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Please review all booking details carefully before confirming. By
          proceeding, you agree to our ride policy, cancellation terms, and data
          use agreement.
        </p>
      </div>

      {/* Confirm Button */}
      <motion.button
        onClick={handleConfirm}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md transition"
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.05 }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          "Confirm Booking"
        )}
      </motion.button>
      <motion.button
        onClick={handlePrev}
        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 py-3 px-6 rounded-lg text-lg font-semibold shadow-md transition"
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.05 }}
      >
        Back
      </motion.button>
    </motion.div>
  );
}

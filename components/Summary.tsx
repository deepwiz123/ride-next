"use client";

import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";

export default function SummaryView() {
  const { bookingData } = useBooking();

  // Format dateTime
  const formattedDateTime = bookingData.trip.dateTime
    ? new Date(bookingData.trip.dateTime).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Not specified";

  // Format stops
  const stopsDisplay =
    (bookingData?.trip.stops ?? []).length > 0
      ? (bookingData.trip.stops ?? []).join(", ")
      : "None";

  // Format hourly details
  const hourlyDetails = bookingData.trip.hourly
    ? `Duration: ${bookingData.trip.durationHours}h ${bookingData.trip.durationMinutes}m`
    : `Distance: ${bookingData.trip.distance || "N/A"}`;

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col text-gray-900 dark:text-gray-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Scrollable Content */}
      <div className="flex-1 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex justify-center items-center gap-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Booking Summary
          </h2>
        </div>
        <p className="text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
          Review your booking details before proceeding to confirmation.
        </p>

        {/* Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base">
          <div className="flex flex-col">
            <span className="font-semibold text-[#33A7FF]">Booking ID</span>
            <span className="text-gray-700 dark:text-gray-300">
              {bookingData.bookingId}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#33A7FF]">Customer Name</span>
            <span className="text-gray-700 dark:text-gray-300">
              {bookingData.customer.name}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#33A7FF]">Customer Email</span>
            <span className="text-gray-700 dark:text-gray-300">
              {bookingData.customer.email}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#33A7FF]">Customer Phone</span>
            <span className="text-gray-700 dark:text-gray-300">
              {bookingData.customer.countryCode} {bookingData.customer.phone}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#33A7FF]">Pickup</span>
            <span className="text-gray-700 dark:text-gray-300">
              {bookingData.trip.pickup}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#33A7FF]">Dropoff</span>
            <span className="text-gray-700 dark:text-gray-300">
              {bookingData.trip.dropoff}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#33A7FF]">Date & Time</span>
            <span className="text-gray-700 dark:text-gray-300">
              {formattedDateTime}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#33A7FF]">Passengers</span>
            <span className="text-gray-700 dark:text-gray-300">
              {bookingData.trip.passengers}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#33A7FF]">Kids</span>
            <span className="text-gray-700 dark:text-gray-300">
              {bookingData.trip.kids}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#33A7FF]">Bags</span>
            <span className="text-gray-700 dark:text-gray-300">
              {bookingData.trip.bags}
            </span>
          </div>
          {bookingData.trip.hourly && (
            <div className="flex flex-col">
              <span className="font-semibold text-[#33A7FF]">Stops</span>
              <span className="text-gray-700 dark:text-gray-300">
                {stopsDisplay}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-[#33A7FF]">Trip Type</span>
            <span className="text-gray-700 dark:text-gray-300">
              {bookingData.trip.hourly ? "Hourly" : "Distance-based"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#33A7FF]">Trip Details</span>
            <span className="text-gray-700 dark:text-gray-300">
              {hourlyDetails}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#33A7FF]">Car Type</span>
            <span className="text-gray-700 dark:text-gray-300">
              {bookingData.car.type}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#33A7FF]">Car Quantity</span>
            <span className="text-gray-700 dark:text-gray-300">
              {bookingData.car.quantity}
            </span>
          </div>
          <div className="flex flex-col sm:col-span-2">
            <span className="font-semibold text-[#33A7FF]">Total Fare</span>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
              ${bookingData.fare.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Terms & Conditions
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Please review all booking details carefully before confirming. By
            proceeding, you agree to our ride policy, cancellation terms, and
            data use agreement.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
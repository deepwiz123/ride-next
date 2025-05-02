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

        {/* Summary Grid with Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Booking ID
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.bookingId}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Customer Name
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.customer.name}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Customer Email
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.customer.email}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Customer Phone
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.customer.countryCode} {bookingData.customer.phone}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Pickup
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.trip.pickup}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Dropoff
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.trip.dropoff}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Date & Time
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {formattedDateTime}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Passengers
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.trip.passengers}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Kids
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.trip.kids}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Bags
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.trip.bags}
            </span>
          </div>
          {bookingData.trip.hourly && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
              <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
                Stops
              </span>
              <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
                {stopsDisplay}
              </span>
            </div>
          )}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Trip Type
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.trip.hourly ? "Hourly" : "Distance-based"}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Trip Details
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {hourlyDetails}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Car Type
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.car.type}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Car Quantity
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.car.quantity}
            </span>
          </div>
          <div className="sm:col-span-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Total Fare
            </span>
            <span className="block text-lg sm:text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
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
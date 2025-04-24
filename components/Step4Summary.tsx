// src/components/Step4Summary.tsx
"use client";

import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import { Button } from "./ui/Button";

export default function Step4Summary() {
  const { bookingData, updateBookingData } = useBooking();

  const handlePrev = () => {
    updateBookingData({ step: bookingData.step - 1 });
  };

  const handleNext = () => {
    updateBookingData({ step: 5 }); // Proceed to Step 5
  };

  // Format dateTime
  const formattedDateTime = bookingData.trip.dateTime
    ? new Date(bookingData.trip.dateTime).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    })
    : "Not specified";

  // Format stops
  const stopsDisplay =
    bookingData?.trip.stops ?? "".length > 0
      ? bookingData?.trip.stops ?? [].join(", ")
      : "None";

  // Format hourly details
  const hourlyDetails = bookingData.trip.hourly
    ? `Duration: ${bookingData.trip.durationHours}h ${bookingData.trip.durationMinutes}m`
    : `Distance: ${bookingData.trip.distance} miles`;

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-3">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight dark:text-gray-100">
          Booking Summary
        </h2>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300">
        <p>
          <span className="font-medium text-gray-900 dark:text-gray-100">Booking ID:</span>{" "}
          {bookingData.bookingId}
        </p>
        <p>
          <span className="font-medium text-gray-900 dark:text-gray-100">Customer:</span>{" "}
          {bookingData.customer.name}
        </p>
        <p>
          <span className="font-medium text-gray-900 dark:text-gray-100">Email:</span>{" "}
          {bookingData.customer.email}
        </p>
        <p>
          <span className="font-medium text-gray-900 dark:text-gray-100">Phone:</span>{" "}
          {bookingData.customer.countryCode} {bookingData.customer.phone}
        </p>
        <p>
          <span className="font-medium text-gray-900 dark:text-gray-100">Pickup:</span>{" "}
          {bookingData.trip.pickup}
        </p>
        <p>
          <span className="font-medium text-gray-900 dark:text-gray-100">Dropoff:</span>{" "}
          {bookingData.trip.dropoff}
        </p>
        <p>
          <span className="font-medium text-gray-900 dark:text-gray-100">Date & Time:</span>{" "}
          {formattedDateTime}
        </p>
        <p>
          <span className="font-medium text-gray-900 dark:text-gray-100">Passengers:</span>{" "}
          {bookingData.trip.passengers}
        </p>
        <p>
          <span className="font-medium text-gray-900 dark:text-gray-100">Kids:</span>{" "}
          {bookingData.trip.kids}
        </p>
        <p>
          <span className="font-medium text-gray-900 dark:text-gray-100">Bags:</span>{" "}
          {bookingData.trip.bags}
        </p>
        {bookingData.trip.hourly && <p>
          <span className="font-medium text-gray-900 dark:text-gray-100">Stops:</span>{" "}
          {stopsDisplay}
        </p>}
        <p>
          <span className="font-medium text-gray-900 dark:text-gray-100">Trip Type:</span>{" "}
          {bookingData.trip.hourly ? "Hourly" : "Distance-based"}
        </p>
        {bookingData.trip.hourly && <p>
          {/* <span className="font-medium text-gray-900 dark:text-gray-100">Trip Details:</span>{" "} */}
          {hourlyDetails}
        </p>}
        <p>
          <span className="font-medium text-gray-900 dark:text-gray-100">Car Type:</span>{" "}
          {bookingData.car.type}
        </p>
        <p>
          <span className="font-medium text-gray-900 dark:text-gray-100">Car Quantity:</span>{" "}
          {bookingData.car.quantity}
        </p>
        <p className="col-span-2">
          <span className="font-medium text-gray-900 dark:text-gray-100">Total Fare:</span>{" "}
          <span className="text-green-600 font-bold dark:text-green-400">
            ${bookingData.fare.toFixed(2)}
          </span>
        </p>
      </div>

      {/* Terms */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 dark:bg-gray-700 dark:border-gray-600">
        <h3 className="text-sm sm:text-base font-semibold text-gray-600 mb-1 dark:text-gray-300">
          Terms & Conditions
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed dark:text-gray-400">
          Please review all booking details carefully before confirming. By
          proceeding, you agree to our ride policy, cancellation terms, and data
          use agreement.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          onClick={handlePrev}
        >
          Prev
        </Button>
        <Button
          type="button"
          variant="solid"
          className="w-auto px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-400"
          onClick={handleNext}
        >
          Proceed To Payment
        </Button>
      </div>
    </motion.div>
  );
}
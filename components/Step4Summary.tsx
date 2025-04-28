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
    updateBookingData({ step: bookingData.step + 1 });
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
    bookingData?.trip.stops ?? [].length > 0
      ? bookingData.trip.stops ?? [].join(", ")
      : "None";

  // Format hourly details
  const hourlyDetails = bookingData.trip.hourly
    ? `Duration: ${bookingData.trip.durationHours}h ${bookingData.trip.durationMinutes}m`
    : `Distance: ${bookingData.trip.distance || "N/A"}`;

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col text-gray-900 dark:bg-gray-800 dark:text-gray-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Scrollable Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex justify-center items-center gap-3">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight dark:text-gray-100">
            Booking Summary
          </h2>
        </div>

        {/* Summary Grid */}
        <div className="flex flex-col gap-4 sm:gap-6 text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Booking ID:
              </span>
              <span>{bookingData.bookingId}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Customer:
              </span>
              <span>{bookingData.customer.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Email:
              </span>
              <span>{bookingData.customer.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Phone:
              </span>
              <span>
                {bookingData.customer.countryCode} {bookingData.customer.phone}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Pickup:
              </span>
              <span>{bookingData.trip.pickup}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Dropoff:
              </span>
              <span>{bookingData.trip.dropoff}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Date & Time:
              </span>
              <span>{formattedDateTime}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Passengers:
              </span>
              <span>{bookingData.trip.passengers}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Kids:
              </span>
              <span>{bookingData.trip.kids}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Bags:
              </span>
              <span>{bookingData.trip.bags}</span>
            </div>
            {bookingData.trip.hourly && (
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Stops:
                </span>
                <span>{stopsDisplay}</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Trip Type:
              </span>
              <span>
                {bookingData.trip.hourly ? "Hourly" : "Distance-based"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Trip Details:
              </span>
              <span>{hourlyDetails}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Car Type:
              </span>
              <span>{bookingData.car.type}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Car Quantity:
              </span>
              <span>{bookingData.car.quantity}</span>
            </div>
            <div className="flex flex-col sm:col-span-2">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Total Fare:
              </span>
              <span className="text-green-600 font-bold dark:text-green-400">
                ${bookingData.fare.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 dark:bg-gray-700 dark:border-gray-600">
          <h3 className="text-sm sm:text-base font-semibold text-gray-600 mb-1 dark:text-gray-300">
            Terms & Conditions
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed dark:text-gray-400">
            Please review all booking details carefully before confirming. By
            proceeding, you agree to our ride policy, cancellation terms, and
            data use agreement.
          </p>
        </div>
      </div>

      {/* Sticky Buttons */}
      <div className="sticky bottom-0 bg-white w-full flex justify-between items-center p-4 rounded-md dark:bg-gray-800 gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-auto px-6 py-2 bg-[#002e52] text-white rounded-md hover:bg-[#00518F] dark:bg-[#002e52] dark:text-white dark:hover:bg-[#00518F]"
          onClick={handlePrev}
        >
          Prev
        </Button>
        <Button
          type="button"
          variant="solid"
          className="w-1/2 px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500"
          onClick={handleNext}
        >
          Proceed
        </Button>
      </div>
    </motion.div>
  );
}

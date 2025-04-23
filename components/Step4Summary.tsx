"use client";

import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import axios from "axios";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button"; // Use updated Button component

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
          distance: "0.0",
        },
        car: { type: "", rate: 0, quantity: 1 },
        fare: 0,
      });
      window.location.href = "https://metrodtw.wizardcomm.in/"; // Redirect to external URL
    } catch (error) {
      console.error("Error:", error);
      setError("⚠️ Error confirming booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
    bookingData.trip.stops.length > 0
      ? bookingData.trip.stops.join(", ")
      : "None";

  // Format hourly details
  const hourlyDetails = bookingData.trip.hourly
    ? `Hourly Rate: $${bookingData.trip.hourlyRate}, Duration: ${bookingData.trip.durationHours}h ${bookingData.trip.durationMinutes}m`
    : `Distance: ${bookingData.trip.distance} miles`;

    return (
      <motion.div
        className="w-full max-w-4xl mx-auto bg-white border border-gray-300 rounded-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 text-gray-900 shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-green-600 w-5 h-5 sm:w-6 sm:h-6 dark:text-green-400" />
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight dark:text-gray-100">
            Booking Summary
          </h2>
        </div>
    
        {/* Summary Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Booking ID:
            </span>{" "}
            {bookingData.bookingId}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Customer:
            </span>{" "}
            {bookingData.customer.name}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Email:
            </span>{" "}
            {bookingData.customer.email}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Phone:
            </span>{" "}
            {bookingData.customer.countryCode} {bookingData.customer.phone}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Pickup:
            </span>{" "}
            {bookingData.trip.pickup}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Dropoff:
            </span>{" "}
            {bookingData.trip.dropoff}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Date & Time:
            </span>{" "}
            {formattedDateTime}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Passengers:
            </span>{" "}
            {bookingData.trip.passengers}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Kids:
            </span>{" "}
            {bookingData.trip.kids}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Bags:
            </span>{" "}
            {bookingData.trip.bags}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Stops:
            </span>{" "}
            {stopsDisplay}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Trip Type:
            </span>{" "}
            {bookingData.trip.hourly ? "Hourly" : "Distance-based"}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Trip Details:
            </span>{" "}
            {hourlyDetails}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Car Type:
            </span>{" "}
            {bookingData.car.type}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Car Quantity:
            </span>{" "}
            {bookingData.car.quantity}
          </p>
          <p className="col-span-2 xs:col-span-1">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Total Fare:
            </span>{" "}
            <span className="text-green-600 font-bold dark:text-green-400">
              ${bookingData.fare.toFixed(2)}
            </span>
          </p>
        </div>
    
        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm sm:text-base font-medium dark:text-red-400">
            {error}
          </p>
        )}
    
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
    
        {/* Buttons */}
        <div className="flex flex-col justify-between sm:flex-row gap-3 sm:gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            onClick={handlePrev}
          >
            Prev
          </Button>
          <Button
            variant="solid"
            className="w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-gray-300"
            onClick={handleConfirm}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" />
              </div>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </motion.div>
    );
}

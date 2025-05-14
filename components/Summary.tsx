"use client";

import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import { Button } from "./ui/Button";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { returnTripSchema } from "@/lib/schema";
import { ReturnTrip } from "@/types/booking";
import { Input } from "./ui/Input";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import MessageCard from "./ui/MessageCard";

export default function SummaryView() {
  const { bookingData, updateBookingData } = useBooking();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "failure";
    text: string;
    bookingId?: string;
  } | null>(null);

  const [addReturnReservation, setAddReturnReservation] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReturnTrip>({
    resolver: zodResolver(returnTripSchema),
    defaultValues: {
      returnDateTime: bookingData.returnTrip?.returnDateTime || "",
      returnFlightNumber: bookingData.returnTrip?.returnFlightNumber || "",
      returnDropoff: bookingData.returnTrip?.returnDropoff || "",
      returnDropoffLatLng:
        bookingData.returnTrip?.returnDropoffLatLng || undefined,
    },
    mode: "onChange",
  });

  const returnDropoff = watch("returnDropoff");

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

  // Geocode return dropoff address
  const geocodeAddress = async (address: string) => {
    if (!address) return;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        const coords = { lat, lng };
        setValue("returnDropoffLatLng", coords, { shouldValidate: true });
        setValue("returnDropoff", response.data.results[0].formatted_address, {
          shouldValidate: true,
        });
      }
    } catch (error) {
      console.error("Geocoding error for return dropoff:", error);
    }
  };

  const debouncedGeocode = useDebouncedCallback(geocodeAddress, 500);

  useEffect(() => {
    if (addReturnReservation) {
      debouncedGeocode(returnDropoff);
    }
  }, [returnDropoff, debouncedGeocode, addReturnReservation]);

  const onSubmit = async (data: ReturnTrip) => {
    setIsLoading(true);
    setMessage(null);
    try {
      // Step 5: Send notifications and confirm booking
      updateBookingData({
        returnTrip: addReturnReservation ? data : undefined,
        step: 5,
      });
      await axios.post("/reservations/api/send-notifications", {
        ...bookingData,
        step: 5,
      });
      setIsLoading(false);
      setMessage({
        type: "success",
        text: "Your booking has been successfully confirmed! Payment processed and notifications sent.",
        bookingId: bookingData.bookingId,
      });
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "failure",
        text: "Error processing booking. Please try again.",
      });
    }
  };

  const handleDismiss = () => {
    if (message?.type === "success") {
      updateBookingData({
        bookingId: "",
        step: 1,
        customer: { name: "", email: "", phone: "", countryCode: "" },
        trip: {
          pickup: "",
          dropoff: "",
          passengers: 1,
          kids: 0,
          bags: 0,
          dateTime: "",
          hourly: false,
          durationHours: 0,
          durationMinutes: 0,
          stops: [],
          distance: "0.0",
        },
        car: {
          type: "",
          quantity: 1,
          transferRate: 0,
          hourlyRate: 0,
          capacity: 1,
        },
        fare: 0,
        payment: {
          method: "credit",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          cardholderName: "",
          billingPostalCode: "",
          specialInstructions: "",
        },
      });
      window.location.href = "https://metrodtw.wizardcomm.in/";
    }
    setMessage(null);
  };

  // Handle retry
  const handleRetry = () => {
    setMessage(null);
  };

  return (
    <motion.div
      className="w-full bg-white dark:bg-[#181818] p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col text-gray-900 dark:text-gray-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {message && (
        <MessageCard
          type={message.type}
          message={message.text}
          bookingId={message.bookingId}
          onDismiss={handleDismiss}
          onRetry={message.type === "failure" ? handleRetry : undefined}
        />
      )}
      <div className="flex-1 space-y-6 sm:space-y-8">
        <div className="flex justify-center items-center gap-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Booking Summary
          </h2>
        </div>
        <p className="text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
          Review your booking details before proceeding to confirmation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Booking ID
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.bookingId}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Customer Name
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.customer.name}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Customer Email
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.customer.email}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Customer Phone
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.customer.countryCode} {bookingData.customer.phone}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Pickup
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.trip.pickup}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Flight Number
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.trip.flightnumber || "N/A"}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Dropoff
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.trip.dropoff}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Date & Time
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {formattedDateTime}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Passengers
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.trip.passengers}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Kids
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.trip.kids}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Bags
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.trip.bags}
            </span>
          </div>
          {bookingData.trip.hourly && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#282929]">
              <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
                Stops
              </span>
              <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
                {stopsDisplay}
              </span>
            </div>
          )}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Trip Type
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.trip.hourly ? "Hourly" : "Distance-based"}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-xs sm:text-sm">
              Car Type
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              {bookingData.car.type}
            </span>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-[#282929] border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Return Reservation
          </h3>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={addReturnReservation}
              onChange={() => setAddReturnReservation(!addReturnReservation)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-[#181818] dark:border-gray-600"
            />
            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              Would you like to create a return reservation?
            </span>
          </label>
          {addReturnReservation && (
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-4 space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-4 sm:gap-6 md:grid md:grid-cols-2">
                <div className="flex flex-col">
                  <Input
                    type="datetime-local"
                    label="Return Date & Time"
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                    {...register("returnDateTime")}
                  />
                  {errors.returnDateTime && (
                    <p className="text-xs sm:text-sm text-red-500 dark:text-red-400">
                      {errors.returnDateTime.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <Input
                    type="text"
                    label="Return Flight Number"
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                    placeholder="Enter return flight number (e.g., AA123)"
                    {...register("returnFlightNumber")}
                  />
                  {errors.returnFlightNumber && (
                    <p className="text-xs sm:text-sm text-red-500 dark:text-red-400">
                      {errors.returnFlightNumber.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <Input
                    type="text"
                    label="Return Drop-off Location"
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                    placeholder="Enter return drop-off location"
                    {...register("returnDropoff")}
                  />
                  {errors.returnDropoff && (
                    <p className="text-xs sm:text-sm text-red-500 dark:text-red-400">
                      {errors.returnDropoff.message}
                    </p>
                  )}
                </div>
              </div>
            </motion.form>
          )}
        </div>

        <div className="bg-gray-100 dark:bg-[#282929] border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6">
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
      <div className="bottom-0 bg-transparent w-full flex justify-center items-center gap-4 p-4">
        <Button
          type="button"
          variant="outline"
          className={`w-auto px-6 py-2 bg-[#002e52] text-white rounded-md hover:bg-[#00518F] dark:bg-[#6b6f71] dark:text-white dark:hover:bg-[#00518F] ${
            bookingData.step === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => updateBookingData({ step: bookingData.step - 1 })}
          disabled={bookingData.step === 1}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="solid"
          className={`w-auto px-6 py-2 rounded-md font-semibold transition-colors ${
            isLoading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : bookingData.step <= 4
              ? "bg-[#33A7FF] text-white hover:bg-[#00518F] dark:bg-[#33A7FF] dark:hover:bg-[#00518F]"
              : "bg-green-700 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500"
          }`}
          onClick={async () => {
            if (addReturnReservation) {
              // Trigger form submission
              const form = document.querySelector("form");
              if (form) {
                form.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
              }
            } else {
              try {
                // Step 5: Send notifications and confirm booking
                updateBookingData({
                  step: 5,
                });
                await axios.post("/reservations/api/send-notifications", {
                  ...bookingData,
                  step: 5,
                });
                setIsLoading(false);
                setMessage({
                  type: "success",
                  text: "Your booking has been successfully confirmed! Payment processed and notifications sent.",
                  bookingId: bookingData.bookingId,
                });
              } catch (error) {
                console.error("Error:", error);
                setMessage({
                  type: "failure",
                  text: "Error processing booking. Please try again.",
                });
              }
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-5 w-5 inline-block" />
          ) : bookingData.step === 5 ? (
            "Confirm"
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </motion.div>
  );
}

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
  const [addReturnReservation, setAddReturnReservation] = useState(
    !!bookingData.returnTrip
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    getValues,
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
      ? bookingData.trip.stops?.join(", ")
      : "None";

  // Format hourly details
  const hourlyDetails = bookingData.trip.hourly
    ? `Duration: ${bookingData.trip.durationHours || 0}h ${
        bookingData.trip.durationMinutes || 0
      }m`
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
        // Update BookingContext
        updateBookingData({
          returnTrip: {
            ...getValues(),
            returnDropoffLatLng: coords,
            returnDropoff: response.data.results[0].formatted_address,
          },
        });
      }
    } catch (error) {
      console.error("Geocoding error for return dropoff:", error);
    }
  };

  const debouncedGeocode = useDebouncedCallback(geocodeAddress, 500);

  useEffect(() => {
    if (addReturnReservation && returnDropoff) {
      debouncedGeocode(returnDropoff);
    }
  }, [returnDropoff, debouncedGeocode, addReturnReservation]);

  const onSubmit = async (data: ReturnTrip) => {
    setIsLoading(true);
    setMessage(null);
    try {
      // Update BookingContext with returnTrip
      updateBookingData({
        returnTrip: data,
        step: 5,
      });

      // Prepare payload
      const payload = {
        ...bookingData,
        returnTrip: data,
        step: 5,
      };

      // Send API request
      await axios.post("/reservations/api/send-notifications", payload);
      setIsLoading(false);
      setMessage({
        type: "success",
        text: "Your booking has been successfully confirmed! Payment processed and notifications sent.",
        bookingId: bookingData.bookingId,
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      setIsLoading(false);
      setMessage({
        type: "failure",
        text: "Error processing booking. Please try again.",
      });
    }
  };

  const confirmWithoutReturnTrip = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      // Ensure no returnTrip
      updateBookingData({
        returnTrip: undefined,
        step: 5,
      });

      // Send API request
      await axios.post("/reservations/api/send-notifications", {
        ...bookingData,
        returnTrip: undefined,
        step: 5,
      });
      setIsLoading(false);
      setMessage({
        type: "success",
        text: "Your booking has been successfully confirmed! Payment processed and notifications sent.",
        bookingId: bookingData.bookingId,
      });
    } catch (error) {
      console.error("Error confirming booking:", error);
      setIsLoading(false);
      setMessage({
        type: "failure",
        text: "Error processing booking. Please try again.",
      });
    }
  };

  const handleDismiss = () => {
    if (message?.type === "success") {
      window.location.href = "https://metrodtw.wizardcomm.in/";
      updateBookingData({
        bookingId: "",
        step: 1,
        customer: { name: "", email: "", phone: "", countryCode: "" },
        trip: {
          pickup: "",
          dropoff: "",
          passengers: 0,
          kids: 0,
          bags: 0,
          dateTime: "",
          hourly: false,
          durationHours: 0,
          durationMinutes: 0,
          stops: [],
          distance: "0.0 km",
        },
        car: {
          type: "",
          hourlyRate: 0,
          transferRate: 0,
          quantity: 1,
          capacity: 1,
        },
        payment: {
          method: "credit",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          cardholderName: "",
          billingPostalCode: "",
          specialInstructions: "",
        },
        returnTrip: undefined,
      });
    }
    setMessage(null);
  };

  const handleRetry = () => {
    setMessage(null);
  };

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto bg-white dark:bg-[#181818] p-4 sm:p-6 rounded-2xl flex flex-col text-gray-900 dark:text-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="booking-summary"
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
      <div className="flex-1 space-y-6">
        <h2
          id="booking-summary"
          className="text-2xl font-medium text-center dark:text-gray-100"
        >
          Booking Summary
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Review your booking details before proceeding to confirmation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-sm">
              Booking ID
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-base">
              {bookingData.bookingId}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-sm">
              Customer Name
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-base">
              {bookingData.customer.name}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-sm">
              Customer Email
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-base">
              {bookingData.customer.email}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-sm">
              Customer Phone
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-base">
              `${bookingData.customer.countryCode}${bookingData.customer.phone}`
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-sm">Pickup</span>
            <span className="block text-gray-700 dark:text-gray-300 text-base">
              {bookingData.trip.pickup}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-sm">
              Flight Number
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-base">
              {bookingData.trip.flightnumber || "N/A"}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-sm">
              Dropoff
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-base">
              {bookingData.trip.dropoff}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-sm">
              Date & Time
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-base">
              {formattedDateTime}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-sm">
              Passengers
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-base">
              {bookingData.trip.passengers}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-sm">Kids</span>
            <span className="block text-gray-700 dark:text-gray-300 text-base">
              {bookingData.trip.kids}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-sm">Bags</span>
            <span className="block text-gray-700 dark:text-gray-300 text-base">
              {bookingData.trip.bags}
            </span>
          </div>
          {bookingData.trip.hourly && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
              <span className="font-semibold text-[#33A7FF] text-sm">
                Stops
              </span>
              <span className="block text-gray-700 dark:text-gray-300 text-base">
                {stopsDisplay}
              </span>
            </div>
          )}
          {bookingData.trip.hourly && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
              <span className="font-semibold text-[#33A7FF] text-sm">
                Hours
              </span>
              <span className="block text-gray-700 dark:text-gray-300 text-base">
                {bookingData.trip.durationHours}
              </span>
            </div>
          )}
          {bookingData.trip.hourly && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
              <span className="font-semibold text-[#33A7FF] text-sm">
                Minutes
              </span>
              <span className="block text-gray-700 dark:text-gray-300 text-base">
                {bookingData.trip.durationMinutes}
              </span>
            </div>
          )}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-sm">
              Car Type
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-base">
              {bookingData.car.type}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-sm">
              Trip Type
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-base">
              {bookingData.trip.hourly ? "Hourly" : "Transfer"}
            </span>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#282929]">
            <span className="font-semibold text-[#33A7FF] text-sm">
              {bookingData.trip.hourly ? "Duration" : "Distance"}
            </span>
            <span className="block text-gray-700 dark:text-gray-300 text-base">
              {hourlyDetails}
            </span>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-[#282929] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Return Reservation
          </h3>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={addReturnReservation}
              onChange={() => {
                setAddReturnReservation(!addReturnReservation);
                if (!addReturnReservation) {
                  updateBookingData({ returnTrip: undefined });
                }
              }}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-[#181818] dark:border-gray-600"
            />
            <span className="text-base text-gray-700 dark:text-gray-300">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    type="datetime-local"
                    label="Return Date & Time"
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                    {...register("returnDateTime")}
                  />
                  {errors.returnDateTime && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {errors.returnDateTime.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="text"
                    label="Return Flight Number"
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                    placeholder="e.g., AA123"
                    {...register("returnFlightNumber")}
                  />
                  {errors.returnFlightNumber && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {errors.returnFlightNumber.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="text"
                    label="Return Drop-off Location"
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                    placeholder="Enter return drop-off location"
                    {...register("returnDropoff")}
                    onFocus={() => {
                      if (window.google) {
                        const input = document.querySelector(
                          `input[name="returnDropoff"]`
                        ) as HTMLInputElement;
                        const autocomplete =
                          new window.google.maps.places.Autocomplete(input, {
                            types: ["geocode"],
                          });
                        autocomplete.addListener("place_changed", () => {
                          const place = autocomplete.getPlace();
                          if (place.geometry?.location) {
                            const coords = {
                              lat: place.geometry.location.lat(),
                              lng: place.geometry.location.lng(),
                            };
                            setValue("returnDropoffLatLng", coords, {
                              shouldValidate: true,
                            });
                            setValue(
                              "returnDropoff",
                              place.formatted_address || "",
                              { shouldValidate: true }
                            );
                            updateBookingData({
                              returnTrip: {
                                ...getValues(),
                                returnDropoff: place.formatted_address || "",
                                returnDropoffLatLng: coords,
                              },
                            });
                          }
                        });
                      }
                    }}
                  />
                  {errors.returnDropoff && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {errors.returnDropoff.message}
                    </p>
                  )}
                </div>
              </div>
            </motion.form>
          )}
        </div>

        <div className="bg-gray-100 dark:bg-[#282929] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Terms & Conditions
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Please review all booking details carefully before confirming. By
            proceeding, you agree to our ride policy, cancellation terms, and
            data use agreement.
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 p-4">
        <Button
          type="button"
          variant="outline"
          className="px-6 py-2 bg-[#002e52] text-white rounded-md hover:bg-[#00518F] dark:bg-[#6b6f71] dark:hover:bg-[#00518F] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => updateBookingData({ step: bookingData.step - 1 })}
          disabled={bookingData.step === 1}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="solid"
          className={`px-6 py-2 rounded-md font-semibold transition-colors ${
            isLoading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-[#33A7FF] text-white hover:bg-[#00518F] dark:bg-[#33A7FF] dark:hover:bg-[#00518F]"
          }`}
          onClick={() => {
            if (addReturnReservation) {
              handleSubmit(onSubmit)();
            } else {
              confirmWithoutReturnTrip();
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-5 w-5 inline-block" />
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import Step1Form from "@/components/Step1Form";
import Step2Form from "@/components/Step2Form";
import Step3Form from "@/components/Step3Form";
import Step4Form from "@/components/Step4Form";
import DefaultStepper from "@/components/DefaultStepper";
import SummaryView from "@/components/Summary";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function RidePage() {
  const { bookingData, updateBookingData } = useBooking();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate booking ID on mount
  useEffect(() => {
    const companyPrefix = "MDS";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `${companyPrefix}${randomNum.toString().padStart(4, "0")}`;
    updateBookingData({ bookingId });
  }, []);

  // Handle "Prev" button
  const handlePrev = () => {
    if (bookingData.step > 1) {
      updateBookingData({ step: bookingData.step - 1 });
      setError(null);
    }
  };

  // Handle "Next" button
  const handleNext = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (bookingData.step <= 4 && formRef.current) {
        formRef.current.requestSubmit(); // Trigger form submission for Steps 1–4
      } else if (bookingData.step === 5) {
        // Step 5: Send notifications and confirm booking
        await axios.post("/reservations/api/send-notifications", {
          ...bookingData,
        });

        alert("✅ Booking confirmed! Payment processed and notifications sent.");
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
        window.location.href = "/reservations/"; // Redirect to home
      }
    } catch (error) {
      console.error("Error:", error);
      setError("⚠️ Error processing booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center dark:text-gray-100 mb-4">
        Book Your Reservations
      </h3>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl w-full max-w-2xl h-[100vh] max-h-dvh flex flex-col overflow-hidden transition-colors duration-300"
      >
        {/* Stepper Header */}
        <div className="p-2 flex items-center justify-center">
          <DefaultStepper />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4">
          {bookingData.step === 1 && <Step1Form formRef={formRef} />}
          {bookingData.step === 2 && <Step2Form formRef={formRef} />}
          {bookingData.step === 3 && <Step3Form formRef={formRef} />}
          {bookingData.step === 4 && <Step4Form formRef={formRef} />}
          {bookingData.step === 5 && <SummaryView />}
          {error && (
            <p className="text-red-500 text-sm font-medium text-center mt-4">
              {error}
            </p>
          )}
        </div>

        {/* Consolidated Buttons */}
        <div className="bottom-0 bg-white w-full flex justify-center items-center gap-4 p-4 dark:bg-gray-800">
          <Button
            type="button"
            variant="outline"
            className={`w-auto pxa="true" px-6 py-2 bg-[#002e52] text-white rounded-md hover:bg-[#00518F] dark:bg-[#002e52] dark:text-white dark:hover:bg-[#00518F] ${
              bookingData.step === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handlePrev}
            disabled={bookingData.step === 1}
          >
            Back
          </Button>
          <Button
            type="button"
            variant="solid"
            className={`w-auto px-6 py-2 rounded-md font-semibold transition-colors ${
              isLoading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : bookingData.step <= 4
                ? "bg-[#33A7FF] text-white hover:bg-[#00518F] dark:bg-[#33A7FF] dark:hover:bg-[#00518F]"
                : "bg-green-700 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500"
            }`}
            onClick={handleNext}
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
    </div>
  );
}
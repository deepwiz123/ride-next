"use client";

import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import Step1Form from "@/components/Step1Form";
import Step2Form from "@/components/Step2Form";
import Step3Form from "@/components/Step3Form";
import DefaultStepper from "@/components/DefaultStepper";
import Step4Form from "@/components/Step4Form";
import SummaryView from "@/components/Summary";
import { useEffect } from "react";

export default function RidePage() {
  const { bookingData, updateBookingData } = useBooking();

  useEffect(() => {
    const companyPrefix = "MDS";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `${companyPrefix}${randomNum
      .toString()
      .padStart(4, "0")}`;
    updateBookingData({ bookingId });
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-center dark:text-gray-100 mb-4">
        Book Your Journey in Simple Steps
      </h3>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl w-full max-w-2xl h-[80vh] max-h-dvh flex flex-col overflow-hidden transition-colors duration-300"
      >
        {/* Stepper Header */}
        <div className="p-2 flex items-center justify-center">
          <DefaultStepper />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 scrollbar-none">
          {bookingData.step === 1 && <Step1Form />}
          {bookingData.step === 2 && <Step2Form />}
          {bookingData.step === 3 && <Step3Form />}
          {bookingData.step === 4 && <Step4Form />}
          {bookingData.step === 5 && <SummaryView />}
        </div>
      </motion.div>
    </div>
  );
}

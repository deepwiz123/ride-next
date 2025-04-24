"use client";

import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import Step1Form from "@/components/Step1Form";
import Step2Form from "@/components/Step2Form";
import Step3Form from "@/components/Step3Form";
import Step4Summary from "@/components/Step4Summary";
import DefaultStepper from "@/components/DefaultStepper";
import Step5Payment from "@/components/Step5Payments";

export default function RidePage() {
  const { bookingData } = useBooking();

  return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 px-4 py-8 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-white/5 dark:backdrop-blur-sm border border-gray-300 dark:border-gray-700 rounded-2xl shadow-xl dark:shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden transition-colors duration-300"
      >
        {/* Stepper Header */}
        <div className="p-4 flex items-center justify-center">
          <DefaultStepper />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none">
          {bookingData.step === 1 && <Step1Form />}
          {bookingData.step === 2 && <Step2Form />}
          {bookingData.step === 3 && <Step3Form />}
          {bookingData.step === 4 && <Step4Summary />}
          {bookingData.step === 5 && <Step5Payment />}
        </div>

        
      </motion.div>
    </div>
  );
}

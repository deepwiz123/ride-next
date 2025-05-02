"use client";

import { motion } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./Button";

type MessageCardProps = {
  type: "success" | "failure";
  message: string;
  bookingId?: string;
  onDismiss: () => void;
  onRetry?: () => void;
};

export default function MessageCard({
  type,
  message,
  bookingId,
  onDismiss,
  onRetry,
}: MessageCardProps) {
  const isSuccess = type === "success";

  return (
    <motion.div
      className={`fixed top-2 left-1/2 -translate-x-1/2 w-[90vw] max-w-xs sm:top-4 sm:right-4 sm:left-auto sm:translate-x-0 sm:max-w-sm sm:w-auto z-50 border rounded-lg p-3 sm:p-4 shadow-lg ${
        isSuccess
          ? "bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700"
          : "bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700"
      }`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {isSuccess ? (
          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
        ) : (
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
        )}
        <div className="flex-1">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
            {isSuccess ? "Booking Confirmed" : "Booking Failed"}
          </h3>
          <p className="text-2xs sm:text-xs text-gray-700 dark:text-gray-300 mt-1">
            {message}
          </p>
          {bookingId && (
            <p className="text-2xs sm:text-xs text-gray-700 dark:text-gray-300 mt-1">
              <span className="font-semibold text-[#33A7FF] text-2xs sm:text-xs">
                Booking ID:
              </span>{" "}
              <span className="text-xs sm:text-sm">{bookingId}</span>
            </p>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-end gap-2">
        {isSuccess ? (
          <Button
            onClick={onDismiss}
            className="bg-green-600 hover:bg-green-700 text-white text-2xs sm:text-xs px-3 sm:px-4 py-2 rounded-md"
          >
            Go Back
          </Button>
        ) : (
          <Button
            onClick={onRetry}
            className="bg-red-600 hover:bg-red-700 text-white text-2xs sm:text-xs px-3 sm:px-4 py-2 rounded-md"
          >
            Retry
          </Button>
        )}
      </div>
    </motion.div>
  );
}
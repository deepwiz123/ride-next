"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { paymentSchema } from "@/lib/schema";
import { useBooking } from "@/context/BookingContext";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useState } from "react";
import z from "zod";
import { RefObject } from "react";

type PaymentForm = z.infer<typeof paymentSchema>;

type Step4FormProps = {
  formRef: RefObject<HTMLFormElement>;
};

export default function Step4Form({ formRef }: Step4FormProps) {
  const { bookingData, updateBookingData } = useBooking();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: bookingData.payment,
    mode: "onBlur",
  });

  const handleConfirm = (data: PaymentForm) => {
    updateBookingData({ payment: data, step: 5 });
  };

  return (
    <motion.div
      className="w-full max-w-2xl mb-3 mx-auto bg-white rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col text-gray-900 dark:bg-[#181818] dark:text-gray-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Scrollable Content */}
      <div className="flex-1 p-4">
        <div className="flex items-center gap-3 justify-center">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-center dark:text-gray-100 mb-4">
            Enter Your Payment Details
          </h3>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit(handleConfirm)}
          className="space-y-4 sm:space-y-6"
        >
          <div className="flex flex-col gap-4 sm:gap-6 sm:grid sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                Payment Method
              </label>
              <select
                {...register("method")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black dark:bg-[#181818] dark:border-gray-600 dark:text-white"
              >
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
              </select>
              {errors.method && (
                <p className="text-xs sm:text-sm text-red-500 dark:text-red-400">
                  {errors.method.message}
                </p>
              )}
            </div>
            <Input
              label="Card Number"
              type="text"
              maxLength={16}
              placeholder="1234 5678 9012 3456"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              {...register("cardNumber")}
              error={errors.cardNumber}
            />
            <Input
              label="Expiry Date (MM/YY)"
              type="text"
              placeholder="MM/YY"
              maxLength={5}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              {...register("expiryDate")}
              error={errors.expiryDate}
            />
            <Input
              label="CVV"
              type="text"
              maxLength={4}
              placeholder="123"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              {...register("cvv")}
              error={errors.cvv}
            />
            <div className="flex flex-col">
              <Input
                label="Card Holder Name"
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                {...register("cardholderName")}
                error={errors.cardholderName}
              />
            </div>
            <Input
              label="Billing Postal Code"
              type="text"
              maxLength={10}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              {...register("billingPostalCode")}
              error={errors.billingPostalCode}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
              Special Instructions
            </label>
            <textarea
              {...register("specialInstructions")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              rows={4}
            />
            {errors.specialInstructions && (
              <p className="text-xs sm:text-sm text-red-500 dark:text-red-400">
                {errors.specialInstructions.message}
              </p>
            )}
          </div>
        </form>

        {/* Fare Display */}
        <div className="mt-6 flex justify-center">
          <div className="text-center">
            <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
              Total Fare
            </span>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
              ${bookingData.fare.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

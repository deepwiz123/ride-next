"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useBooking } from "../context/BookingContext";
import { Customer } from "../types/booking";
import { customerSchema } from "@/lib/schema";
import { Input } from "@/components/ui/Input";
import { RefObject } from "react";

// List of country codes with labels
const countryCodes = [
  { code: "+1", label: "United States (+1)", key: "+1-US" },
  { code: "+44", label: "United Kingdom (+44)", key: "+44-UK" },
  { code: "+373", label: "Moldova, Republic of (+373)", key: "+373-MD" },
];

type Step1FormProps = {
  formRef: RefObject<HTMLFormElement>;
};

export default function Step1Form({ formRef }: Step1FormProps) {
  const { updateBookingData, bookingData } = useBooking();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Customer>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: bookingData.customer.name || "",
      email: bookingData.customer.email || "",
      phone: bookingData.customer.phone || "",
      countryCode: bookingData.customer.countryCode || "+1",
    },
  });

  // const phoneValue = watch("phone", "");
  // const countryCodeValue = watch("countryCode", countryCodes[0].code);

  const onSubmit = (data: Customer) => {
    updateBookingData({ customer: data, step: 2 });
  };

  return (
    <motion.div
      className="w-full mx-auto bg-white rounded-2xl p-2 sm:p-6 flex flex-col text-gray-900 dark:bg-gray-800 dark:text-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scrollable Content */}
      <div className="flex-1 px-4 py-2 gap-2">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-center dark:text-gray-100 mb-8">
          Enter Your Contact Details
        </h3>

        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-4 sm:gap-6 flex-col-440">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              {...register("name")}
              error={errors.name}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              {...register("email")}
              error={errors.email}
            />
            <div className="flex flex-col">
              <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <select
                  className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                  {...register("countryCode")}
                >
                  {countryCodes.map((country) => (
                    <option key={country.key} value={country.code}>
                      {country.code}
                    </option>
                  ))}
                </select>
                <Input
                  type="text"
                  placeholder="Enter your phone number"
                  minLength={7}
                  maxLength={15}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                  {...register("phone")}
                  error={errors.phone}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
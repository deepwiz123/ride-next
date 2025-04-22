"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useBooking } from "../context/BookingContext";
import { Customer } from "../types/booking";
import { customerSchema } from "@/lib/schema"; // Adjusted path
import { Input } from "@/components/ui/Input"; // Adjusted path
import { Button } from "@/components/ui/Button"; // Adjusted path

// List of country codes with labels
const countryCodes = [
  { code: "+1", label: "United States (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+91", label: "India (+91)" },
  { code: "+81", label: "Japan (+81)" },
  { code: "+33", label: "France (+33)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+86", label: "China (+86)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+34", label: "Spain (+34)" },
  { code: "+39", label: "Italy (+39)" },
];

export default function Step1Form() {
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
      name: "",
      email: "",
      phone: "", // Will be updated with country code
    },
  });

  // Watch the phone number input to combine with country code
  const phoneValue = watch("phone", "");
  const countryCodeValue = watch("countryCode", countryCodes[0].code); // Default to +1

  const onSubmit = (data: Customer) => {
    // Combine country code and phone number
    const fullPhoneNumber = `${countryCodeValue}${phoneValue}`;
    const updatedData = { ...data, phone: fullPhoneNumber };
    updateBookingData({ customer: updatedData, step: 2 });
  };

  const handlePrev = () => {
    // Only decrement step if greater than 1 (Step 1 is the minimum)
    if (bookingData.step > 1) {
      updateBookingData({ step: bookingData.step - 1 });
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <h2 className="text-2xl text-center mb-8 font-bold">Passenger Info</h2>
      <Input
        label="Full Name"
        placeholder="Enter your full name"
        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400"
        {...register("name")}
        error={errors.name}
      />
      <Input
        label="Email"
        placeholder="Enter your email"
        type="email"
        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400"
        {...register("email")}
        error={errors.email}
      />
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-white">Phone Number</label>
        <div className="flex items-center gap-2">
          <motion.select
            className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
            {...register("countryCode")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code}
              </option>
            ))}
          </motion.select>
          <Input
            placeholder="Enter your phone number"
            {...register("phone")}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400"
          />
        </div>
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          className="w-auto px-6 py-2 bg-transparent text-none rounded-md"
          onClick={handlePrev}
        >
        </Button>
        <Button type="submit" variant="solid" className="w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Next
        </Button>
      </div>
    </motion.form>
  );
}
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
  { code: "+55", label: "Brazil (+55)" },
  { code: "+7", label: "Russian Federation (+7)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+82", label: "Korea, Republic of (+82)" },
  { code: "+52", label: "Mexico (+52)" },
  { code: "+1", label: "Canada (+1)" },
  { code: "+54", label: "Argentina (+54)" },
  { code: "+31", label: "Netherlands (+31)" },
  { code: "+46", label: "Sweden (+46)" },
  { code: "+41", label: "Switzerland (+41)" },
  { code: "+32", label: "Belgium (+32)" },
  { code: "+90", label: "Turkey (+90)" },
  { code: "+48", label: "Poland (+48)" },
  { code: "+47", label: "Norway (+47)" },
  { code: "+358", label: "Finland (+358)" },
  { code: "+45", label: "Denmark (+45)" },
  { code: "+353", label: "Ireland (+353)" },
  { code: "+351", label: "Portugal (+351)" },
  { code: "+30", label: "Greece (+30)" },
  { code: "+64", label: "New Zealand (+64)" },
  { code: "+66", label: "Thailand (+66)" },
  { code: "+60", label: "Malaysia (+60)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+852", label: "Hong Kong (+852)" },
  { code: "+62", label: "Indonesia (+62)" },
  { code: "+63", label: "Philippines (+63)" },
  { code: "+20", label: "Egypt (+20)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+971", label: "United Arab Emirates (+971)" },
  { code: "+972", label: "Israel (+972)" },
  { code: "+92", label: "Pakistan (+92)" },
  { code: "+234", label: "Nigeria (+234)" },
  { code: "+254", label: "Kenya (+254)" },
  { code: "+233", label: "Ghana (+233)" },
  { code: "+212", label: "Morocco (+212)" },
  { code: "+216", label: "Tunisia (+216)" },
  { code: "+213", label: "Algeria (+213)" },
  { code: "+56", label: "Chile (+56)" },
  { code: "+57", label: "Colombia (+57)" },
  { code: "+51", label: "Peru (+51)" },
  { code: "+58", label: "Venezuela, Bolivarian Republic of (+58)" },
  { code: "+380", label: "Ukraine (+380)" },
  { code: "+40", label: "Romania (+40)" },
  { code: "+36", label: "Hungary (+36)" },
  { code: "+420", label: "Czechia (+420)" },
  { code: "+421", label: "Slovakia (+421)" },
  { code: "+359", label: "Bulgaria (+359)" },
  { code: "+385", label: "Croatia (+385)" },
  { code: "+386", label: "Slovenia (+386)" },
  { code: "+381", label: "Serbia (+381)" },
  { code: "+84", label: "Viet Nam (+84)" },
  { code: "+880", label: "Bangladesh (+880)" },
  { code: "+94", label: "Sri Lanka (+94)" },
  { code: "+977", label: "Nepal (+977)" },
  { code: "+98", label: "Iran, Islamic Republic of (+98)" },
  { code: "+964", label: "Iraq (+964)" },
  { code: "+963", label: "Syrian Arab Republic (+963)" },
  { code: "+962", label: "Jordan (+962)" },
  { code: "+961", label: "Lebanon (+961)" },
  { code: "+965", label: "Kuwait (+965)" },
  { code: "+974", label: "Qatar (+974)" },
  { code: "+968", label: "Oman (+968)" },
  { code: "+973", label: "Bahrain (+973)" },
  { code: "+994", label: "Azerbaijan (+994)" },
  { code: "+7", label: "Kazakhstan (+7)" },
  { code: "+995", label: "Georgia (+995)" },
  { code: "+374", label: "Armenia (+374)" },
  { code: "+998", label: "Uzbekistan (+998)" },
  { code: "+993", label: "Turkmenistan (+993)" },
  { code: "+996", label: "Kyrgyzstan (+996)" },
  { code: "+976", label: "Mongolia (+976)" },
  { code: "+93", label: "Afghanistan (+93)" },
  { code: "+95", label: "Myanmar (+95)" },
  { code: "+855", label: "Cambodia (+855)" },
  { code: "+856", label: "Lao People's Democratic Republic (+856)" },
  { code: "+975", label: "Bhutan (+975)" },
  { code: "+354", label: "Iceland (+354)" },
  { code: "+352", label: "Luxembourg (+352)" },
  { code: "+423", label: "Liechtenstein (+423)" },
  { code: "+356", label: "Malta (+356)" },
  { code: "+357", label: "Cyprus (+357)" },
  { code: "+372", label: "Estonia (+372)" },
  { code: "+371", label: "Latvia (+371)" },
  { code: "+370", label: "Lithuania (+370)" },
  { code: "+375", label: "Belarus (+375)" },
  { code: "+373", label: "Moldova, Republic of (+373)" },
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
      name: bookingData.customer.name || "",
      email: bookingData.customer.email || "",
      phone: bookingData.customer.phone || "", // Will be updated with country code
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
        <label className="block text-sm font-medium text-gray-700 dark:text-white">
          Phone Number
        </label>
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
            type="number"
            placeholder="Enter your phone number"
            {...register("phone")}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400"
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          className="w-auto px-6 py-2 bg-transparent text-none rounded-md"
          onClick={handlePrev}
        >{bookingData.step > 1 ? "Prev": ""}</Button>
        <Button
          type="submit"
          variant="solid"
          className="w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Next
        </Button>
      </div>
    </motion.form>
  );
}

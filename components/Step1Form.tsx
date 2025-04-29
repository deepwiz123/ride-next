"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useBooking } from "../context/BookingContext";
import { Customer } from "../types/booking";
import { customerSchema } from "@/lib/schema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// List of country codes with labels
const countryCodes = [
  { code: "+1", label: "United States (+1)", key: "+1-US" },
  { code: "+44", label: "United Kingdom (+44)", key: "+44-UK" },
  { code: "+91", label: "India (+91)", key: "+91-IN" },
  { code: "+81", label: "Japan (+81)", key: "+81-JP" },
  { code: "+33", label: "France (+33)", key: "+33-FR" },
  { code: "+49", label: "Germany (+49)", key: "+49-DE" },
  { code: "+86", label: "China (+86)", key: "+86-CN" },
  { code: "+61", label: "Australia (+61)", key: "+61-AU" },
  { code: "+34", label: "Spain (+34)", key: "+34-ES" },
  { code: "+39", label: "Italy (+39)", key: "+39-IT" },
  { code: "+55", label: "Brazil (+55)", key: "+55-BR" },
  { code: "+7", label: "Russian Federation (+7)", key: "+7-RU" },
  { code: "+27", label: "South Africa (+27)", key: "+27-ZA" },
  { code: "+82", label: "Korea, Republic of (+82)", key: "+82-KR" },
  { code: "+52", label: "Mexico (+52)", key: "+52-MX" },
  { code: "+1", label: "Canada (+1)", key: "+1-CA" },
  { code: "+54", label: "Argentina (+54)", key: "+54-AR" },
  { code: "+31", label: "Netherlands (+31)", key: "+31-NL" },
  { code: "+46", label: "Sweden (+46)", key: "+46-SE" },
  { code: "+41", label: "Switzerland (+41)", key: "+41-CH" },
  { code: "+32", label: "Belgium (+32)", key: "+32-BE" },
  { code: "+90", label: "Turkey (+90)", key: "+90-TR" },
  { code: "+48", label: "Poland (+48)", key: "+48-PL" },
  { code: "+47", label: "Norway (+47)", key: "+47-NO" },
  { code: "+358", label: "Finland (+358)", key: "+358-FI" },
  { code: "+45", label: "Denmark (+45)", key: "+45-DK" },
  { code: "+353", label: "Ireland (+353)", key: "+353-IE" },
  { code: "+351", label: "Portugal (+351)", key: "+351-PT" },
  { code: "+30", label: "Greece (+30)", key: "+30-GR" },
  { code: "+64", label: "New Zealand (+64)", key: "+64-NZ" },
  { code: "+66", label: "Thailand (+66)", key: "+66-TH" },
  { code: "+60", label: "Malaysia (+60)", key: "+60-MY" },
  { code: "+65", label: "Singapore (+65)", key: "+65-SG" },
  { code: "+852", label: "Hong Kong (+852)", key: "+852-HK" },
  { code: "+62", label: "Indonesia (+62)", key: "+62-ID" },
  { code: "+63", label: "Philippines (+63)", key: "+63-PH" },
  { code: "+20", label: "Egypt (+20)", key: "+20-EG" },
  { code: "+966", label: "Saudi Arabia (+966)", key: "+966-SA" },
  { code: "+971", label: "United Arab Emirates (+971)", key: "+971-AE" },
  { code: "+972", label: "Israel (+972)", key: "+972-IL" },
  { code: "+92", label: "Pakistan (+92)", key: "+92-PK" },
  { code: "+234", label: "Nigeria (+234)", key: "+234-NG" },
  { code: "+254", label: "Kenya (+254)", key: "+254-KE" },
  { code: "+233", label: "Ghana (+233)", key: "+233-GH" },
  { code: "+212", label: "Morocco (+212)", key: "+212-MA" },
  { code: "+216", label: "Tunisia (+216)", key: "+216-TN" },
  { code: "+213", label: "Algeria (+213)", key: "+213-DZ" },
  { code: "+56", label: "Chile (+56)", key: "+56-CL" },
  { code: "+57", label: "Colombia (+57)", key: "+57-CO" },
  { code: "+51", label: "Peru (+51)", key: "+51-PE" },
  { code: "+58", label: "Venezuela, Bolivarian Republic of (+58)", key: "+58-VE" },
  { code: "+380", label: "Ukraine (+380)", key: "+380-UA" },
  { code: "+40", label: "Romania (+40)", key: "+40-RO" },
  { code: "+36", label: "Hungary (+36)", key: "+36-HU" },
  { code: "+420", label: "Czechia (+420)", key: "+420-CZ" },
  { code: "+421", label: "Slovakia (+421)", key: "+421-SK" },
  { code: "+359", label: "Bulgaria (+359)", key: "+359-BG" },
  { code: "+385", label: "Croatia (+385)", key: "+385-HR" },
  { code: "+386", label: "Slovenia (+386)", key: "+386-SI" },
  { code: "+381", label: "Serbia (+381)", key: "+381-RS" },
  { code: "+84", label: "Viet Nam (+84)", key: "+84-VN" },
  { code: "+880", label: "Bangladesh (+880)", key: "+880-BD" },
  { code: "+94", label: "Sri Lanka (+94)", key: "+94-LK" },
  { code: "+977", label: "Nepal (+977)", key: "+977-NP" },
  { code: "+98", label: "Iran, Islamic Republic of (+98)", key: "+98-IR" },
  { code: "+964", label: "Iraq (+964)", key: "+964-IQ" },
  { code: "+963", label: "Syrian Arab Republic (+963)", key: "+963-SY" },
  { code: "+962", label: "Jordan (+962)", key: "+962-JO" },
  { code: "+961", label: "Lebanon (+961)", key: "+961-LB" },
  { code: "+965", label: "Kuwait (+965)", key: "+965-KW" },
  { code: "+974", label: "Qatar (+974)", key: "+974-QA" },
  { code: "+968", label: "Oman (+968)", key: "+968-OM" },
  { code: "+973", label: "Bahrain (+973)", key: "+973-BH" },
  { code: "+994", label: "Azerbaijan (+994)", key: "+994-AZ" },
  { code: "+7", label: "Kazakhstan (+7)", key: "+7-KZ" },
  { code: "+995", label: "Georgia (+995)", key: "+995-GE" },
  { code: "+374", label: "Armenia (+374)", key: "+374-AM" },
  { code: "+998", label: "Uzbekistan (+998)", key: "+998-UZ" },
  { code: "+993", label: "Turkmenistan (+993)", key: "+993-TM" },
  { code: "+996", label: "Kyrgyzstan (+996)", key: "+996-KG" },
  { code: "+976", label: "Mongolia (+976)", key: "+976-MN" },
  { code: "+93", label: "Afghanistan (+93)", key: "+93-AF" },
  { code: "+95", label: "Myanmar (+95)", key: "+95-MM" },
  { code: "+855", label: "Cambodia (+855)", key: "+855-KH" },
  { code: "+856", label: "Lao People's Democratic Republic (+856)", key: "+856-LA" },
  { code: "+975", label: "Bhutan (+975)", key: "+975-BT" },
  { code: "+354", label: "Iceland (+354)", key: "+354-IS" },
  { code: "+352", label: "Luxembourg (+352)", key: "+352-LU" },
  { code: "+423", label: "Liechtenstein (+423)", key: "+423-LI" },
  { code: "+356", label: "Malta (+356)", key: "+356-MT" },
  { code: "+357", label: "Cyprus (+357)", key: "+357-CY" },
  { code: "+372", label: "Estonia (+372)", key: "+372-EE" },
  { code: "+371", label: "Latvia (+371)", key: "+371-LV" },
  { code: "+370", label: "Lithuania (+370)", key: "+370-LT" },
  { code: "+375", label: "Belarus (+375)", key: "+375-BY" },
  { code: "+373", label: "Moldova, Republic of (+373)", key: "+373-MD" },
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
      phone: bookingData.customer.phone || "",
      countryCode: bookingData.customer.countryCode || "+1",
    },
  });

  const phoneValue = watch("phone", "");
  const countryCodeValue = watch("countryCode", countryCodes[0].code);

  const onSubmit = (data: Customer) => {
    updateBookingData({ customer: data, step: 2 });
  };

  const handlePrev = () => {
    if (bookingData.step > 1) {
      updateBookingData({ step: bookingData.step - 1 });
    }
  };

  return (
    <motion.div
      className="w-full mx-auto bg-white rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col text-gray-900 dark:bg-gray-800 dark:text-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scrollable Content */}
      <div className="flex-1 space-y-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center dark:text-gray-100">
          Passenger Info
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                  {...register("phone")}
                  error={errors.phone}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Sticky Buttons */}
      <div className="sticky bottom-0 bg-white w-full flex justify-center items-center gap-2 rounded-md p-4 dark:bg-gray-800 ">
        <Button
          type="button"
          variant="outline"
          className="w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 opacity-50 cursor-not-allowed"
          onClick={handlePrev}
          disabled={true}
        >
          Prev
        </Button>
        <Button
          variant="solid"
          className="w-auto px-6 py-2 bg-[#33A7FF] text-white rounded-md hover:bg-[#00518F] dark:bg-[#33A7FF] dark:hover:bg-[#00518F]"
          onClick={handleSubmit(onSubmit)}
        >
          Next
        </Button>
      </div>

    </motion.div>
  );
}
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { paymentSchema } from "@/lib/schema";
import { useBooking } from "@/context/BookingContext";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import axios from "axios";
import { Loader2, CreditCard } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import z from "zod";

type PaymentForm = z.infer<typeof paymentSchema>;

export default function Step5Payment() {
    const { bookingData, updateBookingData } = useBooking();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PaymentForm>({
        resolver: zodResolver(paymentSchema),
        defaultValues: bookingData.payment,
        mode: "onBlur",
    });

    const handlePrev = () => {
        updateBookingData({ step: bookingData.step - 1 });
    };

    const handleConfirm = async (data: PaymentForm) => {
        setIsLoading(true);
        setError(null);

        try {
            updateBookingData({ payment: data });
            await axios.post("/reservations/api/send-notifications", {
                ...bookingData,
                payment: data,
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
                car: { type: "", quantity: 1, transferRate: 0, hourlyRate: 0, capacity: 1 },
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
            router.push("/");
        } catch (error) {
            console.error("Error:", error);
            setError("⚠️ Error processing payment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Scrollable Content */}
            <div className="flex-1 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 justify-center">
                    <CreditCard className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6 dark:text-blue-400" />
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight dark:text-gray-100">
                        Payment Details
                    </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col gap-4 sm:gap-6 sm:grid sm:grid-cols-2">
                        <div className="flex flex-col">
                            <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                                Payment Method
                            </label>
                            <select
                                {...register("method")}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                            {...register("cardNumber")}
                            error={errors.cardNumber}
                        />
                        <Input
                            label="Expiry Date"
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                            {...register("expiryDate")}
                            error={errors.expiryDate}
                        />
                        <Input
                            label="CVV"
                            type="text"
                            maxLength={4}
                            placeholder="123"
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                            {...register("cvv")}
                            error={errors.cvv}
                        />
                        <div className="flex flex-col">
                            <Input
                                label="Cardholder Name"
                                type="text"
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                                {...register("cardholderName")}
                                error={errors.cardholderName}
                            />
                        </div>
                        <Input
                            label="Billing Postal Code"
                            type="text"
                            maxLength={10}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                            {...register("billingPostalCode")}
                            error={errors.billingPostalCode}
                        />
                        <div className="flex flex-col">
                            <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                                Special Instructions
                            </label>
                            <textarea
                                {...register("specialInstructions")}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                                rows={4}
                            />
                            {errors.specialInstructions && (
                                <p className="text-xs sm:text-sm text-red-500 dark:text-red-400">
                                    {errors.specialInstructions.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 text-sm sm:text-base font-medium dark:text-red-400">
                            {error}
                        </p>
                    )}
                </form>
            </div>

            {/* Sticky Buttons */}
            <div className="sticky bottom-0 bg-white w-full flex justify-between items-center rounded-md p-4 dark:bg-gray-800">
                <Button
                    type="button"
                    variant="outline"
                    className="w-auto px-6 py-2 bg-[#002e52] text-white rounded-md hover:bg-[#00518F] dark:bg-[#002e52] dark:text-white dark:hover:bg-[#00518F]"
                    onClick={handlePrev}
                >
                    Prev
                </Button>
                <Button
                    type="submit"
                    variant="solid"
                    className="w-auto px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500"
                    onClick={handleSubmit(handleConfirm)}
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" />
                        </div>
                    ) : (
                        "Confirm"
                    )}
                </Button>
            </div>

        </motion.div>
    );
}
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { carSchema } from "@/lib/schema";
import { useBooking } from "@/context/BookingContext";
import { Car } from "@/types/booking";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { RefObject } from "react";

type Step3FormProps = {
  formRef: RefObject<HTMLFormElement>;
};

export default function Step3Form({ formRef }: Step3FormProps) {
  const { updateBookingData, bookingData, calculateFare } = useBooking();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    resetField,
    formState: { errors },
  } = useForm<Car>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      type: bookingData.car.type || "",
      transferRate: bookingData.car.transferRate || 0,
      hourlyRate: bookingData.car.hourlyRate || 0,
      quantity: bookingData.car.quantity || 1,
      capacity: bookingData.car.capacity || 0,
    },
    mode: "onBlur",
  });

  const [selectedCar, setSelectedCar] = useState<string | null>(
    bookingData.car.type || null
  );
  const [noCarSelected, setNoCarSelected] = useState(false);

  const cars = [
    {
      type: "Lincoln MKT Sedan",
      transferRate: 70,
      hourlyRate: 12,
      capacity: 3,
      image: "/reservations/Lincoln MKT Sedan.png",
    },
    {
      type: "Chevy Suburban",
      transferRate: 100,
      hourlyRate: 16,
      capacity: 6,
      image: "/reservations/Chevy Suburban.png",
    },
    {
      type: "Cadillac Escalade",
      transferRate: 45,
      hourlyRate: 8,
      capacity: 6,
      image: "/reservations/Cadillac Escalade.png",
    },
    {
      type: "Lincoln Navigator",
      transferRate: 120,
      hourlyRate: 20,
      capacity: 6,
      image: "/reservations/Lincoln Navigator.png",
    },
  ];

  const quantity = watch("quantity");
  const capacity = watch("capacity");

  // Scroll to top on errors
  useEffect(() => {
    const hasErrors =
      Object.keys(errors).length > 0 ||
      quantity * (capacity || 1) < (bookingData.trip.passengers || 1) ||
      noCarSelected;
    if (hasErrors && containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [errors, quantity, capacity, bookingData.trip.passengers, noCarSelected]);

  const onSubmit = (data: Car) => {
    if (!selectedCar) {
      setNoCarSelected(true);
      return;
    }
    setNoCarSelected(false);
    updateBookingData({
      car: data,
      fare: calculateFare(),
      step: 4,
    });
  };

  const handleCarSelect = (car: {
    type: string;
    transferRate: number;
    hourlyRate: number;
    capacity: number;
  }) => {
    if (selectedCar === car.type) {
      setSelectedCar(null);
      resetField("type");
      resetField("transferRate");
      resetField("hourlyRate");
      resetField("quantity");
      resetField("capacity");
      updateBookingData({
        car: {
          type: "",
          transferRate: 0,
          hourlyRate: 0,
          quantity: 1,
          capacity: 0,
        },
        fare: 0,
      });
    } else {
      setSelectedCar(car.type);
      setValue("type", car.type);
      setValue("transferRate", car.transferRate);
      setValue("hourlyRate", car.hourlyRate);
      setValue("quantity", bookingData.car.quantity || 1);
      setValue("capacity", car.capacity);
      updateBookingData({
        car: {
          type: car.type,
          transferRate: car.transferRate,
          hourlyRate: car.hourlyRate,
          quantity: bookingData.car.quantity || 1,
          capacity: car.capacity,
        },
        fare: calculateFare(),
      });
    }
    setNoCarSelected(false);
  };

  const handleQuantityChange = (increment: boolean) => {
    const currentQty = quantity;
    const minQty = Math.ceil(
      (bookingData.trip.passengers || 1) / (capacity || 1)
    );
    const newQty = increment ? currentQty + 1 : currentQty - 1;
    if (newQty >= minQty && newQty <= 10) {
      setValue("quantity", newQty);
      updateBookingData({
        car: { ...bookingData.car, quantity: newQty },
        fare: calculateFare(),
      });
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="w-full max-w-6xl mx-auto bg-white rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col text-gray-900 dark:bg-[#181818] dark:text-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1 p-4">
        <div className="flex items-center gap-3 justify-center">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-center dark:text-gray-100 mb-4">
            Select Your Car/Ride
          </h3>
        </div>
        <div className="p-4">
          {noCarSelected && (
            <p className="text-red-500 dark:text-red-400">
              Please select a car to proceed.
            </p>
          )}
          {errors.type && (
            <p className="text-red-500 dark:text-red-400">
              {errors.type.message}
            </p>
          )}
          {errors.quantity && (
            <p className="text-red-500 dark:text-red-400">
              {errors.quantity.message}
            </p>
          )}
          {errors.capacity && (
            <p className="text-red-500 dark:text-red-400">
              {errors.capacity.message}
            </p>
          )}
          {quantity * (capacity || 1) < (bookingData.trip.passengers || 1) && (
            <p className="text-red-500 dark:text-red-400">
              Selected cars cannot accommodate {bookingData.trip.passengers}{" "}
              passengers.
            </p>
          )}
        </div>

        <motion.form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="flex flex-col gap-4 sm:gap-6 sm:grid sm:grid-cols-2 flex-col-440">
            {cars.map((car) => (
              <motion.div
                key={car.type}
                whileHover={{ scale: 1.05 }}
                className={`border-2 rounded-xl p-2 cursor-pointer shadow-sm transition-all dark:bg-[#181818] dark:border-gray-700 ${
                  selectedCar === car.type
                    ? "border-blue-600 bg-blue-50 dark:border-blue-50 dark:bg-blue-500"
                    : "border-gray-300 bg-white dark:border-gray-600 dark:bg-[#29292991]"
                }`}
                onClick={() => handleCarSelect(car)}
              >
                <Image
                  src={car.image}
                  alt={car.type}
                  width={150}
                  height={150}
                  className="w-full rounded-md mb-2"
                />
                <div
                  className={`flex justify-between items-center rounded-md p-2`}
                >
                  {selectedCar === car.type ? (
                    <div className="flex items-center justify-center gap-2 ml-2 w-full">
                      <div className="flex items-center gap-2 w-full">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {car.type}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {car.type}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Capacity: {car.capacity}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { carSchema } from "@/lib/schema";
import { useBooking } from "@/context/BookingContext";
import { Car } from "@/types/booking";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { CarFront } from "lucide-react";
import { RefObject } from "react";

type Step3FormProps = {
  formRef: RefObject<HTMLFormElement>;
};

export default function Step3Form({ formRef }: Step3FormProps) {
  const { updateBookingData, bookingData, calculateFare } = useBooking();
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

  const [selectedCar, setSelectedCar] = useState<string>(
    bookingData.car.type || ""
  );

  const cars = [
    {
      type: "SUV",
      transferRate: 70,
      hourlyRate: 12,
      capacity: 5,
      image: "/reservations/11452727.png",
    },
    {
      type: "Van",
      transferRate: 100,
      hourlyRate: 16,
      capacity: 12,
      image: "/reservations/11452727.png",
    },
    {
      type: "Hatchback",
      transferRate: 45,
      hourlyRate: 8,
      capacity: 4,
      image: "/reservations/11452727.png",
    },
    {
      type: "Truck",
      transferRate: 120,
      hourlyRate: 20,
      capacity: 2,
      image: "/reservations/11452727.png",
    },
    {
      type: "Luxury",
      transferRate: 150,
      hourlyRate: 25,
      capacity: 4,
      image: "/reservations/11452727.png",
    },
    {
      type: "Convertible",
      transferRate: 200,
      hourlyRate: 30,
      capacity: 2,
      image: "/reservations/11452727.png",
    },
    {
      type: "Electric",
      transferRate: 90,
      hourlyRate: 15,
      capacity: 5,
      image: "/reservations/11452727.png",
    },
    {
      type: "Compact",
      transferRate: 40,
      hourlyRate: 7,
      capacity: 4,
      image: "/reservations/11452727.png",
    },
    {
      type: "Sedan",
      transferRate: 60,
      hourlyRate: 10,
      capacity: 5,
      image: "/reservations/11452727.png",
    },
    {
      type: "Coupe",
      transferRate: 80,
      hourlyRate: 13,
      capacity: 2,
      image: "/reservations/11452727.png",
    },
    {
      type: "Wagon",
      transferRate: 55,
      hourlyRate: 9,
      capacity: 5,
      image: "/reservations/11452727.png",
    },
    {
      type: "Crossover",
      transferRate: 75,
      hourlyRate: 12,
      capacity: 5,
      image: "/reservations/11452727.png",
    },
  ];

  const onSubmit = (data: Car) => {
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
      setSelectedCar("");
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

  const quantity = watch("quantity");
  const capacity = watch("capacity");

  // useEffect(() => {
  //   const totalPassengers = bookingData.trip.passengers || 0;
  //   const requiredCars = Math.ceil(totalPassengers / (capacity || 1));
  //   if (quantity < requiredCars) {
  //     setValue("quantity", requiredCars);
  //     updateBookingData({
  //       car: { ...bookingData.car, quantity: requiredCars },
  //       fare: calculateFare(),
  //     });
  //   }
  // }, [
  //   quantity,
  //   capacity,
  //   bookingData.trip.passengers,
  //   setValue,
  //   updateBookingData,
  //   calculateFare,
  // ]);

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto bg-white rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col text-gray-900 dark:bg-[#181818] dark:text-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scrollable Content */}
      <div className="flex-1 p-4">
        <div className="flex items-center gap-3 justify-center">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-center dark:text-gray-100 mb-4">
            Select Your Car/Ride
          </h3>
        </div>
        <div className="p-4">
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
          <div className="flex flex-col gap-4 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 flex-col-440">
            {cars.map((car) => (
              <motion.div
                key={car.type}
                whileHover={{ scale: 1.05 }}
                className={`border-2 rounded-xl p-2 cursor-pointer shadow-sm transition-all dark:bg-[#181818] dark:border-gray-700 ${
                  selectedCar === car.type
                    ? "border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-[#29292991]"
                    : "border-gray-300 bg-white dark:border-gray-600 dark:bg-[#29292991]"
                }`}
                onClick={() => handleCarSelect(car)}
              >
                <Image
                  src={car.image}
                  alt={car.type}
                  width={150}
                  height={150}
                  className="w-full h-26 object-cover rounded-md mb-2"
                />
                <div className="flex justify-between items-center">
                  {selectedCar === car.type ? (
                    <div className="flex items-center justify-center gap-2 ml-2 w-full">
                      <div className="flex items-center gap-2 w-full">
                        <Input
                          label="Quantity"
                          type="number"
                          className="flex-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500"
                          {...register("quantity", { valueAsNumber: true })}
                          min={0}
                          max={10}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const qty = Number(e.target.value);
                            setValue("quantity", qty);
                            updateBookingData({
                              car: { ...bookingData.car, quantity: qty },
                              fare: calculateFare(),
                            });
                          }}
                        />
                        <div className="md:hidden flex gap-1 self-end">
                          <Button
                            type="button"
                            variant="outline"
                            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(false);
                            }}
                            disabled={quantity <= 1}
                          >
                            -
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(true);
                            }}
                            disabled={quantity >= 10}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {car.type}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {bookingData.trip.hourly
                          ? `$${car.hourlyRate}/hr`
                          : `$${car.transferRate}/transfer`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Capacity: {car.capacity} passengers
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

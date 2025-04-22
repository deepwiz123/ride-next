"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { carSchema } from "@/lib/schema";
import { useBooking } from "../context/BookingContext";
import { Car } from "../types/booking";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export default function Step3Form() {
  const { updateBookingData } = useBooking();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    resetField,
    formState: { errors },
  } = useForm<Car>({
    resolver: zodResolver(carSchema),
    defaultValues: { type: "", rate: 0, quantity: 1 },
    mode: "onBlur",
  });

  const [selectedCar, setSelectedCar] = useState<string>("");
  const { bookingData } = useBooking();

  const cars = [
    { type: "SUV", rate: 70, image: "/11452727.png" },
    { type: "Van", rate: 100, image: "/11452727.png" },
    { type: "Hatchback", rate: 45, image: "/11452727.png" },
    { type: "Truck", rate: 120, image: "/11452727.png" },
    { type: "Luxury", rate: 150, image: "/11452727.png" },
    { type: "Convertible", rate: 200, image: "/11452727.png" },
    { type: "Electric", rate: 90, image: "/11452727.png" },
    { type: "Compact", rate: 40, image: "/11452727.png" },
    { type: "Sedan", rate: 60, image: "/11452727.png" },
    { type: "Coupe", rate: 80, image: "/11452727.png" },
    { type: "Wagon", rate: 55, image: "/11452727.png" },
    { type: "Crossover", rate: 75, image: "/11452727.png" },
  ];

  const onSubmit = (data: Car) => {
    updateBookingData({ car: data, step: 4 });
  };

  const handlePrev = () => {
    updateBookingData({ step: bookingData.step - 1 });
  };

  const handleCarSelect = (car: { type: string; rate: number }) => {
    if (selectedCar === car.type) {
      setSelectedCar("");
      resetField("type");
      resetField("rate");
      setValue("quantity", 1);
    } else {
      setSelectedCar(car.type);
      setValue("type", car.type);
      setValue("rate", car.rate);
    }
  };

  const quantity = watch("quantity");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto px-4 py-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">
        Select a Car
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-6"
      >
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <motion.div
              key={car.type}
              whileHover={{ scale: 1.03 }}
              className={`border-2 rounded-xl p-4 cursor-pointer shadow-sm transition-all ${
                selectedCar === car.type
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 bg-white"
              }`}
              onClick={() => handleCarSelect(car)}
            >
              <Image
                src={car.image}
                alt={car.type}
                width={150}
                height={150}
                className="w-full h-36 object-cover rounded-md mb-4"
              />
              <div className="flex justify-between items-center">
                {selectedCar === car.type ? (
                  <div className="flex items-center justify-center gap-2 ml-2">
                    <Input
                      label="Quantity"
                      type="number"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400"
                      {...register("quantity", { valueAsNumber: true })}
                      value={quantity}
                      min={1}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg text-black font-semibold">
                      {car.type}
                    </h3>
                    {/* <p className="text-gray-600">${car.rate} / trip</p> */}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Validation Errors */}
        {errors.type && <p className="text-red-500">{errors.type.message}</p>}
        {errors.quantity && (
          <p className="text-red-500">{errors.quantity.message}</p>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            onClick={handlePrev}
          >
            Prev
          </Button>
          <Button
            type="submit"
            variant="solid"
            disabled={!selectedCar}
            className={`w-full sm:w-auto px-6 py-2 rounded-md font-semibold transition-colors ${
              selectedCar
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Next
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
// Note: The `Button` component is used here for consistency with the rest of the code. Adjust styles as necessary.

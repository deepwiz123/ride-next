"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { tripSchema } from "@/lib/schema";
import { useBooking } from "../context/BookingContext";
import { Trip, Coordinates } from "../types/booking";
import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useDebounce } from "@/hooks/useDebounce";
import { RefObject } from "react";

declare global {
  interface Window {
    google: typeof google;
  }
}

type Step2FormProps = {
  formRef: RefObject<HTMLFormElement>;
};

export default function Step2Form({ formRef }: Step2FormProps) {
  const { updateBookingData, bookingData } = useBooking();
  const [distance, setDistance] = useState<string | null>("10.50");
  const [distanceMetric, setDistanceMetric] = useState<string | undefined>("km");
  const [isHourly, setIsHourly] = useState(bookingData.trip.hourly ?? false);
  const [stopCount, setStopCount] = useState(bookingData.trip.stops?.length || 0);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService] = useState(() => new window.google.maps.DirectionsService());
  const [directionsRenderer] = useState(() => new window.google.maps.DirectionsRenderer());

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<Trip>({
    resolver: zodResolver(tripSchema) as any,
    defaultValues: {
      ...bookingData.trip,
      hourly: bookingData.trip.hourly ?? false,
      passengers: bookingData.trip.passengers || 1,
      kids: bookingData.trip.kids || 0,
      bags: bookingData.trip.bags || 0,
      dateTime: bookingData.trip.dateTime || "",
      pickup: bookingData.trip.pickup || "",
      dropoff: bookingData.trip.dropoff || "",
      stops: bookingData.trip.stops || [],
      durationHours: bookingData.trip.durationHours || 0,
      durationMinutes: bookingData.trip.durationMinutes || 0,
      distance: bookingData.trip.distance || "10.50",
    },
  });

  const pickupLatLng = watch("pickupLatLng") as Coordinates | undefined;
  const dropoffLatLng = watch("dropoffLatLng") as Coordinates | undefined;

  const debouncedPickupLatLng = useDebounce(pickupLatLng, 300);
  const debouncedDropoffLatLng = useDebounce(dropoffLatLng, 300);

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google) return;
    const newMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 13,
    });
    setMap(newMap);
    directionsRenderer.setMap(newMap);
  }, [directionsRenderer]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  const calculateDistance = useCallback(() => {
    if (debouncedPickupLatLng && debouncedDropoffLatLng && directionsService && map) {
      directionsService.route(
        {
          origin: debouncedPickupLatLng,
          destination: debouncedDropoffLatLng,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDistance(result.routes[0].legs[0].distance?.text || "Unable to calculate distance");
            updateBookingData({
              trip: {
                distance: result.routes[0].legs[0].distance?.text,
              } as Trip,
            });
          } else {
            setDistance("Unable to calculate distance");
            directionsRenderer.setDirections({ routes: [] } as any);
          }
        }
      );
    }
  }, [debouncedPickupLatLng, debouncedDropoffLatLng, directionsService, map, updateBookingData]);

  useEffect(() => {
    calculateDistance();
  }, [calculateDistance]);

  const handleTripTypeToggle = useCallback(
    (hourly: boolean) => {
      setIsHourly(hourly);
      setValue("hourly", hourly);
      if (!hourly) {
        setStopCount(0);
        setValue("stops", []);
        setValue("durationHours", 0);
        setValue("durationMinutes", 0);
      }
    },
    [setValue]
  );

  const onSubmit = (data: Trip) => {
    updateBookingData({ trip: data, step: 3 });
  };

  const addStop = () => {
    setStopCount((prev) => prev + 1);
  };

  const removeStop = (index: number) => {
    const currentStops = getValues("stops") || [];
    const updatedStops = currentStops.filter((_, i) => i !== index);
    setValue("stops", updatedStops);
    setStopCount((prev) => Math.max(prev - 1, 0));
  };

  const handlePlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult, field: "pickup" | "dropoff") => {
      if (place.geometry?.location) {
        const latLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setValue(field, place.formatted_address || "");
        setValue(`${field}LatLng`, latLng);
        updateBookingData({
          trip: {
            [field]: place.formatted_address || "",
            [`${field}LatLng`]: latLng,
          } as any,
        });
      }
    },
    [setValue, updateBookingData]
  );

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto bg-white rounded-2xl p-4 sm:p-6 flex flex-col text-gray-900 dark:bg-gray-800 dark:text-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scrollable Content */}
      <div className="flex-1 px-4 py-2 gap-2">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-center dark:text-gray-100 mb-8">
          Enter Your Trip Details
        </h3>
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex sm:flex-row bg-gray-100 dark:bg-gray-600 p-2 rounded-xl gap-2">
            <button
              type="button"
              className={`flex-1 rounded-lg font-semibold py-3 transition duration-300 ease-in-out ${
                !isHourly
                  ? "bg-[#33A7FF] text-white shadow-sm"
                  : "bg-transparent text-gray-800 dark:text-gray-100"
              }`}
              onClick={() => handleTripTypeToggle(false)}
            >
              Transfer
            </button>
            <button
              type="button"
              className={`flex-1 rounded-lg font-semibold py-3 transition duration-300 ease-in-out ${
                isHourly
                  ? "bg-[#33A7FF] text-white shadow-sm"
                  : "bg-transparent text-gray-800 dark:text-gray-100"
              }`}
              onClick={() => handleTripTypeToggle(true)}
            >
              Hourly
            </button>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 md:grid md:grid-cols-2 flex-col-440">
            <div className="flex flex-col">
              <Input
                type="text"
                label="Pickup Location"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                placeholder="Enter pickup location"
                {...register("pickup")}
                onFocus={() => {
                  const autocomplete = new window.google.maps.places.Autocomplete(
                    document.querySelector(`input[name="pickup"]`) as HTMLInputElement,
                    { types: ["geocode"] }
                  );
                  autocomplete.addListener("place_changed", () => {
                    handlePlaceSelect(autocomplete.getPlace(), "pickup");
                  });
                }}
              />
              {errors.pickup && (
                <p className="text-xs sm:text-sm text-red-500 dark:text-red-400">
                  {errors.pickup.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <Input
                type="text"
                label="Dropoff Location"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                placeholder="Enter dropoff location"
                {...register("dropoff")}
                onFocus={() => {
                  const autocomplete = new window.google.maps.places.Autocomplete(
                    document.querySelector(`input[name="dropoff"]`) as HTMLInputElement,
                    { types: ["geocode"] }
                  );
                  autocomplete.addListener("place_changed", () => {
                    handlePlaceSelect(autocomplete.getPlace(), "dropoff");
                  });
                }}
              />
              {errors.dropoff && (
                <p className="text-xs sm:text-sm text-red-500 dark:text-red-400">
                  {errors.dropoff.message}
                </p>
              )}
            </div>
          </div>

          <div
            className="flex flex-col gap-4 sm:gap-6 cursor-pointer"
            onClick={() => {
              const input = document.getElementById("dateTimeInput") as HTMLInputElement;
              input?.focus();
            }}
          >
            <Input
              label="Pickup Date & Time"
              id="dateTimeInput"
              type="datetime-local"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              placeholder="Select date and time"
              {...register("dateTime")}
              error={errors.dateTime}
            />
          </div>

          {!isHourly && distance && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">Estimated Distance:</strong>{" "}
              {distance} {distanceMetric}
            </p>
          )}
          {isHourly && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:gap-6 md:grid md:grid-cols-2 flex-col-440">
                <Input
                  label="Duration (Hours)"
                  type="number"
                  min={0}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                  {...register("durationHours", { valueAsNumber: true })}
                  error={errors.durationHours}
                />
                <Input
                  label="Duration (Minutes)"
                  type="number"
                  min={0}
                  max={59}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                  {...register("durationMinutes", { valueAsNumber: true })}
                  error={errors.durationMinutes}
                />
              </div>
              <div className="space-y-4">
                {Array.from({ length: stopCount }, (_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      label={`Stop ${index + 1}`}
                      placeholder={`Enter Stop ${index + 1} location`}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                      {...register(`stops.${index}` as const)}
                      error={errors.stops?.[index] as any}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="p-2 mt-5 bg-red-200 text-red-800 rounded-md hover:bg-red-300 dark:bg-red-300 dark:text-red-900 dark:hover:bg-red-400"
                      onClick={() => removeStop(index)}
                    >
                      <FaMinus />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  onClick={addStop}
                >
                  <FaPlus /> Add Stop
                </Button>
              </div>
            </div>
          )}
          <div className="h-[400px] w-full rounded-md overflow-hidden" ref={mapRef} />

          <div className="flex flex-col gap-4 sm:gap-6 md:grid md:grid-cols-3 flex-col-440">
            <Input
              label="Passengers"
              type="number"
              min={1}
              max={99}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              {...register("passengers", { valueAsNumber: true })}
              onKeyUp={(e) => {
                const value = Number(e.currentTarget.value);
                if (value > 99) {
                  e.currentTarget.value = "99";
                  setValue("passengers", 99, { shouldValidate: true });
                }
              }}
              error={errors.passengers}
            />
            <Input
              label="Kids"
              type="number"
              min={0}
              max={99}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              {...register("kids", { valueAsNumber: true })}
              onKeyUp={(e) => {
                const value = Number(e.currentTarget.value);
                if (value > 99) {
                  e.currentTarget.value = "99";
                  setValue("kids", 99, { shouldValidate: true });
                }
              }}
              error={errors.kids}
            />
            <Input
              label="Bags"
              type="number"
              min={0}
              max={99}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              {...register("bags", { valueAsNumber: true })}
              onKeyUp={(e) => {
                const value = Number(e.currentTarget.value);
                if (value > 99) {
                  e.currentTarget.value = "99";
                  setValue("bags", 99, { shouldValidate: true });
                }
              }}
              error={errors.bags}
            />
          </div>
        </form>
      </div>
    </motion.div>
  );
}
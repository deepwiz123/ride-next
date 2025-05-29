// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { motion } from "framer-motion";
// import { tripSchema } from "@/lib/schema";
// import { useBooking } from "../context/BookingContext";
// import { Trip, Coordinates } from "../types/booking";
// import { useState, useEffect, useCallback, useRef } from "react";
// import { Input } from "@/components/ui/Input";
// import { Button } from "@/components/ui/Button";
// import { FaPlus, FaMinus } from "react-icons/fa";
// import { useDebounce } from "@/hooks/useDebounce";
// import { RefObject } from "react";
// import MapComponent from "./ui/MapComponent";

// declare global {
//   interface Window {
//     google: typeof google;
//   }
// }

// type Step2FormProps = {
//   formRef: RefObject<HTMLFormElement>;
// };

// export default function Step2Form({ formRef }: Step2FormProps) {
//   const { updateBookingData, bookingData } = useBooking();
//   const [distance, setDistance] = useState<string | null>(
//     bookingData.trip.distance || "10.50"
//   );
//   const [distanceMetric, setDistanceMetric] = useState<string | undefined>(
//     "km"
//   );
//   const [isHourly, setIsHourly] = useState(bookingData.trip.hourly ?? false);
//   const [stopCount, setStopCount] = useState(
//     bookingData.trip.stops?.length || 0
//   );
//   const mapRef = useRef<HTMLDivElement>(null);
//   const [map, setMap] = useState<google.maps.Map | null>(null);
//   const [directionsService] = useState(
//     () => new window.google.maps.DirectionsService()
//   );
//   const [directionsRenderer] = useState(
//     () => new window.google.maps.DirectionsRenderer()
//   );

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//     getValues,
//   } = useForm<Trip>({
//     resolver: zodResolver(tripSchema) as any,
//     defaultValues: {
//       ...bookingData.trip,
//       hourly: bookingData.trip.hourly ?? false,
//       flightnumber: bookingData.trip.flightnumber || "",
//       passengers: bookingData.trip.passengers || 1,
//       kids: bookingData.trip.kids || 0,
//       bags: bookingData.trip.bags || 0,
//       dateTime: bookingData.trip.dateTime || "",
//       pickup: bookingData.trip.pickup || "",
//       dropoff: bookingData.trip.dropoff || "",
//       stops: bookingData.trip.stops || [],
//       durationHours: bookingData.trip.durationHours || 0,
//       durationMinutes: bookingData.trip.durationMinutes || 0,
//       distance: bookingData.trip.distance || "10.50",
//       pickupLatLng: bookingData.trip.pickupLatLng || undefined,
//       dropoffLatLng: bookingData.trip.dropoffLatLng || undefined,
//     },
//     mode: "onChange", // Enable onChange validation for real-time updates
//   });

//   // Watch all form fields
//   const formValues = watch();

//   // Sync form values with BookingContext on change
//   useEffect(() => {
//     updateBookingData({
//       trip: {
//         ...formValues,
//         distance: distance || formValues.distance, // Preserve calculated distance
//       },
//     });
//   }, [formValues, distance, updateBookingData]);

//   const pickupLatLng = watch("pickupLatLng") as Coordinates | undefined;
//   const dropoffLatLng = watch("dropoffLatLng") as Coordinates | undefined;

//   const debouncedPickupLatLng = useDebounce(pickupLatLng, 300);
//   const debouncedDropoffLatLng = useDebounce(dropoffLatLng, 300);

//   const initMap = useCallback(() => {
//     if (!mapRef.current || !window.google) return;
//     const newMap = new window.google.maps.Map(mapRef.current, {
//       center: { lat: 37.7749, lng: -122.4194 },
//       zoom: 10,
//     });
//     setMap(newMap);
//     directionsRenderer.setMap(newMap);
//   }, [directionsRenderer]);

//   useEffect(() => {
//     initMap();
//   }, [initMap]);

//   const calculateDistance = useCallback(() => {
//     if (
//       debouncedPickupLatLng &&
//       debouncedDropoffLatLng &&
//       directionsService &&
//       map
//     ) {
//       directionsService.route(
//         {
//           origin: debouncedPickupLatLng,
//           destination: debouncedDropoffLatLng,
//           travelMode: google.maps.TravelMode.DRIVING,
//         },
//         (result, status) => {
//           if (status === google.maps.DirectionsStatus.OK && result) {
//             const newDistance =
//               result.routes[0].legs[0].distance?.text ||
//               "Unable to calculate distance";
//             setDistance(newDistance);
//             updateBookingData({
//               trip: {
//                 distance: newDistance,
//               } as Trip,
//             });
//           } else {
//             setDistance("Unable to calculate distance");
//             directionsRenderer.setDirections({ routes: [] } as any);
//           }
//         }
//       );
//     }
//   }, [
//     debouncedPickupLatLng,
//     debouncedDropoffLatLng,
//     directionsService,
//     map,
//     updateBookingData,
//   ]);

//   useEffect(() => {
//     calculateDistance();
//   }, [calculateDistance]);

//   const handleTripTypeToggle = useCallback(
//     (hourly: boolean) => {
//       setIsHourly(hourly);
//       setValue("hourly", hourly, { shouldValidate: true });
//       if (!hourly) {
//         setStopCount(0);
//         setValue("stops", [], { shouldValidate: true });
//         setValue("durationHours", 0, { shouldValidate: true });
//         setValue("durationMinutes", 0, { shouldValidate: true });
//       }
//     },
//     [setValue]
//   );

//   const onSubmit = (data: Trip) => {
//     updateBookingData({ trip: data, step: 3 });
//   };

//   const addStop = () => {
//     setStopCount((prev) => prev + 1);
//     const currentStops = getValues("stops") || [];
//     setValue("stops", [...currentStops, ""], { shouldValidate: true });
//   };

//   const removeStop = (index: number) => {
//     const currentStops = getValues("stops") || [];
//     const updatedStops = currentStops.filter((_, i) => i !== index);
//     setValue("stops", updatedStops, { shouldValidate: true });
//     setStopCount((prev) => Math.max(prev - 1, 0));
//   };

//   const handlePlaceSelect = useCallback(
//     (place: google.maps.places.PlaceResult, field: "pickup" | "dropoff") => {
//       if (place.geometry?.location) {
//         const latLng = {
//           lat: place.geometry.location.lat(),
//           lng: place.geometry.location.lng(),
//         };
//         setValue(field, place.formatted_address || "", {
//           shouldValidate: true,
//         });
//         setValue(`${field}LatLng`, latLng, { shouldValidate: true });
//         updateBookingData({
//           trip: {
//             [field]: place.formatted_address || "",
//             [`${field}LatLng`]: latLng,
//           } as any,
//         });
//       }
//     },
//     [setValue, updateBookingData]
//   );

//   return (
//     <motion.div
//       className="w-full max-w-6xl mx-auto bg-white rounded-2xl p-4 sm:p-6 flex flex-col text-gray-900 dark:bg-[#181818] mb-2 dark:text-gray-100"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       {/* Scrollable Content */}
//       <div className="flex-1 px-4 py-2 gap-2">
//         <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-center dark:text-gray-100 mb-8">
//           Enter Your Trip Details
//         </h3>
//         <form
//           ref={formRef}
//           onSubmit={handleSubmit(onSubmit)}
//           className="space-y-6"
//         >
//           <div className="flex sm:flex-row bg-gray-100 dark:bg-gray-600 rounded-xl">
//             <button
//               type="button"
//               className={`flex-1 rounded-lg font-semibold py-3 transition duration-300 ease-in-out ${
//                 !isHourly
//                   ? "bg-[#33A7FF] text-white shadow-sm"
//                   : "bg-transparent text-gray-800 dark:text-gray-100"
//               }`}
//               onClick={() => handleTripTypeToggle(false)}
//             >
//               Transfer
//             </button>
//             <button
//               type="button"
//               className={`flex-1 rounded-lg font-semibold py-3 transition duration-300 ease-in-out ${
//                 isHourly
//                   ? "bg-[#33A7FF] text-white shadow-sm"
//                   : "bg-transparent text-gray-800 dark:text-gray-100"
//               }`}
//               onClick={() => handleTripTypeToggle(true)}
//             >
//               Hourly
//             </button>
//           </div>

//           <div className="flex flex-col gap-4 sm:gap-6 md:grid md:grid-cols-2 flex-col-440">
//             <div className="flex flex-col">
//               <Input
//                 type="text"
//                 label="Pickup Location"
//                 className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
//                 placeholder="Enter pickup location"
//                 {...register("pickup")}
//                 onFocus={() => {
//                   const autocomplete =
//                     new window.google.maps.places.Autocomplete(
//                       document.querySelector(
//                         `input[name="pickup"]`
//                       ) as HTMLInputElement,
//                       { types: ["geocode"] }
//                     );
//                   autocomplete.addListener("place_changed", () => {
//                     handlePlaceSelect(autocomplete.getPlace(), "pickup");
//                   });
//                 }}
//               />
//               {errors.pickup && (
//                 <p className="text-xs sm:text-sm text-red-500 dark:text-red-400">
//                   {errors.pickup.message}
//                 </p>
//               )}
//             </div>
//             <div className="flex flex-col">
//               <Input
//                 type="text"
//                 label="Dropoff Location"
//                 className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
//                 placeholder="Enter dropoff location"
//                 {...register("dropoff")}
//                 onFocus={() => {
//                   const autocomplete =
//                     new window.google.maps.places.Autocomplete(
//                       document.querySelector(
//                         `input[name="dropoff"]`
//                       ) as HTMLInputElement,
//                       { types: ["geocode"] }
//                     );
//                   autocomplete.addListener("place_changed", () => {
//                     handlePlaceSelect(autocomplete.getPlace(), "dropoff");
//                   });
//                 }}
//               />
//               {errors.dropoff && (
//                 <p className="text-xs sm:text-sm text-red-500 dark:text-red-400">
//                   {errors.dropoff.message}
//                 </p>
//               )}
//             </div>
//           </div>
//           <div className="flex flex-col gap-4 sm:gap-6 md:grid flex-col-440">
//             <div className="flex flex-col">
//               <Input
//                 type="text"
//                 label="Flight Number"
//                 className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
//                 placeholder="Enter Flight Number"
//                 {...register("flightnumber")}
//               />
//               {errors.flightnumber && (
//                 <p className="text-xs sm:text-sm text-red-500 dark:text-red-400">
//                   {errors.flightnumber.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div
//             className="flex flex-col gap-4 sm:gap-6 cursor-pointer"
//             onClick={() => {
//               const input = document.getElementById(
//                 "dateTimeInput"
//               ) as HTMLInputElement;
//               input?.focus();
//             }}
//           >
//             <Input
//               label="Pickup Date & Time"
//               id="dateTimeInput"
//               type="datetime-local"
//               className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-100 dark:accent-gray-100"
//               placeholder="Select date and time"
//               {...register("dateTime")}
//               error={errors.dateTime}
//             />
//           </div>

//           {/* {!isHourly && distance && (
//             <p className="text-sm text-gray-700 dark:text-gray-300">
//               <strong className="text-gray-900 dark:text-gray-100">
//                 Estimated Distance:
//               </strong>{" "}
//               {distance} {distanceMetric}
//             </p>
//           )} */}
//           {isHourly && (
//             <div className="space-y-6">
//               <div className="flex flex-col gap-4 sm:gap-6 md:grid md:grid-cols-2 flex-col-440">
//                 <Input
//                   label="Duration (Hours)"
//                   type="number"
//                   min={0}
//                   className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
//                   {...register("durationHours", { valueAsNumber: true })}
//                   error={errors.durationHours}
//                 />
//                 <Input
//                   label="Duration (Minutes)"
//                   type="number"
//                   min={0}
//                   max={59}
//                   className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
//                   {...register("durationMinutes", { valueAsNumber: true })}
//                   error={errors.durationMinutes}
//                 />
//               </div>
//               <div className="space-y-4">
//                 {Array.from({ length: stopCount }, (_, index) => (
//                   <div key={index} className="flex items-center gap-2">
//                     <Input
//                       label={`Stop ${index + 1}`}
//                       placeholder={`Enter Stop ${index + 1} location`}
//                       className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
//                       {...register(`stops.${index}` as const)}
//                       error={errors.stops?.[index] as any}
//                     />
//                     <Button
//                       type="button"
//                       variant="outline"
//                       className="p-2 mt-5 bg-red-200 text-red-800 rounded-md hover:bg-red-300 dark:bg-red-300 dark:text-red-900 dark:hover:bg-red-400"
//                       onClick={() => removeStop(index)}
//                     >
//                       <FaMinus />
//                     </Button>
//                   </div>
//                 ))}
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="w-full flex items-center justify-center gap-2 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-[#181818] dark:text-gray-100 dark:hover:bg-gray-600"
//                   onClick={addStop}
//                 >
//                   <FaPlus /> Add Stop
//                 </Button>
//               </div>
//             </div>
//           )}
//           <div className="h-[400px] w-full rounded-md overflow-hidden" ref={mapRef} />
//           {/* <div className="h-[400px] w-full rounded-md overflow-hidden">
//             <MapComponent
//               pickupLatLng={pickupLatLng}
//               dropoffLatLng={dropoffLatLng}
//               setPickupLatLng={(coords) =>
//                 setValue("pickupLatLng", coords, { shouldValidate: true })
//               }
//               setDropoffLatLng={(coords) =>
//                 setValue("dropoffLatLng", coords, { shouldValidate: true })
//               }
//               setPickupAddress={(address) =>
//                 setValue("pickup", address, { shouldValidate: true })
//               }
//               setDropoffAddress={(address) =>
//                 setValue("dropoff", address, { shouldValidate: true })
//               }
//             />
//           </div> */}

//           <div className="flex flex-col gap-4 sm:gap-6 md:grid md:grid-cols-3 flex-col-440">
//             <Input
//               label="Passengers"
//               type="number"
//               min={1}
//               max={99}
//               className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
//               {...register("passengers", { valueAsNumber: true })}
//               onKeyUp={(e) => {
//                 const value = Number(e.currentTarget.value);
//                 if (value > 99) {
//                   e.currentTarget.value = "99";
//                   setValue("passengers", 99, { shouldValidate: true });
//                 }
//               }}
//               error={errors.passengers}
//             />
//             <Input
//               label="Kids"
//               type="number"
//               min={0}
//               max={99}
//               className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
//               {...register("kids", { valueAsNumber: true })}
//               onKeyUp={(e) => {
//                 const value = Number(e.currentTarget.value);
//                 if (value > 99) {
//                   e.currentTarget.value = "99";
//                   setValue("kids", 99, { shouldValidate: true });
//                 }
//               }}
//               error={errors.kids}
//             />
//             <Input
//               label="Bags"
//               type="number"
//               min={0}
//               max={99}
//               className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
//               {...register("bags", { valueAsNumber: true })}
//               onKeyUp={(e) => {
//                 const value = Number(e.currentTarget.value);
//                 if (value > 99) {
//                   e.currentTarget.value = "99";
//                   setValue("bags", 99, { shouldValidate: true });
//                 }
//               }}
//               error={errors.bags}
//             />
//           </div>
//         </form>
//       </div>
//     </motion.div>
//   );
// }
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { tripSchema } from "@/lib/schema";
import { useBooking } from "@/context/BookingContext";
import { Trip, Coordinates } from "@/types/booking";
import { useState, useCallback, Suspense } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useDebouncedCallback } from "use-debounce";
import { RefObject } from "react";
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("./ui/MapComponent"), { ssr: false });

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
  const [isHourly, setIsHourly] = useState(bookingData.trip.hourly ?? false);
  const [stopCount, setStopCount] = useState(
    bookingData.trip.stops?.length || 0
  );
  const [distance, setDistance] = useState<string>(
    bookingData.trip.distance || "0.0 km"
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<Trip>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      ...bookingData.trip,
      hourly: bookingData.trip.hourly ?? false,
      flightnumber: bookingData.trip.flightnumber || "",
      passengers: bookingData.trip.passengers || 1,
      kids: bookingData.trip.kids || 0,
      bags: bookingData.trip.bags || 0,
      dateTime: bookingData.trip.dateTime || "",
      pickup: bookingData.trip.pickup || "",
      dropoff: bookingData.trip.dropoff || "",
      stops: bookingData.trip.stops || [],
      durationHours: bookingData.trip.durationHours || 0,
      durationMinutes: bookingData.trip.durationMinutes || 0,
      distance: bookingData.trip.distance || "0.0 km",
      pickupLatLng: bookingData.trip.pickupLatLng || undefined,
      dropoffLatLng: bookingData.trip.dropoffLatLng || undefined,
    },
    mode: "onChange",
  });

  const pickup = watch("pickup");
  const dropoff = watch("dropoff");
  const pickupLatLng = watch("pickupLatLng") as Coordinates | undefined;
  const dropoffLatLng = watch("dropoffLatLng") as Coordinates | undefined;

  // Debounce context updates to prevent infinite loop
  const debouncedUpdateBookingData = useDebouncedCallback((trip: Trip) => {
    updateBookingData({ trip });
  }, 300);

  // Update context only when specific fields change
  const handleFieldChange = useCallback(() => {
    const values = getValues();
    debouncedUpdateBookingData({
      ...values,
      distance,
    });
  }, [getValues, debouncedUpdateBookingData, distance]);

  // Calculate distance using Google Maps Directions API
  const calculateDistance = useCallback(() => {
    if (pickupLatLng && dropoffLatLng) {
      const toRad = (value: number) => (value * Math.PI) / 180;
      const R = 6371; // Earth's radius in km
      const dLat = toRad(dropoffLatLng.lat - pickupLatLng.lat);
      const dLon = toRad(dropoffLatLng.lng - pickupLatLng.lng);
      const lat1 = toRad(pickupLatLng.lat);
      const lat2 = toRad(dropoffLatLng.lat);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
          Math.sin(dLon / 2) *
          Math.cos(lat1) *
          Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const newDistance = (R * c).toFixed(1); // Distance in km, 1 decimal place

      setDistance(`${newDistance} km`);
    } else {
      setDistance("0.0 km");
    }
  }, [pickupLatLng, dropoffLatLng, debouncedUpdateBookingData]);

  // Trigger distance calculation when coordinates change
  const debouncedCalculateDistance = useDebouncedCallback(
    calculateDistance,
    500
  );

  if (pickupLatLng && dropoffLatLng) {
    debouncedCalculateDistance();
  }

  const handleTripTypeToggle = useCallback(
    (hourly: boolean) => {
      setIsHourly(hourly);
      setValue("hourly", hourly, { shouldValidate: true });
      if (!hourly) {
        setStopCount(0);
        setValue("stops", [], { shouldValidate: true });
        setValue("durationHours", 0, { shouldValidate: true });
        setValue("durationMinutes", 0, { shouldValidate: true });
      }
      handleFieldChange();
    },
    [setValue, handleFieldChange]
  );

  const onSubmit = (data: Trip) => {
    updateBookingData({ trip: { ...data, distance }, step: 3 });
  };

  const addStop = () => {
    setStopCount((prev) => prev + 1);
    const currentStops = getValues("stops") || [];
    setValue("stops", [...currentStops, ""], { shouldValidate: true });
    handleFieldChange();
  };

  const removeStop = (index: number) => {
    const currentStops = getValues("stops") || [];
    const updatedStops = currentStops.filter((_, i) => i !== index);
    setValue("stops", updatedStops, { shouldValidate: true });
    setStopCount((prev) => Math.max(prev - 1, 0));
    handleFieldChange();
  };

  const handlePlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult, field: "pickup" | "dropoff") => {
      if (place.geometry?.location) {
        const latLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setValue(field, place.formatted_address || "", {
          shouldValidate: true,
        });
        setValue(`${field}LatLng`, latLng, { shouldValidate: true });
        handleFieldChange();
      }
    },
    [setValue, handleFieldChange]
  );

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto bg-white rounded-2xl p-4 sm:p-6 flex flex-col text-gray-900 dark:bg-[#181818] dark:text-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="trip-details"
    >
      <div className="flex-1 space-y-6">
        <h3
          id="trip-details"
          className="text-2xl font-medium text-center dark:text-gray-100"
        >
          Enter Your Trip Details
        </h3>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="flex bg-gray-100 dark:bg-gray-600 rounded-xl">
            <button
              type="button"
              className={`flex-1 rounded-lg font-semibold py-3 transition ${
                !isHourly
                  ? "bg-[#33A7FF] text-white"
                  : "bg-transparent text-gray-800 dark:text-gray-100"
              }`}
              onClick={() => handleTripTypeToggle(false)}
              aria-pressed={!isHourly}
            >
              Transfer
            </button>
            <button
              type="button"
              className={`flex-1 rounded-lg font-semibold py-3 transition ${
                isHourly
                  ? "bg-[#33A7FF] text-white"
                  : "bg-transparent text-gray-800 dark:text-gray-100"
              }`}
              onClick={() => handleTripTypeToggle(true)}
              aria-pressed={isHourly}
            >
              Hourly
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                label="Pickup Location"
                placeholder="Enter pickup location"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                {...register("pickup")}
                onFocus={() => {
                  if (window.google) {
                    const input = document.querySelector(
                      `input[name="pickup"]`
                    ) as HTMLInputElement;
                    const autocomplete =
                      new window.google.maps.places.Autocomplete(input, {
                        types: ["geocode"],
                      });
                    autocomplete.addListener("place_changed", () =>
                      handlePlaceSelect(autocomplete.getPlace(), "pickup")
                    );
                  }
                }}
                aria-invalid={errors.pickup ? "true" : "false"}
              />
              {errors.pickup && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.pickup.message}
                </p>
              )}
            </div>
            <div>
              <Input
                type="text"
                label="Dropoff Location"
                placeholder="Enter dropoff location"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                {...register("dropoff")}
                onFocus={() => {
                  if (window.google) {
                    const input = document.querySelector(
                      `input[name="dropoff"]`
                    ) as HTMLInputElement;
                    const autocomplete =
                      new window.google.maps.places.Autocomplete(input, {
                        types: ["geocode"],
                      });
                    autocomplete.addListener("place_changed", () =>
                      handlePlaceSelect(autocomplete.getPlace(), "dropoff")
                    );
                  }
                }}
                aria-invalid={errors.dropoff ? "true" : "false"}
              />
              {errors.dropoff && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.dropoff.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Input
              type="text"
              label="Flight Number"
              placeholder="e.g., AA123"
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              {...register("flightnumber")}
              aria-invalid={errors.flightnumber ? "true" : "false"}
            />
            {errors.flightnumber && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {errors.flightnumber.message}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Pickup Date & Time"
              id="dateTimeInput"
              type="datetime-local"
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              {...register("dateTime")}
              onChange={handleFieldChange}
              aria-invalid={errors.dateTime ? "true" : "false"}
            />
            {errors.dateTime && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {errors.dateTime.message}
              </p>
            )}
          </div>

          {!isHourly && distance && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">
                Estimated Distance:
              </strong>{" "}
              {distance}
            </p>
          )}

          {isHourly && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Duration (Hours)"
                    type="number"
                    min={0}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                    {...register("durationHours", { valueAsNumber: true })}
                    onChange={handleFieldChange}
                    aria-invalid={errors.durationHours ? "true" : "false"}
                  />
                  {errors.durationHours && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {errors.durationHours.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    label="Duration (Minutes)"
                    type="number"
                    min={0}
                    max={59}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                    {...register("durationMinutes", { valueAsNumber: true })}
                    onChange={handleFieldChange}
                    aria-invalid={errors.durationMinutes ? "true" : "false"}
                  />
                  {errors.durationMinutes && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {errors.durationMinutes.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {Array.from({ length: stopCount }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      label={`Stop ${index + 1}`}
                      placeholder={`Enter Stop ${index + 1} location`}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                      {...register(`stops.${index}`)}
                      aria-invalid={errors.stops?.[index] ? "true" : "false"}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="p-2 mt-5 bg-red-200 text-red-800 rounded-md hover:bg-red-300 dark:bg-red-300 dark:text-red-900 dark:hover:bg-red-400"
                      onClick={() => removeStop(index)}
                      aria-label={`Remove Stop ${index + 1}`}
                    >
                      <FaMinus />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-[#181818] dark:text-gray-100 dark:hover:bg-gray-600"
                  onClick={addStop}
                >
                  <FaPlus /> Add Stop
                </Button>
              </div>
            </div>
          )}

          {/* {pickupLatLng && dropoffLatLng && ( */}
          <Suspense fallback={<p>Loading map...</p>}>
            <MapView pickup={pickupLatLng} dropoff={dropoffLatLng} />
          </Suspense>
          {/* )} */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Input
                label="Passengers"
                type="number"
                min={1}
                max={99}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                {...register("passengers", { valueAsNumber: true })}
                onChange={handleFieldChange}
                onKeyUp={(e) => {
                  const value = Number(e.currentTarget.value);
                  if (value > 99) {
                    setValue("passengers", 99, { shouldValidate: true });
                  }
                }}
                aria-invalid={errors.passengers ? "true" : "false"}
              />
              {errors.passengers && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.passengers.message}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Kids"
                type="number"
                min={0}
                max={99}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                {...register("kids", { valueAsNumber: true })}
                onChange={handleFieldChange}
                onKeyUp={(e) => {
                  const value = Number(e.currentTarget.value);
                  if (value > 99) {
                    setValue("kids", 99, { shouldValidate: true });
                  }
                }}
                aria-invalid={errors.kids ? "true" : "false"}
              />
              {errors.kids && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.kids.message}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Bags"
                type="number"
                min={0}
                max={99}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-400 dark:bg-[#181818] dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                {...register("bags", { valueAsNumber: true })}
                onChange={handleFieldChange}
                onKeyUp={(e) => {
                  const value = Number(e.currentTarget.value);
                  if (value > 99) {
                    setValue("bags", 99, { shouldValidate: true });
                  }
                }}
                aria-invalid={errors.bags ? "true" : "false"}
              />
              {errors.bags && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.bags.message}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

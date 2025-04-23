"use client";

import { Trip } from "@/types/booking";
import React, { createContext, useContext, useState, useMemo } from "react";

interface BookingState {
  bookingId: string;
  step: number;
  customer: { name: string; email: string; phone: string };
  trip: Trip;
  car: { type: string; rate: number; quantity: number };
  fare: number;
}

interface BookingContextType {
  bookingData: BookingState;
  updateBookingData: (updates: Partial<BookingState>) => void;
  calculateFare: () => number; // New method to calculate fare
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingState>({
    bookingId: "",
    step: 1,
    customer: { name: "", email: "", phone: "" },
    trip: {
      pickup: "",
      dropoff: "",
      passengers: 1,
      kids: 0,
      bags: 0,
      dateTime: "",
      hourly: false,
      hourlyRate: 0,
      durationHours: 0,
      durationMinutes: 0,
      stops: [],
      distance: "0.0",
    },
    car: { type: "", rate: 0, quantity: 1 },
    fare: 0,
  });

  const calculateFare = (): number => {
    const { car, trip } = bookingData;
    let fare = 0;

    // Constants
    const BASE_FEE = 10; // Base booking fee ($10)
    const STOP_FEE = 5; // Fee per additional stop ($5)

    if (trip.hourly) {
      // Hourly-based fare
      const totalHours = (trip.durationHours ?? 0 + trip.durationMinutes ?? 0) || 0 ;
      fare = trip.hourlyRate ?? 0 * totalHours;
    } else {
      // Distance-based fare
      const distance = parseFloat(trip.distance) || 0; // Convert string to number, default to 0
      fare = car.rate * distance;
    }

    // Add base fee
    fare += BASE_FEE;

    // Add fee for additional stops
    fare += trip.stops.length * STOP_FEE;

    // Multiply by car quantity
    fare *= car.quantity;

    // Ensure fare is non-negative and rounded to 2 decimals
    return Math.max(0, Number(fare.toFixed(2)));
  };

  const updateBookingData = (updates: Partial<BookingState>) => {
    setBookingData((prev) => {
      const newData = { ...prev, ...updates };
      // Recalculate fare if car or trip data changes
      if (updates.car || updates.trip) {
        newData.fare = calculateFare();
      }
      return newData;
    });
  };

  const value = useMemo(
    () => ({
      bookingData,
      updateBookingData,
      calculateFare,
    }),
    [bookingData]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context)
    throw new Error("useBooking must be used within a BookingProvider");
  return context;
};
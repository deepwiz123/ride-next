'use client';
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
  validationErrors: string[];
  submitBooking: (formData: FormData) => Promise<void>;
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
      distance: "0.0"
    },
    car: { type: "", rate: 0, quantity: 1 },
    fare : 0
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const updateBookingData = (updates: Partial<BookingState>) => {
    setBookingData((prev) => ({ ...prev, ...updates }));
  };

  const submitBooking = async (formData: FormData) => {
    // Simulate API call
    setValidationErrors([]); // Clear errors on submit
  };

  const value = useMemo(
    () => ({
      bookingData,
      updateBookingData,
      validationErrors,
      submitBooking,
    }),
    [bookingData, validationErrors]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within a BookingProvider");
  return context;
};
'use client'

import { Car, Customer, Payment, Trip } from "@/types/booking";
import { createContext, useContext, useState, useCallback } from "react";

export interface BookingState {
  bookingId: string;
  step: number;
  customer: Customer;
  trip: Trip;
  car: Car;
  fare: number;
  payment: Payment;
}

type BookingContextType = {
  bookingData: BookingState;
  updateBookingData: (data: Partial<BookingState>) => void;
  resetBooking: () => void;
  calculateFare: () => number;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingState>({
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
      flightnumber: "",
    },
    car: { type: "", transferRate: 0, hourlyRate: 0, quantity: 1, capacity: 1 },
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

  const updateBookingData = useCallback((data: Partial<BookingState>) => {
    setBookingData((prev) => ({
      ...prev,
      ...data,
      trip: { ...prev.trip, ...(data.trip || {}) },
      customer: { ...prev.customer, ...(data.customer || {}) },
      car: { ...prev.car, ...(data.car || {}) },
      payment: { ...prev.payment, ...(data.payment || {}) },
    }));
  }, []);

  const resetBooking = useCallback(() => {
    setBookingData({
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
        flightnumber: "",
      },
      car: { type: "", transferRate: 0, hourlyRate: 0, quantity: 1, capacity: 1},
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
  }, []);

  const calculateFare = useCallback(() => {
    const { car, trip } = bookingData;
    if (!car.type || car.quantity < 1) return 0;
    const rate = trip.hourly ? car.hourlyRate : car.transferRate;
    const duration = trip.hourly ? (trip.durationHours || 0) + (trip.durationMinutes || 0) / 60 : 1;
    return rate * car.quantity * duration;
  }, [bookingData]);

  return (
    <BookingContext.Provider value={{ bookingData, updateBookingData, resetBooking, calculateFare }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
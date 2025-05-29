"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { BookingData } from "@/types/booking";

interface BookingContextType {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  calculateFare: () => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingData, setBookingData] = useState<BookingData>({
    bookingId: `MDS${Math.floor(1000 + Math.random() * 9000)}`,
    customer: {
      name: "",
      email: "",
      phone: "",
      countryCode: "",
    },
    trip: {
      pickup: "",
      dropoff: "",
      flightnumber: "",
      dateTime: "",
      passengers: 1,
      kids: 0,
      bags: 0,
      hourly: false,
      durationHours: 0,
      durationMinutes: 0,
      stops: [],
      distance: "",
    },
    returnTrip: undefined,
    car: {
      type: "",
      transferRate: 0,
      hourlyRate: 0,
      quantity: 1,
      capacity: 0,
    },
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
    step: 1,
  });

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({
      ...prev,
      ...data,
      customer: { ...prev.customer, ...data.customer },
      trip: { ...prev.trip, ...data.trip },
      returnTrip:
        data.returnTrip !== undefined
          ? { ...prev.returnTrip, ...data.returnTrip }
          : prev.returnTrip,
      car: { ...prev.car, ...data.car },
      payment: { ...prev.payment, ...data.payment },
    }));
  };

  const calculateFare = () => {
    const { trip, car } = bookingData;
    if (!car.type) return 0;

    let fare = 0;
    if (trip.hourly) {
      const totalHours =
        (trip.durationHours || 0) + (trip.durationMinutes || 0) / 60;
      fare = car.hourlyRate * totalHours * car.quantity;
    } else {
      fare = car.transferRate * car.quantity;
    }
    return fare;
  };

  return (
    <BookingContext.Provider
      value={{ bookingData, updateBookingData, calculateFare }}
    >
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

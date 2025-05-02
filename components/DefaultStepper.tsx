"use client";

import { Step, Stepper } from "react-form-stepper";
import { useState, useEffect } from "react";
import { useBooking } from "@/context/BookingContext";

const DefaultStepper = () => {
  const { bookingData, updateBookingData } = useBooking();
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    setActiveStep(bookingData.step - 1);
  }, [bookingData.step]);

  if (activeStep === null) return null;

  return (
    <Stepper
      className="flex-1 justify-center item-center"
      activeStep={activeStep}
      styleConfig={{
        activeBgColor: "#33A7FF",
        completedBgColor: "#17CB2F",
        inactiveBgColor: "#cbc9c9",
        activeTextColor: "#000",
        completedTextColor: "#FFFFFF",
        inactiveTextColor: "#000",
        size: "32px",
        circleFontSize: "16px",
        labelFontSize: "14px",
        borderRadius: "50%",
        fontWeight: "400",
      }}
    >
      <Step label="Contact" onClick={() => {updateBookingData({ step: 1 }) }} />
      <Step label="Trip" onClick={() => updateBookingData({ step: 2 })} />
      <Step label="Ride" onClick={() => updateBookingData({ step: 3 })} />
      <Step label="Payment" onClick={() => updateBookingData({ step: 4 })} />
    </Stepper>
  );
};

export default DefaultStepper;
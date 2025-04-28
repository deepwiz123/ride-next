"use client";

import { Stepper } from "react-form-stepper";
import { useState, useEffect } from "react";
import { useBooking } from "@/context/BookingContext";

const DefaultStepper = () => {
  const { bookingData } = useBooking();
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    setActiveStep(bookingData.step - 1);
  }, [bookingData.step]);

  if (activeStep === null) return null;

  return (
    <Stepper
      steps={[1, 2, 3, 4, 5].map((step : number) => {
        switch (step) {
          case 1:
            return { label: "Your Contacts" };
          case 2:
            return { label: "Your Trip Details" };
          case 3:
            return { label: "Your Ride" };
          case 4:
            return { label: "Your Trip Summary" };
          case 5:
            return { label: "Your Card Details" };
          default:
            return { label: "" };
        }
      })}
      activeStep={activeStep}
      styleConfig={{
        activeBgColor: "#33A7FF",
        completedBgColor: "#00518F",
        inactiveBgColor: "#DDF0FF",
        activeTextColor: "#000",
        completedTextColor: "#FFFFFF",
        inactiveTextColor: "#000",
        size: "32px",
        circleFontSize: "16px",
        labelFontSize: "14px",
        borderRadius: "50%",
        fontWeight: "400",
      }}
    />
  );
};

export default DefaultStepper;

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
      steps={[1, 2, 3, 4, 5].map((step) => {
        switch (step) {
          case 1:
            return { label: "Give Us Your Contacts" };
          case 2:
            return { label: "Your Trip Details" };
          case 3:
            return { label: "Choose Your Ride" };
          case 4:
            return { label: "You Are All Set" };
          case 5:
            return { label: "Add Payments" }
          default:
            return { label: "" };
        }
      })}
      activeStep={activeStep}
      styleConfig={{
        activeBgColor: "#5f5d86",
        completedBgColor: "#4F46E5",
        inactiveBgColor: "#D1D5DB",
        activeTextColor: "#FFFFFF",
        completedTextColor: "#FFFFFF",
        inactiveTextColor: "#000000",
        size: "32px", // Circle size
        circleFontSize: "16px", // Font size for step number
        labelFontSize: "14px", // Font size for label
        borderRadius: "50%", // Circle border radius
        fontWeight: "400", // Font weight for text
      }}
    />
  );
};

export default DefaultStepper;
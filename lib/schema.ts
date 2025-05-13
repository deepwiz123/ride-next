import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  countryCode: z.string().min(1, "Country code is required"),
});

export const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const tripSchema = z.object({
  pickup: z.string().min(1, "Pickup location is required"),
  dropoff: z.string().min(1, "Dropoff location is required"),
  passengers: z
    .number()
    .min(1, "At least one passenger is required")
    .max(99, "Maximum 99 passengers"),
  kids: z.number().min(0, "Kids cannot be negative").max(99, "Maximum 99 kids"),
  bags: z.number().min(0, "Bags cannot be negative").max(99, "Maximum 99 bags"),
  dateTime: z
    .string()
    .min(1, "Date and time are required")
    .refine(
      (value) => {
        const selectedDate = new Date(value);
        const now = new Date();
        return selectedDate >= now;
      },
      { message: "Pickup date and time cannot be in the past" }
    ),
  hourly: z.boolean(),
  durationHours: z.number().min(0, "Duration hours cannot be negative"),
  durationMinutes: z
    .number()
    .min(0, "Duration minutes cannot be negative")
    .max(59, "Maximum 59 minutes"),
  stops: z.array(z.string()).optional(),
  distance: z.string().optional(),
  pickupLatLng: coordinatesSchema.optional(),
  dropoffLatLng: coordinatesSchema.optional(),
  flightNumber: z.string().optional(),
});

export const carSchema = z.object({
  type: z.string().min(1, "Car type is required"),
  transferRate: z.number().min(0, "Transfer rate cannot be negative"),
  hourlyRate: z.number().min(0, "Hourly rate cannot be negative"),
  quantity: z
    .number()
    .min(0, "Quantity cannot be negative")
    .max(10, "Maximum 10 cars"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
});

export const paymentSchema = z.object({
  method: z.enum(["credit", "debit"], {
    errorMap: () => ({ message: "Please select a payment method" }),
  }),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "Card number must be 16 digits")
    .min(15, "Card number must be 15 or 16 digits")
    .max(16, "Card number must be 15 or 16 digits"),
  expiryDate: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Expiry date must be MM/YY")
    .refine(
      (val) => {
        const [month, year] = val.split("/").map(Number);
        const currentYear = new Date().getFullYear() % 100; // e.g., 25 for 2025
        const currentMonth = new Date().getMonth() + 1; // 1-12
        return (
          month >= 1 &&
          month <= 12 &&
          year >= currentYear &&
          (year > currentYear || month >= currentMonth)
        );
      },
      { message: "Expiry date must be in the future" }
    ),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
    .min(3, "CVV must be 3 or 4 digits")
    .max(4, "CVV must be 3 or 4 digits"),
  cardholderName: z.string().min(1, "Card Holder name is required"),
  billingPostalCode: z
    .string()
    .min(5, "Postal code must be at least 5 characters")
    .max(10, "Postal code cannot exceed 10 characters"),
  specialInstructions: z.string().optional(),
});

export const bookingSchema = z.object({
  bookingId: z.string(),
  step: z.number().min(1).max(5),
  customer: customerSchema,
  trip: tripSchema,
  car: carSchema,
  fare: z.number().min(0, "Fare cannot be negative"),
  payment: paymentSchema,
});

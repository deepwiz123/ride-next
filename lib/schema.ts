import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(
      /^[0-9\s\-()]+$/,
      "Phone number can only contain digits, spaces, dashes, or parentheses"
    )
    .transform((val) => val.replace(/[\s\-()]/g, "")), // Normalize by removing spaces, dashes, parentheses
  countryCode: z.string().min(1, "Country code is required"),
});

const baseTripSchema = z.object({
  pickup: z.string().min(1, "Pickup location is required"),
  dropoff: z.string().min(1, "Dropoff location is required"),
  dateTime: z.string().nonempty("Date and time are required"),
  passengers: z
    .number()
    .min(1, "At least 1 passenger is required")
    .max(99, "Passengers cannot exceed 99"),
  kids: z
    .number()
    .min(0, "Kids cannot be negative")
    .max(99, "Kids cannot exceed 99"),
  bags: z
    .number()
    .min(0, "Bags cannot be negative")
    .max(99, "Bags cannot exceed 99"),
  pickupLatLng: z
    .object({ lat: z.number(), lng: z.number() })
    .optional()
    .nullable(),
  dropoffLatLng: z
    .object({ lat: z.number(), lng: z.number() })
    .optional()
    .nullable(),
  stops: z.array(z.string()).optional(),
});

const transferTripSchema = baseTripSchema.extend({
  hourly: z.literal(false),
});

const hourlyTripSchema = baseTripSchema.extend({
  hourly: z.literal(true),
  durationHours: z.number().min(0, "Duration hours cannot be negative"),
  durationMinutes: z
    .number()
    .min(0)
    .max(59, "Minutes must be between 0 and 59"),
});

export const tripSchema = z.union([transferTripSchema, hourlyTripSchema]);

export const carSchema = z.object({
  type: z.string().min(1, "Please select a car type"),
  transferRate: z.number().min(0, "Transfer rate must be non-negative"),
  hourlyRate: z.number().min(0, "Hourly rate must be non-negative").optional(),
  quantity: z
    .number()
    .min(1, "At least 1 car is required")
    .max(10, "Quantity cannot exceed 10"),
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

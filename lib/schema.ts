import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  countryCode: z.string().min(1, "Country code is required"),
});

export const tripSchema = z.object({
  pickup: z.string().min(1, "Pickup location is required"),
  dropoff: z.string().min(1, "Dropoff location is required"),
  pickupLatLng: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  dropoffLatLng: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  dateTime: z
    .string()
    .refine(
      (val) => {
        const selectedDate = new Date(val);
        const now = new Date();
        return selectedDate >= now;
      },
      { message: "Pickup date and time cannot be in the past" }
    ),
  flightnumber: z.string().optional(),
  passengers: z.number().min(1, "At least one passenger is required").max(99),
  kids: z.number().min(0).max(99).optional(),
  bags: z.number().min(0).max(99).optional(),
  hourly: z.boolean(),
  durationHours: z.number().min(0).optional(),
  durationMinutes: z.number().min(0).max(59).optional(),
  stops: z.array(z.string()).optional(),
  distance: z.string().optional(),
});

export const returnTripSchema = z.object({
  returnDateTime: z
    .string()
    .min(1, "Return date and time are required")
    .refine(
      (val) => {
        const selectedDate = new Date(val);
        const now = new Date();
        return selectedDate >= now;
      },
      { message: "Return date and time cannot be in the past" }
    ),
  returnFlightNumber: z.string().optional(),
  returnDropoff: z.string().min(1, "Return drop-off location is required"),
  returnDropoffLatLng: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export const carSchema = z.object({
  type: z.string().min(1, "Car type is required"),
  transferRate: z.number().min(0),
  hourlyRate: z.number().min(0),
  quantity: z.number().min(1, "At least one car is required").max(10),
  capacity: z.number().min(1, "Car capacity must be at least 1"),
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
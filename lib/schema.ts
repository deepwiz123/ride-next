import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number cannot exceed 15 digits")
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
  passengers: z.number().min(1, "At least 1 passenger is required"),
  kids: z.number().min(0, "Kids cannot be negative"),
  bags: z.number().min(0, "Bags cannot be negative"),
  dateTime: z.string().nonempty("Date and time are required"),
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
  hourlyRate: z.number().min(0, "Hourly rate cannot be negative"),
  durationHours: z.number().min(0, "Duration hours cannot be negative"),
  durationMinutes: z.number().min(0).max(59, "Minutes must be between 0 and 59"),
});

export const tripSchema = z.union([transferTripSchema, hourlyTripSchema]);

export const carSchema = z.object({
  type: z.string().min(1, "Car type is required"),
  rate: z.number().min(0),
  quantity: z.number().min(1, "At least 1 car required"),
});
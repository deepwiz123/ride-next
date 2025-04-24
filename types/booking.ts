
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Trip {
  pickup: string;
  dropoff: string;
  passengers: number;
  kids: number;
  bags: number;
  dateTime: string;
  hourly: boolean;
  pickupLatLng?: Coordinates;
  dropoffLatLng?: Coordinates;
  distance?: string;
  stops?: string[];
  durationHours?: number; // Optional for transfer trips
  durationMinutes?: number; // Optional for transfer trips
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  countryCode: string; // Added countryCode field
}

export interface Car {
  type: string;
  transferRate: number;
  hourlyRate?: number;
  quantity: number;
  capacity : number;
}

export interface Payment {
  method: "credit" | "debit";
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingPostalCode: string;
  specialInstructions?: string;
}

export interface BookingData {
  bookingId: string;
  step: number;
  customer: Customer;
  trip: Trip;
  car: Car;
  fare?: number;
  payment : Payment;
}
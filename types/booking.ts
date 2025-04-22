
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
  pickupLatLng?: Coordinates;
  dropoffLatLng?: Coordinates;
  stops?: string[];
  hourly: boolean;
  hourlyRate?: number; // Optional for transfer trips
  durationHours?: number; // Optional for transfer trips
  durationMinutes?: number; // Optional for transfer trips
  distance?: string; // Optional, not in schema but used in UI
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  countryCode: string; // Added countryCode field
}

export interface Car {
  type: string;
  rate: number;
  quantity: number;
}


export interface BookingData {
  bookingId: string;
  step: number;
  customer: Customer;
  trip: Trip;
  car: Car;
  fare?: number;
}
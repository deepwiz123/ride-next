export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
}

export interface Trip {
  pickup: string;
  dropoff: string;
  pickupLatLng?: Coordinates;
  dropoffLatLng?: Coordinates;
  dateTime: string;
  flightnumber?: string;
  passengers: number;
  kids?: number;
  bags?: number;
  hourly: boolean;
  durationHours?: number;
  durationMinutes?: number;
  stops?: string[];
  distance?: string;
}

export interface ReturnTrip {
  returnDateTime: string;
  returnFlightNumber?: string;
  returnDropoff: string;
  returnDropoffLatLng?: Coordinates;
}

export interface Car {
  type: string;
  transferRate: number;
  hourlyRate: number;
  quantity: number;
  capacity: number;
}

export interface Payment {
  method: 'credit' | 'debit' | undefined;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingPostalCode: string;
  specialInstructions?: string;
}

export interface BookingData {
  bookingId: string;
  customer: Customer;
  trip: Trip;
  returnTrip?: ReturnTrip;
  car: Car;
  fare: number;
  payment: Payment;
  step: number;
}
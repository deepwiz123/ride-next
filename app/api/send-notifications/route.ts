import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { BookingData } from "../../../types/booking";

// Define the transporter configuration (e.g., using Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Customer email HTML template
const customerEmailTemplate = (booking: BookingData) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <!-- Header -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #1a73e8; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 10px 0; font-size: 24px;">Booking Confirmation</h1>
        </td>
      </tr>
      <!-- Body -->
      <tr>
        <td style="padding: 20px;">
          <h2 style="color: #333; font-size: 20px; margin-top: 0;">Hello ${
            booking.customer.name
          },</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.5;">
            Thank you for booking with us! Your ride is confirmed. Below are the details of your booking (ID: ${
              booking.bookingId
            }):
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="10" style="background-color: #f9f9f9; border-radius: 4px; margin: 20px 0;">
            <tr>
              <td style="font-weight: bold; color: #333;">Car Type:</td>
              <td style="color: #555;">${booking.car.type} (x${
  booking.car.quantity
})</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Pickup Location:</td>
              <td style="color: #555;">${booking.trip.pickup}${
  booking.trip.pickupLatLng
    ? ` (Lat: ${booking.trip.pickupLatLng.lat}, Lng: ${booking.trip.pickupLatLng.lng})`
    : ""
}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Drop-off Location:</td>
              <td style="color: #555;">${booking.trip.dropoff}${
  booking.trip.dropoffLatLng
    ? ` (Lat: ${booking.trip.dropoffLatLng.lat}, Lng: ${booking.trip.dropoffLatLng.lng})`
    : ""
}</td>
            </tr>
            ${
              booking.trip.stops && booking.trip.stops.length > 0
                ? `<tr>
                    <td style="font-weight: bold; color: #333;">Stops:</td>
                    <td style="color: #555;">${booking.trip.stops.join(
                      ", "
                    )}</td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="font-weight: bold; color: #333;">Date & Time:</td>
              <td style="color: #555;">${new Date(
                booking.trip.dateTime
              ).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Passengers:</td>
              <td style="color: #555;">${booking.trip.passengers} (Kids: ${
  booking.trip.kids
})</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Bags:</td>
              <td style="color: #555;">${booking.trip.bags}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Trip Type:</td>
              <td style="color: #555;">${
                booking.trip.hourly ? "Hourly" : "Transfer"
              }</td>
            </tr>
            ${
              booking.trip.hourly
                ? `<tr>
                    <td style="font-weight: bold; color: #333;">Hourly Rate:</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; color: #333;">Duration:</td>
                    <td style="color: #555;">${
                      booking.trip.durationHours || 0
                    } hrs, ${booking.trip.durationMinutes || 0} mins</td>
                  </tr>`
                : ""
            }
            ${
              booking.trip.distance
                ? `<tr>
                    <td style="font-weight: bold; color: #333;">Distance:</td>
                    <td style="color: #555;">${booking.trip.distance}</td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="font-weight: bold; color: #333;">Rate per Car:</td>
              <td style="color: #555;">$${booking.car.transferRate.toFixed(
                2
              )}</td>
            </tr>
            ${
              booking.fare
                ? `<tr>
                    <td style="font-weight: bold; color: #333;">Total Fare:</td>
                    <td style="color: #555;">$${booking.fare.toFixed(2)}</td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="font-weight: bold; color: #333;">Contact:</td>
              <td style="color: #555;">${booking.customer.phone}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Payment Method:</td>
              <td style="color: #555;">${
                booking.payment.method
              } ending in ${booking.payment.cardNumber.slice(-4)}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Terms Accepted:</td>
            </tr>
          </table>
          <p style="color: #555; font-size: 16px; line-height: 1.5;">
            We’ll send you a reminder closer to your trip. If you have any questions, contact us at <a href="mailto:support@ridebooking.com" style="color: #1a73e8; text-decoration: none;">support@ridebooking.com</a>.
          </p>
          <a href="https://ridebooking.com/manage-booking/${
            booking.bookingId
          }" style="display: inline-block; padding: 12px 24px; background-color: #1a73e8; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; margin: 20px 0;">
            Manage Your Booking
          </a>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="color: #777; font-size: 14px; margin: 0;">
            © ${new Date().getFullYear()} Ride Booking. All rights reserved.<br>
            <a href="https://ridebooking.com" style="color: #1a73e8; text-decoration: none;">Visit our website</a> | 
            <a href="https://ridebooking.com/privacy" style="color: #1a73e8; text-decoration: none;">Privacy Policy</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

// Company email HTML template
const companyEmailTemplate = (booking: BookingData) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Notification</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <!-- Header -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #d32f2f; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 10px 0; font-size: 24px;">New Booking Notification</h1>
        </td>
      </tr>
      <!-- Body -->
      <tr>
        <td style="padding: 20px;">
          <h2 style="color: #333; font-size: 20px; margin-top: 0;">New Booking Received (ID: ${
            booking.bookingId
          })</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.5;">
            A new booking has been made. Please contact the customer to confirm payment and finalize details.
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="10" style="background-color: #f9f9f9; border-radius: 4px; margin: 20px 0;">
            <tr>
              <td style="font-weight: bold; color: #333;">Customer Name:</td>
              <td style="color: #555;">${booking.customer.name}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Phone Number:</td>
              <td style="color: #555;">${booking.customer.countryCode}${
  booking.customer.phone
}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Email:</td>
              <td style="color: #555;">${booking.customer.email}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Car Type:</td>
              <td style="color: #555;">${booking.car.type} (x${
  booking.car.quantity
})</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Pickup Location:</td>
              <td style="color: #555;">${booking.trip.pickup}${
  booking.trip.pickupLatLng
    ? ` (Lat: ${booking.trip.pickupLatLng.lat}, Lng: ${booking.trip.pickupLatLng.lng})`
    : ""
}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Drop-off Location:</td>
              <td style="color: #555;">${booking.trip.dropoff}${
  booking.trip.dropoffLatLng
    ? ` (Lat: ${booking.trip.dropoffLatLng.lat}, Lng: ${booking.trip.dropoffLatLng.lng})`
    : ""
}</td>
            </tr>
            ${
              booking.trip.stops && booking.trip.stops.length > 0
                ? `<tr>
                    <td style="font-weight: bold; color: #333;">Stops:</td>
                    <td style="color: #555;">${booking.trip.stops.join(
                      ", "
                    )}</td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="font-weight: bold; color: #333;">Date & Time:</td>
              <td style="color: #555;">${new Date(
                booking.trip.dateTime
              ).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Passengers:</td>
              <td style="color: #555;">${booking.trip.passengers} (Kids: ${
  booking.trip.kids
})</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Bags:</td>
              <td style="color: #555;">${booking.trip.bags}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Trip Type:</td>
              <td style="color: #555;">${
                booking.trip.hourly ? "Hourly" : "Transfer"
              }</td>
            </tr>
            ${
              booking.trip.hourly
                ? `<tr>
                    <td style="font-weight: bold; color: #333;">Hourly Rate:</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; color: #333;">Duration:</td>
                    <td style="color: #555;">${
                      booking.trip.durationHours || 0
                    } hrs, ${booking.trip.durationMinutes || 0} mins</td>
                  </tr>`
                : ""
            }
            ${
              booking.trip.distance
                ? `<tr>
                    <td style="font-weight: bold; color: #333;">Distance:</td>
                    <td style="color: #555;">${booking.trip.distance}</td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="font-weight: bold; color: #333;">Rate per Car:</td>
              <td style="color: #555;">$${booking.car.transferRate.toFixed(
                2
              )}</td>
            </tr>
            ${
              booking.fare
                ? `<tr>
                    <td style="font-weight: bold; color: #333;">Total Fare:</td>
                    <td style="color: #555;">$${booking.fare.toFixed(2)}</td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="font-weight: bold; color: #333;">Payment Method:</td>
              <td style="color: #555;">${
                booking.payment.method
              } ending in ${booking.payment.cardNumber.slice(-4)}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">Terms Accepted:</td>
            </tr>
          </table>
          <p style="color: #555; font-size: 16px; line-height: 1.5;">
            Please contact the customer as soon as possible to confirm payment and arrange the ride.
          </p>
          <a href="tel:${
            booking.customer.phone
          }" style="display: inline-block; padding: 12px 24px; background-color: #d32f2f; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; margin: 20px 0;">
            Call Customer
          </a>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="color: #777; font-size: 14px; margin: 0;">
            © ${new Date().getFullYear()} Ride Booking. All rights reserved.<br>
            <a href="https://ridebooking.com" style="color: #d32f2f; text-decoration: none;">Visit our website</a> | 
            <a href="https://ridebooking.com/privacy" style="color: #d32f2f; text-decoration: none;">Privacy Policy</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

export async function POST(req: NextRequest) {
  try {
    const body: BookingData = await req.json();
    const { bookingId, customer, trip, car } = body;

    // Validate required fields
    // if (
    //   !bookingId ||
    //   !step ||
    //   !customer ||
    //   !customer.name ||
    //   !customer.email ||
    //   !customer.phone ||
    //   !customer.countryCode ||
    //   !trip ||
    //   !trip.pickup ||
    //   !trip.dropoff ||
    //   !trip.passengers ||
    //   !trip.kids ||
    //   !trip.bags ||
    //   !trip.dateTime ||
    //   !car ||
    //   !car.type ||
    //   !car.transferRate ||
    //   !car.quantity ||
    //   !car.capacity ||
    //   !fare ||
    //   !payment ||
    //   !payment.method ||
    //   !payment.cardNumber ||
    //   !payment.expiryDate ||
    //   !payment.cvv ||
    //   !payment.cardholderName ||
    //   !payment.billingPostalCode) {
    //   return NextResponse.json(
    //     { error: "Missing required fields" },
    //     { status: 400 }
    //   );
    // }

    // Email messages
    const emailMsg = {
      from: `Book Ride <${
        process.env.EMAIL_FROM || "no-reply@ridebooking.com"
      }>`,
      to: customer.email,
      subject: `Booking Confirmation - ${bookingId}`,
      text: `Your booking for ${car.type} from ${trip.pickup} to ${trip.dropoff} is confirmed! Booking ID: ${bookingId}`,
      html: customerEmailTemplate({ ...body }),
    };

    const companyEmailMsg = {
      from: `Book Ride <${
        process.env.EMAIL_FROM || "no-reply@ridebooking.com"
      }>`,
      to: process.env.COMPANY_EMAIL || "ride@yopmail.com",
      subject: `New Booking Notification - ${bookingId}`,
      text: `New booking received. Contact ${customer.name} at ${customer.countryCode}${customer.phone} for payment confirmation. Booking ID: ${bookingId}`,
      html: companyEmailTemplate({ ...body }),
    };

    // Send customer email
    await transporter.sendMail(emailMsg);

    // Send company email
    await transporter.sendMail(companyEmailMsg);

    return NextResponse.json(
      { message: "Notifications sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}

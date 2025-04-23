import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Header } from "@/components";
import { BookingProvider } from "@/context/BookingContext";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: 'Home | Ride Reservation App',
  description: 'Book smarter, ride faster with our reliable ride reservation service.',
  openGraph: {
    title: 'Ride Reservation App Home',
    description: 'Start your journey with our easy-to-use ride booking platform.',
    images: [
      {
        url: '/reservations/og-home.png', // Specific OG image for homepage
        width: 1200,
        height: 630,
        alt: 'Ride Reservation App Home',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ride Reservation App Home',
    description: 'Start your journey with our easy-to-use ride booking platform.',
    images: ['/reservations/og-home.png'],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY
  console.log(GOOGLE_API_KEY)
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* Header */}
        <Header />
        {/* Main Content */}
        <BookingProvider>{children}</BookingProvider>
        {/* Footer */}
        <Footer />
      </body>
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`}
        async
      ></script>
    </html> 
  );
}

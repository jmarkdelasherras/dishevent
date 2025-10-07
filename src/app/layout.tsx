import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./globals.firebase-test.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DiShEvent - Digital Shareable Event",
  description: "Create beautiful digital event invitations for weddings, birthdays, and corporate events",
  keywords: ["event invitation", "digital invitation", "online RSVP", "wedding", "birthday", "corporate events"],
};

// Import the ClientProvider component
import ClientProviders from '@/components/auth/Providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

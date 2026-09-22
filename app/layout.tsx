import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WaOfficialManagement",
  description:
    "WhatsApp Business Management Platform — kelola akun WhatsApp Business, conversation, contacts, dan message templates dalam satu dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable + " " + jetbrains.variable}>
      <body className={`${plusJakarta.variable} ${jetbrains.variable} antialiased bg-void text-body`}>
        {children}
      </body>
    </html>
  );
}

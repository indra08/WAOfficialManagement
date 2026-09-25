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
  title: "Whatsapp Official Management",
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
      <body className={`${plusJakarta.variable} ${jetbrains.variable} antialiased bg-void text-body flex flex-col min-h-screen`}>
        {children}
        <footer className="border-t border-neutral-800 bg-neutral-900 py-3 mt-auto">
          <div className="mx-auto max-w-7xl px-4 text-center text-xs text-neutral-400">
            Create by{" "}
            <a
              href="https://indramaulana.web.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Indra Maulana
            </a>
            {" · "}
            Supported by{" "}
            <a
              href="https://insantech-id.web.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              InsanTech
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
});

// Import Material Symbols via HTML Link in the head if possible, 
// but for Next.js it's better to use a <link> in RootLayout.

export const metadata: Metadata = {
  title: "TrustMarket – Marketplace de Confianza para Servicios Profesionales",
  description:
    "Contrata profesionales con pago garantizado por Escrow, negociación de precios y contratos inteligentes por IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

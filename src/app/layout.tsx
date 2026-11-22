import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/common/FloatingActions";
import JsonLd from "@/components/seo/JsonLd";
import { CmsProvider } from "@/context/CmsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://geetahospitalmundra.com"),
  title: {
    default: "Geeta Hospital Mundra | 24x7 Emergency, Gynec, Pediatric & Multi-Speciality Hospital Kutch",
    template: "%s | Geeta Hospital Mundra (Kutch)",
  },
  description:
    "Leading 45-bed multi-speciality hospital in Mundra (Kutch), Gujarat. Established in 2009. 24x7 Emergency, ICU, NICU, C-ARM Operation Theater, In-house Pathology Lab, In-house Pharmacy, and Cashless Mediclaim with Adani, Jindal, DP World & all TPAs. ISO 9001:2015 certified.",
  keywords: [
    "Geeta Hospital Mundra",
    "Hospital in Mundra",
    "Best Hospital in Mundra Kutch",
    "Gynecologist Mundra",
    "Pediatrician Mundra",
    "24x7 Emergency Hospital Mundra",
    "ICU Hospital Mundra",
    "NICU Mundra",
    "Orthopedic Doctor Mundra",
    "Cashless Mediclaim Hospital Mundra",
    "Dr Kundan Modi",
    "Dr Vinod Prajapati",
    "Dr Rahul Patel",
    "Dr Avani Modi",
    "Ambulance Mundra Kutch",
  ],
  authors: [{ name: "Geeta Hospital Mundra" }],
  creator: "Geeta Hospital Mundra",
  publisher: "Geeta Hospital Mundra",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://geetahospitalmundra.com",
    title: "Geeta Hospital Mundra | 24x7 Multi-Speciality Healthcare in Kutch",
    description:
      "45-Bed multi-speciality hospital with 24x7 Emergency, ICU, NICU, C-ARM Orthopedic OT, In-House Pathology Lab, and Cashless Mediclaim in Mundra, Gujarat.",
    siteName: "Geeta Hospital Mundra",
    images: [
      {
        url: "/images/hospital-building.jpg",
        width: 1200,
        height: 630,
        alt: "Geeta Hospital Mundra Campus Building",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Geeta Hospital Mundra | 24x7 Multi-Speciality Healthcare in Kutch",
    description:
      "45-Bed multi-speciality hospital with 24x7 Emergency, ICU, NICU, C-ARM Orthopedic OT, and Cashless Mediclaim in Mundra, Gujarat.",
    images: ["/images/hospital-building.jpg"],
  },
  alternates: {
    canonical: "https://geetahospitalmundra.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/logo.png", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/images/logo.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <head>
        <JsonLd pageType="home" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-sky-600 selection:text-white">
        <CmsProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <FloatingActions />
        </CmsProvider>
      </body>
    </html>
  );
}

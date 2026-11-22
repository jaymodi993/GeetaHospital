import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Geeta Hospital Mundra | 24x7 Emergency, Gynec, Pediatric & Multi-Speciality Hospital in Kutch",
  description:
    "Leading 45-bed multi-speciality hospital in Mundra, Kutch, Gujarat. ISO 9001:2015 certified & ROHINI registered with 24x7 Emergency, ICU, NICU, C-ARM OT, In-House Pathology Lab, Pharmacy, and Cashless Mediclaim with Adani, Jindal & DP World.",
  alternates: {
    canonical: "https://geetahospitalmundra.com",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd pageType="home" />
      <HomeClient />
    </>
  );
}

import type { Metadata } from "next";
import ServicesClient from "@/components/services/ServicesClient";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Services & Medical Departments | Geeta Hospital Mundra Kutch",
  description:
    "Explore 24+ medical departments and facilities at Geeta Hospital Mundra: 24x7 ICU Ambulance, Pathology Lab, Pharmacy, 3-Bed ICU, 5-Bed NICU, C-ARM Orthopedic OT, Laparoscopy, 3D/4D Doppler USG, and Cashless Mediclaim.",
  alternates: {
    canonical: "https://geetahospitalmundra.com/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        pageType="services"
        breadcrumbs={[
          { name: "Home", url: "https://geetahospitalmundra.com" },
          { name: "Services", url: "https://geetahospitalmundra.com/services" },
        ]}
      />
      <ServicesClient />
    </>
  );
}

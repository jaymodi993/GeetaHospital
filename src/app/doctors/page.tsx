import type { Metadata } from "next";
import DoctorsClient from "@/components/doctors/DoctorsClient";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Specialist Doctors & OPD Schedule | Geeta Hospital Mundra Kutch",
  description:
    "Consult experienced full-time gynecologists, pediatricians, intensivists, and visiting super-specialists in Cardiology, Neurology, IVF, ENT, and Spine surgery at Geeta Hospital Mundra. Book your OPD token online.",
  alternates: {
    canonical: "https://geetahospitalmundra.com/doctors",
  },
};

export default function DoctorsPage() {
  return (
    <>
      <JsonLd
        pageType="doctors"
        breadcrumbs={[
          { name: "Home", url: "https://geetahospitalmundra.com" },
          { name: "Doctors & OPD", url: "https://geetahospitalmundra.com/doctors" },
        ]}
      />
      <DoctorsClient />
    </>
  );
}

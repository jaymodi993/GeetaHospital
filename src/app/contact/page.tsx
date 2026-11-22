import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Contact Us & Emergency Location | Geeta Hospital Mundra Kutch",
  description:
    "Contact Geeta Hospital Mundra: 3, Ambe Nagar, Gundala Road, Baroi-Mundra. 24x7 emergency phone +91 78743 81551. Interactive directions, Google Maps location, and online appointment booking.",
  alternates: {
    canonical: "https://geetahospitalmundra.com/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        pageType="contact"
        breadcrumbs={[
          { name: "Home", url: "https://geetahospitalmundra.com" },
          { name: "Contact", url: "https://geetahospitalmundra.com/contact" },
        ]}
      />
      <ContactClient />
    </>
  );
}

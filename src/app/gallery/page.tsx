import type { Metadata } from "next";
import GalleryClient from "@/components/gallery/GalleryClient";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Photo Gallery & Hospital Tour | Geeta Hospital Mundra Kutch",
  description:
    "View photo tour of Geeta Hospital Mundra: hospital building exterior, 3-bed adult ICU, 5-bed neonatal ICU, C-ARM orthopedic OT, 24x7 pathology laboratory, and visiting specialist clinical camps.",
  alternates: {
    canonical: "https://geetahospitalmundra.com/gallery",
  },
};

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        pageType="gallery"
        breadcrumbs={[
          { name: "Home", url: "https://geetahospitalmundra.com" },
          { name: "Gallery", url: "https://geetahospitalmundra.com/gallery" },
        ]}
      />
      <GalleryClient />
    </>
  );
}

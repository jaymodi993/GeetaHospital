import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Geeta Multi-Speciality Hospital Mundra",
    short_name: "Geeta Hospital",
    description:
      "24x7 Emergency, Trauma, Gynec, Pediatric & ICU Hospital in Mundra Kutch. ISO 9001:2015 & ROHINI Registered.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0284c7",
    icons: [
      {
        src: "/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/favicon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}

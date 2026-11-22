import { HOSPITAL_INFO, DOCTORS, FAQS } from "@/data/hospitalData";

interface JsonLdProps {
  pageType?: "home" | "about" | "doctors" | "services" | "gallery" | "contact";
  breadcrumbs?: { name: string; url: string }[];
}

export default function JsonLd({ pageType = "home", breadcrumbs }: JsonLdProps) {
  // Hospital / MedicalBusiness Schema
  const hospitalSchema = {
    "@context": "https://schema.org",
    "@type": ["Hospital", "MedicalBusiness", "EmergencyService"],
    "@id": "https://geetahospitalmundra.com/#hospital",
    name: HOSPITAL_INFO.name,
    legalName: HOSPITAL_INFO.legalName,
    url: "https://geetahospitalmundra.com",
    logo: HOSPITAL_INFO.logoUrl || "https://res.cloudinary.com/jaymodi/image/upload/v1795354038/geeta-hospital/logo.png",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80",
    description: HOSPITAL_INFO.description,
    telephone: HOSPITAL_INFO.phone,
    emergencyTelephone: HOSPITAL_INFO.emergencyPhone,
    email: HOSPITAL_INFO.email,
    priceRange: "$$",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Insurance Cashless, TPA",
    isAcceptingNewPatients: true,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Medical Services & Departments",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "MedicalService", name: "24x7 Emergency & ICU Ambulance" } },
        { "@type": "Offer", itemOffered: { "@type": "MedicalService", name: "Obstetrics & Gynecology" } },
        { "@type": "Offer", itemOffered: { "@type": "MedicalService", name: "Pediatrics & Neonatal ICU (NICU)" } },
        { "@type": "Offer", itemOffered: { "@type": "MedicalService", name: "Orthopedic Surgery with C-ARM" } },
        { "@type": "Offer", itemOffered: { "@type": "MedicalService", name: "24x7 In-House Pathology Laboratory" } },
        { "@type": "Offer", itemOffered: { "@type": "MedicalService", name: "24x7 In-House Pharmacy" } },
        { "@type": "Offer", itemOffered: { "@type": "MedicalService", name: "3D/4D Color Doppler Sonography" } },
        { "@type": "Offer", itemOffered: { "@type": "MedicalService", name: "Visiting Cardiology, Neurology, IVF & ENT OPD" } },
      ],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: HOSPITAL_INFO.address.street,
      addressLocality: HOSPITAL_INFO.address.locality,
      addressRegion: HOSPITAL_INFO.address.state,
      postalCode: HOSPITAL_INFO.address.postalCode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: HOSPITAL_INFO.geo.latitude,
      longitude: HOSPITAL_INFO.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    availableService: [
      { "@type": "MedicalSpecialty", name: "Emergency Medicine" },
      { "@type": "MedicalSpecialty", name: "Gynecology" },
      { "@type": "MedicalSpecialty", name: "Obstetrics" },
      { "@type": "MedicalSpecialty", name: "Pediatrics" },
      { "@type": "MedicalSpecialty", name: "Orthopedics" },
      { "@type": "MedicalSpecialty", name: "Critical Care" },
      { "@type": "MedicalSpecialty", name: "Pathology" },
      { "@type": "MedicalSpecialty", name: "Cardiology" },
      { "@type": "MedicalSpecialty", name: "Neurology" },
      { "@type": "MedicalSpecialty", name: "Otolaryngology (ENT)" },
    ],
    sameAs: [
      "https://kivihealth.com/clinic/geeta-hospital",
      "https://geetahospitalmundra.com",
    ],
  };

  // Doctors / Physicians Schema
  const doctorsSchema = DOCTORS.map((doc) => ({
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doc.name,
    jobTitle: doc.designation,
    medicalSpecialty: doc.department,
    image: doc.image ? (doc.image.startsWith("http") ? doc.image : `https://geetahospitalmundra.com${doc.image}`) : undefined,
    description: `${doc.name} (${doc.qualification}) - ${doc.designation} at Geeta Hospital Mundra with ${doc.experience} of medical expertise.`,
    worksFor: {
      "@type": "Hospital",
      name: HOSPITAL_INFO.name,
      url: "https://geetahospitalmundra.com",
    },
    telephone: HOSPITAL_INFO.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: HOSPITAL_INFO.address.street,
      addressLocality: HOSPITAL_INFO.address.locality,
      addressRegion: HOSPITAL_INFO.address.state,
      postalCode: HOSPITAL_INFO.address.postalCode,
      addressCountry: "IN",
    },
  }));

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // Breadcrumbs Schema
  const breadcrumbsSchema = breadcrumbs
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hospitalSchema) }}
      />
      {pageType === "doctors" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(doctorsSchema) }}
        />
      )}
      {(pageType === "home" || pageType === "about") && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {breadcrumbsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
        />
      )}
    </>
  );
}

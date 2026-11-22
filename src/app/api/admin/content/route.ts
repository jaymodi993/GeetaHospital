import { NextResponse } from "next/server";
import { getCmsData, saveCmsData } from "@/lib/cmsData";
import {
  HOSPITAL_INFO,
  DOCTORS,
  SERVICES,
  GALLERY_ITEMS,
  INSURANCE_PARTNERS,
  FACILITIES_LIST,
  FAQS,
} from "@/data/hospitalData";

export async function GET() {
  try {
    const cms = await getCmsData();

    const responsePayload = {
      hospitalProfile: {
        ...HOSPITAL_INFO,
        ...(cms.hospitalProfile || {}),
        logoUrl: cms.hospitalProfile?.logoUrl || HOSPITAL_INFO.logoUrl || "/images/logo.png",
        faviconUrl: cms.hospitalProfile?.faviconUrl || "/favicon.ico",
        heroBannerUrl: cms.hospitalProfile?.heroBannerUrl || "/images/hero-banner-1.jpg",
      },
      announcements: cms.announcements || [
        {
          id: "ann-1",
          title: "24x7 Emergency, ICU & Trauma Centre Active",
          content: "Our ICU ventilators, emergency operation theatres, and dedicated ambulance are staffed 24 hours a day, 7 days a week.",
          category: "Emergency",
          isActive: true,
          date: new Date().toISOString().split("T")[0],
        },
        {
          id: "ann-2",
          title: "Cashless Mediclaim Desk for TPA & Corporate Insurance",
          content: "ROHINI registered hospital providing hassle-free cashless hospitalization for Star Health, Care, ICICI Lombard, Niva Bupa & PSUs.",
          category: "TPA / Cashless",
          isActive: true,
          date: new Date().toISOString().split("T")[0],
        },
      ],
      seoSettings: cms.seoSettings || {
        title: "Geeta Multi-Speciality Hospital Mundra | 24x7 Emergency & Critical Care",
        description: "Premier 45-bed multi-speciality hospital in Mundra (Kutch). 24x7 Emergency, Gynecology, Pediatrics, Adult & Neonatal ICU, Orthopedics, Cashless Mediclaim. ISO 9001:2015 & ROHINI registered.",
        keywords: "Hospital in Mundra, Geeta Hospital Mundra, Emergency hospital Mundra, Gynecologist in Mundra, Pediatrician Mundra, ICU hospital Kutch, Dr Kundan Modi, Cashless mediclaim hospital Mundra",
      },
      doctors: cms.doctors || DOCTORS,
      services: cms.services || SERVICES,
      facilities: cms.facilities || FACILITIES_LIST,
      partners: cms.partners || INSURANCE_PARTNERS,
      gallery: cms.gallery || GALLERY_ITEMS,
      faqs: cms.faqs || FAQS,
    };

    return NextResponse.json({ success: true, data: responsePayload });
  } catch (error) {
    console.error("GET CMS error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load CMS content" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const existing = await getCmsData();

    const updated = {
      ...existing,
      ...body,
    };

    await saveCmsData(updated);

    return NextResponse.json({
      success: true,
      message: "Hospital content updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("POST CMS error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save CMS content" },
      { status: 500 }
    );
  }
}

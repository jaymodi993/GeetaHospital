import { NextResponse } from "next/server";
import { getCmsData, saveCmsData } from "@/lib/cmsData";
import { DOCTORS, SERVICES, GALLERY_ITEMS } from "@/data/hospitalData";

export async function GET() {
  try {
    const cms = await getCmsData();

    // If doctors, services, or gallery are not yet customized in CMS, populate with defaults
    const responsePayload = {
      hospitalProfile: cms.hospitalProfile || {},
      announcements: cms.announcements || [],
      seoSettings: cms.seoSettings || {},
      doctors: cms.doctors || DOCTORS,
      services: cms.services || SERVICES,
      gallery: cms.gallery || GALLERY_ITEMS,
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

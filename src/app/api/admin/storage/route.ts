import { NextResponse } from "next/server";
import {
  getActiveCloudinaryConfig,
  isCloudinaryConfigured,
  testCloudinaryConnection,
  clearCloudinaryFolder,
} from "@/lib/cloudinary";
import { getCmsData, saveCmsData } from "@/lib/cmsData";
import { HOSPITAL_INFO, DOCTORS, INSURANCE_PARTNERS, GALLERY_ITEMS } from "@/data/hospitalData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    const isConfigured = await isCloudinaryConfigured();
    const config = await getActiveCloudinaryConfig();

    return NextResponse.json({
      success: true,
      configured: isConfigured,
      settings: {
        cloudName: config.cloudName || "",
        apiKey: config.apiKey ? `${config.apiKey.slice(0, 4)}...${config.apiKey.slice(-3)}` : "",
        isSecretSet: Boolean(config.apiSecret),
        folder: config.folder || "geeta-hospital",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get storage status" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "test") {
      const result = await testCloudinaryConnection();
      return NextResponse.json(result);
    }

    if (action === "save-config") {
      const { cloudName, apiKey, apiSecret, folder } = body;

      if (!cloudName?.trim() || !apiKey?.trim() || !apiSecret?.trim()) {
        return NextResponse.json(
          { success: false, error: "Cloud Name, API Key, and API Secret are required." },
          { status: 400 }
        );
      }

      const cms = await getCmsData();
      const updatedCms = {
        ...cms,
        storageSettings: {
          cloudName: cloudName.trim(),
          apiKey: apiKey.trim(),
          apiSecret: apiSecret.trim(),
          folder: (folder || "geeta-hospital").trim(),
          updatedAt: new Date().toISOString(),
        },
      };

      await saveCmsData(updatedCms);

      // Verify connection immediately
      const test = await testCloudinaryConnection();

      return NextResponse.json({
        success: true,
        message: "Cloudinary settings saved successfully.",
        connected: test.success,
        connectionError: test.error,
      });
    }

    if (action === "clear-storage") {
      const config = await getActiveCloudinaryConfig();
      let cloudinaryResult: any = { success: true, deletedCount: 0 };

      // 1. If Cloudinary is configured, clear the folder
      if (config.cloudName && config.apiKey && config.apiSecret) {
        cloudinaryResult = await clearCloudinaryFolder(config.folder || "geeta-hospital");
      }

      // 2. Reset custom CMS image URLs back to official hospital baseline defaults
      const cms = await getCmsData();
      const resetCms = {
        ...cms,
        hospitalProfile: {
          ...(cms.hospitalProfile || HOSPITAL_INFO),
          logoUrl: HOSPITAL_INFO.logoUrl || "https://res.cloudinary.com/jaymodi/image/upload/v1795354038/geeta-hospital/logo.png",
          faviconUrl: HOSPITAL_INFO.faviconUrl || "https://res.cloudinary.com/jaymodi/image/upload/v1795354213/geeta-hospital/favicon-32.png",
          heroBannerUrl: HOSPITAL_INFO.heroBannerUrl || "https://res.cloudinary.com/jaymodi/image/upload/v1795354125/geeta-hospital/hero-banner-1.jpg",
        },
        doctors: DOCTORS,
        partners: INSURANCE_PARTNERS,
        gallery: GALLERY_ITEMS,
      };

      await saveCmsData(resetCms);

      return NextResponse.json({
        success: true,
        message: "Cloud storage emptied and all media reset to pristine hospital defaults.",
        deletedCount: cloudinaryResult.deletedCount || 0,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Storage action error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process storage action" },
      { status: 500 }
    );
  }
}

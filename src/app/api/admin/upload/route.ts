import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length > 3.8 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File exceeds 3.8MB maximum limit. Please select a smaller or compressed image." },
        { status: 400 }
      );
    }

    // Sanitize filename and get extension
    const originalName = file.name || "upload";
    const ext =
      path.extname(originalName).toLowerCase() ||
      (file.type.includes("png")
        ? ".png"
        : file.type.includes("svg")
        ? ".svg"
        : file.type.includes("icon") || file.type.includes("ico")
        ? ".ico"
        : ".jpg");
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    const safeFileName = `${baseName}-${Date.now()}${ext}`;

    const mimeType =
      file.type ||
      (ext === ".svg"
        ? "image/svg+xml"
        : ext === ".png"
        ? "image/png"
        : ext === ".ico"
        ? "image/x-icon"
        : "image/jpeg");
    const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

    let localUrl: string | null = null;

    // Check if running on Vercel serverless (where root filesystem is read-only)
    const isVercel = process.env.VERCEL === "1" || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

    if (!isVercel) {
      try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const mainDest = path.join(uploadsDir, safeFileName);
        fs.writeFileSync(mainDest, buffer);
        localUrl = `/uploads/${safeFileName}`;

        if (type === "logo") {
          try {
            const logoPath = path.join(process.cwd(), "public", "images", "logo.png");
            fs.writeFileSync(logoPath, buffer);
            localUrl = "/images/logo.png";
          } catch (e) {
            console.warn("Logo overwrite warning:", e);
          }
        } else if (type === "favicon") {
          try {
            const publicFavicon = path.join(process.cwd(), "public", "favicon.ico");
            fs.writeFileSync(publicFavicon, buffer);
            localUrl = "/favicon.ico";
          } catch (e) {
            console.warn("Favicon overwrite warning:", e);
          }
        }
      } catch (err) {
        console.warn("Local disk write warning:", err);
      }
    }

    // On Vercel, dataUrl is self-contained and avoids serverless read-only disk issues
    const resolvedUrl = localUrl || dataUrl;

    return NextResponse.json({
      success: true,
      url: resolvedUrl,
      dataUrl,
      fileName: safeFileName,
      size: buffer.length,
      mimeType,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process upload" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    // Sanitize filename and get extension
    const originalName = file.name || "upload";
    const ext = path.extname(originalName).toLowerCase() || (file.type.includes("png") ? ".png" : file.type.includes("svg") ? ".svg" : file.type.includes("icon") || file.type.includes("ico") ? ".ico" : ".jpg");
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    const timestamp = Date.now();
    const safeFileName = `${baseName}-${timestamp}${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let publicUrl = `/uploads/${safeFileName}`;
    const mainDest = path.join(uploadsDir, safeFileName);
    fs.writeFileSync(mainDest, buffer);

    // Context-specific destinations
    if (type === "logo") {
      try {
        const logoPath = path.join(process.cwd(), "public", "images", "logo.png");
        fs.writeFileSync(logoPath, buffer);
        publicUrl = "/images/logo.png";
      } catch (err) {
        console.warn("Could not overwrite /images/logo.png, using upload path:", err);
      }
    } else if (type === "favicon") {
      try {
        const publicFavicon = path.join(process.cwd(), "public", "favicon.ico");
        const appFavicon = path.join(process.cwd(), "src", "app", "favicon.ico");
        fs.writeFileSync(publicFavicon, buffer);
        if (fs.existsSync(path.dirname(appFavicon))) {
          fs.writeFileSync(appFavicon, buffer);
        }
        publicUrl = "/favicon.ico";
      } catch (err) {
        console.warn("Could not overwrite favicon.ico, using upload path:", err);
      }
    } else if (type === "doctor") {
      try {
        const docDir = path.join(process.cwd(), "public", "images", "doctors");
        if (!fs.existsSync(docDir)) fs.mkdirSync(docDir, { recursive: true });
        const docDest = path.join(docDir, safeFileName);
        fs.writeFileSync(docDest, buffer);
        publicUrl = `/images/doctors/${safeFileName}`;
      } catch (err) {
        console.warn("Could not write to doctors dir:", err);
      }
    } else if (type === "partner") {
      try {
        const partnerDir = path.join(process.cwd(), "public", "images", "partners");
        if (!fs.existsSync(partnerDir)) fs.mkdirSync(partnerDir, { recursive: true });
        const partnerDest = path.join(partnerDir, safeFileName);
        fs.writeFileSync(partnerDest, buffer);
        publicUrl = `/images/partners/${safeFileName}`;
      } catch (err) {
        console.warn("Could not write to partners dir:", err);
      }
    }

    // Generate base64 Data URL for serverless resilience
    const mimeType = file.type || (ext === ".svg" ? "image/svg+xml" : ext === ".png" ? "image/png" : ext === ".ico" ? "image/x-icon" : "image/jpeg");
    const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
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

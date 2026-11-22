import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const portalDataPath = path.join(process.cwd(), "src", "data", "portalData.json");

function getPortalData() {
  if (!fs.existsSync(portalDataPath)) return null;
  return JSON.parse(fs.readFileSync(portalDataPath, "utf8"));
}

function savePortalData(data: any) {
  fs.writeFileSync(portalDataPath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  try {
    const data = getPortalData();
    return NextResponse.json({
      success: true,
      announcements: data?.announcements || [],
      hospitalSettings: data?.hospitalSettings || {},
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category = "General" } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    const data = getPortalData();
    const newId = `ann-${Date.now()}`;
    const newAnn = {
      id: newId,
      title: title.trim(),
      content: content.trim(),
      category,
      isActive: true,
      date: new Date().toISOString().split("T")[0],
    };

    data.announcements.unshift(newAnn);
    savePortalData(data);

    return NextResponse.json({
      success: true,
      message: "Announcement added successfully",
      announcement: newAnn,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add announcement" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isActive, hospitalSettings } = body;

    const data = getPortalData();

    if (hospitalSettings) {
      data.hospitalSettings = { ...data.hospitalSettings, ...hospitalSettings };
    }

    if (id) {
      const idx = data.announcements.findIndex((a: any) => a.id === id);
      if (idx !== -1 && isActive !== undefined) {
        data.announcements[idx].isActive = isActive;
      }
    }

    savePortalData(data);

    return NextResponse.json({
      success: true,
      message: "Updated successfully",
      announcements: data.announcements,
      hospitalSettings: data.hospitalSettings,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
    }

    const data = getPortalData();
    data.announcements = data.announcements.filter((a: any) => a.id !== id);
    savePortalData(data);

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully",
      announcements: data.announcements,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}

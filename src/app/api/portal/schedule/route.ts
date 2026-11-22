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
    if (!data) {
      return NextResponse.json({ success: false, error: "Data not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      doctorSchedules: data.doctorSchedules || [],
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load schedule" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { doctorId, status, timing, note } = body;

    if (!doctorId) {
      return NextResponse.json({ success: false, error: "doctorId is required" }, { status: 400 });
    }

    const data = getPortalData();
    if (!data) {
      return NextResponse.json({ success: false, error: "Data not found" }, { status: 404 });
    }

    const idx = data.doctorSchedules.findIndex((d: any) => d.doctorId === doctorId);
    if (idx === -1) {
      // Add new schedule record
      data.doctorSchedules.push({
        doctorId,
        doctorName: body.doctorName || doctorId,
        department: body.department || "Consultant",
        status: status || "Available",
        timing: timing || "10:00 AM - 1:30 PM & 5:00 PM - 8:00 PM",
        note: note || "",
      });
    } else {
      // Update existing
      if (status !== undefined) data.doctorSchedules[idx].status = status;
      if (timing !== undefined) data.doctorSchedules[idx].timing = timing;
      if (note !== undefined) data.doctorSchedules[idx].note = note;
    }

    savePortalData(data);

    return NextResponse.json({
      success: true,
      message: "Doctor schedule updated successfully",
      schedules: data.doctorSchedules,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update schedule" }, { status: 500 });
  }
}

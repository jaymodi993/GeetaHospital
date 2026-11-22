import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface AppointmentRecord {
  id: string;
  tokenNumber: string;
  patientName: string;
  phone: string;
  age: string;
  gender: "Male" | "Female" | "Child" | "Other";
  department: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  symptoms?: string;
  status: "Pending" | "Confirmed" | "In Consultation" | "Completed" | "Cancelled";
  createdAt: string;
  estimatedReportingTime: string;
  roomNumber: string;
  type: "Online" | "Walk-in";
  notes?: string;
}

const dataFilePath = path.join(process.cwd(), "src", "data", "appointments.json");

function getAppointments(): AppointmentRecord[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const fileData = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading appointments:", error);
    return [];
  }
}

function saveAppointments(appointments: AppointmentRecord[]): boolean {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(appointments, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing appointments:", error);
    return false;
  }
}

// Room mapping helper
function getDoctorRoom(doctorId: string, dept: string): string {
  if (doctorId.includes("kundan") || doctorId.includes("avani")) {
    return "Maternity & Gynec Room 101 (1st Floor)";
  }
  if (doctorId.includes("omkarsinh") || doctorId.includes("krupa")) {
    return "Pediatric OPD Room 104 (1st Floor)";
  }
  if (doctorId.includes("rahul")) {
    return "Dental Clinic Suite (Ground Floor)";
  }
  if (doctorId.includes("shailesh")) {
    return "Orthopedic Trauma Room 103 (1st Floor)";
  }
  if (doctorId.includes("vinod") || doctorId.includes("tahira") || doctorId.includes("gautam")) {
    return "General Medicine & ICU Room 102";
  }
  return "Visiting Specialist Suite A (Ground Floor)";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");
    const status = searchParams.get("status");

    let appointments = getAppointments();

    if (doctorId && doctorId !== "all") {
      appointments = appointments.filter((a) => a.doctorId === doctorId);
    }
    if (date) {
      appointments = appointments.filter((a) => a.date === date);
    }
    if (status && status !== "all") {
      appointments = appointments.filter((a) => a.status === status);
    }

    // Sort descending by creation
    appointments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      patientName,
      phone,
      age = "30",
      gender = "Other",
      department = "General Consultation",
      doctorId = "dr-kundan-modi",
      doctorName = "Dr. Kundan B. Modi",
      date,
      timeSlot = "Morning (10:00 AM - 1:00 PM)",
      symptoms = "",
      notes = "",
      type = "Online",
    } = body;

    if (!patientName || !phone) {
      return NextResponse.json(
        { success: false, error: "Patient name and phone number are required" },
        { status: 400 }
      );
    }

    const appointments = getAppointments();

    // Generate Token Number
    const appointmentDate = date || new Date().toISOString().split("T")[0];
    const dateFormatted = appointmentDate.replace(/-/g, "").slice(2); // e.g. 261122
    const todayTokens = appointments.filter((a) => a.date === appointmentDate);
    const seq = (todayTokens.length + 1).toString().padStart(3, "0");
    const tokenNumber = `GH-${seq}`;
    const id = `GH-${dateFormatted}-${seq}`;

    // Estimated reporting time based on slot
    let estimatedReportingTime = "10:15 AM";
    if (timeSlot.toLowerCase().includes("evening")) {
      estimatedReportingTime = "05:15 PM";
    } else if (timeSlot.toLowerCase().includes("emergency")) {
      estimatedReportingTime = "Immediate (24x7 Emergency)";
    }

    const roomNumber = getDoctorRoom(doctorId, department);

    const newAppointment: AppointmentRecord = {
      id,
      tokenNumber,
      patientName: patientName.trim(),
      phone: phone.trim(),
      age: String(age).trim(),
      gender: gender as AppointmentRecord["gender"],
      department,
      doctorId,
      doctorName,
      date: appointmentDate,
      timeSlot,
      symptoms: symptoms.trim(),
      status: "Pending",
      createdAt: new Date().toISOString(),
      estimatedReportingTime,
      roomNumber,
      type: (type as AppointmentRecord["type"]) || "Online",
      notes: notes.trim(),
    };

    appointments.unshift(newAppointment);
    saveAppointments(appointments);

    return NextResponse.json(
      {
        success: true,
        message: "Appointment token generated successfully",
        appointment: newAppointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Appointment ID and status are required" },
        { status: 400 }
      );
    }

    const appointments = getAppointments();
    const index = appointments.findIndex((a) => a.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      );
    }

    appointments[index].status = status;
    if (notes !== undefined) {
      appointments[index].notes = notes;
    }

    saveAppointments(appointments);

    return NextResponse.json({
      success: true,
      message: "Appointment updated successfully",
      appointment: appointments[index],
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

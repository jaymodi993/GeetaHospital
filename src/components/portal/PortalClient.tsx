"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  Printer,
  CheckCircle2,
  Clock3,
  Stethoscope,
  Filter,
  PlusCircle,
  Building,
  RefreshCw,
  Search,
  AlertCircle,
  FileText,
  UserCheck,
  MapPin,
  ArrowLeft,
  X,
  Lock,
  LogOut,
  Shield,
  Volume2,
  VolumeX,
  Bell,
  Edit,
  Trash2,
  Save,
  Check,
  Send,
  Sparkles,
} from "lucide-react";
import { DOCTORS, HOSPITAL_INFO } from "@/data/hospitalData";
import { AppointmentRecord } from "@/app/api/appointments/route";

// Sound Synthesizer via Web Audio API (100% Free, Zero packages)
function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Tone 1: High crisp bell
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.45);

    // Tone 2: Harmonious chime
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.12); // A5
    gain2.gain.setValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.85);
  } catch (e) {
    console.error("Audio chime error:", e);
  }
}

interface UserSession {
  id: string;
  username: string;
  role: "admin" | "reception" | "doctor";
  name: string;
  email?: string;
  doctorId?: string;
  department?: string;
  roomNumber?: string;
}

interface DoctorScheduleItem {
  doctorId: string;
  doctorName: string;
  department: string;
  status: "Available" | "On Leave" | "Emergency Only" | "Visiting Camp";
  timing: string;
  note: string;
}

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  isActive: boolean;
  date: string;
}

export default function PortalClient() {
  const todayStr = new Date().toISOString().split("T")[0];

  // Auth State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "admin123" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Sound & Live Alert State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [latestAlert, setLatestAlert] = useState<string | null>(null);
  const prevAppointmentsCount = useRef<number>(0);

  // Tab State for Admin
  const [adminTab, setAdminTab] = useState<"queue" | "roster" | "announcements" | "settings">("queue");

  // Data States
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [schedules, setSchedules] = useState<DoctorScheduleItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [hospitalSettings, setHospitalSettings] = useState<any>({});

  // Filter States
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals & Print
  const [isWalkinModalOpen, setIsWalkinModalOpen] = useState(false);
  const [selectedLetterheadApt, setSelectedLetterheadApt] = useState<AppointmentRecord | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState<string>("");

  // New Announcement Form
  const [newAnnForm, setNewAnnForm] = useState({ title: "", content: "", category: "General Notice" });

  // Walk-in form state
  const [walkinForm, setWalkinForm] = useState({
    patientName: "",
    phone: "",
    age: "30",
    gender: "Female" as AppointmentRecord["gender"],
    doctorId: "dr-kundan-modi",
    date: todayStr,
    timeSlot: "Morning (10:00 AM - 1:00 PM)",
    symptoms: "Walk-in consultation",
    notes: "",
  });

  // Restore saved session from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("gh_portal_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        if (parsed.role === "doctor" && parsed.doctorId) {
          setSelectedDoctorId(parsed.doctorId);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Appointments
      const resApt = await fetch("/api/appointments");
      const dataApt = await resApt.json();
      if (dataApt.success && dataApt.appointments) {
        // Sound check: if new appointment arrived
        if (
          prevAppointmentsCount.current > 0 &&
          dataApt.appointments.length > prevAppointmentsCount.current
        ) {
          const newest = dataApt.appointments[0];
          setLatestAlert(`🔔 New OPD Token: ${newest.tokenNumber} for ${newest.patientName} (${newest.doctorName})`);
          if (soundEnabled) playNotificationChime();
        }
        prevAppointmentsCount.current = dataApt.appointments.length;
        setAppointments(dataApt.appointments);
      }

      // Fetch Doctor Schedules
      const resSched = await fetch("/api/portal/schedule");
      const dataSched = await resSched.json();
      if (dataSched.success && dataSched.doctorSchedules) {
        setSchedules(dataSched.doctorSchedules);
      }

      // Fetch Announcements
      const resAnn = await fetch("/api/portal/announcements");
      const dataAnn = await resAnn.json();
      if (dataAnn.success) {
        setAnnouncements(dataAnn.announcements || []);
        setHospitalSettings(dataAnn.hospitalSettings || {});
      }
    } catch (err) {
      console.error("Fetch data error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-polling for live reception & doctor queue every 12 seconds
    const interval = setInterval(fetchData, 12000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Handle Login
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/portal/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem("gh_portal_user", JSON.stringify(data.user));

        if (data.user.role === "doctor" && data.user.doctorId) {
          setSelectedDoctorId(data.user.doctorId);
        } else {
          setSelectedDoctorId("all");
        }
      } else {
        setLoginError(data.error || "Invalid username or password");
      }
    } catch (err) {
      setLoginError("Login failed. Check your network connection.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Quick Demo Login helper
  const handleQuickLogin = (role: "admin" | "reception" | "doctor", doctorId?: string) => {
    if (role === "admin") {
      setLoginForm({ username: "admin", password: "admin123" });
      setTimeout(() => {
        setCurrentUser({
          id: "admin-1",
          username: "admin",
          role: "admin",
          name: "Hospital Medical Superintendent / Admin",
        });
        localStorage.setItem(
          "gh_portal_user",
          JSON.stringify({
            id: "admin-1",
            username: "admin",
            role: "admin",
            name: "Hospital Medical Superintendent / Admin",
          })
        );
        setSelectedDoctorId("all");
      }, 50);
    } else if (role === "reception") {
      setLoginForm({ username: "reception", password: "reception123" });
      setTimeout(() => {
        setCurrentUser({
          id: "reception-1",
          username: "reception",
          role: "reception",
          name: "Front Desk Reception Team",
        });
        localStorage.setItem(
          "gh_portal_user",
          JSON.stringify({
            id: "reception-1",
            username: "reception",
            role: "reception",
            name: "Front Desk Reception Team",
          })
        );
        setSelectedDoctorId("all");
      }, 50);
    } else if (role === "doctor") {
      const doc = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];
      const username = `dr.${doc.name.split(" ")[1]?.toLowerCase() || "doc"}`;
      setLoginForm({ username, password: "doctor123" });
      setTimeout(() => {
        const docUser: UserSession = {
          id: `doc-${doc.id}`,
          username,
          role: "doctor",
          doctorId: doc.id,
          name: doc.name,
          department: doc.department,
          roomNumber: "OPD Consultation Room (1st Floor)",
        };
        setCurrentUser(docUser);
        localStorage.setItem("gh_portal_user", JSON.stringify(docUser));
        setSelectedDoctorId(doc.id);
      }, 50);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("gh_portal_user");
    setSelectedDoctorId("all");
  };

  // Update appointment status
  const handleUpdateStatus = async (
    id: string,
    newStatus: AppointmentRecord["status"],
    notes?: string
  ) => {
    try {
      const payload: any = { id, status: newStatus };
      if (notes !== undefined) payload.notes = notes;

      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus, ...(notes ? { notes } : {}) } : a))
        );
        setEditingNotesId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Doctor Roster / Schedule (Admin)
  const handleUpdateDoctorSchedule = async (
    doctorId: string,
    status: DoctorScheduleItem["status"],
    timing?: string,
    note?: string
  ) => {
    try {
      const res = await fetch("/api/portal/schedule", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, status, timing, note }),
      });
      const data = await res.json();
      if (data.success && data.schedules) {
        setSchedules(data.schedules);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Announcement (Admin)
  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/portal/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnForm),
      });
      const data = await res.json();
      if (data.success && data.announcement) {
        setAnnouncements((prev) => [data.announcement, ...prev]);
        setNewAnnForm({ title: "", content: "", category: "General Notice" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const res = await fetch(`/api/portal/announcements?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit walkin patient
  const handleCreateWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const doc = DOCTORS.find((d) => d.id === walkinForm.doctorId);
      const payload = {
        patientName: walkinForm.patientName,
        phone: walkinForm.phone,
        age: walkinForm.age,
        gender: walkinForm.gender,
        doctorId: walkinForm.doctorId,
        doctorName: doc ? doc.name : "Dr. Kundan B. Modi",
        department: doc ? doc.department : "General OPD",
        date: walkinForm.date,
        timeSlot: walkinForm.timeSlot,
        symptoms: walkinForm.symptoms,
        notes: walkinForm.notes,
        type: "Walk-in",
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.appointment) {
        setAppointments((prev) => [data.appointment, ...prev]);
        setIsWalkinModalOpen(false);
        if (soundEnabled) playNotificationChime();
        setLatestAlert(`Walk-in Token Issued: ${data.appointment.tokenNumber} for ${data.appointment.patientName}`);
      }
    } catch (err) {
      console.error("Error creating walk-in:", err);
    }
  };

  // WhatsApp Helpers
  const sendWhatsAppConfirmationToPatient = (apt: AppointmentRecord) => {
    const rawNumber = apt.phone.replace(/[^0-9]/g, "");
    const formattedNumber = rawNumber.startsWith("91") ? rawNumber : `91${rawNumber}`;
    const text = `🏥 *GEETA HOSPITAL MUNDRA - OPD APPOINTMENT CONFIRMATION*
━━━━━━━━━━━━━━━━━━━━━
Namaste *${apt.patientName}*,

Your OPD consultation appointment is *CONFIRMED*.

🎫 *Token Number:* *${apt.tokenNumber}* (ID: ${apt.id})
👨‍⚕️ *Consulting Doctor:* ${apt.doctorName}
🏥 *Speciality:* ${apt.department}
📍 *Consultation Room:* ${apt.roomNumber}
📅 *Date:* ${apt.date}
⏰ *Time Slot:* ${apt.timeSlot}
⏳ *Estimated Reporting Time:* ${apt.estimatedReportingTime}

*Instructions on Arrival:*
1. Please report at 1st Floor Reception Desk 15 mins before your time.
2. Show this WhatsApp token to the receptionist.
3. Bring previous prescriptions, reports, and photo ID.

📍 *Address:* 3, Ambe Nagar, Gundala Road, Baroi-Mundra
📞 *Emergency Phone:* +91 78743 81551

_Wishing you good health,_
*Front Desk — Geeta Multi-Speciality Hospital*`;

    window.open(`https://wa.me/${formattedNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const sendWhatsAppAlertToDoctor = (apt: AppointmentRecord) => {
    const text = `👨‍⚕️ *GEETA HOSPITAL - PATIENT OPD QUEUE ALERT*
━━━━━━━━━━━━━━━━━━━━━
*Doctor:* ${apt.doctorName}
*Patient:* ${apt.patientName} (${apt.age} Yrs, ${apt.gender})
*Token No:* *${apt.tokenNumber}*
*Time Slot:* ${apt.timeSlot}
*Date:* ${apt.date}
*Symptoms:* ${apt.symptoms || "Regular checkup"}
*Status:* ${apt.status}
━━━━━━━━━━━━━━━━━━━━━
_Sent from Geeta Hospital Reception Desk_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (currentUser?.role === "doctor" && currentUser.doctorId) {
      if (apt.doctorId !== currentUser.doctorId) return false;
    } else if (selectedDoctorId !== "all" && apt.doctorId !== selectedDoctorId) {
      return false;
    }

    if (selectedDate !== "all" && apt.date !== selectedDate) return false;
    if (selectedStatus !== "all" && apt.status !== selectedStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.patientName.toLowerCase().includes(q);
      const matchToken = apt.tokenNumber.toLowerCase().includes(q);
      const matchPhone = apt.phone.includes(q);
      const matchDoc = apt.doctorName.toLowerCase().includes(q);
      if (!matchName && !matchToken && !matchPhone && !matchDoc) return false;
    }
    return true;
  });

  // KPI counts
  const totalCount = filteredAppointments.length;
  const confirmedCount = filteredAppointments.filter((a) => a.status === "Confirmed").length;
  const inConsultCount = filteredAppointments.filter((a) => a.status === "In Consultation").length;
  const completedCount = filteredAppointments.filter((a) => a.status === "Completed").length;
  const pendingCount = filteredAppointments.filter((a) => a.status === "Pending").length;

  // -------------------------------------------------------------
  // RENDER 1: LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-800 to-teal-800 p-7 text-white text-center relative">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center">
              <Image src="/images/logo.png" alt="Geeta Hospital" width={48} height={48} className="object-contain" />
            </div>
            <h2 className="text-xl font-black tracking-tight">GEETA HOSPITAL MUNDRA</h2>
            <p className="text-sky-100 text-xs mt-1 font-medium">Hospital Staff, Reception & Doctor Portal</p>
          </div>

          {/* Form */}
          <div className="p-7">
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Staff Username / ID
                </label>
                <input
                  type="text"
                  required
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  placeholder="e.g. admin, reception, dr.kundan"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{isLoggingIn ? "Authenticating..." : "Login to Hospital Portal"}</span>
              </button>
            </form>

            {/* Quick Demo One-Click Login Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                ⚡ Demo 1-Click Role Logins
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("admin")}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-200 transition"
                >
                  🛡️ Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("reception")}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition"
                >
                  🛎️ Reception
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("doctor", "dr-kundan-modi")}
                  className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold border border-sky-200 transition"
                >
                  🩺 Dr. Kundan
                </button>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("doctor", "dr-omkarsinh-chudasama")}
                  className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold border border-purple-200 transition"
                >
                  👶 Dr. Omkarsinh (Ped)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("doctor", "dr-vinod-prajapati")}
                  className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold border border-teal-200 transition"
                >
                  🏥 Dr. Vinod (ICU)
                </button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-xs text-sky-600 hover:underline font-semibold">
                ← Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER 2: AUTHENTICATED PORTAL VIEW
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Banner & User Session Info */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Branding & Role */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Website</span>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  GEETA HOSPITAL
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    currentUser.role === "admin"
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                      : currentUser.role === "reception"
                      ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                      : "bg-purple-400/20 text-purple-300 border border-purple-400/30"
                  }`}
                >
                  {currentUser.role} PORTAL
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium">
                Logged in as: <strong>{currentUser.name}</strong>
              </span>
            </div>
          </div>

          {/* Right: Controls & Logout */}
          <div className="flex items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-xl border text-xs transition flex items-center gap-1 ${
                soundEnabled
                  ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
              title={soundEnabled ? "Notification sound ON" : "Notification sound OFF"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-[10px] font-bold hidden sm:inline">{soundEnabled ? "Audio ON" : "Muted"}</span>
            </button>

            {/* Walk-in Button (For Admin and Reception) */}
            {currentUser.role !== "doctor" && (
              <button
                onClick={() => setIsWalkinModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">+ Walk-in Token</span>
              </button>
            )}

            {/* Print Doctor Sheet */}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition"
              title="Print Doctor's OPD Sheet"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline">Print OPD Sheet</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-700 text-white text-xs font-bold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Notification Banner */}
      {latestAlert && (
        <div className="bg-gradient-to-r from-sky-600 to-teal-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between animate-fade-in print:hidden">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <Bell className="w-4 h-4 animate-bounce" />
            <span>{latestAlert}</span>
          </div>
          <button onClick={() => setLatestAlert(null)} className="p-1 hover:bg-white/20 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Admin Navigation Tabs */}
        {currentUser.role === "admin" && (
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3 overflow-x-auto print:hidden">
            <button
              onClick={() => setAdminTab("queue")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                adminTab === "queue"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Master OPD Queue</span>
            </button>

            <button
              onClick={() => setAdminTab("roster")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                adminTab === "roster"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Doctor Availability Roster</span>
            </button>

            <button
              onClick={() => setAdminTab("announcements")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                adminTab === "announcements"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Announcements & Notices</span>
            </button>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW A: DOCTOR AVAILABILITY ROSTER (Admin Only) */}
        {/* ----------------------------------------------------------- */}
        {currentUser.role === "admin" && adminTab === "roster" && (
          <div className="space-y-4 print:hidden">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Hospital Doctor Availability & Duty Roster</h3>
                  <p className="text-xs text-slate-500">
                    Set which doctor is on duty, on leave, or available for emergency. This syncs with the online booking modal.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schedules.map((doc) => (
                  <div key={doc.doctorId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{doc.doctorName}</h4>
                        <span className="text-xs text-slate-600">{doc.department}</span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          doc.status === "Available"
                            ? "bg-emerald-100 text-emerald-800"
                            : doc.status === "On Leave"
                            ? "bg-red-100 text-red-800"
                            : doc.status === "Emergency Only"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-500">Change Status:</span>
                      <button
                        onClick={() => handleUpdateDoctorSchedule(doc.doctorId, "Available")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          doc.status === "Available" ? "bg-emerald-600 text-white" : "bg-white border text-slate-700"
                        }`}
                      >
                        Available
                      </button>
                      <button
                        onClick={() => handleUpdateDoctorSchedule(doc.doctorId, "On Leave")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          doc.status === "On Leave" ? "bg-red-600 text-white" : "bg-white border text-slate-700"
                        }`}
                      >
                        On Leave
                      </button>
                      <button
                        onClick={() => handleUpdateDoctorSchedule(doc.doctorId, "Emergency Only")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          doc.status === "Emergency Only" ? "bg-amber-600 text-white" : "bg-white border text-slate-700"
                        }`}
                      >
                        Emergency Only
                      </button>
                    </div>

                    <div className="text-xs text-slate-500">
                      <strong>Timing:</strong> {doc.timing}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW B: ANNOUNCEMENTS & NOTICES (Admin Only) */}
        {/* ----------------------------------------------------------- */}
        {currentUser.role === "admin" && adminTab === "announcements" && (
          <div className="space-y-6 print:hidden">
            {/* Create Announcement */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Add New Notice / Health Camp Announcement</h3>
              <form onSubmit={handleAddAnnouncement} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Free Cardiology Health Camp This Sunday"
                      value={newAnnForm.title}
                      onChange={(e) => setNewAnnForm({ ...newAnnForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={newAnnForm.category}
                      onChange={(e) => setNewAnnForm({ ...newAnnForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500 bg-slate-50"
                    >
                      <option value="General Notice">General Notice</option>
                      <option value="Camp">Health Camp</option>
                      <option value="Emergency">Emergency</option>
                      <option value="TPA / Cashless">TPA / Cashless</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notice Details *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Details about camp timing, visiting doctors, or facility update..."
                    value={newAnnForm.content}
                    onChange={(e) => setNewAnnForm({ ...newAnnForm, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Publish Announcement
                </button>
              </form>
            </div>

            {/* List Announcements */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800">Current Active Notices ({announcements.length})</h4>
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{ann.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                        {ann.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{ann.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{ann.content}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                    title="Delete notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW C: APPOINTMENTS QUEUE (Admin, Reception & Doctor) */}
        {/* ----------------------------------------------------------- */}
        {(currentUser.role !== "admin" || adminTab === "queue") && (
          <div className="space-y-6">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 print:hidden">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  {currentUser.role === "doctor" ? "My Patients Today" : "Total Today Tokens"}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalCount}</span>
                  <Users className="w-5 h-5 text-sky-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs bg-emerald-50/20">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Confirmed Tokens
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700">{confirmedCount}</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs bg-purple-50/20">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 block">
                  In Consultation
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-purple-700">{inConsultCount}</span>
                  <Stethoscope className="w-5 h-5 text-purple-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs bg-amber-50/20">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                  Waiting in Lobby
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-amber-700">{pendingCount}</span>
                  <Clock3 className="w-5 h-5 text-amber-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Completed
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-700">{completedCount}</span>
                  <UserCheck className="w-5 h-5 text-teal-600" />
                </div>
              </div>
            </div>

            {/* Filter Bar (Only for Admin & Reception, Doctor is automatically pinned) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 print:hidden">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    {currentUser.role === "doctor"
                      ? `Doctor Consultation Room: ${currentUser.name}`
                      : "Filter OPD Queue"}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                    Live Tokens: {filteredAppointments.length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Doctor Filter (Hidden for Doctor role) */}
                {currentUser.role !== "doctor" ? (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Consulting Doctor
                    </label>
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                    >
                      <option value="all">-- All Doctors (Master Queue) --</option>
                      {DOCTORS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.department})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Doctor Department
                    </label>
                    <div className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold text-sky-900 border border-slate-200">
                      {currentUser.department}
                    </div>
                  </div>
                )}

                {/* Date Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Date
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="date"
                      value={selectedDate === "all" ? "" : selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value || "all")}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500 bg-slate-50"
                    />
                    <button
                      onClick={() => setSelectedDate(todayStr)}
                      className={`px-2 py-2 rounded-xl text-xs font-bold transition ${
                        selectedDate === todayStr ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setSelectedDate("all")}
                      className={`px-2 py-2 rounded-xl text-xs font-bold transition ${
                        selectedDate === "all" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      All
                    </button>
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending Check-in</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Consultation">In Consultation</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Search */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Search Patient
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Name, token, phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Printable Daily Sheet (Shown on window.print) */}
            <div id="doctor-print-sheet" className="hidden print:block p-8 bg-white">
              <div className="border-b-2 border-slate-900 pb-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900">GEETA MULTI-SPECIALITY HOSPITAL</h1>
                    <p className="text-sm text-slate-600">3, Ambe Nagar, Gundala Road, Baroi-Mundra • Ph: +91 78743 81551</p>
                    <p className="text-xs font-semibold text-sky-800 mt-1">DAILY DOCTOR OPD CONSULTATION SHEET</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">Date: {selectedDate}</p>
                    <p className="text-sm text-slate-700">Doctor: {currentUser.role === "doctor" ? currentUser.name : selectedDoctorId}</p>
                    <p className="text-xs text-slate-500">Total Tokens: {filteredAppointments.length}</p>
                  </div>
                </div>
              </div>

              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 p-2 text-left">Token #</th>
                    <th className="border border-slate-300 p-2 text-left">Patient Name</th>
                    <th className="border border-slate-300 p-2 text-left">Age/Sex</th>
                    <th className="border border-slate-300 p-2 text-left">Phone</th>
                    <th className="border border-slate-300 p-2 text-left">Slot</th>
                    <th className="border border-slate-300 p-2 text-left">Chief Complaint</th>
                    <th className="border border-slate-300 p-2 text-left">Diagnosis & Rx Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="h-14">
                      <td className="border border-slate-300 p-2 font-bold">{apt.tokenNumber}</td>
                      <td className="border border-slate-300 p-2 font-semibold">{apt.patientName}</td>
                      <td className="border border-slate-300 p-2">{apt.age}/{apt.gender}</td>
                      <td className="border border-slate-300 p-2">{apt.phone}</td>
                      <td className="border border-slate-300 p-2">{apt.timeSlot}</td>
                      <td className="border border-slate-300 p-2">{apt.symptoms || "Routine Consultation"}</td>
                      <td className="border border-slate-300 p-2 w-1/3">{apt.notes || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Queue Cards List */}
            <div className="space-y-3 print:hidden">
              {filteredAppointments.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-700">No Patients in Current Queue</h4>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto mt-1">
                    No matching tokens found for this doctor or filter selection.
                  </p>
                </div>
              ) : (
                filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-sky-300 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      {/* Left: Token & Patient Info */}
                      <div className="flex items-start gap-3.5">
                        <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-sky-600 to-teal-700 text-white shadow-xs flex-shrink-0">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-sky-200">
                            TOKEN
                          </span>
                          <span className="text-base sm:text-lg font-black tracking-tight">
                            {apt.tokenNumber}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold text-slate-900">{apt.patientName}</h4>
                            <span className="text-xs text-slate-500 font-medium">
                              ({apt.age} Yrs, {apt.gender})
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                apt.type === "Walk-in"
                                  ? "bg-slate-100 text-slate-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {apt.type}
                            </span>

                            {/* Status Badge */}
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                apt.status === "Confirmed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : apt.status === "In Consultation"
                                  ? "bg-purple-100 text-purple-800 animate-pulse"
                                  : apt.status === "Completed"
                                  ? "bg-slate-100 text-slate-600"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 mt-1">
                            <span className="font-semibold text-sky-900 flex items-center gap-1">
                              <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                              {apt.doctorName}
                            </span>
                            <span>•</span>
                            <span className="text-slate-500">{apt.department}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-700 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-red-500" />
                              {apt.roomNumber}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mt-1">
                            <span>Date: {apt.date}</span>
                            <span>Slot: {apt.timeSlot}</span>
                            <span className="text-emerald-700 font-semibold">
                              Report at: {apt.estimatedReportingTime}
                            </span>
                          </div>

                          {apt.symptoms && (
                            <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl mt-2 border border-slate-100 max-w-xl">
                              <strong className="text-slate-800">Chief Complaints:</strong> {apt.symptoms}
                            </p>
                          )}

                          {/* Doctor Clinical Notes */}
                          {apt.notes && (
                            <p className="text-xs text-teal-800 bg-teal-50 p-2 rounded-xl mt-1.5 border border-teal-100 max-w-xl">
                              <strong>Clinical Rx Notes:</strong> {apt.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-end">
                        {/* Status progression */}
                        {apt.status === "Pending" && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, "Confirmed")}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                          >
                            ✓ Confirm Token
                          </button>
                        )}

                        {apt.status === "Confirmed" && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, "In Consultation")}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition"
                          >
                            🩺 Call into Room
                          </button>
                        )}

                        {apt.status === "In Consultation" && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, "Completed")}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition"
                          >
                            ✓ Mark Completed
                          </button>
                        )}

                        {/* Doctor: Add/Edit Rx Notes */}
                        {currentUser.role === "doctor" && (
                          <button
                            onClick={() => {
                              setEditingNotesId(apt.id);
                              setNotesInput(apt.notes || "");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs border border-teal-200 transition"
                          >
                            📝 Write Rx Notes
                          </button>
                        )}

                        {/* Official Letterhead PDF Button */}
                        <button
                          onClick={() => setSelectedLetterheadApt(apt)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold text-xs border border-sky-200 transition"
                          title="Generate official hospital letterhead slip"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-600" />
                          <span>Letterhead Slip</span>
                        </button>

                        {/* WhatsApp to Patient (Reception & Admin) */}
                        {currentUser.role !== "doctor" && (
                          <button
                            onClick={() => sendWhatsAppConfirmationToPatient(apt)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200 transition"
                            title="WhatsApp confirmation to patient"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </button>
                        )}

                        {/* WhatsApp to Doctor (Reception) */}
                        {currentUser.role === "reception" && (
                          <button
                            onClick={() => sendWhatsAppAlertToDoctor(apt)}
                            className="p-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition"
                            title="Alert doctor on WhatsApp"
                          >
                            <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                          </button>
                        )}

                        {/* Call */}
                        <a
                          href={`tel:${apt.phone.replace(/[^0-9+]/g, "")}`}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="Call patient"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Inline Rx Notes Editor for Doctor */}
                    {editingNotesId === apt.id && (
                      <div className="mt-3 p-3 bg-teal-50/70 rounded-xl border border-teal-200 space-y-2">
                        <label className="block text-xs font-bold text-teal-900">
                          Clinical Diagnosis & Doctor Prescription Notes
                        </label>
                        <textarea
                          rows={2}
                          value={notesInput}
                          onChange={(e) => setNotesInput(e.target.value)}
                          placeholder="e.g. Advised USG Pelvis, Tab Paracetamol 650mg TDS x 3 days, follow up in 1 week..."
                          className="w-full px-3 py-2 rounded-xl border border-teal-300 text-xs focus:ring-2 focus:ring-teal-500 bg-white"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus(apt.id, apt.status, notesInput)}
                            className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs"
                          >
                            Save Clinical Notes
                          </button>
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: OFFICIAL HOSPITAL LETTERHEAD SLIP (A4 Printable) */}
      {/* ------------------------------------------------------------- */}
      {selectedLetterheadApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Modal Actions Header (Hidden in print) */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between print:hidden">
              <span className="text-xs font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                Official Hospital Letterhead OPD Slip
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Official Slip (PDF)</span>
                </button>
                <button
                  onClick={() => setSelectedLetterheadApt(null)}
                  className="p-1.5 rounded-full hover:bg-white/20 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Official Letterhead Container (Styled for printing) */}
            <div id="official-letterhead" className="p-8 sm:p-10 bg-white text-slate-900 space-y-6">
              {/* Hospital Official Header Masthead */}
              <div className="border-b-4 border-sky-800 pb-5">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-16 h-16 rounded-xl border border-slate-200 p-1 flex-shrink-0 bg-white">
                      <Image src="/images/logo.png" alt="Geeta Hospital Logo" width={60} height={60} className="object-contain" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        GEETA MULTI-SPECIALITY HOSPITAL
                      </h1>
                      <p className="text-xs font-bold text-sky-900">
                        ગીતા મલ્ટી-સ્પેશિયાલિટી હોસ્પિટલ • મુંદ્રા (કચ્છ)
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        45-Bed Multi-Speciality • 24x7 Critical Care, Maternity & Neonatology Center
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-600 space-y-0.5">
                    <span className="font-bold text-emerald-700 block">✓ ISO 9001:2015 Certified</span>
                    <span className="block">ROHINI ID: IIB/HOSP/GJ/370421</span>
                    <span className="block">Ph: +91 78743 81551</span>
                    <span className="block text-[10px] text-slate-500">3, Ambe Nagar, Gundala Road, Baroi-Mundra</span>
                  </div>
                </div>
              </div>

              {/* Title & Token Banner */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">
                    OUT-PATIENT DEPARTMENT (OPD) CONSULTATION TOKEN
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    Registration Ref: <strong className="font-mono">{selectedLetterheadApt.id}</strong>
                  </span>
                </div>

                <div className="text-right bg-white px-4 py-2 rounded-xl border border-sky-300 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    OPD TOKEN NO.
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-sky-700">
                    {selectedLetterheadApt.tokenNumber}
                  </span>
                </div>
              </div>

              {/* Patient & Doctor Two-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Patient Information */}
                <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-slate-50/50">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 border-b border-slate-200 pb-1 block">
                    1. Patient Details
                  </span>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Patient Name:</span>
                      <strong className="text-slate-900 text-sm">{selectedLetterheadApt.patientName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Age / Gender:</span>
                      <strong>{selectedLetterheadApt.age} Years / {selectedLetterheadApt.gender}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contact Number:</span>
                      <strong>{selectedLetterheadApt.phone}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Entry Type:</span>
                      <span className="font-semibold text-sky-800">{selectedLetterheadApt.type} Registration</span>
                    </div>
                  </div>
                </div>

                {/* Doctor & Schedule */}
                <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-slate-50/50">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 border-b border-slate-200 pb-1 block">
                    2. Consulting Specialist & OPD Room
                  </span>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Consultant:</span>
                      <strong className="text-sky-950 text-sm">{selectedLetterheadApt.doctorName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Department:</span>
                      <strong>{selectedLetterheadApt.department}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Consultation Room:</span>
                      <strong className="text-red-700">{selectedLetterheadApt.roomNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date & Slot:</span>
                      <strong>{selectedLetterheadApt.date} ({selectedLetterheadApt.timeSlot})</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complaints & Notes */}
              <div className="border border-slate-200 rounded-2xl p-3.5 text-xs space-y-1.5">
                <span className="font-bold text-slate-700">Chief Complaints / Reason for Visit:</span>
                <p className="text-slate-600">
                  {selectedLetterheadApt.symptoms || "General OPD checkup and routine clinical consultation."}
                </p>
                {selectedLetterheadApt.notes && (
                  <p className="pt-1 border-t border-slate-100 text-teal-800 font-medium">
                    <strong>Doctor Clinical Notes:</strong> {selectedLetterheadApt.notes}
                  </p>
                )}
              </div>

              {/* Important Instructions for Patient */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-[11px] text-amber-900 space-y-1">
                <span className="font-bold uppercase tracking-wider block">⚠️ Patient Guidelines & Hospital Protocol:</span>
                <ol className="list-decimal pl-4 space-y-0.5 text-slate-700">
                  <li>Please arrive at the 1st Floor Reception Desk at least 15 minutes before your time slot.</li>
                  <li>Carry all previous medical investigation reports, sonography scans, and prescriptions.</li>
                  <li>For PMJAY / Ayushman Card or TPA Cashless Mediclaim, report to Insurance Counter on Ground Floor.</li>
                  <li>For 24x7 Emergency Assistance or ICU Ambulance, call immediately: <strong>+91 78743 81551</strong>.</li>
                </ol>
              </div>

              {/* Stamp & Signature Footer */}
              <div className="pt-6 border-t-2 border-slate-200 flex items-end justify-between text-xs text-slate-600">
                <div className="text-center">
                  <div className="w-32 border-b border-slate-400 mb-1"></div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Reception Desk Sign</span>
                </div>

                <div className="text-center px-4 py-2 border-2 border-dashed border-sky-300 rounded-xl bg-sky-50/50">
                  <span className="text-[10px] font-bold text-sky-800 block uppercase">GEETA HOSPITAL MUNDRA</span>
                  <span className="text-[9px] text-slate-500">Official Seal Validated</span>
                </div>

                <div className="text-center">
                  <div className="w-32 border-b border-slate-400 mb-1"></div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Consulting Doctor Stamp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: WALK-IN TOKEN GENERATOR */}
      {/* ------------------------------------------------------------- */}
      {isWalkinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in print:hidden">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Issue Walk-in OPD Token</h3>
                <p className="text-emerald-100 text-xs">For patients registering directly at the hospital counter</p>
              </div>
              <button
                onClick={() => setIsWalkinModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkin} className="p-5 sm:p-6 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Consulting Doctor *</label>
                <select
                  required
                  value={walkinForm.doctorId}
                  onChange={(e) => setWalkinForm({ ...walkinForm, doctorId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                >
                  {DOCTORS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={walkinForm.patientName}
                    onChange={(e) => setWalkinForm({ ...walkinForm, patientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={walkinForm.phone}
                    onChange={(e) => setWalkinForm({ ...walkinForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age *</label>
                  <input
                    type="number"
                    min="1"
                    max="115"
                    required
                    value={walkinForm.age}
                    onChange={(e) => setWalkinForm({ ...walkinForm, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={walkinForm.gender}
                    onChange={(e) =>
                      setWalkinForm({ ...walkinForm, gender: e.target.value as AppointmentRecord["gender"] })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Child">Child</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={walkinForm.date}
                    onChange={(e) => setWalkinForm({ ...walkinForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Slot *</label>
                  <select
                    value={walkinForm.timeSlot}
                    onChange={(e) => setWalkinForm({ ...walkinForm, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  >
                    <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                    <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                    <option value="Emergency (Immediate Consultation)">Immediate Emergency (24x7)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Symptoms / Chief Complaints</label>
                <textarea
                  rows={2}
                  placeholder="Reason for visit..."
                  value={walkinForm.symptoms}
                  onChange={(e) => setWalkinForm({ ...walkinForm, symptoms: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Generate Official Token
                </button>
                <button
                  type="button"
                  onClick={() => setIsWalkinModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

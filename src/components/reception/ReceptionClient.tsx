"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  ChevronRight,
  RefreshCw,
  Search,
  AlertCircle,
  FileText,
  UserCheck,
  MapPin,
  ArrowLeft,
  X,
} from "lucide-react";
import { DOCTORS, HOSPITAL_INFO } from "@/data/hospitalData";
import { AppointmentRecord } from "@/app/api/appointments/route";

export default function ReceptionClient() {
  const todayStr = new Date().toISOString().split("T")[0];

  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWalkinModalOpen, setIsWalkinModalOpen] = useState<boolean>(false);
  const [isPrintMode, setIsPrintMode] = useState<boolean>(false);

  // New Walk-in form state
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

  // Fetch appointments
  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (data.success && data.appointments) {
        setAppointments(data.appointments);
      } else {
        // Fallback from localStorage
        const local = JSON.parse(localStorage.getItem("gh_appointments") || "[]");
        setAppointments(local);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      const local = JSON.parse(localStorage.getItem("gh_appointments") || "[]");
      setAppointments(local);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Update appointment status
  const handleUpdateStatus = async (
    id: string,
    newStatus: AppointmentRecord["status"],
    patientName: string
  ) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      } else {
        // Local update fallback
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
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
        setWalkinForm({
          patientName: "",
          phone: "",
          age: "30",
          gender: "Female",
          doctorId: "dr-kundan-modi",
          date: todayStr,
          timeSlot: "Morning (10:00 AM - 1:00 PM)",
          symptoms: "Walk-in consultation",
          notes: "",
        });
      }
    } catch (err) {
      console.error("Error creating walk-in:", err);
    }
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (selectedDoctorId !== "all" && apt.doctorId !== selectedDoctorId) return false;
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
  const totalCount = appointments.filter((a) => a.date === selectedDate || selectedDate === "all").length;
  const confirmedCount = appointments.filter((a) => (a.date === selectedDate || selectedDate === "all") && a.status === "Confirmed").length;
  const inConsultCount = appointments.filter((a) => (a.date === selectedDate || selectedDate === "all") && a.status === "In Consultation").length;
  const completedCount = appointments.filter((a) => (a.date === selectedDate || selectedDate === "all") && a.status === "Completed").length;
  const pendingCount = appointments.filter((a) => (a.date === selectedDate || selectedDate === "all") && a.status === "Pending").length;

  // WhatsApp helper for Reception to send Confirmation to Patient
  const sendWhatsAppConfirmationToPatient = (apt: AppointmentRecord) => {
    const rawNumber = apt.phone.replace(/[^0-9]/g, "");
    const formattedNumber = rawNumber.startsWith("91") ? rawNumber : `91${rawNumber}`;
    const text = `🏥 *GEETA HOSPITAL MUNDRA - OPD APPOINTMENT CONFIRMATION*
━━━━━━━━━━━━━━━━━━━━━
Namaste *${apt.patientName}*,

Your OPD consultation appointment has been *CONFIRMED* at Geeta Hospital Mundra.

🎫 *Your Token Number:* *${apt.tokenNumber}*
👨‍⚕️ *Consulting Doctor:* ${apt.doctorName}
🏥 *Speciality:* ${apt.department}
📍 *OPD Room:* ${apt.roomNumber}
📅 *Date:* ${apt.date}
⏰ *Time Slot:* ${apt.timeSlot}
⏳ *Estimated Reporting Time:* ${apt.estimatedReportingTime}

*Instructions on Arrival:*
1. Please report at the 1st Floor Reception Desk 15 minutes before your time.
2. Show this WhatsApp token to the receptionist.
3. Bring previous medical prescriptions, lab reports, and ID card.

📍 *Hospital Address:* 3, Ambe Nagar, Gundala Road, Baroi-Mundra (Kutch)
📞 *Emergency / Reception:* +91 78743 81551

_Wishing you good health,_
*Front Desk Team — Geeta Hospital Mundra*`;

    window.open(`https://wa.me/${formattedNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  // WhatsApp helper for Reception to Alert Doctor
  const sendWhatsAppAlertToDoctor = (apt: AppointmentRecord) => {
    const text = `👨‍⚕️ *GEETA HOSPITAL - PATIENT OPD QUEUE ALERT*
━━━━━━━━━━━━━━━━━━━━━
*Doctor:* ${apt.doctorName}
*Patient:* ${apt.patientName} (${apt.age} Yrs, ${apt.gender})
*Token No:* *${apt.tokenNumber}*
*Slot:* ${apt.timeSlot}
*Date:* ${apt.date}
*Symptoms:* ${apt.symptoms || "General OPD checkup"}
*Status:* ${apt.status}
━━━━━━━━━━━━━━━━━━━━━
_Sent from Geeta Hospital Reception Desk_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const selectedDoctorObj = DOCTORS.find((d) => d.id === selectedDoctorId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Bar for Reception Portal */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Branding & Portal Name */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </Link>
            <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  GEETA HOSPITAL
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  RECEPTION & OPD DESK
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Live Doctor Timetable & Daily Patient Token Queue
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsWalkinModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ New Walk-in Token</span>
            </button>

            <button
              onClick={() => {
                setIsPrintMode(true);
                setTimeout(() => {
                  window.print();
                  setIsPrintMode(false);
                }, 300);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition"
              title="Print Doctor's OPD Sheet"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Doctor Sheet</span>
            </button>

            <button
              onClick={fetchAppointments}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition"
              title="Refresh queue"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Total Today Tokens
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
              Pending Check-in
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-700">{pendingCount}</span>
              <Clock3 className="w-5 h-5 text-amber-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Completed OPD
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-700">{completedCount}</span>
              <UserCheck className="w-5 h-5 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-800">Filter Queue by Doctor & Session</h3>
            </div>

            {selectedDoctorObj && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                Viewing: {selectedDoctorObj.name} • {selectedDoctorObj.opdTiming}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Doctor Filter */}
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
                <optgroup label="Resident Full-Time Specialists">
                  {DOCTORS.filter((d) => d.type === "full-time").map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.department})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Visiting Super-Specialists">
                  {DOCTORS.filter((d) => d.type === "visiting").map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.department})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Consultation Date
              </label>
              <div className="flex gap-1.5">
                <input
                  type="date"
                  value={selectedDate === "all" ? "" : selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value || "all")}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                />
                <button
                  onClick={() => setSelectedDate(todayStr)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition ${
                    selectedDate === todayStr
                      ? "bg-sky-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setSelectedDate("all")}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition ${
                    selectedDate === "all"
                      ? "bg-sky-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Token Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending Check-in</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Consultation">In Consultation</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Search Box */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Quick Search
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Patient name, token, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Print Sheet View (Hidden normally, shown on window.print) */}
        <div id="doctor-print-sheet" className="hidden print:block p-8 bg-white">
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black text-slate-900">GEETA MULTI-SPECIALITY HOSPITAL</h1>
                <p className="text-sm text-slate-600">3, Ambe Nagar, Gundala Road, Baroi-Mundra (Kutch) • Ph: +91 78743 81551</p>
                <p className="text-xs font-semibold text-sky-800 mt-1">DAILY DOCTOR OPD CONSULTATION SHEET</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">Date: {selectedDate}</p>
                <p className="text-sm text-slate-700">Doctor: {selectedDoctorObj ? selectedDoctorObj.name : "All Doctors"}</p>
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
                <th className="border border-slate-300 p-2 text-left">Time Slot</th>
                <th className="border border-slate-300 p-2 text-left">Chief Complaint</th>
                <th className="border border-slate-300 p-2 text-left">Doctor Diagnosis & Rx Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="h-14">
                  <td className="border border-slate-300 p-2 font-bold">{apt.tokenNumber}</td>
                  <td className="border border-slate-300 p-2 font-semibold">{apt.patientName}</td>
                  <td className="border border-slate-300 p-2">{apt.age} / {apt.gender}</td>
                  <td className="border border-slate-300 p-2">{apt.phone}</td>
                  <td className="border border-slate-300 p-2">{apt.timeSlot}</td>
                  <td className="border border-slate-300 p-2 text-slate-600">{apt.symptoms || "Routine Consultation"}</td>
                  <td className="border border-slate-300 p-2 w-1/3"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live Queue Cards / Table */}
        <div className="space-y-3 print:hidden">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-700">No Appointments in Queue</h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto mt-1">
                There are no patient tokens matching the current doctor, date, and status filters.
              </p>
              <button
                onClick={() => setIsWalkinModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition"
              >
                + Create Walk-in Token
              </button>
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
                    {/* Token Number Box */}
                    <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-sky-600 to-teal-700 text-white shadow-xs flex-shrink-0">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-sky-200">
                        TOKEN
                      </span>
                      <span className="text-base sm:text-lg font-black tracking-tight">
                        {apt.tokenNumber}
                      </span>
                    </div>

                    {/* Patient Information */}
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
                              : apt.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
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
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {apt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-teal-600" />
                          {apt.timeSlot}
                        </span>
                        <span className="text-emerald-700 font-semibold">
                          Reporting: {apt.estimatedReportingTime}
                        </span>
                      </div>

                      {apt.symptoms && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl mt-2 border border-slate-100 max-w-xl">
                          <strong className="text-slate-800">Chief Complaint:</strong> {apt.symptoms}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Desk Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-end">
                    {/* Status Changer Buttons */}
                    {apt.status === "Pending" && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, "Confirmed", apt.patientName)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                      >
                        ✓ Confirm Token
                      </button>
                    )}

                    {apt.status === "Confirmed" && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, "In Consultation", apt.patientName)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition"
                      >
                        🩺 Call in to Doctor
                      </button>
                    )}

                    {apt.status === "In Consultation" && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, "Completed", apt.patientName)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition"
                      >
                        ✓ Mark Completed
                      </button>
                    )}

                    {/* WhatsApp to Patient Button */}
                    <button
                      onClick={() => sendWhatsAppConfirmationToPatient(apt)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200 transition"
                      title="Send WhatsApp confirmation to patient"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Patient</span>
                    </button>

                    {/* WhatsApp Alert to Doctor */}
                    <button
                      onClick={() => sendWhatsAppAlertToDoctor(apt)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold text-xs border border-sky-200 transition"
                      title="Send WhatsApp alert to consulting doctor"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                      <span className="hidden sm:inline">Alert Doctor</span>
                    </button>

                    {/* Direct Call Button */}
                    <a
                      href={`tel:${apt.phone.replace(/[^0-9+]/g, "")}`}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Call patient"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Walk-in Token Generator Modal */}
      {isWalkinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Issue Walk-in OPD Token</h3>
                <p className="text-emerald-100 text-xs">For patients registering at the hospital counter</p>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Doctor *</label>
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
                    placeholder="e.g. Nilesh Shah"
                    value={walkinForm.patientName}
                    onChange={(e) => setWalkinForm({ ...walkinForm, patientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Chief Complaints</label>
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
                  Generate & Add to Queue
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

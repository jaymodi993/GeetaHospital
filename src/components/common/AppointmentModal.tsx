"use client";

import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  User,
  Phone,
  CheckCircle2,
  ExternalLink,
  Stethoscope,
  Printer,
  MessageCircle,
  Clock,
  MapPin,
  AlertCircle,
  ShieldCheck,
  Building,
} from "lucide-react";
import { DOCTORS, HOSPITAL_INFO } from "@/data/hospitalData";
import { AppointmentRecord } from "@/app/api/appointments/route";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctor?: string;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  preselectedDoctor = "",
}: AppointmentModalProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "Female" as "Male" | "Female" | "Child" | "Other",
    doctor: preselectedDoctor || "Dr. Kundan B. Modi (Gynecology & Obstetrics)",
    date: todayStr,
    timeSlot: "Morning (10:00 AM - 1:00 PM)",
    symptoms: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<AppointmentRecord | null>(null);

  useEffect(() => {
    if (preselectedDoctor) {
      setFormData((prev) => ({ ...prev, doctor: preselectedDoctor }));
    }
  }, [preselectedDoctor]);

  if (!isOpen) return null;

  // Selected doctor object lookup
  const selectedDocObj = DOCTORS.find((d) =>
    formData.doctor.toLowerCase().includes(d.name.toLowerCase().split(" ")[1]?.toLowerCase() || "")
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Find doctor metadata
      const doctorId = selectedDocObj ? selectedDocObj.id : "dr-kundan-modi";
      const doctorName = selectedDocObj ? selectedDocObj.name : formData.doctor;
      const department = selectedDocObj ? selectedDocObj.department : "General OPD";

      const payload = {
        patientName: formData.name,
        phone: formData.phone,
        age: formData.age || "30",
        gender: formData.gender,
        department,
        doctorId,
        doctorName,
        date: formData.date,
        timeSlot: formData.timeSlot,
        symptoms: formData.symptoms,
        type: "Online",
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.appointment) {
        setCreatedAppointment(data.appointment);

        // Also persist in localStorage for instant offline/demo client sync
        try {
          const existing = JSON.parse(localStorage.getItem("gh_appointments") || "[]");
          localStorage.setItem("gh_appointments", JSON.stringify([data.appointment, ...existing]));
        } catch (err) {
          console.error("Local storage sync error:", err);
        }
      } else {
        // Fallback local creation if API has an issue
        const fallbackId = `GH-${formData.date.replace(/-/g, "").slice(2)}-${Math.floor(100 + Math.random() * 900)}`;
        const fallbackApt: AppointmentRecord = {
          id: fallbackId,
          tokenNumber: `GH-${fallbackId.slice(-3)}`,
          patientName: formData.name,
          phone: formData.phone,
          age: formData.age || "30",
          gender: formData.gender,
          department,
          doctorId,
          doctorName,
          date: formData.date,
          timeSlot: formData.timeSlot,
          symptoms: formData.symptoms,
          status: "Pending",
          createdAt: new Date().toISOString(),
          estimatedReportingTime: formData.timeSlot.includes("Evening") ? "05:15 PM" : "10:15 AM",
          roomNumber: "OPD Consultation Suite (1st Floor)",
          type: "Online",
        };
        setCreatedAppointment(fallbackApt);
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCreatedAppointment(null);
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  // Pre-filled WhatsApp message for hospital reception desk
  const generateWhatsAppMessage = (apt: AppointmentRecord) => {
    const text = `🏥 *NEW OPD APPOINTMENT - GEETA HOSPITAL MUNDRA*
━━━━━━━━━━━━━━━━━━━━━
🎫 *Token Number:* *${apt.tokenNumber}* (ID: ${apt.id})
👤 *Patient Name:* ${apt.patientName} (${apt.age} Yrs, ${apt.gender})
📱 *Contact Phone:* ${apt.phone}
👨‍⚕️ *Doctor:* ${apt.doctorName}
🏥 *Speciality:* ${apt.department}
📅 *Preferred Date:* ${apt.date}
⏰ *Time Slot:* ${apt.timeSlot}
📍 *OPD Room:* ${apt.roomNumber}
📝 *Symptoms/Notes:* ${apt.symptoms || "General Health Consultation"}
━━━━━━━━━━━━━━━━━━━━━
_Please verify token at the reception desk._`;

    return encodeURIComponent(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-800 via-sky-700 to-teal-700 p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
              <Stethoscope className="w-3.5 h-3.5 text-teal-300" />
              Official OPD Token System
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Desk Queue
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Book Doctor Consultation & OPD Token
          </h3>
          <p className="text-sky-100 text-xs sm:text-sm mt-1">
            Geeta Multi-Speciality Hospital Mundra • 24x7 Patient Front Desk
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-7 max-h-[82vh] overflow-y-auto">
          {createdAppointment ? (
            /* Digital OPD Token Slip */
            <div className="space-y-6">
              {/* Slip Printable Box */}
              <div
                id="opd-token-print"
                className="bg-gradient-to-b from-sky-50/70 via-white to-teal-50/50 border-2 border-dashed border-sky-300 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden"
              >
                {/* Hospital Watermark Icon */}
                <Building className="w-40 h-40 text-sky-900/5 absolute -right-6 -bottom-6 pointer-events-none" />

                {/* Slip Header */}
                <div className="flex items-start justify-between border-b border-sky-200/80 pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        GEETA HOSPITAL
                      </span>
                      <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                        MUNDRA
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      3, Ambe Nagar, Gundala Road, Baroi-Mundra (Kutch) • Ph: +91 78743 81551
                    </p>
                  </div>

                  {/* Token Badge */}
                  <div className="text-right">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      OPD TOKEN NO.
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-sky-700 tracking-tight">
                      {createdAppointment.tokenNumber}
                    </span>
                  </div>
                </div>

                {/* Patient & Doctor Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm mb-4">
                  <div className="space-y-1 bg-white/80 p-3 rounded-xl border border-sky-100">
                    <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
                      Patient Details
                    </span>
                    <p className="font-bold text-slate-900 text-base">
                      {createdAppointment.patientName}
                    </p>
                    <p className="text-slate-600">
                      Age: <strong>{createdAppointment.age} Yrs</strong> • Gender:{" "}
                      <strong>{createdAppointment.gender}</strong>
                    </p>
                    <p className="text-slate-600">
                      Phone: <strong>{createdAppointment.phone}</strong>
                    </p>
                  </div>

                  <div className="space-y-1 bg-white/80 p-3 rounded-xl border border-sky-100">
                    <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
                      Consulting Doctor & Room
                    </span>
                    <p className="font-bold text-sky-900 text-base">
                      {createdAppointment.doctorName}
                    </p>
                    <p className="text-teal-700 font-medium">{createdAppointment.department}</p>
                    <p className="text-slate-700 font-semibold text-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      {createdAppointment.roomNumber}
                    </p>
                  </div>
                </div>

                {/* Date, Time & Instructions */}
                <div className="bg-sky-100/60 p-3.5 rounded-2xl border border-sky-200/60 text-xs sm:text-sm space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-slate-800">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Calendar className="w-4 h-4 text-sky-600" />
                      <span>Date: {createdAppointment.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-teal-800">
                      <Clock className="w-4 h-4 text-teal-600" />
                      <span>Slot: {createdAppointment.timeSlot}</span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-sky-200/60 flex items-start gap-2 text-slate-600 text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Reporting Notice:</strong> Please report at the 1st Floor Reception Desk
                      at least <strong>15 minutes prior</strong> to your time slot. Bring previous medical files,
                      sonography/lab reports, and photo ID.
                    </span>
                  </div>
                </div>

                {/* Barcode / Token ID Footer */}
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono font-medium">Ref ID: {createdAppointment.id}</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Registered on Hospital Desk
                  </span>
                </div>
              </div>

              {/* Action Buttons: WhatsApp & Print */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* WhatsApp to Hospital Desk */}
                  <a
                    href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber.replace(/[^0-9]/g, "")}?text=${generateWhatsAppMessage(createdAppointment)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                    <span>Send Token on WhatsApp</span>
                  </a>

                  {/* Print / Save Token */}
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Print / Save Token Slip</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <a
                    href={`tel:${HOSPITAL_INFO.phone.replace(/[^0-9+]/g, "")}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
                  >
                    <Phone className="w-4 h-4 text-sky-600" />
                    <span>Call Reception Desk: {HOSPITAL_INFO.phone}</span>
                  </a>

                  <button
                    onClick={handleReset}
                    className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-600 font-medium text-xs hover:bg-slate-50 transition"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Doctor / Department Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Consulting Doctor / Department *
                </label>
                <select
                  required
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-slate-50/80 font-medium text-slate-800"
                >
                  <optgroup label="🏥 Full-Time Resident Specialists (Daily OPD & 24x7 Emergency)">
                    {DOCTORS.filter((d) => d.type === "full-time").map((d) => (
                      <option key={d.id} value={`${d.name} (${d.department})`}>
                        {d.name} — {d.department} ({d.opdTiming})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🌟 Visiting Super-Specialists (Dedicated Camp OPDs)">
                    {DOCTORS.filter((d) => d.type === "visiting").map((d) => (
                      <option key={d.id} value={`${d.name} (${d.department})`}>
                        {d.name} — {d.department} • {d.opdSchedule}
                      </option>
                    ))}
                  </optgroup>
                </select>

                {/* Selected Doctor Micro-Info */}
                {selectedDocObj && (
                  <div className="mt-2 p-2.5 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between text-xs text-sky-900">
                    <span className="font-semibold">{selectedDocObj.qualification}</span>
                    <span className="text-slate-500 font-medium">{selectedDocObj.experience} Experience</span>
                  </div>
                )}
              </div>

              {/* Patient Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Patient Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Mobile / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Patient Age *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="115"
                    required
                    placeholder="e.g. 32"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value as "Male" | "Female" | "Child" | "Other",
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Child">Child / Infant</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Preferred Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Preferred Consultation Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="date"
                      min={todayStr}
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    OPD Time Slot *
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 font-medium"
                  >
                    <option value="Morning (10:00 AM - 1:00 PM)">Morning OPD (10:00 AM - 1:00 PM)</option>
                    <option value="Evening (5:00 PM - 8:00 PM)">Evening OPD (5:00 PM - 8:00 PM)</option>
                    <option value="Emergency (Immediate Consultation)">Immediate Emergency (24x7 ICU)</option>
                  </select>
                </div>
              </div>

              {/* Symptoms / Chief Complaints */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Symptoms or Reason for Visit (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe reason for consultation (e.g. fever, pregnancy scan, knee pain, routine follow-up)..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Immediate digital token generation • Instant confirmation by reception desk on arrival • No advance payment required online.
                </span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-sky-700 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Generating Official OPD Token...</span>
                  ) : (
                    <>
                      <Stethoscope className="w-4 h-4" />
                      <span>Confirm & Generate OPD Token</span>
                    </>
                  )}
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-slate-400 text-xs">OR BOOK VIA OFFICIAL PORTAL</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <a
                  href={HOSPITAL_INFO.appointmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold transition"
                >
                  <span>Book Directly on Kivihealth Clinic Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

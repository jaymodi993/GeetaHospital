"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Award,
  ChevronRight,
  Shield,
  Stethoscope,
  Phone,
  HeartPulse,
  Brain,
  Baby,
  Activity,
  Smile,
  Eye,
  Bone,
  CheckCircle2,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { DOCTORS, Doctor, HOSPITAL_INFO, getDoctorImageUrl } from "@/data/hospitalData";
import { useCms } from "@/context/CmsContext";

export default function DoctorsClient() {
  const { doctors: cmsDoctors, hospitalProfile } = useCms();
  const doctorsList = cmsDoctors && cmsDoctors.length > 0 ? cmsDoctors : DOCTORS;
  const profile = hospitalProfile || HOSPITAL_INFO;
  const [filterType, setFilterType] = useState<"all" | "full-time" | "visiting">("all");

  const filteredDoctors = doctorsList.filter((doc) => {
    if (filterType === "all") return true;
    return doc.type === filterType;
  });

  const getDepartmentIcon = (dept: string) => {
    const d = dept.toLowerCase();
    if (d.includes("cardio")) return <HeartPulse className="w-5 h-5 text-red-500" />;
    if (d.includes("neuro") || d.includes("spine")) return <Brain className="w-5 h-5 text-indigo-500" />;
    if (d.includes("ivf") || d.includes("fertility")) return <Baby className="w-5 h-5 text-rose-500" />;
    if (d.includes("pediatric") || d.includes("nicu")) return <Baby className="w-5 h-5 text-amber-500" />;
    if (d.includes("dental")) return <Smile className="w-5 h-5 text-teal-500" />;
    if (d.includes("ortho")) return <Bone className="w-5 h-5 text-sky-500" />;
    if (d.includes("eye") || d.includes("ophthal")) return <Eye className="w-5 h-5 text-cyan-500" />;
    return <Stethoscope className="w-5 h-5 text-sky-500" />;
  };

  const getWhatsAppInquiryUrl = (docName: string, dept: string) => {
    const msg = `Namaste Geeta Hospital Mundra, I would like to consult with ${docName} (${dept}). Please share consultation timings and doctor availability.`;
    return `https://wa.me/${(profile.whatsappNumber || HOSPITAL_INFO.whatsappNumber).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white py-14 lg:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              Qualified & Compassionate Medical Faculty
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Experienced Doctors & Medical Faculty
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Consult leading gynecologists, pediatricians, critical care intensivists, and renowned visiting super-specialists in Cardiology, Neurology, IVF, and Orthopedics at Geeta Hospital Mundra.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 backdrop-blur-sm">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  filterType === "all"
                    ? "bg-white text-sky-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Specialists ({DOCTORS.length})
              </button>
              <button
                onClick={() => setFilterType("full-time")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  filterType === "full-time"
                    ? "bg-white text-sky-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Resident Doctors ({DOCTORS.filter((d) => d.type === "full-time").length})
              </button>
              <button
                onClick={() => setFilterType("visiting")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  filterType === "visiting"
                    ? "bg-white text-sky-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Visiting Consultants ({DOCTORS.filter((d) => d.type === "visiting").length})
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredDoctors.length}</span> verified medical profiles
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => {
              const photoUrl = getDoctorImageUrl(doc);

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                >
                  <div>
                    {/* Doctor Portrait Header */}
                    <div className="relative h-64 sm:h-72 w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={photoUrl}
                        alt={`${doc.name} - ${doc.designation} at Geeta Hospital Mundra`}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                            doc.type === "full-time"
                              ? "bg-emerald-500/90 text-white"
                              : "bg-sky-600/90 text-white"
                          }`}
                        >
                          {doc.type === "full-time" ? "Resident Full-Time" : "Visiting Specialist"}
                        </span>

                        <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-semibold backdrop-blur-md">
                          {doc.experience}
                        </span>
                      </div>

                      {/* Overlay Details */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <p className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
                          {doc.department}
                        </p>
                        <h3 className="text-xl font-bold leading-tight drop-shadow-xs">{doc.name}</h3>
                        <p className="text-xs text-slate-200">{doc.qualification}</p>
                        {doc.clinicAffiliation && (
                          <p className="text-[11px] font-medium text-emerald-300 flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            {doc.clinicAffiliation}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                          Designation
                        </span>
                        <p className="text-sm font-semibold text-slate-900 mt-0.5">{doc.designation}</p>
                      </div>

                      {/* OPD Timings Box */}
                      <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-100 text-xs text-sky-950 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-sky-900">
                          <Clock className="w-3.5 h-3.5 text-sky-600" />
                          <span>OPD Schedule & Availability:</span>
                        </div>
                        <p className="font-semibold text-slate-800">{doc.opdSchedule}</p>
                        <p className="text-slate-600 text-[11px]">{doc.opdTiming}</p>
                      </div>

                      {/* Clinical Expertise */}
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                          Key Clinical Expertise
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {doc.expertise.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0"></span>
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-3">
                    <a
                      href={getWhatsAppInquiryUrl(doc.name, doc.department)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>WhatsApp Consultation Inquiry</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weekly Visiting OPD Timetable Matrix */}
          <div className="mt-16 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="max-w-2xl mb-8 space-y-1">
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider">
                Weekly Schedule Overview
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Visiting Super-Specialists OPD Timetable
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm">
                Reserve your consultation token in advance. Call our reception or message on WhatsApp.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-700 bg-slate-50">
                    <th className="py-3.5 px-4 font-bold">Visiting Day</th>
                    <th className="py-3.5 px-4 font-bold">Specialist Doctor</th>
                    <th className="py-3.5 px-4 font-bold">Speciality & Center</th>
                    <th className="py-3.5 px-4 font-bold">OPD Timings</th>
                    <th className="py-3.5 px-4 font-bold text-right">Inquiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-sky-800">1st Thursday</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Dr. Jaydatt Tekani</td>
                    <td className="py-3.5 px-4 text-slate-600">Cardiology (Marengo CIMS / K.K. Patel)</td>
                    <td className="py-3.5 px-4 text-slate-600">5:00 PM - 6:00 PM</td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={getWhatsAppInquiryUrl("Dr. Jaydatt Tekani", "Cardiology")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Inquire</span>
                      </a>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-teal-800">1st & 3rd Thursday</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Dr. Naushad Ravjani</td>
                    <td className="py-3.5 px-4 text-slate-600">Neurology & Brain Sciences (NIMS)</td>
                    <td className="py-3.5 px-4 text-slate-600">3:30 PM - 5:30 PM</td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={getWhatsAppInquiryUrl("Dr. Naushad Ravjani", "Neurology")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Inquire</span>
                      </a>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-rose-800">1st Saturday</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Dr. Rajesh & Shital Punjabi</td>
                    <td className="py-3.5 px-4 text-slate-600">IVF & Test Tube Baby (Shashwat IVF)</td>
                    <td className="py-3.5 px-4 text-slate-600">2:00 PM - 5:00 PM</td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={getWhatsAppInquiryUrl("Dr. Rajesh Punjabi", "IVF & Test Tube Baby")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Inquire</span>
                      </a>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-amber-800">2nd & 4th Saturday</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Dr. Ankur Dhanani</td>
                    <td className="py-3.5 px-4 text-slate-600">ENT Specialist (Dhanani’s ENT Clinic, Bhuj)</td>
                    <td className="py-3.5 px-4 text-slate-600">2:00 PM - 5:00 PM</td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={getWhatsAppInquiryUrl("Dr. Ankur Dhanani", "ENT Specialist")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Inquire</span>
                      </a>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-indigo-800">4th Saturday</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Dr. Binal Trivedi</td>
                    <td className="py-3.5 px-4 text-slate-600">Gynec Cancer & Laparoscopy (Vedanta Hospital)</td>
                    <td className="py-3.5 px-4 text-slate-600">1:00 PM - 3:00 PM</td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={getWhatsAppInquiryUrl("Dr. Binal Trivedi", "Gynec Cancer & Laparoscopy")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Inquire</span>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

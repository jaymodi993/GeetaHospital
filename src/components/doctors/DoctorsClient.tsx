"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Award,
  Stethoscope,
  Phone,
  CheckCircle2,
  Building2,
  ExternalLink,
  Filter,
} from "lucide-react";
import { DOCTORS, Doctor, HOSPITAL_INFO } from "@/data/hospitalData";
import AppointmentModal from "@/components/common/AppointmentModal";

export default function DoctorsClient() {
  const [filterType, setFilterType] = useState<"all" | "full-time" | "visiting">("all");
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredDoctors = DOCTORS.filter((doc) => {
    if (filterType === "all") return true;
    return doc.type === filterType;
  });

  const handleBookDoctor = (doc: Doctor) => {
    setSelectedDoctorForModal(`${doc.name} (${doc.department})`);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white py-14 lg:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Full-Time Resident Specialists & Visiting Consultants</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Doctors & OPD Timetable
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Meet our team of experienced full-time resident physicians and visiting super-specialists from top tertiary centers across Gujarat.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-14 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Filter Doctors:
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  filterType === "all"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                All Doctors ({DOCTORS.length})
              </button>
              <button
                onClick={() => setFilterType("full-time")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  filterType === "full-time"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Full-Time Resident Doctors ({DOCTORS.filter((d) => d.type === "full-time").length})
              </button>
              <button
                onClick={() => setFilterType("visiting")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  filterType === "visiting"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Visiting Super-Specialists ({DOCTORS.filter((d) => d.type === "visiting").length})
              </button>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => {
              const isVisiting = doc.type === "visiting";

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Top Card Image or Specialist Department Banner */}
                    {doc.image ? (
                      <div className="relative h-64 sm:h-72 w-full bg-slate-950 overflow-hidden">
                        <Image
                          src={doc.image}
                          alt={`${doc.name} - ${doc.designation}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className={
                            isVisiting
                              ? "object-contain bg-slate-900 group-hover:scale-105 transition duration-500"
                              : "object-cover object-top group-hover:scale-105 transition duration-500"
                          }
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>

                        {/* Type Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                              isVisiting
                                ? "bg-amber-500 text-white shadow-sm"
                                : "bg-teal-600 text-white shadow-sm"
                            }`}
                          >
                            {isVisiting ? "Visiting Super-Specialist" : "Resident Full-Time"}
                          </span>
                        </div>

                        {/* Experience Pill */}
                        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                          {doc.experience}
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-48 w-full bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-6 flex flex-col justify-between overflow-hidden border-b border-slate-100">
                        {/* Background watermark */}
                        <div className="absolute -right-3 -bottom-3 text-white/5 pointer-events-none">
                          <Stethoscope className="w-36 h-36" />
                        </div>

                        <div className="flex items-center justify-between relative z-10">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-sm">
                            Visiting Super-Specialist
                          </span>
                          <span className="bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-sky-200">
                            {doc.experience}
                          </span>
                        </div>

                        <div className="relative z-10">
                          <div className="w-11 h-11 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 mb-2">
                            <Stethoscope className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-sky-300 uppercase tracking-wider block">
                            {doc.department}
                          </span>
                          <p className="text-xs text-slate-300 truncate font-medium mt-0.5">
                            {doc.clinicAffiliation || "Tertiary Hospital Consultant"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="p-6 space-y-3">
                      <div>
                        <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                          {doc.department}
                        </span>
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-sky-700 transition">
                          {doc.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500">
                          {doc.qualification} • {doc.designation}
                        </p>
                      </div>

                      {/* Clinic Affiliation if visiting */}
                      {doc.clinicAffiliation && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2 text-xs text-slate-700">
                          <Building2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Affiliation:</strong> {doc.clinicAffiliation}
                          </span>
                        </div>
                      )}

                      {/* OPD Schedule Box */}
                      <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-sky-900">
                          <Clock className="w-3.5 h-3.5 text-sky-600" />
                          <span>OPD Schedule:</span>
                        </div>
                        <p className="text-slate-700 font-semibold">{doc.opdSchedule}</p>
                        <p className="text-slate-500 text-[11px]">{doc.opdTiming}</p>
                      </div>

                      {/* Clinical Expertise */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Clinical Expertise:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-600">
                          {doc.expertise.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleBookDoctor(doc)}
                      className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Consultation</span>
                    </button>
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
                Reserve your consultation token in advance. Call our reception or submit the booking form.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Day of Month</th>
                    <th className="py-3.5 px-4 font-bold">Specialist Doctor</th>
                    <th className="py-3.5 px-4 font-bold">Speciality & Center</th>
                    <th className="py-3.5 px-4 font-bold">OPD Timings</th>
                    <th className="py-3.5 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-sky-800">1st Thursday</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">Dr. Jaydatt Tekani</td>
                    <td className="py-3 px-4 text-slate-600">Cardiology (Marengo CIMS / K.K. Patel)</td>
                    <td className="py-3 px-4 text-slate-600">5:00 PM - 6:00 PM</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDoctorForModal("Dr. Jaydatt Tekani (Cardiology)");
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold"
                      >
                        Book Token
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-teal-800">1st & 3rd Thursday</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">Dr. Naushad Ravjani</td>
                    <td className="py-3 px-4 text-slate-600">Neurology & Brain Sciences (NIMS)</td>
                    <td className="py-3 px-4 text-slate-600">3:30 PM - 5:30 PM</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDoctorForModal("Dr. Naushad Ravjani (Neurology)");
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold"
                      >
                        Book Token
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-rose-800">1st Saturday</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">Dr. Rajesh & Shital Punjabi</td>
                    <td className="py-3 px-4 text-slate-600">IVF & Test Tube Baby (Shashwat IVF)</td>
                    <td className="py-3 px-4 text-slate-600">2:00 PM - 5:00 PM</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDoctorForModal("Dr. Rajesh Punjabi (IVF Specialist)");
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold"
                      >
                        Book Token
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-amber-800">2nd & 4th Saturday</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">Dr. Ankur Dhanani</td>
                    <td className="py-3 px-4 text-slate-600">ENT & Head-Neck Surgery (Dhanani’s ENT)</td>
                    <td className="py-3 px-4 text-slate-600">2:00 PM - 5:00 PM</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDoctorForModal("Dr. Ankur Dhanani (ENT Specialist)");
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold"
                      >
                        Book Token
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-purple-800">2nd Saturday</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">Dr. Krushnakumar Virda</td>
                    <td className="py-3 px-4 text-slate-600">Neurosurgery, Brain & Spine (Divine Life)</td>
                    <td className="py-3 px-4 text-slate-600">5:00 PM - 6:00 PM</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDoctorForModal("Dr. Krushnakumar Virda (Neurosurgery)");
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold"
                      >
                        Book Token
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-emerald-800">1st & 3rd Wednesday</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">Dr. Yogesh B. Patel</td>
                    <td className="py-3 px-4 text-slate-600">Rheumatology & Diabetology (Kamla Hospital)</td>
                    <td className="py-3 px-4 text-slate-600">9:00 AM - 12:00 PM</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDoctorForModal("Dr. Yogesh Patel (Rheumatology)");
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold"
                      >
                        Book Token
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-blue-800">Every Sunday</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">Dr. Anvay & Smruti Gandhi</td>
                    <td className="py-3 px-4 text-slate-600">Ophthalmology & Phaco Cataract (Gandhi Netralaya)</td>
                    <td className="py-3 px-4 text-slate-600">10:00 AM - 1:00 PM</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDoctorForModal("Dr. Anvay Gandhi (Ophthalmology)");
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold"
                      >
                        Book Token
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preselectedDoctor={selectedDoctorForModal}
      />
    </>
  );
}

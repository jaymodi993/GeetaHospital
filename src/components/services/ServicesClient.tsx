"use client";

import Link from "next/link";
import {
  SERVICES,
  HOSPITAL_INFO,
} from "@/data/hospitalData";
import { useCms } from "@/context/CmsContext";
import {
  Ambulance,
  FlaskConical,
  Pill,
  Activity,
  Baby,
  HeartPulse,
  Bone,
  Eye,
  Stethoscope,
  Scan,
  Crosshair,
  LineChart,
  BedDouble,
  Users,
  ArrowUpDown,
  ShieldCheck,
  Sparkles,
  Award,
  CheckCircle2,
  Phone,
  Building2,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

const getIcon = (name: string) => {
  switch (name) {
    case "Ambulance": return <Ambulance className="w-6 h-6 text-red-600" />;
    case "FlaskConical": return <FlaskConical className="w-6 h-6 text-teal-600" />;
    case "Pill": return <Pill className="w-6 h-6 text-emerald-600" />;
    case "Activity": return <Activity className="w-6 h-6 text-red-600" />;
    case "Baby": return <Baby className="w-6 h-6 text-sky-600" />;
    case "HeartPulse": return <HeartPulse className="w-6 h-6 text-rose-600" />;
    case "Bone": return <Bone className="w-6 h-6 text-amber-600" />;
    case "Eye": return <Eye className="w-6 h-6 text-blue-600" />;
    case "Stethoscope": return <Stethoscope className="w-6 h-6 text-indigo-600" />;
    case "Scan": return <Scan className="w-6 h-6 text-teal-600" />;
    case "Crosshair": return <Crosshair className="w-6 h-6 text-purple-600" />;
    case "LineChart": return <LineChart className="w-6 h-6 text-red-600" />;
    case "BedDouble": return <BedDouble className="w-6 h-6 text-sky-600" />;
    case "Users": return <Users className="w-6 h-6 text-slate-600" />;
    case "ArrowUpDown": return <ArrowUpDown className="w-6 h-6 text-teal-600" />;
    case "ShieldCheck": return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
    case "Sparkles": return <Sparkles className="w-6 h-6 text-amber-600" />;
    default: return <Award className="w-6 h-6 text-sky-600" />;
  }
};

export default function ServicesClient() {
  const { services: cmsServices, hospitalProfile } = useCms();
  const servicesList = cmsServices && cmsServices.length > 0 ? cmsServices : SERVICES;
  const profile = hospitalProfile || HOSPITAL_INFO;
  const rawPhone = (profile.phone || HOSPITAL_INFO.phone).replace(/[^0-9+]/g, "");

  const categories = [
    "Critical Care",
    "Surgical & Maternal",
    "Diagnostics",
    "Inpatient & Amenities",
    "Community Health",
  ] as const;

  return (
    <>
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white py-14 lg:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Full Medical Spectrum • 24x7 Emergency Ready</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Medical Departments & Services
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore the full range of inpatient, outpatient, diagnostic, and critical care facilities operating at Geeta Hospital Mundra.
            </p>
          </div>
        </div>
      </section>

      {/* Services Listing by Category */}
      <div className="py-14 bg-slate-50 min-h-screen space-y-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {categories.map((category) => {
            const items = servicesList.filter((s) => s.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                  <div className="w-2.5 h-6 rounded-full bg-sky-600"></div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {category} Services
                  </h2>
                  <span className="text-xs font-bold text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200 ml-auto">
                    {items.length} Offerings
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-sky-300 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-sky-50 transition">
                            {getIcon(service.iconName)}
                          </div>
                          {service.isEmergency24x7 && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                              24x7 Active
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition">
                            {service.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                            {service.description}
                          </p>
                        </div>

                        {service.features && service.features.length > 0 && (
                          <div className="pt-3 border-t border-slate-100">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                              Clinical Highlights:
                            </span>
                            <ul className="space-y-1.5">
                              {service.features.map((feat, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                        <a
                          href={`tel:${rawPhone}`}
                          className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 group/btn"
                        >
                          <Phone className="w-3.5 h-3.5 text-sky-600" />
                          <span>Inquire / Helpline</span>
                        </a>
                        <a
                          href={`https://wa.me/${(profile.whatsappNumber || "+917874381551").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello Geeta Hospital Mundra, I would like to inquire about your ${service.title} service.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

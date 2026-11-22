import type { Metadata } from "next";
import Link from "next/link";
import {
  SERVICES,
  HOSPITAL_INFO,
} from "@/data/hospitalData";
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
  Calendar,
  Building2,
} from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Services & Medical Departments | Geeta Hospital Mundra Kutch",
  description:
    "Explore 24+ medical departments and facilities at Geeta Hospital Mundra: 24x7 ICU Ambulance, Pathology Lab, Pharmacy, 3-Bed ICU, 5-Bed NICU, C-ARM Orthopedic OT, Laparoscopy, 3D/4D Doppler USG, and Cashless Mediclaim.",
  alternates: {
    canonical: "https://geetahospitalmundra.com/services",
  },
};

// Map icon names to Lucide icons
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

export default function ServicesPage() {
  const rawPhone = HOSPITAL_INFO.phone.replace(/[^0-9+]/g, "");

  const categories = [
    "Critical Care",
    "Surgical & Maternal",
    "Diagnostics",
    "Inpatient & Amenities",
    "Community Health",
  ] as const;

  return (
    <>
      <JsonLd
        pageType="services"
        breadcrumbs={[
          { name: "Home", url: "https://geetahospitalmundra.com" },
          { name: "Services", url: "https://geetahospitalmundra.com/services" },
        ]}
      />

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
            const items = SERVICES.filter((s) => s.category === category);
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
                      className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-lg hover:border-sky-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            {getIcon(service.iconName)}
                          </div>
                          {service.isEmergency24x7 && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700 uppercase tracking-wider">
                              24x7 Available
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          {service.title}
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">
                          {service.description}
                        </p>

                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Key Capabilities:
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-600">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Assistance Footer Strip */}
      <section className="py-14 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-red-200 tracking-wider">
              24x7 Round-The-Clock Dispatch
            </span>
            <h3 className="text-2xl font-black text-white">
              Need an ICU Ambulance or Urgent Hospitalization?
            </h3>
            <p className="text-red-100 text-xs sm:text-sm">
              Our emergency casualty officer and ambulance team are always on stand-by.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${rawPhone}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-red-700 font-black text-sm shadow-xl hover:bg-red-50 transition"
            >
              <Phone className="w-4 h-4" />
              <span>Call Helpline: {HOSPITAL_INFO.phone}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

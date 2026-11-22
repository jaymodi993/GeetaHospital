"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  ExternalLink,
  HeartPulse,
  Ambulance,
  ChevronRight,
} from "lucide-react";
import { HOSPITAL_INFO } from "@/data/hospitalData";
import { useCms } from "@/context/CmsContext";

export default function Footer() {
  const { hospitalProfile } = useCms();
  const profile = hospitalProfile || HOSPITAL_INFO;
  const rawPhone = (profile.phone || HOSPITAL_INFO.phone).replace(/[^0-9+]/g, "");

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Emergency Strip */}
      <div className="bg-gradient-to-r from-red-900/90 via-red-800 to-rose-900 border-b border-red-700/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-white/10 text-white animate-pulse">
              <Ambulance className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-extrabold text-base sm:text-lg">
                24x7 Medical Emergency & ICU Ambulance
              </h4>
              <p className="text-red-100 text-xs sm:text-sm">
                Immediate response team for trauma, cardiac events, labor & newborn care in Mundra & Kutch.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${rawPhone}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-red-700 hover:bg-red-50 font-black text-sm shadow-lg transition active:scale-95"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <span>Call: {HOSPITAL_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About Hospital */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-700 shadow-md flex items-center justify-center shrink-0">
                <Image
                  src={profile.logoUrl || "/images/logo.png"}
                  alt={`${profile.name || "Geeta Hospital"} Logo`}
                  width={36}
                  height={36}
                  className="object-contain p-0.5"
                  unoptimized
                />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight uppercase">
                  {profile.name || "GEETA HOSPITAL"}
                </span>
                <span className="block text-xs font-semibold text-sky-400">
                  MUNDRA (KUTCH) • EST. {profile.establishedYear || "2009"}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Leading 45-bed multi-speciality healthcare facility located on a highway road-touch plot (~9,500 sq. ft.) in Mundra. ISO 9001:2015 certified, ROHINI registered, delivering ethical clinical care 24 hours a day, 7 days a week.
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ISO 9001:2015 Quality Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>ROHINI Registered Hospital (IIB)</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-400" />
                <span>GPCB Bio-Medical Waste Authorized</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-sky-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                  <span>Hospital Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sky-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                  <span>About Us & Infrastructure</span>
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-sky-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                  <span>Doctors & OPD Timetable</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-sky-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                  <span>Departments & OTs</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-sky-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                  <span>Facilities & Camp Gallery</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                  <span>Emergency Location & Contact</span>
                </Link>
              </li>
              <li className="pt-2 flex flex-col gap-1.5">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Hospital Admin & Content CMS</span>
                </Link>
                <a
                  href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Namaste Geeta Hospital Mundra, I would like to inquire about hospital facilities.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  <span>WhatsApp Hospital Desk</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Services & Cashless */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Key Medical Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>• Obstetrics, Gynecology & Painless Delivery</li>
              <li>• Pediatrics & 5-Bed Neonatal ICU (NICU)</li>
              <li>• 3-Bed Adult ICU with Ventilator & Monitors</li>
              <li>• Orthopedic Trauma Surgery with C-ARM</li>
              <li>• Laparoscopic Hysterectomy & General Surgery</li>
              <li>• 24x7 In-House Pathology Lab & Pharmacy</li>
              <li>• 3D/4D Color Doppler Sonography & Digital X-Ray</li>
              <li>• Visiting Super-Speciality OPDs (Cardio, Neuro, IVF, ENT)</li>
            </ul>

            <div className="pt-2">
              <span className="block text-xs font-semibold text-slate-300 mb-1">
                Cashless Corporate & TPA Tie-Ups:
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Adani Group, Jindal Group, DP World (MICT), Tata Power, Reliance General, HDFC ERGO, Paramount, Medi Assist & all major TPAs.
              </p>
            </div>
          </div>

          {/* Col 4: Contact & Emergency Desk */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Contact & Emergency
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  3, Ambe Nagar, Nr. Gajanand Complex, Gundala Road, Baroi-Mundra (Kutch), Gujarat 370421
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-500 block">24x7 Helpline / Ambulance</span>
                  <a href={`tel:${rawPhone}`} className="text-white font-bold hover:text-sky-400 transition">
                    {HOSPITAL_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${HOSPITAL_INFO.email}`} className="text-slate-300 hover:text-white transition break-all">
                  {HOSPITAL_INFO.email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  OPD: 10:00 AM - 1:30 PM & 5:00 PM - 8:00 PM
                  <br />
                  <strong className="text-slate-200">Emergency & Ambulance: 24 Hours Open</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Geeta Hospital, Mundra (Kutch). All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>ISO 9001:2015</span>
            <span>•</span>
            <span>ROHINI Registered</span>
            <span>•</span>
            <span>GPCB Authorized</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

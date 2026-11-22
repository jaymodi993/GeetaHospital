"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  Activity,
  Baby,
  HeartPulse,
  Bone,
  FlaskConical,
  Pill,
  Building2,
  CheckCircle2,
  MapPin,
  ExternalLink,
  ChevronDown,
  Ambulance,
  Stethoscope,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import {
  HOSPITAL_INFO,
  DOCTORS,
  SERVICES,
  INSURANCE_PARTNERS,
  FACILITIES_LIST,
  FAQS,
} from "@/data/hospitalData";

export default function HomeClient() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const rawPhone = HOSPITAL_INFO.phone.replace(/[^0-9+]/g, "");

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-200/30 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100/80 border border-sky-200/60 text-sky-800 text-xs sm:text-sm font-semibold shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-sky-600 animate-pulse"></span>
                <span>ISO 9001:2015 Certified • ROHINI Registered Hospital</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                Leading Multi-Speciality <br />
                <span className="bg-gradient-to-r from-sky-700 via-sky-600 to-teal-600 bg-clip-text text-transparent">
                  Healthcare in Mundra
                </span>
              </h1>

              {/* Tagline / Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Serving Mundra & Kutch since 2009. A premier 45-bed hospital providing 24x7 Emergency Care, Gynecology, Pediatrics, Critical Care (ICU & NICU), C-ARM Orthopedic Surgery, In-House Pathology Lab, and In-House Pharmacy.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello Geeta Hospital Mundra, I would like to inquire about doctor consultation and facilities.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Inquiry</span>
                </a>

                <a
                  href={`tel:${rawPhone}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4 text-red-100 animate-pulse" />
                  <span>24x7 Emergency: {HOSPITAL_INFO.phone}</span>
                </a>

                <Link
                  href="/doctors"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-5 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
                >
                  <span>Our Doctors</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Cashless & Trust Badges */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Cashless Partner with:</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Adani Group</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Jindal Group</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">DP World (MICT)</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Tata Power</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">All Major TPAs</span>
              </div>
            </div>

            {/* Right Column: Visual Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Image Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                  <div className="relative h-80 sm:h-96 w-full">
                    <Image
                      src="/images/hospital-building.jpg"
                      alt="Geeta Hospital Building Campus in Mundra"
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  </div>

                  {/* Overlay Content */}
                  <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 text-[11px] font-bold text-white uppercase tracking-wider">
                      <Ambulance className="w-3.5 h-3.5" />
                      24x7 Ambulance & Emergency
                    </div>
                    <h3 className="text-xl font-bold">Geeta Multi-Speciality Hospital</h3>
                    <p className="text-xs text-slate-300">
                      Highway road-touch plot (~9,500 sq. ft.) with ample parking space & stretcher lift.
                    </p>
                  </div>
                </div>

                {/* Floating Stat Badge 1: 15+ Years */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xl font-black text-slate-900">15+ Years</span>
                    <span className="text-xs text-slate-500">Excellence in Mundra</span>
                  </div>
                </div>

                {/* Floating Stat Badge 2: 45 Beds */}
                <div className="absolute -top-4 -right-4 sm:-right-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-100 text-teal-700">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xl font-black text-slate-900">45 Beds</span>
                    <span className="text-xs text-slate-500">ICU, NICU & AC Rooms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-slate-200/70">
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-sky-700">45+</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600">Inpatient Hospital Beds</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">Deluxe, AC & General Wards</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-teal-700">24x7</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600">Emergency & Ambulance</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">ICU, Pathology Lab & Pharmacy</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-indigo-700">15+</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600">Specialist Doctors</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">Resident & Super-Specialists</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-700">100%</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600">Cashless Assistance</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">Adani, Jindal & All TPAs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EMERGENCY & QUICK HELPLINE STRIP */}
      <section className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-5 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white shrink-0">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-red-100">
                Immediate Clinical Assistance
              </span>
              <h3 className="text-lg sm:text-xl font-black">
                Need Immediate Emergency Help or ICU Ambulance?
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a
              href={`tel:${rawPhone}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-red-700 hover:bg-red-50 font-black text-sm shadow-md transition active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {HOSPITAL_INFO.phone}</span>
            </a>
            <a
              href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello Geeta Hospital, I need immediate medical consultation.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/60 border border-white/20 text-white font-bold text-sm transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Hospital Desk</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. CORE MEDICAL SPECIALITIES */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
              Comprehensive Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Key Medical Departments & Services
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Providing holistic healthcare under one roof with advanced technology, experienced consultants, and compassionate nursing care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service 1: Gynecology */}
            <div className="group p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition">
                Gynecology & Obstetrics
              </h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Painless normal delivery, high-risk pregnancy management, Cesarean section, 3D/4D fetal USG, and laparoscopic hysterectomy led by Dr. Kundan Modi (17+ yrs exp).
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>High-risk delivery & modern Labor OT</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Infertility & Satellite IVF center</span>
                </li>
              </ul>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:text-sky-800"
              >
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 2: Pediatrics & NICU */}
            <div className="group p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Baby className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition">
                Pediatrics & 5-Bed NICU
              </h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Specialized newborn care with ventilators, phototherapy, CPAP, HHFNC, and comprehensive vaccination led by Dr. Rahul Patel (Gold Medalist Pediatrician).
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>Critical premature newborn handling</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>Birth-to-adulthood immunization</span>
                </li>
              </ul>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:text-sky-800"
              >
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 3: Critical Care & ICU */}
            <div className="group p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition">
                3-Bed ICU & Critical Care
              </h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                24x7 intensive care for heart attack, hypertensive emergencies, poisoning, snake bites, and trauma led by Dr. Vinod Prajapati (17+ yrs exp).
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Mechanical ventilators & multipara monitors</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Central medical oxygen line to every bed</span>
                </li>
              </ul>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:text-sky-800"
              >
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 4: Orthopedics & C-ARM */}
            <div className="group p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Bone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition">
                Orthopedic Surgery & C-ARM OT
              </h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Dedicated orthopedic surgical theater with modern C-ARM image intensifier for fracture fixation, joint care, and emergency trauma reduction.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Real-time surgical X-ray imaging</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Trauma plating & joint management</span>
                </li>
              </ul>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:text-sky-800"
              >
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 5: Pathology Lab */}
            <div className="group p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition">
                24x7 In-House Pathology Lab
              </h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Automated blood, urine, thyroid, hormone profiling, cytology, and biopsy examinations directed by Dr. Avani K. Modi (17+ yrs exp).
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>24-hour emergency lab test dispatch</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Thalassemia & executive checkup panels</span>
                </li>
              </ul>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:text-sky-800"
              >
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 6: 24x7 Pharmacy */}
            <div className="group p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition">
                24x7 In-House Pharmacy
              </h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Geeta Medical Stores located on the ground floor ensures all prescription medications, emergency injectables, and surgical items are ready 24/7.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% genuine pharmaceutical stock</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Never closed on nights or holidays</span>
                </li>
              </ul>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:text-sky-800"
              >
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition"
            >
              <span>Explore All 24 Medical Services & Departments</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. VISITING SUPER-SPECIALISTS SCHEDULE HIGHLIGHT */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider">
                Super-Speciality Clinics
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
                Visiting Super-Specialists OPD Schedule
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Leading specialists from Bhuj, Ahmedabad, and top tertiary hospitals conduct regular OPD consultations at Geeta Hospital Mundra.
              </p>
            </div>

            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition"
            >
              <span>View Full Doctors Roster</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Thursday: Cardiology */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/50 transition">
              <span className="inline-block px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 text-xs font-bold mb-3">
                1st Thursday • 5:00 - 6:00 PM
              </span>
              <h4 className="text-lg font-bold text-white">Dr. Jaydatt Tekani</h4>
              <p className="text-sky-400 text-xs font-semibold">MD, DNB (Cardiology)</p>
              <p className="text-slate-300 text-xs mt-2">
                Heart Disease Specialist (Marengo CIMS / K.K. Patel Hospital)
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Cardiology OPD</span>
                <a
                  href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Inquiry for Dr. Jaydatt Tekani (Cardiology Camp) at Geeta Hospital")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 font-bold"
                >
                  Inquire Schedule →
                </a>
              </div>
            </div>

            {/* Thursday: Neurology */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/50 transition">
              <span className="inline-block px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 text-xs font-bold mb-3">
                1st & 3rd Thursday • 3:30 - 5:30 PM
              </span>
              <h4 className="text-lg font-bold text-white">Dr. Naushad Ravjani</h4>
              <p className="text-teal-400 text-xs font-semibold">MD, DM Neurology (NIMS)</p>
              <p className="text-slate-300 text-xs mt-2">
                Brain & Neurological Disease Specialist • EEG Facility Available
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Neurology OPD</span>
                <a
                  href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Inquiry for Dr. Naushad Ravjani (Neurology Camp) at Geeta Hospital")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:text-teal-300 font-bold"
                >
                  Inquire Schedule →
                </a>
              </div>
            </div>

            {/* Saturday: IVF Specialist */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/50 transition">
              <span className="inline-block px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 text-xs font-bold mb-3">
                1st Saturday • 2:00 - 5:00 PM
              </span>
              <h4 className="text-lg font-bold text-white">Dr. Rajesh & Shital Punjabi</h4>
              <p className="text-rose-400 text-xs font-semibold">MD, DGO (IVF Specialists)</p>
              <p className="text-slate-300 text-xs mt-2">
                Shashwat IVF Center Ahmedabad • Test Tube Baby Consultation
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Fertility Clinic</span>
                <a
                  href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Inquiry for IVF & Fertility Clinic at Geeta Hospital")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-400 hover:text-rose-300 font-bold"
                >
                  Inquire Schedule →
                </a>
              </div>
            </div>

            {/* Saturday: ENT Specialist */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/50 transition">
              <span className="inline-block px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold mb-3">
                2nd & 4th Saturday • 2:00 - 5:00 PM
              </span>
              <h4 className="text-lg font-bold text-white">Dr. Ankur Dhanani</h4>
              <p className="text-amber-400 text-xs font-semibold">M.S. (E.N.T.)</p>
              <p className="text-slate-300 text-xs mt-2">
                Ear, Nose, Throat Specialist (Dhanani’s ENT Clinic, Bhuj)
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">ENT Clinic</span>
                <a
                  href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Inquiry for Dr. Ankur Dhanani (ENT Clinic) at Geeta Hospital")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-bold"
                >
                  Inquire Schedule →
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            Also available: Rheumatology (1st & 3rd Wednesday), Brain & Spine Surgery (2nd Saturday), and Sunday Eye Clinic (10 AM - 1 PM).
          </div>
        </div>
      </section>

      {/* 5. HOSPITAL INFRASTRUCTURE HIGHLIGHTS */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
                State-of-the-Art Setup
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Built For Safety, Speed & Patient Comfort
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Geeta Hospital spans over 9,500 sq. ft. on a highway road-touch plot in Baroi-Mundra. Engineered for infection control, sterile patient flows, and continuous life support.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Stretcher Elevator & Ramp Access</h4>
                    <p className="text-xs text-slate-500">Smooth transit between Emergency, ICU, and OTs.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Central Medical Oxygen Pipeline</h4>
                    <p className="text-xs text-slate-500">Direct piped medical oxygen to all ICU, NICU, and ward beds.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">1 Deluxe & 7 Special AC Inpatient Rooms</h4>
                    <p className="text-xs text-slate-500">Hygienic private recovery suites with attendant amenities.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition"
                >
                  <span>Explore All 18 Hospital Facilities</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative h-60 rounded-2xl overflow-hidden shadow-md group">
                <Image
                  src="/images/icu-1.jpg"
                  alt="3-Bed Intensive Care Unit"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-3 left-4 text-white">
                  <span className="text-xs font-bold bg-sky-600 px-2 py-0.5 rounded">Critical Care</span>
                  <h4 className="text-base font-bold mt-1">3-Bed Adult ICU with Ventilator</h4>
                </div>
              </div>

              <div className="relative h-60 rounded-2xl overflow-hidden shadow-md group">
                <Image
                  src="/images/nicu-1.jpg"
                  alt="5-Bed Neonatal ICU"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-3 left-4 text-white">
                  <span className="text-xs font-bold bg-teal-600 px-2 py-0.5 rounded">Neonatology</span>
                  <h4 className="text-base font-bold mt-1">5-Bed NICU with Incubators</h4>
                </div>
              </div>

              <div className="relative h-60 rounded-2xl overflow-hidden shadow-md group">
                <Image
                  src="/images/ortho-carm-ot.jpg"
                  alt="Orthopedic Operation Theatre with C-ARM"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-3 left-4 text-white">
                  <span className="text-xs font-bold bg-amber-600 px-2 py-0.5 rounded">Surgery</span>
                  <h4 className="text-base font-bold mt-1">C-ARM Orthopedic & Laparoscopy OT</h4>
                </div>
              </div>

              <div className="relative h-60 rounded-2xl overflow-hidden shadow-md group">
                <Image
                  src="/images/hospital-lab-view.jpg"
                  alt="24x7 In-House Pathology Lab"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-3 left-4 text-white">
                  <span className="text-xs font-bold bg-emerald-600 px-2 py-0.5 rounded">Diagnostics</span>
                  <h4 className="text-base font-bold mt-1">24x7 In-House Pathology Lab</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CASHLESS MEDICLAIM & CORPORATE TIE-UPS */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Cashless Hospitalization
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Corporate & Insurance TPA Tie-Ups
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              We provide hassle-free cashless hospitalization for employees and families of leading industrial groups and all major insurance companies.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {INSURANCE_PARTNERS.map((partner, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-sky-300 hover:shadow-md transition text-center flex flex-col justify-center items-center h-24"
              >
                <span className="text-xs font-black text-slate-800 tracking-tight">
                  {partner.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                  {partner.type}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-sky-50 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="text-sm font-bold text-sky-900">Have an insurance policy or corporate health card?</h4>
              <p className="text-xs text-sky-700">
                Our in-house Mediclaim Desk assists with prompt pre-authorizations and document submissions.
              </p>
            </div>
            <a
              href={`tel:${rawPhone}`}
              className="px-5 py-2 rounded-xl bg-sky-700 text-white font-bold text-xs hover:bg-sky-800 transition shrink-0"
            >
              Contact Mediclaim Desk
            </a>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="py-16 lg:py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
              Common Questions
            </span>
            <h2 className="text-3xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm">
              Everything you need to know about admissions, doctor appointments, emergency support, and cashless mediclaim at Geeta Hospital Mundra.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-sky-700 transition"
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180 text-sky-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION / APPOINTMENT PROMPT */}
      <section className="py-16 bg-gradient-to-r from-sky-700 via-sky-800 to-teal-800 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Healthier Lives in Kutch
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Experience Quality, Ethical Healthcare in Mundra
          </h2>
          <p className="text-sky-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Whether for regular prenatal checkups, pediatric immunization, emergency trauma surgery, or super-speciality consultations, our team is at your service 24x7.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello Geeta Hospital Mundra, I would like to inquire about hospital services and doctor appointments.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact via WhatsApp</span>
            </a>
            <a
              href={`tel:${rawPhone}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Emergency 24x7: {HOSPITAL_INFO.phone}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

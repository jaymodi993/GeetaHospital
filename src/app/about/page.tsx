import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Building2,
  CheckCircle2,
  FileText,
  Clock,
  HeartHandshake,
  Users,
  ChevronRight,
  Flame,
  Recycle,
  Hospital,
  Activity,
  Ambulance,
  Phone,
} from "lucide-react";
import { HOSPITAL_INFO, FACILITIES_LIST, INSURANCE_PARTNERS } from "@/data/hospitalData";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "About Us | Geeta Hospital Mundra - 45-Bed Multi-Speciality Healthcare Since 2009",
  description:
    "Learn about Geeta Hospital Mundra: established in 2009, 45-bed multi-speciality facility on a 9,500 sq. ft. campus with ISO 9001:2015 certification, ROHINI registration, and 24x7 emergency medical services.",
  alternates: {
    canonical: "https://geetahospitalmundra.com/about",
  },
};

export default function AboutPage() {
  const rawPhone = HOSPITAL_INFO.phone.replace(/[^0-9+]/g, "");

  return (
    <>
      <JsonLd
        pageType="about"
        breadcrumbs={[
          { name: "Home", url: "https://geetahospitalmundra.com" },
          { name: "About Us", url: "https://geetahospitalmundra.com/about" },
        ]}
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white py-14 lg:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Established 2009 • 15+ Years of Clinical Service</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              About Geeta Hospital Mundra
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Mundra’s trusted multi-speciality medical institution built across ~9,500 sq. ft. on a prime highway road-touch plot, delivering 24x7 emergency, critical, maternal, and surgical healthcare.
            </p>
          </div>
        </div>
      </section>

      {/* Overview & Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
                Our Legacy
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Pioneering Comprehensive Healthcare in Mundra & Kutch
              </h2>
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Founded in 2009, <strong>Geeta Hospital</strong> has grown to become the leading healthcare destination in Mundra for Gynecology, Obstetrics, Pediatrics, Critical Care, General & Laparoscopic Surgery, Orthopedics, ENT, Radiology, and Dermatology.
                </p>
                <p>
                  We are proud to serve the community with round-the-clock specialists, a 3-bed adult ICU, a 5-bed Neonatal Intensive Care Unit (NICU), and sterile modular operation theaters equipped with modern laparoscopy units and a C-ARM image intensifier.
                </p>
                <p>
                  To make quality healthcare accessible to all, Geeta Hospital has established cashless tie-ups with nearly all major insurance companies and TPAs, as well as preferred corporate cashless healthcare partnerships with <strong>Adani Group, Jindal Group, Dubai Port World (MICT), Tata Power, Airport Authority of India, TG Terminal, and Inosource</strong>.
                </p>
              </div>

              {/* Accreditations Row */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block font-bold">ISO 9001:2015 Certified</strong>
                    <span className="text-slate-500">Certified Quality Management</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 flex items-center gap-3">
                  <Award className="w-5 h-5 text-sky-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block font-bold">ROHINI Registered</strong>
                    <span className="text-slate-500">Insurance Registry Validated</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100 bg-slate-900 h-96">
                <Image
                  src="/images/hospital-building.jpg"
                  alt="Geeta Hospital Campus in Mundra"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-6 inset-x-6 text-white space-y-1">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    Infrastructure Highlight
                  </span>
                  <h4 className="text-lg font-bold">45-Bed Multi-Speciality Campus</h4>
                  <p className="text-xs text-slate-300">
                    9,500 sq. ft. built-up floor area with stretcher elevator, central oxygen, and dedicated power backup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 18 Facilities Section */}
      <section className="py-16 lg:py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
              Comprehensive Facilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              18 Complete Hospital Facilities & Services
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Everything in-house for swift diagnosis, effective treatment, and safe recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FACILITIES_LIST.map((facility, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 font-black text-xs flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {facility.title}
                  </h3>
                  <span className="inline-block text-xs font-semibold text-sky-700 mb-2">
                    {facility.highlight}
                  </span>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations & Statutory Certificates */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
              Regulatory Standards
            </span>
            <h2 className="text-3xl font-black text-slate-900">
              Certifications & Accreditations
            </h2>
            <p className="text-slate-600 text-sm">
              Geeta Hospital operates with strict compliance to national safety, environmental, and healthcare quality guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cert 1 */}
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-sky-300 transition-all flex flex-col group">
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <Image
                  src="/images/cert-registration.jpg"
                  alt="Certificate of Registration"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                      Registration Certificate
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Clinical Establishments Registration</h4>
                  <p className="text-xs text-slate-500">
                    Officially certified and registered under the Gujarat Clinical Establishments Act.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/60">
                  <a
                    href="/images/cert-registration.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                  >
                    <span>View Full Certificate Document</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Cert 2 */}
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-teal-300 transition-all flex flex-col group">
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <Image
                  src="/images/cert-rohini.jpg"
                  alt="ROHINI Registration Certificate"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-teal-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                      ROHINI (IIB) Certified
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">ROHINI Mediclaim Network Registry</h4>
                  <p className="text-xs text-slate-500">
                    Official Registry of Hospitals in Network of Insurance (IIB) for Cashless TPA Hospitalization.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/60">
                  <a
                    href="/images/cert-rohini.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    <span>View Full Certificate Document</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Cert 3 */}
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col group">
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <Image
                  src="/images/cert-bmw.jpg"
                  alt="Bio-Medical Waste Authorization Certificate"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Recycle className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      GPCB Form-III
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Bio-Medical Waste Authorization</h4>
                  <p className="text-xs text-slate-500">
                    Gujarat Pollution Control Board Bio-Medical Waste Authorization Form-III compliance.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/60">
                  <a
                    href="/images/cert-bmw.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>View Full Certificate Document</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Cert 4 */}
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-rose-300 transition-all flex flex-col group">
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <Image
                  src="/images/cert-fire-noc.jpg"
                  alt="Fire Safety NOC Certificate"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      Fire NOC Approved
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Fire Safety Compliance Certificate</h4>
                  <p className="text-xs text-slate-500">
                    FSCA government safety compliance with advanced fire prevention systems and regular drills.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/60">
                  <a
                    href="/images/cert-fire-noc.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <span>View Full Certificate Document</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Cert 5 */}
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all flex flex-col group">
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <Image
                  src="/images/cert-pndt.jpg"
                  alt="PNDT Registration Certificate"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      PNDT Registered
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Pre-Natal Diagnostic Techniques (PNDT)</h4>
                  <p className="text-xs text-slate-500">
                    Approved registration for 3D/4D ultrasound imaging and obstetrics sonography.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/60">
                  <a
                    href="/images/cert-pndt.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <span>View Full Certificate Document</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Cert 6 */}
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-amber-300 transition-all flex flex-col group">
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <Image
                  src="/images/cert-gpcb-1.jpg"
                  alt="GPCB Bio-Medical Waste Authorization Form-III"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      GPCB Authorization
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">GPCB Form-III Authorization Page 1</h4>
                  <p className="text-xs text-slate-500">
                    State pollution control board clinical waste management authorization.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/60">
                  <a
                    href="/images/cert-gpcb-1.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    <span>View Full Certificate Document</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In-House Associated Firms */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider">
              In-House Facilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Associated In-House Medical Units
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Ground Floor</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">Geeta Medical Stores</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                24x7 in-house pharmacy providing authentic prescription medications, pediatric syrups, surgical dressings, and emergency life-saving injectables.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Diagnostics Wing</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">Geeta Pathology Laboratory</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                24x7 automated testing for hematology, biochemistry, thyroid hormones, HPLC thalassemia screening, and emergency arterial blood gases.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Digital Health</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">Kivihealth Digital Portal</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Integrated online appointment scheduling, digital medical records, and instant appointment confirmation for patients in Mundra.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate & Cashless Insurance Network */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-10">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Cashless Hospitalization Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Corporate &amp; Insurance TPA Tie-Ups
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Preferred cashless healthcare provider in Mundra &amp; Kutch for leading industrial groups and all major health insurance companies.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {INSURANCE_PARTNERS.map((partner, idx) => (
              <div
                key={idx}
                className="group p-3 rounded-2xl border border-slate-200 bg-white hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between items-center text-center"
              >
                <div className="relative w-full h-14 sm:h-16 flex items-center justify-center p-2 rounded-xl bg-slate-50/70 group-hover:bg-sky-50/50 transition">
                  <Image
                    src={partner.image}
                    alt={`${partner.name} logo`}
                    fill
                    className="object-contain p-1 filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 16vw"
                  />
                </div>
                <span className="mt-2 text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-sky-700 transition">
                  {partner.name}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  {partner.type === "Corporate" ? "Corporate" : "Insurance / TPA"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-14 bg-gradient-to-r from-sky-700 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-black">Experience Compassionate Healthcare Today</h3>
            <p className="text-sky-100 text-sm mt-1">
              Visit our campus on Gundala Road, Mundra or call our round-the-clock helpline.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-white text-sky-900 font-bold text-sm shadow-md hover:bg-sky-50 transition"
            >
              Get Directions & Contact
            </Link>
            <a
              href={`tel:${rawPhone}`}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition"
            >
              24x7 Helpline
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

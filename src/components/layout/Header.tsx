"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Phone,
  Clock,
  MapPin,
  Menu,
  X,
  Shield,
  Ambulance,
  ChevronRight,
  Lock,
  MessageCircle,
} from "lucide-react";
import { HOSPITAL_INFO } from "@/data/hospitalData";
import { useCms } from "@/context/CmsContext";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Doctors & OPD", href: "/doctors" },
  { name: "Services & Facilities", href: "/services" },
  { name: "Photo Gallery", href: "/gallery" },
  { name: "Contact & Location", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { hospitalProfile } = useCms();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const profile = hospitalProfile || HOSPITAL_INFO;
  const rawPhone = (profile.phone || HOSPITAL_INFO.phone).replace(/[^0-9+]/g, "");
  const whatsappUrl = `https://wa.me/${(profile.whatsappNumber || HOSPITAL_INFO.whatsappNumber).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Namaste Geeta Hospital Mundra, I would like to inquire about hospital services and doctor availability."
  )}`;

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        {/* Top Announcement & Emergency Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-slate-200 text-xs border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-y-1">
            {/* Left: Accreditation & Hours */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>24x7 Emergency, Trauma & ICU Open</span>
              </div>
              <span className="hidden md:inline text-slate-600">|</span>
              <div className="hidden sm:flex items-center gap-1 text-slate-300">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                <span>ISO 9001:2015 Certified • ROHINI Registered</span>
              </div>
            </div>

            {/* Right: Contact, Location & Admin */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs">
              <a
                href={`tel:${rawPhone}`}
                className="flex items-center gap-1.5 font-bold text-red-400 hover:text-red-300 transition"
              >
                <Phone className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span>Emergency: {HOSPITAL_INFO.phone}</span>
              </a>
              <span className="hidden lg:inline text-slate-600">|</span>
              <div className="hidden lg:flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>Gundala Road, Baroi-Mundra</span>
              </div>
              <span className="hidden sm:inline text-slate-600">|</span>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-sky-300 hover:text-white font-semibold transition"
                title="Hospital Admin CMS"
              >
                <Lock className="w-3 h-3 text-sky-400" />
                <span>Admin CMS</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? "bg-white/95 backdrop-blur-md shadow-md py-3"
              : "bg-white border-b border-slate-100 py-4"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 sm:gap-4 group shrink-0 py-0.5">
              <div className="relative h-12 sm:h-14 w-auto min-w-[48px] max-w-[210px] flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
                <Image
                  src={profile.logoUrl || "/images/logo.png"}
                  alt={`${profile.name || "Geeta Hospital"} Logo`}
                  width={200}
                  height={56}
                  className="h-11 sm:h-13 w-auto max-w-[200px] object-contain drop-shadow-xs"
                  unoptimized
                  priority
                />
              </div>

              {/* Title & Tag */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-sky-700 transition uppercase">
                    {profile.name || "GEETA HOSPITAL"}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 tracking-wider">
                    MUNDRA
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 -mt-0.5 line-clamp-1 max-w-[280px] sm:max-w-none">
                  {profile.tagline || "45-Bed Multi-Speciality • Since 2009"}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? "text-sky-700 bg-sky-50 shadow-xs"
                        : "text-slate-700 hover:text-sky-600 hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href={`tel:${rawPhone}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition"
              >
                <Ambulance className="w-4 h-4 text-red-600" />
                <span className="hidden md:inline">24x7 Ambulance</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Desk</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex xl:hidden items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden p-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                aria-label="WhatsApp Contact"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
              </a>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 shadow-xl animate-fade-in">
            <div className="px-4 pt-3 pb-6 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
                      isActive
                        ? "bg-sky-50 text-sky-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-center text-sm shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={`tel:${rawPhone}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-600 text-white font-bold text-center text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Emergency: {HOSPITAL_INFO.phone}</span>
                </a>

                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs text-center"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hospital Admin CMS</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

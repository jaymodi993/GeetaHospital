"use client";

import { useState, useEffect } from "react";
import { Phone, Calendar, ArrowUp, MessageSquare } from "lucide-react";
import { HOSPITAL_INFO } from "@/data/hospitalData";
import AppointmentModal from "./AppointmentModal";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rawPhone = HOSPITAL_INFO.phone.replace(/[^0-9+]/g, "");
  const whatsappUrl = `https://wa.me/${HOSPITAL_INFO.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hello%20Geeta%20Hospital,%20I%20would%20like%20to%20inquire%20about%20medical%20services/doctor%20consultation.`;

  return (
    <>
      <aside aria-label="Quick contact and assistance actions" className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3 pointer-events-none">
        {/* Scroll To Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="pointer-events-auto p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* WhatsApp Direct Chat */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="pointer-events-auto group relative flex items-center gap-2 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl transition-all transform hover:scale-105 active:scale-95"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold px-0 group-hover:pr-1">
            WhatsApp Help
          </span>
        </a>

        {/* Quick Book Appointment */}
        <button
          onClick={() => setIsModalOpen(true)}
          aria-label="Book doctor appointment"
          className="pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 text-xs md:text-sm font-semibold"
        >
          <Calendar className="w-4 h-4" />
          <span>Book OPD</span>
        </button>

        {/* 24x7 Emergency Call Pulsing Button */}
        <a
          href={`tel:${rawPhone}`}
          aria-label="Call 24/7 Emergency Ambulance"
          className="pointer-events-auto relative group flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl transition-all transform hover:scale-105 active:scale-95"
        >
          {/* Pulsing ring */}
          <span className="absolute -inset-1 rounded-full bg-red-500 opacity-75 animate-ping -z-10"></span>
          <Phone className="w-5 h-5 animate-bounce" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-100 leading-none">
              24x7 Emergency
            </span>
            <span className="text-xs md:text-sm font-extrabold leading-tight">
              {HOSPITAL_INFO.phone}
            </span>
          </div>
        </a>
      </aside>

      {/* Appointment Modal */}
      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

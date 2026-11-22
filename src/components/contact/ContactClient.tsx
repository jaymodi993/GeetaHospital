"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Ambulance,
} from "lucide-react";
import { HOSPITAL_INFO } from "@/data/hospitalData";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "OPD Appointment Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const rawPhone = HOSPITAL_INFO.phone.replace(/[^0-9+]/g, "");
  const whatsappUrl = `https://wa.me/${HOSPITAL_INFO.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hello%20Geeta%20Hospital,%20I%20have%20an%20inquiry%20regarding%20hospital%20services.`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white py-14 lg:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold">
              <Ambulance className="w-3.5 h-3.5" />
              <span>24x7 Emergency Casualty & Ambulance Available</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Contact & Hospital Location
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We are strategically located on a highway road-touch plot on Gundala Road, Baroi-Mundra with round-the-clock emergency casualty reception and ample parking.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-14 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Phone */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">24x7 Helpline / Ambulance</h3>
              <a
                href={`tel:${rawPhone}`}
                className="text-sm font-extrabold text-red-600 hover:text-red-700 block transition"
              >
                {HOSPITAL_INFO.phone}
              </a>
              <p className="text-[11px] text-slate-500">
                Always open for urgent admissions, trauma, and maternal emergencies.
              </p>
            </div>

            {/* Email */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Email Inquiries</h3>
              <a
                href={`mailto:${HOSPITAL_INFO.email}`}
                className="text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-800 block break-all transition"
              >
                {HOSPITAL_INFO.email}
              </a>
              <p className="text-[11px] text-slate-500">
                For administrative, mediclaim, and corporate tie-up queries.
              </p>
            </div>

            {/* Address */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Hospital Address</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                3, Ambe Nagar, Nr. Gajanand Complex, Gundala Road, Baroi-Mundra (Kutch), Gujarat 370421
              </p>
            </div>

            {/* Timings */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Operating Hours</h3>
              <p className="text-xs text-slate-700 font-medium">
                <strong>Emergency & Lab:</strong> 24 Hours Open
                <br />
                <strong>Regular OPD:</strong> 10 AM - 1:30 PM & 5 PM - 8 PM
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <div className="mb-6 space-y-1">
                <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
                  Direct Desk
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Send an Inquiry / Consultation Request
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Our front-desk coordinator will respond promptly during business hours.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Message Sent Successfully!</h4>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto">
                    Thank you for reaching out to Geeta Hospital Mundra. Our administrative team will connect with you via phone or email shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                    >
                      <option value="OPD Appointment Inquiry">OPD Appointment Inquiry</option>
                      <option value="Cashless Insurance / TPA Query">Cashless Insurance / TPA Query</option>
                      <option value="Pathology / Diagnostic Test Query">Pathology / Diagnostic Test Query</option>
                      <option value="Full Body Health Checkup Plans">Full Body Health Checkup Plans</option>
                      <option value="Visiting Super-Specialist Token">Visiting Super-Specialist Token</option>
                      <option value="Other Feedback or Information">Other Feedback or Information</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Your Message or Medical Requirements *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please provide details about your medical query or symptoms..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <a
                      href={HOSPITAL_INFO.appointmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition"
                    >
                      <span>Book on Kivihealth</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </form>
              )}
            </div>

            {/* Map & Landmark Column */}
            <div className="lg:col-span-6 space-y-6">
              {/* Google Maps Embed Container */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-100">
                  <iframe
                    title="Geeta Hospital Mundra Location Map"
                    src="https://maps.google.com/maps?q=Geeta+Hospital+Mundra+Gundala+Road+Baroi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                <div className="p-4 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Coordinates: 22.8364° N, 69.7289° E</span>
                  <a
                    href="https://maps.google.com/?q=Geeta+Hospital+Mundra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-sky-700 hover:text-sky-800"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Driving Directions & Access */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="text-base font-bold text-slate-900">
                  Directions & Highway Access
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <li>
                    <strong>From Mundra Port / Adani Township:</strong> Directly accessible via Gundala Road, adjacent to Gajanand Complex.
                  </li>
                  <li>
                    <strong>From Baroi / Mundra Bus Station:</strong> ~5 minutes by vehicle with clear roadside hospital signage.
                  </li>
                  <li>
                    <strong>Parking:</strong> Dedicated on-premise parking for 50+ two-wheelers and four-wheelers.
                  </li>
                  <li>
                    <strong>Ambulance Bay:</strong> Direct flat driveway access to casualty and stretcher elevator.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Lock,
  LogOut,
  PlusCircle,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Stethoscope,
  Image as ImageIcon,
  Search,
  Globe,
  Share2,
  Calendar,
  X,
} from "lucide-react";
import { DOCTORS, Doctor, HOSPITAL_INFO, GALLERY_ITEMS } from "@/data/hospitalData";

export default function AdminClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "admin123" });
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "announcements" | "doctors" | "gallery" | "seo">("profile");

  // CMS Content State
  const [hospitalProfile, setHospitalProfile] = useState<any>(HOSPITAL_INFO);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(DOCTORS);
  const [galleryList, setGalleryList] = useState<any[]>(GALLERY_ITEMS);
  const [seoSettings, setSeoSettings] = useState({
    title: "Geeta Multi-Speciality Hospital Mundra | 24x7 Emergency & Critical Care",
    description: "Premier 45-bed multi-speciality hospital in Mundra (Kutch). 24x7 Emergency, Gynecology, Pediatrics, Adult & Neonatal ICU, Orthopedics, Cashless Mediclaim. ISO 9001:2015 & ROHINI registered.",
    keywords: "Hospital in Mundra, Geeta Hospital Mundra, Emergency hospital Mundra, Gynecologist in Mundra, Pediatrician Mundra, ICU hospital Kutch, Dr Kundan Modi",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Doctor Form Modal
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [newDocForm, setNewDocForm] = useState({
    name: "",
    qualification: "",
    designation: "",
    department: "",
    type: "full-time" as "full-time" | "visiting",
    experience: "5+ Years",
    opdSchedule: "Monday to Saturday",
    opdTiming: "10:00 AM - 1:30 PM & 5:00 PM - 8:00 PM",
    expertise: "Specialist consultation",
    image: "/images/doctors/dr-kundan-modi.jpg",
  });

  // New Photo Form Modal
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
  const [newPhotoForm, setNewPhotoForm] = useState({
    title: "",
    category: "Infrastructure",
    image: "/images/hospital-building.jpg",
  });

  // New Announcement
  const [newAnnForm, setNewAnnForm] = useState({
    title: "",
    content: "",
    category: "General Notice",
  });

  // Check login session
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("gh_admin_auth");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Fetch CMS data
  const fetchCmsData = async () => {
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.hospitalProfile && Object.keys(data.data.hospitalProfile).length > 0) {
          setHospitalProfile((prev: any) => ({ ...prev, ...data.data.hospitalProfile }));
        }
        if (data.data.announcements && data.data.announcements.length > 0) {
          setAnnouncements(data.data.announcements);
        }
        if (data.data.doctors && data.data.doctors.length > 0) {
          setDoctorsList(data.data.doctors);
        }
        if (data.data.gallery && data.data.gallery.length > 0) {
          setGalleryList(data.data.gallery);
        }
        if (data.data.seoSettings) {
          setSeoSettings(data.data.seoSettings);
        }
      }
    } catch (e) {
      console.error("Fetch CMS error:", e);
    }
  };

  useEffect(() => {
    fetchCmsData();
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (
      (loginForm.username.toLowerCase() === "admin" && loginForm.password === "admin123") ||
      (loginForm.username.toLowerCase() === "admin" && loginForm.password === "geeta@2009")
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("gh_admin_auth", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid Admin credentials. Try 'admin' and 'admin123'");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("gh_admin_auth");
  };

  // Save all CMS changes
  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const payload = {
      hospitalProfile,
      announcements,
      doctors: doctorsList,
      gallery: galleryList,
      seoSettings,
    };

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        // Also save to localStorage for client-side persistence
        localStorage.setItem("gh_cms_content", JSON.stringify(payload));
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Error saving CMS:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Add doctor
  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name: newDocForm.name.trim(),
      qualification: newDocForm.qualification.trim(),
      designation: newDocForm.designation.trim(),
      department: newDocForm.department.trim(),
      type: newDocForm.type,
      experience: newDocForm.experience.trim(),
      opdSchedule: newDocForm.opdSchedule.trim(),
      opdTiming: newDocForm.opdTiming.trim(),
      expertise: newDocForm.expertise.split(",").map((s) => s.trim()),
      image: newDocForm.image.trim(),
    };

    setDoctorsList([newDoc, ...doctorsList]);
    setIsAddDocModalOpen(false);
    setNewDocForm({
      name: "",
      qualification: "",
      designation: "",
      department: "",
      type: "full-time",
      experience: "5+ Years",
      opdSchedule: "Monday to Saturday",
      opdTiming: "10:00 AM - 1:30 PM & 5:00 PM - 8:00 PM",
      expertise: "Specialist consultation",
      image: "/images/doctors/dr-kundan-modi.jpg",
    });
  };

  // Delete doctor
  const handleDeleteDoctor = (id: string) => {
    setDoctorsList(doctorsList.filter((d) => d.id !== id));
  };

  // Add gallery photo
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const newPhoto = {
      id: `photo-${Date.now()}`,
      title: newPhotoForm.title.trim(),
      category: newPhotoForm.category,
      src: newPhotoForm.image.trim(),
    };
    setGalleryList([newPhoto, ...galleryList]);
    setIsAddPhotoModalOpen(false);
    setNewPhotoForm({ title: "", category: "Infrastructure", image: "/images/hospital-building.jpg" });
  };

  // Delete gallery photo
  const handleDeletePhoto = (idx: number) => {
    setGalleryList(galleryList.filter((_, i) => i !== idx));
  };

  // Add announcement
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnn = {
      id: `ann-${Date.now()}`,
      title: newAnnForm.title.trim(),
      content: newAnnForm.content.trim(),
      category: newAnnForm.category,
      isActive: true,
      date: new Date().toISOString().split("T")[0],
    };
    setAnnouncements([newAnn, ...announcements]);
    setNewAnnForm({ title: "", content: "", category: "General Notice" });
  };

  // Delete announcement
  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-sky-800 to-teal-800 p-8 text-white text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center">
              <Image src="/images/logo.png" alt="Geeta Hospital" width={48} height={48} className="object-contain" />
            </div>
            <h2 className="text-xl font-black tracking-tight">GEETA HOSPITAL CMS</h2>
            <p className="text-sky-100 text-xs mt-1 font-medium">Hospital Content & Website Management System</p>
          </div>

          <div className="p-8">
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Login to Admin Dashboard</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => {
                  setLoginForm({ username: "admin", password: "admin123" });
                  setTimeout(() => handleLogin(), 100);
                }}
                className="w-full p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs border border-sky-200 transition"
              >
                ⚡ 1-Click Demo Login
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-xs text-sky-600 hover:underline font-semibold">
                ← Return to Public Showcase Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED CMS DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white px-4 sm:px-6 lg:px-8 py-3.5 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                GEETA HOSPITAL
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                ADMIN CMS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md transition active:scale-95 disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save All Changes"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-600/80 hover:bg-red-700 text-white text-xs transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Save Success Toast */}
      {saveSuccess && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>All hospital content, logo, photos, and settings have been saved successfully!</span>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Hospital Profile & Logo</span>
          </button>

          <button
            onClick={() => setActiveTab("doctors")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "doctors"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctors Directory ({doctorsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "gallery"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photo Gallery ({galleryList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("announcements")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "announcements"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Announcements & Camps ({announcements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("seo")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "seo"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>SEO & Meta Tags</span>
          </button>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* TAB 1: HOSPITAL PROFILE & LOGO */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "profile" && (
          <div className="mt-6 space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Hospital Branding, Identity & Logo</h3>
                <p className="text-xs text-slate-500">
                  Update the hospital name, logo URL, bed capacity, and contact numbers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Display Name *</label>
                  <input
                    type="text"
                    value={hospitalProfile.name || ""}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Legal Registered Name</label>
                  <input
                    type="text"
                    value={hospitalProfile.legalName || ""}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, legalName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Logo URL / Image Path *</label>
                  <input
                    type="text"
                    value={hospitalProfile.logoUrl || "/images/logo.png"}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, logoUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bed Capacity & Experience</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 45 Beds"
                      value={hospitalProfile.bedCapacity || "45 Beds"}
                      onChange={(e) => setHospitalProfile({ ...hospitalProfile, bedCapacity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50 font-medium"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 15+ Years"
                      value={hospitalProfile.yearsOfExcellence || "15+"}
                      onChange={(e) => setHospitalProfile({ ...hospitalProfile, yearsOfExcellence: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50 font-medium"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={hospitalProfile.tagline || ""}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Showcase Description</label>
                  <textarea
                    rows={3}
                    value={hospitalProfile.description || ""}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>
              </div>
            </div>

            {/* Contact & Location Settings */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Hospital Contact & Emergency Lines</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">24x7 Emergency Phone *</label>
                  <input
                    type="text"
                    value={hospitalProfile.phone || ""}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, phone: e.target.value, emergencyPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50 font-semibold text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official WhatsApp Number *</label>
                  <input
                    type="text"
                    value={hospitalProfile.whatsappNumber || ""}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50 font-semibold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={hospitalProfile.email || ""}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Physical Address</label>
                  <input
                    type="text"
                    value={hospitalProfile.address?.fullAddress || "3, Ambe Nagar, Gundala Road, Baroi-Mundra, Kutch"}
                    onChange={(e) =>
                      setHospitalProfile({
                        ...hospitalProfile,
                        address: { ...hospitalProfile.address, fullAddress: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Google Maps Link</label>
                  <input
                    type="text"
                    value={hospitalProfile.googleMapsUrl || "https://maps.google.com/?q=Geeta+Hospital+Mundra"}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, googleMapsUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 2: DOCTORS DIRECTORY */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "doctors" && (
          <div className="mt-6 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Hospital Doctors & Visiting Specialists</h3>
                <p className="text-xs text-slate-500">Manage names, qualifications, photos, and OPD timetables.</p>
              </div>

              <button
                onClick={() => setIsAddDocModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add New Doctor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctorsList.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 relative group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                      {doc.image ? (
                        <Image src={doc.image} alt={doc.name} fill className="object-cover object-top" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-sky-100 text-sky-700 font-bold text-xl">
                          {doc.name[0]}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          doc.type === "full-time" ? "bg-emerald-100 text-emerald-800" : "bg-sky-100 text-sky-800"
                        }`}
                      >
                        {doc.type === "full-time" ? "Resident Doctor" : "Visiting Specialist"}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{doc.name}</h4>
                      <p className="text-xs text-sky-800 font-medium">{doc.qualification}</p>
                      <p className="text-xs text-slate-500">{doc.department}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-0.5">
                    <p className="font-semibold text-slate-800">Schedule: {doc.opdSchedule}</p>
                    <p className="text-[11px] text-slate-500">{doc.opdTiming}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">{doc.experience} Exp</span>
                    <button
                      onClick={() => handleDeleteDoctor(doc.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                      title="Delete doctor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 3: PHOTO GALLERY */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "gallery" && (
          <div className="mt-6 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Hospital Photo Gallery CMS</h3>
                <p className="text-xs text-slate-500">Showcase operation theatres, camps, ICU, and facilities.</p>
              </div>

              <button
                onClick={() => setIsAddPhotoModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add Photo to Gallery</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryList.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs group">
                  <div className="relative h-44 w-full bg-slate-100">
                    <Image src={item.src} alt={item.title} fill className="object-cover group-hover:scale-105 transition duration-300" />
                    <button
                      onClick={() => handleDeletePhoto(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white opacity-0 group-hover:opacity-100 transition shadow-md"
                      title="Remove from gallery"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 4: ANNOUNCEMENTS & HEALTH CAMPS */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "announcements" && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {/* Create Announcement */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Post New Medical Camp or Hospital Notice</h3>
              <form onSubmit={handleAddAnnouncement} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Free Mega Gynecology & Sonography Camp"
                      value={newAnnForm.title}
                      onChange={(e) => setNewAnnForm({ ...newAnnForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={newAnnForm.category}
                      onChange={(e) => setNewAnnForm({ ...newAnnForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50"
                    >
                      <option value="General Notice">General Notice</option>
                      <option value="Camp">Health Camp</option>
                      <option value="Emergency">Emergency Update</option>
                      <option value="TPA / Cashless">TPA / Cashless Mediclaim</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Details *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Details about date, timing, participating doctors, or emergency service..."
                    value={newAnnForm.content}
                    onChange={(e) => setNewAnnForm({ ...newAnnForm, content: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Publish Announcement
                </button>
              </form>
            </div>

            {/* List Announcements */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800">Active Hospital Notices ({announcements.length})</h4>
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{ann.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                        {ann.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{ann.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{ann.content}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition"
                    title="Delete notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 5: SEO & META SETTINGS */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "seo" && (
          <div className="mt-6 space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Hospital Showcase Search Engine Optimization (SEO)</h3>
                <p className="text-xs text-slate-500">
                  Configure high-ranking meta title, description, and local search keywords for Google, Bing, and WhatsApp previews.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Google Search Meta Title (50 - 65 characters)
                  </label>
                  <input
                    type="text"
                    value={seoSettings.title || ""}
                    onChange={(e) => setSeoSettings({ ...seoSettings, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50 font-semibold"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Current Length: {seoSettings.title?.length || 0} characters
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Google Search Meta Description (150 - 160 characters)
                  </label>
                  <textarea
                    rows={3}
                    value={seoSettings.description || ""}
                    onChange={(e) => setSeoSettings({ ...seoSettings, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Current Length: {seoSettings.description?.length || 0} characters
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target High-Intent Search Keywords (Comma separated)
                  </label>
                  <textarea
                    rows={2}
                    value={seoSettings.keywords || ""}
                    onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50 font-mono"
                  />
                </div>

                {/* Google Search Snippet Preview */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Google Search Snippet Preview
                  </span>
                  <div className="space-y-1">
                    <span className="text-xs text-emerald-700 font-mono block">
                      https://geetahospitalmundra.com
                    </span>
                    <h4 className="text-base text-blue-700 hover:underline font-semibold cursor-pointer leading-snug">
                      {seoSettings.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {seoSettings.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: ADD NEW DOCTOR */}
      {/* ------------------------------------------------------------- */}
      {isAddDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-800 to-teal-800 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Add New Doctor to Faculty</h3>
                <p className="text-sky-100 text-xs">Profile will be showcased on the hospital website</p>
              </div>
              <button
                onClick={() => setIsAddDocModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="p-6 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Patel"
                    value={newDocForm.name}
                    onChange={(e) => setNewDocForm({ ...newDocForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Qualifications *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M.B.B.S., M.D."
                    value={newDocForm.qualification}
                    onChange={(e) => setNewDocForm({ ...newDocForm, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cardiology"
                    value={newDocForm.department}
                    onChange={(e) => setNewDocForm({ ...newDocForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type *</label>
                  <select
                    value={newDocForm.type}
                    onChange={(e) => setNewDocForm({ ...newDocForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  >
                    <option value="full-time">Full-Time Resident</option>
                    <option value="visiting">Visiting Super-Specialist</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Consultant Gynecologist"
                  value={newDocForm.designation}
                  onChange={(e) => setNewDocForm({ ...newDocForm, designation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">OPD Schedule</label>
                  <input
                    type="text"
                    placeholder="e.g. Monday to Saturday"
                    value={newDocForm.opdSchedule}
                    onChange={(e) => setNewDocForm({ ...newDocForm, opdSchedule: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">OPD Timings</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM - 1:00 PM"
                    value={newDocForm.opdTiming}
                    onChange={(e) => setNewDocForm({ ...newDocForm, opdTiming: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Photo Image URL / Path</label>
                <input
                  type="text"
                  placeholder="e.g. /images/doctors/dr-kundan-modi.jpg or https://..."
                  value={newDocForm.image}
                  onChange={(e) => setNewDocForm({ ...newDocForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Key Clinical Expertise (comma separated)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. High risk delivery, 3D USG scan, Laparoscopic surgery"
                  value={newDocForm.expertise}
                  onChange={(e) => setNewDocForm({ ...newDocForm, expertise: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Add Doctor to Website
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddDocModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: ADD GALLERY PHOTO */}
      {/* ------------------------------------------------------------- */}
      {isAddPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-800 to-teal-800 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Add Photo to Gallery</h3>
                <p className="text-sky-100 text-xs">Showcase hospital facilities and medical events</p>
              </div>
              <button
                onClick={() => setIsAddPhotoModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPhoto} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Modular Operation Theatre"
                  value={newPhotoForm.title}
                  onChange={(e) => setNewPhotoForm({ ...newPhotoForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={newPhotoForm.category}
                  onChange={(e) => setNewPhotoForm({ ...newPhotoForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50 font-medium"
                >
                  <option value="Infrastructure">Infrastructure & Building</option>
                  <option value="ICU & OTs">ICU & Operation Theatres</option>
                  <option value="Facilities">Medical Facilities & Labs</option>
                  <option value="Camps & Seminars">Health Camps & Seminars</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL or Local Path *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /images/operation-theatre-1.jpg or https://..."
                  value={newPhotoForm.image}
                  onChange={(e) => setNewPhotoForm({ ...newPhotoForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50 font-mono"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Add to Gallery
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddPhotoModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
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
  Edit2,
  Upload,
  ShieldCheck,
  HelpCircle,
  Activity,
  Layers,
  Briefcase,
  Clock,
  ChevronRight,
  Eye,
  RefreshCw,
  Sliders,
  Cloud,
  Database,
  Key,
} from "lucide-react";
import {
  DOCTORS,
  Doctor,
  HOSPITAL_INFO,
  GALLERY_ITEMS,
  SERVICES,
  ServiceItem,
  INSURANCE_PARTNERS,
  InsurancePartner,
  FAQS,
  getDoctorImageUrl,
  getDoctorGender,
  DEFAULT_DOCTOR_IMAGES,
} from "@/data/hospitalData";
import { useCms } from "@/context/CmsContext";

export default function AdminClient() {
  const { updateLocalCms } = useCms();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "admin123" });
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "profile" | "doctors" | "services" | "partners" | "gallery" | "announcements" | "faqs" | "seo" | "storage"
  >("profile");

  // CMS Content State
  const [hospitalProfile, setHospitalProfile] = useState<any>(HOSPITAL_INFO);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(DOCTORS);
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES);
  const [partnersList, setPartnersList] = useState<InsurancePartner[]>(INSURANCE_PARTNERS);
  const [galleryList, setGalleryList] = useState<any[]>(GALLERY_ITEMS);
  const [announcementsList, setAnnouncementsList] = useState<any[]>([]);
  const [faqsList, setFaqsList] = useState<any[]>(FAQS);
  const [seoSettings, setSeoSettings] = useState({
    title: "Geeta Multi-Speciality Hospital Mundra | 24x7 Emergency & Critical Care",
    description: "Premier 45-bed multi-speciality hospital in Mundra (Kutch). 24x7 Emergency, Gynecology, Pediatrics, Adult & Neonatal ICU, Orthopedics, Cashless Mediclaim. ISO 9001:2015 & ROHINI registered.",
    keywords: "Hospital in Mundra, Geeta Hospital Mundra, Emergency hospital Mundra, Gynecologist in Mundra, Pediatrician Mundra, ICU hospital Kutch, Dr Kundan Modi, Cashless mediclaim hospital Mundra",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadLoading, setUploadLoading] = useState<string | null>(null);

  // File Input References
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const heroBannerInputRef = useRef<HTMLInputElement>(null);
  const doctorPhotoInputRef = useRef<HTMLInputElement>(null);
  const partnerLogoInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  // Search & Filter
  const [doctorSearch, setDoctorSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [partnerSearch, setPartnerSearch] = useState("");

  // Doctor Modal State
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docModalMode, setDocModalMode] = useState<"add" | "edit">("add");
  const [docForm, setDocForm] = useState<Doctor>({
    id: "",
    name: "",
    qualification: "",
    designation: "",
    department: "",
    type: "full-time",
    experience: "5+ Years",
    opdSchedule: "Monday to Saturday",
    opdTiming: "10:00 AM - 1:30 PM & 5:00 PM - 8:00 PM",
    expertise: ["General Consultation"],
    image: "/images/doctors/dr-kundan-modi.jpg",
    contactNumber: "+91 78743 81551",
    bio: "",
  });

  // Service Modal State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceModalMode, setServiceModalMode] = useState<"add" | "edit">("add");
  const [serviceForm, setServiceForm] = useState<ServiceItem>({
    id: "",
    title: "",
    category: "Critical Care",
    description: "",
    shortDescription: "",
    iconName: "Stethoscope",
    features: ["24x7 Medical Supervision"],
    isEmergency24x7: false,
  });
  const [serviceFeaturesInput, setServiceFeaturesInput] = useState("");

  // Partner Modal State
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [partnerModalMode, setPartnerModalMode] = useState<"add" | "edit">("add");
  const [partnerForm, setPartnerForm] = useState<InsurancePartner>({
    name: "",
    type: "Corporate",
    logoText: "",
    image: "/images/partners/adani.svg",
  });

  // Gallery Modal State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryModalMode, setGalleryModalMode] = useState<"add" | "edit">("add");
  const [galleryForm, setGalleryForm] = useState({
    id: "",
    title: "",
    category: "Infrastructure",
    image: "/images/hospital-building.jpg",
    description: "",
  });

  // Announcement Modal State
  const [annModalOpen, setAnnModalOpen] = useState(false);
  const [annModalMode, setAnnModalMode] = useState<"add" | "edit">("add");
  const [annForm, setAnnForm] = useState({
    id: "",
    title: "",
    content: "",
    category: "Emergency",
    isActive: true,
    date: new Date().toISOString().split("T")[0],
  });

  // FAQ Modal State
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [faqModalMode, setFaqModalMode] = useState<"add" | "edit">("add");
  const [faqForm, setFaqForm] = useState({
    index: -1,
    question: "",
    answer: "",
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

  // Fetch CMS data safely
  const fetchCmsData = async () => {
    try {
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        return;
      }
      if (data && data.success && data.data) {
        if (data.data.hospitalProfile) {
          setHospitalProfile((prev: any) => ({ ...prev, ...data.data.hospitalProfile }));
        }
        if (data.data.doctors && data.data.doctors.length > 0) {
          setDoctorsList(data.data.doctors);
        }
        if (data.data.services && data.data.services.length > 0) {
          setServicesList(data.data.services);
        }
        if (data.data.partners && data.data.partners.length > 0) {
          setPartnersList(data.data.partners);
        }
        if (data.data.gallery && data.data.gallery.length > 0) {
          setGalleryList(data.data.gallery);
        }
        if (data.data.announcements && Array.isArray(data.data.announcements)) {
          setAnnouncementsList(data.data.announcements);
        }
        if (data.data.faqs && data.data.faqs.length > 0) {
          setFaqsList(data.data.faqs);
        }
        if (data.data.seoSettings) {
          setSeoSettings(data.data.seoSettings);
        }
      }
    } catch (e) {
      console.error("Fetch CMS error:", e);
    }
  };

  // Cloudinary Storage State
  const [storageConfig, setStorageConfig] = useState({
    cloudName: "",
    apiKey: "",
    apiSecret: "",
    folder: "geeta-hospital",
  });
  const [isCloudinaryActive, setIsCloudinaryActive] = useState(false);
  const [storageLoading, setStorageLoading] = useState(false);
  const [storageTesting, setStorageTesting] = useState(false);
  const [storageStatusMsg, setStorageStatusMsg] = useState("");

  const fetchStorageStatus = async () => {
    try {
      const res = await fetch("/api/admin/storage");
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); } catch { return; }
      if (data && data.success) {
        setIsCloudinaryActive(data.configured);
        if (data.settings) {
          setStorageConfig((prev) => ({
            ...prev,
            cloudName: data.settings.cloudName || "",
            apiKey: data.settings.apiKey || "",
            folder: data.settings.folder || "geeta-hospital",
          }));
        }
      }
    } catch (e) {
      console.warn("Storage status fetch error:", e);
    }
  };

  useEffect(() => {
    fetchCmsData();
    fetchStorageStatus();
  }, []);

  const handleSaveStorageConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setStorageLoading(true);
    setStorageStatusMsg("");
    try {
      const res = await fetch("/api/admin/storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-config",
          ...storageConfig,
        }),
      });
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); } catch { data = { success: false, error: text }; }
      if (data.success) {
        setIsCloudinaryActive(Boolean(data.connected));
        setStorageStatusMsg(
          data.connected
            ? "Cloudinary connected successfully! All new uploads will stream to Cloudinary CDN."
            : "Saved settings, but connection test failed: " + (data.connectionError || "Unknown error")
        );
        fetchStorageStatus();
      } else {
        alert("Failed to save storage settings: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Network error saving storage settings: " + err.message);
    } finally {
      setStorageLoading(false);
    }
  };

  const handleTestCloudinary = async () => {
    setStorageTesting(true);
    setStorageStatusMsg("");
    try {
      const res = await fetch("/api/admin/storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" }),
      });
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); } catch { data = { success: false, error: text }; }
      if (data.success) {
        setIsCloudinaryActive(true);
        setStorageStatusMsg("Cloudinary ping successful! Connected to cloud: " + data.cloudName);
      } else {
        setIsCloudinaryActive(false);
        setStorageStatusMsg("Cloudinary test failed: " + (data.error || "Please verify credentials."));
      }
    } catch (err: any) {
      setStorageStatusMsg("Network error during test: " + err.message);
    } finally {
      setStorageTesting(false);
    }
  };

  const handleClearStorage = async () => {
    const confirmed = confirm(
      "Are you sure you want to empty Cloudinary storage and reset all website media?\n\nThis will permanently delete all uploaded files from your Cloudinary folder and reset all images back to official hospital baseline defaults."
    );
    if (!confirmed) return;

    setStorageLoading(true);
    try {
      const res = await fetch("/api/admin/storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear-storage" }),
      });
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); } catch { data = { success: false, error: text }; }
      if (data.success) {
        alert(data.message + (data.deletedCount ? ` (${data.deletedCount} files purged from Cloudinary)` : ""));
        await fetchCmsData();
        updateLocalCms({
          hospitalProfile: {
            ...hospitalProfile,
            logoUrl: "/images/logo.png",
            faviconUrl: "/favicon-32.png",
            heroBannerUrl: "/images/hero-banner-1.jpg",
          },
        });
      } else {
        alert("Could not clear storage: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error clearing storage: " + err.message);
    } finally {
      setStorageLoading(false);
    }
  };

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
      setLoginError("Invalid Admin credentials. Try username 'admin' and password 'admin123'");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("gh_admin_auth");
  };

  // Helper to re-compress any oversized Base64 DataURLs before saving to avoid Vercel 4.5MB limit
  const shrinkDataUrlIfNeeded = async (dataUrl: string, maxDim: number = 500, quality: number = 0.82): Promise<string> => {
    if (!dataUrl || !dataUrl.startsWith("data:image/") || dataUrl.length < 200 * 1024) {
      return dataUrl;
    }
    return new Promise((resolve) => {
      const img = new (window as any).Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(dataUrl);

        ctx.drawImage(img, 0, 0, width, height);

        let outMime = "image/jpeg";
        try {
          if (canvas.toDataURL("image/webp").startsWith("data:image/webp")) {
            outMime = "image/webp";
          }
        } catch {
          outMime = "image/jpeg";
        }

        const compressed = canvas.toDataURL(outMime, quality);
        resolve(compressed.length < dataUrl.length ? compressed : dataUrl);
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  // High-performance client-side image compressor:
  // Aggressively downsizes and converts images to WebP/JPEG/PNG so payloads remain tiny (< 150KB per image).
  const compressImageIfNeeded = async (file: File, type: string): Promise<File> => {
    // SVGs are vector; if small, keep as is
    if (
      (file.type === "image/svg+xml" || file.name.endsWith(".svg")) &&
      file.size < 300 * 1024
    ) {
      return file;
    }

    // Determine target dimension and quality based on upload category
    let maxDim = 800;
    let targetQuality = 0.8;
    let preferPng = false;

    if (type === "favicon") {
      maxDim = 64;
      targetQuality = 0.9;
      preferPng = true;
    } else if (type === "logo" || type === "partner") {
      maxDim = 400;
      targetQuality = 0.85;
      preferPng = file.type === "image/png" || file.type.includes("icon") || file.name.endsWith(".png");
    } else if (type === "doctor") {
      maxDim = 500;
      targetQuality = 0.82;
      preferPng = false;
    } else if (type === "banner" || type === "campus") {
      maxDim = 1200;
      targetQuality = 0.8;
      preferPng = false;
    } else if (type === "gallery") {
      maxDim = 1000;
      targetQuality = 0.8;
      preferPng = false;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new (window as any).Image();
        img.onload = () => {
          let { width, height } = img;

          // Scale dimensions proportionally if larger than maxDim
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(file);

          if (!preferPng) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Determine optimal output format (WebP has universal modern support and 40% smaller size)
          let outMime = "image/jpeg";
          if (preferPng) {
            outMime = "image/png";
          } else {
            try {
              if (canvas.toDataURL("image/webp").startsWith("data:image/webp")) {
                outMime = "image/webp";
              }
            } catch {
              outMime = "image/jpeg";
            }
          }

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const ext = outMime === "image/png" ? ".png" : outMime === "image/webp" ? ".webp" : ".jpg";
                const baseName = (file.name || "upload").substring(0, (file.name || "upload").lastIndexOf(".")) || "image";
                const compressedFile = new File([blob], `${baseName}${ext}`, {
                  type: outMime,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            outMime,
            targetQuality
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  // Generic File Upload Handler
  const handleFileUpload = async (rawFile: File, type: string): Promise<string | null> => {
    if (!rawFile) return null;

    // Hard client-side limit check to prevent Vercel 413 "Request Entity Too Large"
    if (rawFile.size > 15 * 1024 * 1024) {
      alert("Selected image is too large (" + (rawFile.size / (1024 * 1024)).toFixed(1) + " MB). Please select an image under 15 MB.");
      return null;
    }

    setUploadLoading(type);
    try {
      const file = await compressImageIfNeeded(rawFile, type);

      if (file.size > 3.8 * 1024 * 1024) {
        alert("Compressed file size is " + (file.size / (1024 * 1024)).toFixed(1) + " MB, which exceeds the serverless limit of 3.8 MB. Please select a smaller photo or connect Cloudinary in the Cloud Media Storage tab.");
        return null;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        if (res.status === 413 || text.toLowerCase().includes("entity too large")) {
          alert("Upload request exceeded server payload capacity (413). Please compress your image or connect Cloudinary storage in the Cloud Media tab.");
          return null;
        }
        alert("Upload server returned (" + res.status + "): " + (text.slice(0, 150) || "Unknown error"));
        return null;
      }

      if (res.ok && data.success && (data.url || data.dataUrl)) {
        return data.url || data.dataUrl;
      } else {
        alert("Upload error: " + (data.error || "Failed to upload file"));
        return null;
      }
    } catch (err: any) {
      console.error("File upload error:", err);
      alert("Error while uploading file: " + err.message);
      return null;
    } finally {
      setUploadLoading(null);
    }
  };

  // Direct Upload for Logo
  const onLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await handleFileUpload(file, "logo");
    if (url) {
      const updated = { ...hospitalProfile, logoUrl: url };
      setHospitalProfile(updated);
      handleSaveAll({ hospitalProfile: updated });
    }
  };

  // Direct Upload for Favicon
  const onFaviconFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await handleFileUpload(file, "favicon");
    if (url) {
      const updated = { ...hospitalProfile, faviconUrl: url };
      setHospitalProfile(updated);
      handleSaveAll({ hospitalProfile: updated });
    }
  };

  // Direct Upload for Hero Banner
  const onHeroBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await handleFileUpload(file, "banner");
    if (url) {
      const updated = { ...hospitalProfile, heroBannerUrl: url };
      setHospitalProfile(updated);
      handleSaveAll({ hospitalProfile: updated });
    }
  };

  // Save all CMS changes with payload sanitization and safe error handling
  const handleSaveAll = async (overridePayload?: any) => {
    setIsSaving(true);
    setSaveSuccess(false);

    const basePayload = {
      hospitalProfile,
      doctors: doctorsList,
      services: servicesList,
      partners: partnersList,
      gallery: galleryList,
      announcements: announcementsList,
      faqs: faqsList,
      seoSettings,
      ...(overridePayload || {}),
    };

    // Deep copy payload to sanitize
    const payload = JSON.parse(JSON.stringify(basePayload));

    // Shrink any oversized data URLs before sending over network
    try {
      if (payload.hospitalProfile?.logoUrl?.startsWith("data:") && payload.hospitalProfile.logoUrl.length > 200 * 1024) {
        payload.hospitalProfile.logoUrl = await shrinkDataUrlIfNeeded(payload.hospitalProfile.logoUrl, 400, 0.85);
      }
      if (payload.hospitalProfile?.faviconUrl?.startsWith("data:") && payload.hospitalProfile.faviconUrl.length > 80 * 1024) {
        payload.hospitalProfile.faviconUrl = await shrinkDataUrlIfNeeded(payload.hospitalProfile.faviconUrl, 64, 0.9);
      }
      if (payload.hospitalProfile?.heroBannerUrl?.startsWith("data:") && payload.hospitalProfile.heroBannerUrl.length > 300 * 1024) {
        payload.hospitalProfile.heroBannerUrl = await shrinkDataUrlIfNeeded(payload.hospitalProfile.heroBannerUrl, 1200, 0.8);
      }
      if (Array.isArray(payload.doctors)) {
        for (const doc of payload.doctors) {
          if (doc.image?.startsWith("data:") && doc.image.length > 180 * 1024) {
            doc.image = await shrinkDataUrlIfNeeded(doc.image, 400, 0.8);
          }
        }
      }
      if (Array.isArray(payload.partners)) {
        for (const p of payload.partners) {
          if (p.image?.startsWith("data:") && p.image.length > 120 * 1024) {
            p.image = await shrinkDataUrlIfNeeded(p.image, 300, 0.85);
          }
        }
      }
      if (Array.isArray(payload.gallery)) {
        for (const g of payload.gallery) {
          if (g.image?.startsWith("data:") && g.image.length > 250 * 1024) {
            g.image = await shrinkDataUrlIfNeeded(g.image, 800, 0.8);
          }
        }
      }
    } catch (e) {
      console.warn("Payload sanitization warning:", e);
    }

    try {
      const jsonString = JSON.stringify(payload);
      if (jsonString.length > 3.8 * 1024 * 1024) {
        alert("Cannot save: Total website data is too large (" + (jsonString.length / (1024 * 1024)).toFixed(1) + " MB). Please re-upload your images using smaller photos.");
        setIsSaving(false);
        return;
      }

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonString,
      });

      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        if (res.status === 413 || text.toLowerCase().includes("entity too large")) {
          alert("Cannot save: Request exceeded server capacity (413). Please compress your images.");
          return;
        }
        alert("Server returned error (" + res.status + "): " + (text.slice(0, 150) || "Failed to parse server response"));
        return;
      }

      if (data.success) {
        setSaveSuccess(true);
        updateLocalCms(payload);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert("Could not save changes: " + (data.error || "Unknown server error"));
      }
    } catch (err: any) {
      console.error("Error saving CMS:", err);
      alert("Network error saving changes: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ==================== DOCTORS CRUD ====================
  const openAddDoctorModal = () => {
    setDocModalMode("add");
    setDocForm({
      id: `doc-${Date.now()}`,
      name: "",
      qualification: "",
      designation: "",
      department: "",
      type: "full-time",
      experience: "5+ Years",
      opdSchedule: "Monday to Saturday",
      opdTiming: "10:00 AM - 1:30 PM & 5:00 PM - 8:00 PM",
      expertise: ["General Consultation"],
      image: "/images/doctors/dr-kundan-modi.jpg",
      contactNumber: "+91 78743 81551",
      bio: "",
    });
    setDocModalOpen(true);
  };

  const openEditDoctorModal = (doc: Doctor) => {
    setDocModalMode("edit");
    setDocForm({ ...doc });
    setDocModalOpen(true);
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.name.trim()) return alert("Please enter Doctor Name");

    let updated: Doctor[];
    if (docModalMode === "add") {
      const newDoc: Doctor = {
        ...docForm,
        id: docForm.id || `doc-${Date.now()}`,
      };
      updated = [newDoc, ...doctorsList];
    } else {
      updated = doctorsList.map((d) => (d.id === docForm.id ? { ...docForm } : d));
    }
    setDoctorsList(updated);
    setDocModalOpen(false);
    handleSaveAll({ doctors: updated });
  };

  const handleDeleteDoctor = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from doctors roster?`)) {
      const updated = doctorsList.filter((d) => d.id !== id);
      setDoctorsList(updated);
      handleSaveAll({ doctors: updated });
    }
  };

  // ==================== SERVICES CRUD ====================
  const openAddServiceModal = () => {
    setServiceModalMode("add");
    setServiceForm({
      id: `srv-${Date.now()}`,
      title: "",
      category: "Critical Care",
      description: "",
      shortDescription: "",
      iconName: "Stethoscope",
      features: ["24x7 Emergency Supervision"],
      isEmergency24x7: false,
    });
    setServiceFeaturesInput("24x7 Medical Supervision\nSpecialist doctor on duty");
    setServiceModalOpen(true);
  };

  const openEditServiceModal = (srv: ServiceItem) => {
    setServiceModalMode("edit");
    setServiceForm({ ...srv });
    setServiceFeaturesInput((srv.features || []).join("\n"));
    setServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title.trim()) return alert("Please enter Service Title");

    const features = serviceFeaturesInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const itemToSave: ServiceItem = {
      ...serviceForm,
      features: features.length > 0 ? features : ["24x7 Care"],
      shortDescription: serviceForm.shortDescription || serviceForm.description.slice(0, 100),
    };

    let updated: ServiceItem[];
    if (serviceModalMode === "add") {
      updated = [...servicesList, itemToSave];
    } else {
      updated = servicesList.map((s) => (s.id === itemToSave.id ? itemToSave : s));
    }

    setServicesList(updated);
    setServiceModalOpen(false);
    handleSaveAll({ services: updated });
  };

  const handleDeleteService = (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove the service "${title}"?`)) {
      const updated = servicesList.filter((s) => s.id !== id);
      setServicesList(updated);
      handleSaveAll({ services: updated });
    }
  };

  // ==================== PARTNERS CRUD ====================
  const openAddPartnerModal = () => {
    setPartnerModalMode("add");
    setPartnerForm({
      name: "",
      type: "Corporate",
      logoText: "",
      image: "/images/partners/adani.svg",
    });
    setPartnerModalOpen(true);
  };

  const openEditPartnerModal = (partner: InsurancePartner) => {
    setPartnerModalMode("edit");
    setPartnerForm({ ...partner });
    setPartnerModalOpen(true);
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name.trim()) return alert("Please enter Partner Name");

    let updated: InsurancePartner[];
    if (partnerModalMode === "add") {
      updated = [...partnersList, { ...partnerForm }];
    } else {
      updated = partnersList.map((p) =>
        p.name.toLowerCase() === partnerForm.name.toLowerCase() || p === partnerForm
          ? { ...partnerForm }
          : p
      );
    }
    setPartnersList(updated);
    setPartnerModalOpen(false);
    handleSaveAll({ partners: updated });
  };

  const handleDeletePartner = (name: string) => {
    if (confirm(`Are you sure you want to remove tie-up partner "${name}"?`)) {
      const updated = partnersList.filter((p) => p.name !== name);
      setPartnersList(updated);
      handleSaveAll({ partners: updated });
    }
  };

  // ==================== GALLERY CRUD ====================
  const openAddGalleryModal = () => {
    setGalleryModalMode("add");
    setGalleryForm({
      id: `img-${Date.now()}`,
      title: "",
      category: "Infrastructure",
      image: "/images/hospital-building.jpg",
      description: "",
    });
    setGalleryModalOpen(true);
  };

  const openEditGalleryModal = (item: any) => {
    setGalleryModalMode("edit");
    setGalleryForm({ ...item });
    setGalleryModalOpen(true);
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title.trim()) return alert("Please enter Photo Title");

    let updated: any[];
    if (galleryModalMode === "add") {
      updated = [galleryForm, ...galleryList];
    } else {
      updated = galleryList.map((item) => (item.id === galleryForm.id ? { ...galleryForm } : item));
    }
    setGalleryList(updated);
    setGalleryModalOpen(false);
    handleSaveAll({ gallery: updated });
  };

  const handleDeleteGallery = (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove photo "${title}"?`)) {
      const updated = galleryList.filter((item) => item.id !== id);
      setGalleryList(updated);
      handleSaveAll({ gallery: updated });
    }
  };

  // ==================== ANNOUNCEMENTS CRUD ====================
  const openAddAnnouncementModal = () => {
    setAnnModalMode("add");
    setAnnForm({
      id: `ann-${Date.now()}`,
      title: "",
      content: "",
      category: "Emergency",
      isActive: true,
      date: new Date().toISOString().split("T")[0],
    });
    setAnnModalOpen(true);
  };

  const openEditAnnouncementModal = (ann: any) => {
    setAnnModalMode("edit");
    setAnnForm({ ...ann });
    setAnnModalOpen(true);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annForm.title.trim()) return alert("Please enter Announcement Title");

    let updated: any[];
    if (annModalMode === "add") {
      updated = [annForm, ...announcementsList];
    } else {
      updated = announcementsList.map((a) => (a.id === annForm.id ? { ...annForm } : a));
    }
    setAnnouncementsList(updated);
    setAnnModalOpen(false);
    handleSaveAll({ announcements: updated });
  };

  const handleToggleAnnActive = (id: string) => {
    const updated = announcementsList.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a));
    setAnnouncementsList(updated);
    handleSaveAll({ announcements: updated });
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      const updated = announcementsList.filter((a) => a.id !== id);
      setAnnouncementsList(updated);
      handleSaveAll({ announcements: updated });
    }
  };

  // ==================== FAQS CRUD ====================
  const openAddFaqModal = () => {
    setFaqModalMode("add");
    setFaqForm({ index: -1, question: "", answer: "" });
    setFaqModalOpen(true);
  };

  const openEditFaqModal = (faq: any, index: number) => {
    setFaqModalMode("edit");
    setFaqForm({ index, question: faq.question, answer: faq.answer });
    setFaqModalOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question.trim()) return alert("Please enter Question");
    if (!faqForm.answer.trim()) return alert("Please enter Answer");

    let updated: any[];
    if (faqModalMode === "add") {
      updated = [...faqsList, { question: faqForm.question, answer: faqForm.answer }];
    } else {
      updated = faqsList.map((f, idx) =>
        idx === faqForm.index ? { question: faqForm.question, answer: faqForm.answer } : f
      );
    }
    setFaqsList(updated);
    setFaqModalOpen(false);
    handleSaveAll({ faqs: updated });
  };

  const handleDeleteFaq = (index: number) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      const updated = faqsList.filter((_, idx) => idx !== index);
      setFaqsList(updated);
      handleSaveAll({ faqs: updated });
    }
  };

  // Filtered Lists
  const filteredDoctors = doctorsList.filter(
    (d) =>
      d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      d.department.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      d.qualification.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const filteredServices = servicesList.filter(
    (s) =>
      s.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const filteredPartners = partnersList.filter((p) =>
    p.name.toLowerCase().includes(partnerSearch.toLowerCase())
  );

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100">
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Hospital CMS Admin</h1>
              <p className="text-xs text-slate-500 mt-1">
                Geeta Hospital Mundra • Master Content Control
              </p>
            </div>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Username
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-sm"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-sm"
                placeholder="admin123"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm shadow-lg shadow-sky-700/20 transition active:scale-98"
            >
              Sign In to Admin Panel
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Hospital Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white p-1">
              <Image
                src={hospitalProfile.logoUrl || "/images/logo.png"}
                alt="Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-wide text-white uppercase">
                  {hospitalProfile.name || "Geeta Hospital"}
                </span>
                <span className="bg-sky-500 text-[10px] font-bold px-2 py-0.5 rounded text-white tracking-widest uppercase">
                  Admin CMS
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                Master Website Customizer • Live Sync Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </Link>

            <button
              onClick={() => handleSaveAll()}
              disabled={isSaving}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition ${
                saveSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-sky-600 hover:bg-sky-500 text-white active:scale-95"
              }`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Changes Saved Live!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar Tabs */}
        <aside className="lg:w-64 shrink-0 bg-white rounded-2xl p-3 border border-slate-200 shadow-xs h-fit space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Website Modules
          </div>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "profile"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4" />
              <span>Logo &amp; Hospital Info</span>
            </div>
            {hospitalProfile.logoUrl && <CheckCircle2 className="w-3.5 h-3.5 opacity-60" />}
          </button>

          <button
            onClick={() => setActiveTab("doctors")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "doctors"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Stethoscope className="w-4 h-4" />
              <span>Doctors Roster</span>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {doctorsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "services"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>Services &amp; Depts</span>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {servicesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("partners")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "partners"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4" />
              <span>Cashless Partners</span>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {partnersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "gallery"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4" />
              <span>Photo Gallery</span>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {galleryList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("announcements")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "announcements"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4" />
              <span>Notice &amp; Camps</span>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {announcementsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("faqs")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "faqs"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4" />
              <span>FAQs Editor</span>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {faqsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("seo")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "seo"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4" />
              <span>SEO &amp; Meta Tags</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("storage")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "storage"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Cloud className="w-4 h-4" />
              <span>Cloud Storage (CDN)</span>
            </div>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                isCloudinaryActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
              }`}
            >
              {isCloudinaryActive ? "Cloudinary" : "Setup"}
            </span>
          </button>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => handleSaveAll()}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Website</span>
            </button>
          </div>
        </aside>

        {/* Tab Content Body */}
        <main className="flex-grow bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs min-h-[600px]">
          {/* ======================================================== */}
          {/* 1. BRANDING & HOSPITAL INFO TAB */}
          {/* ======================================================== */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-black text-slate-900">Hospital Branding &amp; Profile</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload your hospital logo, favicon, campus banner, and update general contact info.
                </p>
              </div>

              {/* Direct File Uploads Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                {/* Logo Upload Card */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    1. Main Logo
                  </span>
                  <div className="relative w-full h-28 rounded-xl border border-slate-300 bg-white flex items-center justify-center p-3 overflow-hidden shadow-xs">
                    <Image
                      src={hospitalProfile.logoUrl || "/images/logo.png"}
                      alt="Logo Preview"
                      width={180}
                      height={70}
                      className="object-contain max-h-24 w-auto"
                      unoptimized
                    />
                  </div>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={onLogoFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadLoading === "logo"}
                    className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadLoading === "logo" ? "Uploading..." : "Upload / Replace Logo"}</span>
                  </button>
                  <p className="text-[10px] text-slate-500 text-center">PNG, SVG or JPG (Recommended: Transparent)</p>
                </div>

                {/* Favicon Upload Card */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    2. Browser Favicon
                  </span>
                  <div className="relative w-full h-28 rounded-xl border border-slate-300 bg-white flex flex-col items-center justify-center p-3 overflow-hidden shadow-xs">
                    <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 p-1 flex items-center justify-center">
                      <Image
                        src={hospitalProfile.faviconUrl || "/favicon-32.png"}
                        alt="Favicon Preview"
                        width={32}
                        height={32}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-2 font-mono truncate max-w-[90%]">
                      {hospitalProfile.faviconUrl || "/favicon-32.png"}
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={faviconInputRef}
                    onChange={onFaviconFileChange}
                    accept=".ico,image/*,image/x-icon,image/png,image/svg+xml"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => faviconInputRef.current?.click()}
                    disabled={uploadLoading === "favicon"}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadLoading === "favicon" ? "Uploading..." : "Upload / Replace Favicon"}</span>
                  </button>
                  <p className="text-[10px] text-slate-500 text-center">Shows in browser tab and bookmarks (.ico, .png)</p>
                </div>

                {/* Hero Banner Upload Card */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    3. Campus / Hero Photo
                  </span>
                  <div className="relative w-full h-28 rounded-xl border border-slate-300 bg-slate-900 overflow-hidden shadow-xs">
                    <Image
                      src={hospitalProfile.heroBannerUrl || "/images/hospital-building.jpg"}
                      alt="Banner Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <input
                    type="file"
                    ref={heroBannerInputRef}
                    onChange={onHeroBannerFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => heroBannerInputRef.current?.click()}
                    disabled={uploadLoading === "banner"}
                    className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadLoading === "banner" ? "Uploading..." : "Upload Campus Photo"}</span>
                  </button>
                  <p className="text-[10px] text-slate-500 text-center">High resolution hospital building/hero image</p>
                </div>
              </div>

              {/* General Hospital Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Hospital Brand Name
                  </label>
                  <input
                    type="text"
                    value={hospitalProfile.name || ""}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Legal / Registered Name
                  </label>
                  <input
                    type="text"
                    value={hospitalProfile.legalName || ""}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, legalName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Tagline / Subheading
                  </label>
                  <input
                    type="text"
                    value={hospitalProfile.tagline || ""}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Bed Capacity Highlight
                  </label>
                  <input
                    type="text"
                    value={hospitalProfile.bedCapacity || ""}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, bedCapacity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    placeholder="45 Beds"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Built-up Area
                  </label>
                  <input
                    type="text"
                    value={hospitalProfile.builtUpArea || ""}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, builtUpArea: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    placeholder="9,500+ Sq. Ft."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Years of Excellence
                  </label>
                  <input
                    type="text"
                    value={hospitalProfile.yearsOfExcellence || ""}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, yearsOfExcellence: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    placeholder="15+"
                  />
                </div>
              </div>

              {/* Contact Numbers */}
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Helplines &amp; Digital Numbers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Main Phone Number
                    </label>
                    <input
                      type="text"
                      value={hospitalProfile.phone || ""}
                      onChange={(e) => setHospitalProfile({ ...hospitalProfile, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      24x7 Emergency Hotline
                    </label>
                    <input
                      type="text"
                      value={hospitalProfile.emergencyPhone || ""}
                      onChange={(e) => setHospitalProfile({ ...hospitalProfile, emergencyPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      WhatsApp Inquiry Number
                    </label>
                    <input
                      type="text"
                      value={hospitalProfile.whatsappNumber || ""}
                      onChange={(e) => setHospitalProfile({ ...hospitalProfile, whatsappNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Address & Email */}
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Location &amp; Email</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Hospital Official Email
                    </label>
                    <input
                      type="email"
                      value={hospitalProfile.email || ""}
                      onChange={(e) => setHospitalProfile({ ...hospitalProfile, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Google Maps Link / URL
                    </label>
                    <input
                      type="text"
                      value={hospitalProfile.googleMapsUrl || ""}
                      onChange={(e) => setHospitalProfile({ ...hospitalProfile, googleMapsUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Full Address
                    </label>
                    <input
                      type="text"
                      value={hospitalProfile.address?.fullAddress || ""}
                      onChange={(e) =>
                        setHospitalProfile({
                          ...hospitalProfile,
                          address: { ...hospitalProfile.address, fullAddress: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Hospital Description (About Us)
                    </label>
                    <textarea
                      rows={3}
                      value={hospitalProfile.description || ""}
                      onChange={(e) => setHospitalProfile({ ...hospitalProfile, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveAll()}
                  className="px-6 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm shadow-md transition"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. DOCTORS ROSTER (FULL CRUD) */}
          {/* ======================================================== */}
          {activeTab === "doctors" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Doctors &amp; Specialists Roster</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage full-time consultants and visiting super-specialist doctors.
                  </p>
                </div>
                <button
                  onClick={openAddDoctorModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Doctor</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search doctors by name, department, or qualification..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              {/* Doctors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <Image src={getDoctorImageUrl(doc)} alt={doc.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900 truncate">{doc.name}</h4>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                              doc.type === "full-time"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-sky-100 text-sky-800"
                            }`}
                          >
                            {doc.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate">{doc.qualification}</p>
                        <p className="text-xs font-bold text-sky-700">{doc.department}</p>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{doc.opdTiming}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Schedule: {doc.opdSchedule}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditDoctorModal(doc)}
                          className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold flex items-center gap-1 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete Doctor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. SERVICES & DEPARTMENTS (FULL CRUD) */}
          {/* ======================================================== */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Services &amp; Medical Facilities</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add and customize hospital wings, clinical services, and departments.
                  </p>
                </div>
                <button
                  onClick={openAddServiceModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search services by title or category..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              {/* Services List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {srv.category}
                        </span>
                        {srv.isEmergency24x7 && (
                          <span className="text-[9px] font-bold uppercase text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                            24x7 Emergency
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900">{srv.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {srv.shortDescription || srv.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">
                        {srv.features?.length || 0} Key Highlights
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditServiceModal(srv)}
                          className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold flex items-center gap-1 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteService(srv.id, srv.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. CORPORATE & INSURANCE PARTNERS (FULL CRUD) */}
          {/* ======================================================== */}
          {activeTab === "partners" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Cashless &amp; Corporate Partners</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage industrial group cashless tie-ups and health insurance TPAs.
                  </p>
                </div>
                <button
                  onClick={openAddPartnerModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Partner</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search corporate or insurance partners..."
                  value={partnerSearch}
                  onChange={(e) => setPartnerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              {/* Partners Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredPartners.map((partner, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition flex flex-col justify-between items-center text-center group"
                  >
                    <div className="w-full flex items-center justify-between mb-2">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                          partner.type === "Corporate"
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {partner.type === "Corporate" ? "Corporate" : "TPA"}
                      </span>
                      <button
                        onClick={() => handleDeletePartner(partner.name)}
                        className="text-slate-300 hover:text-red-500 p-0.5 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="relative w-full h-16 flex items-center justify-center p-1 rounded-xl bg-slate-50 group-hover:bg-sky-50/50 transition">
                      <Image
                        src={partner.image}
                        alt={partner.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    <span className="mt-2 text-xs font-bold text-slate-800 line-clamp-1">
                      {partner.name}
                    </span>

                    <button
                      onClick={() => openEditPartnerModal(partner)}
                      className="mt-3 w-full py-1.5 rounded-lg bg-slate-50 hover:bg-sky-50 text-sky-700 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Logo/Details</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. PHOTO GALLERY (FULL CRUD) */}
          {/* ======================================================== */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Photo Gallery &amp; Campus Tour</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload and manage hospital building, OT, ICU, lab, and camp photos.
                  </p>
                </div>
                <button
                  onClick={openAddGalleryModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Photo</span>
                </button>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryList.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="relative h-32 w-full bg-slate-100">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-bold">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-3 space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{item.description}</p>
                    </div>

                    <div className="p-2 pt-0 flex items-center justify-between border-t border-slate-100">
                      <button
                        onClick={() => openEditGalleryModal(item)}
                        className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 py-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteGallery(item.id, item.title)}
                        className="p-1 text-slate-400 hover:text-red-600 transition"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 6. ANNOUNCEMENTS & EMERGENCY NOTICES (FULL CRUD) */}
          {/* ======================================================== */}
          {activeTab === "announcements" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Announcements &amp; Notice Banner</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Post health camp announcements, urgent emergency alerts, and updates.
                  </p>
                </div>
                <button
                  onClick={openAddAnnouncementModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Announcement</span>
                </button>
              </div>

              {/* Announcement List */}
              <div className="space-y-3">
                {announcementsList.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                            ann.category === "Emergency"
                              ? "bg-red-100 text-red-800"
                              : ann.category === "Camp"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-sky-100 text-sky-800"
                          }`}
                        >
                          {ann.category}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            ann.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {ann.isActive ? "Live / Active" : "Inactive"}
                        </span>
                        <span className="text-[10px] text-slate-400">{ann.date}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{ann.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{ann.content}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleAnnActive(ann.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          ann.isActive
                            ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {ann.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => openEditAnnouncementModal(ann)}
                        className="p-2 rounded-xl text-sky-700 bg-sky-50 hover:bg-sky-100 transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 7. FAQS EDITOR (FULL CRUD) */}
          {/* ======================================================== */}
          {activeTab === "faqs" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add and edit patient questions regarding emergency, cashless admissions, and OPD.
                  </p>
                </div>
                <button
                  onClick={openAddFaqModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New FAQ</span>
                </button>
              </div>

              {/* FAQs List */}
              <div className="space-y-3">
                {faqsList.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 transition flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-black text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{faq.question}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-7">{faq.answer}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEditFaqModal(faq, idx)}
                        className="p-2 rounded-xl text-sky-700 bg-sky-50 hover:bg-sky-100 transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(idx)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 8. SEO & META SETTINGS */}
          {/* ======================================================== */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-black text-slate-900">SEO &amp; Search Engine Metadata</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize Google search titles, meta descriptions, and keywords for Mundra ranking.
                </p>
              </div>

              {/* Live Google Preview Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Google Search Snippet Preview
                </span>
                <span className="text-xs text-slate-500 font-mono block">
                  https://geetahospitalmundra.com
                </span>
                <h4 className="text-lg font-bold text-blue-700 hover:underline cursor-pointer">
                  {seoSettings.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {seoSettings.description}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Meta Page Title
                  </label>
                  <input
                    type="text"
                    value={seoSettings.title}
                    onChange={(e) => setSeoSettings({ ...seoSettings, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Length: {seoSettings.title.length} characters (Recommended: 50-65)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={seoSettings.description}
                    onChange={(e) => setSeoSettings({ ...seoSettings, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Length: {seoSettings.description.length} characters (Recommended: 120-160)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Meta Keywords (Comma separated)
                  </label>
                  <textarea
                    rows={3}
                    value={seoSettings.keywords}
                    onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 font-mono text-xs"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSaveAll()}
                    className="px-6 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    Save SEO Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 9. CLOUD MEDIA STORAGE & CLOUDINARY TAB */}
          {/* ======================================================== */}
          {activeTab === "storage" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Cloud className="w-5 h-5 text-sky-600" />
                      <span>Cloud Media Storage &amp; CDN (Cloudinary)</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Connect your free Cloudinary account to store and serve all website images from worldwide CDN, or empty storage when needed.
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                      isCloudinaryActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isCloudinaryActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                      }`}
                    />
                    <span>{isCloudinaryActive ? "Cloudinary Connected" : "Local / Serverless Fallback"}</span>
                  </span>
                </div>
              </div>

              {/* Status Message Alert */}
              {storageStatusMsg && (
                <div
                  className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    storageStatusMsg.toLowerCase().includes("fail") || storageStatusMsg.toLowerCase().includes("error")
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{storageStatusMsg}</span>
                </div>
              )}

              {/* Configuration Form Card */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Cloudinary API Configuration
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Found in your Cloudinary Dashboard under &quot;Product Environment Credentials&quot;.
                  </p>
                </div>

                <form onSubmit={handleSaveStorageConfig} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Cloud Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. dxyz123abc"
                        value={storageConfig.cloudName}
                        onChange={(e) => setStorageConfig({ ...storageConfig, cloudName: e.target.value })}
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Target Folder
                      </label>
                      <input
                        type="text"
                        placeholder="geeta-hospital"
                        value={storageConfig.folder}
                        onChange={(e) => setStorageConfig({ ...storageConfig, folder: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        API Key *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 123456789012345"
                        value={storageConfig.apiKey}
                        onChange={(e) => setStorageConfig({ ...storageConfig, apiKey: e.target.value })}
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        API Secret *
                      </label>
                      <input
                        type="password"
                        placeholder="Enter API Secret"
                        value={storageConfig.apiSecret}
                        onChange={(e) => setStorageConfig({ ...storageConfig, apiSecret: e.target.value })}
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={storageLoading}
                        className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{storageLoading ? "Saving..." : "Save Credentials"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleTestCloudinary}
                        disabled={storageTesting}
                        className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${storageTesting ? "animate-spin" : ""}`} />
                        <span>{storageTesting ? "Testing..." : "Test Connection"}</span>
                      </button>
                    </div>

                    <a
                      href="https://cloudinary.com/users/register_free"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-600 hover:underline font-semibold"
                    >
                      Don&apos;t have an account? Sign up free (25 GB free storage) &rarr;
                    </a>
                  </div>
                </form>
              </div>

              {/* CLEAR STORAGE / RESET SECTION */}
              <div className="p-6 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-rose-950">
                      Empty Cloud Media Storage &amp; Reset Baseline
                    </h3>
                    <p className="text-xs text-rose-800 leading-relaxed">
                      Need to empty Cloudinary or reset your site? Clicking this button will purge all uploaded images inside the <code className="bg-rose-100 px-1 rounded font-mono font-bold">geeta-hospital</code> Cloudinary folder and restore all website photos, logos, and doctor portraits back to the hospital&apos;s pristine official baseline files.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleClearStorage}
                    disabled={storageLoading}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{storageLoading ? "Clearing Storage..." : "Empty Cloud Storage & Reset Media"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT DOCTOR */}
      {/* ======================================================== */}
      {docModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {docModalMode === "add" ? "Add New Doctor" : `Edit ${docForm.name}`}
                </h3>
                <p className="text-xs text-slate-500">Configure doctor profile, OPD timings, and clinical bio.</p>
              </div>
              <button
                onClick={() => setDocModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-4">
              {/* Photo Upload & Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-white border border-slate-300 shrink-0 shadow-xs">
                  <Image src={getDoctorImageUrl(docForm)} alt={docForm.name || "Preview"} fill className="object-cover" unoptimized />
                </div>
                <div className="space-y-2 flex-grow text-center sm:text-left">
                  <span className="text-xs font-bold text-slate-700 block">Doctor Photo (Custom or Auto Sample)</span>
                  <input
                    type="file"
                    ref={doctorPhotoInputRef}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      const url = await handleFileUpload(file, "doctor");
                      if (url) setDocForm({ ...docForm, image: url });
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => doctorPhotoInputRef.current?.click()}
                      disabled={uploadLoading === "doctor"}
                      className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1 transition shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadLoading === "doctor" ? "Uploading..." : "Upload Custom Photo"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocForm({ ...docForm, image: DEFAULT_DOCTOR_IMAGES.male, gender: "male" })}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition"
                      title="Use default professional male doctor portrait"
                    >
                      👨‍⚕️ Male Sample
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocForm({ ...docForm, image: DEFAULT_DOCTOR_IMAGES.female, gender: "female" })}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition"
                      title="Use default professional female doctor portrait"
                    >
                      👩‍⚕️ Female Sample
                    </button>
                    {docForm.image && (
                      <button
                        type="button"
                        onClick={() => setDocForm({ ...docForm, image: "" })}
                        className="px-2 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                        title="Reset to automatic sample photo based on gender"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={docForm.image}
                    onChange={(e) => setDocForm({ ...docForm, image: e.target.value })}
                    placeholder="Leave empty for auto sample doctor photo..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={docForm.name}
                    onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                    placeholder="Dr. Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Doctor Gender (પુરુષ / મહિલા)
                  </label>
                  <select
                    value={docForm.gender || getDoctorGender(docForm)}
                    onChange={(e) => {
                      const gen = e.target.value as "male" | "female";
                      const isDefault = !docForm.image || docForm.image.includes("default-doctor");
                      setDocForm({
                        ...docForm,
                        gender: gen,
                        image: isDefault ? (gen === "female" ? DEFAULT_DOCTOR_IMAGES.female : DEFAULT_DOCTOR_IMAGES.male) : docForm.image,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="male">👨‍⚕️ Male Doctor (પુરુષ)</option>
                    <option value="female">👩‍⚕️ Female Doctor (મહિલા)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Qualification *
                  </label>
                  <input
                    type="text"
                    required
                    value={docForm.qualification}
                    onChange={(e) => setDocForm({ ...docForm, qualification: e.target.value })}
                    placeholder="MBBS, MD, MS, DNB..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Department / Specialty *
                  </label>
                  <input
                    type="text"
                    required
                    value={docForm.department}
                    onChange={(e) => setDocForm({ ...docForm, department: e.target.value })}
                    placeholder="Gynecology &amp; Obstetrics, Pediatrics..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={docForm.designation}
                    onChange={(e) => setDocForm({ ...docForm, designation: e.target.value })}
                    placeholder="Chief Consultant &amp; Medical Director"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Practice Type
                  </label>
                  <select
                    value={docForm.type}
                    onChange={(e) => setDocForm({ ...docForm, type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="full-time">Full-Time Hospital Specialist</option>
                    <option value="visiting">Visiting Super-Specialist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={docForm.experience}
                    onChange={(e) => setDocForm({ ...docForm, experience: e.target.value })}
                    placeholder="15+ Years"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    OPD Days / Schedule
                  </label>
                  <input
                    type="text"
                    value={docForm.opdSchedule}
                    onChange={(e) => setDocForm({ ...docForm, opdSchedule: e.target.value })}
                    placeholder="Monday to Saturday / 1st Thursday"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    OPD Timings
                  </label>
                  <input
                    type="text"
                    value={docForm.opdTiming}
                    onChange={(e) => setDocForm({ ...docForm, opdTiming: e.target.value })}
                    placeholder="10:00 AM - 1:30 PM &amp; 5:00 PM - 8:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Clinical Expertise (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={docForm.expertise.join(", ")}
                    onChange={(e) =>
                      setDocForm({
                        ...docForm,
                        expertise: e.target.value.split(",").map((s) => s.trim()),
                      })
                    }
                    placeholder="Normal &amp; High-Risk Delivery, Laparoscopy, Ultrasound, Infertility"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Doctor Bio / Clinical Overview
                  </label>
                  <textarea
                    rows={2}
                    value={docForm.bio || ""}
                    onChange={(e) => setDocForm({ ...docForm, bio: e.target.value })}
                    placeholder="Brief background about training, clinical awards, or hospital leadership."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDocModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                >
                  {docModalMode === "add" ? "Create Doctor" : "Update Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD / EDIT SERVICE */}
      {/* ======================================================== */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {serviceModalMode === "add" ? "Add New Service" : `Edit ${serviceForm.title}`}
                </h3>
                <p className="text-xs text-slate-500">Configure medical wing, description, and highlights.</p>
              </div>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  placeholder="24x7 ICU Ambulance, Neonatal ICU (NICU)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Critical Care">Critical Care</option>
                    <option value="Surgical & Maternal">Surgical &amp; Maternal</option>
                    <option value="Diagnostics">Diagnostics</option>
                    <option value="Inpatient & Amenities">Inpatient &amp; Amenities</option>
                    <option value="Community Health">Community Health</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Icon Theme
                  </label>
                  <select
                    value={serviceForm.iconName}
                    onChange={(e) => setServiceForm({ ...serviceForm, iconName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Stethoscope">Stethoscope (General)</option>
                    <option value="HeartPulse">HeartPulse (Cardio / Emergency)</option>
                    <option value="Baby">Baby (Pediatric / NICU / Maternity)</option>
                    <option value="Ambulance">Ambulance (24x7 Response)</option>
                    <option value="FlaskConical">FlaskConical (Pathology Lab)</option>
                    <option value="Pill">Pill (Pharmacy)</option>
                    <option value="Activity">Activity (ICU / Vital Care)</option>
                    <option value="Bone">Bone (Orthopedics / C-ARM)</option>
                    <option value="Eye">Eye (Ophthalmology)</option>
                    <option value="ShieldCheck">ShieldCheck (Mediclaim / Insurance)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    checked={serviceForm.isEmergency24x7 || false}
                    onChange={(e) => setServiceForm({ ...serviceForm, isEmergency24x7: e.target.checked })}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Mark as 24x7 Emergency Service (Displays red pulse badge)
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={serviceForm.shortDescription || ""}
                  onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                  placeholder="One sentence summary for service cards"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Full Service Description
                </label>
                <textarea
                  rows={3}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Detailed clinical equipment, team capabilities, and benefits."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Clinical Highlights / Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={serviceFeaturesInput}
                  onChange={(e) => setServiceFeaturesInput(e.target.value)}
                  placeholder="Dedicated Oxygen Pipeline&#10;24x7 Medical Officer on Duty&#10;Emergency Back-up Power"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 font-mono text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                >
                  {serviceModalMode === "add" ? "Create Service" : "Update Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD / EDIT PARTNER */}
      {/* ======================================================== */}
      {partnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {partnerModalMode === "add" ? "Add Cashless Partner" : `Edit ${partnerForm.name}`}
                </h3>
                <p className="text-xs text-slate-500">Upload official logo and set corporate or TPA type.</p>
              </div>
              <button
                onClick={() => setPartnerModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-4">
              {/* Partner Logo Upload & Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                <div className="relative w-24 h-16 rounded-xl border border-slate-300 bg-white p-2 flex items-center justify-center shrink-0">
                  <Image src={partnerForm.image} alt={partnerForm.name || "Partner"} fill className="object-contain p-1" />
                </div>
                <div className="space-y-1 flex-grow">
                  <span className="text-xs font-bold text-slate-700 block">Partner Logo File</span>
                  <input
                    type="file"
                    ref={partnerLogoInputRef}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      const url = await handleFileUpload(file, "partner");
                      if (url) setPartnerForm({ ...partnerForm, image: url });
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => partnerLogoInputRef.current?.click()}
                    disabled={uploadLoading === "partner"}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadLoading === "partner" ? "Uploading..." : "Upload Logo"}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Partner / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  placeholder="e.g. Adani Group, HDFC ERGO..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Partner Category
                  </label>
                  <select
                    value={partnerForm.type}
                    onChange={(e) => setPartnerForm({ ...partnerForm, type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Corporate">Corporate Industrial Group</option>
                    <option value="TPA / Insurance">Insurance &amp; TPA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Logo Text / Acronym
                  </label>
                  <input
                    type="text"
                    value={partnerForm.logoText}
                    onChange={(e) => setPartnerForm({ ...partnerForm, logoText: e.target.value })}
                    placeholder="ADANI, HDFC ERGO..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Logo Image Path / URL
                </label>
                <input
                  type="text"
                  value={partnerForm.image}
                  onChange={(e) => setPartnerForm({ ...partnerForm, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPartnerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                >
                  {partnerModalMode === "add" ? "Add Partner" : "Update Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: ADD / EDIT GALLERY PHOTO */}
      {/* ======================================================== */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {galleryModalMode === "add" ? "Add Photo to Gallery" : "Edit Photo Details"}
                </h3>
                <p className="text-xs text-slate-500">Upload facility images and add descriptive captions.</p>
              </div>
              <button
                onClick={() => setGalleryModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              {/* Image Upload & Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                <div className="relative w-24 h-20 rounded-xl border border-slate-300 bg-white overflow-hidden shrink-0 shadow-xs">
                  <Image src={galleryForm.image} alt={galleryForm.title || "Preview"} fill className="object-cover" />
                </div>
                <div className="space-y-1 flex-grow">
                  <span className="text-xs font-bold text-slate-700 block">Photo Image</span>
                  <input
                    type="file"
                    ref={galleryImageInputRef}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      const url = await handleFileUpload(file, "gallery");
                      if (url) setGalleryForm({ ...galleryForm, image: url });
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => galleryImageInputRef.current?.click()}
                    disabled={uploadLoading === "gallery"}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadLoading === "gallery" ? "Uploading..." : "Upload New Photo"}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Photo Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="e.g. 5-Bed NICU with Phototherapy, Modular OT..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Critical Care">Critical Care (ICU / NICU)</option>
                  <option value="Operating Theatres">Operating Theatres (OT)</option>
                  <option value="Diagnostics">Diagnostics (Pathology / USG)</option>
                  <option value="Super-Specialist OPD">Super-Specialist OPD</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  placeholder="Brief clinical description of the facility shown."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                >
                  {galleryModalMode === "add" ? "Add to Gallery" : "Update Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: ADD / EDIT ANNOUNCEMENT */}
      {/* ======================================================== */}
      {annModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {annModalMode === "add" ? "Create Announcement" : "Edit Notice"}
                </h3>
                <p className="text-xs text-slate-500">Notice bar alert or upcoming clinical camp banner.</p>
              </div>
              <button
                onClick={() => setAnnModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  placeholder="e.g. Free Cardiology Mega Camp This Sunday"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={annForm.category}
                    onChange={(e) => setAnnForm({ ...annForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="Camp">Clinical Camp</option>
                    <option value="TPA / Cashless">TPA / Cashless</option>
                    <option value="General Notice">General Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Notice Date
                  </label>
                  <input
                    type="date"
                    value={annForm.date}
                    onChange={(e) => setAnnForm({ ...annForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Notice Details / Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  placeholder="Detailed timings, consulting doctors, and instructions for patients."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    checked={annForm.isActive}
                    onChange={(e) => setAnnForm({ ...annForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Publish this notice on the website immediately
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAnnModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                >
                  {annModalMode === "add" ? "Publish Notice" : "Update Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: ADD / EDIT FAQ */}
      {/* ======================================================== */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {faqModalMode === "add" ? "Add FAQ" : "Edit FAQ"}
                </h3>
                <p className="text-xs text-slate-500">Provide clear answers for patient inquiries.</p>
              </div>
              <button
                onClick={() => setFaqModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Patient Question *
                </label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. Which insurance policies provide cashless admission?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Comprehensive clinical or administrative answer."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                >
                  {faqModalMode === "add" ? "Create FAQ" : "Update FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  HOSPITAL_INFO,
  DOCTORS,
  SERVICES,
  GALLERY_ITEMS,
  INSURANCE_PARTNERS,
  FACILITIES_LIST,
  FAQS,
  Doctor,
  ServiceItem,
  InsurancePartner,
  FacilityItem,
} from "@/data/hospitalData";

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  isActive: boolean;
  date: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface CmsContextType {
  hospitalProfile: typeof HOSPITAL_INFO & {
    logoUrl?: string;
    faviconUrl?: string;
    heroBannerUrl?: string;
  };
  doctors: Doctor[];
  services: ServiceItem[];
  facilities: FacilityItem[];
  partners: InsurancePartner[];
  gallery: GalleryItem[];
  announcements: AnnouncementItem[];
  faqs: FaqItem[];
  seoSettings: {
    title: string;
    description: string;
    keywords: string;
  };
  isLoading: boolean;
  refreshCms: () => Promise<void>;
  updateLocalCms: (newData: any) => void;
}

const CmsContext = createContext<CmsContextType | null>(null);

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [hospitalProfile, setHospitalProfile] = useState<any>(HOSPITAL_INFO);
  const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES);
  const [facilities, setFacilities] = useState<FacilityItem[]>(FACILITIES_LIST);
  const [partners, setPartners] = useState<InsurancePartner[]>(INSURANCE_PARTNERS);
  const [gallery, setGallery] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [faqs, setFaqs] = useState<FaqItem[]>(FAQS);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([
    {
      id: "ann-1",
      title: "24x7 Emergency, ICU & Trauma Centre Active",
      content: "Our ICU ventilators, emergency operation theatres, and dedicated ambulance are staffed 24 hours a day, 7 days a week.",
      category: "Emergency",
      isActive: true,
      date: new Date().toISOString().split("T")[0],
    },
    {
      id: "ann-2",
      title: "Cashless Mediclaim Desk for TPA & Corporate Insurance",
      content: "ROHINI registered hospital providing hassle-free cashless hospitalization for Star Health, Care, ICICI Lombard, Niva Bupa & PSUs.",
      category: "TPA / Cashless",
      isActive: true,
      date: new Date().toISOString().split("T")[0],
    },
  ]);
  const [seoSettings, setSeoSettings] = useState({
    title: "Geeta Multi-Speciality Hospital Mundra | 24x7 Emergency & Critical Care",
    description: "Premier 45-bed multi-speciality hospital in Mundra (Kutch). 24x7 Emergency, Gynecology, Pediatrics, Adult & Neonatal ICU, Orthopedics, Cashless Mediclaim. ISO 9001:2015 & ROHINI registered.",
    keywords: "Hospital in Mundra, Geeta Hospital Mundra, Emergency hospital Mundra, Gynecologist in Mundra, Pediatrician Mundra, ICU hospital Kutch, Dr Kundan Modi, Cashless mediclaim hospital Mundra",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Apply CMS payload to state
  const applyData = (data: any) => {
    if (!data) return;
    if (data.hospitalProfile && Object.keys(data.hospitalProfile).length > 0) {
      setHospitalProfile((prev: any) => ({ ...prev, ...data.hospitalProfile }));
    }
    if (data.doctors && Array.isArray(data.doctors) && data.doctors.length > 0) {
      setDoctors(data.doctors);
    }
    if (data.services && Array.isArray(data.services) && data.services.length > 0) {
      setServices(data.services);
    }
    if (data.facilities && Array.isArray(data.facilities) && data.facilities.length > 0) {
      setFacilities(data.facilities);
    }
    if (data.partners && Array.isArray(data.partners) && data.partners.length > 0) {
      setPartners(data.partners);
    }
    if (data.gallery && Array.isArray(data.gallery) && data.gallery.length > 0) {
      setGallery(data.gallery);
    }
    if (data.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
      setFaqs(data.faqs);
    }
    if (data.announcements && Array.isArray(data.announcements)) {
      setAnnouncements(data.announcements);
    }
    if (data.seoSettings) {
      setSeoSettings(data.seoSettings);
    }
  };

  const refreshCms = async () => {
    try {
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        applyData(json.data);
        try {
          localStorage.setItem("gh_cms_content", JSON.stringify(json.data));
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.warn("Could not fetch CMS:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocalCms = (newData: any) => {
    applyData(newData);
    try {
      localStorage.setItem("gh_cms_content", JSON.stringify(newData));
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    // 1. Instant hydration from localStorage
    try {
      const cached = localStorage.getItem("gh_cms_content");
      if (cached) {
        applyData(JSON.parse(cached));
      }
    } catch (e) {
      // ignore
    }

    // 2. Fetch fresh from server
    refreshCms();
  }, []);

  return (
    <CmsContext.Provider
      value={{
        hospitalProfile,
        doctors,
        services,
        facilities,
        partners,
        gallery,
        announcements,
        faqs,
        seoSettings,
        isLoading,
        refreshCms,
        updateLocalCms,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) {
    // Graceful fallback for components outside provider
    return {
      hospitalProfile: HOSPITAL_INFO,
      doctors: DOCTORS,
      services: SERVICES,
      facilities: FACILITIES_LIST,
      partners: INSURANCE_PARTNERS,
      gallery: GALLERY_ITEMS,
      announcements: [],
      faqs: FAQS,
      seoSettings: {
        title: "Geeta Multi-Speciality Hospital Mundra",
        description: "Leading 45-bed hospital in Mundra",
        keywords: "Hospital in Mundra",
      },
      isLoading: false,
      refreshCms: async () => {},
      updateLocalCms: () => {},
    };
  }
  return context;
}

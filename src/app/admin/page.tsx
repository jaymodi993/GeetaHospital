import { Metadata } from "next";
import AdminClient from "@/components/admin/AdminClient";

export const metadata: Metadata = {
  title: "Hospital Content & CMS Admin Panel | Geeta Hospital Mundra",
  description:
    "Official hospital administration dashboard for Geeta Multi-Speciality Hospital Mundra. Manage hospital branding, doctors, announcements, gallery photos, and SEO settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminClient />;
}

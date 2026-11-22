import { Metadata } from "next";
import PortalClient from "@/components/portal/PortalClient";

export const metadata: Metadata = {
  title: "Hospital Staff, Reception & Doctor Portal | Geeta Hospital Mundra",
  description:
    "Official internal hospital management portal for Geeta Multi-Speciality Hospital Mundra. Role-based login for Admin, Reception, and Doctors with real-time OPD queues, doctor duty roster, and official letterhead print slips.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalPage() {
  return <PortalClient />;
}

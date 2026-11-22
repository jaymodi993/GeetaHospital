import { Metadata } from "next";
import PortalClient from "@/components/portal/PortalClient";

export const metadata: Metadata = {
  title: "OPD Reception & Doctor Consultation Desk | Geeta Hospital Mundra",
  description:
    "Official hospital reception and doctor consultation queue management portal for Geeta Multi-Speciality Hospital Mundra. Real-time token tracking, patient confirmation, and daily doctor schedules.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReceptionPage() {
  return <PortalClient />;
}

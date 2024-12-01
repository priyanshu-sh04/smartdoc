import React from "react";
import {
  FileText,
  Home,
  Plus,
  Settings,
  BarChart2,
  ChevronRight,
  ClipboardList,
  ShieldCheck,
  FileClock,
  PieChart,
} from "lucide-react";
import DashboardPage from "@/app/page";
import Sidebar from "@/components/IssuerSidebar";

const IssuerDashboard = () => {
  const documentTemplates = [
    { title: "Identity Card", description: "Preformatted template for IDs" },
    {
      title: "Certificate of Employment",
      description: "Issue employment certificates",
    },
    {
      title: "Academic Certificate",
      description: "Educational institution template",
    },
    { title: "Tax Document", description: "Tax-related forms and records" },
  ];

  const recentIssues = [
    {
      title: "Employee ID",
      recipient: "Alex Johnson",
      docId: "EMP-2024-101",
      date: "Nov 12, 2024",
    },
    {
      title: "Academic Certificate",
      recipient: "Sophia Kim",
      docId: "EDU-2024-202",
      date: "Nov 10, 2024",
    },
    {
      title: "Tax Clearance",
      recipient: "John Doe",
      docId: "TAX-2024-303",
      date: "Nov 8, 2024",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - fixed width and full height */}
      <Sidebar />

      {/* Main Content - with proper margin and padding */}
      <div className="flex-1 ml-72">
        <DashboardPage />
      </div>
    </div>
  );
};

export default IssuerDashboard;

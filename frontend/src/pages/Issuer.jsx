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

const IssuerDashboard = () => {
  const documentTemplates = [
    { title: "Identity Card", description: "Preformatted template for IDs" },
    { title: "Certificate of Employment", description: "Issue employment certificates" },
    { title: "Academic Certificate", description: "Educational institution template" },
    { title: "Tax Document", description: "Tax-related forms and records" },
  ];

  const recentIssues = [
    { title: "Employee ID", recipient: "Alex Johnson", docId: "EMP-2024-101", date: "Nov 12, 2024" },
    { title: "Academic Certificate", recipient: "Sophia Kim", docId: "EDU-2024-202", date: "Nov 10, 2024" },
    { title: "Tax Clearance", recipient: "John Doe", docId: "TAX-2024-303", date: "Nov 8, 2024" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - fixed width and full height */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-lg z-10">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10">
            <ShieldCheck className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">SmartDoc</span>
          </div>
          <nav className="space-y-4">
            <a href="#" className="flex items-center space-x-4 p-4 rounded-lg bg-blue-50 text-blue-600">
              <Home className="h-6 w-6" />
              <span className="text-lg font-normal">Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-4 p-4 rounded-lg text-gray-700 hover:bg-gray-50">
              <ClipboardList className="h-6 w-6" />
              <span className="text-lg font-normal">Document Templates</span>
            </a>
            <a href="#" className="flex items-center space-x-4 p-4 rounded-lg text-gray-700 hover:bg-gray-50">
              <Plus className="h-6 w-6" />
              <span className="text-lg font-normal">Bulk Document Issuance</span>
            </a>
            <a href="#" className="flex items-center space-x-4 p-4 rounded-lg text-gray-700 hover:bg-gray-50">
              <FileClock className="h-6 w-6" />
              <span className="text-lg font-normal">Document Requests</span>
            </a>
            <a href="#" className="flex items-center space-x-4 p-4 rounded-lg text-gray-700 hover:bg-gray-50">
              <PieChart className="h-6 w-6" />
              <span className="text-lg font-normal">Analytics and Reports</span>
            </a>
            <a href="#" className="flex items-center space-x-4 p-4 rounded-lg text-gray-700 hover:bg-gray-50">
              <Settings className="h-6 w-6" />
              <span className="text-lg font-normal">Settings</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content - with proper margin and padding */}
      <div className="flex-1 ml-72">
      <DashboardPage/>
      </div>
    </div>
  );
};

export default IssuerDashboard;
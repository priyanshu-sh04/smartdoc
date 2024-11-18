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
} from "lucide-react";

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
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10">
            <ShieldCheck className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">SmartDoc</span>
          </div>
          <nav className="space-y-4">
            <a href="#" className="flex items-center space-x-4 p-4 rounded-lg bg-blue-50 text-blue-600">
              <Home className="h-6 w-6" />
              <span className="text-lg font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-4 p-4 rounded-lg text-gray-700 hover:bg-gray-50">
              <ClipboardList className="h-6 w-6" />
              <span className="text-lg font-medium">Document Templates</span>
            </a>
            <a href="/create-document" className="flex items-center space-x-4 p-4 rounded-lg text-gray-700 hover:bg-gray-50">
              <Plus className="h-6 w-6" />
              <span className="text-lg font-medium">Issue Documents</span>
            </a>
            <a href="#" className="flex items-center space-x-4 p-4 rounded-lg text-gray-700 hover:bg-gray-50">
              <Settings className="h-6 w-6" />
              <span className="text-lg font-medium">Settings</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dronacharya's Issuance Dashboard</h1>
            <p className="text-lg text-gray-600">Issue, manage, and track documents effortlessly</p>
          </div>
          <button className="p-3 rounded-lg bg-blue-600 text-white text-lg font-medium shadow-md hover:bg-blue-700">
            New Document
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <h3 className="text-lg font-medium text-gray-700">Total Issued</h3>
            <p className="text-4xl font-bold text-blue-600 mt-4">5,123</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <h3 className="text-lg font-medium text-gray-700">Pending Approvals</h3>
            <p className="text-4xl font-bold text-blue-600 mt-4">128</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <h3 className="text-lg font-medium text-gray-700">Templates Created</h3>
            <p className="text-4xl font-bold text-blue-600 mt-4">47</p>
          </div>
        </div>

        {/* Recent Issues */}
        <div className="bg-white p-8 rounded-2xl shadow-md mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Recently Issued</h2>
            <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center">
              View all <ChevronRight className="h-5 w-5 ml-2" />
            </a>
          </div>
          <div className="space-y-6">
            {recentIssues.map((issue, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-medium text-gray-900">{issue.title}</h3>
                  <p className="text-gray-600">Recipient: {issue.recipient}</p>
                  <p className="text-gray-500 text-sm">Issued on: {issue.date}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Document Templates */}
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Document Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentTemplates.map((template, index) => (
              <div
                key={index}
                className="p-6 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-800">{template.title}</h3>
                <p className="text-gray-600 mt-2">{template.description}</p>
                <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuerDashboard;

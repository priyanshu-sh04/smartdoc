import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  HardDrive,
  Settings,
  Home,
  Plus,
  ChevronRight,
  Bell,
  ExternalLink,
} from "lucide-react";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/documents/all`
      );
      const data = await response.json();
      if (data.documents) {
        setDocuments(data.documents);
        console.log(documents);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const getIpfsLink = (ipfsHash) => {
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  };

  const suggestedDocs = [
    {
      title: "Driving License",
      description: "Apply for or renew your driving license",
      icon: "https://via.placeholder.com/64x64",
    },
    {
      title: "Vaccination Record",
      description: "Access your vaccination certificates",
      icon: "https://via.placeholder.com/64x64",
    },
    {
      title: "Property Documents",
      description: "Manage your property records",
      icon: "https://via.placeholder.com/64x64",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SmartDoc</span>
          </div>

          <nav className="space-y-2">
            <a
              href="#"
              className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 text-blue-600"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <FileText className="h-5 w-5" />
              <span>Issued Documents</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <Search className="h-5 w-5" />
              <span>Search Documents</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <HardDrive className="h-5 w-5" />
              <span>Storage</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, Alex!
            </h1>
            <p className="text-gray-600">All your documents are up to date</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <img
              src="/api/placeholder/40/40"
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
          </div>
        </div>

        {/* Recent Documents from API */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Documents
            </h2>
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="p-4 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{doc.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 break-all">
                      Hash: {doc.ipfsHash}
                    </p>
                    <a
                      href={getIpfsLink(doc.ipfsHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center mt-2"
                    >
                      View on IPFS
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 mt-4 text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
            New Document
          </button>
        </div>

        {/* Suggested Documents */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Documents You Might Need
            </h2>
            <button className="flex items-center text-blue-600 hover:text-blue-700">
              <Plus className="h-4 w-4 mr-1" /> Add New
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestedDocs.map((doc, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <img
                  src={doc.icon}
                  alt=""
                  className="w-16 h-16 rounded-lg mb-4"
                />
                <h3 className="font-medium text-gray-900 mb-2">{doc.title}</h3>
                <p className="text-sm text-gray-600">{doc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

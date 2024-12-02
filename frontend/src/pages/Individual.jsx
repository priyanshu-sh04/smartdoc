import React, { useState, useEffect } from "react";
import Cross from "./cross.svg";
import axios from "axios";
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
  const [files, setFiles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [DocumentTypeValue, setDocumentType] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [showIssuedDocs, setShowIssuedDocs] = useState(false); // New state to toggle Issued Documents visibility

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles([...selectedFiles]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });
    formData.append("title", documentTitle);
    formData.append("description", documentDescription);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.ok) {
        console.log("Files uploaded successfully");
      } else {
        console.error("Failed to upload files");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
      title: "Aadhar Card",
      description: "Official government-issued identity card",
      icon: "https://via.placeholder.com/64x64",
    },
    {
      title: "Pan Card",
      description: "Permanent Account Number issued by the government",
      icon: "https://via.placeholder.com/64x64",
    },
    {
      title: "Passport",
      description: "International travel document",
      icon: "https://via.placeholder.com/64x64",
    },
  ];

  const toggleIssuedDocs = () => {
    setShowIssuedDocs((prev) => !prev);
  };

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
              onClick={toggleIssuedDocs} // Toggle issued documents visibility
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

        {/* Recently Issued Documents */}
        {showIssuedDocs && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Issued Documents
              </h2>
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
        )}

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

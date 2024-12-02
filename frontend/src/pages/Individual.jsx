import React, { useState, useEffect } from "react";
import { FileText, Search, HardDrive, Settings, Home, Plus, Bell, X, ExternalLink, User, LogOut } from 'lucide-react';
import axios from "axios";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [files, setFiles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState("home");
  const [documentType, setDocumentType] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);

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
      if (response.status === 200) {
        console.log("Files uploaded successfully");
        setIsVisible(false);
        fetchDocuments();
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
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const getIpfsLink = (ipfsHash) => {
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  };

  const dummyDataArray = [
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Logo_of_Income_Tax_Department_India.png",
      title: "Income Tax Department",
      description: "Income Tax Department, Govt of India has provided PAN Verification Records to Indian citizens",
      governmentType: "State Government",
      documentType: "PAN Card",
    },
    {
      logo: "https://cdn.iconscout.com/icon/free/png-512/free-aadhaar-logo-icon-download-in-svg-png-gif-file-formats--unique-identity-india-citizen-information-details-logos-icons-1747945.png?f=webp&w=512",
      title: "Unique Identification Authority of India (UIDAI)",
      description: "Aadhar Card is issued by UIDAI, Government of India",
      governmentType: "Central Government",
      documentType: "Aadhar Card",
    },
    {
      logo: "https://upload.wikimedia.org/wikipedia/en/1/1d/Kurukshetra_University_logo.png",
      title: "Kurukshetra University, Kurukshetra",
      description: "Kurukshetra University, Kurukshetra is issuing their Digital awards for the following years,through SmartDoc",
      governmentType: "State Government",
      documentType: "Degree Certificate",
    },
    {
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXIHCJJ2QTxfumQq23zNyWNqWX4nbz4elmSw&s",
      title: "Gurugram University, Gurugram",
      description: "Gurugram University, Gurugram is issuing their Digital awards for the following years,through SmartDoc",
      governmentType: "State Government",
      documentType: "Degree Certificate",
    },
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/Uppcl-logo.png",
      title: "Uttar Pradesh Power Corporation Limited",
      description: "Uttar Pradesh Power Corporation Limited is issuing their Digital awards for the following years,through SmartDoc",
      governmentType: "State Government",
      documentType: "Electricity Bill Electricity Connection",
    },
    {
      logo: "https://we-recycle.org/wp-content/uploads/2014/03/bses-rajdhani.png",
      title: "BSES YAMUNA/ RAJDHANI POWER LTD",
      description: "BSES YAMUNA/ RAJDHANI POWER LTD is issuing their Digital awards for the following years,through SmartDoc",
      governmentType: "State Government",
      documentType: "Electricity Bill",
    },
  ];

  const suggestedDocs = [
    {
      title: "Aadhar Card",
      description: "Official government-issued identity card",
      icon: "https://cdn.iconscout.com/icon/free/png-512/free-aadhaar-logo-icon-download-in-svg-png-gif-file-formats--unique-identity-india-citizen-information-details-logos-icons-1747945.png?f=webp&w=512",
    },
    {
      title: "Pan Card",
      description: "Permanent Account Number issued by the government",
      icon: "https://vittmantri.com/Content/vittmantri.com/UploadedImage/RealImage/73418-182217_pan-card-pan-card-with-cartoon-hd-png.png",
    },
    {
      title: "Passport",
      description: "International travel document",
      icon: "https://www.rawshorts.com/freeicons/wp-content/uploads/2017/01/blue_travelpictpassport_1484336852-1.png",
    },
  ];

  const filteredData = dummyDataArray.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-800 text-white">
        <div className="h-full flex flex-col py-6">
          <div className="px-6 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">SmartDoc</span>
            </div>
          </div>
          <nav className="flex-1 px-3">
            {[
              { name: "Home", icon: Home, tab: "home" },
              { name: "Documents", icon: FileText, tab: "documents" },
              { name: "Search", icon: Search, tab: "search" },
              { name: "Storage", icon: HardDrive, tab: "storage" },
              { name: "Settings", icon: Settings, tab: "settings" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setSelectedTab(item.tab)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  selectedTab === item.tab
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
          <div className="px-3 mt-6">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-indigo-100 hover:bg-indigo-700 hover:text-white">
              <User className="h-5 w-5" />
              <span className="font-medium">Profile</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-indigo-100 hover:bg-indigo-700 hover:text-white">
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <div className="p-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, Alex</h1>
              <p className="text-gray-600 mt-1">Manage your digital documents securely</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow">
                <Bell className="h-5 w-5 text-indigo-600" />
              </button>
              <img
                src="/api/placeholder/40/40"
                alt="Profile"
                className="h-10 w-10 rounded-full border-2 border-indigo-500"
              />
            </div>
          </header>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <section className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {["Upload Document", "Request Document", "Share Document", "Verify Document"].map((action, index) => (
                    <button
                      key={index}
                      className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                      onClick={() => action === "Upload Document" && setIsVisible(true)}
                    >
                      <Plus className="h-8 w-8 text-indigo-600 mb-2" />
                      <span className="text-sm font-medium text-gray-700">{action}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Recent Documents */}
              <section className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Documents</h2>
                <div className="space-y-4">
                  {suggestedDocs.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer"
                      onClick={() => handleDocumentClick(doc)}
                    >
                      <img src={doc.icon} alt="" className="w-12 h-12 rounded-lg object-cover mr-4" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                        <p className="text-sm text-gray-600">{doc.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Search */}
              <section className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Documents</h2>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for documents..."
                    className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </section>

              {/* Document Categories */}
              <section className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
                <div className="space-y-2">
                  {["Personal", "Financial", "Educational", "Health", "Legal"].map((category, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      <span className="font-medium text-gray-700">{category}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Storage Usage */}
              <section className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Storage Usage</h2>
                <div className="mb-2">
                  <div className="h-4 bg-gray-200 rounded-full">
                    <div className="h-4 bg-indigo-600 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">3.25 GB of 5 GB used</p>
              </section>
            </div>
          </div>

          {/* Selected Document Details */}
          {selectedDocument && (
            <section className="mt-8 bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">{selectedDocument.title}</h2>
                  <p className="text-gray-600">{selectedDocument.description}</p>
                </div>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <img src={selectedDocument.icon || selectedDocument.logo} alt="" className="w-24 h-24 rounded-lg object-cover" />
                <div>
                  {selectedDocument.governmentType && (
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      {selectedDocument.governmentType}
                    </span>
                  )}
                  {selectedDocument.documentType && (
                    <p className="text-sm text-gray-600">Type: {selectedDocument.documentType}</p>
                  )}
                </div>
              </div>
              <button className="flex items-center justify-center w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700 transition-colors">
                <ExternalLink className="h-5 w-5 mr-2" />
                View Full Document
              </button>
            </section>
          )}
        </div>
      </main>

      {/* Modal for adding new document */}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Upload New Document</h3>
              <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4"
            >
              <p className="text-gray-600 mb-2">Drag & Drop your files here</p>
              <p className="text-gray-400 mb-4">or</p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <input
              type="text"
              placeholder="Document Type"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Document Title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Document Description"
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
            <button
              onClick={handleUpload}
              className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700 transition-colors"
            >
              Upload Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


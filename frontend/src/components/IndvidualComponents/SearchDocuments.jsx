import React, { useState } from "react";
import { Search, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const SearchDocuments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState('role');
  const [requestForm, setRequestForm] = useState({
    role: "",
    name: "",
    phone: "",
    dob: "",
    UID: "",
    aadhaar: "",
    documentType: "",
    issuingAuthority: ""
  });
  const [selectedDocument, setSelectedDocument] = useState(null);

  const dummyData = [
    {
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXIHCJJ2QTxfumQq23zNyWNqWX4nbz4elmSw&s",
      title: "Gurugram University, Gurugram",
      description: "Gurugram University, Gurugram is issuing their Digital documents, through SmartDoc",
      governmentType: "State Government",
      studentDocumentType: ["ID Card", "Transcript", "Enrollment Certificate"],
      employeeDocumentType: ["Experience Certificate", "Service Certificate", "Salary Certificate"]
    },
  ];

  const filteredData = dummyData.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openRequestModal = (doc) => {
    setSelectedDocument(doc);
    setRequestForm(prev => ({
      role: "",
      name: "",
      phone: "",
      dob: "",
      UID: "",
      aadhaar: "",
      documentType: "",
      issuingAuthority: doc.title
    }));
    setModalStep('role');
    setIsModalOpen(true);
  };

  const handleRoleSelection = (selectedRole) => {
    setRequestForm(prev => ({
      ...prev,
      role: selectedRole
    }));
    setModalStep('documentType');
  };

  const handleDocumentTypeSelection = (type) => {
    setRequestForm(prev => ({
      ...prev,
      documentType: type
    }));
    setModalStep('details');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentRequest = async (e) => {
    e.preventDefault();
    
    const requiredFields = ['name', 'phone', 'aadhaar', 'documentType', 'role'];
    const missingFields = requiredFields.filter(field => !requestForm[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/requestdoc`, requestForm);
      
      toast.success("Document request submitted successfully!", {
        description: `Request ID: ${response.data.requestId}`,
        action: {
          label: "Close",
          onClick: () => {}
        }
      });

      // Reset form and close modal
      setRequestForm({
        role: "",
        name: "",
        phone: "",
        dob: "",
        UID: "",
        aadhaar: "",
        documentType: "",
        issuingAuthority: ""
      });
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to submit document request", {
        description: error.response?.data?.error || "Please try again later"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative mb-6">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents by name, type, or description..."
          className="w-full p-4 pr-12"
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Search Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((doc, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <img
                src={doc.logo}
                alt={doc.title}
                className="w-12 h-12 mr-4 rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                <p className="text-sm text-gray-600">Digital Document Services</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">{doc.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                {doc.governmentType}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => openRequestModal(doc)}
              >
                Request Document <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Request Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalStep === 'role' && "Select Your Role"}
              {modalStep === 'documentType' && "Select Document Type"}
              {modalStep === 'details' && "Fill Document Request Details"}
            </DialogTitle>
            <DialogDescription>
              {modalStep === 'role' && "Are you a student or an employee?"}
              {modalStep === 'documentType' && `Choose the type of document for ${requestForm.role}s`}
              {modalStep === 'details' && "Provide the required information for your document request"}
            </DialogDescription>
          </DialogHeader>

          {modalStep === 'role' && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleRoleSelection('student')}
                className="w-full"
              >
                Student
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRoleSelection('employee')}
                className="w-full"
              >
                Employee
              </Button>
            </div>
          )}

          {modalStep === 'documentType' && (
            <div className="grid grid-cols-2 gap-4">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setModalStep('role')}
                className="absolute left-4 top-4 flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Change Role
              </Button>
              {(requestForm.role === 'student' 
                ? selectedDocument.studentDocumentType 
                : selectedDocument.employeeDocumentType
              ).map((type, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleDocumentTypeSelection(type)}
                  className="w-full"
                >
                  {type}
                </Button>
              ))}
            </div>
          )}

          {modalStep === 'details' && (
            <form onSubmit={handleDocumentRequest} className="space-y-4">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setModalStep('documentType')}
                className="mb-4 flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Change Document Type
              </Button>

              <Input
                name="name"
                value={requestForm.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
              />
              <Input
                name="phone"
                value={requestForm.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                type="tel"
                required
              />
              <Input
                name="dob"
                value={requestForm.dob}
                onChange={handleInputChange}
                placeholder="Date of Birth"
                type="date"
              />
              <Input
                name="UID"
                value={requestForm.UID}
                onChange={handleInputChange}
                placeholder="Unique ID (Roll Number, Employee ID, etc.)"
              />
              <Input
                name="aadhaar"
                value={requestForm.aadhaar}
                onChange={handleInputChange}
                placeholder="Aadhaar Number"
                required
              />
              <Input
                name="role"
                value={requestForm.role}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
              <Input
                name="documentType"
                value={requestForm.documentType}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
              <Input
                name="issuingAuthority"
                value={requestForm.issuingAuthority}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
              <Button type="submit" className="w-full">
                Submit Request <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchDocuments;
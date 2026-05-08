import React, { useState } from "react";
import {
  Search,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Database,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

const SearchDocuments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState("role");
  const [modalTab, setModalTab] = useState("request");
  const [requestForm, setRequestForm] = useState({
    role: "",
    name: "",
    phone: "",
    dob: "",
    parentDetails: {
      fatherName: "",
      motherName: "",
    },
    placeOfBirth: "",
    UID: "",
    aadhaar: "",
    documentType: "",
    issuingAuthority: "",
    companyName: "",
    startDate: "",
    endDate: "",
    designation: "",
    registrationNumber: "",
  });
  const [selectedDocument, setSelectedDocument] = useState(null);

  const authorities = [
    {
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXIHCJJ2QTxfumQq23zNyWNqWX4nbz4elmSw&s",
      title: "Gurugram University, Gurugram",
      description: "Issuing digital academic documents through SmartDoc",
      governmentType: "State Government",
      documentTypes: {
        student: ["ID Card"],
        employee: ["Experience Certificate"],
      },
      specialRequirements: {
        "Experience Certificate": [
          "companyName",
          "startDate",
          "endDate",
          "designation",
        ],
      },
    },
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Seal_of_the_Municipal_Corporation_Of_Delhi.svg/1200px-Seal_of_the_Municipal_Corporation_Of_Delhi.svg.png",
      title: "Municipal Corporation of Delhi",
      description: "Issuing official government documents",
      governmentType: "State Government",
      documentTypes: {
        citizen: ["Birth Certificate"],
      },
      specialRequirements: {
        "Birth Certificate": [
          "parentDetails.fatherName",
          "parentDetails.motherName",
          "placeOfBirth",
        ],
      },
    },
  ];

  const testCredentials = {
    "Gurugram University, Gurugram": [
      {
        id: "gu-raghav-confirmed",
        status: "Confirmed",
        statusIcon: CheckCircle2,
        statusClass:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
        note: "Confirmed by an existing issued and verified ID Card request in MongoDB.",
        formData: {
          role: "student",
          documentType: "ID Card",
          name: "Raghav Sharma",
          phone: "7042019181",
          aadhaar: "987456321123",
          dob: "2004-07-25",
          UID: "25465",
        },
      },
      {
        id: "gu-priyanshu-db",
        status: "DB Match",
        statusIcon: Database,
        statusClass:
          "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
        note: "Present in both User and verifierDB collections, but not confirmed by existing request history.",
        formData: {
          role: "student",
          documentType: "ID Card",
          name: "Priyanshu",
          phone: "9783465208",
          aadhaar: "785736369216",
          UID: "GU-TEST-001",
        },
      },
    ],
    "Municipal Corporation of Delhi": [
      {
        id: "mcd-raghav-confirmed",
        status: "Confirmed",
        statusIcon: CheckCircle2,
        statusClass:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
        note: "Confirmed by existing verified Birth Certificate requests in MongoDB.",
        formData: {
          role: "citizen",
          documentType: "Birth Certificate",
          name: "Raghav Sharma",
          phone: "7042019181",
          aadhaar: "987456321123",
          dob: "2004-07-25",
          UID: "REG-123456",
          registrationNumber: "REG-123456",
          placeOfBirth: "New Delhi",
          parentDetails: {
            fatherName: "Pradeep Sharma",
            motherName: "Meenu Sharma",
          },
        },
      },
    ],
  };

  const filteredData = authorities.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openRequestModal = (doc) => {
    setSelectedDocument(doc);
    setRequestForm({
      role: "",
      name: "",
      phone: "",
      dob: "",
      parentDetails: {
        fatherName: "",
        motherName: "",
      },
      placeOfBirth: "",
      UID: "",
      aadhaar: "",
      documentType: "",
      issuingAuthority: doc.title,
      companyName: "",
      startDate: "",
      endDate: "",
      designation: "",
      registrationNumber: "",
    });
    setModalStep("role");
    setModalTab("request");
    setIsModalOpen(true);
  };

  const handleRoleSelection = (selectedRole) => {
    setRequestForm((prev) => ({
      ...prev,
      role: selectedRole,
    }));
    setModalStep("documentType");
  };

  const handleDocumentTypeSelection = (type) => {
    setRequestForm((prev) => ({
      ...prev,
      documentType: type,
    }));
    setModalStep("details");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested parentDetails inputs
    if (name.startsWith("parentDetails.")) {
      const parentField = name.split(".")[1];
      setRequestForm((prev) => ({
        ...prev,
        parentDetails: {
          ...prev.parentDetails,
          [parentField]: value,
        },
      }));
    } else {
      setRequestForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const applyTestCredential = (credential) => {
    setRequestForm((prev) => ({
      ...prev,
      issuingAuthority: selectedDocument.title,
      role: credential.formData.role,
      documentType: credential.formData.documentType,
      name: credential.formData.name || "",
      phone: credential.formData.phone || "",
      aadhaar: credential.formData.aadhaar || "",
      dob: credential.formData.dob || "",
      UID: credential.formData.UID || "",
      companyName: credential.formData.companyName || "",
      startDate: credential.formData.startDate || "",
      endDate: credential.formData.endDate || "",
      designation: credential.formData.designation || "",
      registrationNumber: credential.formData.registrationNumber || "",
      placeOfBirth: credential.formData.placeOfBirth || "",
      parentDetails: {
        fatherName: credential.formData.parentDetails?.fatherName || "",
        motherName: credential.formData.parentDetails?.motherName || "",
      },
    }));
    setModalStep("details");
    setModalTab("request");
  };

  const validateForm = () => {
    const requiredFields = ["name", "phone", "aadhaar", "documentType", "role"];

    // Check for additional requirements based on document type and authority
    if (selectedDocument.specialRequirements?.[requestForm.documentType]) {
      const specialRequirements =
        selectedDocument.specialRequirements[requestForm.documentType];
      specialRequirements.forEach((field) => {
        const [parentKey, childKey] = field.split(".");
        if (parentKey === "parentDetails") {
          requiredFields.push(field);
        } else {
          requiredFields.push(field);
        }
      });
    }

    const missingFields = requiredFields.filter((field) => {
      if (field.includes("parentDetails.")) {
        const [parentKey, childKey] = field.split(".");
        return !requestForm[parentKey][childKey];
      }
      return !requestForm[field];
    });

    return missingFields;
  };

  const handleDocumentRequest = async (e) => {
    e.preventDefault();
  
    // Create a new object with all potential fields
    const completeRequestForm = {
      ...requestForm,
      // Add default values for potentially missing fields
      registrationNumber: requestForm.registrationNumber || "REG-123456",
      parentDetails: {
        ...requestForm.parentDetails,
        fatherName: requestForm.parentDetails.fatherName || "Pradeep Sharma",
        motherName: requestForm.parentDetails.motherName || "Meenu Sharma",
      },
      placeOfBirth: requestForm.placeOfBirth || "New Delhi",
    };
  
    const missingFields = validateForm();
  
    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/requestdoc`,
        completeRequestForm
      );
  
      toast.success("Document request submitted successfully!", {
        description: `Request ID: ${response.data.requestId}`,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
  
      console.log('COMPLETE FORM',completeRequestForm);
      // Reset form and close modal
      setRequestForm({
        role: "",
        name: "",
        phone: "",
        dob: "",
        parentDetails: {
          fatherName: "",
          motherName: "",
        },
        placeOfBirth: "",
        UID: "",
        aadhaar: "",
        documentType: "",
        issuingAuthority: "",
        companyName: "",
        startDate: "",
        endDate: "",
        designation: "",
        registrationNumber: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to submit document request", {
        description: error.response?.data?.error || "Please try again later",
      });
    }
  };

  const renderRoleSelection = () => {
    const availableRoles = Object.keys(selectedDocument.documentTypes || {});
    return (
      <div className="grid grid-cols-2 gap-4">
        {availableRoles.map((role, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => handleRoleSelection(role)}
            className="w-full"
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Button>
        ))}
      </div>
    );
  };

  const renderDocumentTypeSelection = () => {
    const documentTypes =
      selectedDocument.documentTypes?.[requestForm.role] || [];
    return (
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setModalStep("role")}
          className="absolute left-4 top-4 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Change Role
        </Button>
        {documentTypes.map((type, index) => (
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
    );
  };

  const renderDetailsForm = () => {
    const isSpecialCase =
      selectedDocument.specialRequirements?.[requestForm.documentType];

    return (
      <form onSubmit={handleDocumentRequest} className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setModalStep("documentType")}
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

        {/* Special fields for Birth Certificate */}
        {isSpecialCase && (
          <>
            <Input
              name="parentDetails.fatherName"
              value={requestForm.parentDetails.fatherName}
              onChange={handleInputChange}
              placeholder="Father's Name"
              required
            />
            <Input
              name="parentDetails.motherName"
              value={requestForm.parentDetails.motherName}
              onChange={handleInputChange}
              placeholder="Mother's Name"
              required
            />
            <Input
              name="placeOfBirth"
              value={requestForm.placeOfBirth}
              onChange={handleInputChange}
              placeholder="Place of Birth"
              required
            />
          </>
        )}

        <Input
          name="UID"
          value={requestForm.UID}
          onChange={handleInputChange}
          placeholder="Unique Document ID (Roll Number, Employee ID, Registration Number, etc.)"
        />
        {requestForm.documentType === "Experience Certificate" && (
          <>
            <Input
              name="companyName"
              value={requestForm.companyName}
              onChange={handleInputChange}
              placeholder="Company Name"
              required
            />
            <Input
              name="designation"
              value={requestForm.designation}
              onChange={handleInputChange}
              placeholder="Designation"
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="startDate"
                value={requestForm.startDate}
                onChange={handleInputChange}
                type="date"
                placeholder="Start Date"
                required
              />
              <Input
                name="endDate"
                value={requestForm.endDate}
                onChange={handleInputChange}
                type="date"
                placeholder="End Date"
                required
              />
            </div>
          </>
        )}
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
    );
  };

  const renderTestCredentials = () => {
    const credentials = testCredentials[selectedDocument?.title] || [];

    if (credentials.length === 0) {
      return (
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          No test credentials are configured for this authority.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
          These entries come from the current local Mongo data. `Confirmed`
          means there is already successful request history. `DB Match` means
          the user exists in the collections the backend checks.
        </div>
        {credentials.map((credential) => {
          const StatusIcon = credential.statusIcon;
          return (
            <div key={credential.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${credential.statusClass}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {credential.status}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {credential.formData.documentType}
                    </span>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <div>
                      <div className="font-medium text-foreground">
                        {credential.formData.name}
                      </div>
                      <div>Phone: {credential.formData.phone}</div>
                      <div>Aadhaar: {credential.formData.aadhaar}</div>
                    </div>
                    <div>
                      <div>Role: {credential.formData.role}</div>
                      {credential.formData.UID && (
                        <div>UID: {credential.formData.UID}</div>
                      )}
                      {credential.formData.registrationNumber && (
                        <div>
                          Registration: {credential.formData.registrationNumber}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {credential.note}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => applyTestCredential(credential)}
                >
                  Apply
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
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
                <p className="text-sm text-gray-600">
                  Digital Document Services
                </p>
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
                className="mr-10"
                onClick={() => openRequestModal(doc)}
              >
                Request Document <ExternalLink className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Request Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalStep === "role" && "Select Your Role"}
              {modalStep === "documentType" && "Select Document Type"}
              {modalStep === "details" && "Fill Document Request Details"}
            </DialogTitle>
            <DialogDescription>
              {modalStep === "role" &&
                "Select the appropriate role for your document request"}
              {modalStep === "documentType" &&
                `Choose the type of document for ${requestForm.role}s`}
              {modalStep === "details" &&
                "Provide the required information for your document request"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={modalTab} onValueChange={setModalTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">Request Form</TabsTrigger>
              <TabsTrigger value="credentials">Test Credentials</TabsTrigger>
            </TabsList>
            <TabsContent value="request" className="pt-2">
              {modalStep === "role" && selectedDocument && renderRoleSelection()}
              {modalStep === "documentType" && renderDocumentTypeSelection()}
              {modalStep === "details" && renderDetailsForm()}
            </TabsContent>
            <TabsContent value="credentials" className="pt-2">
              {renderTestCredentials()}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchDocuments;

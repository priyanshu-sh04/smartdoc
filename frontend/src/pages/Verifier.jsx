import React, { useState } from 'react';
import { FileText, ChevronRight, Bell, Info, CheckCircle, XCircle, Eye, Home, Search, AlertTriangle, Clock, Filter } from 'lucide-react';

const VerificationPage = () => {
  const [showMismatchDetails, setShowMismatchDetails] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleInfoClick = (index) => {
    setShowMismatchDetails(index === showMismatchDetails ? null : index);
  };

  const handleApproval = (docId, action) => {
    console.log(`Document ${docId} ${action} approved`);
  };

  const verificationRequests = [
    {
      docType: "Academic Transcript",
      user: "John Doe",
      date: "12/08/2023",
      anomalyScore: "85%",
      crossDocMatching: "Yes",
      mismatchedFields: [],
      docId: "AT-2024-001",
      institution: "Harvard University",
      priority: "high",
      status: "pending",
      history: ["Submitted for review", "Cross document matching passed"],
      document1: { name: "John Doe", grade: "A", dob: "12/08/1995", major: "Computer Science", gpa: "3.8" },
      document2: { name: "John Doe", grade: "A", dob: "12/08/1995", major: "Computer Science", gpa: "3.8" },
    },
    {
      docType: "Birth Certificate",
      user: "Jane Smith",
      date: "11/08/2023",
      anomalyScore: "45%",
      crossDocMatching: "No",
      priority: "medium",
      status: "review",
      institution: "City Hall Records",
      mismatchedFields: [
        { field: "Name", doc1Value: "John Doe", doc2Value: "Jane Smith" },
        { field: "Date of Birth", doc1Value: "01/01/1990", doc2Value: "02/02/1991" },
      ],
      docId: "BC-2024-005",
      history: ["Submitted for review", "Cross document mismatch"],
      document1: { name: "John Doe", dob: "01/01/1990", place: "New York", nationality: "US" },
      document2: { name: "Jane Smith", dob: "02/02/1991", place: "New York", nationality: "US" },
    },
    {
      docType: "Tax Certificate",
      user: "Sam Wilson",
      date: "10/15/2023",
      anomalyScore: "98%",
      crossDocMatching: "Yes",
      priority: "low",
      status: "pending",
      institution: "IRS",
      mismatchedFields: [],
      docId: "TC-2024-045",
      history: ["Submitted for review", "Cross document matching passed"],
      document1: { name: "Sam Wilson", amount: "$5000", year: "2023", type: "W2" },
      document2: { name: "Sam Wilson", amount: "$5000", year: "2023", type: "W2" },
    },
    {
      docType: "Employment Contract",
      user: "Emily Chen",
      date: "12/10/2023",
      anomalyScore: "92%",
      crossDocMatching: "Yes",
      priority: "high",
      status: "pending",
      institution: "Tech Corp Inc",
      mismatchedFields: [],
      docId: "EC-2024-089",
      history: ["Submitted for review", "Cross document matching passed"],
      document1: { name: "Emily Chen", position: "Senior Developer", salary: "$120,000", startDate: "01/15/2024" },
      document2: { name: "Emily Chen", position: "Senior Developer", salary: "$120,000", startDate: "01/15/2024" },
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'low': return <Info className="h-5 w-5 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 text-blue-600">
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50">
              <FileText className="h-5 w-5" />
              <span>Issued Documents</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50">
              <Search className="h-5 w-5" />
              <span>Search Documents</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verification Requests</h1>
            <p className="text-gray-600">Review the documents pending verification</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setFilter('review')}
                className={`px-4 py-2 rounded-lg ${filter === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Review
              </button>
            </div>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Verification Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verificationRequests.map((doc, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mt-2">{doc.docType}</h3>
                  <p className="text-sm text-gray-500">{doc.institution}</p>
                </div>
                {getPriorityIcon(doc.priority)}
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">User:</span>
                  <span className="text-gray-900 font-medium">{doc.user}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date:</span>
                  <span className="text-gray-900">{doc.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Anomaly Score:</span>
                  <span className={`font-medium ${parseInt(doc.anomalyScore) > 80 ? 'text-red-600' : 'text-green-600'}`}>
                    {doc.anomalyScore}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Cross Doc Match:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${doc.crossDocMatching === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {doc.crossDocMatching}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleApproval(doc.docId, 'approve')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => handleApproval(doc.docId, 'reject')}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => handleInfoClick(index)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mismatch Info Details Modal */}
        {showMismatchDetails !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Document Comparison</h3>
                <button 
                  onClick={() => setShowMismatchDetails(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Document 1 */}
                <div className="p-6 bg-gray-50 rounded-xl shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-4">Document 1</h4>
                  <div className="space-y-3">
                    {verificationRequests[showMismatchDetails].document1 && Object.entries(verificationRequests[showMismatchDetails].document1).map(([key, value]) => (
                      <div key={key} className={`p-2 rounded ${verificationRequests[showMismatchDetails].mismatchedFields.some(field => field.field.toLowerCase() === key.toLowerCase()) ? 'bg-red-100 text-red-800' : 'bg-white'}`}>
                        <span className="font-semibold">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Document 2 */}
                <div className="p-6 bg-gray-50 rounded-xl shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-4">Document 2</h4>
                  <div className="space-y-3">
                    {verificationRequests[showMismatchDetails].document2 && Object.entries(verificationRequests[showMismatchDetails].document2).map(([key, value]) => (
                      <div key={key} className={`p-2 rounded ${verificationRequests[showMismatchDetails].mismatchedFields.some(field => field.field.toLowerCase() === key.toLowerCase()) ? 'bg-red-100 text-red-800' : 'bg-white'}`}>
                        <span className="font-semibold">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
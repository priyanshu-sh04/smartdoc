import React from "react";
import { CheckCircle, Clock, ExternalLink } from "lucide-react";

const RecentDocuments = ({ documents }) => (
  <section className="bg-white rounded-2xl shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Documents</h2>
    <div className="space-y-6">
      {documents.map((doc, index) => (
        <div
          key={index}
          className="group flex items-start p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <div className="flex-shrink-0">
            <img
              src={doc.icon}
              alt=""
              className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
            />
          </div>
          <div className="flex-1 ml-6">
            <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
            <p className="mt-2 text-gray-600">{doc.description}</p>
            <a
              href={doc.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View Document
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default RecentDocuments;

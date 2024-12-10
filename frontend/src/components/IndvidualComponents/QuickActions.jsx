import React from "react";
import { Plus } from "lucide-react";

const QuickActions = () => (
  <section className="bg-white rounded-2xl shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {["Request Document", "Share Document"].map((action, index) => (
        <button
          key={index}
          className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
        >
          <Plus className="h-8 w-8 text-indigo-600 mb-2" />
          <span className="text-sm font-medium text-gray-700">{action}</span>
        </button>
      ))}
    </div>
  </section>
);

export default QuickActions;

import React, { useState } from 'react';
import { ShieldCheck, Home, ClipboardList, Plus, FileClock, PieChart, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const sidebarItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: ClipboardList, label: 'Document Templates', href: '/templates' },
  { icon: Plus, label: 'Bulk Document Issuance', href: '/bulk-issuance' },
  { icon: FileClock, label: 'Document Requests', href: '/requests' },
  { icon: PieChart, label: 'Analytics and Reports', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className="flex items-center justify-between p-4">
        <div className={`flex items-center space-x-2 ${isCollapsed && "justify-center"}`}>
          <ShieldCheck className="h-8 w-8 text-blue-600" />
          {!isCollapsed && <span className="text-xl font-bold">SmartDoc</span>}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-2 rounded-md hover:bg-gray-100"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex-1 space-y-2 py-4 px-2 overflow-y-auto">
        {sidebarItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${index === 0 ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
          >
            <item.icon className={`h-5 w-5 ${isCollapsed ? "mx-auto" : "mr-2"}`} />
            {!isCollapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
}


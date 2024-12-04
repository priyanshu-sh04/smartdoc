import React, { useState } from 'react';
import { ShieldCheck, Home, ClipboardList, Plus, PieChart, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ 
  onHomeClick,
  onTemplatesClick,
  onBulkIssuanceClick,
  onAnalyticsClick,
  onSettingsClick
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Dashboard'); // Track selected item

  const sidebarItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      onClick: () => {
        setSelectedItem('Dashboard');
        onHomeClick();
      }
    },
    { 
      icon: ClipboardList, 
      label: 'Document Templates', 
      onClick: () => {
        setSelectedItem('Document Templates');
        onTemplatesClick();
      }
    },
    { 
      icon: Plus, 
      label: 'Bulk Document Issuance', 
      onClick: () => {
        setSelectedItem('Bulk Document Issuance');
        onBulkIssuanceClick();
      }
    },
    { 
      icon: PieChart, 
      label: 'Analytics and Reports', 
      onClick: () => {
        setSelectedItem('Analytics and Reports');
        onAnalyticsClick();
      }
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      onClick: () => {
        setSelectedItem('Settings');
        onSettingsClick();
      }
    },
  ];

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-indigo-700 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-indigo-500">
        <div className={`flex items-center space-x-2 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="p-1.5 bg-white/10 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold text-white">SmartDoc</span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-2 rounded-lg hover:bg-indigo-500 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-white" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-white" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 py-4 px-2 overflow-y-auto">
        {sidebarItems.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`flex items-center w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group 
              ${selectedItem === item.label
                ? "bg-indigo-400 text-white font-semibold shadow-sm" 
                : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
              }
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <item.icon 
              className={`h-5 w-5 transition-colors duration-200 
                ${selectedItem === item.label
                  ? "text-white" 
                  : "text-indigo-100 group-hover:text-white"
                }
                ${isCollapsed ? "mx-auto" : "mr-3"}
              `} 
            />
            {!isCollapsed && (
              <span className="truncate">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-500">
        <button
          onClick={() => {
            setSelectedItem('Help & Support');
            onSettingsClick();
          }}
          className={`flex items-center w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group
            ${selectedItem === 'Help & Support'
              ? "bg-white/20 text-white font-semibold shadow-sm"
              : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
            }
            ${isCollapsed ? "justify-center" : ""}
          `}
        >
          <Settings 
            className={`h-5 w-5 transition-colors duration-200
              ${selectedItem === 'Help & Support'
                ? "text-white"
                : "text-indigo-100 group-hover:text-white"
              }
              ${isCollapsed ? "mx-auto" : "mr-3"}
            `}
          />
          {!isCollapsed && (
            <span className="truncate">Help & Support</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
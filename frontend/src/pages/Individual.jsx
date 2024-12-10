import React, { useState } from "react";
import Sidebar from "../components/IndvidualComponents/Sidebar";
import Header from "../components/IndvidualComponents/Header";
import QuickActions from "../components/IndvidualComponents/QuickActions";
import RecentDocuments from "../components/IndvidualComponents/RecentDocuments";
import SearchDocuments from "../components/IndvidualComponents/SearchDocuments";
import Settings from "@/components/IndvidualComponents/Settings";
import AvailableDocuments from "@/components/IndvidualComponents/AvailableDocuments";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("home");

  const dummyData = [
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <Header />
        {selectedTab === "home" && (
          <>
            <QuickActions />
            <br/>
            <AvailableDocuments/>
            <br/>
            <RecentDocuments documents={dummyData} />
          </>
        )}
        {selectedTab === "search" && <SearchDocuments />}
        {selectedTab === "settings" && <Settings />}
      </main>
    </div>
  );
};

export default Dashboard;

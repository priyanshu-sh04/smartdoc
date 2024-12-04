import React, { useState } from "react";
import {
  FileText,
  Bell,
  Home,
  BarChart2,
  Users,
  Zap,
  Shield,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

const DashboardPage = () => (
  <div className="space-y-6">
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          Welcome to SmartDoc Verification
        </CardTitle>
        <CardDescription>
          Your AI-powered document verification platform for Bharat Cert
          Organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Documents
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                +0% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                100% of total documents
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                0% of total documents
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                0% of total documents
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>

    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Verification Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Verified</span>
              </div>
              <span className="font-bold">100%</span>
            </div>
            <Progress value={100} className="h-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span>Pending</span>
              </div>
              <span className="font-bold">0%</span>
            </div>
            <Progress value={0} className="h-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>Rejected</span>
              </div>
              <span className="font-bold">0%</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {[
                { type: "verified", doc: "ID Card", user: "Sapana Pokharal" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  {activity.type === "verified" && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {activity.type === "pending" && (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  )}
                  {activity.type === "rejected" && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{activity.doc}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user}
                    </p>
                  </div>
                  <Badge
                    variant={
                      activity.type === "verified"
                        ? "success"
                        : activity.type === "pending"
                        ? "warning"
                        : "destructive"
                    }
                    className="ml-auto"
                  >
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>

    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Pending Verifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md flex flex-row gap-2">
          No pending Verifications, auto verify is On <CheckCircle className="text-green-700"/>
        </div>
      </CardContent>
    </Card>
  </div>
);

const VerifiedDocumentsPage = () => (
  <Card className="shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-2xl font-bold">Verified Documents</CardTitle>
      <FileText className="h-6 w-6 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">
        Explore and manage documents that have been verified.
      </p>
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-2">
            <CardTitle className="text-lg font-semibold">Student ID</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Verified
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <dl className="grid grid-cols-1 gap-1 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Owner:</dt>
                <dd>Sapana Pokharal</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">
                  Issued On:
                </dt>
                <dd>December 5, 2024</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">
                  Issuing Authority:
                </dt>
                <dd>Dronacharya College of Engineering</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">
                  Digital Certificate:
                </dt>
                <dd>Issued</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">
                  AI Verified:
                </dt>
                <dd>Yes</dd>
              </div>
            </dl>
            <Button variant="link" className="mt-2 p-0">
              View Document
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </CardContent>
  </Card>
);

const UsersPage = () => (
  <Card className="shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-2xl font-bold">User Management</CardTitle>
      <Users className="h-6 w-6 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">
        View, edit, and manage user roles and permissions seamlessly.
      </p>
      <div className="rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Name
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Email
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Role
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Status
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className="p-4 align-middle">John Doe</td>
              <td className="p-4 align-middle">john@example.com</td>
              <td className="p-4 align-middle">Admin</td>
              <td className="p-4 align-middle">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Active
                </Badge>
              </td>
              <td className="p-4 align-middle">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="ml-2">
                  Deactivate
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

const AnalyticsPage = () => (
  <Card className="shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-2xl font-bold">Analytics Dashboard</CardTitle>
      <BarChart2 className="h-6 w-6 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">
        Explore key metrics and data trends for better decision-making.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">
              +180 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Documents Verified
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">742</div>
            <p className="text-xs text-muted-foreground">
              +22% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </CardContent>
  </Card>
);

const AIInsightsPage = () => (
  <Card className="shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-2xl font-bold">AI Insights</CardTitle>
      <Zap className="h-6 w-6 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">
        Discover AI-powered insights to optimize processes and enhance
        efficiency.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fraud Detection Accuracy
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Document Processing Time
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 sec</div>
            <p className="text-xs text-muted-foreground">
              -0.5 sec from last week
            </p>
          </CardContent>
        </Card>
      </div>
    </CardContent>
  </Card>
);

const VerificationPage = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const renderCurrentView = () => {
    switch (activeView) {
      case "verified-documents":
        return <VerifiedDocumentsPage />;
      case "users":
        return <UsersPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "ai-insights":
        return <AIInsightsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="hidden w-64 bg-indigo-700 text-white lg:block">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-center space-x-2 py-6">
            <Shield className="h-8 w-8" />
            <span className="text-2xl font-bold">SmartDoc</span>
          </div>
          <ScrollArea className="flex-1 px-3">
            <nav className="space-y-2">
              {[
                { name: "Dashboard", icon: Home },
                { name: "Verified Documents", icon: FileText },
                { name: "Users", icon: Users },
                { name: "Analytics", icon: BarChart2 },
                { name: "AI Insights", icon: Zap },
              ].map((item) => (
                <Button
                  key={item.name}
                  onClick={() =>
                    setActiveView(item.name.toLowerCase().replace(" ", "-"))
                  }
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeView === item.name.toLowerCase().replace(" ", "-")
                      ? "bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white"
                      : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
                  }`}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Button>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container w-11/12 mx-auto py-10">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              {activeView
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </header>
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
};

export default VerificationPage;

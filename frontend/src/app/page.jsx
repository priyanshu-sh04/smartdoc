import { Button } from "@/components/ui/button"
import { DocumentList } from "@/components/document-list"
import { MetricsCard } from "@/components/metrics-card"
import { SearchFilters } from "@/components/search-filters"
import { Bell, FileText, Files, Users } from 'lucide-react'

const recentDocuments = [{
  id: "1",
  type: "Student ID",
  recipient: "Sapana Pokharal",
  issuedOn: "December 5, 2024",
  status: "approved",
  digitalCertificate: "issued",
  verified: "true",
  documentLink: "https://ipfs.io/ipfs/QmYAHYrQaxYMZNQ4DsWBWHoPAQD8tL7SaTvu7BhSBbMUog"
}
]

export default function DashboardPage() {
  return (
    (<div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, Dronacharya College of Engineering</h1>
          <p className="text-muted-foreground">
            Issue, manage, and track documents effortlessly
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button>New Document</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricsCard
          title="Total Issued"
          value="5,123"
          icon={<Files />}
          trend={{ value: 12, isPositive: true }} />
        <MetricsCard
          title="Pending Approvals"
          value="128"
          icon={<FileText />}
          trend={{ value: 8, isPositive: false }} />
        <MetricsCard
          title="Templates Created"
          value="47"
          icon={<Users />}
          trend={{ value: 4, isPositive: true }} />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recent Documents</h2>
          <Button variant="link">View all documents</Button>
        </div>
        <SearchFilters />
        <DocumentList documents={recentDocuments} />
      </div>
    </div>)
  );
}


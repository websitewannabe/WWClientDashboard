import PageHeader from "@/components/layout/page-header";
import StatCard from "@/components/dashboard/stat-card";
import AnalyticsPanel from "@/components/dashboard/analytics-panel";
import RecentActivity from "@/components/dashboard/recent-activity";
import InvoicesPanel from "@/components/invoices/invoices-panel";
import TicketsPanel from "@/components/tickets/tickets-panel";
import { FileText, BarChart, HeadphonesIcon, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { formatNumber } from "@/lib/utils";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
    enabled: isAuthenticated
  });

  // Fallback values (will be replaced by actual data from API)
  const pendingInvoices = stats?.pendingInvoices || 3;
  const visitors = stats?.visitors || "4,238";
  const openTickets = stats?.openTickets || 2;
  const nextPayment = stats?.nextPayment || "May 15";

  return (
    <>
      <PageHeader 
        title="Dashboard"
        onRefresh={() => window.location.reload()}
        onExport={() => console.log("Export data")}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Pending Invoices"
          value={pendingInvoices}
          icon={<FileText className="text-xl text-primary-600" />}
          iconBgColor="bg-blue-100"
          iconColor="text-primary-600"
          linkText="View all"
          linkHref="/invoices"
        />
        <StatCard
          title="Website Visitors"
          value={visitors}
          icon={<BarChart className="text-xl text-success-500" />}
          iconBgColor="bg-green-100"
          iconColor="text-success-500"
          linkText="View analytics"
          linkHref="/analytics"
        />
        <StatCard
          title="Open Tickets"
          value={openTickets}
          icon={<HeadphonesIcon className="text-xl text-warning-500" />}
          iconBgColor="bg-amber-100"
          iconColor="text-warning-500"
          linkText="View tickets"
          linkHref="/support"
        />
        <StatCard
          title="Next Payment"
          value={nextPayment}
          icon={<Calendar className="text-xl text-danger-500" />}
          iconBgColor="bg-red-100"
          iconColor="text-danger-500"
          linkText="View schedule"
          linkHref="/invoices"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AnalyticsPanel />
        <RecentActivity />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InvoicesPanel />
        <TicketsPanel />
      </div>
    </>
  );
}

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Invoices from "@/pages/invoices";
import Analytics from "@/pages/analytics";
import Support from "@/pages/support";
import Settings from "@/pages/settings";
import Projects from "@/pages/projects";
import Hosting from "@/pages/hosting";
import Domains from "@/pages/domains";
import SEOReports from "@/pages/seo";
import ContentCalendar from "@/pages/content";
import Resources from "@/pages/resources";
import Products from "@/pages/products";
import Payments from "@/pages/payments";
import Team from "@/pages/team";
import AdminDashboard from "@/pages/admin";
import ClientDetailPage from "@/pages/admin/client-detail";
import AddClientPage from "@/pages/admin/add-client";
import ImportContacts from "@/pages/admin/import-contacts";
import ClientAnalytics from "@/pages/admin/client-analytics";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";
import IntercomProvider from "@/components/intercom/intercom-provider";
import { useState, useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";

function Router() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Use our analytics hook to track page views as the user navigates
  useAnalytics();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="flex flex-col flex-1 transition-all duration-300">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-16 md:pb-6 bg-slate-100">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/invoices" component={Invoices} />
            <Route path="/projects" component={Projects} />
            <Route path="/hosting" component={Hosting} />
            <Route path="/domains" component={Domains} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/seo" component={SEOReports} />
            <Route path="/content" component={ContentCalendar} />
            <Route path="/resources" component={Resources} />
            <Route path="/payments" component={Payments} />
            <Route path="/team" component={Team} />
            <Route path="/support" component={Support} />
            <Route path="/settings" component={Settings} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/client-detail" component={ClientDetailPage} />
            <Route path="/admin/add-client" component={AddClientPage} />
            <Route path="/admin/import-contacts" component={ImportContacts} />
            <Route path="/admin/client-analytics" component={ClientAnalytics} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}

function App() {
  // Initialize Google Analytics when the app loads
  useEffect(() => {
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA();
      console.log('Google Analytics initialized with ID:', import.meta.env.VITE_GA_MEASUREMENT_ID);
    } else {
      console.warn('Google Analytics Measurement ID not found');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <IntercomProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </IntercomProvider>
    </QueryClientProvider>
  );
}

export default App;

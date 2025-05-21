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
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";
import IntercomProvider from "@/components/intercom/intercom-provider";
import { useState } from "react";

function Router() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="flex flex-col flex-1 md:pl-64">
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
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}

function App() {
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

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  LayoutDashboard, 
  FileText, 
  BarChart, 
  HeadphonesIcon, 
  Settings,
  FolderKanban,
  Server,
  Globe,
  Search,
  CalendarDays,
  Paperclip,
  CreditCard,
  Package,
  Shield,
  Users,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LineChart,
  Building
} from "lucide-react";
import { useState } from "react";
import type { User } from "@shared/schema";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  
  // Check if the current location is any of the analytics pages
  const isAnalyticsActive = location === "/analytics" || 
                            location === "/analytics/search-console" || 
                            location === "/analytics/business-profile";

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { path: "/invoices", label: "Invoices", icon: <FileText className="mr-3 h-5 w-5" /> },
    { path: "/projects", label: "Projects", icon: <FolderKanban className="mr-3 h-5 w-5" /> },
    { path: "/hosting", label: "Hosting", icon: <Server className="mr-3 h-5 w-5" /> },
    { path: "/domains", label: "Domains", icon: <Globe className="mr-3 h-5 w-5" /> },
    // Analytics is handled separately with submenu
    { path: "/seo", label: "SEO Reports", icon: <Search className="mr-3 h-5 w-5" /> },
    { path: "/content", label: "Content Calendar", icon: <CalendarDays className="mr-3 h-5 w-5" /> },
    { path: "/resources", label: "Resources", icon: <Paperclip className="mr-3 h-5 w-5" /> },
    { path: "/products", label: "Products", icon: <Package className="mr-3 h-5 w-5" /> },
    { path: "/payments", label: "Payments", icon: <CreditCard className="mr-3 h-5 w-5" /> },
    { path: "/team", label: "Team", icon: <Users className="mr-3 h-5 w-5" /> },
    { path: "/support", label: "Support", icon: <HeadphonesIcon className="mr-3 h-5 w-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="mr-3 h-5 w-5" /> },
    { path: "/admin", label: "Admin Portal", icon: <Shield className="mr-3 h-5 w-5" /> }
  ];
  
  // Analytics submenu items
  const analyticsSubItems = [
    { path: "/analytics", label: "Google Analytics", icon: <BarChart className="h-5 w-5" /> },
    { path: "/analytics/search-console", label: "Google Search Console", icon: <LineChart className="h-5 w-5" /> },
    { path: "/analytics/business-profile", label: "Google Business Profile", icon: <Building className="h-5 w-5" /> }
  ];

  // Mobile sidebar using Sheet component
  const mobileSidebar = (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetContent side="left" className="bg-primary-900 text-white p-0 w-64">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-slate-700 px-4">
            <img 
              src="/assets/images/logo.webp" 
              alt="Company Logo" 
              className="h-10" 
            />
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    location === item.path
                      ? "bg-[#FF5722] text-white [&>svg]:text-white"
                      : "text-[#FF5722] hover:bg-white hover:text-black [&>svg]:text-[#FF5722] hover:[&>svg]:text-black"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          {isAuthenticated && user && (
            <div className="p-4 border-t border-slate-700">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 rounded-full">
                  <AvatarImage 
                    src={user?.profileImageUrl || ""} 
                    alt={`${user?.firstName || ''} ${user?.lastName || ''}`} 
                  />
                  <AvatarFallback>
                    {user?.firstName ? user.firstName.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {user?.firstName || ''} {user?.lastName || ''}
                  </p>
                  <p className="text-xs text-slate-300">{user?.email || ''}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop sidebar
  const desktopSidebar = (
    <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 z-40 bg-primary-900 text-white">
      <div className="flex items-center justify-center h-16 border-b border-slate-700 px-4">
        <img 
          src="/assets/images/logo.webp" 
          alt="Company Logo" 
          className="h-10" 
        />
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {/* Regular nav items before Analytics */}
          {navItems.slice(0, 5).map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                location === item.path
                  ? "bg-[#FF5722] text-white"
                  : "text-[#FF5722] hover:bg-white hover:text-black"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          
          {/* Analytics Submenu */}
          <Collapsible 
            open={isAnalyticsOpen || isAnalyticsActive} 
            onOpenChange={setIsAnalyticsOpen}
            className="w-full"
          >
            <CollapsibleTrigger className="w-full">
              <div 
                className={cn(
                  "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md w-full",
                  isAnalyticsActive
                    ? "bg-[#FF5722] text-white"
                    : "text-[#FF5722] hover:bg-white hover:text-black"
                )}
              >
                <div className="flex items-center">
                  <BarChart className="mr-3 h-5 w-5" />
                  Analytics
                </div>
                {isAnalyticsOpen || isAnalyticsActive ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="ml-2 mt-1 space-y-1">
              {analyticsSubItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    location === item.path
                      ? "bg-[#FF5722] text-white"
                      : "text-[#FF5722] hover:bg-white hover:text-black"
                  )}
                >
                  <div className="ml-6 mr-3">{item.icon}</div>
                  {item.label}
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
          
          {/* Regular nav items after Analytics */}
          {navItems.slice(5).map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                location === item.path
                  ? "bg-[#FF5722] text-white"
                  : "text-[#FF5722] hover:bg-white hover:text-black"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {isAuthenticated && user && (
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarImage 
                src={user?.profileImageUrl || ""} 
                alt={`${user?.firstName || ''} ${user?.lastName || ''}`} 
              />
              <AvatarFallback>
                {user?.firstName ? user.firstName.charAt(0) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {user?.firstName || ''} {user?.lastName || ''}
              </p>
              <p className="text-xs text-slate-300">{user?.email || ''}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {mobileSidebar}
      {desktopSidebar}
    </>
  );
}

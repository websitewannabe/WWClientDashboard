import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
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
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  PanelRight
} from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@shared/schema";

// Define type for navigation items
interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  submenu?: { path: string; label: string }[];
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create a custom event for sidebar collapse state changes
const dispatchCollapseEvent = (isCollapsed: boolean) => {
  const event = new CustomEvent('sidebarCollapseChange', { 
    detail: { isCollapsed },
    bubbles: true 
  });
  window.dispatchEvent(event);
};

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Store collapse state in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      const collapsedState = savedState === 'true';
      setIsCollapsed(collapsedState);
      // Dispatch event on initial load to sync with other components
      dispatchCollapseEvent(collapsedState);
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));

    // Dispatch custom event when sidebar is collapsed/expanded
    dispatchCollapseEvent(newState);
  };

  // Define the type for navigation items with optional submenu
type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
  submenu?: { path: string; label: string }[];
};

const navItems: NavItem[] = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/invoices", label: "Invoices", icon: <FileText className="h-5 w-5" /> },
    { 
      path: "/projects", 
      label: "Projects", 
      icon: <FolderKanban className="h-5 w-5" />,
      submenu: [
        { path: "/projects/active", label: "Active Projects" },
        { path: "/projects/completed", label: "Completed Projects" },
        { path: "/projects/pending", label: "Pending Approval" },
      ]
    },
    { 
      path: "/hosting", 
      label: "Hosting", 
      icon: <Server className="h-5 w-5" />,
      submenu: [
        { path: "/hosting/shared", label: "Shared Hosting" },
        { path: "/hosting/vps", label: "VPS Hosting" },
        { path: "/hosting/dedicated", label: "Dedicated Servers" },
      ]
    },
    { path: "/domains", label: "Domains", icon: <Globe className="h-5 w-5" /> },
    { 
      path: "/analytics", 
      label: "Analytics", 
      icon: <BarChart className="h-5 w-5" />,
      submenu: [
        { path: "/analytics/traffic", label: "Traffic Overview" },
        { path: "/analytics/conversions", label: "Conversion Reports" },
        { path: "/analytics/campaigns", label: "Campaign Performance" },
      ]
    },
    { path: "/seo", label: "SEO Reports", icon: <Search className="h-5 w-5" /> },
    { path: "/content", label: "Content Calendar", icon: <CalendarDays className="h-5 w-5" /> },
    { path: "/resources", label: "Resources", icon: <Paperclip className="h-5 w-5" /> },
    { path: "/products", label: "Products", icon: <Package className="h-5 w-5" /> },
    { path: "/payments", label: "Payments", icon: <CreditCard className="h-5 w-5" /> },
    { path: "/team", label: "Team", icon: <Users className="h-5 w-5" /> },
    { path: "/support", label: "Support", icon: <HeadphonesIcon className="h-5 w-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
    { path: "/admin", label: "Admin Portal", icon: <Shield className="h-5 w-5" /> }
  ];

  // Mobile sidebar using Sheet component
  const mobileSidebar = (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetContent side="left" className="bg-primary-900 text-white p-0 w-64">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 border-b border-slate-700 px-4">
            <img 
              src="/assets/images/logo.webp" 
              alt="Company Logo" 
              className="h-10" 
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(false)}
              className="text-white hover:bg-slate-700"
            >
              <X className="h-5 w-5" />
            </Button>
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
                  <span className="ml-3">{item.label}</span>
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
    <aside 
      className={cn(
        "hidden md:flex flex-col fixed inset-y-0 z-40 bg-primary-900 text-white transition-all duration-300",
        isCollapsed ? "md:w-16" : "md:w-64"
      )}
    >
      <div className={`relative flex ${isCollapsed ? 'flex-col' : 'flex-row'} h-auto px-4 pt-4 mb-4 ${isCollapsed ? 'items-center pb-2' : 'items-center justify-between'}`}>
        <img 
          src="/assets/images/logo_50x50.png" 
          alt="Company Logo"
          className={`h-[50px] w-[50px] ${isCollapsed ? 'mb-2' : ''}`}
        />
        <img 
          src="/assets/images/collapse_icon.svg"
          alt={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`h-5 w-5 cursor-pointer text-white hover:opacity-80 ${isCollapsed ? 'mt-2' : 'ml-auto'}`}
          onClick={toggleCollapse}
          style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }}
        />
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className={cn("px-2 space-y-1", isCollapsed && "flex flex-col items-center")}>
          {navItems.map((item) => {
            // If item has a submenu and sidebar is expanded, render parent and submenu
            if (item.submenu && !isCollapsed) {
              // Use state to track if this submenu is expanded
              const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
              const isActive = location.startsWith(item.path);
              
              return (
                <div key={item.path} className="space-y-1">
                  {/* Parent menu item */}
                  <div 
                    className={cn(
                      "flex items-center py-2 text-sm font-medium rounded-md px-3 w-full cursor-pointer",
                      isActive
                        ? "bg-[#FF5722] text-white"
                        : "text-[#FF5722] hover:bg-white hover:text-black"
                    )}
                    onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
                  >
                    {item.icon}
                    <span className="ml-3 flex-1">{item.label}</span>
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isSubmenuOpen ? "rotate-90 transform" : ""
                      )}
                    />
                  </div>
                  
                  {/* Submenu items - only show when expanded */}
                  {isSubmenuOpen && (
                    <div className="pl-9 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={cn(
                            "flex items-center px-3 py-1.5 text-sm rounded-md",
                            location === subItem.path
                              ? "bg-[#FF5722] text-white"
                              : "text-black hover:bg-white hover:text-[#FF5722]"
                          )}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            
            // If item has submenu but sidebar is collapsed, just show parent icon
            if (item.submenu && isCollapsed) {
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={cn(
                    "flex items-center justify-center px-2 py-2 text-sm font-medium rounded-md",
                    location.startsWith(item.path)
                      ? "bg-[#FF5722] text-white"
                      : "text-[#FF5722] hover:bg-white hover:text-black"
                  )}
                  title={item.label}
                >
                  {item.icon}
                </Link>
              );
            }
            
            // Regular menu item without submenu
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "group flex items-center py-2 text-sm font-medium rounded-md",
                  isCollapsed ? "justify-center px-2" : "px-3",
                  location === item.path
                    ? "bg-[#FF5722] text-white"
                    : "text-[#FF5722] hover:bg-white hover:text-black"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {item.icon}
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
      {/* Upgrade button */}
      <div className="mt-auto px-4 py-2">
        <button className="w-full py-3 bg-[#E8EEFF] text-[#3B5DC9] font-medium rounded-md hover:bg-[#D6E2FF] transition-colors duration-200">
          Upgrade
        </button>
      </div>

      {/* User login status - expanded view */}
      {isAuthenticated && user && !isCollapsed && (
        <div className="p-4 mt-2 bg-white rounded-lg mx-3 mb-3 shadow-sm">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 rounded-full border-2 border-gray-200">
              <AvatarImage 
                src={user?.profileImageUrl || ""} 
                alt={`${user?.firstName || ''} ${user?.lastName || ''}`} 
              />
              <AvatarFallback>
                {user?.firstName ? user.firstName.charAt(0) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-700">
                Chris Tierney
              </p>
              <p className="text-xs text-slate-500">ctierney@websitewannabe.com</p>
            </div>
          </div>
        </div>
      )}
      
      {/* User login status - collapsed view */}
      {isAuthenticated && user && isCollapsed && (
        <div className="py-4 border-t border-slate-700 flex justify-center">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage 
              src={user?.profileImageUrl || ""} 
              alt={`${user?.firstName || ''} ${user?.lastName || ''}`} 
            />
            <AvatarFallback>
              {user?.firstName ? user.firstName.charAt(0) : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      {/* Login button if not authenticated */}
      {!isAuthenticated && !isCollapsed && (
        <div className="p-4 mt-2 bg-white rounded-lg mx-3 mb-3 shadow-sm">
          <div className="flex flex-col items-center">
            <button 
              onClick={() => window.location.href = "/api/login"}
              className="w-full py-2 bg-[#8BC34A] text-white font-medium rounded-md hover:bg-[#71a436] transition-colors duration-200"
            >
              Log in
            </button>
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
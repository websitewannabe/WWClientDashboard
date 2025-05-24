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

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/invoices", label: "Invoices", icon: <FileText className="h-5 w-5" /> },
    { path: "/projects", label: "Projects", icon: <FolderKanban className="h-5 w-5" /> },
    { path: "/hosting", label: "Hosting", icon: <Server className="h-5 w-5" /> },
    { path: "/domains", label: "Domains", icon: <Globe className="h-5 w-5" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart className="h-5 w-5" /> },
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
      <div className="flex items-center h-16 border-b border-slate-700 px-4">
        {!isCollapsed && (
          <img 
            src="/assets/images/logo_favicon.png" 
            alt="Company Logo" 
            className="h-10 mr-auto" 
          />
        )}
        <img 
          src="/assets/images/collapse_icon.svg"
          alt={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="h-5 w-5 ml-auto cursor-pointer text-white hover:opacity-80"
          onClick={toggleCollapse}
          style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }}
        />
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className={cn("px-2 space-y-1", isCollapsed && "flex flex-col items-center")}>
          {navItems.map((item) => (
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
          ))}
        </nav>
      </div>
      {isAuthenticated && user && !isCollapsed && (
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
    </aside>
  );

  return (
    <>
      {mobileSidebar}
      {desktopSidebar}
    </>
  );
}

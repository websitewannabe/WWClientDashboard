import { Button } from "@/components/ui/button";
import { Menu, Bell, User } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? savedState === 'true' : false;
  });

  // Listen for sidebar collapse changes
  useEffect(() => {
    const handleCollapseEvent = (event: CustomEvent) => {
      setIsCollapsed(event.detail.isCollapsed);
    };
    
    window.addEventListener('sidebarCollapseChange', handleCollapseEvent as EventListener);
    
    return () => {
      window.removeEventListener('sidebarCollapseChange', handleCollapseEvent as EventListener);
    };
  }, []);

  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/invoices":
        return "Invoices";
      case "/analytics":
        return "Analytics";
      case "/support":
        return "Support";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="bg-white shadow-sm z-10 sticky top-0 border-b border-[#8BC34A]/20">
      <div className={`flex items-center justify-between h-16 pr-0 transition-all duration-300 ${isCollapsed ? 'pl-[16px] md:pl-[85px]' : 'pl-[69px] md:pl-[133px]'}`}>
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
        <div className="flex items-center md:flex-1 transition-all duration-300 w-[95%]">
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold text-slate-800">{getPageTitle()}</h2>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="p-1 rounded-full text-slate-600 hover:text-slate-800 hover:bg-slate-100">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </Button>
          {isAuthenticated && user && (
            <div className="relative hidden md:block">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImageUrl || ""} alt={`${user?.firstName || ''} ${user?.lastName || ''}`} />
                <AvatarFallback>{user?.firstName ? user.firstName.charAt(0) : "U"}</AvatarFallback>
              </Avatar>
            </div>
          )}
          {!isAuthenticated && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => window.location.href = "/api/login"}
              className="hidden md:inline-flex bg-[#8BC34A] hover:bg-[#71a436] text-white"
            >
              Log in
            </Button>
          )}
          <Button variant="ghost" size="icon" className="p-1 rounded-full text-slate-600 hover:text-slate-800 md:hidden">
            <span className="sr-only">Open user menu</span>
            <User className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
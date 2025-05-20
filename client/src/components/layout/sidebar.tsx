import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  BarChart, 
  HeadphonesIcon, 
  Settings
} from "lucide-react";
import type { User } from "@shared/schema";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { path: "/invoices", label: "Invoices", icon: <FileText className="mr-3 h-5 w-5" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart className="mr-3 h-5 w-5" /> },
    { path: "/support", label: "Support", icon: <HeadphonesIcon className="mr-3 h-5 w-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="mr-3 h-5 w-5" /> }
  ];

  // Mobile sidebar using Sheet component
  const mobileSidebar = (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetContent side="left" className="bg-[#FF5722] text-white p-0 w-64">
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
                      ? "bg-[#FF5722] text-white"
                      : "text-slate-300 hover:bg-[#8BC34A] hover:text-white"
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
    <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 z-40 bg-[#FF5722] text-white">
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
                  ? "bg-white text-[#FF5722] font-bold"
                  : "text-white hover:bg-white/20 hover:text-white"
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

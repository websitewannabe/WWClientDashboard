import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, BarChart, HeadphonesIcon } from "lucide-react";

export default function MobileNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="text-xl" /> },
    { path: "/invoices", label: "Invoices", icon: <FileText className="text-xl" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart className="text-xl" /> },
    { path: "/support", label: "Support", icon: <HeadphonesIcon className="text-xl" /> }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => setLocation(item.path)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              location === item.path
                ? "text-primary-600"
                : "text-slate-500"
            )}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

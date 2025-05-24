import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

// Create Collapsible components
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
const CollapsibleContent = CollapsiblePrimitive.Content;

interface SubItem {
  path: string;
  label: string;
}

interface CollapsibleNavItemProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  submenu: SubItem[];
  location: string;
  isCollapsed: boolean;
}

export function CollapsibleNavItem({ path, label, icon, submenu, location, isCollapsed }: CollapsibleNavItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  // If sidebar is collapsed, just show the icon with tooltip
  if (isCollapsed) {
    return (
      <div className="relative group">
        <Link 
          href={path}
          className={cn(
            "flex items-center justify-center px-2 py-2 text-sm font-medium rounded-md",
            location.startsWith(path)
              ? "bg-[#FF5722] text-white"
              : "text-[#FF5722] hover:bg-white hover:text-black"
          )}
          title={label}
        >
          {icon}
        </Link>
      </div>
    );
  }

  // Show full collapsible menu when sidebar is expanded
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "w-full group flex items-center py-2 text-sm font-medium rounded-md px-3",
            location.startsWith(path)
              ? "bg-[#FF5722] text-white"
              : "text-[#FF5722] hover:bg-white hover:text-black"
          )}
        >
          {icon}
          <span className="ml-3 flex-1 text-left">{label}</span>
          <ChevronRight 
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen ? "rotate-90 transform" : ""
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-9 mt-1 space-y-1">
        {submenu.map((subItem) => (
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
      </CollapsibleContent>
    </Collapsible>
  );
}
import React from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTooltipProps {
  content: string | React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  side = "top",
  className = "",
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`inline-flex text-gray-400 hover:text-gray-600 cursor-help transition-colors ${className}`}>
          <HelpCircle className="h-4 w-4" />
        </span>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export default HelpTooltip;
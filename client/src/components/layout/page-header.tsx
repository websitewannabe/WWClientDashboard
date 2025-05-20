import { Button } from "@/components/ui/button";
import { Download, RefreshCcw } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  showExportButton?: boolean;
  showRefreshButton?: boolean;
  onExport?: () => void;
  onRefresh?: () => void;
}

export default function PageHeader({ 
  title, 
  description, 
  showExportButton = true, 
  showRefreshButton = true,
  onExport,
  onRefresh
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl md:hidden">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">Welcome back! Here's what's happening with your projects today.</p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {showExportButton && (
            <Button variant="outline" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
          {showRefreshButton && (
            <Button className="ml-3" onClick={onRefresh}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  linkText?: string;
  linkHref?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  linkText = "View all",
  linkHref = "#",
}: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 rounded-md p-3", iconBgColor)}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-slate-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-slate-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 px-5 py-3">
        <div className="text-sm">
          <a href={linkHref} className="font-medium text-primary-600 hover:text-primary-700">
            {linkText}
          </a>
        </div>
      </div>
    </Card>
  );
}

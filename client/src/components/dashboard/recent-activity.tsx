import { Card } from "@/components/ui/card";
import { 
  FileText, 
  CreditCard, 
  HeadphonesIcon, 
  LineChart, 
  Calendar 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: 'invoice' | 'payment' | 'ticket' | 'traffic' | 'maintenance';
  title: string;
  description: string;
  date: string;
}

// This will be replaced with real data from API
const recentActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'invoice',
    title: 'New invoice #INV-2023-042',
    description: 'Created on May 3, 2023',
    date: '2023-05-03'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment received',
    description: 'Invoice #INV-2023-041 - $1,200.00',
    date: '2023-05-01'
  },
  {
    id: '3',
    type: 'ticket',
    title: 'Support ticket updated',
    description: 'Ticket #5821 - Status: In Progress',
    date: '2023-04-28'
  },
  {
    id: '4',
    type: 'traffic',
    title: 'Traffic spike detected',
    description: '286 visitors in the last hour',
    date: '2023-04-27'
  },
  {
    id: '5',
    type: 'maintenance',
    title: 'Maintenance scheduled',
    description: 'May 12, 2023 - 2:00 AM to 4:00 AM',
    date: '2023-04-25'
  }
];

const getActivityIcon = (type: string) => {
  switch(type) {
    case 'invoice':
      return <FileText className="text-primary-600" />;
    case 'payment':
      return <CreditCard className="text-success-500" />;
    case 'ticket':
      return <HeadphonesIcon className="text-warning-500" />;
    case 'traffic':
      return <LineChart className="text-slate-600" />;
    case 'maintenance':
      return <Calendar className="text-primary-600" />;
    default:
      return <FileText className="text-primary-600" />;
  }
};

const getActivityIconBgColor = (type: string) => {
  switch(type) {
    case 'invoice':
      return 'bg-primary-100';
    case 'payment':
      return 'bg-success-100';
    case 'ticket':
      return 'bg-warning-100';
    case 'traffic':
      return 'bg-slate-100';
    case 'maintenance':
      return 'bg-primary-100';
    default:
      return 'bg-primary-100';
  }
};

export default function RecentActivity() {
  return (
    <Card className="h-full">
      <div className="px-5 py-4 border-b border-slate-200">
        <h3 className="text-lg font-medium leading-6 text-slate-900">Recent Activity</h3>
      </div>
      <div className="p-5">
        <ul className="divide-y divide-slate-200">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="py-3">
              <div className="flex items-start">
                <div className={cn("flex-shrink-0 rounded-full p-1", getActivityIconBgColor(activity.type))}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                  <p className="text-xs text-slate-500">{activity.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all activity →
          </a>
        </div>
      </div>
    </Card>
  );
}

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Ticket {
  id: string;
  ticketId: string;
  subject: string;
  date: string;
  status: 'open' | 'in-progress' | 'completed' | 'waiting';
}

// This will be replaced with real data from API
const recentTickets: Ticket[] = [
  {
    id: '1',
    ticketId: '#5821',
    subject: 'Contact form not working',
    date: '2023-05-02',
    status: 'in-progress'
  },
  {
    id: '2',
    ticketId: '#5820',
    subject: 'Request for website updates',
    date: '2023-04-28',
    status: 'completed'
  },
  {
    id: '3',
    ticketId: '#5819',
    subject: 'Email delivery issues',
    date: '2023-04-25',
    status: 'waiting'
  },
  {
    id: '4',
    ticketId: '#5818',
    subject: 'SSL certificate renewal',
    date: '2023-04-20',
    status: 'completed'
  }
];

export default function TicketsPanel() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="pending">Open</Badge>;
      case 'in-progress':
        return <Badge variant="inProgress">In Progress</Badge>;
      case 'waiting':
        return <Badge variant="waiting">Waiting for response</Badge>;
      case 'completed':
        return <Badge variant="completed">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-slate-900">Support Tickets</h3>
          <div>
            <Button 
              className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 hover:bg-primary-200 border-none"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              New Ticket
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Ticket ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Subject
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {recentTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {ticket.ticketId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {ticket.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {formatDate(ticket.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(ticket.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700">
            Showing {recentTickets.length} of 8 tickets
          </div>
          <div>
            <a href="/support" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all tickets →
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}

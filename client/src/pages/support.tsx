import PageHeader from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MessageSquare, 
  Search, 
  Filter,
  ArrowUp,
  ArrowDown,
  CalendarIcon,
  Loader2
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { SupportPageSkeleton, TableRowSkeleton } from "@/components/ui/skeleton";

interface Ticket {
  id: string;
  ticketId: string;
  subject: string;
  date: string;
  status: 'open' | 'in-progress' | 'completed' | 'waiting';
  priority: 'low' | 'medium' | 'high';
  description?: string;
  lastUpdated?: string;
  category?: string;
}

// This will be replaced with real data from API
const ticketsData: Ticket[] = [
  {
    id: '1',
    ticketId: '#5821',
    subject: 'Contact form not working',
    date: '2023-05-02',
    status: 'in-progress',
    priority: 'high',
    description: 'The contact form on our website is not sending emails. Please investigate.',
    lastUpdated: '2023-05-04',
    category: 'Bug'
  },
  {
    id: '2',
    ticketId: '#5820',
    subject: 'Request for website updates',
    date: '2023-04-28',
    status: 'completed',
    priority: 'medium',
    description: 'We need to update the About Us page with new team member information.',
    lastUpdated: '2023-05-01',
    category: 'Change Request'
  },
  {
    id: '3',
    ticketId: '#5819',
    subject: 'Email delivery issues',
    date: '2023-04-25',
    status: 'waiting',
    priority: 'medium',
    description: 'Clients are reporting they are not receiving order confirmation emails.',
    lastUpdated: '2023-04-27',
    category: 'Bug'
  },
  {
    id: '4',
    ticketId: '#5818',
    subject: 'SSL certificate renewal',
    date: '2023-04-20',
    status: 'completed',
    priority: 'high',
    description: 'Our SSL certificate is expiring next month. Please handle the renewal process.',
    lastUpdated: '2023-04-22',
    category: 'Maintenance'
  },
  {
    id: '5',
    ticketId: '#5817',
    subject: 'Add new product category',
    date: '2023-04-18',
    status: 'open',
    priority: 'low',
    description: 'We need to add a new product category for upcoming summer items.',
    lastUpdated: '2023-04-18',
    category: 'Feature Request'
  },
  {
    id: '6',
    ticketId: '#5816',
    subject: 'Website loading slowly',
    date: '2023-04-15',
    status: 'in-progress',
    priority: 'high',
    description: 'Our website has been loading slowly for the past few days. Please optimize.',
    lastUpdated: '2023-04-17',
    category: 'Performance'
  },
  {
    id: '7',
    ticketId: '#5815',
    subject: 'Update pricing page',
    date: '2023-04-10',
    status: 'completed',
    priority: 'medium',
    description: 'We need to update our pricing page with new subscription tiers.',
    lastUpdated: '2023-04-12',
    category: 'Change Request'
  },
  {
    id: '8',
    ticketId: '#5814',
    subject: 'Mobile navigation issue',
    date: '2023-04-05',
    status: 'completed',
    priority: 'medium',
    description: 'The dropdown menu is not working correctly on mobile devices.',
    lastUpdated: '2023-04-08',
    category: 'Bug'
  },
];

export default function Support() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuth();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["/api/tickets"],
    enabled: isAuthenticated,
  });

  const { data: intercomTickets, isLoading: intercomLoading } = useQuery({
    queryKey: ["/api/tickets/intercom"],
    enabled: isAuthenticated,
  });

  // Use dummy data until real data is available
  const displayTickets: Ticket[] = (tickets as Ticket[]) || ticketsData;
  
  // Add source tag to regular tickets
  const ticketsWithSource = displayTickets.map(ticket => ({
    ...ticket,
    source: 'internal'
  }));
  
  // Process Intercom tickets if available
  const processedIntercomTickets = intercomTickets 
    ? (intercomTickets as Ticket[]).map(ticket => ({
        ...ticket,
        source: 'intercom'
      }))
    : [];
  
  // Combine all tickets
  const allTickets: (Ticket & { source?: string })[] = [
    ...ticketsWithSource,
    ...processedIntercomTickets
  ];

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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800">Medium</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      default:
        return null;
    }
  };

  const filteredTickets = allTickets.filter(ticket => {
    let statusMatch = true;
    if (activeTab !== 'all') {
      statusMatch = ticket.status === activeTab;
    }
    
    const searchMatch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.description && ticket.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

  return (
    <>
      <PageHeader 
        title="Support Tickets" 
        description="View and manage your support requests"
        onRefresh={() => window.location.reload()}
      />

      <div className="mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Tickets</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="waiting">Waiting</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
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
                          Last Updated
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {isLoading ? (
                        <>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <tr key={`skeleton-${index}`}>
                              <td colSpan={8} className="px-3 py-2">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <TableRowSkeleton />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : filteredTickets.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 text-center text-sm text-slate-500">
                            No tickets found.
                          </td>
                        </tr>
                      ) : (
                        filteredTickets.map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-slate-50 cursor-pointer">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                              <div className="flex items-center">
                                <span>{ticket.ticketId}</span>
                                {'source' in ticket && ticket.source === 'intercom' && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800" title="This ticket is from Intercom">
                                    <svg className="w-3 h-3 mr-1" viewBox="0 0 128 128" fill="currentColor">
                                      <path d="M52.1,88.9c0-3.7,3-6.7,6.7-6.7s6.7,3,6.7,6.7s-3,6.7-6.7,6.7S52.1,92.6,52.1,88.9 M72.6,88.9c0-3.7,3-6.7,6.7-6.7 c3.7,0,6.7,3,6.7,6.7s-3,6.7-6.7,6.7C75.6,95.6,72.6,92.6,72.6,88.9 M62.4,39.5c8.9,0,17.3,3.2,23.8,9.1s10.1,13.6,10.1,22.3h-10.3 c0-13.4-10.7-24.2-23.7-24.2S38.6,57.5,38.6,70.9H28.3C28.3,61.9,31.8,52,38.3,45.2C45.1,38,53.5,39.5,62.4,39.5 M31.6,88.9 c0-3.7,3-6.7,6.7-6.7s6.7,3,6.7,6.7s-3,6.7-6.7,6.7S31.6,92.6,31.6,88.9"/>
                                    </svg>
                                    Intercom
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {ticket.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {formatDate(ticket.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {ticket.lastUpdated ? formatDate(ticket.lastUpdated) : formatDate(ticket.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getPriorityBadge(ticket.priority)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(ticket.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {ticket.category || 'General'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button variant="outline" size="sm" className="text-primary-600">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Reply
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {!isLoading && filteredTickets.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Ticket Status Summary</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-500">Open</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {displayTickets.filter(t => t.status === 'open').length}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-500">In Progress</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {displayTickets.filter(t => t.status === 'in-progress').length}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-500">Waiting</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {displayTickets.filter(t => t.status === 'waiting').length}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-500">Completed</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {displayTickets.filter(t => t.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

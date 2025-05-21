import PageHeader from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Download, Eye, Calendar, HelpCircle, Info } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import InvoicePDFModal from "@/components/invoices/invoice-pdf-modal";
import InvoiceDetailModal from "@/components/invoices/invoice-detail-modal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import HelpTooltip from "@/components/ui/help-tooltip";
import { useTour, tourDefinitions } from "@/components/tour/tour-provider";

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate?: string;
  description?: string;
  items?: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

// This will be replaced with real data from API
const invoicesData: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-042',
    date: '2023-05-03',
    amount: 1500.00,
    status: 'pending',
    dueDate: '2023-06-02',
    description: 'Monthly website maintenance',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-041',
    date: '2023-04-15',
    amount: 1200.00,
    status: 'paid',
    dueDate: '2023-05-15',
    description: 'SEO optimization services',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-040',
    date: '2023-03-28',
    amount: 950.00,
    status: 'paid',
    dueDate: '2023-04-27',
    description: 'Website hosting renewal',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2023-039',
    date: '2023-03-15',
    amount: 2100.00,
    status: 'overdue',
    dueDate: '2023-04-14',
    description: 'Website redesign project',
  },
  {
    id: '5',
    invoiceNumber: 'INV-2023-038',
    date: '2023-02-28',
    amount: 750.00,
    status: 'paid',
    dueDate: '2023-03-28',
    description: 'Content creation services',
  },
  {
    id: '6',
    invoiceNumber: 'INV-2023-037',
    date: '2023-02-15',
    amount: 1800.00,
    status: 'paid',
    dueDate: '2023-03-15',
    description: 'E-commerce feature development',
  },
  {
    id: '7',
    invoiceNumber: 'INV-2023-036',
    date: '2023-01-30',
    amount: 950.00,
    status: 'paid',
    dueDate: '2023-03-01',
    description: 'Website maintenance and security updates',
  },
  {
    id: '8',
    invoiceNumber: 'INV-2023-035',
    date: '2023-01-15',
    amount: 2500.00,
    status: 'paid',
    dueDate: '2023-02-15',
    description: 'Marketing campaign setup',
  },
];

export default function Invoices() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<{start: Date | null, end: Date | null}>({start: null, end: null});
  const { isAuthenticated } = useAuth();
  const { startTour, isTourCompleted } = useTour();
  
  // Start the tour for first-time visitors
  useEffect(() => {
    const invoicesTour = tourDefinitions.find(tour => tour.id === 'invoices-tour');
    if (invoicesTour && !isTourCompleted('invoices-tour')) {
      // Small delay to ensure page elements are fully rendered
      const timer = setTimeout(() => {
        startTour(invoicesTour);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [startTour, isTourCompleted]);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["/api/invoices"],
    enabled: isAuthenticated,
  });

  // Use dummy data until real data is available
  const displayInvoices: Invoice[] = (invoices as Invoice[]) || invoicesData;

  // Filter invoices by status
  const statusFiltered = statusFilter === 'all' 
    ? displayInvoices 
    : displayInvoices.filter((invoice: Invoice) => invoice.status === statusFilter);
  
  // Filter by date range
  const dateFiltered = statusFiltered.filter(invoice => {
    if (!dateRange.start && !dateRange.end) return true;
    
    const invoiceDate = new Date(invoice.date);
    
    if (dateRange.start && dateRange.end) {
      return invoiceDate >= dateRange.start && invoiceDate <= dateRange.end;
    }
    
    if (dateRange.start && !dateRange.end) {
      return invoiceDate >= dateRange.start;
    }
    
    if (!dateRange.start && dateRange.end) {
      return invoiceDate <= dateRange.end;
    }
    
    return true;
  });
  
  // Search functionality
  const searchFilteredInvoices = searchTerm 
    ? dateFiltered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatCurrency(invoice.amount).includes(searchTerm)
      )
    : dateFiltered;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="paid">Paid</Badge>;
      case 'pending':
        return <Badge variant="pending">Pending</Badge>;
      case 'overdue':
        return <Badge variant="overdue">Overdue</Badge>;
      default:
        return null;
    }
  };

  const handleExport = () => {
    // This would typically generate a combined report of all invoices
    alert("This would download a combined PDF of all invoices");
  };

  return (
    <>
      <PageHeader 
        title="Invoices" 
        description="View and manage all your billing information"
        onRefresh={() => window.location.reload()}
        onExport={handleExport}
      />

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-medium leading-6 text-slate-900">All Invoices</h3>
            <div className="flex items-center gap-2">
              <div className="relative w-64 search-invoices">
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm("")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 date-filter">
                    <Calendar className="h-4 w-4" />
                    <span>Date Filter</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1">
                            <HelpCircle className="h-3 w-3 text-gray-400" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">Filter invoices by date range to view invoices from specific time periods.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="end">
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Filter by date range</h3>
                    <div className="grid gap-2">
                      <div>
                        <label className="text-xs font-medium mb-1 block">From</label>
                        <input 
                          type="date" 
                          className="w-full px-3 py-1.5 rounded-md border border-gray-300" 
                          value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : null;
                            setDateRange(prev => ({ ...prev, start: date }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">To</label>
                        <input 
                          type="date" 
                          className="w-full px-3 py-1.5 rounded-md border border-gray-300" 
                          value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : null;
                            setDateRange(prev => ({ ...prev, end: date }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setDateRange({start: null, end: null})}
                      >
                        Clear
                      </Button>
                      <Button size="sm">Apply</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex space-x-3 status-filters">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  className={`${statusFilter === 'all' ? 'bg-primary-50 text-primary-700' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant="outline" 
                  className={`${statusFilter === 'pending' ? 'bg-primary-50 text-primary-700' : ''}`}
                  onClick={() => setStatusFilter('pending')}
                >
                  Pending
                </Button>
                <Button 
                  variant="outline" 
                  className={`${statusFilter === 'paid' ? 'bg-primary-50 text-primary-700' : ''}`}
                  onClick={() => setStatusFilter('paid')}
                >
                  Paid
                </Button>
                <Button 
                  variant="outline" 
                  className={`${statusFilter === 'overdue' ? 'bg-primary-50 text-primary-700' : ''}`}
                  onClick={() => setStatusFilter('overdue')}
                >
                  Overdue
                </Button>
                <HelpTooltip 
                  content="Filter invoices by their payment status. Click on a status to see only invoices of that type."
                  side="bottom"
                />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">Loading invoices...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 invoice-table">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {searchFilteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {invoice.dueDate ? formatDate(invoice.dueDate) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                      {invoice.description || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium invoice-actions">
                      <InvoiceDetailModal
                        invoice={invoice}
                        trigger={
                          <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        }
                      />
                      <InvoicePDFModal
                        invoice={{
                          ...invoice,
                          clientName: "Your Company Name",
                          clientEmail: "your.email@example.com",
                          paymentTerms: "Due on Receipt",
                          dueDate: invoice.dueDate || invoice.date,
                        }}
                        trigger={
                          <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 ml-2">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        }
                      />
                      <HelpTooltip 
                        content="View invoice details or download a PDF copy for your records."
                        side="left"
                        className="ml-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="bg-slate-50 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-700">
              Showing {searchFilteredInvoices.length} of {displayInvoices.length} invoices
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

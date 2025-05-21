import PageHeader from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Download, Eye } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import InvoicePDFModal from "@/components/invoices/invoice-pdf-modal";
import InvoiceDetailModal from "@/components/invoices/invoice-detail-modal";

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
  const { isAuthenticated } = useAuth();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["/api/invoices"],
    enabled: isAuthenticated,
  });

  // Use dummy data until real data is available
  const displayInvoices: Invoice[] = (invoices as Invoice[]) || invoicesData;

  // Filter invoices by status
  const filteredInvoices = statusFilter === 'all' 
    ? displayInvoices 
    : displayInvoices.filter((invoice: Invoice) => invoice.status === statusFilter);
  
  // Search functionality
  const searchFilteredInvoices = searchTerm 
    ? filteredInvoices.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatCurrency(invoice.amount).includes(searchTerm)
      )
    : filteredInvoices;

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
            <div className="flex space-x-3">
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
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">Loading invoices...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
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
                {filteredInvoices.map((invoice) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
              Showing {filteredInvoices.length} of {displayInvoices.length} invoices
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

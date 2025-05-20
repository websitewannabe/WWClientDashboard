import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

// This will be replaced with real data from API
const recentInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-042',
    date: '2023-05-03',
    amount: 1500.00,
    status: 'pending'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-041',
    date: '2023-04-15',
    amount: 1200.00,
    status: 'paid'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-040',
    date: '2023-03-28',
    amount: 950.00,
    status: 'paid'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2023-039',
    date: '2023-03-15',
    amount: 2100.00,
    status: 'overdue'
  }
];

export default function InvoicesPanel() {
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

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-slate-900">Recent Invoices</h3>
          <div>
            <Button 
              variant="outline" 
              className="inline-flex items-center px-3 py-1 text-primary-700 bg-primary-100 hover:bg-primary-200 border-none"
            >
              <Filter className="h-4 w-4 mr-1.5" />
              Filter
            </Button>
          </div>
        </div>
      </div>
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
            {recentInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {invoice.invoiceNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {formatDate(invoice.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {formatCurrency(invoice.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(invoice.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button type="button" className="text-primary-600 hover:text-primary-700">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700">
            Showing {recentInvoices.length} of 12 invoices
          </div>
          <div>
            <a href="/invoices" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all invoices →
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}

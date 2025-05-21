import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Download, Calendar, User, FileText } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import InvoicePDFModal from "./invoice-pdf-modal";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceDetailModalProps {
  invoice: {
    id: string;
    invoiceNumber: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    dueDate?: string;
    description?: string;
    items?: InvoiceItem[];
  };
  trigger?: React.ReactNode;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ invoice, trigger }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Invoice {invoice.invoiceNumber}</DialogTitle>
            <DialogDescription>View invoice details and download options</DialogDescription>
          </div>
          <div className="flex items-center">
            {getStatusBadge(invoice.status)}
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Invoice Details</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm font-medium">Invoice Number</div>
                  <div className="text-sm text-gray-500">{invoice.invoiceNumber}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm font-medium">Invoice Date</div>
                  <div className="text-sm text-gray-500">{formatDate(invoice.date)}</div>
                </div>
              </div>
              
              {invoice.dueDate && (
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium">Due Date</div>
                    <div className="text-sm text-gray-500">{formatDate(invoice.dueDate)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Billing Information</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm font-medium">Client</div>
                  <div className="text-sm text-gray-500">Your Company Name</div>
                  <div className="text-sm text-gray-500">your.email@example.com</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm font-medium">Description</div>
                  <div className="text-sm text-gray-500">{invoice.description || "No description provided"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-b py-4">
          <h3 className="text-sm font-medium mb-3">Invoice Items</h3>
          
          {invoice.items && invoice.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="px-3 py-2 text-sm">{item.description}</td>
                      <td className="px-3 py-2 text-sm text-center">{item.quantity}</td>
                      <td className="px-3 py-2 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-3 py-2 text-sm text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-sm text-right font-medium">Total:</td>
                    <td className="px-3 py-2 text-sm text-right font-bold">{formatCurrency(invoice.amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-gray-500">
              <p>No detailed line items available for this invoice.</p>
              <p className="font-medium mt-2">Total Amount: {formatCurrency(invoice.amount)}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {invoice.status === 'paid' ? 'This invoice has been paid' : 
             invoice.status === 'pending' ? 'Payment pending' : 
             'This invoice is overdue'}
          </div>
          <div className="flex space-x-2">
            <InvoicePDFModal
              invoice={{
                ...invoice,
                clientName: "Your Company Name",
                clientEmail: "your.email@example.com",
                paymentTerms: "Due on Receipt",
                dueDate: invoice.dueDate || invoice.date,
              }}
              trigger={
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              }
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailModal;
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InvoicePDFViewer, InvoicePDFProps } from './invoice-pdf-template';
import { Loader2, Download, Printer, X } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import InvoicePDF from './invoice-pdf-template';

// Import company logo
import companyLogo from '@assets/logo.webp';

interface InvoicePDFModalProps {
  invoice: InvoicePDFProps['invoice'];
  trigger?: React.ReactNode;
}

const InvoicePDFModal: React.FC<InvoicePDFModalProps> = ({ invoice, trigger }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const companyInfo = {
    name: 'Website Wannabe',
    address: '123 Web Avenue, Internet City, CA 94103',
    phone: '(555) 123-4567',
    email: 'support@websitewannabe.com',
    website: 'www.websitewannabe.com',
    // Remove the logo to avoid "Not valid image extension" warnings
    logo: undefined
  };

  const handleDownloadPDF = async () => {
    try {
      setIsLoading(true);
      
      // Generate the PDF blob
      const blob = await pdf(
        <InvoicePDF 
          invoice={invoice} 
          companyInfo={companyInfo} 
        />
      ).toBlob();
      
      // Use file-saver to save the blob
      saveAs(blob, `invoice-${invoice.invoiceNumber}.pdf`);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    // This will trigger the browser's print dialog for the PDF viewer iframe
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            View PDF
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg w-full h-[80vh] max-h-[800px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Invoice {invoice.invoiceNumber}</DialogTitle>
            <DialogDescription>Preview, print or download your invoice as PDF</DialogDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={isLoading}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download PDF
            </Button>

          </div>
        </DialogHeader>
        <div className="flex-1 overflow-auto bg-gray-100 rounded-md">
          <InvoicePDFViewer 
            invoice={invoice} 
            companyInfo={companyInfo} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePDFModal;
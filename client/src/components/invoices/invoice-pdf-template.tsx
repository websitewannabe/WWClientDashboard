import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  PDFViewer,
  Image,
  Font
} from '@react-pdf/renderer';
import { formatCurrency } from '@/lib/utils';

// Define styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  companyInfo: {
    width: '50%',
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF5722',
  },
  companyDetails: {
    fontSize: 10,
    color: '#666666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  invoiceInfoColumn: {
    width: '50%',
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  infoContent: {
    fontSize: 10,
    marginBottom: 3,
    color: '#666666',
  },
  table: {
    marginTop: 20,
    borderColor: '#EEEEEE',
  },
  tableHeader: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingTop: 10,
    paddingBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingTop: 8,
    paddingBottom: 8,
  },
  tableCell: {
    fontSize: 10,
    textAlign: 'left',
    paddingHorizontal: 5,
  },
  tableCellDescription: {
    width: '40%',
    fontSize: 10,
  },
  tableCellQuantity: {
    width: '15%',
    fontSize: 10,
  },
  tableCellPrice: {
    width: '20%',
    fontSize: 10,
  },
  tableCellAmount: {
    width: '25%',
    fontSize: 10,
    textAlign: 'right',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  summaryColumn: {
    width: '30%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 10,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  totalTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#FF5722',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
  },
  accent: {
    color: '#FF5722',
  },
  paid: {
    position: 'absolute',
    top: '40%',
    left: '25%',
    width: '50%',
    height: '30%',
    transform: 'rotate(-45deg)',
    opacity: 0.08,
  },
  paidText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#8BC34A',
  },
  note: {
    marginTop: 30,
    fontSize: 10,
    color: '#666666',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  }
});

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoicePDFProps {
  invoice: {
    id: string;
    invoiceNumber: string;
    date: string;
    dueDate: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    items?: InvoiceItem[];
    clientName: string;
    clientAddress?: string;
    clientEmail?: string;
    paymentTerms?: string;
    notes?: string;
  };
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo?: string;
  };
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice, companyInfo }) => {
  const subtotal = invoice.items 
    ? invoice.items.reduce((sum, item) => sum + item.total, 0) 
    : invoice.amount;
  
  const taxRate = 0.0; // Assuming no tax for simplicity
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{companyInfo.name}</Text>
            <Text style={styles.companyDetails}>{companyInfo.address}</Text>
            <Text style={styles.companyDetails}>Phone: {companyInfo.phone}</Text>
            <Text style={styles.companyDetails}>Email: {companyInfo.email}</Text>
            <Text style={styles.companyDetails}>Website: {companyInfo.website}</Text>
          </View>
          {companyInfo.logo && (
            <Image src={companyInfo.logo} style={{ width: 160 }} />
          )}
        </View>

        {/* Invoice Title */}
        <Text style={styles.title}>INVOICE</Text>

        {/* Invoice Info */}
        <View style={styles.invoiceInfo}>
          <View style={styles.invoiceInfoColumn}>
            <Text style={styles.infoTitle}>BILL TO</Text>
            <Text style={styles.infoContent}>{invoice.clientName}</Text>
            {invoice.clientAddress && (
              <Text style={styles.infoContent}>{invoice.clientAddress}</Text>
            )}
            {invoice.clientEmail && (
              <Text style={styles.infoContent}>{invoice.clientEmail}</Text>
            )}
          </View>
          <View style={styles.invoiceInfoColumn}>
            <Text style={styles.infoTitle}>INVOICE DETAILS</Text>
            <Text style={styles.infoContent}>Invoice Number: {invoice.invoiceNumber}</Text>
            <Text style={styles.infoContent}>Invoice Date: {formatDate(invoice.date)}</Text>
            <Text style={styles.infoContent}>Due Date: {formatDate(invoice.dueDate)}</Text>
            {invoice.paymentTerms && (
              <Text style={styles.infoContent}>Payment Terms: {invoice.paymentTerms}</Text>
            )}
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableCellDescription]}>Description</Text>
            <Text style={[styles.tableCell, styles.tableCellQuantity]}>Quantity</Text>
            <Text style={[styles.tableCell, styles.tableCellPrice]}>Unit Price</Text>
            <Text style={[styles.tableCell, styles.tableCellAmount]}>Amount</Text>
          </View>

          {invoice.items ? (
            // If we have line items, display them
            invoice.items.map((item, index) => (
              <View key={item.id || index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellDescription]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.tableCellQuantity]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.tableCellPrice]}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={[styles.tableCell, styles.tableCellAmount]}>{formatCurrency(item.total)}</Text>
              </View>
            ))
          ) : (
            // If no line items, just show a single row with the amount
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellDescription]}>Services</Text>
              <Text style={[styles.tableCell, styles.tableCellQuantity]}>1</Text>
              <Text style={[styles.tableCell, styles.tableCellPrice]}>{formatCurrency(invoice.amount)}</Text>
              <Text style={[styles.tableCell, styles.tableCellAmount]}>{formatCurrency(invoice.amount)}</Text>
            </View>
          )}
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryColumn}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTitle}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
            </View>
            {taxRate > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTitle}>Tax ({(taxRate * 100).toFixed(1)}%)</Text>
                <Text style={styles.summaryValue}>{formatCurrency(taxAmount)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalTitle}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.note}>
            <Text style={styles.infoTitle}>NOTES</Text>
            <Text style={styles.infoContent}>{invoice.notes}</Text>
          </View>
        )}

        {/* Paid Watermark */}
        {invoice.status === 'paid' && (
          <View style={styles.paid}>
            <Text style={styles.paidText}>PAID</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your business! | Invoice generated on {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
};

export const InvoicePDFViewer: React.FC<InvoicePDFProps> = (props) => {
  return (
    <PDFViewer style={{ width: '100%', height: '700px' }}>
      <InvoicePDF {...props} />
    </PDFViewer>
  );
};

export default InvoicePDF;
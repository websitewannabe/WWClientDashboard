import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, 
  Download, 
  ArrowUpRight, 
  Calendar, 
  DollarSign, 
  ChevronDown,
  CreditCard as CardIcon,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search
} from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { formatCurrency } from "@/lib/utils";

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  method: "credit_card" | "bank_transfer" | "paypal";
  description: string;
  invoiceId?: string;
}

interface PaymentMethod {
  id: string;
  type: "credit_card" | "bank_account" | "paypal";
  name: string;
  details: string;
  expiry?: string;
  isDefault: boolean;
}

interface UpcomingPayment {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: "subscription" | "invoice" | "recurring";
}

const demoPayments: Payment[] = [
  {
    id: "pay-1001",
    date: "2025-05-15",
    amount: 249.99,
    status: "completed",
    method: "credit_card",
    description: "Monthly hosting plan (Premium)",
    invoiceId: "INV-2543"
  },
  {
    id: "pay-1002",
    date: "2025-04-15",
    amount: 249.99,
    status: "completed",
    method: "credit_card",
    description: "Monthly hosting plan (Premium)",
    invoiceId: "INV-2498"
  },
  {
    id: "pay-1003",
    date: "2025-03-15",
    amount: 249.99,
    status: "completed",
    method: "credit_card",
    description: "Monthly hosting plan (Premium)",
    invoiceId: "INV-2432"
  },
  {
    id: "pay-1004",
    date: "2025-05-03",
    amount: 150.00,
    status: "completed",
    method: "credit_card",
    description: "Website maintenance - May",
    invoiceId: "INV-2534"
  },
  {
    id: "pay-1005",
    date: "2025-04-17",
    amount: 349.50,
    status: "completed",
    method: "bank_transfer",
    description: "SEO optimization package",
    invoiceId: "INV-2511"
  },
  {
    id: "pay-1006",
    date: "2025-05-19",
    amount: 75.00,
    status: "pending",
    method: "paypal",
    description: "Domain renewal (example.com)",
    invoiceId: "INV-2552"
  }
];

const demoPaymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    type: "credit_card",
    name: "Visa ending in 4242",
    details: "Expires 09/2027",
    expiry: "09/2027",
    isDefault: true
  },
  {
    id: "pm-2",
    type: "bank_account",
    name: "First National Bank",
    details: "Account ending in 5678",
    isDefault: false
  },
  {
    id: "pm-3",
    type: "paypal",
    name: "PayPal",
    details: "user@example.com",
    isDefault: false
  }
];

const demoUpcomingPayments: UpcomingPayment[] = [
  {
    id: "up-1",
    date: "2025-06-15",
    amount: 249.99,
    description: "Monthly hosting plan (Premium)",
    type: "subscription"
  },
  {
    id: "up-2",
    date: "2025-06-03",
    amount: 150.00,
    description: "Website maintenance - June",
    type: "recurring"
  },
  {
    id: "up-3",
    date: "2025-05-25",
    amount: 75.00,
    description: "Domain renewal (example.org)",
    type: "invoice"
  }
];

function getStatusBadge(status: Payment['status']) {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    case 'pending':
      return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
    case 'failed':
      return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
    default:
      return null;
  }
}

function getPaymentMethodIcon(method: Payment['method']) {
  switch (method) {
    case 'credit_card':
      return <CardIcon className="h-4 w-4 text-[#FF5722]" />;
    case 'bank_transfer':
      return <DollarSign className="h-4 w-4 text-[#8BC34A]" />;
    case 'paypal':
      return <CreditCard className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
}

function getPaymentMethodBadge(type: PaymentMethod['type']) {
  switch (type) {
    case 'credit_card':
      return <Badge variant="outline" className="bg-[#FF5722] bg-opacity-10 text-[#FF5722] border-[#FF5722]">Credit Card</Badge>;
    case 'bank_account':
      return <Badge variant="outline" className="bg-[#8BC34A] bg-opacity-10 text-[#8BC34A] border-[#8BC34A]">Bank Account</Badge>;
    case 'paypal':
      return <Badge variant="outline" className="bg-blue-500 bg-opacity-10 text-blue-500 border-blue-500">PayPal</Badge>;
    default:
      return null;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter payments based on search term
  const filteredPayments = searchTerm 
    ? demoPayments.filter(payment => 
        payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(payment.date).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : demoPayments;
    
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Payments" 
        description="Manage your payment methods and view payment history"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(demoPayments.reduce((sum, p) => sum + p.amount, 0))}</div>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Last 3 months</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(demoUpcomingPayments.reduce((sum, p) => sum + p.amount, 0))}</div>
            <div className="flex items-center mt-1 text-sm text-green-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>Next 30 days</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoPaymentMethods.length}</div>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
              <span>All active and valid</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="history" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>View all your past payments</CardDescription>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search payments..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>
                          <div className="font-medium">{payment.description}</div>
                          {payment.invoiceId && (
                            <div className="text-xs text-gray-500">
                              Invoice: {payment.invoiceId}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getPaymentMethodIcon(payment.method)}
                            <span className="ml-2">{payment.method.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8">
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="sr-only">Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center py-4">
                          <Search className="h-10 w-10 text-gray-300 mb-2" />
                          <h3 className="text-lg font-medium text-gray-900">No payments found</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            No payments match your search criteria.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="methods">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoPaymentMethods.map((method) => (
                  <div key={method.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="mr-4">
                        {method.type === 'credit_card' && (
                          <div className="bg-[#FF5722] bg-opacity-10 p-2 rounded-full">
                            <CardIcon className="h-6 w-6 text-[#FF5722]" />
                          </div>
                        )}
                        {method.type === 'bank_account' && (
                          <div className="bg-[#8BC34A] bg-opacity-10 p-2 rounded-full">
                            <DollarSign className="h-6 w-6 text-[#8BC34A]" />
                          </div>
                        )}
                        {method.type === 'paypal' && (
                          <div className="bg-blue-500 bg-opacity-10 p-2 rounded-full">
                            <CreditCard className="h-6 w-6 text-blue-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{method.name}</span>
                          {method.isDefault && (
                            <Badge className="ml-2 bg-green-100 text-green-800">Default</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{method.details}</div>
                        {method.expiry && (
                          <div className="text-xs text-gray-500 mt-1">Expires: {method.expiry}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      {!method.isDefault && (
                        <Button variant="outline" size="sm">Set Default</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payments</CardTitle>
              <CardDescription>Scheduled payments for the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoUpcomingPayments.map((payment) => (
                  <div key={payment.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border rounded-lg gap-4">
                    <div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-[#FF5722]" />
                        <span className="font-medium">{formatDate(payment.date)}</span>
                      </div>
                      <div className="mt-2">
                        <div className="font-medium">{payment.description}</div>
                        <Badge variant="outline" className="mt-1">
                          {payment.type.replace(/\b\w/g, c => c.toUpperCase())}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <div className="text-xl font-bold">{formatCurrency(payment.amount)}</div>
                      <Button variant="outline" size="sm">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Change Date
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  All payments will use your default payment method
                </div>
                <Button variant="outline">Payment Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
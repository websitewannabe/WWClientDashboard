import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  User, 
  Building, 
  Mail, 
  Clock, 
  Calendar, 
  FileText, 
  CreditCard, 
  AlertCircle, 
  Check, 
  ExternalLink, 
  BarChart 
} from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClientDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  plan: string;
  status: "active" | "suspended" | "pending" | "cancelled";
  createdAt: string;
  lastLogin: string;
  paymentStatus: "paid" | "overdue" | "pending";
  clientSince: string;
  subscriptionValue: number;
  contactPerson: string;
  billingCycle: "monthly" | "annual";
  nextBillingDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes: string;
  storageUsed: number;
  storageLimit: number;
  bandwidthUsed: number;
  bandwidthLimit: number;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  lastUpdated: string;
}

interface Log {
  id: string;
  action: string;
  details: string;
  date: string;
  performedBy: string;
}

// Demo data for a specific client
const demoClientDetail: ClientDetail = {
  id: "client-001",
  name: "Acme Corporation",
  email: "contact@acmecorp.com",
  phone: "(555) 123-4567",
  website: "https://acmecorp.com",
  plan: "Business",
  status: "active",
  createdAt: "2024-10-15",
  lastLogin: "2025-05-19T14:30:00Z",
  paymentStatus: "paid",
  clientSince: "2024-10-15",
  subscriptionValue: 249.99,
  contactPerson: "John Smith",
  billingCycle: "monthly",
  nextBillingDate: "2025-06-15",
  address: "123 Main Street, Suite 400",
  city: "Springfield",
  state: "IL",
  zipCode: "62701",
  country: "United States",
  notes: "Key client with multiple websites. Interested in upgrading to Premium plan in Q3 2025.",
  storageUsed: 32.5,
  storageLimit: 50,
  bandwidthUsed: 124.8,
  bandwidthLimit: 200
};

const demoInvoices: Invoice[] = [
  {
    id: "inv-001",
    number: "INV-2543",
    date: "2025-05-15",
    amount: 249.99,
    status: "paid",
    dueDate: "2025-05-30"
  },
  {
    id: "inv-002",
    number: "INV-2498",
    date: "2025-04-15",
    amount: 249.99,
    status: "paid",
    dueDate: "2025-04-30"
  },
  {
    id: "inv-003",
    number: "INV-2432",
    date: "2025-03-15",
    amount: 249.99,
    status: "paid",
    dueDate: "2025-03-30"
  },
  {
    id: "inv-004",
    number: "INV-2354",
    date: "2025-02-15",
    amount: 249.99,
    status: "paid",
    dueDate: "2025-02-28"
  }
];

const demoTickets: Ticket[] = [
  {
    id: "ticket-001",
    subject: "Website loading slow on mobile devices",
    status: "resolved",
    priority: "high",
    createdAt: "2025-05-10",
    lastUpdated: "2025-05-12"
  },
  {
    id: "ticket-002",
    subject: "Need help updating contact form",
    status: "in-progress",
    priority: "medium",
    createdAt: "2025-05-18",
    lastUpdated: "2025-05-19"
  },
  {
    id: "ticket-003",
    subject: "Request for SEO improvement recommendations",
    status: "open",
    priority: "low",
    createdAt: "2025-05-20",
    lastUpdated: "2025-05-20"
  }
];

const demoLogs: Log[] = [
  {
    id: "log-001",
    action: "Client Login",
    details: "Client logged in from IP 192.168.1.1",
    date: "2025-05-19T14:30:00Z",
    performedBy: "client"
  },
  {
    id: "log-002",
    action: "Subscription Renewal",
    details: "Monthly subscription automatically renewed",
    date: "2025-05-15T00:00:00Z",
    performedBy: "system"
  },
  {
    id: "log-003",
    action: "Support Ticket Created",
    details: "New support ticket #002 created",
    date: "2025-05-18T09:15:00Z",
    performedBy: "client"
  },
  {
    id: "log-004",
    action: "Account Updated",
    details: "Contact information updated",
    date: "2025-05-05T11:30:00Z",
    performedBy: "admin"
  },
  {
    id: "log-005",
    action: "File Uploaded",
    details: "New logo.png file uploaded to website assets",
    date: "2025-05-08T16:45:00Z",
    performedBy: "client"
  }
];

function getStatusBadge(status: ClientDetail["status"]) {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    case 'suspended':
      return <Badge className="bg-amber-100 text-amber-800">Suspended</Badge>;
    case 'pending':
      return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    default:
      return null;
  }
}

function getPaymentStatusBadge(status: ClientDetail["paymentStatus"]) {
  switch (status) {
    case 'paid':
      return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
    case 'overdue':
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    case 'pending':
      return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
    default:
      return null;
  }
}

function getInvoiceStatusBadge(status: Invoice["status"]) {
  switch (status) {
    case 'paid':
      return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
    case 'overdue':
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    case 'pending':
      return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
    default:
      return null;
  }
}

function getTicketStatusBadge(status: Ticket["status"]) {
  switch (status) {
    case 'open':
      return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
    case 'in-progress':
      return <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>;
    case 'resolved':
      return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
    case 'closed':
      return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
    default:
      return null;
  }
}

function getTicketPriorityBadge(priority: Ticket["priority"]) {
  switch (priority) {
    case 'low':
      return <Badge variant="outline" className="bg-blue-50 border-blue-200">Low</Badge>;
    case 'medium':
      return <Badge variant="outline" className="bg-amber-50 border-amber-200">Medium</Badge>;
    case 'high':
      return <Badge variant="outline" className="bg-red-50 border-red-200">High</Badge>;
    default:
      return null;
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export default function ClientDetailPage() {
  const [, setLocation] = useLocation();
  const client = demoClientDetail;
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => setLocation("/admin")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <div className="flex items-center mt-2">
            {getStatusBadge(client.status)}
            <span className="ml-2 text-gray-500">Client since {formatDate(client.clientSince)}</span>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <AlertCircle className="h-4 w-4 mr-2" />
            Suspend Account
          </Button>
          <Button>
            <Check className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing & Invoices</TabsTrigger>
          <TabsTrigger value="support">Support Tickets</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                  <CardDescription>Contact details and account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">General Information</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-start">
                            <Building className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-sm text-gray-500">{client.website}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <div className="font-medium">Contact Person</div>
                              <div className="text-sm text-gray-500">{client.contactPerson}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Mail className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <div className="font-medium">Email</div>
                              <div className="text-sm text-gray-500">{client.email}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Phone className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <div className="font-medium">Phone</div>
                              <div className="text-sm text-gray-500">{client.phone}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Address</h3>
                        <div className="mt-2 text-sm">
                          <p>{client.address}</p>
                          <p>{client.city}, {client.state} {client.zipCode}</p>
                          <p>{client.country}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Status:</span>
                            <span>{getStatusBadge(client.status)}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Payment Status:</span>
                            <span>{getPaymentStatusBadge(client.paymentStatus)}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Client Since:</span>
                            <span className="text-sm">{formatDate(client.clientSince)}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Last Login:</span>
                            <span className="text-sm">{formatDateTime(client.lastLogin)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Subscription</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Plan:</span>
                            <Badge variant="outline" className="bg-[#FF5722] bg-opacity-10 text-[#FF5722] border-[#FF5722]">
                              {client.plan}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Billing Cycle:</span>
                            <span className="text-sm capitalize">{client.billingCycle}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Amount:</span>
                            <span className="text-sm font-medium">{formatCurrency(client.subscriptionValue)}/{client.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Next Billing:</span>
                            <span className="text-sm">{formatDate(client.nextBillingDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-between">
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Client Portal
                  </Button>
                  <Button>Edit Client Details</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                  <CardDescription>Current usage of allocated resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Storage</span>
                        <span className="text-sm text-gray-500">
                          {client.storageUsed} GB of {client.storageLimit} GB
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#FF5722]" 
                          style={{ 
                            width: `${(client.storageUsed / client.storageLimit) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Bandwidth</span>
                        <span className="text-sm text-gray-500">
                          {client.bandwidthUsed} GB of {client.bandwidthLimit} GB
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#8BC34A]" 
                          style={{ 
                            width: `${(client.bandwidthUsed / client.bandwidthLimit) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                  <CardDescription>Internal notes about this client</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{client.notes}</p>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">Edit Notes</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="px-2">
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-4 px-2">
                      {demoLogs.slice(0, 3).map((log) => (
                        <div key={log.id} className="border-b pb-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-sm">{log.action}</span>
                            <span className="text-xs text-gray-500">{formatDateTime(log.date)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                          <p className="text-xs text-gray-500 mt-1">By: {log.performedBy}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="link" className="w-full">View All Activity</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="billing">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice History</CardTitle>
                  <CardDescription>All invoices for this client</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demoInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.number}</TableCell>
                          <TableCell>{formatDate(invoice.date)}</TableCell>
                          <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                          <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                          <TableCell>{getInvoiceStatusBadge(invoice.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Download</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="border-t py-4 flex justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {demoInvoices.length} of {demoInvoices.length} invoices
                  </div>
                  <Button>Create New Invoice</Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Current Plan</h3>
                      <div className="mt-1">
                        <div className="text-2xl font-bold">{client.plan}</div>
                        <div className="text-sm text-gray-500 capitalize">Billed {client.billingCycle}</div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Base Price:</span>
                        <span className="font-medium">{formatCurrency(client.subscriptionValue)}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">Next Billing:</span>
                        <span>{formatDate(client.nextBillingDate)}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">Payment Method:</span>
                        <span>Credit Card (****4242)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex flex-col gap-2">
                  <Button className="w-full">Change Plan</Button>
                  <Button variant="outline" className="w-full">Update Payment Method</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <div className="text-sm">
                        <div>May 15, 2025</div>
                        <div className="text-xs text-gray-500">Credit Card (****4242)</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(client.subscriptionValue)}</div>
                        <div className="text-xs text-green-600">Successful</div>
                      </div>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <div className="text-sm">
                        <div>Apr 15, 2025</div>
                        <div className="text-xs text-gray-500">Credit Card (****4242)</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(client.subscriptionValue)}</div>
                        <div className="text-xs text-green-600">Successful</div>
                      </div>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <div className="text-sm">
                        <div>Mar 15, 2025</div>
                        <div className="text-xs text-gray-500">Credit Card (****4242)</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(client.subscriptionValue)}</div>
                        <div className="text-xs text-green-600">Successful</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="support">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Support Tickets</CardTitle>
                  <CardDescription>All support requests from this client</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demoTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{ticket.subject}</TableCell>
                          <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                          <TableCell>{formatDate(ticket.lastUpdated)}</TableCell>
                          <TableCell>{getTicketStatusBadge(ticket.status)}</TableCell>
                          <TableCell>{getTicketPriorityBadge(ticket.priority)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Reply</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="border-t py-4 flex justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {demoTickets.length} of {demoTickets.length} tickets
                  </div>
                  <Button>Create New Ticket</Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Support Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-md text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {demoTickets.filter(t => t.status === 'open').length}
                        </div>
                        <div className="text-sm text-gray-500">Open</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md text-center">
                        <div className="text-2xl font-bold text-amber-600">
                          {demoTickets.filter(t => t.status === 'in-progress').length}
                        </div>
                        <div className="text-sm text-gray-500">In Progress</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {demoTickets.filter(t => t.status === 'resolved').length}
                        </div>
                        <div className="text-sm text-gray-500">Resolved</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {demoTickets.filter(t => t.status === 'closed').length}
                        </div>
                        <div className="text-sm text-gray-500">Closed</div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-2">Recent Tickets</h3>
                      <div className="space-y-2">
                        {demoTickets.slice(0, 2).map((ticket) => (
                          <div key={ticket.id} className="border p-2 rounded-md">
                            <div className="flex justify-between">
                              <div className="font-medium text-sm truncate max-w-[180px]">{ticket.subject}</div>
                              {getTicketStatusBadge(ticket.status)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Created: {formatDate(ticket.createdAt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">
                    View All Tickets
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Record of all client account activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {demoLogs.map((log, index) => (
                  <div key={log.id} className={index !== demoLogs.length - 1 ? "border-b pb-6" : ""}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <div className="font-medium">{log.action}</div>
                        <div className="text-sm text-gray-600 mt-1">{log.details}</div>
                      </div>
                      <div className="text-sm text-gray-500 mt-2 sm:mt-0 sm:text-right">
                        <div>{formatDateTime(log.date)}</div>
                        <div>By: {log.performedBy}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-center">
              <Button variant="outline">Load More</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Phone(props: React.ComponentProps<typeof Clock>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}
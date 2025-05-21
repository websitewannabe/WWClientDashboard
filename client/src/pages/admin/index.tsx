import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Users, ArrowRight, ArrowUpDown, MoreHorizontal, Mail, AlertCircle } from "lucide-react";
import PageHeader from "@/components/layout/page-header";

interface ClientAccount {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "active" | "suspended" | "pending" | "cancelled";
  createdAt: string;
  lastLogin: string;
  paymentStatus: "paid" | "overdue" | "pending";
  clientSince: string;
  subscriptionValue: number;
}

const demoClients: ClientAccount[] = [
  {
    id: "client-001",
    name: "Acme Corporation",
    email: "contact@acmecorp.com",
    plan: "Business",
    status: "active",
    createdAt: "2024-10-15",
    lastLogin: "2025-05-19T14:30:00Z",
    paymentStatus: "paid",
    clientSince: "2024-10-15",
    subscriptionValue: 249.99
  },
  {
    id: "client-002",
    name: "Global Enterprises",
    email: "info@globalenterprises.com",
    plan: "Premium",
    status: "active",
    createdAt: "2023-05-22",
    lastLogin: "2025-05-20T09:45:00Z",
    paymentStatus: "paid",
    clientSince: "2023-05-22",
    subscriptionValue: 499.99
  },
  {
    id: "client-003",
    name: "Local Shop",
    email: "support@localshop.com",
    plan: "Basic",
    status: "active",
    createdAt: "2025-01-10",
    lastLogin: "2025-05-18T16:20:00Z",
    paymentStatus: "overdue",
    clientSince: "2025-01-10",
    subscriptionValue: 99.99
  },
  {
    id: "client-004",
    name: "Tech Solutions",
    email: "admin@techsolutions.com",
    plan: "Business",
    status: "suspended",
    createdAt: "2024-08-05",
    lastLogin: "2025-04-22T11:15:00Z",
    paymentStatus: "overdue",
    clientSince: "2024-08-05",
    subscriptionValue: 249.99
  },
  {
    id: "client-005",
    name: "Creative Studios",
    email: "hello@creativestudios.com",
    plan: "Business",
    status: "active",
    createdAt: "2024-11-18",
    lastLogin: "2025-05-21T08:30:00Z",
    paymentStatus: "paid",
    clientSince: "2024-11-18",
    subscriptionValue: 249.99
  },
  {
    id: "client-006",
    name: "Fresh Startup",
    email: "team@freshstartup.com",
    plan: "Basic",
    status: "pending",
    createdAt: "2025-05-10",
    lastLogin: "2025-05-10T15:45:00Z",
    paymentStatus: "pending",
    clientSince: "2025-05-10",
    subscriptionValue: 99.99
  }
];

interface AdminDashboardMetrics {
  totalClients: number;
  activeClients: number;
  pendingClients: number;
  suspendedClients: number;
  cancelledClients: number;
  monthlyRevenue: number;
  overdueAccounts: number;
  newClientsThisMonth: number;
}

const demoMetrics: AdminDashboardMetrics = {
  totalClients: 35,
  activeClients: 28,
  pendingClients: 2,
  suspendedClients: 3,
  cancelledClients: 2,
  monthlyRevenue: 8749.65,
  overdueAccounts: 4,
  newClientsThisMonth: 3
};

function getStatusBadge(status: ClientAccount['status']) {
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

function getPaymentStatusBadge(status: ClientAccount['paymentStatus']) {
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return formatDate(dateString);
  }
}

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter clients based on search term
  const filteredClients = searchTerm
    ? demoClients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : demoClients;
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Admin Dashboard" 
        description="Manage client accounts and view platform analytics"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoMetrics.totalClients}</div>
            <div className="flex items-center mt-1 text-sm text-green-600">
              <ArrowRight className="h-4 w-4 mr-1" />
              <span>{demoMetrics.newClientsThisMonth} new this month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(demoMetrics.monthlyRevenue)}</div>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span>{demoMetrics.activeClients} active subscriptions</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{demoMetrics.activeClients}</div>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <span className="text-amber-600 mr-2">{demoMetrics.suspendedClients} suspended</span>
              <span className="text-red-600">{demoMetrics.cancelledClients} cancelled</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{demoMetrics.overdueAccounts}</div>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
              <span>Requires attention</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all-clients" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="all-clients">All Clients</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button asChild className="inline-flex">
              <a href="/admin/add-client">
                <Users className="h-4 w-4 mr-2" />
                Add New Client
              </a>
            </Button>
            <Button asChild variant="outline" className="inline-flex">
              <a href="/admin/import-contacts">
                <Mail className="h-4 w-4 mr-2" />
                Import Intercom Contacts
              </a>
            </Button>
            <Button asChild variant="outline" className="inline-flex">
              <a href="/admin/client-analytics">
                <Filter className="h-4 w-4 mr-2" />
                Client Analytics
              </a>
            </Button>
          </div>
        </div>
        
        <TabsContent value="all-clients">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <div className="flex items-center">
                        Client Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Client Since</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        <div>{client.name}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {client.email}
                        </div>
                      </TableCell>
                      <TableCell>{client.plan}</TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(client.paymentStatus)}</TableCell>
                      <TableCell>{formatDate(client.clientSince)}</TableCell>
                      <TableCell>{formatRelativeTime(client.lastLogin)}</TableCell>
                      <TableCell>{formatCurrency(client.subscriptionValue)}/mo</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <div className="flex items-center">
                        Client Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Client Since</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients
                    .filter(client => client.status === 'active')
                    .map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div>{client.name}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {client.email}
                          </div>
                        </TableCell>
                        <TableCell>{client.plan}</TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                        <TableCell>{getPaymentStatusBadge(client.paymentStatus)}</TableCell>
                        <TableCell>{formatDate(client.clientSince)}</TableCell>
                        <TableCell>{formatRelativeTime(client.lastLogin)}</TableCell>
                        <TableCell>{formatCurrency(client.subscriptionValue)}/mo</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suspended">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <div className="flex items-center">
                        Client Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Client Since</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients
                    .filter(client => client.status === 'suspended')
                    .map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div>{client.name}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {client.email}
                          </div>
                        </TableCell>
                        <TableCell>{client.plan}</TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                        <TableCell>{getPaymentStatusBadge(client.paymentStatus)}</TableCell>
                        <TableCell>{formatDate(client.clientSince)}</TableCell>
                        <TableCell>{formatRelativeTime(client.lastLogin)}</TableCell>
                        <TableCell>{formatCurrency(client.subscriptionValue)}/mo</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <div className="flex items-center">
                        Client Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Client Since</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients
                    .filter(client => client.status === 'pending')
                    .map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div>{client.name}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {client.email}
                          </div>
                        </TableCell>
                        <TableCell>{client.plan}</TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                        <TableCell>{getPaymentStatusBadge(client.paymentStatus)}</TableCell>
                        <TableCell>{formatDate(client.clientSince)}</TableCell>
                        <TableCell>{formatRelativeTime(client.lastLogin)}</TableCell>
                        <TableCell>{formatCurrency(client.subscriptionValue)}/mo</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overdue">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <div className="flex items-center">
                        Client Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Client Since</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients
                    .filter(client => client.paymentStatus === 'overdue')
                    .map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div>{client.name}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {client.email}
                          </div>
                        </TableCell>
                        <TableCell>{client.plan}</TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                        <TableCell>{getPaymentStatusBadge(client.paymentStatus)}</TableCell>
                        <TableCell>{formatDate(client.clientSince)}</TableCell>
                        <TableCell>{formatRelativeTime(client.lastLogin)}</TableCell>
                        <TableCell>{formatCurrency(client.subscriptionValue)}/mo</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, AlertCircle, Check, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/layout/page-header";

interface Domain {
  id: string;
  name: string;
  expiryDate: string;
  registrar: string;
  autoRenew: boolean;
  status: "active" | "expired" | "expiring-soon";
  nameservers: string[];
  type: "primary" | "redirect" | "subdomain";
  linkedTo: string;
}

const demoDomains: Domain[] = [
  {
    id: "dom1",
    name: "example.com",
    expiryDate: "2026-04-15",
    registrar: "Website Wannabe",
    autoRenew: true,
    status: "active",
    nameservers: ["ns1.example-host.com", "ns2.example-host.com"],
    type: "primary",
    linkedTo: "Main Business Website"
  },
  {
    id: "dom2",
    name: "example.org",
    expiryDate: "2025-08-22",
    registrar: "Website Wannabe",
    autoRenew: true,
    status: "active",
    nameservers: ["ns1.example-host.com", "ns2.example-host.com"],
    type: "redirect",
    linkedTo: "example.com"
  },
  {
    id: "dom3",
    name: "old-example.com",
    expiryDate: "2025-06-10",
    registrar: "Another Registrar",
    autoRenew: false,
    status: "expiring-soon",
    nameservers: ["ns1.another-host.com", "ns2.another-host.com"],
    type: "redirect",
    linkedTo: "example.com"
  },
  {
    id: "dom4",
    name: "blog.example.com",
    expiryDate: "2026-04-15",
    registrar: "Website Wannabe",
    autoRenew: true,
    status: "active",
    nameservers: ["ns1.example-host.com", "ns2.example-host.com"],
    type: "subdomain",
    linkedTo: "Company Blog"
  }
];

interface DNSRecord {
  id: string;
  domainId: string;
  type: "A" | "CNAME" | "MX" | "TXT" | "NS";
  name: string;
  value: string;
  ttl: number;
}

const demoDNSRecords: DNSRecord[] = [
  {
    id: "dns1",
    domainId: "dom1",
    type: "A",
    name: "@",
    value: "192.168.1.1",
    ttl: 3600
  },
  {
    id: "dns2",
    domainId: "dom1",
    type: "CNAME",
    name: "www",
    value: "example.com",
    ttl: 3600
  },
  {
    id: "dns3",
    domainId: "dom1",
    type: "MX",
    name: "@",
    value: "mail.example.com",
    ttl: 3600
  },
  {
    id: "dns4",
    domainId: "dom1",
    type: "TXT",
    name: "@",
    value: "v=spf1 include:_spf.example.com ~all",
    ttl: 3600
  }
];

function getStatusBadge(status: Domain["status"]) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    case "expired":
      return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
    case "expiring-soon":
      return <Badge className="bg-amber-100 text-amber-800">Expiring Soon</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
  }
}

function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = Math.abs(expiry.getTime() - today.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export default function Domains() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Domains" 
        description="Manage your domain names and DNS settings"
      />
      
      <div className="mt-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Domains</CardTitle>
            <CardDescription>Review and manage your registered domains</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain Name</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoDomains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-[#FF5722]" />
                        {domain.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {formatDate(domain.expiryDate)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {domain.status === "expiring-soon" ? (
                          <span className="flex items-center text-amber-600">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Expires in {getDaysUntilExpiry(domain.expiryDate)} days
                          </span>
                        ) : (
                          <span>Auto-renew: {domain.autoRenew ? "Enabled" : "Disabled"}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(domain.status)}</TableCell>
                    <TableCell>
                      <div>
                        {domain.type.charAt(0).toUpperCase() + domain.type.slice(1)}
                      </div>
                      {domain.type !== "primary" && (
                        <div className="text-xs text-gray-500">
                          Points to: {domain.linkedTo}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        Manage DNS
                      </Button>
                      <Button size="icon" variant="ghost">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Check className="text-green-500 h-4 w-4 mr-1" />
              All domains secure with HTTPS
            </div>
            <Button>Register New Domain</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>DNS Management</CardTitle>
            <CardDescription>Manage DNS records for example.com</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>TTL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoDNSRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Badge variant="outline">{record.type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{record.name}</TableCell>
                    <TableCell className="font-mono text-sm">{record.value}</TableCell>
                    <TableCell>{record.ttl}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-500">
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                DNS changes may take up to 48 hours to propagate
              </div>
              <Button variant="outline" size="sm">Add DNS Record</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
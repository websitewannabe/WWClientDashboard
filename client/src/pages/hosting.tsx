import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Server, Clock, HardDrive, RefreshCw, AlertCircle } from "lucide-react";
import PageHeader from "@/components/layout/page-header";

interface HostingPlan {
  id: string;
  name: string;
  status: "active" | "pending" | "expired";
  renewalDate: string;
  serverType: string;
  location: string;
  storage: {
    total: number;
    used: number;
  };
  bandwidth: {
    total: number;
    used: number;
  };
  features: string[];
}

const demoHostingPlan: HostingPlan = {
  id: "hp-1",
  name: "Business Premium Hosting",
  status: "active",
  renewalDate: "2025-12-15",
  serverType: "Managed WordPress",
  location: "US East",
  storage: {
    total: 100, // GB
    used: 38.5,
  },
  bandwidth: {
    total: 1000, // GB
    used: 286.4,
  },
  features: [
    "99.9% Uptime Guarantee",
    "Daily Backups",
    "Free SSL Certificate",
    "CDN Integration",
    "Malware Scanning",
    "DDoS Protection",
    "24/7 Support"
  ]
};

interface ServerMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "good" | "warning" | "critical";
}

const demoServerMetrics: ServerMetric[] = [
  {
    id: "m1",
    name: "CPU Load",
    value: 35,
    unit: "%",
    status: "good"
  },
  {
    id: "m2",
    name: "Memory Usage",
    value: 62,
    unit: "%",
    status: "warning"
  },
  {
    id: "m3",
    name: "Response Time",
    value: 320,
    unit: "ms",
    status: "good"
  },
  {
    id: "m4",
    name: "Disk I/O",
    value: 45,
    unit: "%",
    status: "good"
  }
];

interface ServerLog {
  id: string;
  type: "info" | "warning" | "error";
  message: string;
  timestamp: string;
}

const demoServerLogs: ServerLog[] = [
  {
    id: "log1",
    type: "info",
    message: "Automated backup completed successfully",
    timestamp: "2025-05-21T08:32:00Z"
  },
  {
    id: "log2",
    type: "info",
    message: "WordPress core updated to version 6.9.3",
    timestamp: "2025-05-20T13:15:00Z"
  },
  {
    id: "log3",
    type: "warning",
    message: "High memory usage detected (resolved)",
    timestamp: "2025-05-19T22:45:00Z"
  },
  {
    id: "log4",
    type: "error",
    message: "Failed login attempts from suspicious IP (blocked)",
    timestamp: "2025-05-18T15:10:00Z"
  }
];

function getStatusColor(status: "active" | "pending" | "expired" | "good" | "warning" | "critical") {
  switch (status) {
    case "active":
    case "good":
      return "bg-green-100 text-green-800";
    case "pending":
    case "warning":
      return "bg-amber-100 text-amber-800";
    case "expired":
    case "critical":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getLogTypeIcon(type: "info" | "warning" | "error") {
  switch (type) {
    case "info":
      return <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />;
    case "warning":
      return <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" />;
    case "error":
      return <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />;
  }
}

export default function Hosting() {
  const plan = demoHostingPlan;
  const storageUsagePercent = (plan.storage.used / plan.storage.total) * 100;
  const bandwidthUsagePercent = (plan.bandwidth.used / plan.bandwidth.total) * 100;

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Hosting" 
        description="Manage your website hosting and server resources"
        showRefreshButton
      />
      
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="logs">Server Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>Server Details and Resources</CardDescription>
                  </div>
                  <Badge className={getStatusColor(plan.status)}>
                    {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Server className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">Server Type</div>
                      <div className="text-sm text-gray-500">{plan.serverType}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">Renewal Date</div>
                      <div className="text-sm text-gray-500">{new Date(plan.renewalDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium">Storage</span>
                    <span className="text-sm text-gray-500">
                      {plan.storage.used} GB of {plan.storage.total} GB
                    </span>
                  </div>
                  <Progress value={storageUsagePercent} className="h-2" />
                </div>
                
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium">Bandwidth</span>
                    <span className="text-sm text-gray-500">
                      {plan.bandwidth.used} GB of {plan.bandwidth.total} GB
                    </span>
                  </div>
                  <Progress value={bandwidthUsagePercent} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Hosting Features</CardTitle>
                <CardDescription>Included in your plan</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-[#FF5722]"></div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="outline">Contact Support</Button>
            <Button>Upgrade Plan</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoServerMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-200"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className={`${
                            metric.status === "good" 
                              ? "text-green-500" 
                              : metric.status === "warning" 
                                ? "text-amber-500" 
                                : "text-red-500"
                          }`}
                          strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - metric.value / 100)}`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                      <span className="absolute text-xl font-bold">{metric.value}{metric.unit}</span>
                    </div>
                    <Badge className={`mt-4 ${getStatusColor(metric.status)}`}>
                      {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
              <span className="text-sm text-gray-500">Metrics are updated every 5 minutes</span>
            </div>
            <Button size="sm" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Metrics
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Server Logs</CardTitle>
              <CardDescription>Recent server events and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoServerLogs.map((log) => (
                  <div key={log.id} className="flex items-start p-3 rounded-md bg-gray-50">
                    {getLogTypeIcon(log.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm">Load More Logs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Search,
  Globe,
  TrendingUp,
  Link as LinkIcon,
  Download
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Cell
} from "recharts";
import PageHeader from "@/components/layout/page-header";

interface KeywordRanking {
  id: string;
  keyword: string;
  position: number;
  previousPosition: number;
  searchVolume: number;
  url: string;
  change: number;
}

interface PagePerformance {
  id: string;
  url: string;
  title: string;
  organicTraffic: number;
  rankings: number;
  speed: number;
  errors: number;
}

interface SEOIssue {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  affectedPages: number;
  status: "open" | "fixed" | "in-progress";
}

const keywordRankings: KeywordRanking[] = [
  {
    id: "kw1",
    keyword: "website design services",
    position: 4,
    previousPosition: 7,
    searchVolume: 5400,
    url: "/services/web-design",
    change: 3
  },
  {
    id: "kw2",
    keyword: "responsive website builders",
    position: 8,
    previousPosition: 12,
    searchVolume: 3200,
    url: "/tools/website-builder",
    change: 4
  },
  {
    id: "kw3",
    keyword: "custom website development",
    position: 6,
    previousPosition: 6,
    searchVolume: 2900,
    url: "/services/custom-development",
    change: 0
  },
  {
    id: "kw4",
    keyword: "affordable web design",
    position: 15,
    previousPosition: 9,
    searchVolume: 8100,
    url: "/pricing",
    change: -6
  },
  {
    id: "kw5",
    keyword: "business website examples",
    position: 11,
    previousPosition: 18,
    searchVolume: 4300,
    url: "/portfolio",
    change: 7
  }
];

const pagePerformances: PagePerformance[] = [
  {
    id: "page1",
    url: "/",
    title: "Home Page",
    organicTraffic: 1250,
    rankings: 42,
    speed: 95,
    errors: 0
  },
  {
    id: "page2",
    url: "/services",
    title: "Services",
    organicTraffic: 890,
    rankings: 28,
    speed: 87,
    errors: 2
  },
  {
    id: "page3",
    url: "/portfolio",
    title: "Portfolio",
    organicTraffic: 620,
    rankings: 15,
    speed: 92,
    errors: 0
  },
  {
    id: "page4",
    url: "/blog",
    title: "Blog",
    organicTraffic: 1540,
    rankings: 53,
    speed: 78,
    errors: 5
  },
  {
    id: "page5",
    url: "/contact",
    title: "Contact",
    organicTraffic: 320,
    rankings: 8,
    speed: 98,
    errors: 0
  }
];

const seoIssues: SEOIssue[] = [
  {
    id: "issue1",
    type: "critical",
    title: "Missing meta descriptions",
    description: "Several pages are missing meta descriptions which hurts click-through rates",
    affectedPages: 8,
    status: "in-progress"
  },
  {
    id: "issue2",
    type: "warning",
    title: "Slow loading images",
    description: "Some images need optimization to improve page load speed",
    affectedPages: 12,
    status: "open"
  },
  {
    id: "issue3",
    type: "info",
    title: "Opportunity for internal linking",
    description: "Additional internal links could improve site structure",
    affectedPages: 5,
    status: "open"
  },
  {
    id: "issue4",
    type: "critical",
    title: "Broken links detected",
    description: "Several broken links were found that need to be fixed",
    affectedPages: 3,
    status: "fixed"
  }
];

const trafficData = [
  { name: 'Jan', organic: 4000, direct: 2400, referral: 1800, social: 1200 },
  { name: 'Feb', organic: 4200, direct: 2500, referral: 1700, social: 1300 },
  { name: 'Mar', organic: 5000, direct: 2700, referral: 1900, social: 1400 },
  { name: 'Apr', organic: 4800, direct: 2900, referral: 2100, social: 1500 },
  { name: 'May', organic: 5500, direct: 3000, referral: 2200, social: 1700 }
];

const deviceData = [
  { name: 'Desktop', value: 45 },
  { name: 'Mobile', value: 42 },
  { name: 'Tablet', value: 13 }
];

function getChangeIcon(change: number) {
  if (change > 0) {
    return <ArrowUp className="h-4 w-4 text-green-500" />;
  } else if (change < 0) {
    return <ArrowDown className="h-4 w-4 text-red-500" />;
  } else {
    return <ArrowRight className="h-4 w-4 text-gray-500" />;
  }
}

function getIssueBadge(type: SEOIssue['type']) {
  switch (type) {
    case 'critical':
      return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
    case 'warning':
      return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>;
    case 'info':
      return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
    default:
      return null;
  }
}

function getStatusBadge(status: SEOIssue['status']) {
  switch (status) {
    case 'fixed':
      return <Badge className="bg-green-100 text-green-800">Fixed</Badge>;
    case 'in-progress':
      return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
    case 'open':
      return <Badge className="bg-gray-100 text-gray-800">Open</Badge>;
    default:
      return null;
  }
}

const DEVICE_COLORS = ['#FF5722', '#8BC34A', '#2196F3'];

export default function SEOReports() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="SEO Reports" 
        description="Track your website's search engine performance"
        showExportButton
        onExport={() => {}}
      />
      
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Rankings</TabsTrigger>
          <TabsTrigger value="pages">Page Performance</TabsTrigger>
          <TabsTrigger value="issues">SEO Issues</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,543</div>
                <div className="flex items-center mt-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>23% from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14.2</div>
                <div className="flex items-center mt-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>2.3 positions up</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Indexed Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87</div>
                <div className="flex items-center mt-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>5 new pages indexed</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Monthly website traffic by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trafficData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="organic" stroke="#FF5722" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="direct" stroke="#8BC34A" />
                      <Line type="monotone" dataKey="referral" stroke="#2196F3" />
                      <Line type="monotone" dataKey="social" stroke="#9C27B0" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Traffic by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      layout="vertical"
                      data={deviceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Bar dataKey="value" nameKey="name" fill="#FF5722" radius={[0, 4, 4, 0]}>
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  {deviceData.map((device, index) => (
                    <div key={device.name} className="flex items-center">
                      <div 
                        className="w-3 h-3 mr-2 rounded-full" 
                        style={{ backgroundColor: DEVICE_COLORS[index % DEVICE_COLORS.length] }}
                      />
                      <span className="text-sm">{device.name}: {device.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download Full Report
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Rankings</CardTitle>
              <CardDescription>Top performing keywords for your website</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Search Volume</TableHead>
                    <TableHead>URL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywordRankings.map((keyword) => (
                    <TableRow key={keyword.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Search className="h-4 w-4 mr-2 text-gray-500" />
                          {keyword.keyword}
                        </div>
                      </TableCell>
                      <TableCell>{keyword.position}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getChangeIcon(keyword.change)}
                          <span className={
                            keyword.change > 0 
                              ? "text-green-600 ml-1" 
                              : keyword.change < 0 
                                ? "text-red-600 ml-1" 
                                : "text-gray-500 ml-1"
                          }>
                            {keyword.change === 0 ? "no change" : Math.abs(keyword.change)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{keyword.searchVolume.toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-xs text-blue-600">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-1 text-gray-400" />
                          {keyword.url}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Page Performance</CardTitle>
              <CardDescription>SEO metrics for your top pages</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Organic Traffic</TableHead>
                    <TableHead>Rankings</TableHead>
                    <TableHead>Page Speed</TableHead>
                    <TableHead>Errors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagePerformances.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{page.title}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <LinkIcon className="h-3 w-3 mr-1" />
                            {page.url}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{page.organicTraffic.toLocaleString()}</TableCell>
                      <TableCell>{page.rankings}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span 
                            className={
                              page.speed >= 90 
                                ? "text-green-600" 
                                : page.speed >= 70 
                                  ? "text-amber-600" 
                                  : "text-red-600"
                            }
                          >
                            {page.speed}/100
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            page.errors === 0 
                              ? "bg-green-100 text-green-800" 
                              : page.errors < 3 
                                ? "bg-amber-100 text-amber-800" 
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {page.errors}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle>SEO Issues</CardTitle>
              <CardDescription>Problems that need attention to improve rankings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seoIssues.map((issue) => (
                  <div 
                    key={issue.id} 
                    className={`p-4 rounded-lg border ${
                      issue.type === 'critical' 
                        ? 'border-red-200 bg-red-50' 
                        : issue.type === 'warning' 
                          ? 'border-amber-200 bg-amber-50' 
                          : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          {getIssueBadge(issue.type)}
                          <h3 className="ml-2 text-sm font-medium">{issue.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{issue.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Affects {issue.affectedPages} pages</p>
                      </div>
                      <div className="flex items-center">
                        {getStatusBadge(issue.status)}
                        {issue.status !== 'fixed' && (
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="ml-2 text-xs"
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
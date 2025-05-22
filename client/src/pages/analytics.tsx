import PageHeader from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  Calendar, 
  Loader2, 
  AlertCircle, 
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  LineChart,
  Line,
  PieChart, 
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { useAuth } from "@/hooks/use-auth";
import { formatNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { initGA, trackEvent } from "@/lib/analytics";
import { AnalyticsPageSkeleton, StatCardSkeleton, ChartSkeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// This will be replaced by data from API
const trafficData = [
  { date: 'Jan', pageViews: 4000, visitors: 2400, sessions: 2900 },
  { date: 'Feb', pageViews: 3000, visitors: 1398, sessions: 2500 },
  { date: 'Mar', pageViews: 2000, visitors: 9800, sessions: 2100 },
  { date: 'Apr', pageViews: 2780, visitors: 3908, sessions: 2700 },
  { date: 'May', pageViews: 5890, visitors: 4800, sessions: 3800 },
  { date: 'Jun', pageViews: 4390, visitors: 3800, sessions: 2500 },
  { date: 'Jul', pageViews: 3490, visitors: 4300, sessions: 3100 },
  { date: 'Aug', pageViews: 4000, visitors: 2400, sessions: 3200 },
  { date: 'Sep', pageViews: 8900, visitors: 5200, sessions: 5500 },
  { date: 'Oct', pageViews: 9821, visitors: 4238, sessions: 6100 },
  { date: 'Nov', pageViews: 7500, visitors: 3500, sessions: 4800 },
  { date: 'Dec', pageViews: 6500, visitors: 3100, sessions: 4100 },
];

const sourceData = [
  { name: 'Direct', value: 32 },
  { name: 'Search', value: 38 },
  { name: 'Social', value: 18 },
  { name: 'Referral', value: 12 },
];

const deviceData = [
  { name: 'Desktop', value: 63 },
  { name: 'Mobile', value: 32 },
  { name: 'Tablet', value: 5 },
];

const pageData = [
  { name: 'Home', views: 3621, visitors: 2840 },
  { name: 'About', views: 2573, visitors: 2103 },
  { name: 'Services', views: 1876, visitors: 1580 },
  { name: 'Blog', views: 1253, visitors: 1021 },
  { name: 'Contact', views: 983, visitors: 915 },
];

const metricCards = [
  { name: 'Page Views', value: 9821, change: '+12.2%', changeType: 'positive' },
  { name: 'Unique Visitors', value: 4238, change: '+8.7%', changeType: 'positive' },
  { name: 'Avg. Time on Page', value: '2m 42s', change: '-3.1%', changeType: 'negative' },
  { name: 'Bounce Rate', value: '42.3%', change: '-1.8%', changeType: 'positive' },
  { name: 'Pages / Session', value: '3.5', change: '+0.5%', changeType: 'positive' },
  { name: 'New vs Returning', value: '68% / 32%', change: '+2.3%', changeType: 'positive' },
];

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

// Interface to match the response from our Google Analytics API
interface AnalyticsData {
  dates: string[];
  pageViews: number[];
  visitors: number[];
  sessions: number[];
  totals: {
    pageViews: number;
    visitors: number;
    sessions: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
}

// Interface to match the response from our Google Search Console API
interface SearchConsoleData {
  keywords: {
    keyword: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
  pages: {
    url: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
  devices: {
    device: string;
    clicks: number;
    impressions: number;
  }[];
  countries: {
    country: string;
    clicks: number;
    impressions: number;
  }[];
  totals: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  };
}

// Helper to format the analytics data for the chart
const formatAnalyticsForChart = (data: AnalyticsData) => {
  return data.dates.map((date, index) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    pageViews: data.pageViews[index],
    visitors: data.visitors[index],
    sessions: data.sessions[index]
  }));
};

// Helper to format time in seconds as minutes and seconds
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

export default function Analytics() {
  const [timeframe, setTimeframe] = useState<string>("last30days");
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();
  
  // Set the data source to Search Console
  const dataSource = "google-search-console";
  
  // Initialize Google Analytics on component mount
  useEffect(() => {
    initGA();
    
    // Track this page view for analytics
    trackEvent('view_analytics_page', 'client_portal', 'analytics_dashboard');
  }, []);
  
  // Fetch analytics data from our Google Analytics API
  const { 
    data: analyticsData, 
    isLoading: isLoadingGA, 
    error: errorGA 
  } = useQuery({
    queryKey: ['/api/analytics/ga', timeframe],
    enabled: isAuthenticated
  });
  
  // Fetch search console data
  const {
    data: searchConsoleData,
    isLoading: isLoadingSC,
    error: errorSC
  } = useQuery({
    queryKey: ['/api/analytics/gsc', timeframe],
    enabled: isAuthenticated
  });
  
  // Calculate period-over-period changes (simplified simulation for now)
  const calculateChange = (current: number, previous: number) => {
    if (!previous) return '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };
  
  // Prepare metric cards based on analytics data
  const getMetricCards = (data: AnalyticsData) => {
    if (!data) return metricCards;
    
    // In a real implementation, you would compare with previous period data
    // For now, we'll use the demo data change values
    return [
      { 
        name: 'Page Views', 
        value: data.totals.pageViews, 
        change: '+12.2%', 
        changeType: 'positive' 
      },
      { 
        name: 'Unique Visitors', 
        value: data.totals.visitors, 
        change: '+8.7%', 
        changeType: 'positive' 
      },
      { 
        name: 'Avg. Time on Page', 
        value: formatTime(data.totals.avgSessionDuration), 
        change: '-3.1%', 
        changeType: 'negative' 
      },
      { 
        name: 'Bounce Rate', 
        value: `${data.totals.bounceRate.toFixed(1)}%`, 
        change: '-1.8%', 
        changeType: 'positive' 
      },
      { 
        name: 'Pages / Session', 
        value: (data.totals.pageViews / data.totals.sessions).toFixed(1), 
        change: '+0.5%', 
        changeType: 'positive' 
      },
      { 
        name: 'New vs Returning', 
        value: '68% / 32%', 
        change: '+2.3%', 
        changeType: 'positive' 
      },
    ];
  };
  
  // Handler for timeframe change
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    trackEvent('change_analytics_timeframe', 'analytics', value);
  };
  
  // Handler for data source change - now uses navigation instead of state
  const handleDataSourceChange = (value: string) => {
    // Navigate to the appropriate route based on selected data source
    if (value === "google-analytics") {
      window.location.href = "/analytics";
    } else if (value === "google-search-console") {
      window.location.href = "/analytics/search-console";
    } else if (value === "google-business-profile") {
      window.location.href = "/analytics/business-profile";
    }
    
    trackEvent('change_analytics_source', 'analytics', value);
  };
  
  // Determine which loading state to show based on the current route
  if (dataSource === "google-analytics" && isLoadingGA) {
    return <AnalyticsPageSkeleton />;
  } else if (dataSource === "google-search-console" && isLoadingSC) {
    return <AnalyticsPageSkeleton />;
  }
  
  // Show appropriate error state based on the current route
  if ((dataSource === "google-analytics" && errorGA) ||
      (dataSource === "google-search-console" && errorSC)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Unable to load analytics</h3>
          <p className="text-slate-600 mb-4">
            There was a problem loading your analytics data. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }
  
  // Use our real data if available, otherwise fall back to demo data
  const displayData = analyticsData && typeof analyticsData === 'object' && 'dates' in analyticsData 
    ? formatAnalyticsForChart(analyticsData as AnalyticsData) 
    : trafficData;
    
  const currentMetricCards = analyticsData && typeof analyticsData === 'object' && 'totals' in analyticsData
    ? getMetricCards(analyticsData as AnalyticsData) 
    : metricCards;
    
  // Create a constant set of demo data for Google Search Console
  const demoSearchConsoleData: SearchConsoleData = {
    keywords: [
      { keyword: "web design", clicks: 345, impressions: 12450, ctr: 0.0277, position: 8.2 },
      { keyword: "website builder", clicks: 289, impressions: 9870, ctr: 0.0293, position: 9.5 },
      { keyword: "ecommerce website", clicks: 216, impressions: 5680, ctr: 0.0380, position: 7.8 },
      { keyword: "responsive design", clicks: 178, impressions: 4325, ctr: 0.0412, position: 6.3 },
      { keyword: "business website cost", clicks: 156, impressions: 3980, ctr: 0.0392, position: 5.7 }
    ],
    pages: [
      { url: "/services", clicks: 520, impressions: 15400, ctr: 0.0338, position: 4.2 },
      { url: "/portfolio", clicks: 340, impressions: 9200, ctr: 0.0370, position: 5.1 },
      { url: "/ecommerce", clicks: 310, impressions: 7840, ctr: 0.0395, position: 5.8 },
      { url: "/pricing", clicks: 290, impressions: 5600, ctr: 0.0518, position: 3.4 },
      { url: "/contact", clicks: 150, impressions: 3200, ctr: 0.0469, position: 6.7 }
    ],
    devices: [
      { device: "MOBILE", clicks: 980, impressions: 25000 },
      { device: "DESKTOP", clicks: 620, impressions: 12000 },
      { device: "TABLET", clicks: 170, impressions: 3800 }
    ],
    countries: [
      { country: "United States", clicks: 1120, impressions: 28000 },
      { country: "United Kingdom", clicks: 320, impressions: 7500 },
      { country: "Canada", clicks: 180, impressions: 4200 },
      { country: "Australia", clicks: 120, impressions: 2800 },
      { country: "Germany", clicks: 80, impressions: 1300 }
    ],
    totals: {
      clicks: 1820,
      impressions: 43500,
      ctr: 0.0418,
      position: 5.2
    }
  };
  
  // Determine page title and description based on the data source
  const getPageTitle = () => {
    switch (dataSource) {
      case "google-analytics":
        return "Google Analytics";
      case "google-search-console":
        return "Google Search Console";
      case "google-business-profile":
        return "Google Business Profile";
      default:
        return "Analytics";
    }
  };
  
  const getPageDescription = () => {
    switch (dataSource) {
      case "google-analytics":
        return "Monitor your website traffic and user engagement";
      case "google-search-console":
        return "Track your search performance and visibility";
      case "google-business-profile":
        return "View your business listing metrics and local performance";
      default:
        return "Monitor your website's performance";
    }
  };

  return (
    <>
      <PageHeader 
        title={getPageTitle()}
        description={getPageDescription()}
        onRefresh={() => window.location.reload()}
      />

      <div className="mb-6">
        <Card>
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col gap-4">
            <h3 className="text-lg font-medium leading-6 text-slate-900">Search Console</h3>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              
              <Tabs defaultValue={timeframe} onValueChange={handleTimeframeChange}>
                <TabsList>
                  <TabsTrigger value="last7days">Last 7 Days</TabsTrigger>
                  <TabsTrigger value="last30days">Last 30 Days</TabsTrigger>
                  <TabsTrigger value="last90days">Last 90 Days</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <CardContent className="p-6">
            {(
              <div className="space-y-8">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { date: 'Mon', clicks: 210, impressions: 520, ctr: 4.0, position: 25.2 },
                        { date: 'Tue', clicks: 230, impressions: 540, ctr: 4.2, position: 24.8 },
                        { date: 'Wed', clicks: 250, impressions: 580, ctr: 4.3, position: 24.5 },
                        { date: 'Thu', clicks: 280, impressions: 620, ctr: 4.5, position: 24.0 },
                        { date: 'Fri', clicks: 310, impressions: 700, ctr: 4.4, position: 23.7 },
                        { date: 'Sat', clicks: 290, impressions: 680, ctr: 4.3, position: 23.5 },
                        { date: 'Sun', clicks: 250, impressions: 650, ctr: 3.8, position: 23.8 }
                      ]}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="clicks" 
                        stroke="#3b82f6" 
                        name="Clicks" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="impressions" 
                        stroke="#22c55e" 
                        name="Impressions" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="position" 
                        stroke="#f59e0b" 
                        name="Position" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-white border rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500">Total Clicks</h3>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">1,820</p>
                    <div className="mt-1 flex items-center text-xs text-green-600">
                      <ArrowUpIcon className="mr-1 h-3 w-3" />
                      <span>+8.4%</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white border rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500">Total Impressions</h3>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">43,500</p>
                    <div className="mt-1 flex items-center text-xs text-green-600">
                      <ArrowUpIcon className="mr-1 h-3 w-3" />
                      <span>+12.7%</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white border rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500">Average CTR</h3>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">4.18%</p>
                    <div className="mt-1 flex items-center text-xs text-red-600">
                      <ArrowDownIcon className="mr-1 h-3 w-3" />
                      <span>-0.5%</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white border rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500">Average Position</h3>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">5.2</p>
                    <div className="mt-1 flex items-center text-xs text-green-600">
                      <ArrowUpIcon className="mr-1 h-3 w-3" />
                      <span>+0.7</span>
                    </div>
                  </div>
                </div>
                
                {/* Search Console specific data - keywords */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Top Keywords</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Keyword</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Clicks</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Impressions</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {demoSearchConsoleData.keywords.map((keyword, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{keyword.keyword}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{keyword.clicks}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{keyword.impressions}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{keyword.position.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Search Console specific data - pages */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Top Pages</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">URL</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Clicks</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Impressions</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {demoSearchConsoleData.pages.map((page, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{page.url}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{page.clicks}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{page.impressions}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{page.position.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            

          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {currentMetricCards.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="p-5">
              <h4 className="text-sm font-medium text-slate-500">{metric.name}</h4>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{metric.value}</p>
              <p className={`mt-2 text-sm flex items-center ${
                metric.changeType === 'positive' ? 'text-success-500' : 'text-danger-500'
              }`}>
                {metric.changeType === 'positive' ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                )}
                <span>{metric.change} from previous period</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-medium leading-6 text-slate-900">Traffic Sources</h3>
          </div>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-medium leading-6 text-slate-900">Device Distribution</h3>
          </div>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-medium leading-6 text-slate-900">Top Pages</h3>
        </div>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Page Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Visitors
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {pageData.map((page, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {page.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatNumber(page.views)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatNumber(page.visitors)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="h-[300px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pageData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" name="Page Views" fill="#3b82f6" />
                <Bar dataKey="visitors" name="Visitors" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Search Console Data Section */}
      <Card className="mt-8">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-medium leading-6 text-slate-900">Search Performance Overview</h3>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-slate-500">Total Clicks</h3>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{demoSearchConsoleData.totals.clicks.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-slate-500">Total Impressions</h3>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{demoSearchConsoleData.totals.impressions.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-slate-500">Average CTR</h3>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{(demoSearchConsoleData.totals.ctr * 100).toFixed(2)}%</p>
            </div>
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-slate-500">Average Position</h3>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{demoSearchConsoleData.totals.position.toFixed(1)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Top Keywords</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Keyword</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Clicks</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Impressions</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {demoSearchConsoleData.keywords.slice(0, 5).map((keyword, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{keyword.keyword}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{keyword.clicks}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{keyword.impressions}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{keyword.position.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Top Pages</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">URL</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Clicks</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Impressions</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {demoSearchConsoleData.pages.slice(0, 5).map((page, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 max-w-[150px] truncate">{page.url}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{page.clicks}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{page.impressions}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{page.position.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Devices</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demoSearchConsoleData.devices}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="device" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="clicks" name="Clicks" fill="#3b82f6" />
                    <Bar dataKey="impressions" name="Impressions" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Top Countries</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demoSearchConsoleData.countries.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="clicks" name="Clicks" fill="#3b82f6" />
                    <Bar dataKey="impressions" name="Impressions" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

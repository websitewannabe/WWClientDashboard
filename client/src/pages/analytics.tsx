import PageHeader from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon, Calendar } from "lucide-react";
import { useState } from "react";
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

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("monthly");
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <PageHeader 
        title="Analytics" 
        description="Monitor your website's performance and user engagement"
        onRefresh={() => window.location.reload()}
      />

      <div className="mb-6">
        <Card>
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-slate-900">Website Traffic</h3>
            <Tabs defaultValue={timeframe} onValueChange={setTimeframe}>
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardContent className="p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trafficData}
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
                  <Area 
                    type="monotone" 
                    dataKey="pageViews" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6} 
                    name="Page Views"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#22c55e" 
                    fill="#22c55e" 
                    fillOpacity={0.6}
                    name="Unique Visitors" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sessions" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                    fillOpacity={0.6}
                    name="Sessions" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {metricCards.map((metric) => (
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
    </>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import PageHeader from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpIcon, 
  ArrowDownIcon
} from "lucide-react";
import { 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { initGA, trackEvent } from "@/lib/analytics";

// Sample data for website analytics
const websiteData = [
  { date: 'Jan 01', clicks: 210, impressions: 5200, position: 8.7 },
  { date: 'Jan 02', clicks: 230, impressions: 5400, position: 8.5 },
  { date: 'Jan 03', clicks: 250, impressions: 5800, position: 8.3 },
  { date: 'Jan 04', clicks: 280, impressions: 6200, position: 8.1 },
  { date: 'Jan 05', clicks: 310, impressions: 7000, position: 7.9 },
  { date: 'Jan 06', clicks: 290, impressions: 6800, position: 7.8 },
  { date: 'Jan 07', clicks: 250, impressions: 6500, position: 7.8 },
];

const topKeywords = [
  { keyword: "website design", clicks: 345, impressions: 12450, ctr: 2.77, position: 8.2 },
  { keyword: "website builder", clicks: 289, impressions: 9870, ctr: 2.93, position: 9.5 },
  { keyword: "ecommerce website", clicks: 216, impressions: 5680, ctr: 3.80, position: 7.8 },
  { keyword: "responsive design", clicks: 178, impressions: 4325, ctr: 4.12, position: 6.3 },
  { keyword: "business website cost", clicks: 156, impressions: 3980, ctr: 3.92, position: 5.7 }
];

export default function Analytics() {
  const [timeframe, setTimeframe] = useState<string>("7days");
  const { isAuthenticated } = useAuth();

  // Initialize Google Analytics tracking
  useEffect(() => {
    initGA();
    trackEvent('view_analytics_page', 'page_view', 'analytics');
  }, []);

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    trackEvent('change_timeframe', 'user_interaction', value);
  };
  
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Track your website's search performance"
      />
      
      <div className="mb-6">
        <Card>
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col gap-4">
            <h3 className="text-lg font-medium leading-6 text-slate-900">Search Performance</h3>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Tabs defaultValue={timeframe} onValueChange={handleTimeframeChange}>
                <TabsList>
                  <TabsTrigger value="7days">Last 7 Days</TabsTrigger>
                  <TabsTrigger value="30days">Last 30 Days</TabsTrigger>
                  <TabsTrigger value="90days">Last 90 Days</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="space-y-8">
              {/* Performance Metrics */}
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
                    <span>+12.3%</span>
                  </div>
                </div>
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-slate-500">Average CTR</h3>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">4.2%</p>
                  <div className="mt-1 flex items-center text-xs text-green-600">
                    <ArrowUpIcon className="mr-1 h-3 w-3" />
                    <span>+0.3%</span>
                  </div>
                </div>
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-slate-500">Average Position</h3>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">5.2</p>
                  <div className="mt-1 flex items-center text-xs text-green-600">
                    <ArrowUpIcon className="mr-1 h-3 w-3" />
                    <span>+1.5</span>
                  </div>
                </div>
              </div>
              
              {/* Performance Chart */}
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={websiteData}
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
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Top Keywords */}
              <div>
                <h3 className="text-lg font-medium mb-4">Top Keywords</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Keyword</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Clicks</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Impressions</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">CTR</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {topKeywords.map((keyword, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{keyword.keyword}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{keyword.clicks}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{keyword.impressions}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{keyword.ctr}%</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{keyword.position}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
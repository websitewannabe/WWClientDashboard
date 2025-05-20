import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { formatNumber } from "@/lib/utils";

interface AnalyticsData {
  date: string;
  pageViews: number;
  visitors: number;
}

const dummyMonthlyData: AnalyticsData[] = [
  { date: "Jan", pageViews: 4000, visitors: 2400 },
  { date: "Feb", pageViews: 3000, visitors: 1398 },
  { date: "Mar", pageViews: 2000, visitors: 9800 },
  { date: "Apr", pageViews: 2780, visitors: 3908 },
  { date: "May", pageViews: 5890, visitors: 4800 },
  { date: "Jun", pageViews: 4390, visitors: 3800 },
  { date: "Jul", pageViews: 3490, visitors: 4300 },
  { date: "Aug", pageViews: 4000, visitors: 2400 },
  { date: "Sep", pageViews: 8900, visitors: 5200 },
  { date: "Oct", pageViews: 9821, visitors: 4238 },
  { date: "Nov", pageViews: 7500, visitors: 3500 },
  { date: "Dec", pageViews: 6500, visitors: 3100 },
];

const dummyWeeklyData: AnalyticsData[] = [
  { date: "Mon", pageViews: 1500, visitors: 900 },
  { date: "Tue", pageViews: 1900, visitors: 1200 },
  { date: "Wed", pageViews: 2100, visitors: 1400 },
  { date: "Thu", pageViews: 2400, visitors: 1500 },
  { date: "Fri", pageViews: 2300, visitors: 1300 },
  { date: "Sat", pageViews: 1800, visitors: 950 },
  { date: "Sun", pageViews: 1100, visitors: 700 },
];

const dummyYearlyData: AnalyticsData[] = [
  { date: "2018", pageViews: 45000, visitors: 25000 },
  { date: "2019", pageViews: 58000, visitors: 31000 },
  { date: "2020", pageViews: 62000, visitors: 35000 },
  { date: "2021", pageViews: 78000, visitors: 41000 },
  { date: "2022", pageViews: 91000, visitors: 48000 },
  { date: "2023", pageViews: 102000, visitors: 54000 },
];

const analyticsMetrics = [
  { name: "Page Views", value: 9821, change: "+12.2%", changeType: "positive" },
  { name: "Unique Visitors", value: 4238, change: "+8.7%", changeType: "positive" },
  { name: "Avg. Session", value: "2m 42s", change: "-3.1%", changeType: "negative" },
  { name: "Bounce Rate", value: "42.3%", change: "-1.8%", changeType: "positive" }
];

export default function AnalyticsPanel() {
  const [activeTab, setActiveTab] = useState("monthly");
  
  const getChartData = () => {
    switch(activeTab) {
      case "weekly":
        return dummyWeeklyData;
      case "yearly":
        return dummyYearlyData;
      default:
        return dummyMonthlyData;
    }
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <div className="px-5 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-slate-900">Website Analytics</h3>
          <div className="flex items-center">
            <Tabs defaultValue="monthly" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="chart-container h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={getChartData()}
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
              <Area 
                type="monotone" 
                dataKey="pageViews" 
                stackId="1" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6} 
              />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                stackId="2" 
                stroke="#22c55e" 
                fill="#22c55e" 
                fillOpacity={0.6} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {analyticsMetrics.map((metric) => (
            <div key={metric.name} className="bg-slate-50 rounded-md p-3">
              <p className="text-sm font-medium text-slate-500">{metric.name}</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {typeof metric.value === 'number' ? formatNumber(metric.value) : metric.value}
              </p>
              <p className={`mt-1 text-xs flex items-center ${
                metric.changeType === 'positive' ? 'text-success-500' : 'text-danger-500'
              }`}>
                {metric.changeType === 'positive' ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                )}
                <span>{metric.change}</span>
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

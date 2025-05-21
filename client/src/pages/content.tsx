import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, FileText, Image, Pencil, Clock, Eye } from "lucide-react";
import PageHeader from "@/components/layout/page-header";

interface ContentItem {
  id: string;
  title: string;
  type: "blog" | "page" | "social" | "newsletter";
  status: "draft" | "scheduled" | "published" | "needs-review";
  author: string;
  date: string;
  category: string;
  tags: string[];
}

const demoContentItems: ContentItem[] = [
  {
    id: "content1",
    title: "7 Web Design Trends to Watch in 2025",
    type: "blog",
    status: "published",
    author: "Jamie Taylor",
    date: "2025-05-10",
    category: "Design",
    tags: ["trends", "design", "web-development"]
  },
  {
    id: "content2",
    title: "How to Choose the Right CMS for Your Business",
    type: "blog",
    status: "scheduled",
    author: "Alex Morgan",
    date: "2025-05-25",
    category: "Technology",
    tags: ["cms", "business", "website"]
  },
  {
    id: "content3",
    title: "Monthly Newsletter - May 2025",
    type: "newsletter",
    status: "draft",
    author: "Marketing Team",
    date: "2025-05-30",
    category: "Newsletter",
    tags: ["monthly-update", "announcements"]
  },
  {
    id: "content4",
    title: "New Portfolio Items Showcase",
    type: "social",
    status: "scheduled",
    author: "Social Media Team",
    date: "2025-05-22",
    category: "Portfolio",
    tags: ["showcase", "projects", "portfolio"]
  },
  {
    id: "content5",
    title: "Updated Services Page Content",
    type: "page",
    status: "needs-review",
    author: "Content Team",
    date: "2025-05-18",
    category: "Website",
    tags: ["services", "update"]
  }
];

interface ScheduledDay {
  date: Date;
  items: number;
  types: Set<ContentItem['type']>;
}

// Generate calendar data with scheduled content
function generateScheduledDays(items: ContentItem[]): ScheduledDay[] {
  const days: ScheduledDay[] = [];
  const dayMap = new Map<string, ScheduledDay>();
  
  items.forEach(item => {
    const dateStr = item.date;
    const date = new Date(dateStr);
    const key = date.toISOString().split('T')[0];
    
    if (dayMap.has(key)) {
      const day = dayMap.get(key)!;
      day.items += 1;
      day.types.add(item.type);
    } else {
      dayMap.set(key, {
        date,
        items: 1,
        types: new Set([item.type])
      });
    }
  });
  
  return Array.from(dayMap.values());
}

function getStatusBadge(status: ContentItem['status']) {
  switch (status) {
    case 'published':
      return <Badge className="bg-green-100 text-green-800">Published</Badge>;
    case 'scheduled':
      return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
    case 'needs-review':
      return <Badge className="bg-amber-100 text-amber-800">Needs Review</Badge>;
    default:
      return null;
  }
}

function getTypeIcon(type: ContentItem['type']) {
  switch (type) {
    case 'blog':
      return <FileText className="h-4 w-4 text-[#FF5722]" />;
    case 'page':
      return <FileText className="h-4 w-4 text-[#8BC34A]" />;
    case 'social':
      return <Image className="h-4 w-4 text-blue-500" />;
    case 'newsletter':
      return <FileText className="h-4 w-4 text-purple-500" />;
    default:
      return null;
  }
}

function getTypeBadge(type: ContentItem['type']) {
  switch (type) {
    case 'blog':
      return <Badge variant="outline" className="bg-[#FF5722] bg-opacity-10 text-[#FF5722] border-[#FF5722]">Blog</Badge>;
    case 'page':
      return <Badge variant="outline" className="bg-[#8BC34A] bg-opacity-10 text-[#8BC34A] border-[#8BC34A]">Page</Badge>;
    case 'social':
      return <Badge variant="outline" className="bg-blue-500 bg-opacity-10 text-blue-500 border-blue-500">Social</Badge>;
    case 'newsletter':
      return <Badge variant="outline" className="bg-purple-500 bg-opacity-10 text-purple-500 border-purple-500">Newsletter</Badge>;
    default:
      return null;
  }
}

export default function ContentCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const scheduledDays = generateScheduledDays(demoContentItems);
  
  const filteredItems = date 
    ? demoContentItems.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.toDateString() === date.toDateString();
      })
    : [];
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Content Calendar" 
        description="Manage and schedule your website content updates"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Content Schedule</CardTitle>
            <CardDescription>View and select scheduled content dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow"
                modifiers={{
                  scheduled: scheduledDays.map(day => day.date)
                }}
                modifiersStyles={{
                  scheduled: {
                    fontWeight: "bold",
                    backgroundColor: "rgba(255,87,34,0.1)",
                    borderRadius: "100%"
                  }
                }}
              />
              
              <div className="mt-6 w-full space-y-2">
                <h3 className="text-sm font-medium">Content Types</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#FF5722] mr-2" />
                    <span className="text-xs">Blog Posts</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#8BC34A] mr-2" />
                    <span className="text-xs">Pages</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                    <span className="text-xs">Social Media</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2" />
                    <span className="text-xs">Newsletters</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 w-full">
                <Button className="w-full">+ Add New Content</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {date ? date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'All Content'}
                </CardTitle>
                <CardDescription>
                  {filteredItems.length > 0 
                    ? `${filteredItems.length} items scheduled` 
                    : date 
                      ? 'No content scheduled for this date' 
                      : 'Select a date to view scheduled content'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Month View
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Timeline
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredItems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {getTypeIcon(item.type)}
                          <span className="ml-2 font-medium">{item.title}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.tags.map(tag => `#${tag}`).join(', ')}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(item.type)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.author}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarDays className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No content scheduled</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {date 
                    ? 'There is no content scheduled for this date. Select another date or add new content.' 
                    : 'Please select a date from the calendar to view scheduled content.'}
                </p>
                {date && (
                  <Button className="mt-4">
                    Schedule Content for This Date
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upcoming Content</CardTitle>
          <CardDescription>All scheduled content for the next 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="blog">Blog Posts</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletters</TabsTrigger>
              <TabsTrigger value="page">Pages</TabsTrigger>
            </TabsList>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Author</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoContentItems
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">
                          Category: {item.category}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(item.type)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.author}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Video, 
  FileQuestion, 
  BookOpen, 
  Download, 
  ArrowUpRight,
  Search as SearchIcon,
  Star,
  Clock,
  CheckCircle2
} from "lucide-react";
import PageHeader from "@/components/layout/page-header";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "guide" | "tutorial" | "faq" | "documentation" | "video";
  tags: string[];
  created: string;
  category: string;
  url: string;
  featured: boolean;
  timeToRead?: string;
}

const demoResources: Resource[] = [
  {
    id: "res1",
    title: "Getting Started with Your Website",
    description: "A comprehensive guide to managing your new website, including basic content updates and common tasks.",
    type: "guide",
    tags: ["beginner", "website-management", "content"],
    created: "2025-03-15",
    category: "Website Management",
    url: "/resources/getting-started-guide",
    featured: true,
    timeToRead: "15 min"
  },
  {
    id: "res2",
    title: "How to Add Products to Your Online Store",
    description: "Step-by-step tutorial for adding new products to your e-commerce store, including images, descriptions, and pricing.",
    type: "tutorial",
    tags: ["e-commerce", "products", "inventory"],
    created: "2025-04-10",
    category: "E-commerce",
    url: "/resources/add-products-tutorial",
    featured: true,
    timeToRead: "10 min"
  },
  {
    id: "res3",
    title: "Website Security Best Practices",
    description: "Learn about important security measures to keep your website protected from common threats and vulnerabilities.",
    type: "documentation",
    tags: ["security", "best-practices", "protection"],
    created: "2025-02-28",
    category: "Security",
    url: "/resources/security-guide",
    featured: false,
    timeToRead: "20 min"
  },
  {
    id: "res4",
    title: "Troubleshooting Common Website Issues",
    description: "Solutions to the most frequently encountered website problems and how to resolve them quickly.",
    type: "faq",
    tags: ["troubleshooting", "problems", "solutions"],
    created: "2025-04-22",
    category: "Support",
    url: "/resources/troubleshooting-guide",
    featured: false,
    timeToRead: "12 min"
  },
  {
    id: "res5",
    title: "How to Use the Content Editor",
    description: "Video tutorial showing how to use our content management system to update your website pages.",
    type: "video",
    tags: ["cms", "content-editing", "tutorial"],
    created: "2025-05-05",
    category: "Content Management",
    url: "/resources/content-editor-tutorial",
    featured: true,
    timeToRead: "8 min"
  },
  {
    id: "res6",
    title: "SEO Optimization Guide",
    description: "Comprehensive guide to optimizing your website for search engines to improve rankings and traffic.",
    type: "guide",
    tags: ["seo", "optimization", "traffic"],
    created: "2025-03-30",
    category: "Marketing",
    url: "/resources/seo-guide",
    featured: false,
    timeToRead: "25 min"
  },
  {
    id: "res7",
    title: "Website Analytics Explained",
    description: "Learn how to interpret your website analytics and use data to make informed decisions.",
    type: "documentation",
    tags: ["analytics", "data", "reporting"],
    created: "2025-04-15",
    category: "Analytics",
    url: "/resources/analytics-guide",
    featured: false,
    timeToRead: "18 min"
  },
  {
    id: "res8",
    title: "Frequently Asked Questions",
    description: "Answers to common questions about website hosting, maintenance, and support.",
    type: "faq",
    tags: ["faq", "help", "support"],
    created: "2025-05-01",
    category: "Support",
    url: "/resources/faq",
    featured: true,
    timeToRead: "15 min"
  }
];

function getResourceIcon(type: Resource['type']) {
  switch (type) {
    case 'guide':
      return <BookOpen className="h-6 w-6 text-[#FF5722]" />;
    case 'tutorial':
      return <CheckCircle2 className="h-6 w-6 text-[#8BC34A]" />;
    case 'faq':
      return <FileQuestion className="h-6 w-6 text-blue-500" />;
    case 'documentation':
      return <FileText className="h-6 w-6 text-purple-500" />;
    case 'video':
      return <Video className="h-6 w-6 text-red-500" />;
    default:
      return <FileText className="h-6 w-6 text-gray-500" />;
  }
}

function getResourceTypeBadge(type: Resource['type']) {
  switch (type) {
    case 'guide':
      return <Badge className="bg-[#FF5722] bg-opacity-10 text-[#FF5722] border-[#FF5722]">Guide</Badge>;
    case 'tutorial':
      return <Badge className="bg-[#8BC34A] bg-opacity-10 text-[#8BC34A] border-[#8BC34A]">Tutorial</Badge>;
    case 'faq':
      return <Badge className="bg-blue-500 bg-opacity-10 text-blue-500 border-blue-500">FAQ</Badge>;
    case 'documentation':
      return <Badge className="bg-purple-500 bg-opacity-10 text-purple-500 border-purple-500">Documentation</Badge>;
    case 'video':
      return <Badge className="bg-red-500 bg-opacity-10 text-red-500 border-red-500">Video</Badge>;
    default:
      return null;
  }
}

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const featuredResources = demoResources.filter(resource => resource.featured);
  
  const filteredResources = (resources: Resource[]) => {
    if (!searchTerm) return resources;
    
    return resources.filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Resources" 
        description="Helpful guides, tutorials, and documentation"
      />
      
      <div className="flex justify-between items-center mt-8 mb-6">
        <h2 className="text-2xl font-bold">Resources Library</h2>
        <div className="relative w-72">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search resources..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="featured" className="mt-6">
        <TabsList className="mb-6">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="featured">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources(featuredResources).map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          
          {filteredResources(featuredResources).length === 0 && (
            <NoResourcesFound searchTerm={searchTerm} />
          )}
        </TabsContent>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources(demoResources).map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          
          {filteredResources(demoResources).length === 0 && (
            <NoResourcesFound searchTerm={searchTerm} />
          )}
        </TabsContent>
        
        <TabsContent value="guides">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources(demoResources.filter(r => r.type === 'guide')).map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          
          {filteredResources(demoResources.filter(r => r.type === 'guide')).length === 0 && (
            <NoResourcesFound searchTerm={searchTerm} />
          )}
        </TabsContent>
        
        <TabsContent value="tutorials">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources(demoResources.filter(r => r.type === 'tutorial')).map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          
          {filteredResources(demoResources.filter(r => r.type === 'tutorial')).length === 0 && (
            <NoResourcesFound searchTerm={searchTerm} />
          )}
        </TabsContent>
        
        <TabsContent value="faqs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources(demoResources.filter(r => r.type === 'faq')).map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          
          {filteredResources(demoResources.filter(r => r.type === 'faq')).length === 0 && (
            <NoResourcesFound searchTerm={searchTerm} />
          )}
        </TabsContent>
        
        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources(demoResources.filter(r => r.type === 'video')).map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          
          {filteredResources(demoResources.filter(r => r.type === 'video')).length === 0 && (
            <NoResourcesFound searchTerm={searchTerm} />
          )}
        </TabsContent>
      </Tabs>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Resource Categories</CardTitle>
          <CardDescription>Browse resources by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {['Website Management', 'E-commerce', 'Security', 'Support', 'Content Management', 'Marketing', 'Analytics'].map((category) => (
              <Button key={category} variant="outline" className="justify-start h-auto py-3">
                <div className="flex flex-col items-start">
                  <span>{category}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {demoResources.filter(r => r.category === category).length} resources
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          {getResourceIcon(resource.type)}
          {resource.featured && (
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          )}
        </div>
        <CardTitle className="text-lg">{resource.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-1">
          {getResourceTypeBadge(resource.type)}
          <Badge variant="outline">{resource.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-gray-600">{resource.description}</p>
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>{resource.timeToRead}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-4">
        <div className="flex flex-wrap gap-1">
          {resource.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
          {resource.tags.length > 2 && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              +{resource.tags.length - 2}
            </span>
          )}
        </div>
        {resource.type === 'documentation' || resource.type === 'guide' ? (
          <Button size="sm" className="h-8">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        ) : (
          <Button size="sm" className="h-8">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            View
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function NoResourcesFound({ searchTerm }: { searchTerm: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <SearchIcon className="h-12 w-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
      <p className="text-sm text-gray-500 mt-1">
        No resources match your search for "{searchTerm}". Try a different search term or browse by category.
      </p>
      <Button className="mt-4" onClick={() => window.location.reload()}>
        Clear Search
      </Button>
    </div>
  );
}
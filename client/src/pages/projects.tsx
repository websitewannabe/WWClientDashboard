import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Calendar, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/layout/page-header";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "in-progress" | "review" | "completed";
  deadline: string;
  progress: number;
  category: string;
  manager: {
    name: string;
    avatar: string;
  };
}

const demoProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete redesign of company website with new branding and improved UX",
    status: "in-progress",
    deadline: "2025-06-30",
    progress: 45,
    category: "Design",
    manager: {
      name: "Alex Morgan",
      avatar: "",
    }
  },
  {
    id: "2",
    name: "E-commerce Integration",
    description: "Adding online shopping capabilities to existing website",
    status: "planning",
    deadline: "2025-07-15",
    progress: 15,
    category: "Development",
    manager: {
      name: "Jamie Taylor",
      avatar: "",
    }
  },
  {
    id: "3",
    name: "Content Migration",
    description: "Transferring content from old CMS to new platform",
    status: "review",
    deadline: "2025-06-10",
    progress: 85,
    category: "Content",
    manager: {
      name: "Casey Wilson",
      avatar: "",
    }
  },
  {
    id: "4",
    name: "SEO Optimization",
    description: "Improving search engine rankings and site visibility",
    status: "completed",
    deadline: "2025-05-20",
    progress: 100,
    category: "Marketing",
    manager: {
      name: "Taylor Reed",
      avatar: "",
    }
  }
];

function getStatusColor(status: Project["status"]) {
  switch (status) {
    case "planning":
      return "bg-blue-100 text-blue-800";
    case "in-progress":
      return "bg-amber-100 text-amber-800";
    case "review":
      return "bg-purple-100 text-purple-800";
    case "completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function Projects() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Projects" 
        description="View and track the progress of your current website projects"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {demoProjects.map((project) => (
          <Card key={project.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{project.name}</CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {project.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
              <CardDescription className="mt-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#FF5722] h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={project.manager.avatar} />
                    <AvatarFallback>{project.manager.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>Manager: {project.manager.name}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" className="w-full" size="sm">
                <span>View Details</span>
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Calendar, MapPin, MessageSquare } from "lucide-react";
import PageHeader from "@/components/layout/page-header";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  department: "account" | "design" | "development" | "support";
  availability: "available" | "busy" | "offline" | "vacation";
  bio: string;
  location: string;
  specialties: string[];
  nextAvailability?: string;
}

const demoTeamMembers: TeamMember[] = [
  {
    id: "tm1",
    name: "Alex Morgan",
    role: "Account Manager",
    email: "alex.morgan@example.com",
    phone: "(555) 123-4567",
    avatar: "",
    department: "account",
    availability: "available",
    bio: "Alex has been with our company for 5 years, specializing in client relations and project oversight. With expertise in marketing and business strategy, Alex ensures your projects exceed expectations.",
    location: "New York, NY",
    specialties: ["Client Relations", "Project Management", "Marketing Strategy"]
  },
  {
    id: "tm2",
    name: "Jamie Taylor",
    role: "Lead Designer",
    email: "jamie.taylor@example.com",
    phone: "(555) 234-5678",
    avatar: "",
    department: "design",
    availability: "busy",
    bio: "Jamie has over 8 years of experience in UI/UX and brand design. With a background in both print and digital media, Jamie creates cohesive brand experiences across all platforms.",
    location: "San Francisco, CA",
    specialties: ["UI/UX Design", "Brand Identity", "Motion Graphics"],
    nextAvailability: "2025-05-22T14:00:00Z"
  },
  {
    id: "tm3",
    name: "Taylor Reed",
    role: "Senior Developer",
    email: "taylor.reed@example.com",
    phone: "(555) 345-6789",
    avatar: "",
    department: "development",
    availability: "available",
    bio: "Taylor specializes in frontend and backend development with particular expertise in e-commerce solutions. With 7 years of experience, Taylor has helped launch over 50 successful online stores.",
    location: "Austin, TX",
    specialties: ["Full-Stack Development", "E-commerce", "API Integration"]
  },
  {
    id: "tm4",
    name: "Casey Wilson",
    role: "Support Specialist",
    email: "casey.wilson@example.com",
    phone: "(555) 456-7890",
    avatar: "",
    department: "support",
    availability: "offline",
    bio: "Casey has 4 years of experience in technical support and troubleshooting. Specializing in CMS platforms and hosting environments, Casey ensures your website runs smoothly at all times.",
    location: "Chicago, IL",
    specialties: ["Technical Support", "CMS Management", "Performance Optimization"],
    nextAvailability: "2025-05-22T09:00:00Z"
  },
  {
    id: "tm5",
    name: "Jordan Smith",
    role: "SEO Specialist",
    email: "jordan.smith@example.com",
    phone: "(555) 567-8901",
    avatar: "",
    department: "account",
    availability: "vacation",
    bio: "Jordan has 6 years of experience in search engine optimization and digital marketing. Focused on data-driven strategies, Jordan helps clients improve their online visibility and conversion rates.",
    location: "Denver, CO",
    specialties: ["SEO", "Content Strategy", "Analytics"],
    nextAvailability: "2025-05-27T10:00:00Z"
  }
];

function getAvailabilityBadge(availability: TeamMember['availability']) {
  switch (availability) {
    case 'available':
      return <Badge className="bg-green-100 text-green-800">Available</Badge>;
    case 'busy':
      return <Badge className="bg-amber-100 text-amber-800">Busy</Badge>;
    case 'offline':
      return <Badge className="bg-gray-100 text-gray-800">Offline</Badge>;
    case 'vacation':
      return <Badge className="bg-blue-100 text-blue-800">Vacation</Badge>;
    default:
      return null;
  }
}

function getDepartmentBadge(department: TeamMember['department']) {
  switch (department) {
    case 'account':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Account Management</Badge>;
    case 'design':
      return <Badge variant="outline" className="bg-[#FF5722] bg-opacity-10 text-[#FF5722] border-[#FF5722]">Design</Badge>;
    case 'development':
      return <Badge variant="outline" className="bg-[#8BC34A] bg-opacity-10 text-[#8BC34A] border-[#8BC34A]">Development</Badge>;
    case 'support':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Support</Badge>;
    default:
      return null;
  }
}

function formatNextAvailability(dateTime?: string): string {
  if (!dateTime) return 'Not scheduled';
  
  const date = new Date(dateTime);
  return date.toLocaleString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export default function Team() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Your Team" 
        description="Meet the team dedicated to your website and online presence"
      />
      
      <Tabs defaultValue="all" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Team</TabsTrigger>
          <TabsTrigger value="account">Account Management</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoTeamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="account">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoTeamMembers
              .filter(member => member.department === 'account')
              .map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="design">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoTeamMembers
              .filter(member => member.department === 'design')
              .map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="development">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoTeamMembers
              .filter(member => member.department === 'development')
              .map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="support">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoTeamMembers
              .filter(member => member.department === 'support')
              .map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Team Availability</CardTitle>
          <CardDescription>Office hours and general support information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Regular Office Hours</h3>
              <p className="text-sm text-gray-600 mb-4">Our team is generally available during the following hours:</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#FF5722] mr-2"></div>
                  <span>Monday - Friday: 9:00 AM - 6:00 PM Eastern Time</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#8BC34A] mr-2"></div>
                  <span>Support monitored 24/7 for emergencies</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                  <span>Weekend support available by appointment</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Contact Options</h3>
              <p className="text-sm text-gray-600 mb-4">Multiple ways to get in touch with your team:</p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-[#FF5722]" />
                  <span>Direct phone contact with your account manager</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-[#8BC34A]" />
                  <span>Email support with 24-hour response time</span>
                </li>
                <li className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Live chat available during business hours</span>
                </li>
                <li className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                  <span>Schedule video calls with your team</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6">
          <Button className="w-full sm:w-auto">
            Schedule a Meeting
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={member.avatar} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>{member.role}</CardDescription>
            </div>
          </div>
          {getAvailabilityBadge(member.availability)}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-4">
          {getDepartmentBadge(member.department)}
        </div>
        <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-500">
            <Mail className="h-4 w-4 mr-2" />
            <span>{member.email}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Phone className="h-4 w-4 mr-2" />
            <span>{member.phone}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{member.location}</span>
          </div>
          {member.availability !== 'available' && (
            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Available: {formatNextAvailability(member.nextAvailability)}</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Specialties</h4>
          <div className="flex flex-wrap gap-1">
            {member.specialties.map((specialty, index) => (
              <span 
                key={index} 
                className="text-xs bg-gray-100 px-2 py-1 rounded"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full space-x-2">
          <Button variant="outline" className="flex-1">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
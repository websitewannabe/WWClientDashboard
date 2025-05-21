import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/layout/page-header";

// Define form schema using Zod
const clientFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(5, { message: "Phone number is required" }),
  website: z.string().url({ message: "Must be a valid URL" }).or(z.literal("")),
  contactPerson: z.string().min(2, { message: "Contact person is required" }),
  plan: z.enum(["Basic", "Business", "Premium"]),
  billingCycle: z.enum(["monthly", "annual"]),
  address: z.string().min(3, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(2, { message: "Zip/Postal code is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  notes: z.string().optional(),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "paypal"])
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

// Default values for the form
const defaultValues: Partial<ClientFormValues> = {
  plan: "Business",
  billingCycle: "monthly",
  paymentMethod: "credit_card",
  country: "United States"
};

export default function AddClientPage() {
  const [, setLocation] = useLocation();
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues
  });
  
  function onSubmit(values: ClientFormValues) {
    // Here you would typically save the client data to your database
    console.log(values);
    
    // For demo purposes, show an alert and redirect to admin dashboard
    alert("Client added successfully!");
    setLocation("/admin");
  }
  
  function handleCancel() {
    if (confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      setLocation("/admin");
    }
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => setLocation("/admin")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Button>
      </div>
      
      <PageHeader 
        title="Add New Client" 
        description="Create a new client account"
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="general" className="mt-6">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General Information</TabsTrigger>
              <TabsTrigger value="contact">Contact & Address</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="additional">Additional Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Basic details about the client</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company/Client Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corporation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormDescription>Enter the client's website URL (if available)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormDescription>The main person to contact at this client</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>How to reach the client</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street, Suite 400" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Springfield" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="IL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip/Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="62701" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="United States">United States</SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                              <SelectItem value="Australia">Australia</SelectItem>
                              <SelectItem value="Germany">Germany</SelectItem>
                              <SelectItem value="France">France</SelectItem>
                              <SelectItem value="Japan">Japan</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                  <CardDescription>Plan and billing information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Plan</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                          <div className={`border rounded-lg p-4 cursor-pointer ${field.value === 'Basic' ? 'border-[#FF5722] bg-orange-50' : ''}`} onClick={() => field.onChange('Basic')}>
                            <div className="font-medium">Basic</div>
                            <div className="text-2xl font-bold mt-1">$99.99</div>
                            <div className="text-sm text-gray-500">per month</div>
                            <div className="text-sm mt-2">Essential hosting for small business websites</div>
                          </div>
                          
                          <div className={`border rounded-lg p-4 cursor-pointer ${field.value === 'Business' ? 'border-[#FF5722] bg-orange-50' : ''}`} onClick={() => field.onChange('Business')}>
                            <div className="flex justify-between">
                              <div className="font-medium">Business</div>
                              <div className="bg-[#FF5722] text-white px-2 py-0.5 text-xs rounded-full">Popular</div>
                            </div>
                            <div className="text-2xl font-bold mt-1">$249.99</div>
                            <div className="text-sm text-gray-500">per month</div>
                            <div className="text-sm mt-2">Professional hosting with enhanced features</div>
                          </div>
                          
                          <div className={`border rounded-lg p-4 cursor-pointer ${field.value === 'Premium' ? 'border-[#FF5722] bg-orange-50' : ''}`} onClick={() => field.onChange('Premium')}>
                            <div className="font-medium">Premium</div>
                            <div className="text-2xl font-bold mt-1">$499.99</div>
                            <div className="text-sm text-gray-500">per month</div>
                            <div className="text-sm mt-2">Enterprise-grade hosting with maximum resources</div>
                          </div>
                        </div>
                        <FormControl>
                          <input type="hidden" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billingCycle"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Billing Cycle</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="monthly" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Monthly
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="annual" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Annual (Save 15%)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="credit_card" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Credit Card
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="bank_transfer" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Bank Transfer
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="paypal" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                PayPal
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="additional">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>Other details about the client</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any additional notes or comments about this client..." 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Internal notes that will not be visible to the client
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-between">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Create Client
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
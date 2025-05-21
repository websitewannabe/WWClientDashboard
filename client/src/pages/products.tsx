import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Check, 
  Package, 
  ArrowRight, 
  ChevronUp, 
  Circle, 
  CheckCircle2,
  X,
  AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";

interface ProductPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: "monthly" | "annual";
  features: {
    name: string;
    included: boolean;
    highlight?: boolean;
  }[];
  limits: {
    storage: number;
    bandwidth: number;
    sites: number;
    support: string;
  };
  popular?: boolean;
  current?: boolean;
}

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: "monthly" | "annual";
  active: boolean;
}

interface CurrentUsage {
  storage: {
    used: number;
    total: number;
  };
  bandwidth: {
    used: number;
    total: number;
  };
  sites: {
    used: number;
    total: number;
  };
}

const demoPlans: ProductPlan[] = [
  {
    id: "plan-basic",
    name: "Basic",
    description: "Essential hosting for small business websites",
    price: 99.99,
    billingCycle: "monthly",
    features: [
      { name: "Single Website", included: true },
      { name: "10GB Storage", included: true },
      { name: "50GB Bandwidth", included: true },
      { name: "Free SSL Certificate", included: true },
      { name: "Daily Backups", included: true },
      { name: "24/7 Email Support", included: true },
      { name: "Custom Domain", included: true },
      { name: "SEO Tools", included: false },
      { name: "E-commerce Functionality", included: false },
      { name: "Priority Support", included: false }
    ],
    limits: {
      storage: 10,
      bandwidth: 50,
      sites: 1,
      support: "Email Support"
    }
  },
  {
    id: "plan-business",
    name: "Business",
    description: "Professional hosting with enhanced features",
    price: 249.99,
    billingCycle: "monthly",
    features: [
      { name: "Up to 5 Websites", included: true, highlight: true },
      { name: "50GB Storage", included: true, highlight: true },
      { name: "200GB Bandwidth", included: true, highlight: true },
      { name: "Free SSL Certificate", included: true },
      { name: "Daily Backups", included: true },
      { name: "24/7 Email & Chat Support", included: true, highlight: true },
      { name: "Custom Domain", included: true },
      { name: "SEO Tools", included: true, highlight: true },
      { name: "E-commerce Functionality", included: true, highlight: true },
      { name: "Priority Support", included: false }
    ],
    limits: {
      storage: 50,
      bandwidth: 200,
      sites: 5,
      support: "Email & Chat Support"
    },
    popular: true,
    current: true
  },
  {
    id: "plan-premium",
    name: "Premium",
    description: "Enterprise-grade hosting with maximum resources",
    price: 499.99,
    billingCycle: "monthly",
    features: [
      { name: "Unlimited Websites", included: true, highlight: true },
      { name: "200GB Storage", included: true, highlight: true },
      { name: "1TB Bandwidth", included: true, highlight: true },
      { name: "Free SSL Certificate", included: true },
      { name: "Hourly Backups", included: true, highlight: true },
      { name: "24/7 Phone, Email & Chat Support", included: true, highlight: true },
      { name: "Custom Domain", included: true },
      { name: "Advanced SEO Tools", included: true, highlight: true },
      { name: "E-commerce Functionality", included: true },
      { name: "Priority Support", included: true, highlight: true }
    ],
    limits: {
      storage: 200,
      bandwidth: 1000,
      sites: 999,
      support: "Phone, Email & Chat Support"
    }
  }
];

const demoAddons: Addon[] = [
  {
    id: "addon-seo",
    name: "SEO Booster",
    description: "Advanced SEO tools and monthly optimization report",
    price: 49.99,
    billingCycle: "monthly",
    active: true
  },
  {
    id: "addon-security",
    name: "Security Shield",
    description: "Enhanced security with malware scanning and firewall",
    price: 39.99,
    billingCycle: "monthly",
    active: true
  },
  {
    id: "addon-cdn",
    name: "Global CDN",
    description: "Content delivery network for faster global access",
    price: 29.99,
    billingCycle: "monthly",
    active: false
  },
  {
    id: "addon-backup",
    name: "Premium Backup",
    description: "Hourly backups with 30-day retention",
    price: 19.99,
    billingCycle: "monthly",
    active: false
  }
];

const currentUsage: CurrentUsage = {
  storage: {
    used: 32.5,
    total: 50
  },
  bandwidth: {
    used: 124.8,
    total: 200
  },
  sites: {
    used: 3,
    total: 5
  }
};

export default function Products() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  // Find the current plan
  const currentPlan = demoPlans.find(plan => plan.current);
  const activeAddons = demoAddons.filter(addon => addon.active);
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId === selectedPlan ? null : planId);
  };
  
  // Calculate storage and bandwidth percentages
  const storagePercentage = (currentUsage.storage.used / currentUsage.storage.total) * 100;
  const bandwidthPercentage = (currentUsage.bandwidth.used / currentUsage.bandwidth.total) * 100;
  const sitesPercentage = (currentUsage.sites.used / currentUsage.sites.total) * 100;
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Products & Services" 
        description="Manage your subscriptions and services"
      />
      
      {currentPlan && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Current Plan</h2>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{currentPlan.name} Plan</CardTitle>
                  <CardDescription>{currentPlan.description}</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Storage Usage</div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>{currentUsage.storage.used} GB used</span>
                      <span>{currentUsage.storage.total} GB total</span>
                    </div>
                    <Progress value={storagePercentage} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Bandwidth Usage</div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>{currentUsage.bandwidth.used} GB used</span>
                      <span>{currentUsage.bandwidth.total} GB total</span>
                    </div>
                    <Progress value={bandwidthPercentage} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Website Count</div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>{currentUsage.sites.used} sites active</span>
                      <span>{currentUsage.sites.total} sites included</span>
                    </div>
                    <Progress value={sitesPercentage} className="h-2" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Plan Features</h3>
                  <ul className="space-y-2">
                    {currentPlan.features
                      .filter(feature => feature.included)
                      .slice(0, 6)
                      .map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature.name}</span>
                        </li>
                      ))}
                    {currentPlan.features.filter(feature => feature.included).length > 6 && (
                      <li className="text-sm text-blue-600 pl-7">
                        + {currentPlan.features.filter(feature => feature.included).length - 6} more features
                      </li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">Current billing cycle</span>
                      <div className="text-2xl font-bold">{formatCurrency(currentPlan.price)}</div>
                      <div className="text-sm text-gray-500">per {currentPlan.billingCycle}</div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm font-medium mb-2">Active Add-ons</div>
                      {activeAddons.length > 0 ? (
                        <ul className="space-y-2">
                          {activeAddons.map(addon => (
                            <li key={addon.id} className="flex justify-between text-sm">
                              <span>{addon.name}</span>
                              <span>{formatCurrency(addon.price)}/{addon.billingCycle.charAt(0)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No active add-ons</p>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between font-medium">
                        <span>Total Monthly</span>
                        <span>
                          {formatCurrency(
                            currentPlan.price + 
                            activeAddons.reduce((sum, addon) => sum + addon.price, 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between border-t pt-6">
              <div className="flex items-center text-sm text-gray-500">
                <AlertCircle className="h-4 w-4 mr-2" />
                Renewal date: June 15, 2025
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Manage Add-ons</Button>
                <Button>Change Plan</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        
        <div className="flex justify-between items-center mb-6">
          <RadioGroup 
            defaultValue="monthly" 
            className="flex items-center space-x-4"
            onValueChange={(value) => setBillingCycle(value as "monthly" | "annual")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Monthly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="annual" id="annual" />
              <Label htmlFor="annual">Annual (Save 15%)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden transition-all ${
                plan.popular ? 'border-[#FF5722] shadow-lg' : ''
              } ${selectedPlan === plan.id ? 'ring-2 ring-[#FF5722]' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#FF5722] text-white px-3 py-1 text-xs font-medium">
                  Most Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">
                    {formatCurrency(billingCycle === 'annual' ? plan.price * 0.85 : plan.price)}
                  </span>
                  <span className="text-sm text-gray-500">/{billingCycle}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Included Resources</h3>
                    <ul className="space-y-1">
                      <li className="flex items-center text-sm">
                        <Package className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Storage: {plan.limits.storage} GB</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <ArrowRight className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Bandwidth: {plan.limits.bandwidth} GB</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Circle className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Sites: {plan.limits.sites === 999 ? 'Unlimited' : plan.limits.sites}</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Support: {plan.limits.support}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Features</h3>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          {feature.included ? (
                            <Check className={`h-5 w-5 mr-2 flex-shrink-0 ${
                              feature.highlight ? 'text-[#FF5722]' : 'text-green-500'
                            }`} />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${
                            !feature.included ? 'text-gray-400' : 
                            feature.highlight ? 'font-medium' : ''
                          }`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4">
                {plan.current ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {selectedPlan && (
          <div className="mt-6 flex justify-end">
            <Button size="lg">
              Upgrade to {demoPlans.find(p => p.id === selectedPlan)?.name}
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Available Add-ons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoAddons.map(addon => (
            <Card key={addon.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{addon.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{addon.description}</p>
                <div className="text-xl font-bold">
                  {formatCurrency(addon.price)}
                  <span className="text-sm font-normal text-gray-500">/{addon.billingCycle.charAt(0)}</span>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                {addon.active ? (
                  <Button variant="outline" className="w-full">Remove</Button>
                ) : (
                  <Button className="w-full">Add to Plan</Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
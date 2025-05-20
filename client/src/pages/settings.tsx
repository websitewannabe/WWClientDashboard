import PageHeader from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { LogOut, Save, User } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
            <CardDescription>You need to sign in to access your settings</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Button
              className="mt-4"
              onClick={() => {
                window.location.href = "/api/login";
              }}
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title="Settings" 
        description="Manage your account preferences and profile"
        showExportButton={false}
        showRefreshButton={false}
      />

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-10">Loading profile information...</div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex flex-col items-center space-y-3">
                        <Avatar className="h-24 w-24 border-2 border-slate-200">
                          <AvatarImage 
                            src={user?.profileImageUrl || ""} 
                            alt={`${user?.firstName || ''} ${user?.lastName || ''}`}
                          />
                          <AvatarFallback className="text-2xl">
                            <User className="h-12 w-12 text-slate-400" />
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          Change Avatar
                        </Button>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                            <input 
                              type="text" 
                              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500" 
                              value={user?.firstName || ''}
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                            <input 
                              type="text" 
                              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500" 
                              value={user?.lastName || ''}
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input 
                              type="email" 
                              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500" 
                              value={user?.email || ''}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                      <Button variant="outline" className="text-danger-500" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                      
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-slate-900">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Invoice Notifications</h4>
                      <p className="text-sm text-slate-500">Get notified when a new invoice is created</p>
                    </div>
                    <div>
                      <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Payment Reminders</h4>
                      <p className="text-sm text-slate-500">Receive reminders about upcoming payments</p>
                    </div>
                    <div>
                      <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Support Ticket Updates</h4>
                      <p className="text-sm text-slate-500">Get notified when your support tickets are updated</p>
                    </div>
                    <div>
                      <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Analytics Reports</h4>
                      <p className="text-sm text-slate-500">Receive weekly analytics reports</p>
                    </div>
                    <div>
                      <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Marketing Updates</h4>
                      <p className="text-sm text-slate-500">Receive emails about new features and services</p>
                    </div>
                    <div>
                      <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Button>Save Notification Settings</Button>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-slate-900">Security Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Change Password</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Current Password</label>
                        <input type="password" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">New Password</label>
                        <input type="password" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                        <input type="password" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                      </div>
                      <Button>Update Password</Button>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-200">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account</p>
                    <Button variant="outline">Enable Two-Factor Authentication</Button>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-200">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Login Sessions</h4>
                    <p className="text-sm text-slate-500 mb-4">Manage your active sessions</p>
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900">Current Session</p>
                          <p className="text-xs text-slate-500">Started: Today at 10:24 AM</p>
                        </div>
                        <Button variant="outline" size="sm">Sign Out</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="billing">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-slate-900">Billing Information</h3>
                
                <div className="bg-slate-50 p-4 rounded-md mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Current Plan</p>
                      <p className="text-lg font-semibold text-primary-600">Business Pro</p>
                    </div>
                    <Badge variant="paid">Active</Badge>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-slate-500">Next billing date: June 15, 2023</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-900">Payment Method</h4>
                  <div className="flex items-center p-4 border border-slate-200 rounded-md">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-16 rounded-md bg-slate-200 flex items-center justify-center text-slate-500">
                        VISA
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-900">Visa ending in 4242</p>
                      <p className="text-xs text-slate-500">Expires 12/2024</p>
                    </div>
                    <div className="ml-auto">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Remove</Button>
                    </div>
                  </div>
                  <Button variant="outline">Add Payment Method</Button>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-900">Billing Address</h4>
                  <div className="p-4 border border-slate-200 rounded-md">
                    <p className="text-sm font-medium text-slate-900">Acme Inc.</p>
                    <p className="text-sm text-slate-500">123 Main St.</p>
                    <p className="text-sm text-slate-500">Suite 100</p>
                    <p className="text-sm text-slate-500">San Francisco, CA 94103</p>
                    <p className="text-sm text-slate-500">United States</p>
                    <div className="mt-3">
                      <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 p-0">Edit address</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-900">Billing History</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Invoice
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            May 15, 2023
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            Business Pro Plan - Monthly
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            $99.00
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href="#" className="text-primary-600 hover:text-primary-700">Download</a>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            Apr 15, 2023
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            Business Pro Plan - Monthly
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            $99.00
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href="#" className="text-primary-600 hover:text-primary-700">Download</a>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            Mar 15, 2023
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            Business Pro Plan - Monthly
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            $99.00
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href="#" className="text-primary-600 hover:text-primary-700">Download</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}

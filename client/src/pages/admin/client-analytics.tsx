import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Save, RefreshCw } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/layout/page-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ClientAnalytics {
  id: string;
  name: string;
  email: string;
  gaMeasurementId: string | null;
  gaPropertyId: string | null;
  gaViewId: string | null;
  gscSiteUrl: string | null;
  gscVerificationMethod: string | null;
  gscVerified: string | null;
}

export default function ClientAnalytics() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<ClientAnalytics | null>(null);
  const [gaMeasurementId, setGaMeasurementId] = useState('');
  const [gaPropertyId, setGaPropertyId] = useState('');
  const [gaViewId, setGaViewId] = useState('');
  const [gscSiteUrl, setGscSiteUrl] = useState('');
  const [gscVerificationMethod, setGscVerificationMethod] = useState('DNS');
  const [gscVerified, setGscVerified] = useState('false');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all clients
  const { data: clients, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/admin/clients'],
    enabled: isAuthenticated
  });

  // When a client is selected, update the form fields
  useEffect(() => {
    if (selectedClient) {
      setGaMeasurementId(selectedClient.gaMeasurementId || '');
      setGaPropertyId(selectedClient.gaPropertyId || '');
      setGaViewId(selectedClient.gaViewId || '');
      setGscSiteUrl(selectedClient.gscSiteUrl || '');
      setGscVerificationMethod(selectedClient.gscVerificationMethod || 'DNS');
      setGscVerified(selectedClient.gscVerified || 'false');
    } else {
      setGaMeasurementId('');
      setGaPropertyId('');
      setGaViewId('');
      setGscSiteUrl('');
      setGscVerificationMethod('DNS');
      setGscVerified('false');
    }
  }, [selectedClient]);

  // Handle selection of a client
  const handleSelectClient = (client: ClientAnalytics) => {
    setSelectedClient(client);
  };

  // Save the analytics settings for a client
  const handleSaveAnalytics = async () => {
    if (!selectedClient) {
      toast({
        title: "No client selected",
        description: "Please select a client first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await apiRequest('PATCH', `/api/admin/clients/${selectedClient.id}/analytics`, {
        gaMeasurementId,
        gaPropertyId,
        gaViewId,
        gscSiteUrl,
        gscVerificationMethod,
        gscVerified
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update client analytics settings');
      }

      toast({
        title: "Success",
        description: "Analytics settings updated successfully",
      });

      // Refresh the client list
      refetch();
      setSelectedClient(null);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update client analytics settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600">Loading client data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Unable to load clients</h3>
          <p className="text-slate-600 mb-4">
            There was a problem loading client data. Please try again later.
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Mock implementation if no API yet
  const demoClients: ClientAnalytics[] = clients || [
    {
      id: "client-001",
      name: "Acme Corporation",
      email: "contact@acmecorp.com",
      gaMeasurementId: "G-XXXXXXX1",
      gaPropertyId: "123456789",
      gaViewId: "987654321",
      gscSiteUrl: "https://acmecorp.com",
      gscVerificationMethod: "DNS",
      gscVerified: "true"
    },
    {
      id: "client-002",
      name: "Global Enterprises",
      email: "info@globalenterprises.com",
      gaMeasurementId: null,
      gaPropertyId: null,
      gaViewId: null,
      gscSiteUrl: null,
      gscVerificationMethod: null,
      gscVerified: null
    },
    {
      id: "client-003",
      name: "Local Shop",
      email: "support@localshop.com",
      gaMeasurementId: "G-XXXXXXX3",
      gaPropertyId: "111222333",
      gaViewId: "444555666",
      gscSiteUrl: "https://localshop.com",
      gscVerificationMethod: "HTML_TAG",
      gscVerified: "true"
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Client Analytics" 
        description="Manage Google Analytics connections for each client"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Clients</CardTitle>
            <CardDescription>
              Select a client to configure their analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-y-auto max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoClients.map((client) => (
                    <TableRow 
                      key={client.id} 
                      className={`cursor-pointer ${selectedClient?.id === client.id ? 'bg-slate-100' : ''}`}
                      onClick={() => handleSelectClient(client)}
                    >
                      <TableCell>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-xs text-slate-500">{client.email}</div>
                      </TableCell>
                      <TableCell>
                        {client.gaMeasurementId ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            Not Connected
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Analytics Settings</CardTitle>
            <CardDescription>
              {selectedClient 
                ? `Configure analytics for ${selectedClient.name}` 
                : 'Select a client to configure their analytics'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedClient ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-slate-400">
                  <AlertCircle size={48} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-800">No Client Selected</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Select a client from the list to configure their analytics settings
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    The client needs to provide these Google Analytics credentials from their GA4 property. 
                    These values are used to fetch analytics data specific to their website.
                  </AlertDescription>
                </Alert>

                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-5 mb-5">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Google Analytics Settings</h3>
                    <p className="text-xs text-gray-500">Configure Google Analytics 4 for website traffic statistics</p>
                  </div>
                
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="gaMeasurementId" className="block text-sm font-medium text-slate-700 mb-1">
                        GA4 Measurement ID
                      </label>
                      <Input
                        id="gaMeasurementId"
                        value={gaMeasurementId}
                        onChange={(e) => setGaMeasurementId(e.target.value)}
                        placeholder="G-XXXXXXXXXX"
                        className="w-full"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        This ID starts with "G-" and can be found in GA4 Admin &gt; Data Streams
                      </p>
                    </div>

                    <div>
                      <label htmlFor="gaPropertyId" className="block text-sm font-medium text-slate-700 mb-1">
                        GA4 Property ID
                      </label>
                      <Input
                        id="gaPropertyId"
                        value={gaPropertyId}
                        onChange={(e) => setGaPropertyId(e.target.value)}
                        placeholder="123456789"
                        className="w-full"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        The numeric Property ID found in GA4 Admin &gt; Property Settings
                      </p>
                    </div>

                    <div>
                      <label htmlFor="gaViewId" className="block text-sm font-medium text-slate-700 mb-1">
                        GA4 View ID (optional)
                      </label>
                      <Input
                        id="gaViewId"
                        value={gaViewId}
                        onChange={(e) => setGaViewId(e.target.value)}
                        placeholder="987654321"
                        className="w-full"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        The View ID if using a specific view within the property
                      </p>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-5 mb-5 mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Google Search Console Settings</h3>
                    <p className="text-xs text-gray-500">Configure Google Search Console for SEO and search performance</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="gscSiteUrl" className="block text-sm font-medium text-slate-700 mb-1">
                        Website URL in Search Console
                      </label>
                      <Input
                        id="gscSiteUrl"
                        value={gscSiteUrl}
                        onChange={(e) => setGscSiteUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        The full URL of the client's website as registered in Search Console
                      </p>
                    </div>

                    <div>
                      <label htmlFor="gscVerificationMethod" className="block text-sm font-medium text-slate-700 mb-1">
                        Verification Method
                      </label>
                      <select
                        id="gscVerificationMethod"
                        value={gscVerificationMethod}
                        onChange={(e) => setGscVerificationMethod(e.target.value)}
                        className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="DNS">DNS Record</option>
                        <option value="HTML_FILE">HTML File</option>
                        <option value="HTML_TAG">HTML Meta Tag</option>
                        <option value="ANALYTICS">Google Analytics</option>
                        <option value="TAG_MANAGER">Google Tag Manager</option>
                      </select>
                      <p className="mt-1 text-xs text-slate-500">
                        The method used to verify ownership of the site in Search Console
                      </p>
                    </div>

                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        id="gscVerified"
                        checked={gscVerified === "true"}
                        onChange={(e) => setGscVerified(e.target.checked ? "true" : "false")}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="gscVerified" className="ml-2 block text-sm text-gray-900">
                        Site verified in Search Console
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setSelectedClient(null)}
              disabled={!selectedClient || isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAnalytics}
              disabled={!selectedClient || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Analytics Settings
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
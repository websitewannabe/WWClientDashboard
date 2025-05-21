import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, UserPlus, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ImportContacts() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [singleImportLoading, setSingleImportLoading] = useState(false);
  const [bulkImportLoading, setBulkImportLoading] = useState(false);
  const [importStats, setImportStats] = useState<{
    created: number;
    updated: number;
    errors: number;
  } | null>(null);

  // Handle single contact import
  const handleImportByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address to import.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSingleImportLoading(true);
      const response = await apiRequest('POST', '/api/admin/intercom/import-contact', { email });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to import contact');
      }
      
      toast({
        title: "Success",
        description: "Contact imported successfully",
      });
      
      setEmail('');
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message || "Failed to import contact from Intercom",
        variant: "destructive",
      });
    } finally {
      setSingleImportLoading(false);
    }
  };

  // Handle bulk import from Intercom
  const handleBulkImport = async () => {
    try {
      setBulkImportLoading(true);
      const response = await apiRequest('POST', '/api/admin/intercom/sync-all-contacts');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sync contacts');
      }
      
      const data = await response.json();
      setImportStats(data);
      
      toast({
        title: "Sync completed",
        description: `Created: ${data.created}, Updated: ${data.updated}, Errors: ${data.errors}`,
      });
    } catch (error: any) {
      toast({
        title: "Sync failed",
        description: error.message || "Failed to sync contacts from Intercom",
        variant: "destructive",
      });
    } finally {
      setBulkImportLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not admin (in a real app, would check if user has admin role)
  if (!user) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication required</AlertTitle>
          <AlertDescription>
            You need to be logged in to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Import Contacts</h1>
        <p className="text-slate-500 mt-2">
          Import client data from Intercom to create user accounts in the client portal
        </p>
      </div>

      <Tabs defaultValue="single" className="space-y-4">
        <TabsList>
          <TabsTrigger value="single">Single Contact</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Single Contact</CardTitle>
              <CardDescription>
                Import a contact by email address from your Intercom account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleImportByEmail} className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                  <Input
                    id="email"
                    placeholder="client@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                  />
                </div>
                <Button type="submit" disabled={singleImportLoading}>
                  {singleImportLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Import Contact
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Import from Intercom</CardTitle>
              <CardDescription>
                Import all contacts from your Intercom account to create or update users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  This will import all contacts from Intercom that have an email address. Depending on the number of contacts, this may take some time.
                </AlertDescription>
              </Alert>
              
              {importStats && (
                <div className="rounded-md bg-slate-50 p-4 mt-4">
                  <h4 className="font-medium mb-2">Last Import Results</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-slate-500">Created</p>
                      <p className="text-2xl font-bold text-green-600">{importStats.created}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Updated</p>
                      <p className="text-2xl font-bold text-blue-600">{importStats.updated}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Errors</p>
                      <p className="text-2xl font-bold text-red-600">{importStats.errors}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleBulkImport} 
                disabled={bulkImportLoading}
                variant="default"
              >
                {bulkImportLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing Contacts...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Import All Contacts
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
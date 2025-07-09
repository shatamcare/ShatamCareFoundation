import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  is_active: boolean;
}

interface DashboardStats {
  totalContacts: number;
  newContacts: number;
  totalSubscribers: number;
  todayContacts: number;
}

const AdminDashboard: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    newContacts: 0,
    totalSubscribers: 0,
    todayContacts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please log in to access the admin dashboard');
        return;
      }
      setUser(user);
    } catch (err) {
      console.error('Auth error:', err);
      setError('Authentication failed');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (contactsError) throw contactsError;

      // Fetch newsletter subscribers
      const { data: subscribersData, error: subscribersError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (subscribersError) throw subscribersError;

      setContacts(contactsData || []);
      setSubscribers(subscribersData || []);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayContacts = contactsData?.filter(c => 
        c.created_at.startsWith(today)
      ).length || 0;

      const newContacts = contactsData?.filter(c => 
        c.status === 'new'
      ).length || 0;

      setStats({
        totalContacts: contactsData?.length || 0,
        newContacts,
        totalSubscribers: subscribersData?.length || 0,
        todayContacts
      });

    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status: newStatus })
        .eq('id', contactId);

      if (error) throw error;

      // Update local state
      setContacts(prev => 
        prev.map(c => 
          c.id === contactId ? { ...c, status: newStatus } : c
        )
      );

      // Update stats
      setStats(prev => ({
        ...prev,
        newContacts: prev.newContacts - (newStatus !== 'new' ? 1 : 0)
      }));

    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update contact status');
    }
  };

  const exportContacts = async () => {
    try {
      const { data, error } = await supabase
        .rpc('export_contacts_csv');

      if (error) throw error;

      // Create and download file
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export contacts');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertTriangle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please log in to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.email}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={fetchData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={exportContacts} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Contacts</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.newContacts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Newsletter Subscribers</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalSubscribers}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Contacts</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.todayContacts}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
            <CardDescription>Manage and respond to contact form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">Loading contacts...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Message</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{contact.name}</td>
                        <td className="p-3">
                          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                            {contact.email}
                          </a>
                        </td>
                        <td className="p-3 max-w-xs truncate">{contact.message}</td>
                        <td className="p-3">
                          <Badge className={getStatusColor(contact.status)}>
                            {getStatusIcon(contact.status)}
                            <span className="ml-1 capitalize">{contact.status.replace('_', ' ')}</span>
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-gray-500">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-1">
                            {contact.status === 'new' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateContactStatus(contact.id, 'in_progress')}
                              >
                                Start
                              </Button>
                            )}
                            {contact.status === 'in_progress' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateContactStatus(contact.id, 'resolved')}
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Newsletter Subscribers */}
        <Card>
          <CardHeader>
            <CardTitle>Newsletter Subscribers</CardTitle>
            <CardDescription>Manage newsletter subscription list</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{subscriber.email}</td>
                      <td className="p-3">{subscriber.name || '-'}</td>
                      <td className="p-3">
                        <Badge className={subscriber.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {subscriber.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-500">
                        {new Date(subscriber.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

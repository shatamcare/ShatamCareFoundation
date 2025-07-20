import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase-secure';
import { 
  Users, 
  Mail, 
  Calendar, 
  TrendingUp, 
  RefreshCw, 
  Download,
  MessageSquare,
  UserPlus,
  CalendarCheck,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalContacts: number;
  totalNewsletters: number;
  totalEvents: number;
  totalRegistrations: number;
  recentContacts: number;
  recentNewsletters: number;
  recentRegistrations: number;
}

interface RecentActivity {
  id: string;
  type: 'contact' | 'newsletter' | 'registration';
  title: string;
  description: string;
  timestamp: string;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalNewsletters: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    recentContacts: 0,
    recentNewsletters: 0,
    recentRegistrations: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // Get current date and 24 hours ago
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Fetch all contacts
      const { data: allContacts, error: contactsError } = await supabase
        .from('contacts')
        .select('id, created_at, name, email, message');

      if (contactsError) throw contactsError;

      // Fetch all newsletters
      const { data: allNewsletters, error: newslettersError } = await supabase
        .from('newsletter_subscribers')
        .select('id, created_at, email, name');

      if (newslettersError) throw newslettersError;

      // Fetch all events
      const { data: allEvents, error: eventsError } = await supabase
        .from('events')
        .select('id, created_at, title');

      if (eventsError) throw eventsError;

      // Fetch all registrations
      const { data: allRegistrations, error: registrationsError } = await supabase
        .from('event_registrations')
        .select('id, created_at, name, email, event_id');

      if (registrationsError) throw registrationsError;

      // Calculate stats
      const recentContacts = allContacts?.filter(contact => 
        new Date(contact.created_at) > yesterday
      ).length || 0;

      const recentNewsletters = allNewsletters?.filter(newsletter => 
        new Date(newsletter.created_at) > yesterday
      ).length || 0;

      const recentRegistrations = allRegistrations?.filter(registration => 
        new Date(registration.created_at) > yesterday
      ).length || 0;

      setStats({
        totalContacts: allContacts?.length || 0,
        totalNewsletters: allNewsletters?.length || 0,
        totalEvents: allEvents?.length || 0,
        totalRegistrations: allRegistrations?.length || 0,
        recentContacts,
        recentNewsletters,
        recentRegistrations,
      });

      // Build recent activity
      const activities: RecentActivity[] = [];

      // Add recent contacts
      allContacts?.slice(0, 3).forEach(contact => {
        activities.push({
          id: contact.id,
          type: 'contact',
          title: 'New Contact Message',
          description: `${contact.name} sent a message`,
          timestamp: contact.created_at,
        });
      });

      // Add recent newsletters
      allNewsletters?.slice(0, 2).forEach(newsletter => {
        activities.push({
          id: newsletter.id,
          type: 'newsletter',
          title: 'Newsletter Signup',
          description: `${newsletter.email} subscribed`,
          timestamp: newsletter.created_at,
        });
      });

      // Add recent registrations
      allRegistrations?.slice(0, 2).forEach(registration => {
        activities.push({
          id: registration.id,
          type: 'registration',
          title: 'Event Registration',
          description: `${registration.name} registered for event`,
          timestamp: registration.created_at,
        });
      });

      // Sort by timestamp and take top 8
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 8));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'newsletter':
        return <UserPlus className="h-4 w-4 text-green-600" />;
      case 'registration':
        return <CalendarCheck className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const exportData = async (type: 'contacts' | 'newsletters' | 'registrations') => {
    try {
      let data: Record<string, unknown>[] = [];
      let filename = '';

      switch (type) {
        case 'contacts': {
          const { data: contacts } = await supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });
          data = contacts || [];
          filename = 'contacts_export.csv';
          break;
        }
        case 'newsletters': {
          const { data: newsletters } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .order('created_at', { ascending: false });
          data = newsletters || [];
          filename = 'newsletter_subscribers_export.csv';
          break;
        }
        case 'registrations': {
          const { data: registrations } = await supabase
            .from('event_registrations')
            .select('*')
            .order('created_at', { ascending: false });
          data = registrations || [];
          filename = 'event_registrations_export.csv';
          break;
        }
      }

      if (data.length === 0) {
        alert('No data to export');
        return;
      }

      // Convert to CSV
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => 
            JSON.stringify(row[header] || '')
          ).join(',')
        )
      ].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-warm-teal"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your admin dashboard</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="outline"
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
                {stats.recentContacts > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    +{stats.recentContacts} in last 24h
                  </p>
                )}
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Newsletter Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalNewsletters}</p>
                {stats.recentNewsletters > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    +{stats.recentNewsletters} in last 24h
                  </p>
                )}
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Event Registrations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
                {stats.recentRegistrations > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    +{stats.recentRegistrations} in last 24h
                  </p>
                )}
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-warm-teal" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-warm-teal" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => exportData('contacts')}
                className="w-full justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Contacts ({stats.totalContacts})
              </Button>
              <Button
                variant="outline"
                onClick={() => exportData('newsletters')}
                className="w-full justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Newsletter Subscribers ({stats.totalNewsletters})
              </Button>
              <Button
                variant="outline"
                onClick={() => exportData('registrations')}
                className="w-full justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Event Registrations ({stats.totalRegistrations})
              </Button>
              <Button
                onClick={() => window.open('/', '_blank')}
                className="w-full justify-start bg-warm-teal hover:bg-warm-teal-600"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Live Website
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

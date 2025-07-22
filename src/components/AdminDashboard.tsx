import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase-secure';
import { runDeploymentCheck, type DeploymentCheckResult } from '@/utils/deployment-checker';
import { Mail, Phone, Calendar, Users, MessageSquare, TrendingUp, RefreshCw, CheckCircle, XCircle, AlertTriangle, Settings } from 'lucide-react';

interface AdminDashboardProps {
  className?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ className = '' }) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentCheckResult | null>(null);
  const [checkingDeployment, setCheckingDeployment] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch contacts
      const { data: contactData, error: contactError } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (contactError) throw contactError;
      setContacts(contactData || []);

      // Fetch newsletter subscribers
      const { data: newsletterData, error: newsletterError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (newsletterError) throw newsletterError;
      setNewsletters(newsletterData || []);

      // Fetch event registrations
      const { data: registrationData, error: registrationError } = await supabase
        .from('event_registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (registrationError) throw registrationError;
      setRegistrations(registrationData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please check your Supabase connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    checkDeploymentStatus();
  }, []);

  const checkDeploymentStatus = async () => {
    setCheckingDeployment(true);
    try {
      const status = await runDeploymentCheck();
      setDeploymentStatus(status);
    } catch (error) {
      console.error('Deployment check failed:', error);
    } finally {
      setCheckingDeployment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-charcoal">Admin Dashboard</h1>
            <p className="text-gray-600">View recent submissions and user activity</p>
          </div>
          <Button onClick={fetchData} disabled={loading} className="bg-warm-teal hover:bg-warm-teal/90">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Deployment Status */}
        {deploymentStatus && (
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Status
              </CardTitle>
              <Button 
                onClick={checkDeploymentStatus} 
                disabled={checkingDeployment}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${checkingDeployment ? 'animate-spin' : ''}`} />
                Check
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Overall Status */}
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  deploymentStatus.isReady 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-yellow-50 text-yellow-800'
                }`}>
                  {deploymentStatus.isReady ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                  <span className="font-medium">
                    {deploymentStatus.isReady ? 'All systems operational' : 'Setup required'}
                  </span>
                </div>

                {/* Check Details */}
                {!deploymentStatus.isReady && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Database Checks */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Database</h4>
                      {deploymentStatus.checks.database.map((check, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm mb-1">
                          {check.status === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : check.status === 'warning' ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={
                            check.status === 'success' ? 'text-green-700' :
                            check.status === 'warning' ? 'text-yellow-700' : 'text-red-700'
                          }>
                            {check.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Storage Checks */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Storage</h4>
                      {deploymentStatus.checks.storage.map((check, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm mb-1">
                          {check.status === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : check.status === 'warning' ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={
                            check.status === 'success' ? 'text-green-700' :
                            check.status === 'warning' ? 'text-yellow-700' : 'text-red-700'
                          }>
                            {check.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Auth Checks */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Authentication</h4>
                      {deploymentStatus.checks.auth.map((check, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm mb-1">
                          {check.status === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : check.status === 'warning' ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={
                            check.status === 'success' ? 'text-green-700' :
                            check.status === 'warning' ? 'text-yellow-700' : 'text-red-700'
                          }>
                            {check.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {deploymentStatus.nextSteps.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      {deploymentStatus.nextSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.length}</div>
              <p className="text-xs text-muted-foreground">Recent submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newsletters.length}</div>
              <p className="text-xs text-muted-foreground">Recent signups</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Event Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{registrations.length}</div>
              <p className="text-xs text-muted-foreground">Recent registrations</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Contacts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-warm-teal" />
              Recent Contact Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No contact messages yet</div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-dark-charcoal">{contact.name}</h3>
                          <span className="text-xs bg-warm-teal/10 text-warm-teal px-2 py-1 rounded">
                            {contact.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                        <p className="text-sm font-medium text-dark-charcoal mb-2">{contact.subject}</p>
                        <p className="text-sm text-gray-700">{contact.message}</p>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div>{formatDate(contact.created_at)}</div>
                        {contact.phone && (
                          <div className="mt-1 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Newsletter Signups */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-sunrise-orange" />
              Recent Newsletter Signups
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : newsletters.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No newsletter signups yet</div>
            ) : (
              <div className="space-y-3">
                {newsletters.map((newsletter) => (
                  <div key={newsletter.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                    <div>
                      <p className="font-medium text-dark-charcoal">{newsletter.name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-600">{newsletter.email}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>{formatDate(newsletter.created_at)}</div>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {newsletter.source}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Event Registrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-sage-600" />
              Recent Event Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No event registrations yet</div>
            ) : (
              <div className="space-y-4">
                {registrations.map((registration) => (
                  <div key={registration.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-dark-charcoal">{registration.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{registration.email}</p>
                        <p className="text-sm text-gray-600 mb-2">{registration.phone}</p>
                        <p className="text-xs text-gray-500">Event ID: {registration.event_id}</p>
                        {registration.motivation && (
                          <p className="text-sm text-gray-700 mt-2 italic">"{registration.motivation}"</p>
                        )}
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div>{formatDate(registration.created_at)}</div>
                        {registration.emergency_contact && (
                          <div className="mt-1">Emergency: {registration.emergency_contact}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

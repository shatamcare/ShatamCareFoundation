import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase-secure';
import { 
  Users,
  Mail,
  Phone,
  Search,
  Download,
  RefreshCw,
  Filter,
  Trash2,
  Eye,
  EyeOff,
  MessageSquare,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
}

interface Newsletter {
  id: string;
  email: string;
  name?: string;
  source?: string;
  created_at: string;
}

interface EventRegistration {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  emergency_contact?: string;
  medical_conditions?: string;
  dietary_requirements?: string;
  experience?: string;
  motivation?: string;
  status: string;
  created_at: string;
  events?: {
    title: string;
    date: string;
  };
}

const ContactsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'newsletters' | 'registrations'>('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch contacts
      const { data: contactData, error: contactError } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (contactError) throw contactError;
      setContacts(contactData || []);

      // Fetch newsletters
      const { data: newsletterData, error: newsletterError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (newsletterError) throw newsletterError;
      setNewsletters(newsletterData || []);

      // Fetch registrations with event info
      const { data: registrationData, error: registrationError } = await supabase
        .from('event_registrations')
        .select(`
          *,
          events (
            title,
            date
          )
        `)
        .order('created_at', { ascending: false });

      if (registrationError) throw registrationError;
      setRegistrations(registrationData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
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

  const exportData = async (type: 'contacts' | 'newsletters' | 'registrations') => {
    try {
      let data: Record<string, unknown>[] = [];
      let filename = '';

      switch (type) {
        case 'contacts':
          data = contacts;
          filename = 'contacts_export.csv';
          break;
        case 'newsletters':
          data = newsletters;
          filename = 'newsletter_subscribers_export.csv';
          break;
        case 'registrations':
          data = registrations.map(reg => ({
            ...reg,
            event_title: reg.events?.title,
            event_date: reg.events?.date,
          }));
          filename = 'event_registrations_export.csv';
          break;
      }

      if (data.length === 0) {
        setError('No data to export');
        return;
      }

      // Convert to CSV
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            return `"${String(value).replace(/"/g, '""')}"`;
          }).join(',')
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
      
      setSuccess('Data exported successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export data');
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContacts(contacts.filter(contact => contact.id !== id));
      setSuccess('Contact deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting contact:', error);
      setError('Failed to delete contact');
    }
  };

  const deleteNewsletter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this newsletter subscription?')) return;

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNewsletters(newsletters.filter(newsletter => newsletter.id !== id));
      setSuccess('Newsletter subscription deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      setError('Failed to delete newsletter subscription');
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNewsletters = newsletters.filter(newsletter =>
    newsletter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (newsletter.name && newsletter.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRegistrations = registrations.filter(registration =>
    registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (registration.events?.title && registration.events.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'contacts':
        return (
          <div className="space-y-4">
            {filteredContacts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
                  <p className="text-gray-600">No contact messages match your search criteria</p>
                </CardContent>
              </Card>
            ) : (
              filteredContacts.map((contact) => (
                <Card key={contact.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                          <Badge variant="outline">{formatDate(contact.created_at)}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {contact.email}
                          </div>
                          {contact.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-800 leading-relaxed">
                            {selectedContact?.id === contact.id 
                              ? contact.message 
                              : contact.message.length > 200 
                                ? `${contact.message.substring(0, 200)}...`
                                : contact.message
                            }
                          </p>
                          {contact.message.length > 200 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedContact(
                                selectedContact?.id === contact.id ? null : contact
                              )}
                              className="mt-2 text-warm-teal hover:text-warm-teal-600"
                            >
                              {selectedContact?.id === contact.id ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-1" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Read More
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteContact(contact.id)}
                        className="ml-4 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        );

      case 'newsletters':
        return (
          <div className="space-y-4">
            {filteredNewsletters.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No newsletter subscribers found</h3>
                  <p className="text-gray-600">No subscribers match your search criteria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNewsletters.map((newsletter) => (
                  <Card key={newsletter.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Mail className="h-4 w-4 text-warm-teal mr-2" />
                            <span className="text-sm font-medium text-gray-900">{newsletter.email}</span>
                          </div>
                          {newsletter.name && (
                            <p className="text-sm text-gray-600 mb-2">{newsletter.name}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{formatDate(newsletter.created_at)}</span>
                            {newsletter.source && (
                              <Badge variant="outline" className="text-xs">{newsletter.source}</Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteNewsletter(newsletter.id)}
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'registrations':
        return (
          <div className="space-y-4">
            {filteredRegistrations.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No event registrations found</h3>
                  <p className="text-gray-600">No registrations match your search criteria</p>
                </CardContent>
              </Card>
            ) : (
              filteredRegistrations.map((registration) => (
                <Card key={registration.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{registration.name}</h3>
                          <Badge variant="outline">{registration.status}</Badge>
                          <Badge className="bg-warm-teal">{registration.events?.title || 'Unknown Event'}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {registration.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {registration.phone}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(registration.created_at)}
                          </div>
                        </div>
                        
                        {selectedRegistration?.id === registration.id && (
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            {registration.emergency_contact && (
                              <div>
                                <span className="font-medium text-gray-700">Emergency Contact:</span>
                                <p className="text-gray-800">{registration.emergency_contact}</p>
                              </div>
                            )}
                            {registration.medical_conditions && (
                              <div>
                                <span className="font-medium text-gray-700">Medical Conditions:</span>
                                <p className="text-gray-800">{registration.medical_conditions}</p>
                              </div>
                            )}
                            {registration.dietary_requirements && (
                              <div>
                                <span className="font-medium text-gray-700">Dietary Requirements:</span>
                                <p className="text-gray-800">{registration.dietary_requirements}</p>
                              </div>
                            )}
                            {registration.experience && (
                              <div>
                                <span className="font-medium text-gray-700">Experience:</span>
                                <p className="text-gray-800">{registration.experience}</p>
                              </div>
                            )}
                            {registration.motivation && (
                              <div>
                                <span className="font-medium text-gray-700">Motivation:</span>
                                <p className="text-gray-800">{registration.motivation}</p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRegistration(
                              selectedRegistration?.id === registration.id ? null : registration
                            )}
                          >
                            {selectedRegistration?.id === registration.id ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-1" />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Contacts & Communications</h1>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-warm-teal"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts & Communications</h1>
          <p className="text-gray-600">Manage contact messages, newsletter subscribers, and event registrations</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="outline"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => exportData(activeTab)}
            className="bg-warm-teal hover:bg-warm-teal-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Export {activeTab}
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contacts'
                ? 'border-warm-teal text-warm-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            Contacts ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('newsletters')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'newsletters'
                ? 'border-warm-teal text-warm-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Mail className="h-4 w-4 inline mr-2" />
            Newsletter ({newsletters.length})
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'registrations'
                ? 'border-warm-teal text-warm-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Event Registrations ({registrations.length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default ContactsPage;

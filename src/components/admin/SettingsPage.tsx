import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase-secure';
import { 
  Settings,
  User,
  Mail,
  Bell,
  Shield,
  Database,
  Globe,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Key
} from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  created_at: string;
}

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  emailSettings: {
    fromName: string;
    fromEmail: string;
    replyTo: string;
  };
  features: {
    enableNewsletterSignup: boolean;
    enableEventRegistration: boolean;
    enableContactForm: boolean;
    enableDonations: boolean;
  };
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'admins' | 'email' | 'features' | 'database'>('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Shatam Care Foundation',
    siteDescription: 'Caring for Our Elderly with Compassion and Dignity',
    contactEmail: 'shatamcare@gmail.com',
    contactPhone: '+91 9158566665',
    address: 'Mumbai, Maharashtra, India',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
    },
    emailSettings: {
      fromName: 'Shatam Care Foundation',
      fromEmail: 'shatamcare@gmail.com',
      replyTo: 'shatamcare@gmail.com',
    },
    features: {
      enableNewsletterSignup: true,
      enableEventRegistration: true,
      enableContactForm: true,
      enableDonations: false,
    },
  });

  const loadAdmins = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Error loading admins:', error);
      setError('Failed to load admin users');
    }
  }, []);

  const loadSettings = useCallback(() => {
    // In a real app, this would load from database
    // For now, we'll use localStorage to persist settings
    const savedSettings = localStorage.getItem('shatam_admin_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...settings, ...parsed });
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, [settings]);

  const saveSettings = () => {
    try {
      localStorage.setItem('shatam_admin_settings', JSON.stringify(settings));
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings');
    }
  };

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      // First check if user exists by trying to find them in auth.users table
      const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('id, email')
        .eq('email', newAdminEmail)
        .single();
      
      if (authError || !authUsers) {
        setError('User not found. They must sign up first before being added as admin.');
        return;
      }

      // Add to admin_users table
      const { error } = await supabase
        .from('admin_users')
        .insert([{
          id: authUsers.id,
          email: newAdminEmail,
          name: newAdminEmail.split('@')[0], // Use email prefix as default name
          role: 'admin',
        }]);

      if (error) {
        if (error.code === '23505') {
          setError('User is already an admin');
        } else {
          throw error;
        }
        return;
      }

      await loadAdmins();
      setNewAdminEmail('');
      setSuccess('Admin added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding admin:', error);
      setError('Failed to add admin user');
    } finally {
      setLoading(false);
    }
  };

  const removeAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to remove this admin?')) return;

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      await loadAdmins();
      setSuccess('Admin removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error removing admin:', error);
      setError('Failed to remove admin user');
    }
  };

  const testDatabaseConnection = async () => {
    setLoading(true);
    try {
      // Test database connection by fetching one record with count
      const { data, error, count } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .limit(1);

      if (error) throw error;

      setSuccess(`Database connection is working properly! Found ${count || 0} contacts in database.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Database test error:', error);
      setError('Database connection failed');
    } finally {
      setLoading(false);
    }
  };

  const exportAllData = async () => {
    setLoading(true);
    try {
      // Export all data as JSON
      const { data: contacts } = await supabase.from('contacts').select('*');
      const { data: newsletters } = await supabase.from('newsletter_subscribers').select('*');
      const { data: events } = await supabase.from('events').select('*');
      const { data: registrations } = await supabase.from('event_registrations').select('*');

      const exportData = {
        contacts: contacts || [],
        newsletters: newsletters || [],
        events: events || [],
        registrations: registrations || [],
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shatam_care_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);

      setSuccess('Data exported successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadAdmins();
    loadSettings();
  }, [loadAdmins, loadSettings]);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'admins', label: 'Admin Users', icon: User },
    { id: 'email', label: 'Email Settings', icon: Mail },
    { id: 'features', label: 'Features', icon: Bell },
    { id: 'database', label: 'Database', icon: Database },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    placeholder="Enter site name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <Input
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    placeholder="Enter site description"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <Input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      placeholder="contact@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <Input
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <Input
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <Input
                      value={settings.socialLinks.facebook}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                      })}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <Input
                      value={settings.socialLinks.twitter}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                      })}
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <Input
                      value={settings.socialLinks.linkedin}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <Input
                      value={settings.socialLinks.instagram}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                      })}
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'admins':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <Button
                    onClick={addAdmin}
                    disabled={loading}
                    className="bg-warm-teal hover:bg-warm-teal-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Admin
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  The user must have an account before being added as an admin.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Admins</CardTitle>
              </CardHeader>
              <CardContent>
                {admins.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No admin users found</p>
                ) : (
                  <div className="space-y-3">
                    {admins.map((admin) => (
                      <div key={admin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{admin.name || 'Unnamed Admin'}</p>
                          <p className="text-sm text-gray-600">{admin.email}</p>
                          <p className="text-xs text-gray-500">
                            Role: {admin.role} | Added: {new Date(admin.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeAdmin(admin.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'email':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Name
                </label>
                <Input
                  value={settings.emailSettings.fromName}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    emailSettings: { ...settings.emailSettings, fromName: e.target.value }
                  })}
                  placeholder="Your Organization Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Email
                </label>
                <Input
                  type="email"
                  value={settings.emailSettings.fromEmail}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    emailSettings: { ...settings.emailSettings, fromEmail: e.target.value }
                  })}
                  placeholder="noreply@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply To
                </label>
                <Input
                  type="email"
                  value={settings.emailSettings.replyTo}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    emailSettings: { ...settings.emailSettings, replyTo: e.target.value }
                  })}
                  placeholder="contact@example.com"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'features':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Feature Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Newsletter Signup</h4>
                    <p className="text-sm text-gray-600">Allow visitors to subscribe to newsletters</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.features.enableNewsletterSignup}
                      onChange={(e) => setSettings({
                        ...settings,
                        features: { ...settings.features, enableNewsletterSignup: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-warm-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-warm-teal"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Event Registration</h4>
                    <p className="text-sm text-gray-600">Allow visitors to register for events</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.features.enableEventRegistration}
                      onChange={(e) => setSettings({
                        ...settings,
                        features: { ...settings.features, enableEventRegistration: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-warm-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-warm-teal"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Contact Form</h4>
                    <p className="text-sm text-gray-600">Allow visitors to send contact messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.features.enableContactForm}
                      onChange={(e) => setSettings({
                        ...settings,
                        features: { ...settings.features, enableContactForm: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-warm-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-warm-teal"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Donations</h4>
                    <p className="text-sm text-gray-600">Enable donation functionality (coming soon)</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer opacity-50">
                    <input
                      type="checkbox"
                      checked={settings.features.enableDonations}
                      onChange={(e) => setSettings({
                        ...settings,
                        features: { ...settings.features, enableDonations: e.target.checked }
                      })}
                      className="sr-only peer"
                      disabled
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-warm-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-warm-teal"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'database':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={testDatabaseConnection}
                    disabled={loading}
                    variant="outline"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                  <Button
                    onClick={exportAllData}
                    disabled={loading}
                    className="bg-warm-teal hover:bg-warm-teal-600"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                </div>
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Database operations are irreversible. Always backup your data before making changes.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Connection Status</h4>
                    <p className="text-sm text-green-700">Connected to Supabase</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Security</h4>
                    <p className="text-sm text-blue-700">Row Level Security Enabled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your application settings and configuration</p>
        </div>
        <Button
          onClick={saveSettings}
          className="mt-4 sm:mt-0 bg-warm-teal hover:bg-warm-teal-600"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
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
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'general' | 'admins' | 'email' | 'features' | 'database')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-warm-teal text-warm-teal'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default SettingsPage;

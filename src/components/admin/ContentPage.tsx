import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  FileText,
  Plus,
  Edit3,
  Save,
  X,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Globe,
  Lock
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'page' | 'section' | 'component';
  page: string;
  section?: string;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

const ContentPage: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>('all');

  const [newContent, setNewContent] = useState({
    title: '',
    content: '',
    type: 'section' as 'page' | 'section' | 'component',
    page: 'home',
    section: '',
    status: 'draft' as 'published' | 'draft',
  });

  const pages = [
    'all',
    'home',
    'about',
    'programs',
    'impact',
    'contact',
    'privacy',
    'terms'
  ];

  const contentTypes = [
    { value: 'page', label: 'Full Page' },
    { value: 'section', label: 'Page Section' },
    { value: 'component', label: 'Component' },
  ];

  useEffect(() => {
    loadMockContent();
  }, []);

  const loadMockContent = () => {
    // Mock content data - in real app, this would come from database
    const mockContent: ContentItem[] = [
      {
        id: '1',
        title: 'Hero Section Title',
        content: 'Caring for Our Elderly with Compassion and Dignity',
        type: 'section',
        page: 'home',
        section: 'hero',
        status: 'published',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
      },
      {
        id: '2',
        title: 'Hero Section Subtitle',
        content: 'Shatam Care Foundation is dedicated to improving the quality of life for elderly individuals through comprehensive care, support services, and community engagement.',
        type: 'section',
        page: 'home',
        section: 'hero',
        status: 'published',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-10T00:00:00Z',
      },
      {
        id: '3',
        title: 'About Us Introduction',
        content: 'Our mission is to provide compassionate, dignified care and support services that enable elderly individuals to live fulfilling lives while maintaining their independence and connection to their communities.',
        type: 'section',
        page: 'about',
        section: 'introduction',
        status: 'published',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-12T00:00:00Z',
      },
      {
        id: '4',
        title: 'Programs Overview',
        content: 'We offer comprehensive programs including dementia care, caregiver training, memory cafes, and community support services designed to address the diverse needs of elderly individuals and their families.',
        type: 'section',
        page: 'programs',
        section: 'overview',
        status: 'published',
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-13T00:00:00Z',
      },
      {
        id: '5',
        title: 'Contact Information',
        content: 'Phone: +91 9158566665\nEmail: shatamcare@gmail.com\nAddress: Mumbai, Maharashtra, India',
        type: 'section',
        page: 'contact',
        section: 'info',
        status: 'published',
        created_at: '2024-01-04T00:00:00Z',
        updated_at: '2024-01-14T00:00:00Z',
      },
      {
        id: '6',
        title: 'Privacy Policy Content',
        content: 'This privacy policy explains how Shatam Care Foundation collects, uses, and protects your personal information when you interact with our services and website.',
        type: 'page',
        page: 'privacy',
        status: 'published',
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-16T00:00:00Z',
      },
      {
        id: '7',
        title: 'New Program Announcement',
        content: 'We are excited to announce our new Brain Health Training Program starting next month. This comprehensive program will focus on cognitive exercises and memory enhancement techniques.',
        type: 'section',
        page: 'home',
        section: 'announcements',
        status: 'draft',
        created_at: '2024-01-20T00:00:00Z',
        updated_at: '2024-01-20T00:00:00Z',
      },
    ];

    setContentItems(mockContent);
    setLoading(false);
  };

  const handleCreateContent = () => {
    if (!newContent.title || !newContent.content) {
      setError('Please fill in all required fields');
      return;
    }

    const contentItem: ContentItem = {
      id: Date.now().toString(),
      ...newContent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setContentItems([contentItem, ...contentItems]);
    setNewContent({
      title: '',
      content: '',
      type: 'section',
      page: 'home',
      section: '',
      status: 'draft',
    });
    setShowCreateForm(false);
    setSuccess('Content created successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleUpdateContent = () => {
    if (!editingItem) return;

    setContentItems(contentItems.map(item => 
      item.id === editingItem.id 
        ? { ...editingItem, updated_at: new Date().toISOString() }
        : item
    ));
    setEditingItem(null);
    setSuccess('Content updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteContent = (itemId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    setContentItems(contentItems.filter(item => item.id !== itemId));
    setSuccess('Content deleted successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const toggleContentStatus = (itemId: string) => {
    setContentItems(contentItems.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            status: item.status === 'published' ? 'draft' : 'published',
            updated_at: new Date().toISOString()
          }
        : item
    ));
    setSuccess('Content status updated!');
    setTimeout(() => setSuccess(''), 3000);
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

  const filteredContent = contentItems.filter(item => 
    selectedPage === 'all' || item.page === selectedPage
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage website content, pages, and components</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="outline"
            onClick={loadMockContent}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-warm-teal hover:bg-warm-teal-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Content
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

      {/* Create Content Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Create New Content
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Title *
                </label>
                <Input
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  placeholder="Enter content title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type *
                </label>
                <select
                  value={newContent.type}
                  onChange={(e) => setNewContent({ ...newContent, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  {contentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page *
                </label>
                <select
                  value={newContent.page}
                  onChange={(e) => setNewContent({ ...newContent, page: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  {pages.filter(page => page !== 'all').map(page => (
                    <option key={page} value={page}>{page.charAt(0).toUpperCase() + page.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <Input
                  value={newContent.section}
                  onChange={(e) => setNewContent({ ...newContent, section: e.target.value })}
                  placeholder="Enter section name (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={newContent.status}
                  onChange={(e) => setNewContent({ ...newContent, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <Textarea
                  value={newContent.content}
                  onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                  placeholder="Enter content text"
                  rows={6}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateContent}
                className="bg-warm-teal hover:bg-warm-teal-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Filter by page:</label>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
        >
          {pages.map(page => (
            <option key={page} value={page}>
              {page === 'all' ? 'All Pages' : page.charAt(0).toUpperCase() + page.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-warm-teal mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Content</p>
                <p className="text-2xl font-bold text-gray-900">{contentItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contentItems.filter(item => item.status === 'published').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Lock className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contentItems.filter(item => item.status === 'draft').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(contentItems.map(item => item.page)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-600 mb-4">
                {selectedPage === 'all' 
                  ? 'Create your first piece of content to get started'
                  : `No content found for the ${selectedPage} page`
                }
              </p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-warm-teal hover:bg-warm-teal-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredContent.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                {editingItem?.id === item.id ? (
                  <div className="space-y-4">
                    <Input
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="Content title"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={editingItem.type}
                        onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as any })}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                      >
                        {contentTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      <select
                        value={editingItem.page}
                        onChange={(e) => setEditingItem({ ...editingItem, page: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                      >
                        {pages.filter(page => page !== 'all').map(page => (
                          <option key={page} value={page}>{page.charAt(0).toUpperCase() + page.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <Input
                      value={editingItem.section || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, section: e.target.value })}
                      placeholder="Section name (optional)"
                    />
                    <Textarea
                      value={editingItem.content}
                      onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                      placeholder="Content text"
                      rows={6}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem(null)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleUpdateContent}
                        className="bg-warm-teal hover:bg-warm-teal-600"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                          <Badge
                            variant={item.status === 'published' ? 'default' : 'secondary'}
                            className={item.status === 'published' ? 'bg-green-500 hover:bg-green-600' : ''}
                          >
                            {item.status === 'published' ? (
                              <>
                                <Globe className="h-3 w-3 mr-1" />
                                Published
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3 mr-1" />
                                Draft
                              </>
                            )}
                          </Badge>
                          <Badge variant="outline">{item.type}</Badge>
                          <Badge variant="outline">{item.page}</Badge>
                          {item.section && <Badge variant="outline">{item.section}</Badge>}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          Created: {formatDate(item.created_at)} | 
                          Updated: {formatDate(item.updated_at)}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-800 leading-relaxed">
                        {item.content.length > 300 
                          ? `${item.content.substring(0, 300)}...`
                          : item.content
                        }
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleContentStatus(item.id)}
                      >
                        {item.status === 'published' ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Publish
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteContent(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentPage;

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
import {
  getContentItems,
  createContentItem,
  updateContentItem,
  deleteContentItem,
  logAdminActivity,
  type ContentItem
} from '../../lib/supabase-secure';

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
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await getContentItems();
      setContentItems(data);
    } catch (error) {
      console.error('Error loading content:', error);
      setError('Failed to load content items');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContent = async () => {
    if (!newContent.title || !newContent.content) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const contentData = {
        title: newContent.title,
        content: newContent.content,
        type: newContent.type,
        page: newContent.page,
        section: newContent.section || undefined,
        status: newContent.status,
        meta_description: '',
        meta_keywords: ''
      };

      await createContentItem(contentData);
      await logAdminActivity(
        'create_content',
        'content_item',
        null,
        { title: newContent.title, page: newContent.page }
      );

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
      await loadContent(); // Reload content list
    } catch (error) {
      console.error('Error creating content:', error);
      setError('Failed to create content');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContent = async () => {
    if (!editingItem) return;

    try {
      setLoading(true);
      await updateContentItem(editingItem.id, {
        title: editingItem.title,
        content: editingItem.content,
        type: editingItem.type,
        page: editingItem.page,
        section: editingItem.section || undefined,
        status: editingItem.status,
        meta_description: editingItem.meta_description || '',
        meta_keywords: editingItem.meta_keywords || ''
      });
      await logAdminActivity(
        'update_content',
        'content_item',
        editingItem.id,
        { title: editingItem.title }
      );

      setEditingItem(null);
      setSuccess('Content updated successfully!');
      await loadContent(); // Reload content list
    } catch (error) {
      console.error('Error updating content:', error);
      setError('Failed to update content');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      setLoading(true);
      await deleteContentItem(itemId);
      await logAdminActivity(
        'delete_content',
        'content_item',
        itemId,
        { action: 'deleted content item' }
      );

      setSuccess('Content deleted successfully!');
      await loadContent(); // Reload content list
    } catch (error) {
      console.error('Error deleting content:', error);
      setError('Failed to delete content');
    } finally {
      setLoading(false);
    }
  };

  const toggleContentStatus = async (itemId: string) => {
    const item = contentItems.find(item => item.id === itemId);
    if (!item) return;

    try {
      const newStatus = item.status === 'published' ? 'draft' : 'published';
      await updateContentItem(itemId, {
        ...item,
        status: newStatus
      });
      await logAdminActivity(
        'toggle_content_status',
        'content_item',
        itemId,
        { newStatus }
      );

      await loadContent(); // Reload content list
    } catch (error) {
      console.error('Error toggling content status:', error);
      setError('Failed to update content status');
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

  // For now, just show the coming soon banner
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage website content, pages, and components</p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-warm-teal to-sage-600 text-white p-6 rounded-lg border-l-4 border-sunrise-orange">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Dynamic Content Management - Coming Soon!</h3>
            <p className="text-white/90 mt-1">
              We're working on connecting the content management system to the website pages. 
              Currently, the website pages use hardcoded content. This feature will allow you to:
            </p>
            <ul className="mt-3 text-white/90 space-y-1">
              <li>• Edit homepage content dynamically</li>
              <li>• Update "About Us" and other page sections</li>
              <li>• Manage content without code changes</li>
              <li>• Real-time content updates</li>
            </ul>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="bg-sunrise-orange text-white px-3 py-1 rounded-full">
                In Development
              </div>
              <span className="text-white/80">Expected: Next Update</span>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for future implementation */}
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Content Management Interface</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            The dynamic content management system will be available here once the integration 
            with website pages is complete. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
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
            onClick={loadContent}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-warm-teal to-sage-600 text-white p-6 rounded-lg border-l-4 border-sunrise-orange">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Dynamic Content Management - Coming Soon!</h3>
            <p className="text-white/90 mt-1">
              We're working on connecting the content management system to the website pages. 
              Currently, the website pages use hardcoded content. This feature will allow you to:
            </p>
            <ul className="mt-3 text-white/90 space-y-1">
              <li>• Edit homepage content dynamically</li>
              <li>• Update "About Us" and other page sections</li>
              <li>• Manage content without code changes</li>
              <li>• Real-time content updates</li>
            </ul>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="bg-sunrise-orange text-white px-3 py-1 rounded-full">
                In Development
              </div>
              <span className="text-white/80">Expected: Next Update</span>
            </div>
          </div>
        </div>
      </div>

      {/* Development Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-amber-100 p-2 rounded-full">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800">Development Notice</h3>
            <p className="text-sm text-amber-700 mt-1">
              The content management interface below is currently for development and testing purposes only. 
              Website pages are still using hardcoded content and are not yet connected to this system.
            </p>
          </div>
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

      <div className="flex space-x-3">
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-warm-teal hover:bg-warm-teal-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </div>

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
                  onChange={(e) => setNewContent({ ...newContent, type: e.target.value as 'page' | 'section' | 'component' })}
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
                  onChange={(e) => setNewContent({ ...newContent, status: e.target.value as 'published' | 'draft' })}
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
                        onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as 'page' | 'section' | 'component' })}
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

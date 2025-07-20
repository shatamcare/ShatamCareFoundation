import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase-secure';
import { 
  ImageIcon,
  Upload,
  Trash2,
  Download,
  Search,
  Filter,
  Grid,
  List,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Eye,
  Copy,
  X,
  Plus
} from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'other';
  size: number;
  uploaded_at: string;
  category?: string;
}

const MediaPage: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock categories - in real app, these would come from database or config
  const categories = [
    'all',
    'Brain Kit',
    'Caregivers', 
    'Media',
    'Team',
    'Users',
    'Events',
    'Documents'
  ];

  useEffect(() => {
    loadExistingImages();
  }, []);

  const loadExistingImages = () => {
    // Load existing images from public/images directory
    const existingImages: MediaFile[] = [
      // Brain Kit images
      { id: '1', name: 'brain_bridge_boxcontent-1024x1024.jpeg', url: '/images/Brain Kit/brain_bridge_boxcontent-1024x1024.jpeg', type: 'image', size: 245760, uploaded_at: '2024-01-01T00:00:00Z', category: 'Brain Kit' },
      { id: '2', name: 'EHA4.jpg', url: '/images/Brain Kit/EHA4.jpg', type: 'image', size: 123456, uploaded_at: '2024-01-02T00:00:00Z', category: 'Brain Kit' },
      { id: '3', name: 'kit.jpg', url: '/images/Brain Kit/kit.jpg', type: 'image', size: 156789, uploaded_at: '2024-01-03T00:00:00Z', category: 'Brain Kit' },
      { id: '4', name: 'tool kit.jpg', url: '/images/Brain Kit/tool kit.jpg', type: 'image', size: 178923, uploaded_at: '2024-01-04T00:00:00Z', category: 'Brain Kit' },
      
      // Caregivers images
      { id: '5', name: 'career discussion.jpg', url: '/images/Caregivers/career discussion.jpg', type: 'image', size: 203456, uploaded_at: '2024-01-05T00:00:00Z', category: 'Caregivers' },
      { id: '6', name: 'hospital.jpg', url: '/images/Caregivers/hospital.jpg', type: 'image', size: 187234, uploaded_at: '2024-01-06T00:00:00Z', category: 'Caregivers' },
      { id: '7', name: 'sessions.jpg', url: '/images/Caregivers/sessions.jpg', type: 'image', size: 198765, uploaded_at: '2024-01-07T00:00:00Z', category: 'Caregivers' },
      { id: '8', name: 'training.jpg', url: '/images/Caregivers/training.jpg', type: 'image', size: 167890, uploaded_at: '2024-01-08T00:00:00Z', category: 'Caregivers' },
      { id: '9', name: 'trainng 2.jpg', url: '/images/Caregivers/trainng 2.jpg', type: 'image', size: 189234, uploaded_at: '2024-01-09T00:00:00Z', category: 'Caregivers' },
      { id: '10', name: 'Vaishali.jpg', url: '/images/Caregivers/Vaishali.jpg', type: 'image', size: 145678, uploaded_at: '2024-01-10T00:00:00Z', category: 'Caregivers' },
      
      // Media images
      { id: '11', name: 'EHA9.jpg', url: '/images/Media/EHA9.jpg', type: 'image', size: 234567, uploaded_at: '2024-01-11T00:00:00Z', category: 'Media' },
      { id: '12', name: 'News.jpg', url: '/images/Media/News.jpg', type: 'image', size: 212345, uploaded_at: '2024-01-12T00:00:00Z', category: 'Media' },
      { id: '13', name: 'News2.jpg', url: '/images/Media/News2.jpg', type: 'image', size: 198765, uploaded_at: '2024-01-13T00:00:00Z', category: 'Media' },
      { id: '14', name: 'tweet.jpg', url: '/images/Media/tweet.jpg', type: 'image', size: 156789, uploaded_at: '2024-01-14T00:00:00Z', category: 'Media' },
      
      // Team images
      { id: '15', name: 'Amrita.jpg', url: '/images/Team/Amrita.jpg', type: 'image', size: 187234, uploaded_at: '2024-01-15T00:00:00Z', category: 'Team' },
      { id: '16', name: 'SC_LOGO-removebg-preview.png', url: '/images/Team/SC_LOGO-removebg-preview.png', type: 'image', size: 89123, uploaded_at: '2024-01-16T00:00:00Z', category: 'Team' },
      
      // Users images
      { id: '17', name: 'activities 1.jpg', url: '/images/Users/activities 1.jpg', type: 'image', size: 234567, uploaded_at: '2024-01-17T00:00:00Z', category: 'Users' },
      { id: '18', name: 'activities 2.jpg', url: '/images/Users/activities 2.jpg', type: 'image', size: 223456, uploaded_at: '2024-01-18T00:00:00Z', category: 'Users' },
      { id: '19', name: 'activities.jpg', url: '/images/Users/activities.jpg', type: 'image', size: 245678, uploaded_at: '2024-01-19T00:00:00Z', category: 'Users' },
      { id: '20', name: 'art 1.jpg', url: '/images/Users/art 1.jpg', type: 'image', size: 198765, uploaded_at: '2024-01-20T00:00:00Z', category: 'Users' },
      { id: '21', name: 'art.jpg', url: '/images/Users/art.jpg', type: 'image', size: 187234, uploaded_at: '2024-01-21T00:00:00Z', category: 'Users' },
      { id: '22', name: 'care.jpg', url: '/images/Users/care.jpg', type: 'image', size: 156789, uploaded_at: '2024-01-22T00:00:00Z', category: 'Users' },
      { id: '23', name: 'dementia care 1.jpg', url: '/images/Users/dementia care 1.jpg', type: 'image', size: 212345, uploaded_at: '2024-01-23T00:00:00Z', category: 'Users' },
      { id: '24', name: 'Dementia.jpg', url: '/images/Users/Dementia.jpg', type: 'image', size: 234567, uploaded_at: '2024-01-24T00:00:00Z', category: 'Users' },
      { id: '25', name: 'EHA (1).jpg', url: '/images/Users/EHA (1).jpg', type: 'image', size: 189234, uploaded_at: '2024-01-25T00:00:00Z', category: 'Users' },
      { id: '26', name: 'EHA (2).jpg', url: '/images/Users/EHA (2).jpg', type: 'image', size: 198765, uploaded_at: '2024-01-26T00:00:00Z', category: 'Users' },
      { id: '27', name: 'EHA.jpg', url: '/images/Users/EHA.jpg', type: 'image', size: 176543, uploaded_at: '2024-01-27T00:00:00Z', category: 'Users' },
      { id: '28', name: 'eha3.jpg', url: '/images/Users/eha3.jpg', type: 'image', size: 165432, uploaded_at: '2024-01-28T00:00:00Z', category: 'Users' },
      { id: '29', name: 'EHA7.jpg', url: '/images/Users/EHA7.jpg', type: 'image', size: 187654, uploaded_at: '2024-01-29T00:00:00Z', category: 'Users' },
      { id: '30', name: 'EHA8.jpg', url: '/images/Users/EHA8.jpg', type: 'image', size: 198765, uploaded_at: '2024-01-30T00:00:00Z', category: 'Users' },
      { id: '31', name: 'memory cafe.jpeg', url: '/images/Users/memory cafe.jpeg', type: 'image', size: 234567, uploaded_at: '2024-01-31T00:00:00Z', category: 'Users' },
      
      // Logo files
      { id: '32', name: 'shatam-care-foundation-logo.png', url: '/images/shatam-care-foundation-logo.png', type: 'image', size: 123456, uploaded_at: '2024-02-01T00:00:00Z', category: 'Team' },
      { id: '33', name: 'placeholder.jpg', url: '/images/placeholder.jpg', type: 'image', size: 45678, uploaded_at: '2024-02-02T00:00:00Z', category: 'Team' },
      { id: '34', name: 'fallback.svg', url: '/images/fallback.svg', type: 'image', size: 12345, uploaded_at: '2024-02-03T00:00:00Z', category: 'Team' },
    ];
    
    setMediaFiles(existingImages);
    setLoading(false);
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError('');
    
    try {
      // Note: This is a mock implementation
      // In a real application, you would upload to Supabase Storage or another service
      
      for (const file of Array.from(files)) {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a mock URL (in real app, this would be the actual upload URL)
        const mockUrl = URL.createObjectURL(file);
        
        const newFile: MediaFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: mockUrl,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          size: file.size,
          uploaded_at: new Date().toISOString(),
          category: selectedCategory === 'all' ? 'Documents' : selectedCategory,
        };
        
        setMediaFiles(prev => [newFile, ...prev]);
      }
      
      setSuccess(`Successfully uploaded ${files.length} file(s)`);
      setTimeout(() => setSuccess(''), 3000);
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      // In real app, you would delete from storage service
      setMediaFiles(prev => prev.filter(file => file.id !== fileId));
      setSuccess('File deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete file');
    }
  };

  const copyFileUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setSuccess('File URL copied to clipboard');
    setTimeout(() => setSuccess(''), 3000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {filteredFiles.map((file) => (
        <Card key={file.id} className="group hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="aspect-square bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
              {file.type === 'image' ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/fallback.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedFile(file)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyFileUrl(file.url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => deleteFile(file.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-900 truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              {file.category && (
                <Badge variant="outline" className="text-xs">{file.category}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {filteredFiles.map((file) => (
        <Card key={file.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/fallback.svg';
                      }}
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatDate(file.uploaded_at)}</span>
                    {file.category && <Badge variant="outline">{file.category}</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFile(file)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyFileUrl(file.url)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteFile(file.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">Manage your images, documents, and media files</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-warm-teal hover:bg-warm-teal-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Files
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-warm-teal mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{mediaFiles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Images</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mediaFiles.filter(f => f.type === 'image').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mediaFiles.filter(f => f.type === 'document').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatFileSize(mediaFiles.reduce((total, file) => total + file.size, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Files */}
      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-600 mb-4">Upload some files to get started</p>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-warm-teal hover:bg-warm-teal-600"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </CardContent>
        </Card>
      ) : (
        viewMode === 'grid' ? renderGridView() : renderListView()
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Upload Files
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory === 'all' ? 'Documents' : selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                  >
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drop files here or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-warm-teal hover:text-warm-teal-600"
                  >
                    Browse files
                  </label>
                </div>
                {uploading && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-warm-teal mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Uploading...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* File Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">{selectedFile.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              {selectedFile.type === 'image' ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="max-w-full max-h-96 mx-auto"
                />
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Preview not available for this file type</p>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div>
                  <span>Size: {formatFileSize(selectedFile.size)}</span>
                  <span className="ml-4">Uploaded: {formatDate(selectedFile.uploaded_at)}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyFileUrl(selectedFile.url)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy URL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = selectedFile.url;
                      a.download = selectedFile.name;
                      a.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;

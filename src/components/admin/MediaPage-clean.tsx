import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import {
  getMediaFiles,
  uploadMediaFile,
  deleteMediaFile,
  logAdminActivity,
  type MediaFile
} from '../../lib/supabase-secure';
import { getImagePath } from '../../utils/imagePaths';

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

  // Categories for media organization
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
    loadMediaFiles();
  }, []);

  const loadMediaFiles = async () => {
    try {
      setLoading(true);
      const data = await getMediaFiles();
      setMediaFiles(data);
    } catch (error) {
      console.error('Error loading media files:', error);
      setError('Failed to load media files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError('');
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await uploadMediaFile(file);
        await logAdminActivity(
          'upload_media',
          'media_file',
          null,
          { fileName: file.name, fileSize: file.size }
        );
      }
      
      setSuccess(`Successfully uploaded ${files.length} file(s)!`);
      await loadMediaFiles(); // Reload media files
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const fileToDelete = mediaFiles.find(f => f.id === fileId);
      await deleteMediaFile(fileId);
      await logAdminActivity(
        'delete_media',
        'media_file',
        fileId,
        { fileName: fileToDelete?.name }
      );
      
      setSuccess('File deleted successfully');
      await loadMediaFiles(); // Reload media files
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete file');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setSuccess('URL copied to clipboard');
    setTimeout(() => setSuccess(''), 2000);
  };

  const downloadFile = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter files based on search and category
  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <p className="text-gray-600">Manage your images, documents, and other media files.</p>
      </div>

      {/* Messages */}
      {(error || success) && (
        <Alert className={`mb-6 ${error ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {error ? <AlertCircle className="w-4 h-4 text-red-600" /> : <CheckCircle className="w-4 h-4 text-green-600" />}
              <AlertDescription className={error ? 'text-red-700' : 'text-green-700'}>
                {error || success}
              </AlertDescription>
            </div>
            <button 
              onClick={clearMessages}
              className="text-sm underline opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        </Alert>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-100 rounded-md p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <Button
                onClick={loadMediaFiles}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <Button
                onClick={() => setShowUploadModal(true)}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>
          </div>
        </div>

        {/* File Stats */}
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Files:</span>
              <span className="ml-2 font-medium">{mediaFiles.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Filtered:</span>
              <span className="ml-2 font-medium">{filteredFiles.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Images:</span>
              <span className="ml-2 font-medium">{mediaFiles.filter(f => f.type === 'image').length}</span>
            </div>
            <div>
              <span className="text-gray-500">Documents:</span>
              <span className="ml-2 font-medium">{mediaFiles.filter(f => f.type === 'document').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading media files...</span>
        </div>
      )}

      {/* File Grid/List */}
      {!loading && filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Upload some files to get started.'}
          </p>
          <Button onClick={() => setShowUploadModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      )}

      {!loading && filteredFiles.length > 0 && (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
          : 'space-y-2'
        }>
          {filteredFiles.map((file) => (
            <div key={file.id} className={viewMode === 'grid' ? 'group' : ''}>
              {viewMode === 'grid' ? (
                // Grid View
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getImagePath('images/fallback.svg');
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm truncate" title={file.name}>
                        {file.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {file.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedFile(file)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(file.url)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadFile(file.url, file.name)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="p-1 hover:bg-red-200 rounded text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // List View
                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getImagePath('images/fallback.svg');
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{file.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <Badge variant="secondary" className="text-xs">
                          {file.type}
                        </Badge>
                        <span>{formatFileSize(file.size)}</span>
                        <span>{formatDate(file.uploaded_at)}</span>
                        {file.category && (
                          <span className="text-blue-600">{file.category}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedFile(file)}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(file.url)}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadFile(file.url, file.name)}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteFile(file.id)}
                        className="p-2 hover:bg-red-100 rounded text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Upload Files</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf,.doc,.docx"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
                >
                  Choose Files
                </label>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>Supported formats: Images (JPG, PNG, GIF), Documents (PDF, DOC, DOCX)</p>
                <p>Maximum file size: 10MB per file</p>
              </div>
              
              {uploading && (
                <div className="mt-4 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600 mr-2" />
                  <span className="text-blue-600">Uploading files...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* File Details Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">File Details</h2>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedFile.type === 'image' && (
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedFile.url}
                      alt={selectedFile.name}
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-700">Name:</label>
                    <p className="mt-1">{selectedFile.name}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Type:</label>
                    <p className="mt-1 capitalize">{selectedFile.type}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Size:</label>
                    <p className="mt-1">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Uploaded:</label>
                    <p className="mt-1">{formatDate(selectedFile.uploaded_at)}</p>
                  </div>
                  {selectedFile.category && (
                    <div>
                      <label className="font-medium text-gray-700">Category:</label>
                      <p className="mt-1">{selectedFile.category}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="font-medium text-gray-700">URL:</label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={selectedFile.url}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border rounded-md text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedFile.url)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={() => downloadFile(selectedFile.url, selectedFile.name)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => {
                      deleteFile(selectedFile.id);
                      setSelectedFile(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
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

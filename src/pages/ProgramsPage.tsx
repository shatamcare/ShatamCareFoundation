import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  getAllPrograms, 
  createProgram, 
  updateProgram, 
  deleteProgram, 
  Program 
} from '@/lib/supabase-secure';
import { getImagePath } from '@/utils/imagePaths';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Heart, 
  Users, 
  BookOpen, 
  Home,
  Award,
  Shield,
  MessageCircle,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  CheckCircle
} from 'lucide-react';

// Optimized icon mapping - only includes commonly used icons
const ICON_MAP = {
  Heart,
  Users,
  BookOpen,
  Home,
  Award,
  Shield,
  MessageCircle,
  Calendar,
  Phone,
  Mail,
  MapPin
} as const;

const ICON_OPTIONS = Object.keys(ICON_MAP) as Array<keyof typeof ICON_MAP>;

interface ProgramsPageProps {
  className?: string;
}

const ProgramsPage: React.FC<ProgramsPageProps> = ({ className = '' }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState<string | null>(null); // Track which operation is loading
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    details: '',
    image_url: '',
    icon: 'Heart',
    cta_text: 'Get Involved',
    impact_text: '',
    display_order: 0,
    is_active: true
  });

  // Memoized available images to prevent recreation on every render
  const availableImages = useMemo(() => [
    // Caregivers images
    'images/Caregivers/training.jpg',
    'images/Caregivers/sessions.jpg',
    'images/Caregivers/career discussion.jpg',
    'images/Caregivers/hospital.jpg',
    'images/Caregivers/trainng 2.jpg',
    'images/Caregivers/Vaishali.jpg',
    
    // Brain Kit images
    'images/Brain Kit/brain_bridge_boxcontent-1024x1024.jpeg',
    'images/Brain Kit/EHA4.jpg',
    'images/Brain Kit/kit.jpg',
    'images/Brain Kit/tool kit.jpg',
    
    // Users images
    'images/Users/care.jpg',
    'images/Users/activities 1.jpg',
    'images/Users/activities 2.jpg',
    'images/Users/activities.jpg',
    'images/Users/art 1.jpg',
    'images/Users/art.jpg',
    'images/Users/dementia care 1.jpg',
    'images/Users/Dementia.jpg',
    'images/Users/EHA.jpg',
    'images/Users/EHA (1).jpg',
    'images/Users/EHA (2).jpg',
    'images/Users/EHA7.jpg',
    'images/Users/EHA8.jpg',
    'images/Users/eha3.jpg',
    'images/Users/memory cafe.jpeg',
    
    // Media images
    'images/Media/EHA9.jpg',
    'images/Media/News.jpg',
    'images/Media/News2.jpg',
    'images/Media/tweet.jpg'
  ], []);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await getAllPrograms();
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError('Failed to load programs. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      details: '',
      image_url: '',
      icon: 'Heart',
      cta_text: 'Get Involved',
      impact_text: '',
      display_order: programs.length + 1,
      is_active: true
    });
    setIsCreating(false);
    setEditingProgram(null);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingProgram(null);
    setFormData({
      title: '',
      description: '',
      details: '',
      image_url: '',
      icon: 'Heart',
      cta_text: 'Get Involved',
      impact_text: '',
      display_order: programs.length + 1,
      is_active: true
    });
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setIsCreating(false);
    setFormData({
      title: program.title,
      description: program.description,
      details: program.details,
      image_url: program.image_url || '',
      icon: program.icon,
      cta_text: program.cta_text,
      impact_text: program.impact_text,
      display_order: program.display_order,
      is_active: program.is_active
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProgram) {
        await updateProgram(editingProgram.id, formData);
        setError('');
        alert('Program updated successfully!');
      } else {
        await createProgram(formData);
        setError('');
        alert('Program created successfully!');
      }
      
      resetForm();
      fetchPrograms();
    } catch (error) {
      setError(`Failed to ${editingProgram ? 'update' : 'create'} program: ${error}`);
    }
  };

  const handleDelete = async (programId: string, programTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${programTitle}"? This action cannot be undone.`)) {
      try {
        setOperationLoading(programId); // Show loading for this specific program
        
        // Optimistic update - remove from UI immediately
        setPrograms(prevPrograms => prevPrograms.filter(p => p.id !== programId));
        setError('');
        
        console.log('Deleting program:', { programId, programTitle });
        const result = await deleteProgram(programId);
        console.log('Delete result:', result);
        
        // Show success message
        alert('Program deleted successfully!');
        
        // Refresh from database to ensure consistency (but UI already updated)
        await fetchPrograms();
        
      } catch (error) {
        console.error('Delete error:', error);
        // If deletion failed, restore the item in UI
        await fetchPrograms();
        setError(`Failed to delete program: ${error}`);
        alert(`Failed to delete program: ${error}`);
      } finally {
        setOperationLoading(null); // Clear loading state
      }
    }
  };

  const toggleProgramStatus = async (program: Program) => {
    try {
      setOperationLoading(`toggle-${program.id}`); // Show loading for this specific operation
      
      // Optimistic update - change UI immediately
      setPrograms(prevPrograms => 
        prevPrograms.map(p => 
          p.id === program.id ? { ...p, is_active: !p.is_active } : p
        )
      );
      setError('');
      
      console.log('Toggling program status:', { programId: program.id, currentStatus: program.is_active });
      const result = await updateProgram(program.id, { is_active: !program.is_active });
      console.log('Toggle result:', result);
      
      // Refresh from database to ensure consistency (but UI already updated)
      await fetchPrograms();
      
    } catch (error) {
      console.error('Toggle status error:', error);
      // If update failed, revert the optimistic update
      await fetchPrograms();
      setError(`Failed to update program status: ${error}`);
      alert(`Failed to update program status: ${error}`);
    } finally {
      setOperationLoading(null); // Clear loading state
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

  const getIconComponent = useCallback((iconName: string) => {
    const IconComponent = ICON_MAP[iconName as keyof typeof ICON_MAP] || Heart;
    return IconComponent;
  }, []);

  return (
    <div className={`py-16 bg-gray-50 min-h-screen ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-charcoal">Programs Management</h1>
            <p className="text-gray-600">Manage your foundation's programs and services</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={fetchPrograms} disabled={loading} className="bg-gray-600 hover:bg-gray-700">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleCreate} className="bg-warm-teal hover:bg-warm-teal/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Program
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Program Form */}
        {(isCreating || editingProgram) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{editingProgram ? 'Edit Program' : 'Create New Program'}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-teal"
                      placeholder="e.g., Caregiver Training Workshops"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-teal"
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Call-to-Action Text
                    </label>
                    <input
                      type="text"
                      value={formData.cta_text}
                      onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-teal"
                      placeholder="e.g., Join Training"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Impact Text
                    </label>
                    <input
                      type="text"
                      value={formData.impact_text}
                      onChange={(e) => setFormData({ ...formData, impact_text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-teal"
                      placeholder="e.g., 1,200+ caregivers trained"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.is_active ? 'active' : 'inactive'}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-teal"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-teal"
                    placeholder="Brief description shown in the program card..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    required
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-teal"
                    placeholder="Detailed description shown when program is expanded..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Image
                  </label>
                  <div className="border border-gray-300 rounded-md p-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                      {/* Empty state option */}
                      <div
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className={`relative cursor-pointer border-2 rounded-lg p-2 transition-all ${
                          formData.image_url === '' 
                            ? 'border-warm-teal bg-warm-teal/10' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="aspect-square flex items-center justify-center bg-gray-100 rounded">
                          <X className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-xs text-center mt-1 truncate">No Image</p>
                      </div>
                      
                      {/* Image options */}
                      {availableImages.map((image) => (
                        <div
                          key={image}
                          onClick={() => setFormData({ ...formData, image_url: image })}
                          className={`relative cursor-pointer border-2 rounded-lg p-2 transition-all ${
                            formData.image_url === image 
                              ? 'border-warm-teal bg-warm-teal/10' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="aspect-square overflow-hidden rounded">
                            <img 
                              src={getImagePath(image)} 
                              alt={image.split('/').pop()?.replace(/\.(jpg|jpeg|png)$/i, '')}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.warn(`Failed to load image: ${image}`);
                                e.currentTarget.src = getImagePath('images/placeholder.jpg');
                              }}
                            />
                          </div>
                          <p className="text-xs text-center mt-1 truncate">
                            {image.split('/').pop()?.replace(/\.(jpg|jpeg|png)$/i, '')}
                          </p>
                          {formData.image_url === image && (
                            <div className="absolute top-1 right-1 bg-warm-teal text-white rounded-full p-1">
                              <CheckCircle className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {formData.image_url && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600 mb-2">Selected Image Preview:</p>
                      <img 
                        src={getImagePath(formData.image_url)} 
                        alt="Selected preview" 
                        className="w-40 h-30 object-cover rounded-md border"
                        onError={(e) => {
                          console.warn(`Failed to load preview image: ${formData.image_url}`);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-warm-teal hover:bg-warm-teal/90">
                    <Save className="h-4 w-4 mr-2" />
                    {editingProgram ? 'Update Program' : 'Create Program'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Programs List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-teal mx-auto mb-4"></div>
              <p className="text-gray-600">Loading programs...</p>
            </div>
          ) : programs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Programs Yet</h3>
                <p className="text-gray-500 mb-6">Get started by creating your first program.</p>
                <Button onClick={handleCreate} className="bg-warm-teal hover:bg-warm-teal/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Program
                </Button>
              </CardContent>
            </Card>
          ) : (
            programs.map((program) => {
              const IconComponent = getIconComponent(program.icon);
              const isExpanded = expandedProgram === program.id;
              
              return (
                <Card key={program.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-3 rounded-full ${program.is_active ? 'bg-warm-teal' : 'bg-gray-400'}`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-dark-charcoal">
                              {program.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              program.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {program.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              Order: {program.display_order}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-3 leading-relaxed">
                            {program.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Award className="h-4 w-4 mr-1 text-sunrise-orange" />
                              {program.impact_text}
                            </span>
                            <span>•</span>
                            <span>CTA: "{program.cta_text}"</span>
                          </div>
                          
                          {program.image_url && (
                            <div className="mt-3">
                              <img 
                                src={getImagePath(program.image_url)} 
                                alt={program.title}
                                className="w-24 h-16 object-cover rounded-md border"
                                onError={(e) => {
                                  console.warn(`Failed to load image: ${program.image_url}`);
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          
                          {isExpanded && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-medium text-dark-charcoal mb-2">Detailed Description:</h4>
                              <p className="text-gray-700 text-sm leading-relaxed">{program.details}</p>
                              <div className="mt-3 text-xs text-gray-500">
                                <p>Created: {formatDate(program.created_at || '')}</p>
                                {program.updated_at && program.updated_at !== program.created_at && (
                                  <p>Updated: {formatDate(program.updated_at)}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedProgram(isExpanded ? null : program.id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleProgramStatus(program)}
                          disabled={operationLoading === `toggle-${program.id}`}
                          className={`${program.is_active ? 'text-gray-600 hover:text-gray-800' : 'text-green-600 hover:text-green-800'}`}
                        >
                          {operationLoading === `toggle-${program.id}` ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            program.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(program)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(program.id, program.title)}
                          disabled={operationLoading === program.id}
                          className="text-red-600 hover:text-red-800"
                        >
                          {operationLoading === program.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;

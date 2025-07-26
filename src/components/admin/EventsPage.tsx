import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase-secure';
import { getImagePath } from '@/utils/imagePaths';
import { fixImageUrl } from '@/utils/imageUrlFixer';
import { resolveImageUrl, getImageWithFallback, standardizeImagePath } from '@/utils/imageUrlResolver';
import { getAllAvailableImages, type ImageFile } from '@/utils/dynamicImageLoader';
import { SafeImage } from '@/utils/robust-image-handler';
import { toast } from '@/hooks/use-toast';
import ImageSelector from './ImageSelector';
import { 
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  ImageIcon,
  Eye,
  RefreshCw,
  Users
} from 'lucide-react';
import { listMediaFiles } from '../../utils/storage-alternative';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  spots_available: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'other';
  size: number;
  uploaded_at: string;
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
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 25,
    image_url: '',
  });

  // Image selection states
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [availableImages, setAvailableImages] = useState<MediaFile[]>([]);
  const [isSelectingImageForEdit, setIsSelectingImageForEdit] = useState(false);

  const loadLocalImages = () => {
    // Fallback function to load local images
    const dynamicImages = getAllAvailableImages();
    
    // Convert to MediaFile format for compatibility
    const mediaFiles: MediaFile[] = dynamicImages.map((img, index) => ({
      id: img.id,
      name: img.name,
      url: img.url,
      type: 'image' as const,
      size: 200000, // Default size since we don't track actual file sizes for static images
      uploaded_at: new Date().toISOString()
    }));
    
    setAvailableImages(mediaFiles);
  };

  const loadAvailableImages = useCallback(async () => {
    try {
      // Load images from Supabase Storage instead of local files
      const result = await listMediaFiles();
      
      if (result.success && result.files) {
        // Convert StorageFile[] to MediaFile[] format
        const mediaFiles: MediaFile[] = result.files
          .filter(file => {
            // Only include image files
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
            return imageExtensions.some(ext => 
              file.name.toLowerCase().endsWith(ext)
            );
          })
          .map((file, index) => {
            // Get the public URL for the file
            const { data: urlData } = supabase.storage
              .from('media')
              .getPublicUrl(file.name);
            
            // Store standardized path for consistency
            const standardPath = standardizeImagePath(urlData.publicUrl);
            
            return {
              id: `storage_${index}`,
              name: file.name,
              url: urlData.publicUrl,
              type: 'image' as const,
              size: file.metadata?.size || 0,
              uploaded_at: file.updated_at || file.created_at || new Date().toISOString()
            };
          });
        
        setAvailableImages(mediaFiles);
      } else {
        console.error('Failed to load images from storage:', result.error);
        // Fallback to local images if storage fails
        loadLocalImages();
      }
    } catch (error) {
      console.error('Error loading images from storage:', error);
      // Fallback to local images if storage fails
      loadLocalImages();
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    loadAvailableImages();
  }, [loadAvailableImages]);

  useEffect(() => {
    if (showRegistrations) {
      fetchRegistrations(showRegistrations);
    }
  }, [showRegistrations]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setError('Failed to load registrations');
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...newEvent,
          spots_available: newEvent.capacity,
        }])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      setEvents([...events, data]);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: 25,
        image_url: '',
      });
      setShowCreateForm(false);
      setSuccess('Event created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event');
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          title: editingEvent.title,
          description: editingEvent.description,
          date: editingEvent.date,
          time: editingEvent.time,
          location: editingEvent.location,
          capacity: editingEvent.capacity,
          image_url: editingEvent.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingEvent.id)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      setEvents(events.map(event => 
        event.id === editingEvent.id ? data : event
      ));
      setEditingEvent(null);
      setSuccess('Event updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Refresh events to ensure we have the latest data
      setTimeout(() => fetchEvents(), 500);
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This will also delete all registrations for this event.')) {
      return;
    }

    try {
      // First, delete all registrations for this event
      const { error: registrationsError } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId);

      if (registrationsError) {
        throw new Error(`Failed to delete event registrations: ${registrationsError.message}`);
      }

      // Then delete the event itself
      const { error: eventError, data } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .select();

      if (eventError) {
        throw new Error(`Failed to delete event: ${eventError.message}`);
      }

      // Check if anything was actually deleted
      if (!data || data.length === 0) {
        setError('Event could not be deleted. Please check your permissions.');
        return;
      }

      setEvents(events.filter(event => event.id !== eventId));
      setSuccess('Event and all its registrations deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event');
    }
  };

  // Image selection handlers
  const handleImageSelect = (imageUrl: string, imageName: string) => {
    // Standardize the image URL format for consistent storage
    const standardizedUrl = standardizeImagePath(imageUrl);
    
    if (isSelectingImageForEdit && editingEvent) {
      setEditingEvent({ ...editingEvent, image_url: standardizedUrl });
    } else {
      setNewEvent({ ...newEvent, image_url: standardizedUrl });
    }
    
    // Show success message
    setSuccess(`Selected image: ${imageName}`);
    setTimeout(() => setSuccess(''), 2000);
    
    console.debug(`[Event Admin] Image selected: ${imageName} (${imageUrl} → standardized to: ${standardizedUrl})`);
    setShowImageSelector(false);
    setIsSelectingImageForEdit(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isEventPast = (date: string) => {
    return new Date(date) < new Date();
  };

  const getEventStatus = (event: Event) => {
    if (isEventPast(event.date)) {
      return <Badge variant="secondary">Past</Badge>;
    }
    if (event.spots_available === 0) {
      return <Badge variant="destructive">Full</Badge>;
    }
    if (event.spots_available <= 5) {
      return <Badge className="bg-orange-500 hover:bg-orange-600">Almost Full</Badge>;
    }
    return <Badge className="bg-green-500 hover:bg-green-600">Open</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600">Manage your events and registrations</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="outline"
            onClick={fetchEvents}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-warm-teal hover:bg-warm-teal-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
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

      {/* Create Event Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Create New Event
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
                  Event Title *
                </label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <Input
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) || 25 })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Image
                </label>
                <div className="flex items-center space-x-3">
                  {newEvent.image_url && (
                    <div className="flex items-center space-x-2">
                      <SafeImage 
                        src={newEvent.image_url} 
                        alt="Selected event image" 
                        className="w-16 h-16 object-cover rounded-lg border"
                        baseFolder="media"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setNewEvent({ ...newEvent, image_url: '' })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsSelectingImageForEdit(false);
                      setShowImageSelector(true);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>{newEvent.image_url ? 'Change Image' : 'Select Image'}</span>
                  </Button>
                </div>
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
                onClick={handleCreateEvent}
                className="bg-warm-teal hover:bg-warm-teal-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatTime(event.time)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getEventStatus(event)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingEvent?.id === event.id ? (
                <div className="space-y-4">
                  <Input
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    placeholder="Event title"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      value={editingEvent.date}
                      onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    />
                    <Input
                      type="time"
                      value={editingEvent.time}
                      onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    />
                  </div>
                  <Input
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    placeholder="Location"
                  />
                  <Input
                    type="number"
                    value={editingEvent.capacity}
                    onChange={(e) => setEditingEvent({ ...editingEvent, capacity: parseInt(e.target.value) || 25 })}
                    placeholder="Capacity"
                  />
                  <Textarea
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    placeholder="Description"
                    rows={3}
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Event Image
                    </label>
                    <div className="flex items-center space-x-3">
                      {editingEvent.image_url && (
                        <div className="flex items-center space-x-2">
                          <SafeImage 
                            src={editingEvent.image_url} 
                            alt="Selected event image" 
                            className="w-16 h-16 object-cover rounded-lg border"
                            baseFolder="media"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingEvent({ ...editingEvent, image_url: '' })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsSelectingImageForEdit(true);
                          setShowImageSelector(true);
                        }}
                        className="flex items-center space-x-2"
                      >
                        <ImageIcon className="h-4 w-4" />
                        <span>{editingEvent.image_url ? 'Change' : 'Select'}</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingEvent(null)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleUpdateEvent}
                      className="bg-warm-teal hover:bg-warm-teal-600"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {event.image_url ? (
                    <div className="mb-3">
                      <SafeImage 
                        src={event.image_url} 
                        alt={event.title} 
                        className="w-full h-32 object-cover rounded-lg"
                        baseFolder="media"
                      />
                    </div>
                  ) : (
                    <div className="mb-3 bg-gray-200 w-full h-32 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No image selected</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {event.spots_available} of {event.capacity} spots available
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-700 line-clamp-2">{event.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (showRegistrations === event.id) {
                          setShowRegistrations(null);
                        } else {
                          setShowRegistrations(event.id);
                        }
                      }}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      View Registrations
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingEvent(event)}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}

              {/* Registrations */}
              {showRegistrations === event.id && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-4">Event Registrations</h4>
                  {registrations.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No registrations yet</p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {registrations.map((registration) => (
                        <div key={registration.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{registration.name}</p>
                              <p className="text-sm text-gray-600">{registration.email}</p>
                              <p className="text-sm text-gray-600">{registration.phone}</p>
                            </div>
                            <Badge variant="outline">{registration.status}</Badge>
                          </div>
                          {(registration.medical_conditions || registration.dietary_requirements) && (
                            <div className="mt-2 text-xs text-gray-600">
                              {registration.medical_conditions && (
                                <p>Medical: {registration.medical_conditions}</p>
                              )}
                              {registration.dietary_requirements && (
                                <p>Dietary: {registration.dietary_requirements}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first event</p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-warm-teal hover:bg-warm-teal-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Image Selector Modal */}
      {showImageSelector && (
        <ImageSelector 
          images={availableImages}
          onSelect={handleImageSelect}
          onClose={() => {
            setShowImageSelector(false);
            setIsSelectingImageForEdit(false);
          }}
          title={isSelectingImageForEdit ? "Select Image for Event Edit" : "Select Image for New Event"}
        />
      )}
    </div>
  );
};

export default EventsPage;

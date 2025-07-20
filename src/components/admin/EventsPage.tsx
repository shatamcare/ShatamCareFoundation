import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase-secure';
import { 
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Users,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  ImageIcon,
  Eye,
  RefreshCw
} from 'lucide-react';

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
  category?: string;
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

  useEffect(() => {
    fetchEvents();
    loadAvailableImages();
  }, []);

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

  const loadAvailableImages = () => {
    // Load existing images from public/images directory (same as MediaPage)
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
      
      // Users images (suitable for events)
      { id: '17', name: 'activities 1.jpg', url: '/images/Users/activities 1.jpg', type: 'image', size: 234567, uploaded_at: '2024-01-17T00:00:00Z', category: 'Users' },
      { id: '18', name: 'activities 2.jpg', url: '/images/Users/activities 2.jpg', type: 'image', size: 223456, uploaded_at: '2024-01-18T00:00:00Z', category: 'Users' },
      { id: '19', name: 'activities.jpg', url: '/images/Users/activities.jpg', type: 'image', size: 245678, uploaded_at: '2024-01-19T00:00:00Z', category: 'Users' },
      { id: '20', name: 'art 1.jpg', url: '/images/Users/art 1.jpg', type: 'image', size: 198765, uploaded_at: '2024-01-20T00:00:00Z', category: 'Users' },
      { id: '21', name: 'art.jpg', url: '/images/Users/art.jpg', type: 'image', size: 187234, uploaded_at: '2024-01-21T00:00:00Z', category: 'Users' },
      { id: '22', name: 'care.jpg', url: '/images/Users/care.jpg', type: 'image', size: 156789, uploaded_at: '2024-01-22T00:00:00Z', category: 'Users' },
      { id: '23', name: 'dementia care 1.jpg', url: '/images/Users/dementia care 1.jpg', type: 'image', size: 212345, uploaded_at: '2024-01-23T00:00:00Z', category: 'Users' },
      { id: '24', name: 'Dementia.jpg', url: '/images/Users/Dementia.jpg', type: 'image', size: 234567, uploaded_at: '2024-01-24T00:00:00Z', category: 'Users' },
      { id: '25', name: 'EHA (1).jpg', url: '/images/Users/EHA (1).jpg', type: 'image', size: 189234, uploaded_at: '2024-01-25T00:00:00Z', category: 'Users' },
      { id: '26', name: 'EHA (2).jpg', url: '/images/Users/EHA (2).jpg', type: 'image', size: 167890, uploaded_at: '2024-01-26T00:00:00Z', category: 'Users' },
      { id: '27', name: 'EHA.jpg', url: '/images/Users/EHA.jpg', type: 'image', size: 203456, uploaded_at: '2024-01-27T00:00:00Z', category: 'Users' },
      { id: '28', name: 'eha3.jpg', url: '/images/Users/eha3.jpg', type: 'image', size: 178923, uploaded_at: '2024-01-28T00:00:00Z', category: 'Users' },
      { id: '29', name: 'EHA7.jpg', url: '/images/Users/EHA7.jpg', type: 'image', size: 234567, uploaded_at: '2024-01-29T00:00:00Z', category: 'Users' },
      { id: '30', name: 'EHA8.jpg', url: '/images/Users/EHA8.jpg', type: 'image', size: 189234, uploaded_at: '2024-01-30T00:00:00Z', category: 'Users' },
      { id: '31', name: 'memory cafe.jpeg', url: '/images/Users/memory cafe.jpeg', type: 'image', size: 198765, uploaded_at: '2024-01-31T00:00:00Z', category: 'Users' },
    ];
    
    setAvailableImages(existingImages);
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

    console.log('Creating event with image_url:', newEvent.image_url);

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

      console.log('Event created successfully:', data);

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

    console.log('Updating event with image_url:', editingEvent.image_url);

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

      console.log('Event updated successfully:', data);

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
    if (!confirm('Are you sure you want to delete this event? This will also delete all registrations.')) {
      return;
    }

    try {
      console.log('Attempting to delete event:', eventId);
      
      const { error, data } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .select(); // Add select to see what was actually deleted

      console.log('Delete response:', { error, data });

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      // Check if anything was actually deleted
      if (!data || data.length === 0) {
        console.warn('No rows were deleted. Event may not exist or RLS prevented deletion.');
        setError('Event could not be deleted. Please check your permissions.');
        return;
      }

      console.log('Successfully deleted event:', data);
      setEvents(events.filter(event => event.id !== eventId));
      setSuccess('Event deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event');
    }
  };

  // Image selection handlers
  const handleImageSelect = (imageUrl: string) => {
    console.log('Image selected:', imageUrl);
    console.log('Is selecting for edit:', isSelectingImageForEdit);
    
    if (isSelectingImageForEdit && editingEvent) {
      console.log('Setting image for editing event:', editingEvent.id);
      setEditingEvent({ ...editingEvent, image_url: imageUrl });
    } else {
      console.log('Setting image for new event');
      setNewEvent({ ...newEvent, image_url: imageUrl });
    }
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
                      <img 
                        src={newEvent.image_url} 
                        alt="Selected event image" 
                        className="w-16 h-16 object-cover rounded-lg border"
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
                          <img 
                            src={editingEvent.image_url} 
                            alt="Selected event image" 
                            className="w-16 h-16 object-cover rounded-lg border"
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
                      <img 
                        src={event.image_url} 
                        alt={event.title} 
                        className="w-full h-32 object-cover rounded-lg"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Select Event Image</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowImageSelector(false);
                    setIsSelectingImageForEdit(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group cursor-pointer border-2 border-transparent hover:border-warm-teal rounded-lg transition-colors"
                    onClick={() => handleImageSelect(image.url)}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg">
                      <p className="truncate">{image.name}</p>
                      <p className="text-gray-300">{image.category}</p>
                    </div>
                  </div>
                ))}
              </div>
              {availableImages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No images available. Upload images through the Media page first.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EventsPage;

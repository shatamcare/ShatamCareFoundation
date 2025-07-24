import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPinIcon, ArrowRight, Filter, Search, Users, ChevronLeft } from 'lucide-react';
import EventRegistrationModal from '@/components/EventRegistrationModal';
import { getEvents, EventForDisplay } from '@/lib/supabase-secure';
import { imagePaths, getImagePath } from '@/utils/imagePaths';
import { resolveImageUrl, getImageWithFallback } from '@/utils/imageUrlResolver';
import { Link } from 'react-router-dom';

const EventsPage = () => {
  const [events, setEvents] = useState<EventForDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Event type mappings
  const eventTypes = {
    'Memory Care Workshop': 'Workshop',
    'Caregiver Support Group': 'Support Group',
    'Brain Health Seminar': 'Workshop',
    'Therapy Session': 'Therapy',
    'Fundraiser Event': 'Fundraiser'
  };
  
  const eventImages = {
    'Workshop': imagePaths.caregivers.training,
    'Support Group': imagePaths.caregivers.sessions,
    'Therapy': imagePaths.users.care,
    'Fundraiser': imagePaths.users.eha1
  };

  // Fetch events from database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const fetchedEvents = await getEvents();
        if (fetchedEvents && fetchedEvents.length > 0) {
          setEvents(fetchedEvents);
        } else {
          // Fallback events if database is empty
          setEvents([
            {
              id: "sample-1",
              title: "Memory Care Workshop",
              date: "2025-07-20",
              time: "10:00 AM - 4:00 PM",
              location: "Community Center, Main Hall",
              description: "Learn techniques for supporting loved ones with dementia",
              spots: "30 spots available",
              capacity: 30,
              spots_available: 30
            },
            {
              id: "sample-2", 
              title: "Caregiver Support Group",
              date: "2025-07-27",
              time: "2:00 PM - 4:00 PM",
              location: "Shatam Care Foundation Office",
              description: "Monthly support group for family caregivers",
              spots: "15 spots available",
              capacity: 15,
              spots_available: 15
            },
            {
              id: "sample-3",
              title: "Brain Health Seminar", 
              date: "2025-08-03",
              time: "9:00 AM - 12:00 PM",
              location: "City Library Auditorium",
              description: "Understanding brain health and prevention strategies",
              spots: "50 spots available",
              capacity: 50,
              spots_available: 50
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        // Use fallback events on error
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter and search events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    
    const eventType = eventTypes[event.title] || 'Event';
    return matchesSearch && eventType.toLowerCase() === selectedFilter.toLowerCase();
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  const getEventTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'Workshop': 'bg-warm-teal text-white',
      'Support Group': 'bg-sage-600 text-white',
      'Therapy': 'bg-blue-600 text-white',
      'Fundraiser': 'bg-sunrise-orange text-white'
    };
    return colorMap[type] || 'bg-gray-600 text-white';
  };

  /**
   * Get the appropriate event image URL with improved handling
   */
  const getEventImage = (event: EventForDisplay): string => {
    // Use image_url from database if available
    if (event.image_url) {
      // Use our centralized resolver for consistent URL handling
      return resolveImageUrl(event.image_url);
    }
    
    // Fall back to type-based images if no specific image URL is available
    const eventType = event.type as keyof typeof eventTypes;
    const mappedType = eventTypes[eventType] || 'Workshop';
    
    // Return appropriate fallback image based on event type
    return eventImages[mappedType as keyof typeof eventImages] || imagePaths.caregivers.training;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, originalUrl: string) => {
    console.warn(`Failed to load event image: ${originalUrl}`);
    const target = e.target as HTMLImageElement;
    // Use a consistent fallback path
    target.src = getImagePath('images/placeholder.jpg');
  };
  const uniqueEventTypes = ['all', ...Array.from(new Set(Object.values(eventTypes)))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-warm-teal to-warm-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center mb-6">
            <Link to="/" className="flex items-center text-white hover:text-warm-teal-200 transition-colors mr-4">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-poppins">All Events</h1>
          <p className="text-xl text-warm-teal-100 max-w-3xl leading-relaxed">
            Join our community events, workshops, and support groups designed to empower caregivers and support families affected by dementia.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-teal focus:border-warm-teal"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-teal focus:border-warm-teal"
              >
                {uniqueEventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Events' : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="text-gray-600">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-teal mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Check back soon for upcoming events!'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
              const eventType = eventTypes[event.title] || 'Event';
              
              return (
                <Card key={event.id} className="bg-white hover:shadow-2xl transition-all duration-500 border-0 shadow-lg group overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={getImageWithFallback(event.image_url)}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        console.warn(`Failed to load event image: ${event.image_url}`);
                        e.currentTarget.src = getImagePath('images/placeholder.jpg');
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-charcoal/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getEventTypeColor(eventType)}`}>
                        {eventType}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-sunrise-orange text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {event.spots}
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-dark-charcoal mb-3 font-poppins group-hover:text-warm-teal transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-gray-700 text-sm">
                        <Calendar className="h-4 w-4 text-warm-teal mr-2 flex-shrink-0" />
                        <span className="font-medium">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-700 text-sm">
                        <Clock className="h-4 w-4 text-sunrise-orange mr-2 flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-700 text-sm">
                        <MapPinIcon className="h-4 w-4 text-sage-600 mr-2 flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <EventRegistrationModal
                      eventId={event.id}
                      eventTitle={event.title}
                      eventDate={event.date}
                      eventTime={event.time}
                      eventLocation={event.location}
                      spotsLeft={event.spots}
                    >
                      <Button className="btn-cta w-full">
                        Reserve Your Seat <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </EventRegistrationModal>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;

'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {FaCalendar,FaClock,FaMapMarkerAlt,FaTicketAlt,FaArrowLeft,FaArrowRight,FaShare,FaHeart,FaStar,FaUsers,FaMusic,FaSpinner} from 'react-icons/fa';
import ApiService from '@/services/api';
import toast from 'react-hot-toast';

// Helper function to get full media URL
const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('/uploads/')) {
    const baseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const cleanBaseUrl = baseUrl.replace('/api', '');
    return `${cleanBaseUrl}${path}`;
  }
  // If path doesn't start with /uploads/ but is a relative path
  if (path.startsWith('/')) {
    const baseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const cleanBaseUrl = baseUrl.replace('/api', '');
    return `${cleanBaseUrl}${path}`;
  }
  return path;
};

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return 'TBD';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper to format time
const formatTime = (dateString) => {
  if (!dateString) return 'TBD';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function EventDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await ApiService.getEventBySlug(slug);
        console.log('Event data:', data);
        
        if (data.success && data.data) {
          // Process event data with full image URL
          const eventData = data.data;
          console.log('Raw bannerImage:', eventData.bannerImage);
          
          // Fix the image URL - remove any extra slashes or quotes
          let imageUrl = eventData.bannerImage;
          if (imageUrl) {
            // Remove quotes if present
            imageUrl = imageUrl.replace(/^["']|["']$/g, '');
            // Remove extra slashes
            imageUrl = imageUrl.replace(/^\/\//, '/');
            eventData.bannerImage = getMediaUrl(imageUrl);
          }
          
          console.log('Processed bannerImage:', eventData.bannerImage);
          setEvent(eventData);
        } else {
          setError(data.message || 'Event not found');
        }
      } catch (err) {
        console.error('Fetch event error:', err);
        setError('Failed to load event details');
        toast.error('Could not load event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  // Get price range from ticket classes
  const getPriceRange = (ticketClasses) => {
    if (!ticketClasses || ticketClasses.length === 0) return 'TBD';
    const prices = ticketClasses.map((cls) => cls.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `₹${min}`;
    return `₹${min} - ₹${max}`;
  };

  // Get total available tickets
  const getTotalAvailable = (ticketClasses) => {
    if (!ticketClasses || ticketClasses.length === 0) return 'N/A';
    const total = ticketClasses.reduce((sum, cls) => sum + (cls.availableTickets || 0), 0);
    return total;
  };

  // Event status badge color
  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'text-primary border-primary',
      ongoing: 'text-green-500 border-green-500',
      completed: 'text-gray-400 border-gray-400',
    };
    return colors[status] || 'text-gray-400 border-gray-400';
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading event details...</p>
        </div>
      </section>
    );
  }

  if (error || !event) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'The event you are looking for does not exist.'}</p>
          <Link
            href="/events"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 shadow-lg shadow-primary/30 group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Events
          </Link>
        </div>
      </section>
    );
  }

  // Get the processed image URL
  const imageUrl = event.bannerImage || null;

  return (
    <section className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/events"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-300 group mb-6"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Events
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden rounded-2xl"
        >
          {/* Event Image */}
          <div className="relative w-full h-[300px] md:h-[400px] bg-black overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={event.title || 'Event'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Failed to load image:', imageUrl);
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20';
                    fallback.innerHTML = '<span className="text-8xl md:text-9xl">🥁</span>';
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
                <span className="text-8xl md:text-9xl">🥁</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-3 bg-black/60 backdrop-blur-sm border border-white/10 hover:border-primary/40 transition-all duration-300 rounded-full"
              >
                <FaHeart
                  className={`text-xl transition-colors duration-300 ${
                    isLiked ? 'text-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
              <button className="p-3 bg-black/60 backdrop-blur-sm border border-white/10 hover:border-primary/40 transition-all duration-300 rounded-full">
                <FaShare className="text-xl text-gray-400 hover:text-white transition-colors duration-300" />
              </button>
            </div>

            {/* Category and Status Badges */}
            <div className="absolute bottom-6 left-6 flex items-center space-x-3 z-10">
              <span className="px-4 py-1.5 bg-primary/20 backdrop-blur-sm border-l-4 border-primary text-primary text-xs font-semibold uppercase tracking-wider rounded-full">
                {event.eventType || 'Event'}
              </span>
              <span
                className={`px-4 py-1.5 bg-black/60 backdrop-blur-sm border text-white text-xs font-semibold uppercase tracking-wider rounded-full ${getStatusColor(
                  event.status
                )}`}
              >
                {event.status || 'Upcoming'}
              </span>
            </div>

            {/* Rating - Mock for now */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-white/10 text-white text-xs font-medium rounded-full flex items-center gap-1.5">
                <FaStar className="text-yellow-500 text-xs" />
                4.9 (120 reviews)
              </span>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
                <p className="text-gray-400 mt-2">{event.description}</p>
              </div>
              <div className="flex-shrink-0">
                <div className="px-6 py-3 bg-primary/10 border-l-4 border-primary text-center rounded-full">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Price</p>
                  <p className="text-3xl font-bold text-primary">
                    {getPriceRange(event.ticketClasses)}
                  </p>
                  <p className="text-xs text-gray-500">per person</p>
                </div>
              </div>
            </div>

            {/* Event Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-4 p-4 bg-white/5 border-l-4 border-primary/30 hover:border-primary transition-all duration-300 rounded-full">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FaCalendar className="text-primary text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                  <p className="text-white font-semibold">{formatDate(event.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 border-l-4 border-primary/30 hover:border-primary transition-all duration-300 rounded-full">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FaClock className="text-primary text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Time</p>
                  <p className="text-white font-semibold">{formatTime(event.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 border-l-4 border-primary/30 hover:border-primary transition-all duration-300 rounded-full">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FaMapMarkerAlt className="text-primary text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Venue</p>
                  <p className="text-white font-semibold">{event.venue || 'TBD'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 border-l-4 border-primary/30 hover:border-primary transition-all duration-300 rounded-full">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FaUsers className="text-primary text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Spots Available</p>
                  <p className="text-white font-semibold">{getTotalAvailable(event.ticketClasses)} seats</p>
                </div>
              </div>
            </div>

            {/* Additional Info with Ticket Classes */}
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                <FaMusic className="text-primary" />
                About This Event
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {event.description || 'Join us for an unforgettable drumming experience. All skill levels welcome! Instruments provided.'}
              </p>

              {/* Ticket Classes */}
              {event.ticketClasses && event.ticketClasses.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-white font-semibold text-sm mb-2">Ticket Classes</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {event.ticketClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className="bg-white/5 border border-white/10 p-3 hover:border-primary/40 transition-all duration-300 rounded-lg"
                      >
                        <p className="text-white font-semibold">{cls.name}</p>
                        <p className="text-primary font-bold">₹{cls.price}</p>
                        {cls.discountPercentage > 0 && (
                          <p className="text-xs text-green-500">{cls.discountPercentage}% off</p>
                        )}
                        <p className="text-xs text-gray-500">{cls.availableTickets || 0} seats left</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-gray-400 rounded-full">
                  🎵 All Levels Welcome
                </span>
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-gray-400 rounded-full">
                  🥁 Instruments Provided
                </span>
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-gray-400 rounded-full">
                  👥 Group Session
                </span>
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-gray-400 rounded-full">
                  🎶 Live Music
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href={`/booking?eventId=${event.id}`}
                className="flex-1 flex items-center justify-center px-6 py-3.5 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 rounded-full group"
              >
                <FaTicketAlt className="mr-2" />
                Book Now
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/events"
                className="flex-1 flex items-center justify-center px-6 py-3.5 border border-white/20 text-white font-semibold hover:bg-white/5 transition-all duration-300 hover:border-primary/50 rounded-full"
              >
                Browse All Events
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
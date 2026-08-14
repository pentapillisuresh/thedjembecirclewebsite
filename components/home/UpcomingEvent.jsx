'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import ApiService from "../../services/api";

// Helper function to get full media URL
const getMediaUrl = (path) => {
  if (!path) return '/images/event.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('/uploads/')) {
    const baseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const cleanBaseUrl = baseUrl.replace('/api', '');
    return `${cleanBaseUrl}${path}`;
  }
  return path;
};

export default function UpcomingEvent() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingEvent = async () => {
      try {
        const data = await ApiService.getUpcomingEvents();
        // ApiService returns { success: true, data: [...] }
        if (data.success && data.data && data.data.length > 0) {
          // Process the event data to add full image URL
          const eventData = data.data[0];
          if (eventData.bannerImage) {
            eventData.bannerImage = getMediaUrl(eventData.bannerImage);
          }
          setEvent(eventData);
        } else {
          setError('No upcoming events at the moment');
        }
      } catch (err) {
        console.error('Fetch upcoming event error:', err);
        setError(err.message || 'Failed to fetch upcoming event');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUpcomingEvent();
  }, []);

  // Helper to format date and time
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get the cheapest ticket price (or show range)
  const getTicketPrice = (ticketClasses) => {
    if (!ticketClasses || ticketClasses.length === 0) return 'TBD';
    const prices = ticketClasses.map(cls => cls.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `₹${min}`;
    return `₹${min} - ₹${max}`;
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-12 w-64 bg-gray-700 rounded mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-gray-700 rounded mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !event) {
    return (
      <section className="py-20 px-4 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-lg">No upcoming events at the moment. Check back later!</p>
          <Link href="/events" className="inline-block mt-4 text-primary hover:underline">
            Browse All Events →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Link
            href="/events"
            className="inline-flex items-center bg-white/5 backdrop-blur-sm px-6 py-2 mb-4 border-l-4 border-primary hover:bg-white/10 transition-all duration-300"
          >
            <span className="text-primary text-sm font-semibold">✦ Upcoming Event</span>
          </Link>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Featured <span className="text-primary">Event</span>
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Don't miss out on our next drum circle experience
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all duration-500"
        >
          {/* Left side - Image */}
          <div className="relative h-[350px] lg:h-auto min-h-[350px] overflow-hidden bg-gray-800">
            {event.bannerImage ? (
              <Image
                src={event.bannerImage}
                alt={event.title || 'Upcoming Event'}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  console.error('Failed to load image:', event.bannerImage);
                  e.currentTarget.style.display = 'none';
                  // Show fallback
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20';
                    fallback.innerHTML = '<span className="text-6xl">🥁</span>';
                    parent.appendChild(fallback);
                  }
                }}
                unoptimized={true}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
                <span className="text-6xl">🥁</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent lg:bg-gradient-to-r"></div>
            
            <div className="absolute bottom-6 left-6 right-6 lg:hidden">
              <div className="bg-black/80 backdrop-blur-sm p-4 border-l-4 border-primary">
                <h3 className="text-white font-bold text-xl">{event.title}</h3>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              {event.title}
            </h3>
            
            {/* Event Details */}
            <div className="space-y-3 mt-2">
              <div className="flex items-center space-x-4 text-gray-300 bg-white/5 p-3 border-l-4 border-primary/30 hover:border-primary transition-all duration-300">
                <FaCalendar className="text-primary text-xl" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                  <p className="font-semibold text-white">{formatDate(event.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-gray-300 bg-white/5 p-3 border-l-4 border-primary/30 hover:border-primary transition-all duration-300">
                <FaClock className="text-primary text-xl" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Time</p>
                  <p className="font-semibold text-white">{formatTime(event.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-gray-300 bg-white/5 p-3 border-l-4 border-primary/30 hover:border-primary transition-all duration-300">
                <FaMapMarkerAlt className="text-primary text-xl" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Location</p>
                  <p className="font-semibold text-white">{event.venue || 'TBD'}</p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-400 mt-4 text-base leading-relaxed line-clamp-2">
              {event.description || 'Join us for an unforgettable drumming experience.'}
            </p>
            
            <div className="mt-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Price</p>
                <p className="text-2xl font-bold text-primary">
                  {event.ticketClasses ? getTicketPrice(event.ticketClasses) : 'TBD'}
                </p>
                <p className="text-xs text-gray-400">per person</p>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link 
                href={`/booking?eventId=${event.id}`} 
                className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30 group text-sm"
              >
                Reserve Your Spot
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                href="/events" 
                className="inline-flex items-center justify-center px-6 py-2.5 border border-white/20 text-white font-semibold hover:bg-white/5 transition-all duration-300 hover:border-primary/50 text-sm"
              >
                View All Events
              </Link>
            </div>
            
            {/* Social proof */}
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-black bg-primary/30 flex items-center justify-center text-xs text-white font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                <span className="text-white font-semibold">50+</span> people already registered
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
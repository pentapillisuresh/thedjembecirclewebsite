'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaArrowRight, FaInfoCircle, FaDrum, FaUsers } from 'react-icons/fa';
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
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchUpcomingEvent = async () => {
      try {
        const data = await ApiService.getUpcomingEvents();
        if (data.success && data.data && data.data.length > 0) {
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  };

  const getTicketPrice = (ticketClasses) => {
    if (!ticketClasses || ticketClasses.length === 0) return 'TBD';
    const prices = ticketClasses.map(cls => cls.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `₹${min}`;
    return `₹${min} - ₹${max}`;
  };

  const getTruncatedDescription = (text, maxLength = 120) => {
    if (!text) return 'Join us for an unforgettable drumming experience.';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
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
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative">
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
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
          <div className="relative h-full min-h-[350px] overflow-hidden bg-black flex items-center justify-center">
            {event.bannerImage ? (
              <Image
                src={event.bannerImage}
                alt={event.title || 'Upcoming Event'}
                fill
                className="object-contain"
                priority
                unoptimized
                onError={(e) => {
                  console.error('Failed to load image:', event.bannerImage);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <span className="text-6xl">🥁</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 lg:hidden">
              <div className="bg-black/80 backdrop-blur-sm p-4 border-l-4 border-primary">
                <h3 className="text-white font-bold text-xl">{event.title}</h3>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
              {event.title}
            </h3>
            
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
            
            <div className="mt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={showFullDescription ? 'full' : 'truncated'}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-400 text-base leading-relaxed">
                    {showFullDescription 
                      ? (event.description || 'Join us for an unforgettable drumming experience.')
                      : getTruncatedDescription(event.description, 120)
                    }
                  </p>
                </motion.div>
              </AnimatePresence>
              
              {event.description && event.description.length > 120 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 text-primary hover:text-primary/80 font-semibold text-sm transition-colors duration-300 flex items-center gap-1 group"
                >
                  {showFullDescription ? (
                    <>
                      <span>Read Less</span>
                      <FaArrowRight className="rotate-90 group-hover:rotate-[-90deg] transition-transform duration-300" />
                    </>
                  ) : (
                    <>
                      <span>Read More</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Static Content - Exact text as requested */}
            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3 bg-white/5 p-3 rounded border-l-4 border-green-500">
                <FaInfoCircle className="text-green-400 text-lg mt-0.5 flex-shrink-0" />
                <p className="text-sm leading-relaxed">
                  Your ticket includes a <span className="text-green-400 font-semibold">₹300 cover charge</span>, fully redeemable on Food & Beverages (F&B).
                </p>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-3 rounded border-l-4 border-primary">
                <FaDrum className="text-primary text-lg mt-0.5 flex-shrink-0" />
                <p className="text-sm leading-relaxed">
                  Drums will be provided at the venue, so all you need to do is show up and join the circle!
                </p>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-3 rounded border-l-4 border-purple-500">
                <FaUsers className="text-purple-400 text-lg mt-0.5 flex-shrink-0" />
                <p className="text-sm leading-relaxed">
                  Come experience the collective power of rhythm, connect with strangers, let loose, and become part of The Djembe Circle. No experience. No auditions. Just rhythm!
                </p>
              </div>
            </div>
            
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
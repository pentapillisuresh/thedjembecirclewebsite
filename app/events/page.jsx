'use client';
import { useState, useEffect, useCallback } from 'react';
import EventCard from '@/components/events/EventCard';
import EventFilter from '@/components/events/EventFilter';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaTicketAlt, FaSearch, FaCalendarAlt, FaHeadset, FaSpinner } from 'react-icons/fa';
import ApiService from "../../services/api"

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001/api';
const PAGE_SIZE = 6;

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [statusFilter, setStatusFilter] = useState('upcoming'); // 'upcoming', 'completed', 'all'


  // ... (inside your component)
  
  const fetchEvents = useCallback(async (offset = 0, append = false) => {
    try {
      const params = {
        limit: PAGE_SIZE,
        offset,
        status: statusFilter,
      };
      // ApiService.getEvents() returns { success: true, data: { total, events } }
      const data = await ApiService.getEvents(params);
  
      if (data.success && data.data) {
        const { total: totalCount, events: newEvents } = data.data;
        if (append) {
          setEvents(prev => [...prev, ...newEvents]);
        } else {
          setEvents(newEvents);
        }
        setTotal(totalCount);
        setHasMore(offset + PAGE_SIZE < totalCount);
        return newEvents;
      } else {
        throw new Error(data.message || 'Unexpected API response');
      }
    } catch (err) {
      console.error('Fetch events error:', err);
      setError(err.message);
      return [];
    }
  }, [statusFilter]);
  
  // Initial load and when filter changes
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      setError(null);
      await fetchEvents(0, false);
      setLoading(false);
    };
    loadInitial();
  }, [fetchEvents]);
  // Load more (next page)
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextOffset = events.length;
    await fetchEvents(nextOffset, true);
    setLoadingMore(false);
  };

  // Handle filter changes from EventFilter component
  const handleFilter = (filters) => {
    // Map UI filter to status
    let newStatus = 'upcoming';
    if (filters.category === 'completed') newStatus = 'completed';
    else if (filters.category === 'all') newStatus = 'all';
    setStatusFilter(newStatus);
    // Reset pagination when filter changes – useEffect will re‑fetch
    setEvents([]);
    setFiltered([]);
  };

  // Update filtered when events change (no client‑side filtering needed)
  useEffect(() => {
    setFiltered(events);
  }, [events]);

  if (loading && events.length === 0) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading events...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 blur-3xl"></div>

      {/* Hero Banner */}
      <div className="relative w-full h-[400px] overflow-hidden bg-black">
        <Image
          src="/images/banner1.jpg"
          alt="Events Banner"
          fill
          className="object-cover"
          priority
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-2 mb-6 border-l-4 border-primary rounded-full">
                <FaCalendarAlt className="text-primary mr-2" />
                <span className="text-primary text-sm font-semibold tracking-wider">UPCOMING EVENTS</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                Discover Our <span className="text-primary">Events</span>
              </h1>
              <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
              <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
                Find your rhythm at our upcoming drum circles and workshops
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FaTicketAlt className="text-primary" />
                </div>
                <span>{total} {total === 1 ? 'Event' : 'Events'} Available</span>
              </h2>
              <p className="text-gray-400 text-sm flex items-center gap-2 mt-1 ml-2">
                <FaSearch className="text-primary text-xs" />
                Find the perfect drum circle experience
              </p>
            </div>
            <EventFilter onFilter={handleFilter} />
          </div>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filtered.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>

        {/* No events found */}
        {filtered.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-full"
            >
              <div className="text-7xl mb-6">🎵</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
              <p className="text-gray-400 text-lg">No events match your current filters</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
            </motion.div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12"
          >
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-8 py-3 border border-white/20 text-white font-semibold hover:bg-white/5 hover:border-primary/50 transition-all duration-300 rounded-full group inline-flex items-center gap-2"
            >
              {loadingMore ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More Events
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10 blur-3xl"></div>
            <div className="relative border border-white/10 bg-white/5 backdrop-blur-sm p-10 md:p-14 text-center overflow-hidden">
              {/* Decorative lines */}
              <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-primary to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-l from-primary to-transparent"></div>

              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full border border-primary/30">
                    <FaHeadset className="text-4xl text-primary" />
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Need Help Finding the Right Event?
                </h3>
                <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                  Our team is here to help you find the perfect drum circle experience.
                  Contact us for personalized recommendations or private event inquiries.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-10 py-4 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30 rounded-full group"
                  >
                    <span>Contact Our Team</span>
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center px-10 py-4 border border-white/20 text-white font-semibold hover:bg-white/5 hover:border-primary/50 transition-all duration-300 rounded-full group"
                  >
                    <span>Learn More</span>
                  </Link>
                </div>

                <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Private Events</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Custom Workshops</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Group Bookings</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
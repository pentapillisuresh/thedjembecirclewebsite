'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaTicketAlt,
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaArrowRight,
  FaQrcode,
  FaDownload,
  FaPrint,
  FaCheckCircle,
  FaTimesCircle,
  FaClock as FaClockIcon,
  FaSpinner,
} from 'react-icons/fa';
import { useAuth } from '@/lib/auth';
import ApiService from '@/services/api';
import toast from 'react-hot-toast';

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getUserOrders();
        if (data.success && data.data) {
          // data.data contains { total, orders, limit, offset }
          setBookings(data.data.orders || []);
        } else {
          setError('Failed to load bookings');
        }
      } catch (err) {
        console.error('Fetch bookings error:', err);
        setError('Could not load your bookings');
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  // Filter bookings based on event date
  const getFilteredBookings = () => {
    const now = new Date();
    return bookings.filter((booking) => {
      const eventDate = booking.event?.date ? new Date(booking.event.date) : null;
      if (filter === 'all') return true;
      if (filter === 'upcoming') return eventDate && eventDate >= now && booking.status !== 'cancelled';
      if (filter === 'past') return eventDate && eventDate < now && booking.status !== 'cancelled';
      if (filter === 'cancelled') return booking.status === 'cancelled';
      return true;
    });
  };

  // Helper to format date and time
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      paid: { icon: FaCheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Confirmed' },
      pending: { icon: FaClockIcon, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pending' },
      failed: { icon: FaTimesCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Failed' },
      refunded: { icon: FaTimesCircle, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Refunded' },
      cancelled: { icon: FaTimesCircle, color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Cancelled' },
    };
    const defaultStatus = { icon: FaClockIcon, color: 'text-gray-400', bg: 'bg-gray-400/10', label: status };
    return statusMap[status] || defaultStatus;
  };

  // If not logged in, show prompt
  if (!user) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Please Login</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to view your bookings</p>
          <Link href="/login" className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 shadow-lg shadow-primary/30 group">
            <span>Go to Login</span>
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your bookings...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
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

  const filteredBookings = getFilteredBookings();

  if (bookings.length === 0) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30">
            <FaTicketAlt className="text-4xl text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">No Bookings Yet</h2>
          <p className="text-gray-400 mb-6">Book your first drum event today and experience the rhythm!</p>
          <Link href="/events" className="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30 group">
            <span>Explore Events</span>
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black relative overflow-hidden py-16 px-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 blur-3xl"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-2 mb-4 border-l-4 border-primary">
            <FaTicketAlt className="text-primary mr-2" />
            <span className="text-primary text-sm font-semibold tracking-wider">MY BOOKINGS</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                My <span className="text-primary">Bookings</span>
              </h1>
              <div className="w-24 h-1 bg-primary mt-4"></div>
              <p className="mt-4 text-lg text-gray-300">
                View and manage all your confirmed bookings
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">{bookings.length} total bookings</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {['all', 'upcoming', 'past', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 text-sm font-medium capitalize transition-all duration-300 ${
                filter === tab
                  ? 'bg-primary text-white border-l-4 border-white'
                  : 'border border-white/10 text-gray-400 hover:text-white hover:border-primary/30'
              }`}
            >
              {tab === 'all' ? 'All' : tab}
            </button>
          ))}
        </motion.div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking, index) => {
            const StatusIcon = getStatusBadge(booking.status).icon;
            const statusColor = getStatusBadge(booking.status).color;
            const statusBg = getStatusBadge(booking.status).bg;
            const statusLabel = getStatusBadge(booking.status).label;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Event info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {booking.event?.title || 'Event'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <FaCalendar className="text-primary" />
                              {formatDate(booking.event?.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="text-primary" />
                              {formatTime(booking.event?.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-primary" />
                              {booking.event?.venue || 'TBD'}
                            </span>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 ${statusBg} border-l-2 ${statusColor}`}>
                          <StatusIcon className={statusColor} />
                          <span className={`text-sm font-medium ${statusColor}`}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>

                      {/* Order items summary */}
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-gray-400">
                          Tickets: <span className="text-white font-semibold">
                            {booking.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                          </span>
                        </span>
                        <span className="text-gray-400">
                          Total: <span className="text-primary font-semibold">₹{booking.totalAmount}</span>
                        </span>
                      </div>

                      {/* Ticket classes */}
                      {booking.items && booking.items.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {booking.items.map((item) => (
                            <span
                              key={item.id}
                              className="text-xs bg-white/5 px-2 py-1 border border-white/10 text-gray-300"
                            >
                              {item.ticketClass?.name || 'Class'} × {item.quantity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
                      {booking.status === 'paid' && (
                        <>
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-primary border border-primary/30 hover:bg-primary/10 transition-all duration-300">
                            <FaDownload />
                            Ticket
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 border border-white/10 hover:border-primary/30 transition-all duration-300">
                            <FaPrint />
                            Print
                          </button>
                        </>
                      )}
                      {booking.status === 'pending' && (
                        <Link
                          href={`/payment?orderId=${booking.id}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white hover:bg-primary/80 transition-all duration-300"
                        >
                          <FaArrowRight />
                          Pay Now
                        </Link>
                      )}
                      {booking.status === 'paid' && (
                        <Link
                          href={`/booking-details/${booking.id}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm border border-white/20 text-white hover:border-primary/50 transition-all duration-300"
                        >
                          <FaTicketAlt />
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* No filtered bookings */}
        {filteredBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 border border-white/10 bg-white/5"
          >
            <p className="text-gray-400">No {filter} bookings found</p>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 border border-white/10 bg-white/5 backdrop-blur-sm p-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold">Need Help?</h3>
              <p className="text-gray-400 text-sm">Contact us for any assistance with your bookings</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-2 border border-white/20 text-white font-semibold hover:bg-white/5 hover:border-primary/50 transition-all duration-300 group"
            >
              <span>Contact Support</span>
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
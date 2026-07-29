'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FaTicketAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaArrowRight,
  FaWallet,
  FaPlus,
  FaMinus,
  FaSpinner,
} from 'react-icons/fa';
import { useAuth } from '@/lib/auth';
import ApiService from '@/services/api';
import toast from 'react-hot-toast';

export default function Booking() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    eventId: '',
    fullName: '',
    mobile: '',
    email: '',
    tickets: 1,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Fetch upcoming events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await ApiService.getUpcomingEvents();
        if (data.success && data.data && data.data.length > 0) {
          setEvents(data.data);
          // Auto-select the first event
          const firstEvent = data.data[0];
          setSelectedEvent(firstEvent);
          setForm((prev) => ({
            ...prev,
            eventId: firstEvent.id,
          }));
        } else {
          setError('No upcoming events available');
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events. Please try again.');
        toast.error('Could not load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  // Populate user info when available
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.fullName || user.name || '',
        mobile: user.phone || user.mobile || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Update selected event when dropdown changes
  useEffect(() => {
    if (form.eventId && events.length > 0) {
      const event = events.find((e) => e.id === form.eventId);
      setSelectedEvent(event || null);
    }
  }, [form.eventId, events]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEvent) {
      toast.error('Please select an event');
      return;
    }

    // Get ticket price (use first ticket class price or show 0)
    const ticketPrice =
      selectedEvent.ticketClasses && selectedEvent.ticketClasses.length > 0
        ? selectedEvent.ticketClasses[0].price
        : 0;

    const bookingData = {
      ...form,
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      eventDate: selectedEvent.date,
      eventVenue: selectedEvent.venue,
      ticketPrice,
      totalAmount: ticketPrice * form.tickets,
      // store full event object if needed
      event: selectedEvent,
    };

    localStorage.setItem('tempBooking', JSON.stringify(bookingData));
    router.push('/summary');
  };

  const updateTickets = (change) => {
    const newValue = form.tickets + change;
    if (newValue >= 1 && newValue <= 10) {
      setForm({ ...form, tickets: newValue });
    }
  };

  // Format date and time
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  // Get ticket price range or single price
  const getTicketPrice = (event) => {
    if (!event || !event.ticketClasses || event.ticketClasses.length === 0) {
      return 'TBD';
    }
    const prices = event.ticketClasses.map((cls) => cls.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `₹${min}`;
    return `₹${min} - ₹${max}`;
  };

  // Get the first ticket class price (for total calculation)
  const getBasePrice = (event) => {
    if (!event || !event.ticketClasses || event.ticketClasses.length === 0) {
      return 0;
    }
    return event.ticketClasses[0].price;
  };

  if (!user) return null;

  if (loading) {
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
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Events Available</h2>
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
    <section className="min-h-screen bg-black relative overflow-hidden py-16 px-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 blur-3xl"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-2 mb-4 border-l-4 border-primary">
            <FaTicketAlt className="text-primary mr-2" />
            <span className="text-primary text-sm font-semibold tracking-wider">BOOKING</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Book Your <span className="text-primary">Tickets</span>
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Secure your spot at our upcoming drum circle events
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 border border-white/10 bg-white/5 backdrop-blur-sm p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Booking Details</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Event
                </label>
                <select
                  value={form.eventId}
                  onChange={(e) => setForm({ ...form, eventId: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors duration-300 appearance-none"
                  required
                >
                  {events.map((event) => (
                    <option key={event.id} value={event.id} className="bg-black">
                      {event.title} - {getTicketPrice(event)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <FaPhone />
                  </div>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Tickets
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateTickets(-1)}
                    disabled={form.tickets <= 1}
                    className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaMinus className="text-white" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={form.tickets}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 1 && value <= 10) {
                        setForm({ ...form, tickets: value });
                      }
                    }}
                    className="w-20 bg-black/50 border border-white/10 px-4 py-3 text-white text-center focus:outline-none focus:border-primary/50 transition-colors duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => updateTickets(1)}
                    disabled={form.tickets >= 10}
                    className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPlus className="text-white" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Maximum 10 tickets per booking</p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 group"
              >
                Continue to Summary
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </form>
          </motion.div>

          {/* Event Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 h-fit sticky top-24"
          >
            <h3 className="text-xl font-bold text-white mb-4">Event Summary</h3>

            {selectedEvent ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Event</p>
                  <p className="text-white font-semibold">{selectedEvent.title}</p>
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <FaCalendar className="text-primary" />
                  <span className="text-sm">{formatDate(selectedEvent.date)}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <FaClock className="text-primary" />
                  <span className="text-sm">{formatTime(selectedEvent.date)}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <FaMapMarkerAlt className="text-primary" />
                  <span className="text-sm">{selectedEvent.venue || 'TBD'}</span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Price per ticket</span>
                    <span className="text-white font-semibold">
                      {getTicketPrice(selectedEvent)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">Tickets</span>
                    <span className="text-white font-semibold">× {form.tickets}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-white/10">
                    <span className="text-gray-400">Total</span>
                    <span className="text-primary">
                      ₹{getBasePrice(selectedEvent) * form.tickets}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
                  <FaWallet className="text-primary" />
                  <span>Secure payment on next step</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Please select an event</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
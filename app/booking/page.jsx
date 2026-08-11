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
  FaCheckCircle,
  FaUserCircle,
} from 'react-icons/fa';
import { useAuth } from '@/lib/auth';
import ApiService from '@/services/api';
import toast from 'react-hot-toast';
import { loadRazorpay } from '../../components/layout/loadRazorPay';

export default function Booking() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedTicketClass, setSelectedTicketClass] = useState(null);
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
          // Auto-select first ticket class
          if (firstEvent.ticketClasses && firstEvent.ticketClasses.length > 0) {
            setSelectedTicketClass(firstEvent.ticketClasses[0]);
          }
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
      console.log('User data:', user);
      setForm((prev) => ({
        ...prev,
        fullName: user.fullName || user.name || user.username || '',
        mobile: user.phone || user.mobile || user.phoneNumber || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Update selected event when dropdown changes
  useEffect(() => {
    if (form.eventId && events.length > 0) {
      const event = events.find((e) => e.id === form.eventId);
      setSelectedEvent(event || null);
      // Update ticket class when event changes
      if (event && event.ticketClasses && event.ticketClasses.length > 0) {
        setSelectedTicketClass(event.ticketClasses[0]);
      }
    }
  }, [form.eventId, events]);

  // Handle payment
 // Handle payment
const handlePayment = async (e) => {
  e.preventDefault();
  
  if (!selectedEvent) {
    toast.error('Please select an event');
    return;
  }

  if (!selectedTicketClass) {
    toast.error('Please select a ticket class');
    return;
  }

  if (!form.fullName || !form.mobile || !form.email) {
    toast.error('Please fill in all required fields');
    return;
  }

  setProcessingPayment(true);

  try {
    // 1. Create internal order
    const orderPayload = {
      eventId: selectedEvent.id,
      items: [
        {
          ticketClassId: selectedTicketClass.id,
          quantity: form.tickets,
        },
      ],
      customerDetails: {
        fullName: form.fullName,
        mobile: form.mobile,
        email: form.email,
      },
    };

    const orderResponse = await ApiService.createOrder(orderPayload);

    if (!orderResponse.success) {
      throw new Error(orderResponse.message || 'Order creation failed');
    }

    const orderData = orderResponse.data;

    // 2. Create Razorpay order
    const razorpayPayload = { orderId: orderData.id };
    const razorpayResponse = await ApiService.createRazorpayOrder(razorpayPayload);

    if (!razorpayResponse.success) {
      throw new Error(razorpayResponse.message || 'Razorpay order creation failed');
    }

    const { razorpayOrderId, amount, key } = razorpayResponse.data;

    // 3. Open Razorpay checkout
    const options = {
      key: key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100, // in paise
      currency: 'INR',
      name: 'THE DJEMBE CIRCLE',
      description: `Booking: ${selectedEvent.title}`,
      order_id: razorpayOrderId,
      handler: async function (response) {
        // 4. Verify payment
        try {
          const verifyPayload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          const verifyResponse = await ApiService.verifyPayment(verifyPayload);

          if (verifyResponse.success) {
            toast.success('Payment successful! 🎉');
            // Redirect to success page with the actual payment ID
            const params = new URLSearchParams({
              orderId: orderData.id,
              eventId: selectedEvent.id,
              tickets: form.tickets,
              payment_id: response.razorpay_payment_id, // FIXED: Use actual payment ID
              payment_status: 'success',
            });
            router.push(`/success?${params.toString()}`);
          } else {
            throw new Error(verifyResponse.message || 'Payment verification failed');
          }
        } catch (error) {
          console.error('Verification error:', error);
          toast.error(error.message || 'Payment verification failed');
          router.push(`/payment-failed?orderId=${orderData.id}`);
        }
        setProcessingPayment(false);
      },
      modal: {
        ondismiss: function () {
          toast.error('Payment cancelled');
          setProcessingPayment(false);
        },
      },
      prefill: {
        name: form.fullName,
        email: form.email,
        contact: form.mobile,
      },
      theme: {
        color: '#FF6B35', // primary color
      },
    };

    const loaded = await loadRazorpay();

    if (!loaded) {
      toast.error("Failed to load payment gateway");
      setProcessingPayment(false);
      return;
    }

    const razorpay = new window.Razorpay(options);
    razorpay.open();

  } catch (error) {
    console.error('Payment flow error:', error);
    toast.error(error.message || 'Failed to initiate payment');
    setProcessingPayment(false);
  }
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
  const getBasePrice = () => {
    return selectedTicketClass?.price || 0;
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

      <div className="max-w-6xl mx-auto relative z-10">
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form - Takes 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 border border-white/10 bg-white/5 backdrop-blur-sm p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Booking Details</h2>
            <form onSubmit={handlePayment} className="space-y-5">
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

              {selectedEvent && selectedEvent.ticketClasses && selectedEvent.ticketClasses.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Ticket Class
                  </label>
                  <select
                    value={selectedTicketClass?.id || ''}
                    onChange={(e) => {
                      const cls = selectedEvent.ticketClasses.find(
                        (c) => c.id === parseInt(e.target.value)
                      );
                      setSelectedTicketClass(cls);
                    }}
                    className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors duration-300 appearance-none"
                    required
                  >
                    {selectedEvent.ticketClasses.map((cls) => (
                      <option key={cls.id} value={cls.id} className="bg-black">
                        {cls.name} - ₹{cls.price}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                disabled={processingPayment}
                className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {processingPayment ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Pay & Book Now
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <FaCheckCircle className="text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCheckCircle className="text-green-500" />
                  <span>Instant Confirmation</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCheckCircle className="text-green-500" />
                  <span>Free Cancellation</span>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Event Preview - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 h-fit sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4">Booking Summary</h3>

              {selectedEvent ? (
                <div className="space-y-4">
                  {/* Event Details */}
                  <div className="border-b border-white/10 pb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Event Details</p>
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

                  {/* User Details */}
                  <div className="border-t border-white/10 pt-4 mt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Customer Details</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-gray-300">
                        <FaUser className="text-primary text-sm" />
                        <div>
                          <p className="text-xs text-gray-500">Full Name</p>
                          <p className="text-white text-sm font-medium">{form.fullName || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-300">
                        <FaPhone className="text-primary text-sm" />
                        <div>
                          <p className="text-xs text-gray-500">Mobile</p>
                          <p className="text-white text-sm font-medium">{form.mobile || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-300">
                        <FaEnvelope className="text-primary text-sm" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-white text-sm font-medium">{form.email || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Summary */}
                  <div className="border-t border-white/10 pt-4 mt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Ticket Summary</p>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Ticket Class</span>
                      <span className="text-white font-semibold">
                        {selectedTicketClass?.name || 'Standard'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-400">Price per ticket</span>
                      <span className="text-white font-semibold">
                        ₹{getBasePrice()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-400">Tickets</span>
                      <span className="text-white font-semibold">× {form.tickets}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-white/10">
                      <span className="text-gray-400">Total Amount</span>
                      <span className="text-primary">
                        ₹{getBasePrice() * form.tickets}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-4 pt-3 border-t border-white/10">
                    <FaWallet className="text-primary" />
                    <span>Secure payment via Razorpay</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Please select an event</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
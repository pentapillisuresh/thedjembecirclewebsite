'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaTicketAlt, FaDownload, FaHome, FaCalendar, FaClock, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaWallet, FaArrowRight, FaPrint, FaSpinner,} from 'react-icons/fa';
import ApiService from '@/services/api';
import toast from 'react-hot-toast';

export default function Success() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const verificationResult = searchParams.get('verificationResult');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isSuccess = verificationResult === 'true';

  useEffect(() => {
    if (!orderId) {
      // If no orderId, redirect to my-bookings
      router.push('/my-bookings');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getOrder(orderId);
        if (data.success && data.data) {
          setOrder(data.data);
        } else {
          setError(data.message || 'Failed to fetch order details');
        }
      } catch (err) {
        console.error('Fetch order error:', err);
        setError('Could not load order details');
        toast.error('Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error || 'Order not found'}</p>
          <Link
            href="/my-bookings"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 shadow-lg shadow-primary/30 group"
          >
            <span>View My Bookings</span>
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    );
  }

  const statusColor = isSuccess ? 'green' : 'red';
  const statusBg = isSuccess ? 'bg-green-500/10' : 'bg-red-500/10';
  const statusBorder = isSuccess ? 'border-green-500' : 'border-red-500';
  const StatusIcon = isSuccess ? FaCheckCircle : FaTimesCircle;
  const statusTitle = isSuccess ? 'Booking Confirmed!' : 'Payment Failed';
  const statusMessage = isSuccess
    ? 'Your spot is secured. We can\'t wait to see you there!'
    : 'We couldn\'t process your payment. Please try again.';
  const headerColor = isSuccess ? 'text-green-500' : 'text-red-500';
  const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';

  // Compute total tickets and items summary
  const totalTickets = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const ticketClasses = order.items?.map(item => item.ticketClass?.name || 'Class') || [];

  return (
    <section className="min-h-screen bg-black relative overflow-hidden py-16 px-4">
      {/* Background decorative elements */}
      <div className={`absolute top-0 right-0 w-96 h-96 ${isSuccess ? 'bg-green-500/5' : 'bg-red-500/5'} blur-3xl`}></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 blur-3xl"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className={`inline-flex items-center ${statusBg} backdrop-blur-md px-6 py-2 mb-4 border-l-4 ${borderColor}`}>
            <StatusIcon className={`${headerColor} mr-2`} />
            <span className={`${headerColor} text-sm font-semibold tracking-wider`}>
              {isSuccess ? 'SUCCESS' : 'FAILED'}
            </span>
          </div>
          <h1 className={`text-4xl md:text-5xl font-extrabold text-white`}>
            {statusTitle}
          </h1>
          <div className={`w-24 h-1 ${borderColor} mx-auto mt-4`}></div>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            {statusMessage}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-8">
              {/* Status Icon */}
              <div className="flex justify-center mb-6">
                <div className={`w-24 h-24 ${statusBg} rounded-full flex items-center justify-center border-2 ${borderColor}`}>
                  <StatusIcon className={`text-5xl ${headerColor}`} />
                </div>
              </div>

              <h2 className={`text-2xl font-bold text-white text-center mb-6 ${headerColor}`}>
                {statusTitle}
              </h2>

              {/* Order ID */}
              <div className="border border-white/10 bg-white/5 p-4 mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider text-center">Order ID</p>
                <p className="text-xl font-mono text-primary text-center">#{order.id}</p>
                  <p className="text-xs text-gray-500 text-center mt-1">Payment ID: {order.razorpayPaymentId}</p>
              </div>

              {/* Event Details */}
              {order.event && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white mb-3">Event Details</h3>

                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaTicketAlt className="text-primary" />
                      Event
                    </span>
                    <span className="text-white font-semibold">{order.event.title}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-primary" />
                      Venue
                    </span>
                    <span className="text-white">{order.event.venue || 'TBD'}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaCalendar className="text-primary" />
                      Date
                    </span>
                    <span className="text-white">{formatDate(order.event.date)}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaClock className="text-primary" />
                      Time
                    </span>
                    <span className="text-white">{formatTime(order.event.date)}</span>
                  </div>

                  {/* Tickets summary */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaTicketAlt className="text-primary" />
                      Tickets
                    </span>
                    <span className="text-white font-semibold">
                      {totalTickets} {totalTickets === 1 ? 'ticket' : 'tickets'}
                    </span>
                  </div>

                  {/* Ticket classes */}
                  {order.items && order.items.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {order.items.map((item) => (
                        <span
                          key={item.id}
                          className="text-xs bg-white/5 px-2 py-1 border border-white/10 text-gray-300"
                        >
                          {item.ticketClass?.name || 'Class'} × {item.quantity}
                          {item.discountPercentageAtTime > 0 && (
                            <span className="text-green-500 ml-1">({item.discountPercentageAtTime}% off)</span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaWallet className="text-primary" />
                      Total Paid
                    </span>
                    <span className="text-xl font-bold text-primary">₹{order.totalAmount}</span>
                  </div>
                </div>
              )}

              {/* Customer Info */}
              {order.User && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-3">Customer Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3 text-gray-300">
                      <FaUser className="text-primary" />
                      <span>{order.User.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <FaPhone className="text-primary" />
                      <span>{order.User.phone}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>

              {isSuccess ? (
                // Success actions
                <>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 group">
                      <FaDownload className="mr-2 group-hover:translate-y-1 transition-transform duration-300" />
                      Download Ticket
                    </button>

                    <button className="w-full flex items-center justify-center px-6 py-3 border border-white/20 text-white font-semibold hover:bg-white/5 hover:border-primary/50 transition-all duration-300 group">
                      <FaPrint className="mr-2" />
                      Print Ticket
                    </button>

                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                    <Link
                      href="/my-bookings"
                      className="w-full flex items-center justify-center px-6 py-3 border border-white/10 text-white font-semibold hover:border-primary/50 transition-all duration-300 group"
                    >
                      <FaTicketAlt className="mr-2" />
                      View My Bookings
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </>
              ) : (
                // Failure actions
                <div className="space-y-3">
                  <Link
                    href="/booking"
                    className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 group"
                  >
                    <FaTicketAlt className="mr-2" />
                    Try Again
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <Link
                    href="/my-bookings"
                    className="w-full flex items-center justify-center px-6 py-3 border border-white/10 text-white font-semibold hover:border-primary/50 transition-all duration-300 group"
                  >
                    <FaTicketAlt className="mr-2" />
                    View My Bookings
                  </Link>

                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center px-6 py-3 border border-white/10 text-gray-400 font-semibold hover:text-white hover:border-white/30 transition-all duration-300 group"
                  >
                    Contact Support
                  </Link>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/10">
                <Link
                  href="/"
                  className="w-full flex items-center justify-center px-6 py-3 text-gray-400 font-semibold hover:text-white transition-all duration-300 group"
                >
                  <FaHome className="mr-2" />
                  Go Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
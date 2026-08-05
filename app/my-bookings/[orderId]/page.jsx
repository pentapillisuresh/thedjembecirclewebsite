'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {FaTicketAlt,FaCalendar,FaClock,FaMapMarkerAlt,FaUser,FaPhone,FaEnvelope,FaWallet,FaArrowLeft,FaArrowRight,FaSpinner,FaCheckCircle,FaTimesCircle,FaExclamationTriangle,FaTrash} from 'react-icons/fa';
import ApiService from '@/services/api';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function OrderDetails() {
  const { orderId } = useParams(); 
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState(false);
  const [error, setError] = useState(null);
  const [refundStatus, setRefundStatus] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getOrder(orderId);
        if (data.success && data.data) {
          setOrder(data.data);
        } else {
          setError(data.message || 'Order not found');
        }
      } catch (err) {
        console.error('Fetch order error:', err);
        setError('Failed to load order');
        toast.error('Could not load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, user, router]);

  // Check if refund is allowed (event date > 3 days from now)
  const isRefundable = () => {
    if (!order || order.status !== 'paid') return false;
    const eventDate = new Date(order.event?.date);
    const now = new Date();
    const daysDiff = (eventDate - now) / (1000 * 60 * 60 * 24);
    return daysDiff > 3; // more than 3 days
  };

  const handleRefund = async () => {
    if (!confirm('Are you sure you want to cancel this booking and request a refund?')) return;
    setRefunding(true);
    try {
      const data = await ApiService.requestRefund(orderId);
      if (data.success) {
        setRefundStatus('success');
        // Refresh order data
        const updatedOrder = await ApiService.getOrder(orderId);
        if (updatedOrder.success) setOrder(updatedOrder.data);
        toast.success('Refund initiated successfully');
      } else {
        throw new Error(data.message || 'Refund failed');
      }
    } catch (err) {
      console.error('Refund error:', err);
      setRefundStatus('failed');
      toast.error(err.message || 'Refund failed. Please try again.');
    } finally {
      setRefunding(false);
    }
  };

  // Format date/time
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

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <FaSpinner className="text-4xl text-primary animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'The order does not exist.'}</p>
          <Link
            href="/my-bookings"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 shadow-lg shadow-primary/30 group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to My Bookings
          </Link>
        </div>
      </section>
    );
  }

  const totalTickets = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const refundable = isRefundable();

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
          className="mb-10"
        >
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-2 mb-4 border-l-4 border-primary">
            <FaTicketAlt className="text-primary mr-2" />
            <span className="text-primary text-sm font-semibold tracking-wider">ORDER DETAILS</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                Order <span className="text-primary">#{order.id}</span>
              </h1>
              <div className="w-24 h-1 bg-primary mt-4"></div>
              <p className="mt-4 text-lg text-gray-300">
                View your booking details and status
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`px-3 py-1 border-l-4 ${
                order.status === 'paid'
                  ? 'border-green-500 text-green-500 bg-green-500/10'
                  : order.status === 'pending'
                  ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10'
                  : order.status === 'refunded'
                  ? 'border-orange-500 text-orange-500 bg-orange-500/10'
                  : 'border-red-500 text-red-500 bg-red-500/10'
              }`}>
                {order.status.toUpperCase()}
              </span>
            </div>
          </div>
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
              {/* Event Details */}
              {order.event && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">Event Details</h2>

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

                  {order.items && order.items.length > 0 && (
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-white/5 p-2 border-l-2 border-primary"
                        >
                          <span className="text-gray-300 text-sm">
                            {item.ticketClass?.name || 'Class'} × {item.quantity}
                          </span>
                          <span className="text-white text-sm">
                            ₹{item.subtotal}
                            {item.discountPercentageAtTime > 0 && (
                              <span className="text-green-500 text-xs ml-2">
                                {item.discountPercentageAtTime}% off
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaWallet className="text-primary" />
                      Total Paid
                    </span>
                    <span className="text-2xl font-bold text-primary">₹{order.totalAmount}</span>
                  </div>
                </div>
              )}

              {/* Customer Info */}
              {order.User && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-4">Customer Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3 text-gray-300">
                      <FaUser className="text-primary" />
                      <span>{order.User.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <FaPhone className="text-primary" />
                      <span>{order.User.phone}</span>
                    </div>
                    {order.User.email && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <FaEnvelope className="text-primary" />
                        <span>{order.User.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar – Actions & Refund */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Actions</h3>

              {/* Refund button */}
              {order.status === 'paid' && (
                <>
                  {refundable ? (
                    <button
                      onClick={handleRefund}
                      disabled={refunding}
                      className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group mb-3"
                    >
                      {refunding ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaTrash className="mr-2" />
                          Cancel & Refund
                          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 mb-3">
                      <div className="flex items-start gap-3">
                        <FaExclamationTriangle className="text-yellow-500 text-lg mt-0.5" />
                        <div>
                          <p className="text-yellow-500 font-semibold">Refund Not Available</p>
                          <p className="text-gray-400 text-sm">
                            Refunds can only be requested more than 3 days before the event.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {order.status === 'refunded' && (
                <div className="bg-green-500/10 border border-green-500/30 p-4 mb-3">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 text-lg mt-0.5" />
                    <div>
                      <p className="text-green-500 font-semibold">Refunded</p>
                      <p className="text-gray-400 text-sm">This booking has been refunded.</p>
                    </div>
                  </div>
                </div>
              )}

              {order.status === 'failed' && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 mb-3">
                  <div className="flex items-start gap-3">
                    <FaTimesCircle className="text-red-500 text-lg mt-0.5" />
                    <div>
                      <p className="text-red-500 font-semibold">Payment Failed</p>
                      <p className="text-gray-400 text-sm">Please try booking again.</p>
                    </div>
                  </div>
                </div>
              )}

              <Link
                href="/my-bookings"
                className="w-full flex items-center justify-center px-6 py-3 border border-white/20 text-white font-semibold hover:bg-white/5 hover:border-primary/50 transition-all duration-300 group mt-3"
              >
                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to My Bookings
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
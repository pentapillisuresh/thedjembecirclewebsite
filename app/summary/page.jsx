'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaArrowLeft,
  FaArrowRight,
  FaWallet,
  FaCheckCircle,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaSpinner,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import ApiService from '@/services/api';

export default function Summary() {
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTicketClass, setSelectedTicketClass] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [orderData, setOrderData] = useState(null);

  // Load booking data from localStorage
  useEffect(() => {
    const data = localStorage.getItem('tempBooking');
    if (!data) {
      router.push('/booking');
      return;
    }
    const parsed = JSON.parse(data);
    setBooking(parsed);
    // If event has ticketClasses, set available classes
    if (parsed.event && parsed.event.ticketClasses) {
      setAvailableClasses(parsed.event.ticketClasses);
      // Auto-select first class
      setSelectedTicketClass(parsed.event.ticketClasses[0]);
    }
  }, [router]);

  // Handle class selection
  const handleClassChange = (e) => {
    const classId = parseInt(e.target.value);
    const cls = availableClasses.find((c) => c.id === classId);
    setSelectedTicketClass(cls);
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

  // Handle payment flow
  const handlePayment = async () => {
    if (!booking || !selectedTicketClass) {
      toast.error('Please select a ticket class');
      return;
    }

    setLoading(true);

    try {
      // 1. Create internal order
      const orderPayload = {
        eventId: booking.eventId,
        items: [
          {
            ticketClassId: selectedTicketClass.id,
            quantity: booking.tickets,
          },
        ],
      };
      const orderResponse = await ApiService.createOrder(orderPayload);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Order creation failed');
      }

      const orderData = orderResponse.data;
      setOrderData(orderData);

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
        name: 'Drum Event Booking',
        description: `Booking for ${booking.eventTitle || 'Event'}`,
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
              toast.success('Payment successful!');
              // Clear temp booking
              localStorage.removeItem('tempBooking');
              // Redirect to success page
              router.push(`/payment-success?orderId=${orderData.id}`);
            } else {
              throw new Error(verifyResponse.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error(error.message || 'Payment verification failed');
            router.push(`/payment-failed?orderId=${orderData.id}`);
          }
        },
        modal: {
          ondismiss: function () {
            toast.error('Payment cancelled');
            setLoading(false);
          },
        },
        prefill: {
          name: booking.fullName,
          email: booking.email,
          contact: booking.mobile,
        },
        theme: {
          color: '#FF6B35', // primary color
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment flow error:', error);
      toast.error(error.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Calculate total amount based on selected class
  const ticketPrice = selectedTicketClass?.price || booking.price || 0;
  const totalAmount = ticketPrice * (booking.tickets || 1);

  return (
    <section className="min-h-screen bg-black relative overflow-hidden py-16 px-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 blur-3xl"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-2 mb-4 border-l-4 border-primary">
            <FaCheckCircle className="text-primary mr-2" />
            <span className="text-primary text-sm font-semibold tracking-wider">SUMMARY</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Booking <span className="text-primary">Summary</span>
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Review your booking details before proceeding to payment
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
              <h2 className="text-2xl font-bold text-white mb-6">Booking Details</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaTicketAlt className="text-primary" />
                    Event
                  </span>
                  <span className="text-white font-semibold">
                    {booking.eventTitle || booking.eventName}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    Venue
                  </span>
                  <span className="text-white">{booking.eventVenue || booking.venue}</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaCalendar className="text-primary" />
                    Date
                  </span>
                  <span className="text-white">
                    {formatDate(booking.eventDate || booking.date)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaClock className="text-primary" />
                    Time
                  </span>
                  <span className="text-white">
                    {formatTime(booking.eventDate || booking.date)}
                  </span>
                </div>

                {/* Ticket Class Selection */}
                {availableClasses.length > 0 && (
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaTicketAlt className="text-primary" />
                      Ticket Class
                    </span>
                    <select
                      value={selectedTicketClass?.id || ''}
                      onChange={handleClassChange}
                      className="bg-black/50 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors duration-300"
                    >
                      {availableClasses.map((cls) => (
                        <option key={cls.id} value={cls.id} className="bg-black">
                          {cls.name} - ₹{cls.price}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaTicketAlt className="text-primary" />
                    Tickets
                  </span>
                  <span className="text-white font-semibold">× {booking.tickets}</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaWallet className="text-primary" />
                    Price per ticket
                  </span>
                  <span className="text-white">₹{ticketPrice}</span>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaWallet className="text-primary" />
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white mb-4">
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 text-gray-300">
                    <FaUser className="text-primary" />
                    <span>{booking.fullName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <FaPhone className="text-primary" />
                    <span>{booking.mobile}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <FaEnvelope className="text-primary" />
                    <span>{booking.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={loading || !selectedTicketClass}
                  className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => router.back()}
                  className="w-full flex items-center justify-center px-6 py-3 border border-white/20 text-white font-semibold hover:bg-white/5 hover:border-primary/50 transition-all duration-300 group"
                >
                  <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  Go Back
                </button>

                <button
                  onClick={() => router.push('/events')}
                  className="w-full flex items-center justify-center px-6 py-3 border border-white/10 text-gray-400 font-semibold hover:text-white hover:border-white/30 transition-all duration-300"
                >
                  Browse More Events
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FaCheckCircle className="text-green-500" />
                  <span>Secure booking</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <FaCheckCircle className="text-green-500" />
                  <span>Free cancellation within 24 hours</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
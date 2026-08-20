'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaArrowRight, FaPlus, FaMinus, FaSpinner, FaCheckCircle, FaTag, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import ApiService from '@/services/api';
import toast from 'react-hot-toast';
import { loadRazorpay } from '../../components/layout/loadRazorPay';
import { format } from 'path';

export default function Booking() {
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
    couponCode: '',
    rememberMe: false,
  });
  const [coupon, setCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponValidationDetails, setCouponValidationDetails] = useState(null);

  // Fetch upcoming events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getUpcomingEvents();
        if (data.success && data.data && data.data.length > 0) {
          setEvents(data.data);
          const firstEvent = data.data[0];
          setSelectedEvent(firstEvent);
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
  }, []);

  // Update selected event when dropdown changes
  useEffect(() => {
    if (form.eventId && events.length > 0) {
      const event = events.find((e) => e.id === form.eventId);
      setSelectedEvent(event || null);
      if (event && event.ticketClasses && event.ticketClasses.length > 0) {
        setSelectedTicketClass(event.ticketClasses[0]);
      }
      // Reset coupon when event changes
      setCoupon(null);
      setCouponError('');
      setCouponValidationDetails(null);
      setForm(prev => ({ ...prev, couponCode: '' }));
    }
  }, [form.eventId, events]);

  // Apply coupon
  const applyCoupon = async () => {
    const code = form.couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }

    if (!selectedEvent) {
      setCouponError('Please select an event');
      return;
    }

    if (!form.fullName) {
      setCouponError('Please enter an User FullName');
      return;
    }

    if (!form.mobile) {
      setCouponError('Please enter an User Mobile');
      return;
    }

    if (!form.email) {
      setCouponError('Please enter an User Email');
      return;
    }

    setCouponLoading(true);
    setCouponError('');
    setCouponValidationDetails(null);

    try {
      const response = await ApiService.validateCoupon({ code, mobile: form.mobile });

      if (response.success && response.data) {
        setCoupon(response.data);
        setCouponValidationDetails({
          valid: true,
          message: response.message || 'Coupon applied successfully!',
        });
        toast.success('Coupon applied successfully!');
        setCouponError('');
      } else {
        const errorMsg = response.message || 'Invalid coupon code';
        setCouponError(errorMsg);
        setCoupon(null);
        setCouponValidationDetails({
          valid: false,
          message: errorMsg,
        });
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Coupon validation error:', err);
      const errorMsg = err.message || 'Failed to apply coupon';
      setCouponError(errorMsg);
      setCoupon(null);
      setCouponValidationDetails({
        valid: false,
        message: errorMsg,
      });
      toast.error(errorMsg);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
    setCouponValidationDetails(null);
    setForm(prev => ({ ...prev, couponCode: '' }));
    toast.success('Coupon removed');
  };

  const calculateTotal = () => {
    const baseTotal = getBasePrice() * form.tickets;
    if (coupon) {
      const discount = (baseTotal * coupon.discountPercentage) / 100;
      return baseTotal - discount;
    }
    return baseTotal;
  };

  const calculateDiscount = () => {
    const baseTotal = getBasePrice() * form.tickets;
    if (coupon) {
      return (baseTotal * coupon.discountPercentage) / 100;
    }
    return 0;
  };
  
  const registerUserData = async () => {
    try {
      const data = await ApiService.register({
        phone: form.mobile,
        name: form.fullName,
        email: form.email,
      });
  
      console.log("Register response:", data);
  
      if (!data.success || !data.data) {
        throw new Error(data.message || "Registration failed");
      }
  
      const { token, user } = data.data;
  
      if (!token) {
        throw new Error("Authentication token not received");
      }
  
      // Store token
      ApiService.setToken(token);
  
      // Store user information
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLogin", "true");
  
      // IMPORTANT:
      // Return data so handlePayment knows registration/login succeeded
      return {
        success: true,
        user,
        token,
      };
  
    } catch (error) {
      console.error("Signup/Login error:", error);
  
      toast.error(
        error?.message || "Failed to register. Please try again."
      );
  
      return {
        success: false,
        error,
      };
    }
  }; 
  
  // Handle payment
  const handlePayment = async (e) => {
    e.preventDefault();
  
    // -----------------------------
    // Validate event
    // -----------------------------
    if (!selectedEvent) {
      toast.error("Please select an event");
      return;
    }
  
    // -----------------------------
    // Validate ticket class
    // -----------------------------
    if (!selectedTicketClass) {
      toast.error("Please select a ticket class");
      return;
    }
  
    // -----------------------------
    // Validate customer details
    // -----------------------------
    if (!form.fullName || !form.mobile || !form.email) {
      toast.error("Please fill in all required fields");
      return;
    }
  
    setProcessingPayment(true);
  
    try {
      // ==========================================
      // STEP 1: Register / Login existing user
      // ==========================================
      const userResult = await registerUserData();
  
      if (!userResult || !userResult.success) {
        setProcessingPayment(false);
        return;
      }
  
      console.log("User authenticated:", userResult.user);
  
      // ==========================================
      // STEP 2: Create Order
      // ==========================================
      const orderPayload = {
        eventId: selectedEvent.id,
  
        items: [
          {
            ticketClassId: selectedTicketClass.id,
            quantity: Number(form.tickets),
          },
        ],
  
        customerDetails: {
          fullName: form.fullName,
          mobile: form.mobile,
          email: form.email,
        },
  
        couponCode: coupon ? coupon.code : null,
      };
  
      console.log("Creating order:", orderPayload);
  
      const orderResponse = await ApiService.createOrder(orderPayload);
  
      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(
          orderResponse.message || "Order creation failed"
        );
      }
  
      const orderData = orderResponse.data;
  
      console.log("Order created:", orderData);
  
      // ==========================================
      // STEP 3: Create Razorpay Order
      // ==========================================
      const razorpayPayload = {
        orderId: orderData.id,
        couponCode: coupon ? coupon.code : null,
      };
  
      const razorpayResponse =
        await ApiService.createRazorpayOrder(razorpayPayload);
  
      if (!razorpayResponse.success || !razorpayResponse.data) {
        throw new Error(
          razorpayResponse.message ||
            "Razorpay order creation failed"
        );
      }
  
      const {
        razorpayOrderId,
        amount,
        key,
      } = razorpayResponse.data;
  
      if (!razorpayOrderId) {
        throw new Error("Razorpay order ID not received");
      }
  
      // ==========================================
      // STEP 4: Razorpay Options
      // ==========================================
      const options = {
        key:
          key ||
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  
        amount: Number(amount) * 100,
  
        currency: "INR",
  
        name: "THE DJEMBE CIRCLE",
  
        description: `Booking: ${selectedEvent.title}${
          coupon ? ` (Coupon: ${coupon.code})` : ""
        }`,
  
        order_id: razorpayOrderId,
  
        handler: async function (response) {
          try {
            console.log(
              "Razorpay payment response:",
              response
            );
  
            // ==========================================
            // STEP 5: Verify Payment
            // ==========================================
            const verifyPayload = {
              razorpay_order_id:
                response.razorpay_order_id,
  
              razorpay_payment_id:
                response.razorpay_payment_id,
  
              razorpay_signature:
                response.razorpay_signature,
            };
  
            const verifyResponse =
              await ApiService.verifyPayment(
                verifyPayload
              );
  
            if (!verifyResponse.success) {
              throw new Error(
                verifyResponse.message ||
                  "Payment verification failed"
              );
            }
  
            // ==========================================
            // Payment successful
            // ==========================================
            toast.success("Payment successful! 🎉");
  
            const params = new URLSearchParams({
              orderId: String(orderData.id),
  
              eventId: String(selectedEvent.id),
  
              tickets: String(form.tickets),
  
              payment_id:
                response.razorpay_payment_id,
  
              payment_status: "success",
  
              couponCode: coupon
                ? coupon.code
                : "",
  
              discountAmount:
                calculateDiscount().toString(),
            });
  
            router.push(
              `/success?${params.toString()}`
            );
  
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );
  
            toast.error(
              error?.message ||
                "Payment verification failed"
            );
  
            router.push(
              `/payment-failed?orderId=${orderData.id}`
            );
  
          } finally {
            setProcessingPayment(false);
          }
        },
  
        // ==========================================
        // Razorpay modal dismissed
        // ==========================================
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
            setProcessingPayment(false);
          },
        },
  
        // ==========================================
        // Customer information
        // ==========================================
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.mobile,
        },
  
        // ==========================================
        // Razorpay theme
        // ==========================================
        theme: {
          color: "#FF6B35",
        },
      };
  
      // ==========================================
      // STEP 6: Load Razorpay
      // ==========================================
      const loaded = await loadRazorpay();
  
      if (!loaded) {
        throw new Error(
          "Failed to load payment gateway"
        );
      }
  
      // ==========================================
      // STEP 7: Open Razorpay
      // ==========================================
      const razorpay =
        new window.Razorpay(options);
  
      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response.error
          );
  
          toast.error(
            response.error?.description ||
              "Payment failed"
          );
  
          setProcessingPayment(false);
        }
      );
  
      razorpay.open();
  
    } catch (error) {
      console.error(
        "Payment flow error:",
        error
      );
  
      toast.error(
        error?.message ||
          "Failed to initiate payment"
      );
  
      setProcessingPayment(false);
    }
  };
  
  const updateTickets = (change) => {
    const newValue = form.tickets + change;
    if (newValue >= 1 && newValue <= 10) {
      setForm({ ...form, tickets: newValue });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
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

  const getBasePrice = () => {
    return selectedTicketClass?.price || 0;
  };

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
    <section className="min-h-screen bg-black relative overflow-hidden py-12 px-6 md:px-16 lg:px-24">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 blur-3xl"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Book Your <span className="text-primary">Tickets</span>
          </h1>
          <p className="mt-2 text-gray-400">Secure your spot at our upcoming drum circle events</p>
        </motion.div>

        {/* Main content – single column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Event Details at the top */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">Event Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Select Event</label>
                <select
                  value={form.eventId}
                  onChange={(e) => setForm({ ...form, eventId: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors duration-300 rounded"
                  required
                >
                  {events.map((event) => (
                    <option key={event.id} value={event.id} className="bg-black">
                      {event.title} - {getTicketPrice(event)}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEvent && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/30 p-4 rounded border border-white/5">
                  <div className="flex items-center gap-3 text-gray-300">
                    <FaCalendar className="text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Date</p>
                      <p className="font-medium text-white">{formatDate(selectedEvent.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <FaClock className="text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Time</p>
                      <p className="font-medium text-white">{formatTime(selectedEvent.date)}</p>
                    </div>
                  </div>
                  {selectedEvent.venue && (
                    <div className="flex items-center gap-3 text-gray-300 sm:col-span-2">
                      <FaMapMarkerAlt className="text-primary flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Venue</p>
                        <p className="font-medium text-white">{selectedEvent.venue}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">Contact Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">FULL NAME *</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300 rounded"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">WHATSAPP NUMBER *</label>
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300 rounded"
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">EMAIL *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300 rounded"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="text-sm text-gray-400 bg-primary/5 p-3 rounded border border-primary/10">
                <FaExclamationCircle className="inline mr-2 text-primary" />
                Important: Please use the correct mobile number and email address, as booking and event-related communication will be done through these channels.
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={form.rememberMe}
                  onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-300">
                  Remember Me
                </label>
                <span className="text-xs text-gray-500 ml-1">Save contact details on this device for future bookings.</span>
              </div>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">Coupon Code</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <FaTag />
                </div>
                <input
                  type="text"
                  value={form.couponCode}
                  onChange={(e) => {
                    setForm({ ...form, couponCode: e.target.value.toUpperCase() });
                    if (coupon) {
                      setCoupon(null);
                      setCouponError('');
                      setCouponValidationDetails(null);
                    }
                  }}
                  className={`w-full bg-black/50 border ${couponError ? 'border-red-500/50' :
                      coupon ? 'border-green-500/50' :
                        'border-white/10'
                    } pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors duration-300 uppercase rounded`}
                  placeholder="ENTER COUPON CODE"
                  disabled={!!coupon}
                />
              </div>
              {!coupon ? (
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponLoading || !form.couponCode}
                  className="px-6 py-3 bg-primary/20 hover:bg-primary/30 text-primary font-semibold border border-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded w-full sm:w-auto"
                >
                  {couponLoading ? <FaSpinner className="animate-spin" /> : 'Apply'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold border border-red-500/30 transition-all duration-300 rounded w-full sm:w-auto"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            {/* Coupon Feedback */}
            {couponError && (
              <div className="mt-3 bg-red-500/10 border border-red-500/30 p-3 rounded flex items-start gap-2">
                <FaExclamationCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-400 text-sm">{couponError}</p>
                  <p className="text-xs text-gray-500 mt-1">Coupon must be active, not expired, with remaining uses, and eligible for you.</p>
                </div>
              </div>
            )}
            {coupon && (
              <div className="mt-3 bg-green-500/10 border border-green-500/30 p-3 rounded">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <p className="text-green-400 font-semibold">{coupon.code}</p>
                    <p className="text-xs text-gray-400">{coupon.discountPercentage}% discount applied</p>
                  </div>
                  {coupon.expiresAt && (
                    <p className="text-xs text-gray-500">Valid until: {new Date(coupon.expiresAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Ticket Quantity */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
            <label className="block text-sm font-medium text-gray-300 mb-2">Number of Tickets</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateTickets(-1)}
                disabled={form.tickets <= 1}
                className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
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
                className="w-20 bg-black/50 border border-white/10 px-4 py-3 text-white text-center focus:outline-none focus:border-primary/50 transition-colors duration-300 rounded"
                required
              />
              <button
                type="button"
                onClick={() => updateTickets(1)}
                disabled={form.tickets >= 10}
                className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
              >
                <FaPlus className="text-white" />
              </button>
            </div>
            {/* Removed: Maximum 10 tickets per booking */}
          </div>

          {/* Summary & Payment – integrated at bottom */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-3xl font-bold text-primary">₹{calculateTotal().toFixed(2)}</p>
                <p className="text-sm text-gray-400">{form.tickets} ticket{form.tickets > 1 ? 's' : ''}</p>
                {coupon && (
                  <p className="text-xs text-green-400">You saved ₹{calculateDiscount().toFixed(2)} with coupon!</p>
                )}
              </div>
              <button
                onClick={handlePayment}
                disabled={processingPayment}
                className="flex items-center justify-center px-8 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed rounded w-full md:w-auto"
              >
                {processingPayment ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₹{calculateTotal().toFixed(2)}
                    <FaArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mt-4 pt-4 border-t border-white/10">
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
          </div>

          {/* Cover Charge Info (optional) */}
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="text-primary font-semibold">ℹ️</span> Your ticket includes a{' '}
              <span className="text-white font-semibold">₹300 cover charge</span>, fully redeemable on{' '}
              <span className="text-white font-semibold">Food &amp; Beverages (F&amp;B)</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
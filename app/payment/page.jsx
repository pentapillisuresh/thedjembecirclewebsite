'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaWallet, FaCreditCard, FaMoneyBillWave, FaUniversity, 
  FaArrowLeft, FaCheckCircle, FaLock, FaShieldAlt,
  FaRupeeSign, FaQrcode, FaMobileAlt
} from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export default function Payment() {
  const router = useRouter();
  const [method, setMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('tempBooking');
    if (!data) {
      router.push('/booking');
      return;
    }
    setBooking(JSON.parse(data));
  }, [router]);

  const handlePayment = () => {
    if (!method) {
      toast.error('Please select a payment method');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      // Create booking
      const newBooking = {
        id: uuidv4(),
        ...booking,
        status: 'Confirmed',
        bookedAt: new Date().toISOString(),
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=${uuidv4()}&size=150x150`,
      };
      
      // Save to localStorage
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      localStorage.setItem('lastBookingId', newBooking.id);
      localStorage.removeItem('tempBooking');
      
      setLoading(false);
      router.push('/success');
    }, 2000);
  };

  if (!booking) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading payment details...</p>
      </div>
    </div>
  );

  const paymentMethods = [
    { id: 'UPI', icon: FaQrcode, label: 'UPI (Google Pay, PhonePe, Paytm)' },
    { id: 'Debit Card', icon: FaCreditCard, label: 'Debit Card' },
    { id: 'Credit Card', icon: FaCreditCard, label: 'Credit Card' },
    { id: 'Net Banking', icon: FaUniversity, label: 'Net Banking' },
    { id: 'Wallet', icon: FaWallet, label: 'Digital Wallet' },
  ];

  return (
    <section className="min-h-screen bg-black relative overflow-hidden py-16 px-4">
      {/* Background decorative elements */}
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
            <FaWallet className="text-primary mr-2" />
            <span className="text-primary text-sm font-semibold tracking-wider">PAYMENT</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Complete Your <span className="text-primary">Payment</span>
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Secure your spot by completing the payment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 border border-white/10 bg-white/5 backdrop-blur-sm p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>
            
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Payment Summary</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="text-2xl font-bold text-primary flex items-center gap-1">
                    <FaRupeeSign className="text-xl" />
                    {booking.totalAmount}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-gray-500">Event</span>
                  <span className="text-white">{booking.eventName}</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-sm">
                  <span className="text-gray-500">Tickets</span>
                  <span className="text-white">× {booking.tickets}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Select Payment Method</h3>
                <div className="space-y-3">
                  {paymentMethods.map((pm) => {
                    const Icon = pm.icon;
                    const isSelected = method === pm.id;
                    return (
                      <label
                        key={pm.id}
                        className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? 'border-primary bg-primary/10' 
                            : 'border-white/10 hover:border-primary/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="method"
                          value={pm.id}
                          checked={isSelected}
                          onChange={(e) => setMethod(e.target.value)}
                          className="accent-primary w-4 h-4"
                        />
                        <Icon className={`text-xl ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                        <span className={`flex-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                          {pm.label}
                        </span>
                        {isSelected && (
                          <FaCheckCircle className="text-primary" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Secure Payment Note */}
              <div className="flex items-center gap-3 text-sm text-gray-500 p-4 border border-white/10 bg-white/5">
                <FaLock className="text-primary" />
                <span>Your payment is secure and encrypted</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Pay Now
                    <FaWallet className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
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
              <h3 className="text-lg font-bold text-white mb-4">Booking Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Event</p>
                  <p className="text-white font-semibold">{booking.eventName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Venue</p>
                  <p className="text-white">{booking.venue}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date & Time</p>
                  <p className="text-white">{booking.date} at {booking.time}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tickets</p>
                  <p className="text-white">× {booking.tickets}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total</span>
                  <span className="text-xl font-bold text-primary flex items-center gap-1">
                    <FaRupeeSign />
                    {booking.totalAmount}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FaShieldAlt className="text-primary" />
                  <span>Secure & trusted payment</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <FaCheckCircle className="text-green-500" />
                  <span>Instant booking confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <FaCheckCircle className="text-green-500" />
                  <span>Free cancellation within 24 hours</span>
                </div>
              </div>

              <button
                onClick={() => router.back()}
                className="w-full flex items-center justify-center px-6 py-3 border border-white/20 text-white font-semibold hover:bg-white/5 hover:border-primary/50 transition-all duration-300 mt-4 group"
              >
                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Go Back
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
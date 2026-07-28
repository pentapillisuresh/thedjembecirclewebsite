'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, FaTicketAlt, FaDownload, FaHome, 
  FaCalendar, FaClock, FaMapMarkerAlt, FaUser, 
  FaPhone, FaEnvelope, FaWallet, FaArrowRight,
  FaQrcode, FaPrint, FaShare
} from 'react-icons/fa';
import { getBookings } from '@/lib/storage';

export default function Success() {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const lastId = localStorage.getItem('lastBookingId');
    if (lastId) {
      const bookings = getBookings();
      const found = bookings.find(b => b.id === lastId);
      if (found) setBooking(found);
    }
  }, []);

  if (!booking) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading booking details...</p>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-black relative overflow-hidden py-16 px-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 blur-3xl"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center bg-green-500/10 backdrop-blur-md px-6 py-2 mb-4 border-l-4 border-green-500">
            <FaCheckCircle className="text-green-500 mr-2" />
            <span className="text-green-500 text-sm font-semibold tracking-wider">SUCCESS</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Booking <span className="text-green-500">Confirmed!</span>
          </h1>
          <div className="w-24 h-1 bg-green-500 mx-auto mt-4"></div>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Your spot is secured. We can't wait to see you there!
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
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/50">
                  <FaCheckCircle className="text-5xl text-green-500" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Booking Successful!
              </h2>

              {/* Booking ID */}
              <div className="border border-white/10 bg-white/5 p-4 mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider text-center">Booking ID</p>
                <p className="text-xl font-mono text-primary text-center">{booking.id}</p>
              </div>

              {/* Event Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white mb-3">Event Details</h3>
                
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaTicketAlt className="text-primary" />
                    Event
                  </span>
                  <span className="text-white font-semibold">{booking.eventName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    Venue
                  </span>
                  <span className="text-white">{booking.venue}</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaCalendar className="text-primary" />
                    Date
                  </span>
                  <span className="text-white">{booking.date}</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaClock className="text-primary" />
                    Time
                  </span>
                  <span className="text-white">{booking.time}</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaTicketAlt className="text-primary" />
                    Tickets
                  </span>
                  <span className="text-white font-semibold">× {booking.tickets}</span>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FaWallet className="text-primary" />
                    Total Paid
                  </span>
                  <span className="text-xl font-bold text-primary">₹{booking.totalAmount}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white mb-3">Customer Details</h3>
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

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              
              {/* QR Code */}
              <div className="text-center mb-6">
                <div className="bg-white p-2 inline-block">
                  <img 
                    src={booking.qrCode} 
                    alt="QR Code" 
                    className="w-32 h-32 mx-auto"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Scan for ticket verification</p>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 group">
                  <FaDownload className="mr-2 group-hover:translate-y-1 transition-transform duration-300" />
                  Download Ticket
                </button>

                <button className="w-full flex items-center justify-center px-6 py-3 border border-white/20 text-white font-semibold hover:bg-white/5 hover:border-primary/50 transition-all duration-300 group">
                  <FaPrint className="mr-2" />
                  Print Ticket
                </button>

                <button className="w-full flex items-center justify-center px-6 py-3 border border-white/10 text-gray-400 font-semibold hover:text-white hover:border-white/30 transition-all duration-300 group">
                  <FaShare className="mr-2" />
                  Share Booking
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
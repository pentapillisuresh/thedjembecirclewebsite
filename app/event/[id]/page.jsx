'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FaCalendar, 
  FaClock, 
  FaMapMarkerAlt, 
  FaTicketAlt, 
  FaArrowLeft, 
  FaArrowRight,
  FaShare,
  FaHeart,
  FaStar,
  FaUsers,
  FaMusic
} from 'react-icons/fa';
import { getEvents } from '@/lib/storage';

export default function EventDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const events = getEvents();
    const found = events.find(e => e.id === id);
    if (!found) {
      router.push('/events');
      return;
    }
    setEvent(found);
  }, [id, router]);

  if (!event) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading event details...</p>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/events"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-300 group mb-6"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Events
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
        >
          {/* Event Image */}
          <div className="relative w-full h-[300px] md:h-[400px] bg-black overflow-hidden">
            {event.image ? (
              <Image
                src={event.image}
                alt={event.name}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-500/10">
                <span className="text-8xl md:text-9xl">🥁</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-3 bg-black/60 backdrop-blur-sm border border-white/10 hover:border-primary/40 transition-all duration-300 rounded-full"
              >
                <FaHeart className={`text-xl transition-colors duration-300 ${isLiked ? 'text-red-500' : 'text-gray-400'}`} />
              </button>
              <button
                className="p-3 bg-black/60 backdrop-blur-sm border border-white/10 hover:border-primary/40 transition-all duration-300 rounded-full"
              >
                <FaShare className="text-xl text-gray-400 hover:text-white transition-colors duration-300" />
              </button>
            </div>

            {/* Category and Status Badges */}
            <div className="absolute bottom-6 left-6 flex items-center space-x-3 z-10">
              <span className="px-4 py-1.5 bg-primary/20 backdrop-blur-sm border-l-4 border-primary text-primary text-xs font-semibold uppercase tracking-wider rounded-full">
                {event.category || 'Event'}
              </span>
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded-full">
                {event.status || 'Upcoming'}
              </span>
            </div>

            {/* Rating */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-white/10 text-white text-xs font-medium rounded-full flex items-center gap-1.5">
                <FaStar className="text-yellow-500 text-xs" />
                4.9 (120 reviews)
              </span>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{event.name}</h1>
                <p className="text-gray-400 mt-2">{event.description}</p>
              </div>
              <div className="flex-shrink-0">
                <div className="px-6 py-3 bg-primary/10 border-l-4 border-primary text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Price</p>
                  <p className="text-3xl font-bold text-primary">₹{event.price || 499}</p>
                  <p className="text-xs text-gray-500">per person</p>
                </div>
              </div>
            </div>

            {/* Event Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-4 p-4 bg-white/5 border-l-4 border-primary/30 hover:border-primary transition-all duration-300 rounded-full">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FaCalendar className="text-primary text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                  <p className="text-white font-semibold">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 border-l-4 border-primary/30 hover:border-primary transition-all duration-300 rounded-full">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FaClock className="text-primary text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Time</p>
                  <p className="text-white font-semibold">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 border-l-4 border-primary/30 hover:border-primary transition-all duration-300 rounded-full">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FaMapMarkerAlt className="text-primary text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Venue</p>
                  <p className="text-white font-semibold">{event.venue}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 border-l-4 border-primary/30 hover:border-primary transition-all duration-300 rounded-full">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FaUsers className="text-primary text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Spots Available</p>
                  <p className="text-white font-semibold">{event.spots || 50} seats</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-white/5 border border-white/10">
              <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                <FaMusic className="text-primary" />
                About This Event
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {event.fullDescription || event.description || 'Join us for an unforgettable drumming experience. All skill levels welcome! Instruments provided.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-gray-400 rounded-full">🎵 All Levels Welcome</span>
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-gray-400 rounded-full">🥁 Instruments Provided</span>
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-gray-400 rounded-full">👥 Group Session</span>
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-gray-400 rounded-full">🎶 Live Music</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/booking"
                className="flex-1 flex items-center justify-center px-6 py-3.5 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 rounded-full group"
              >
                <FaTicketAlt className="mr-2" />
                Book Now
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/events"
                className="flex-1 flex items-center justify-center px-6 py-3.5 border border-white/20 text-white font-semibold hover:bg-white/5 transition-all duration-300 hover:border-primary/50 rounded-full"
              >
                Browse All Events
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
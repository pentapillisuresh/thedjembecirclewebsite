import Link from 'next/link';
import Image from 'next/image';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaTicketAlt, FaArrowRight, FaStar } from 'react-icons/fa';

export default function EventCard({ event }) {
  return (
    <div className="group relative border border-white/10 bg-white/5 hover:border-primary/40 transition-all duration-500 overflow-hidden hover:-translate-y-2">
      {/* Event Image */}
      <div className="relative w-full h-56 bg-black overflow-hidden">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-500/10">
            <span className="text-7xl">🥁</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4 px-4 py-1.5 bg-primary/20 backdrop-blur-sm border-l-4 border-primary rounded-full">
          <span className="text-xs text-primary font-semibold uppercase tracking-wider">
            {event.category || 'Event'}
          </span>
        </div>

        {/* Venue Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-4 py-1.5 bg-black/60 backdrop-blur-sm border border-white/10 text-white text-xs font-medium rounded-full flex items-center gap-2">
            <FaMapMarkerAlt className="text-primary text-xs" />
            {event.venue}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full">
          <span className="text-xs text-white flex items-center gap-1">
            <FaStar className="text-yellow-500 text-xs" />
            4.9
          </span>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {event.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {event.description || 'Join us for an unforgettable drumming experience.'}
        </p>

        {/* Event Info with Icons */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-3 text-gray-300 bg-white/5 px-3 py-2 border-l-4 border-primary/30 hover:border-primary transition-all duration-300 rounded-full">
            <FaCalendar className="text-primary text-sm" />
            <span className="text-sm font-medium">{event.date}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300 bg-white/5 px-3 py-2 border-l-4 border-primary/30 hover:border-primary transition-all duration-300 rounded-full">
            <FaClock className="text-primary text-sm" />
            <span className="text-sm font-medium">{event.time}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300 bg-white/5 px-3 py-2 border-l-4 border-primary/30 hover:border-primary transition-all duration-300 rounded-full">
            <FaMapMarkerAlt className="text-primary text-sm" />
            <span className="text-sm font-medium">{event.venue}</span>
          </div>
        </div>

        {/* Price and Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <FaTicketAlt className="text-primary text-xs" />
              Price
            </p>
            <p className="text-2xl font-bold text-primary">₹{event.price || 499}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/event/${event.id}`}
              className="px-5 py-2.5 border border-white/20 text-white text-sm font-semibold hover:bg-white/10 hover:border-primary/50 transition-all duration-300 rounded-full flex items-center gap-2 group/btn"
            >
              <span>View Details</span>
              <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/booking"
              className="px-5 py-2.5 bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30 rounded-full flex items-center gap-2 group/btn"
            >
              <span>Book Now</span>
              <FaTicketAlt className="text-xs group-hover/btn:rotate-12 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
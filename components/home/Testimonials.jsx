'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaUser, FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

// Testimonials data directly in the component
const testimonialsData = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Regular Participant',
    content: 'The drum circle experience is absolutely transformative! I\'ve been attending for 6 months and it has completely changed my perspective on community and music. The energy is incredible.',
    rating: 5,
    avatar: null,
    date: '2024-12-15'
  },
  {
    id: 2,
    name: 'Amit Patel',
    role: 'First-time Participant',
    content: 'I was nervous at first, but the facilitators made me feel so welcome. Within minutes, I was lost in the rhythm. This is something everyone should experience at least once.',
    rating: 5,
    avatar: null,
    date: '2024-12-10'
  },
  {
    id: 3,
    name: 'Sneha Reddy',
    role: 'Drum Circle Enthusiast',
    content: 'I\'ve been to many drum circles around the world, but this one is special. The sense of community, the professional facilitation, and the pure joy of making music together is unmatched.',
    rating: 5,
    avatar: null,
    date: '2024-12-05'
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Corporate Team Building',
    content: 'We brought our entire team for a corporate retreat and it was the best decision we made. The drum circle broke down all barriers and brought everyone together in a way I\'ve never seen before.',
    rating: 5,
    avatar: null,
    date: '2024-11-28'
  },
  {
    id: 5,
    name: 'Meera Iyer',
    role: 'Regular Participant',
    content: 'Every session is a journey. The facilitators are amazing at creating a safe, inclusive space where everyone can express themselves. I leave every session feeling rejuvenated.',
    rating: 5,
    avatar: null,
    date: '2024-11-20'
  },
  {
    id: 6,
    name: 'Rajesh Kumar',
    role: 'Musician',
    content: 'As a professional musician, I was skeptical about community drum circles. But this one changed my mind. The quality of the instruments and the expertise of the facilitators is top-notch.',
    rating: 4,
    avatar: null,
    date: '2024-11-15'
  }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const testimonials = testimonialsData;

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <section className="py-12 bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-56 h-56 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/5 blur-3xl"></div>

      <div className="max-w-full mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 px-4"
        >
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm px-3 py-1 mb-3 border-l-4 border-primary">
            <span className="text-primary text-[10px] font-semibold">✦ TESTIMONIALS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            What Our <span className="text-primary">Community Says</span>
          </h2>
          <div className="w-12 h-0.5 bg-primary mx-auto mt-2"></div>
          <p className="mt-3 text-sm text-gray-300 max-w-xl mx-auto">
            Real stories from real participants who found their rhythm with us
          </p>
        </motion.div>

        {/* Main Content - 2 Columns Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Testimonial Carousel */}
          <div className="relative border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 lg:p-10">
            <div className="relative">
              {/* Quote Icon */}
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 border-l-4 border-primary">
                  <FaQuoteLeft className="text-2xl text-primary" />
                </div>
              </div>

              {/* Testimonial Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-base md:text-lg text-gray-200 leading-relaxed text-center max-w-2xl mx-auto">
                    "{testimonials[current].content}"
                  </p>

                  {/* Rating Stars */}
                  <div className="flex justify-center mt-4 space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`text-base ${
                          i < testimonials[current].rating 
                            ? 'text-yellow-500' 
                            : 'text-gray-600'
                        }`} 
                      />
                    ))}
                  </div>

                  {/* User Info */}
                  <div className="mt-5 flex items-center justify-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/30 to-purple-500/30 border-2 border-primary/30 flex items-center justify-center text-sm font-bold text-white">
                      {getInitials(testimonials[current].name)}
                    </div>
                    <div className="text-left">
                      <h4 className="text-white font-bold text-sm">{testimonials[current].name}</h4>
                      <p className="text-gray-400 text-[11px]">{testimonials[current].role}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-center mt-3">
                    <span className="text-[10px] text-gray-500">{testimonials[current].date}</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-center gap-3 mt-5">
                <button
                  onClick={prev}
                  className="p-2 bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 group"
                >
                  <FaChevronLeft className="text-white text-sm group-hover:text-primary transition-colors duration-300" />
                </button>
                <button
                  onClick={next}
                  className="p-2 bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 group"
                >
                  <FaChevronRight className="text-white text-sm group-hover:text-primary transition-colors duration-300" />
                </button>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-1.5 mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`transition-all duration-300 ${
                      index === current 
                        ? 'w-6 h-1.5 bg-primary' 
                        : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              {/* Counter */}
              <div className="text-center mt-3">
                <span className="text-xs text-gray-500">
                  {current + 1} / {testimonials.length}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Video with reduced height */}
          <div className="relative border border-white/10 bg-black overflow-hidden flex items-center justify-center" style={{ minHeight: '400px', maxHeight: '500px' }}>
            <video
              src="/images/testmonial.mp4"
              className="w-full h-full object-cover"
              autoPlay={isPlaying}
              muted={isMuted}
              loop
              playsInline
              controls={false}
            />
            
            {/* Video Overlay Controls */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-14 h-14 bg-primary/90 flex items-center justify-center hover:bg-primary transition-all duration-300 shadow-lg shadow-primary/30"
              >
                {isPlaying ? (
                  <FaPause className="text-white text-xl" />
                ) : (
                  <FaPlay className="text-white text-xl ml-1" />
                )}
              </button>
            </div>

            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 w-9 h-9 bg-black/70 backdrop-blur-sm border border-white/20 hover:border-primary/40 transition-all duration-300 flex items-center justify-center"
            >
              {isMuted ? (
                <FaVolumeMute className="text-white text-xs" />
              ) : (
                <FaVolumeUp className="text-white text-xs" />
              )}
            </button>

            {/* Video Badge */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 border-l-4 border-primary">
              <span className="text-white text-[10px] font-medium tracking-wider">VIDEO TESTIMONIAL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
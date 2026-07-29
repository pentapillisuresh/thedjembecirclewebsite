'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaUser } from 'react-icons/fa';
import { getTestimonials } from '@/lib/storage';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const testimonials = getTestimonials();

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm px-6 py-2 mb-4 border-l-4 border-primary">
            <span className="text-primary text-sm font-semibold">✦ Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            What Our <span className="text-primary">Community Says</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            Real stories from real participants
          </p>
        </motion.div>

        <div className="mt-12 relative">
          {/* Main Testimonial Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-12 hover:border-primary/30 transition-all duration-500"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 border-l-4 border-primary">
                  <FaQuoteLeft className="text-3xl text-primary" />
                </div>
              </div>

              {/* Testimonial Content */}
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed text-center max-w-3xl mx-auto">
                "{testimonials[current].content}"
              </p>

              {/* Rating Stars */}
              <div className="flex justify-center mt-6 space-x-1">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <FaStar key={i} className="text-primary text-xl" />
                ))}
              </div>

              {/* User Info */}
              <div className="mt-8 flex items-center justify-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 border-2 border-primary/30 flex items-center justify-center text-2xl font-bold text-white">
                  {testimonials[current].name.charAt(0)}
                </div>
                <div className="text-left">
                  <h4 className="text-white font-bold text-lg">{testimonials[current].name}</h4>
                  <p className="text-gray-400 text-sm">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-3 bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 group"
            >
              <FaChevronLeft className="text-white group-hover:text-primary transition-colors duration-300" />
            </button>
            <button
              onClick={next}
              className="p-3 bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 group"
            >
              <FaChevronRight className="text-white group-hover:text-primary transition-colors duration-300" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`transition-all duration-300 ${
                  index === current 
                    ? 'w-8 h-1 bg-primary' 
                    : 'w-4 h-1 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">
              {current + 1} / {testimonials.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
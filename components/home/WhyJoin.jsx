'use client';
import { motion } from 'framer-motion';
import { FaHeart, FaUsers, FaMusic, FaStar, FaGem, FaLeaf, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

export default function WhyJoin() {
  const reasons = [
    { 
      icon: FaMusic, 
      title: 'Authentic Experience', 
      description: 'Immerse yourself in traditional drumming techniques passed down through generations.' 
    },
    { 
      icon: FaUsers, 
      title: 'Community Connection', 
      description: 'Meet like-minded people and build lasting friendships through the power of rhythm.' 
    },
    { 
      icon: FaHeart, 
      title: 'Wellness Benefits', 
      description: 'Experience the therapeutic effects of drumming - reduce stress and boost happiness.' 
    },
    { 
      icon: FaStar, 
      title: 'Expert Instructors', 
      description: 'Learn from master drummers with years of experience and international recognition.' 
    },
    { 
      icon: FaGem, 
      title: 'Unique Events', 
      description: 'Participate in exclusive drum circles, workshops, and special performances.' 
    },
    { 
      icon: FaLeaf, 
      title: 'Cultural Exchange', 
      description: 'Connect with diverse cultures through the universal language of music and rhythm.' 
    },
  ];

  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm px-6 py-2 mb-4 border-l-4 border-primary">
            <span className="text-primary text-sm font-semibold">✦ Why Join Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Why Join Our <span className="text-primary">Drum Circle</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            Discover the transformative power of rhythm and become part of our vibrant community
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group relative bg-white/5 border border-white/10 hover:border-primary/40 transition-all duration-500 p-8 hover:bg-white/10 hover:transform hover:-translate-y-2"
            >
              {/* Icon with animated background */}
              <div className="relative inline-block mb-5">
                <div className="absolute inset-0 bg-primary/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative text-primary text-4xl group-hover:scale-110 transition-transform duration-300">
                  <reason.icon />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">
                {reason.title}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {reason.description}
              </p>
              
              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500"></div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link 
            href="/register" 
            className="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30 group"
          >
            Join Our Community
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
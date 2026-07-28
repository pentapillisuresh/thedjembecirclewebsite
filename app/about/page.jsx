'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaUsers, FaCalendar, FaStar, FaArrowRight, FaDrum, FaMusic, FaHeart } from 'react-icons/fa';

export default function About() {
  const stats = [
    { icon: FaCalendar, value: '50+', label: 'Events Hosted' },
    { icon: FaUsers, value: '5,000+', label: 'Happy Participants' },
    { icon: FaStar, value: '10+', label: 'Master Drummers' },
    { icon: FaHeart, value: '98%', label: 'Satisfaction Rate' },
  ];

  const values = [
    {
      icon: FaDrum,
      title: 'Authentic Experience',
      description: 'We bring traditional drumming techniques and modern rhythms together for an authentic experience.'
    },
    {
      icon: FaUsers,
      title: 'Community First',
      description: 'Building connections through rhythm is at the heart of everything we do.'
    },
    {
      icon: FaMusic,
      title: 'Inclusive Environment',
      description: 'Everyone is welcome regardless of skill level, age, or background.'
    }
  ];

  return (
    <section className="bg-black min-h-screen">
      {/* Hero Banner */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <Image
          src="/images/banner1.jpg"
          alt="Djembe Circle Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center bg-white/5 backdrop-blur-sm px-6 py-2 mb-4 border-l-4 border-primary">
                <span className="text-primary text-sm font-semibold">✦ About Us</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white">
                The <span className="text-primary">Djembe Circle</span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                Where rhythm meets community
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 -mt-12 relative z-10"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center hover:border-primary/40 transition-all duration-300 hover:bg-white/10"
            >
              <stat.icon className="text-primary text-2xl mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* About Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our <span className="text-primary">Mission</span>
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Welcome to The Djembe Circle – where rhythm meets community. We are a premier drum event organization 
                dedicated to bringing the transformative power of drumming to people of all ages and backgrounds.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                Our mission is to create immersive drumming experiences that connect people, celebrate culture, 
                and promote well-being through the universal language of rhythm.
              </p>
              
              <div className="mt-8">
                <Link
                  href="/events"
                  className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30 group"
                >
                  Explore Events
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our <span className="text-primary">Values</span>
              </h2>
              <div className="space-y-4">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="border border-white/10 bg-white/5 p-6 hover:border-primary/30 transition-all duration-300 hover:bg-white/10"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/10 border-l-4 border-primary flex-shrink-0">
                        <value.icon className="text-primary text-xl" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{value.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{value.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 border border-white/10 bg-white/5 p-8 md:p-12 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed italic">
              "The Djembe Circle transformed my relationship with music and community. 
              Every session is a journey of discovery and connection."
            </p>
            <div className="mt-4">
              <p className="text-white font-semibold">— Sarah Johnson</p>
              <p className="text-gray-400 text-sm">Regular Participant</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaHeart, FaUsers, FaCalendar, FaStar } from 'react-icons/fa';

export default function About() {
  const features = [
    {
      icon: <FaHeart className="text-primary text-2xl" />,
      title: 'Passionate Community',
      description: 'Join a vibrant community of drumming enthusiasts from around the world.'
    },
    {
      icon: <FaUsers className="text-primary text-2xl" />,
      title: 'Expert Facilitators',
      description: 'Learn from experienced drumming facilitators who guide every session.'
    },
    {
      icon: <FaCalendar className="text-primary text-2xl" />,
      title: 'Regular Events',
      description: 'Weekly drum circles and special events throughout the year.'
    },
    {
      icon: <FaStar className="text-primary text-2xl" />,
      title: 'Inclusive Environment',
      description: 'All skill levels welcome - from beginners to advanced drummers.'
    }
  ];

  return (
    <section className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <a
            href="/about"
            className="inline-flex items-center bg-white/5 backdrop-blur-sm px-6 py-2 mb-6 border-l-4 border-primary hover:bg-white/10 transition-all duration-300"
          >
            <span className="text-primary text-sm font-semibold">✦ About Us</span>
          </a>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            The <span className="text-primary">Djembe Circle</span>
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Where rhythm meets community. We bring the transformative power of drumming to people of all ages and backgrounds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Our <span className="text-primary">Mission</span>
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                To create immersive drumming experiences that connect people, celebrate culture, 
                and promote well-being through the universal language of rhythm.
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Why <span className="text-primary">Join Us</span>
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Whether you're a beginner or an experienced drummer, our inclusive community 
                welcomes everyone. Experience the joy of collective rhythm-making in a supportive 
                and uplifting environment.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="p-4 bg-white/5 hover:bg-white/10 transition-all duration-300 border-l-4 border-primary/30 hover:border-primary"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">{feature.icon}</div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">{feature.title}</h4>
                      <p className="text-gray-400 text-xs mt-1">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Call to Action - Round button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <a
                href="/events"
                className="inline-flex items-center px-8 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30"
              >
                Discover Events
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* Right side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden border border-white/10">
              <Image
                src="/images/about.jpg"
                alt="Drumming Circle"
                width={600}
                height={500}
                className="object-cover w-full h-[500px] object-center"
                priority
              />
            </div>

            {/* Stats below image */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              {[
                { label: 'Events Hosted', value: '50+' },
                { label: 'Happy Members', value: '5K+' },
                { label: 'Countries', value: '15+' },
                { label: 'Satisfaction', value: '98%' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-center bg-white/5 p-4 hover:bg-white/10 transition-all duration-300 border-l-4 border-primary/30 hover:border-primary"
                >
                  <div className="text-white font-bold text-xl">{stat.value}</div>
                  <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
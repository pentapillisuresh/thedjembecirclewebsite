'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  FaDrumstickBite,
  FaHands,
  FaFire,
  FaMusic,
  FaCamera,
  FaDrum,
  FaArrowRight,
} from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';

export default function Highlights() {
  const [mainImage, setMainImage] = useState('/images/key1.jpg');

  const highlights = [
    {
      icon: FaDrum,
      title: 'We Provide Drums',
      description: 'We will give you drums, you also play with us! All equipment provided.',
    },
    {
      icon: FaDrumstickBite,
      title: 'Live Drumming',
      description: 'Experience the raw energy of live djembe performances.',
    },
    {
      icon: FaHands,
      title: 'Interactive Workshops',
      description: 'Learn drumming techniques with experienced instructors.',
    },
    {
      icon: FaFire,
      title: 'Bonfire Drum Circles',
      description: 'Enjoy magical evening drum circles around the bonfire.',
    },
    {
      icon: FaMusic,
      title: 'Guest Artists',
      description: 'Watch performances by internationally acclaimed drummers.',
    },
    {
      icon: FaCamera,
      title: 'Photo Opportunities',
      description: 'Capture unforgettable memories with professional photographers.',
    },
  ];

  const smallImages = [
    { id: 1, src: '/images/key1.jpg', alt: 'Main Event' },
    { id: 2, src: '/images/key2.jpg', alt: 'Drumming Session' },
    { id: 3, src: '/images/key3.jpg', alt: 'Workshop' },
  ];

  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm px-6 py-2 mb-4 border-l-4 border-primary">
            <span className="text-primary text-sm font-semibold">✦ Highlights</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Event <span className="text-primary">Highlights</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            Discover what makes every drum circle an unforgettable experience.
          </p>
        </motion.div>

        {/* Main Content - Left Image + Right Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Image Collage */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Image */}
            <motion.div
              key={mainImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden border border-white/10"
            >
              <Image
                src={mainImage}
                alt="Event Highlights"
                width={600}
                height={400}
                className="object-cover w-full h-[400px]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              {/* Floating badge on image */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/80 backdrop-blur-sm p-4 border-l-4 border-primary">
                  <p className="text-white font-bold text-lg">Drum Circle Experience</p>
                  <p className="text-gray-400 text-sm">Join our community</p>
                </div>
              </div>
            </motion.div>

            {/* 3 Small Images Below */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {smallImages.map((img) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: img.id * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  onClick={() => setMainImage(img.src)}
                  className={`relative overflow-hidden border transition-all duration-300 cursor-pointer ${
                    mainImage === img.src 
                      ? 'border-primary shadow-lg shadow-primary/20' 
                      : 'border-white/10 hover:border-primary/40'
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={200}
                    height={150}
                    className="object-cover w-full h-[120px] hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 transition-all duration-300 ${
                    mainImage === img.src 
                      ? 'bg-black/20' 
                      : 'bg-black/40 hover:bg-black/20'
                  }`}></div>
                  {mainImage === img.src && (
                    <div className="absolute inset-0 border-2 border-primary pointer-events-none"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Highlights List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  viewport={{ once: true }}
                  className={`group flex items-center space-x-4 bg-white/5 p-4 border-l-4 transition-all duration-300 hover:bg-white/10 cursor-pointer ${
                    index === 0 
                      ? 'border-primary/60 hover:border-primary bg-primary/5' 
                      : 'border-primary/30 hover:border-primary'
                  }`}
                >
                  <div className={`text-2xl group-hover:scale-110 transition-transform duration-300 text-primary`}>
                    <Icon />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold transition-colors duration-300 ${
                      index === 0 ? 'text-primary' : 'text-white group-hover:text-primary'
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${
                      index === 0 ? 'text-gray-200' : 'text-gray-400 group-hover:text-gray-300'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                  <FaArrowRight className={`transition-all duration-300 ${
                    index === 0 ? 'text-primary' : 'text-gray-600 group-hover:text-primary'
                  } group-hover:translate-x-1`} />
                </motion.div>
              );
            })}
          </motion.div>
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
            href="/events"
            className="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30 group"
          >
            View All Events
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
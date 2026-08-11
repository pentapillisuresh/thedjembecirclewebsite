'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPlay, FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Hero() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero images for carousel
  const slides = [
    {
      image: './images/banner1.JPG',
      alt: 'Drumming event'
    },
    {
      image: './images/banner2.JPG',
      alt: 'Djembe circle'
    },
    {
      image: './images/banner3.JPG',
      alt: 'Music festival'
    },
   
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* Carousel Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-primary w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content - Center aligned */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white">
            Feel the Rhythm{' '}
            <span className="text-primary">Join THE DJEMBE CIRCLE</span>
          </h1>

          <p className="mt-6 text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
            Experience the power of rhythm and connection through drumming. Book your spot now and let the music move you.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              href="/events"
              className="group relative px-8 py-4 rounded-full bg-primary text-white font-semibold text-sm transition-all duration-300 hover:bg-primary/80 hover:scale-105 shadow-lg shadow-primary/30 hover:shadow-primary/50"
            >
              <span className="flex items-center gap-2">
                Explore Events
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
            <button
              onClick={() => {
                const isLogin = localStorage.getItem("isLogin");
                if (isLogin) {
                  router.push('/booking');
                } else {
                  router.push('/login');
                }
              }}
              className="group relative px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold text-sm transition-all duration-300 hover:bg-white/20 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <FaPlay className="text-primary" />
                Book Now
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
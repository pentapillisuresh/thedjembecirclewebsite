'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaPlay, FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const slides = [
    {
      image: '/images/banner1.jpg',
      title: 'Feel the Rhythm',
      subtitle: 'Join the Circle',
      description: 'Experience the power of rhythm and connection through drumming. Book your spot now and let the music move you.'
    },
    {
      image: '/images/banner2.jpg',
      title: 'Drumming',
      subtitle: 'Community Experience',
      description: 'Immerse yourself in the transformative power of drumming and connect with a vibrant community of enthusiasts.'
    },
    {
      image: '/images/banner3.jpg',
      title: 'Live Performances',
      subtitle: 'Unforgettable Moments',
      description: 'Witness world-class drumming performances that will leave you inspired and energized.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image Carousel - Full height, no gradient */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/60" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="text-xl" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <FaChevronRight className="text-xl" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${index === currentSlide
              ? 'w-12 h-2 bg-primary'
              : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content - Center aligned */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white">
              {slides[currentSlide].title}{' '}
              <span className="text-primary">{slides[currentSlide].subtitle}</span>
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              {slides[currentSlide].description}
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
        </AnimatePresence>
      </div>
    </section>
  );
}
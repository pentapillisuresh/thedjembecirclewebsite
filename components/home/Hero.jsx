'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPlay, FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-black to-indigo-900">
      {/* Background Pattern/Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Decorative circles - works in all browsers */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

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

          <p className="mt-6 text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
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
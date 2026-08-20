'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaTicketAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none ${
        scrolled ? 'px-0 pt-0' : 'px-4 pt-4'
      }`}
    >
      <motion.div
        animate={{
          width: scrolled ? '100%' : '92%',
          borderRadius: scrolled ? 0 : 9999,
        }}
        transition={{
          layout: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          },
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`pointer-events-auto ${
          scrolled 
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/5 w-full' 
            : 'bg-black/80 backdrop-blur-md border border-white/10'
        }`}
      >
        <div className={`${scrolled ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' : 'px-4'}`}>
          <motion.div 
            className="flex justify-between items-center h-16 md:h-20"
          >
            {/* Logo with Image - FIXED: Added width/height auto for aspect ratio */}
            <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="relative"
              >
                <motion.div
                  animate={{
                    width: scrolled ? 38 : 50,
                    height: scrolled ? 38 : 50,
                  }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
                  className="relative"
                >
                  <Image
                    src="/images/logo.jpeg"
                    alt="Djembe Circle Logo"
                    width={50}
                    height={50}
                    className="object-contain"
                    style={{ width: 'auto', height: 'auto' }} // FIXED: Added for aspect ratio
                    priority
                  />
                </motion.div>
                <motion.div
                  className="absolute -inset-3 rounded-full bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="flex items-baseline"
              >
                <motion.span
                  animate={{
                    fontSize: scrolled ? '1rem' : '1.4rem',
                  }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
                  className="font-extrabold tracking-tight"
                >
                  <span className="text-white">DJEMBE</span>
                  <span className="text-primary">CIRCLE</span>
                </motion.span>
                {!scrolled && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                    className="ml-2 text-[10px] font-semibold text-primary/60 uppercase tracking-widest"
                  >
                    ✦ Live
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    className="relative px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300 font-medium text-sm group"
                  >
                    <span className="relative z-10">{item.name}</span>
                    <motion.span
                      className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                    />
                  </Link>
                </motion.div>
              ))}
              
              {/* Book Event Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="ml-4"
              >
                <Link
                  href="/booking" // FIXED: Changed from /book-event to /booking based on your folder structure
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-white hover:bg-primary/80 transition-all duration-300 font-medium text-sm hover:scale-105 transform shadow-lg shadow-primary/20"
                >
                  <FaTicketAlt className="text-sm" />
                  Book Event
                </Link>
              </motion.div>
            </nav>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              className="md:hidden text-white text-2xl p-2 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <motion.div
                animate={{ rotate: menuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {menuOpen ? <FaTimes /> : <FaBars />}
              </motion.div>
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ 
                duration: 0.4, 
                type: 'spring', 
                stiffness: 200, 
                damping: 25 
              }}
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 overflow-hidden rounded-b-2xl"
            >
              <div className="px-4 py-6 space-y-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Book Event Button */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                >
                  <Link
                    href="/booking" // FIXED: Changed from /book-event to /booking
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/80 transition-all duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaTicketAlt />
                    Book Event
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
}
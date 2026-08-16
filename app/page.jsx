'use client';

import { useState } from 'react';

import LandingVideo from '@/components/common/LandingVideo';

import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import UpcomingEvent from '@/components/home/UpcomingEvent';
import WhyJoin from '@/components/home/WhyJoin';
import Highlights from '@/components/home/Highlights';
import Gallery from '@/components/home/Gallery';
import Testimonials from '@/components/home/Testimonials';
import BlogSection from '@/components/home/BlogSection';
import FAQs from '@/components/home/FAQs';
import Contact from '@/components/home/Contact';
import Partner from '@/components/home/Partners';

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);

  const handleLandingComplete = () => {
    setShowLanding(false);
  };

  if (showLanding) {
    return (
      <LandingVideo
        onComplete={handleLandingComplete}
      />
    );
  }

  return (
    <>
      <Hero />
      <About />
      <UpcomingEvent />
      <WhyJoin />
      <Highlights />
      <Gallery />
      <Testimonials />
      <BlogSection />
      <FAQs />
      <Contact />
      <Partner />

      {/* Call + WhatsApp */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">

        {/* Call */}
        <a
          href="tel:+918520988496"
          className="relative group"
        >
          <span className="absolute inline-flex h-16 w-16 rounded-full bg-red-500 opacity-60 animate-ping" />

          <img
            src="/images/phone-call.png"
            alt="Call"
            className="relative w-16 h-16 object-contain hover:scale-110 transition-all duration-300"
          />
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/918520988496"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group"
        >
          <span className="absolute inline-flex h-16 w-16 rounded-full bg-green-500 opacity-60 animate-ping" />

          <img
            src="/images/whatsapp.png"
            alt="WhatsApp"
            className="relative w-16 h-16 object-contain hover:scale-110 transition-all duration-300"
          />
        </a>

      </div>
    </>
  );
}
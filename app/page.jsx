import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import UpcomingEvent from '@/components/home/UpcomingEvent';
import WhyJoin from '@/components/home/WhyJoin';
import Highlights from '@/components/home/Highlights';
import Gallery from '@/components/home/Gallery';
import Testimonials from '@/components/home/Testimonials';
import FAQs from '@/components/home/FAQs';
import Contact from '@/components/home/Contact';
import Partner from '@/components/home/Partners';
import BlogSection from '@/components/home/BlogSection';

export default function Home() {
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
       <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">

        {/* Call Button */}
        <a href="tel:+918520988496" className="relative group">
          <span className="absolute inline-flex h-16 w-16 rounded-full bg-red-500 opacity-60 animate-ping"></span>

          <img
            src="/images/phone-call.png"
            alt="Call"
            className="relative w-16 h-16 object-contain hover:scale-110 transition-all duration-300"
          />
        </a>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/918520988496"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group"
        >
          <span className="absolute inline-flex h-16 w-16 rounded-full bg-green-500 opacity-60 animate-ping"></span>

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
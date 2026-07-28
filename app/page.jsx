import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import UpcomingEvent from '@/components/home/UpcomingEvent';
import WhyJoin from '@/components/home/WhyJoin';
import Highlights from '@/components/home/Highlights';
import Gallery from '@/components/home/Gallery';
import Testimonials from '@/components/home/Testimonials';
import FAQs from '@/components/home/FAQs';
import Contact from '@/components/home/Contact';

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
      <FAQs />
      <Contact />
    </>
  );
}
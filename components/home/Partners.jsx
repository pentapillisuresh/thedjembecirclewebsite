'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

// Partner data - Only 4 with images, rest with text
const partnersData = [
  // Image partners (only 4)
  { id: 1, name: 'Kia', logo: '/images/kia.svg', alt: 'Kia Motors', hasImage: true },
  { id: 2, name: 'Tata', logo: '/images/tata.png', alt: 'Tata Group', hasImage: true },
  { id: 3, name: 'Genpact', logo: '/images/genpact.svg', alt: 'Genpact', hasImage: true },
  { id: 4, name: 'Uber', logo: '/images/uber.svg', alt: 'Uber', hasImage: true },
  
  // Text partners
  { id: 5, name: 'Microsoft', logo: null, alt: 'Microsoft', hasImage: false },
  { id: 6, name: 'ADP', logo: null, alt: 'ADP', hasImage: false },
  { id: 7, name: 'BNI', logo: null, alt: 'BNI', hasImage: false },
  { id: 8, name: 'Sattva', logo: null, alt: 'Sattva', hasImage: false },
  { id: 9, name: 'HLF', logo: null, alt: 'Hyderabad Literary Festival', hasImage: false },
  { id: 10, name: 'T-Hub', logo: null, alt: 'T-Hub', hasImage: false },
  { id: 11, name: 'Provet', logo: null, alt: 'Provet', hasImage: false },
  { id: 12, name: 'Cognizance', logo: null, alt: 'Cognizance', hasImage: false },
  { id: 13, name: 'Bilvantis', logo: null, alt: 'Bilvantis', hasImage: false },
  { id: 14, name: 'Convergence', logo: null, alt: 'Convergence', hasImage: false },
  { id: 15, name: 'Goethe Zentrum', logo: null, alt: 'Goethe Zentrum', hasImage: false },
  { id: 16, name: 'IHM', logo: null, alt: 'Institute of Hotel Management', hasImage: false },
  { id: 17, name: 'ISB', logo: null, alt: 'Indian School of Business', hasImage: false },
  { id: 18, name: 'ICFAI University', logo: null, alt: 'ICFAI University', hasImage: false },
  { id: 19, name: 'Imara School', logo: null, alt: 'Imara School', hasImage: false },
  { id: 20, name: 'Student Tribe', logo: null, alt: 'Student Tribe', hasImage: false },
  { id: 21, name: 'House of Gourmet', logo: null, alt: 'House of Gourmet', hasImage: false },
  { id: 22, name: 'Panchatantra', logo: null, alt: 'Panchatantra', hasImage: false },
  { id: 23, name: 'Navika', logo: null, alt: 'Navika', hasImage: false },
  { id: 24, name: 'Trailing IVY', logo: null, alt: 'Trailing IVY', hasImage: false },
  { id: 25, name: 'Zostel', logo: null, alt: 'Zostel', hasImage: false },
  { id: 26, name: 'Xena Brewery', logo: null, alt: 'Xena Brewery', hasImage: false },
  { id: 27, name: 'Aaromale', logo: null, alt: 'Aaromale', hasImage: false },
  { id: 28, name: 'Gaiaa', logo: null, alt: 'Gaiaa', hasImage: false },
  { id: 29, name: 'District 150', logo: null, alt: 'District 150', hasImage: false },
  { id: 30, name: 'Akaan', logo: null, alt: 'Akaan', hasImage: false },
  { id: 31, name: 'Xora', logo: null, alt: 'Xora', hasImage: false },
  { id: 32, name: 'Diablo', logo: null, alt: 'Diablo', hasImage: false },
  { id: 33, name: 'ITC Kohenur', logo: null, alt: 'ITC Kohenur', hasImage: false },
  { id: 34, name: 'Moonshine Project', logo: null, alt: 'Moonshine Project', hasImage: false },
  { id: 35, name: 'Metro Medley', logo: null, alt: 'World Music Day – Metro Medley', hasImage: false },
  { id: 36, name: "Earth's Camping", logo: null, alt: "Earth's Camping", hasImage: false },
  { id: 37, name: 'Kali Connects', logo: null, alt: 'Kali Connects', hasImage: false },
  { id: 38, name: 'Resonating Dharma', logo: null, alt: 'Resonating Dharma', hasImage: false },
  { id: 39, name: 'Advi Art Residency', logo: null, alt: 'Advi Art Residency', hasImage: false },
  { id: 40, name: 'Vegan Fest', logo: null, alt: 'Vegan Fest', hasImage: false },
];

// SVG Icons for stats
const CorporateIcon = () => (
  <svg className="w-5 h-5 text-primary mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const EducationIcon = () => (
  <svg className="w-5 h-5 text-primary mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
);

const CafeIcon = () => (
  <svg className="w-5 h-5 text-primary mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const FestivalIcon = () => (
  <svg className="w-5 h-5 text-primary mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

export default function Partners() {
  const [isHovered, setIsHovered] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      setScrollWidth(containerRef.current.scrollWidth / 2);
    }
  }, []);

  // Duplicate for seamless scrolling
  const displayPartners = [...partnersData, ...partnersData];

  return (
    <section className="py-12 bg-black border-t border-white/5 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-2">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm px-4 py-1.5 mb-2 border-l-4 border-primary">
            <span className="text-primary text-xs font-semibold tracking-wider">✦ OUR PARTNERS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Trusted By <span className="text-primary">Leading Brands</span>
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mt-2"></div>
          <p className="mt-2 text-sm text-gray-300 max-w-xl mx-auto">
            We partner with organizations that share our passion for community and rhythm
          </p>
        </motion.div>

        {/* Scrolling Partners */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={containerRef}
        >
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-black to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-black to-transparent z-10"></div>

          {/* Scrolling container */}
          <motion.div
            className="flex gap-6 py-4"
            animate={{
              x: isHovered ? 0 : [-scrollWidth, 0]
            }}
            transition={{
              x: {
                duration: 35,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
              }
            }}
            style={{ 
              width: 'fit-content',
              display: 'flex'
            }}
          >
            {displayPartners.map((partner, index) => (
              <motion.div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 w-36 h-20 bg-white/5 border-2 border-white/10 flex items-center justify-center p-3 hover:border-primary/60 hover:bg-white/10 transition-all duration-300 group"
                whileHover={{ scale: 1.08 }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  {partner.hasImage && partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.alt}
                      width={120}
                      height={60}
                      className="object-contain brightness-75 group-hover:brightness-100 transition-all duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'text-white text-xs font-bold text-center px-2';
                          fallback.textContent = partner.name;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="text-center px-2">
                      <p className="text-white font-bold text-xs group-hover:text-primary transition-colors duration-300">
                        {partner.name}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

       
      </div>
    </section>
  );
}
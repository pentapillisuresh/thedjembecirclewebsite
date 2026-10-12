 'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const partnersData = [
  // Companies
  { id: 1, name: 'Kia', logo: '/images/kia.svg', alt: 'Kia Motors', category: 'Companies' },
  { id: 2, name: 'Tata', logo: '/images/tata.png', alt: 'Tata Group', category: 'Companies' },
  { id: 3, name: 'Genpact', logo: '/images/genpact.svg', alt: 'Genpact', category: 'Companies' },
  { id: 4, name: 'Uber', logo: '/images/uber.svg', alt: 'Uber', category: 'Companies' },

  // Corporate Events & Offsites
  { id: 5, name: 'Microsoft', logo: '/images/microsoft.webp', alt: 'Microsoft', category: 'Corporate' },
  { id: 6, name: 'ADP', logo: '/images/adp.png', alt: 'ADP', category: 'Corporate' },
  { id: 7, name: 'BNI', logo: '/images/bni.png', alt: 'BNI', category: 'Corporate' },
  { id: 8, name: 'Sattva', logo: '/images/sattva.png', alt: 'Sattva', category: 'Corporate' },
  { id: 9, name: 'HLF', logo: '/images/hlf.png', alt: 'Hyderabad Literary Festival', category: 'Corporate' },
  { id: 10, name: 'T-Hub', logo: '/images/thub.png', alt: 'T-Hub', category: 'Corporate' },
  { id: 11, name: 'Provet', logo: '/images/provet.png', alt: 'Provet', category: 'Corporate' },
  { id: 12, name: 'Cognizance', logo: '/images/congizance.png', alt: 'Cognizance', category: 'Corporate' },
  { id: 13, name: 'Bilvantis', logo: '/images/bilvantis.avif', alt: 'Bilvantis', category: 'Corporate' },
  { id: 14, name: 'Convergence', logo: '/images/convergence.png', alt: 'Convergence', category: 'Corporate' },
  { id: 15, name: 'Goethe Zentrum', logo: '/images/goethe-institut.png', alt: 'Goethe Zentrum', category: 'Corporate' },

  // Educational Institutions
  { id: 16, name: 'IHM', logo: '/images/ihmi.png', alt: 'Institute of Hotel Management', category: 'Education' },
  { id: 17, name: 'ISB', logo: '/images/isb.jpeg', alt: 'Indian School of Business', category: 'Education' },
  { id: 18, name: 'ICFAI University', logo: '/images/icfai.png', alt: 'ICFAI University', category: 'Education' },
  { id: 19, name: 'Imara School', logo: '/images/imara.jpeg', alt: 'Imara School', category: 'Education' },
  { id: 20, name: 'Student Tribe', logo: '/images/st.png', alt: 'Student Tribe', category: 'Education' },

  // Cafés & Creative Spaces
  { id: 21, name: 'House of Gourmet', logo: '/images/house.jpeg', alt: 'House of Gourmet', category: 'Cafés & Spaces' },
  { id: 22, name: 'Panchatantra', logo: '/images/panchatantra.avif', alt: 'Panchatantra', category: 'Cafés & Spaces' },
  { id: 23, name: 'Navika', logo: '/images/navika.jpeg', alt: 'Navika', category: 'Cafés & Spaces' },
  { id: 24, name: 'Trailing IVY', logo: '/images/trailing.jpg', alt: 'Trailing IVY', category: 'Cafés & Spaces' },
  { id: 25, name: 'Zostel', logo: '/images/zostel.png', alt: 'Zostel', category: 'Cafés & Spaces' },
  { id: 26, name: 'Xena Brewery', logo: '/images/xena.jpg', alt: 'Xena Brewery', category: 'Cafés & Spaces' },
  { id: 27, name: 'Aaromale', logo: '/images/aaromale.jpg', alt: 'Aaromale', category: 'Cafés & Spaces' },
  { id: 28, name: 'Gaiaa', logo: '/images/gaiga.jpg', alt: 'Gaiaa', category: 'Cafés & Spaces' },
  { id: 29, name: 'District 150', logo: '/images/district.jpg', alt: 'District 150', category: 'Cafés & Spaces' },
  { id: 30, name: 'Akaan', logo: '/images/akan.jpg', alt: 'Akaan', category: 'Cafés & Spaces' },
  { id: 31, name: 'Xora', logo: '/images/xora.jpeg', alt: 'Xora', category: 'Cafés & Spaces' },
  { id: 32, name: 'Diablo', logo: '/images/diablo.jpg', alt: 'Diablo', category: 'Cafés & Spaces' },
  { id: 33, name: 'ITC Kohenur', logo: '/images/itc.jpg', alt: 'ITC Kohenur', category: 'Cafés & Spaces' },
  { id: 34, name: 'Moonshine Project', logo: '/images/moonshine.jpg', alt: 'Moonshine Project', category: 'Cafés & Spaces' },

  // Festivals, Retreats & Community Events
  { id: 35, name: 'Metro Medley', logo: '/images/metro-medley.svg', alt: 'World Music Day – Metro Medley', category: 'Festivals' },
  { id: 36, name: "Earth's Camping", logo: '/images/earths-camping.svg', alt: "Earth's Camping", category: 'Festivals' },
  { id: 37, name: 'Kali Connects', logo: '/images/kali-connects.svg', alt: 'Kali Connects', category: 'Festivals' },
  { id: 38, name: 'Resonating Dharma', logo: '/images/resonating-dharma.svg', alt: 'Resonating Dharma', category: 'Festivals' },
  { id: 39, name: 'Advi Art Residency', logo: '/images/advi-art-residency.svg', alt: 'Advi Art Residency', category: 'Festivals' },
  { id: 40, name: 'Vegan Fest', logo: '/images/vegan-fest.svg', alt: 'Vegan Fest', category: 'Festivals' },
];

const categories = [
  { label: 'All Partners', count: 40 },
  { label: 'Companies', count: 4 },
  { label: 'Corporate', count: 11 },
  { label: 'Education', count: 5 },
  { label: 'Cafés & Spaces', count: 14 },
  { label: 'Festivals', count: 6 },
];

export default function Partners() {
  const [activeCategory, setActiveCategory] = useState('All Partners');
  const [failedLogos, setFailedLogos] = useState([]);

  const filteredPartners =
    activeCategory === 'All Partners'
      ? partnersData
      : partnersData.filter(
          (partner) => partner.category === activeCategory
        );

  const handleLogoError = (id) => {
    setFailedLogos((current) =>
      current.includes(id) ? current : [...current, id]
    );
  };

  return (
    <section
      id="partners"
      className="relative overflow-hidden border-y border-white/10 bg-black px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-[1600px]">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 text-center sm:mb-14"
        >
          <div className="mb-5 inline-flex items-center border-l-4 border-primary bg-white/5 px-5 py-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">
              ✦ Our Partners
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            Trusted By{' '}
            <span className="text-primary">Leading Brands</span>
          </h2>

          <div className="mx-auto mt-4 h-1 w-16 bg-primary" />

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
            We partner with exceptional organizations, institutions and
            creative communities to create unforgettable experiences.
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-10 sm:gap-3">
          {categories.map((category) => {
            const isActive = activeCategory === category.label;

            return (
              <button
                key={category.label}
                type="button"
                onClick={() => setActiveCategory(category.label)}
                aria-pressed={isActive}
                className={`border px-4 py-2.5 text-xs font-semibold transition-all duration-300 sm:px-5 sm:text-sm ${
                  isActive
                    ? 'border-primary bg-primary text-black'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-primary hover:text-primary'
                }`}
              >
                {category.label}
                <span
                  className={`ml-2 text-[10px] ${
                    isActive ? 'text-black/70' : 'text-gray-500'
                  }`}
                >
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Static Partners Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredPartners.map((partner, index) => {
              const hasFailed = failedLogos.includes(partner.id);

              return (
                <motion.div
                  layout
                  key={partner.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: 0.3,
                    delay: (index % 8) * 0.025,
                  }}
                  whileHover={{ y: -4 }}
                  className="group relative flex h-[112px] min-w-0 items-center justify-center overflow-hidden border border-white/10 bg-white/5 p-3 transition-colors duration-300 hover:border-primary/70 hover:bg-white/10 sm:h-[125px] sm:p-4"
                >
                  {/* Corner Accents */}
                  <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-transparent transition-colors duration-300 group-hover:border-primary" />

                  <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-transparent transition-colors duration-300 group-hover:border-primary" />

                  {/* Logo */}
                  {!hasFailed ? (
                    <Image
                      src={partner.logo}
                      alt={partner.alt}
                      width={180}
                      height={90}
                      sizes="(max-width: 639px) 42vw, (max-width: 767px) 28vw, (max-width: 1023px) 22vw, (max-width: 1279px) 15vw, 12vw"
                      className="h-[58px] w-full object-contain opacity-80 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 sm:h-[68px]"
                      onError={() => handleLogoError(partner.id)}
                    />
                  ) : (
                    <span className="break-words text-center text-sm font-bold text-white transition-colors duration-300 group-hover:text-primary sm:text-base">
                      {partner.name}
                    </span>
                  )}

                  {/* Orange Hover Line */}
                  <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-1/2" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-10 flex items-center justify-center gap-4 sm:mt-14"
        >
          <span className="h-px w-10 bg-white/20" />
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
            {filteredPartners.length} Partners
          </p>
          <span className="h-px w-10 bg-white/20" />
        </motion.div>

      </div>
    </section>
  );
}
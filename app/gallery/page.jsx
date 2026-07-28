'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaImage, FaArrowRight, FaCamera, FaVideo, FaHeart, FaShare } from 'react-icons/fa';
import ApiService from "../../services/api"

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await ApiService.getGallery();
        if (data.success && Array.isArray(data.data)) {
          const activeItems = data.data.filter(item => item.isActive !== false);
          const mapped = activeItems.map(item => ({
            id: item.id,
            type: item.mediaType,
            title: item.caption || 'Untitled',
            image: item.mediaUrl,
          }));
          setItems(mapped);
        } else {
          setError('Unexpected API response');
        }
      } catch (err) {
        console.error('Gallery fetch error:', err);
        setError('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);
  // Loading state
  if (loading) {
    return (
      <section className="min-h-screen bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse text-center">
            <div className="h-12 w-64 bg-gray-700 rounded mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-gray-700 rounded mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-video bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error or empty state
  if (error || items.length === 0) {
    return (
      <div style={{marginTop:200}}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-full"
      >
        <div className="text-7xl mb-6">🎵</div>
        <h3 className="text-2xl font-bold text-white mb-2">No gallery Found</h3>
        <p className="text-gray-400 text-lg">{error}</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
      </motion.div>
    </div>
    );
  }

  // Renders the main component with dynamic items
  return (
    <section className="min-h-screen bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 blur-3xl"></div>

      {/* Hero Banner */}
      <div className="relative w-full h-[400px] overflow-hidden bg-black">
        <Image
          src="/images/banner1.jpg"
          alt="Gallery Banner"
          fill
          className="object-cover"
          priority
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-2 mb-6 border-l-4 border-primary rounded-full">
                <FaCamera className="text-primary mr-2" />
                <span className="text-primary text-sm font-semibold tracking-wider">GALLERY</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                Our <span className="text-primary">Gallery</span>
              </h1>
              <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                Memories from our drum circles and events
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          <div className="text-center bg-white/5 px-6 py-3 border border-white/10 rounded-full">
            <div className="text-2xl font-bold text-primary">{items.length}</div>
            <div className="text-sm text-gray-400">Total Media</div>
          </div>
          <div className="text-center bg-white/5 px-6 py-3 border border-white/10 rounded-full">
            <div className="text-2xl font-bold text-primary">
              {items.filter(i => i.type === 'image').length}
            </div>
            <div className="text-sm text-gray-400">Photos</div>
          </div>
          <div className="text-center bg-white/5 px-6 py-3 border border-white/10 rounded-full">
            <div className="text-2xl font-bold text-primary">
              {items.filter(i => i.type === 'video').length}
            </div>
            <div className="text-sm text-gray-400">Videos</div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative border border-white/10 bg-white/5 hover:border-primary/40 transition-all duration-500 overflow-hidden hover:-translate-y-2"
            >
              <div className="relative aspect-video bg-black overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className={`object-cover transition-transform duration-700 ${hoveredIndex === index ? 'scale-110' : 'scale-100'
                      }`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-500/10">
                    <span className="text-6xl">{item.type === 'video' ? '🎬' : '🖼️'}</span>
                  </div>
                )}

                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-300 text-sm flex items-center">
                      {item.type === 'video' ? (
                        <>
                          <FaVideo className="text-primary mr-2" />
                          Video
                        </>
                      ) : (
                        <>
                          <FaImage className="text-primary mr-2" />
                          Photo
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Video Play Button */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
                    >
                      <FaPlay className="text-white text-xl ml-1" />
                    </motion.div>
                  </div>
                )}

                {/* Badge */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 border-l-4 border-primary rounded-full">
                  <span className="text-xs text-white font-medium flex items-center gap-1">
                    {item.type === 'video' ? (
                      <>
                        <FaVideo className="text-primary" />
                        VIDEO
                      </>
                    ) : (
                      <>
                        <FaImage className="text-primary" />
                        PHOTO
                      </>
                    )}
                  </span>
                </div>

                {/* Hover actions */}
                <div className={`absolute top-4 left-4 flex space-x-2 transition-opacity duration-500 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}>
                  <button className="p-2 bg-black/60 backdrop-blur-sm border border-white/10 hover:border-primary/40 rounded-full transition-all duration-300">
                    <FaHeart className="text-gray-400 hover:text-red-500 transition-colors duration-300" />
                  </button>
                  <button className="p-2 bg-black/60 backdrop-blur-sm border border-white/10 hover:border-primary/40 rounded-full transition-all duration-300">
                    <FaShare className="text-gray-400 hover:text-white transition-colors duration-300" />
                  </button>
                </div>
              </div>

              {/* Title visible on hover */}
              <div className="p-4">
                <h3 className="text-white font-semibold group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                  {item.type === 'video' ? (
                    <>
                      <FaVideo className="text-primary text-xs" />
                      Video
                    </>
                  ) : (
                    <>
                      <FaImage className="text-primary text-xs" />
                      Photo
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-10 rounded-full">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full border border-primary/30">
                <FaCamera className="text-3xl text-primary" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Want to See More?
            </h3>
            <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
              Follow us on social media for more photos and videos from our events
            </p>
            <Link
              href="https://www.instagram.com/thedjembecircle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30 rounded-full group"
            >
              <span>Follow on Instagram</span>
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
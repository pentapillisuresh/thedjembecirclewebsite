'use client';
import { motion } from 'framer-motion';
import { FaPlay, FaArrowRight, FaImage, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ApiService from "../../services/api"

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef({});

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await ApiService.getGallery();
        // Assuming API returns { success: true, data: [...] }
        if (data.success && data.data) {
          // Filter only active items (already done by API, but safe)
          const activeItems = data.data.filter(item => item.isActive !== false);
          setGalleryItems(activeItems);
        } else {
          setError('No gallery items found');
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
  const toggleVideo = (index) => {
    if (playingVideo === index) {
      if (videoRefs.current[index]) {
        videoRefs.current[index].pause();
      }
      setPlayingVideo(null);
    } else {
      // Pause all other videos
      Object.keys(videoRefs.current).forEach((key) => {
        if (videoRefs.current[key]) {
          videoRefs.current[key].pause();
        }
      });
      // Play selected
      if (videoRefs.current[index]) {
        videoRefs.current[index].play();
        videoRefs.current[index].muted = isMuted;
      }
      setPlayingVideo(index);
    }
  };

  const toggleMute = (index, e) => {
    e.stopPropagation();
    if (videoRefs.current[index]) {
      const newMutedState = !videoRefs.current[index].muted;
      videoRefs.current[index].muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  // Build the items array from API data
  const items = galleryItems.map((item) => ({
    type: item.mediaType, // 'image' or 'video'
    title: item.caption || (item.event ? `Event: ${item.event.title}` : 'Gallery'),
    image: item.mediaUrl, // full URL or relative path
    id: item.id,
    // extra fields if needed
  }));

  if (loading) {
    return (
      <section className="py-20 px-4 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-12 w-64 bg-gray-700 rounded mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-gray-700 rounded mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || items.length === 0) {
    return (
      <section className="py-20 px-4 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-lg">{error || 'No gallery items available.'}</p>
          <p className="text-gray-500 mt-2">Check back later for updates.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm px-6 py-2 mb-4 border-l-4 border-primary">
            <span className="text-primary text-sm font-semibold">✦ Gallery</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Photo & Video <span className="text-primary">Gallery</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            Moments from our drum circles and events
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative overflow-hidden border border-white/10 hover:border-primary/40 transition-all duration-500 bg-white/5 cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden">
                {item.type === 'video' ? (
                  <>
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={`http://localhost:3001/${item.mediaUrl}`}
                      className="w-full h-full object-cover"
                      loop
                      playsInline
                    />
                    {playingVideo !== index && (
                      <div className="absolute inset-0 bg-black/30"></div>
                    )}
                  </>
                ) : (
                  <Image
                    src={`http://localhost:3001/${item.mediaUrl}`}
                    alt={item.title}
                    fill
                    className={`object-cover transition-transform duration-700 ${
                      hoveredIndex === index ? 'scale-110' : 'scale-100'
                    }`}
                  />
                )}
                
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${
                  hoveredIndex === index || playingVideo === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-300 text-sm flex items-center">
                      {item.type === 'video' ? (
                        <>
                          <FaPlay className="text-primary mr-2" />
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

                {/* Video Play/Pause Button */}
                {item.type === 'video' && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    onClick={() => toggleVideo(index)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 cursor-pointer"
                    >
                      {playingVideo === index ? (
                        <FaPause className="text-white text-xl" />
                      ) : (
                        <FaPlay className="text-white text-xl ml-1" />
                      )}
                    </motion.div>
                  </div>
                )}

                {/* Mute/Unmute Button for Videos */}
                {item.type === 'video' && playingVideo === index && (
                  <div 
                    className="absolute bottom-20 right-4 z-10"
                    onClick={(e) => toggleMute(index, e)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:border-primary/40 transition-all duration-300 cursor-pointer"
                    >
                      {isMuted ? (
                        <FaVolumeMute className="text-white text-sm" />
                      ) : (
                        <FaVolumeUp className="text-white text-sm" />
                      )}
                    </motion.div>
                  </div>
                )}

                {/* Badge */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 border-l-4 border-primary">
                  <span className="text-xs text-white font-medium">
                    {item.type === 'video' ? '🎥 VIDEO' : '📸 PHOTO'}
                  </span>
                </div>

                {/* Title visible on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/gallery"
            className="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30 group"
          >
            View Full Gallery
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
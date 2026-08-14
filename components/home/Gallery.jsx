'use client';
import { motion } from 'framer-motion';
import { FaPlay, FaArrowRight, FaImage, FaPause, FaVolumeUp, FaVolumeMute, FaCamera, FaVideo, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ApiService from "../../services/api";

// Helper function to get full media URL
const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('/uploads/')) {
    const baseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const cleanBaseUrl = baseUrl.replace('/api', '');
    return `${cleanBaseUrl}${path}`;
  }
  return path;
};

// Helper to get thumbnail from video URL
const getVideoThumbnail = (videoUrl) => {
  // If video URL is available, we can use it as poster
  // Or we can generate a thumbnail using a service
  return videoUrl;
};

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const videoRefs = useRef({});
  const [stats, setStats] = useState({ total: 0, images: 0, videos: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const eventsData = await ApiService.getEvents({ limit: 100 });
        if (eventsData.success) {
          const eventList = eventsData.data?.events || eventsData.data || [];
          setEvents(eventList);
        }

        await fetchGalleryItems(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchGalleryItems = async (eventId) => {
    try {
      setLoading(true);
      let data;
      
      if (eventId) {
        data = await ApiService.getEventGallery(eventId);
      } else {
        data = await ApiService.getGallery({ eventId: 'all' });
      }
      
      if (data.success && Array.isArray(data.data)) {
        const activeItems = data.data.filter(item => item.isActive !== false);
        
        const mappedItems = activeItems.map((item) => ({
          id: item.id,
          type: item.mediaType,
          title: item.caption || (item.event ? `Event: ${item.event.title}` : 'Gallery'),
          image: getMediaUrl(item.mediaUrl),
          eventId: item.eventId,
          event: item.event,
          isActive: item.isActive,
        }));
        
        setGalleryItems(mappedItems);
        
        const images = mappedItems.filter(i => i.type === 'image').length;
        const videos = mappedItems.filter(i => i.type === 'video').length;
        setStats({
          total: mappedItems.length,
          images,
          videos,
        });
      } else {
        setError('No gallery items found');
        setGalleryItems([]);
      }
    } catch (err) {
      console.error('Gallery fetch error:', err);
      setError('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  const handleEventFilter = (eventId) => {
    setSelectedEventId(eventId);
    fetchGalleryItems(eventId);
  };

  const handleVideoClick = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (playingVideo === index) {
      video.pause();
      setPlayingVideo(null);
    } else {
      Object.keys(videoRefs.current).forEach((key) => {
        if (videoRefs.current[key] && key !== index) {
          videoRefs.current[key].pause();
        }
      });
      
      video.play().catch(err => {
        console.error('Video play error:', err);
      });
      video.muted = isMuted;
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

  // Loading state
  if (loading) {
    return (
      <section className="py-20 px-4 bg-black relative overflow-hidden min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-12 w-64 bg-gray-700 rounded mx-auto mb-4"></div>
              <div className="h-6 w-96 bg-gray-700 rounded mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-800 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error or empty state
  if (error && galleryItems.length === 0) {
    return (
      <section className="py-20 px-4 bg-black relative overflow-hidden min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center bg-white/5 backdrop-blur-sm px-6 py-2 mb-4 border-l-4 border-primary rounded-full"
            >
              <FaCamera className="text-primary mr-2" />
              <span className="text-primary text-sm font-semibold">✦ GALLERY</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">
              Photo & Video <span className="text-primary">Gallery</span>
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
            <div className="mt-12 border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Gallery Items Found</h3>
              <p className="text-gray-400 text-lg">{error || 'No media items available'}</p>
              <p className="text-gray-500 text-sm mt-2">Check back later for updates</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden min-h-screen">
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
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm px-6 py-2 mb-4 border-l-4 border-primary rounded-full">
            <FaCamera className="text-primary mr-2" />
            <span className="text-primary text-sm font-semibold">✦ GALLERY</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Photo & Video <span className="text-primary">Gallery</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            Moments from our drum circles and events
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="bg-white/5 px-6 py-3 border border-white/10 rounded-full">
              <span className="text-2xl font-bold text-primary">{stats.total}</span>
              <span className="text-gray-400 ml-2">Total</span>
            </div>
            <div className="bg-white/5 px-6 py-3 border border-white/10 rounded-full">
              <span className="text-2xl font-bold text-primary">{stats.images}</span>
              <span className="text-gray-400 ml-2">Photos</span>
            </div>
            <div className="bg-white/5 px-6 py-3 border border-white/10 rounded-full">
              <span className="text-2xl font-bold text-primary">{stats.videos}</span>
              <span className="text-gray-400 ml-2">Videos</span>
            </div>
          </div>
        </motion.div>

        {/* Event Filter */}
        {events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleEventFilter(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedEventId === null
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <FaCamera className="inline mr-2" />
                All Gallery
              </button>
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => handleEventFilter(event.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedEventId === event.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  <FaCalendarAlt className="inline mr-2" />
                  {event.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}

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
                      src={item.image}
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
                    src={item.image}
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

                  {/* Event Badge */}
                  {item.event && item.type !== 'video' && (
                    <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1 border-l-4 border-primary rounded-full">
                      <span className="text-xs text-white font-medium flex items-center gap-1">
                        <FaCalendarAlt className="text-primary" />
                        {item.event.title}
                      </span>
                    </div>
                  )}

                  {/* Image Badge for photos */}
                  {item.type === 'image' && (
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 border-l-4 border-primary rounded-full">
                      <span className="text-xs text-white font-medium flex items-center gap-1">
                        <FaImage className="text-primary" />
                        PHOTO
                      </span>
                    </div>
                  )}

                  {/* Hover actions */}
                  <div className={`absolute top-4 left-4 flex space-x-2 transition-opacity duration-500 ${
                    hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <button className="p-2 bg-black/60 backdrop-blur-sm border border-white/10 hover:border-primary/40 rounded-full transition-all duration-300">
                      <svg className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button className="p-2 bg-black/60 backdrop-blur-sm border border-white/10 hover:border-primary/40 rounded-full transition-all duration-300">
                      <svg className="w-4 h-4 text-gray-400 hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>

                  {/* Title visible on hover (bottom) */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-white font-semibold text-sm line-clamp-1">{item.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl text-white font-semibold mb-2">No items for this event</h3>
            <p className="text-gray-400">Select a different event or view all gallery</p>
          </div>
        )}

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            href="/gallery"
            className="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30 rounded-full group"
          >
            <span>View Full Gallery</span>
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
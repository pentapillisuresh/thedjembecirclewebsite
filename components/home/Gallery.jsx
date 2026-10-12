
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlay,
  FaArrowRight,
  FaImage,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaCamera,
  FaVideo,
  FaCalendarAlt,
} from 'react-icons/fa';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ApiService from '../../services/api';

// Helper function to get full media URL
const getMediaUrl = (path) => {
  if (!path) return '';

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/uploads/')) {
    const baseUrl =
      process.env.NEXT_PUBLIC_MEDIA_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:3001';

    const cleanBaseUrl = baseUrl.replace('/api', '');
    return `${cleanBaseUrl}${path}`;
  }

  return path;
};

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  // UI state for the 3D carousel
  const [activeSlide, setActiveSlide] = useState(0);

  const videoRefs = useRef({});

  const [stats, setStats] = useState({
    total: 0,
    images: 0,
    videos: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const eventsData = await ApiService.getEvents({ limit: 100 });

        if (eventsData.success && eventsData.data) {
          const eventList =
            eventsData.data.events || eventsData.data || [];

          setEvents(eventList);
        }

        await fetchGalleryItems(selectedEventId);
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
      setError(null);

      let data;

      if (eventId) {
        data = await ApiService.getEventGallery(eventId);
      } else {
        data = await ApiService.getGallery({ eventId: 'all' });
      }

      if (data.success && Array.isArray(data.data)) {
        const activeItems = data.data.filter(
          (item) => item.isActive !== false
        );

        const mappedItems = activeItems.map((item) => ({
          id: item.id,
          type: item.mediaType,
          title:
            item.caption ||
            (item.event ? `Event: ${item.event.title}` : 'Gallery'),
          image: getMediaUrl(item.mediaUrl),
          eventId: item.eventId,
          event: item.event,
          isActive: item.isActive,
        }));

        setGalleryItems(mappedItems);

        // Keep the original four-item display limit
        const firstFour = mappedItems.slice(0, 4);
        setDisplayItems(firstFour);

        // Reset carousel position when the gallery changes
        setActiveSlide(0);
        setPlayingVideo(null);

        const images = mappedItems.filter(
          (item) => item.type === 'image'
        ).length;

        const videos = mappedItems.filter(
          (item) => item.type === 'video'
        ).length;

        setStats({
          total: mappedItems.length,
          images,
          videos,
        });
      } else {
        setError('No gallery items found');
        setGalleryItems([]);
        setDisplayItems([]);
        setActiveSlide(0);
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

  // Existing video playback logic
  const toggleVideo = (index) => {
    if (playingVideo === index) {
      if (videoRefs.current[index]) {
        videoRefs.current[index].pause();
      }

      setPlayingVideo(null);
    } else {
      Object.keys(videoRefs.current).forEach((key) => {
        if (videoRefs.current[key]) {
          videoRefs.current[key].pause();
        }
      });

      if (videoRefs.current[index]) {
        videoRefs.current[index].play().catch((err) => {
          console.error('Video play error:', err);
        });

        videoRefs.current[index].muted = isMuted;
      }

      setPlayingVideo(index);
    }
  };

  // Existing mute/unmute logic
  const toggleMute = (index, e) => {
    e.stopPropagation();

    if (videoRefs.current[index]) {
      const newMutedState = !videoRefs.current[index].muted;

      videoRefs.current[index].muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  // Carousel navigation
  const prevSlide = () => {
    if (!displayItems.length) return;

    setActiveSlide(
      (previous) =>
        (previous - 1 + displayItems.length) % displayItems.length
    );
  };

  const nextSlide = () => {
    if (!displayItems.length) return;

    setActiveSlide(
      (previous) => (previous + 1) % displayItems.length
    );
  };

  // Loading state
  if (loading) {
    return (
      <section className="relative min-h-[500px] overflow-hidden bg-black px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 animate-pulse text-center">
            <div className="mx-auto mb-4 h-4 w-32 bg-white/10" />
            <div className="mx-auto mb-4 h-10 w-64 bg-white/10" />
            <div className="mx-auto h-4 w-72 max-w-full bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="aspect-[3/4] animate-pulse bg-white/5"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error or empty state
  if (error && displayItems.length === 0) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-black px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 inline-flex items-center border-l-4 border-primary bg-white/5 px-4 py-2"
            >
              <FaCamera className="mr-2 text-xs text-primary" />
              <span className="text-xs font-semibold text-primary">
                GALLERY
              </span>
            </motion.div>

            <h2 className="text-3xl font-extrabold text-white md:text-5xl">
              Photo & Video <span className="text-primary">Gallery</span>
            </h2>

            <div className="mx-auto mt-4 h-0.5 w-16 bg-primary" />

            <div className="mx-auto mt-10 max-w-lg border border-white/10 bg-white/[0.03] p-8">
              <FaCamera className="mx-auto mb-4 text-3xl text-primary" />

              <h3 className="text-xl font-bold text-white">
                No Gallery Items Found
              </h3>

              <p className="mt-3 text-sm text-gray-400">
                {error || 'No media items available'}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Check back later for updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-4 py-16 text-white sm:py-20 lg:py-24">

      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-primary/[0.07] blur-[100px]" />

        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-primary/[0.05] blur-[100px]" />

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.035] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-16"
        >
          <div className="mb-4 inline-flex items-center border-l-4 border-primary bg-white/[0.04] px-5 py-2.5">
            <FaCamera className="mr-2 text-sm text-primary" />

            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Our Gallery
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            Photo & Video <span className="text-primary">Gallery</span>
          </h2>

          <div className="mx-auto mt-5 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-primary" />
            <div className="h-2 w-2 bg-primary" />
            <div className="h-px w-10 bg-primary" />
          </div>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
            Moments from our drum circles and events, captured
            through the universal language of rhythm.
          </p>

          {/* Statistics */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { value: stats.total, label: 'Total' },
              { value: stats.images, label: 'Photos' },
              { value: stats.videos, label: 'Videos' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-white/10 bg-white/[0.035] px-5 py-3 transition-all duration-300 hover:border-primary/40"
              >
                <span className="text-xl font-bold text-primary">
                  {stat.value}
                </span>

                <span className="ml-2 text-xs text-gray-400">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Event filter - existing functionality */}
        {events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleEventFilter(null)}
                className={`border px-4 py-2 text-xs font-medium transition-all duration-300 ${
                  selectedEventId === null
                    ? 'border-primary bg-primary text-white'
                    : 'border-white/10 bg-white/[0.03] text-gray-400 hover:border-primary/40 hover:text-white'
                }`}
              >
                <FaCamera className="mr-2 inline text-[10px]" />
                All
              </button>

              {events.map((event) => (
                <button
                  type="button"
                  key={event.id}
                  onClick={() => handleEventFilter(event.id)}
                  className={`border px-4 py-2 text-xs font-medium transition-all duration-300 ${
                    selectedEventId === event.id
                      ? 'border-primary bg-primary text-white'
                      : 'border-white/10 bg-white/[0.03] text-gray-400 hover:border-primary/40 hover:text-white'
                  }`}
                >
                  <FaCalendarAlt className="mr-2 inline text-[10px]" />
                  {event.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 3D Carousel */}
        {displayItems.length > 0 ? (
          <>
            <div
              className="relative mx-auto h-[390px] w-full max-w-6xl sm:h-[470px] lg:h-[530px]"
              style={{ perspective: '1600px' }}
            >
              {/* Subtle carousel floor glow */}
              <div className="pointer-events-none absolute bottom-5 left-1/2 h-20 w-3/4 -translate-x-1/2 rounded-full bg-primary/[0.08] blur-3xl" />

              {displayItems.map((item, index) => {
                let offset = index - activeSlide;

                if (offset > 2) offset -= displayItems.length;
                if (offset < -2) offset += displayItems.length;

                const isActive = offset === 0;
                const isVisible = Math.abs(offset) <= 2;

                const x = offset * 230;
                const rotate = -offset * 30;
                const scale = isActive ? 1 : Math.abs(offset) === 1 ? 0.82 : 0.68;
                const opacity = isVisible
                  ? isActive
                    ? 1
                    : Math.abs(offset) === 1
                      ? 0.85
                      : 0.45
                  : 0;

                return (
                  <motion.article
                    key={item.id || index}
                    initial={false}
                    animate={{
                      x,
                      rotateY: rotate,
                      scale,
                      opacity,
                      z: isActive ? 100 : -Math.abs(offset) * 100,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      translateX: '-50%',
                      translateY: '-50%',
                      transformOrigin: 'center center',
                      zIndex: isActive ? 30 : 20 - Math.abs(offset),
                      pointerEvents: isVisible ? 'auto' : 'none',
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => {
                      if (offset === 1) nextSlide();
                      else if (offset === -1) prevSlide();
                    }}
                    className="group absolute left-1/2 top-1/2 h-[310px] w-[220px] cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#101010] p-2 shadow-[0_25px_70px_rgba(0,0,0,0.7)] sm:h-[390px] sm:w-[280px] sm:rounded-3xl sm:p-2.5 lg:h-[430px] lg:w-[320px]"
                  >
                    {/* Card image/media */}
                    <div className="relative h-full w-full overflow-hidden rounded-xl bg-black sm:rounded-2xl">

                      {item.type === 'video' ? (
                        <>
                          <video
                            ref={(el) => {
                              if (el) videoRefs.current[index] = el;
                            }}
                            src={item.image}
                            className="h-full w-full object-cover"
                            loop={false}
                            playsInline
                            muted={isMuted}
                            preload="metadata"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideo(index);
                            }}
                          />

                          {playingVideo !== index && (
                            <button
                              type="button"
                              aria-label="Play video"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleVideo(index);
                              }}
                              className="absolute inset-0 flex items-center justify-center bg-black/25"
                            >
                              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-primary/90 text-white shadow-xl shadow-primary/20 transition-transform duration-300 hover:scale-110">
                                <FaPlay className="ml-1" />
                              </span>
                            </button>
                          )}

                          {playingVideo === index && (
                            <>
                              <button
                                type="button"
                                aria-label="Pause video"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleVideo(index);
                                }}
                                className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity hover:opacity-100"
                              >
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-white">
                                  <FaPause />
                                </span>
                              </button>

                              <button
                                type="button"
                                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                                onClick={(e) => toggleMute(index, e)}
                                className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center border border-white/20 bg-black/70 text-white backdrop-blur-md transition-colors hover:border-primary"
                              >
                                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                              </button>
                            </>
                          )}

                          <div className="absolute right-3 top-3 border border-white/15 bg-black/70 px-3 py-1.5 backdrop-blur-md">
                            <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-wider text-white">
                              <FaVideo className="text-primary" />
                              Video
                            </span>
                          </div>
                        </>
                      ) : (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          unoptimized
                          sizes="(max-width: 639px) 220px, (max-width: 1023px) 280px, 320px"
                          className={`object-cover transition-transform duration-700 ${
                            hoveredIndex === index && isActive
                              ? 'scale-110'
                              : 'scale-100'
                          }`}
                          onError={(e) => {
                            console.error(
                              `Failed to load image: ${item.image}`
                            );

                            const parent = e.currentTarget.parentElement;

                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className =
                                'flex h-full w-full items-center justify-center bg-[#141414]';

                              fallback.innerHTML =
                                '<span class="text-4xl">🖼️</span>';

                              parent.appendChild(fallback);
                              e.currentTarget.style.display = 'none';
                            }
                          }}
                        />
                      )}

                      {/* Cinematic overlay */}
                      <div
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-500 ${
                          isActive ? 'opacity-90' : 'opacity-65'
                        }`}
                      />

                      {/* Active card border */}
                      {isActive && (
                        <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-primary/50 sm:rounded-2xl" />
                      )}

                      {/* Active card content */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            transition={{ duration: 0.35 }}
                            className="absolute inset-x-0 bottom-0 p-4 sm:p-6"
                          >
                            <div className="mb-3 flex items-center gap-2">
                              <span className="h-px w-7 bg-primary" />

                              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary">
                                {item.type === 'video' ? 'Video' : 'Photography'}
                              </span>
                            </div>

                            <h3 className="line-clamp-2 text-lg font-bold leading-snug text-white sm:text-2xl">
                              {item.title}
                            </h3>

                            {item.event && (
                              <p className="mt-2 flex items-center gap-2 text-xs text-gray-300">
                                <FaCalendarAlt className="text-primary" />
                                <span className="line-clamp-1">
                                  {item.event.title}
                                </span>
                              </p>
                            )}

                            <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
                              <span className="text-[9px] uppercase tracking-[0.18em] text-white/60">
                                DJEMBE CIRCLE
                              </span>

                              <span className="flex h-8 w-8 items-center justify-center border border-primary/50 text-primary">
                                <FaArrowRight className="-rotate-45 text-xs" />
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Inactive card title */}
                      {!isActive && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
                          <span className="mb-1 block text-[8px] uppercase tracking-[0.15em] text-primary">
                            {item.type === 'video' ? 'Video' : 'Photo'}
                          </span>

                          <h3 className="line-clamp-2 text-xs font-semibold text-white sm:text-sm">
                            {item.title}
                          </h3>
                        </div>
                      )}
                    </div>

                    {/* Premium card footer */}
                    <div className="flex items-center justify-between px-1 pb-0.5 pt-2">
                      <span className="text-[8px] uppercase tracking-[0.2em] text-white/40">
                        DJEMBE CIRCLE
                      </span>

                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? 'bg-primary' : 'bg-white/20'
                        }`}
                      />
                    </div>
                  </motion.article>
                );
              })}

              {/* Previous navigation */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous gallery item"
                className="group absolute left-0 top-1/2 z-40 -translate-y-1/2 sm:left-2 lg:left-4"
              >
                <span className="flex h-10 w-10 items-center justify-center border border-white/15 bg-black/80 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                  <svg
                    className="h-5 w-5 transition-transform group-hover:-translate-x-0.5 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </span>
              </button>

              {/* Next navigation */}
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next gallery item"
                className="group absolute right-0 top-1/2 z-40 -translate-y-1/2 sm:right-2 lg:right-4"
              >
                <span className="flex h-10 w-10 items-center justify-center border border-white/15 bg-black/80 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                  <svg
                    className="h-5 w-5 transition-transform group-hover:translate-x-0.5 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </button>

              {/* Slide counter */}
              <div className="absolute -top-10 right-0 z-40 border border-white/10 bg-black/80 px-4 py-2 backdrop-blur-md sm:-top-12 sm:px-5">
                <span className="font-mono text-xs font-semibold tracking-widest text-primary">
                  {String(activeSlide + 1).padStart(2, '0')}
                  <span className="mx-2 text-white/30">/</span>
                  {String(displayItems.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Carousel indicators */}
            <div className="mt-3 flex items-center justify-center gap-2">
              {displayItems.map((item, index) => (
                <button
                  key={item.id || index}
                  type="button"
                  aria-label={`Show gallery item ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                  className={`h-1 transition-all duration-300 ${
                    activeSlide === index
                      ? 'w-10 bg-primary'
                      : 'w-4 bg-white/20 hover:bg-primary/60'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 text-center">
            <FaCamera className="mx-auto mb-4 text-3xl text-primary" />

            <h3 className="text-lg font-semibold text-white">
              No items for this event
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Select a different event or view all gallery.
            </p>
          </div>
        )}

        {/* View Full Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 text-center sm:mt-16"
        >
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 border border-primary bg-primary px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:bg-primary/80 sm:px-9"
          >
            <span>View Full Gallery</span>

            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

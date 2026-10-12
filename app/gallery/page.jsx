
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowRight,
  FaCamera,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaImage,
  FaPlay,
  FaTimes,
  FaVideo,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import ApiService from '../../services/api';

const getMediaUrl = (path) => {
  if (!path) return '';

  if (/^https?:\/\//i.test(path)) return path;

  if (path.startsWith('/uploads/')) {
    const base =
      process.env.NEXT_PUBLIC_MEDIA_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:3001';

    return `${base.replace(/\/api\/?$/, '').replace(/\/$/, '')}${path}`;
  }

  return path;
};

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  const viewerVideoRef = useRef(null);

  const fetchGalleryItems = useCallback(async (eventId) => {
    try {
      setLoading(true);
      setError(null);

      const response = eventId
        ? await ApiService.getEventGallery(eventId)
        : await ApiService.getGallery({ eventId: 'all' });

      if (response.success && Array.isArray(response.data)) {
        const items = response.data
          .filter((item) => item.isActive !== false)
          .map((item) => ({
            id: item.id,
            type: item.mediaType,
            title:
              item.caption ||
              (item.event
                ? `Event: ${item.event.title}`
                : 'A Moment to Remember'),
            image: getMediaUrl(item.mediaUrl),
            eventId: item.eventId,
            event: item.event,
          }))
          .filter((item) => item.image);

        setGalleryItems(items);
      } else {
        setGalleryItems([]);
        setError('No gallery items found.');
      }
    } catch (err) {
      console.error('Gallery fetch error:', err);
      setGalleryItems([]);
      setError('Unable to load gallery items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await ApiService.getEvents({ limit: 100 });

        if (response.success && response.data) {
          setEvents(response.data.events || response.data || []);
        }
      } catch (err) {
        console.error('Events fetch error:', err);
      }

      await fetchGalleryItems(null);
    };

    initialize();
  }, [fetchGalleryItems]);

  const handleEventFilter = (eventId) => {
    setSelectedEventId(eventId);
    setActiveIndex(null);
    fetchGalleryItems(eventId);
  };

  const closeViewer = useCallback(() => {
    if (viewerVideoRef.current) {
      viewerVideoRef.current.pause();
    }

    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === null
        ? 0
        : (current - 1 + galleryItems.length) % galleryItems.length
    );
  }, [galleryItems.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null
        ? 0
        : (current + 1) % galleryItems.length
    );
  }, [galleryItems.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeViewer();
      if (event.key === 'ArrowLeft') showPrevious();
      if (event.key === 'ArrowRight') showNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeIndex, closeViewer, showPrevious, showNext]);

  useEffect(() => {
    if (activeIndex === null) return;

    const item = galleryItems[activeIndex];

    if (item?.type === 'video' && viewerVideoRef.current) {
      viewerVideoRef.current.muted = isMuted;

      viewerVideoRef.current.play().catch(() => {});
    }
  }, [activeIndex, galleryItems, isMuted]);

  const imageCount = galleryItems.filter(
    (item) => item.type === 'image'
  ).length;

  const videoCount = galleryItems.filter(
    (item) => item.type === 'video'
  ).length;

  return (
    <section className="min-h-screen overflow-hidden bg-black text-white">

     {/* Hero Banner */}
         <div className="relative w-full h-[400px] overflow-hidden">
           <Image
             src="/images/banner1.jpg"
             alt="Djembe Circle Banner"
             fill
             className="object-cover"
             priority
           />
           <div className="absolute inset-0 bg-black/70"></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-center px-4">
               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
               >
                 <div className="inline-flex items-center bg-white/5 backdrop-blur-sm px-6 py-2 mb-4 border-l-4 border-primary">
                   <span className="text-primary text-sm font-semibold">✦ Gallery</span>
                 </div>
                 <h1 className="text-4xl md:text-6xl font-extrabold text-white">
                   The <span className="text-primary">Djembe Circle</span>
                 </h1>
                 <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                   Where rhythm meets community
                 </p>
               </motion.div>
             </div>
           </div>
         </div>

      {/* ALL OTHER TEXT AND CONTENT BELOW THE BANNER */}
      <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">

        {/* Small section heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <FaCamera />
              Photo & Video Collection
            </div>

            <h2 className="text-2xl font-semibold sm:text-3xl">
              Explore Our Moments
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">
              Discover the performances, celebrations and experiences
              that make every gathering special.
            </p>
          </div>

          <div className="flex gap-5 border-t border-white/10 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {galleryItems.length}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-white/45">
                Total
              </p>
            </div>

            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {imageCount}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-white/45">
                Photos
              </p>
            </div>

            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {videoCount}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-white/45">
                Videos
              </p>
            </div>
          </div>
        </motion.div>

        {/* EVENT FILTERS */}
        {events.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleEventFilter(null)}
              className={`border px-4 py-2.5 text-xs transition-all duration-300 ${
                selectedEventId === null
                  ? 'border-primary bg-primary text-black'
                  : 'border-white/10 text-white/60 hover:border-primary hover:text-white'
              }`}
            >
              All Gallery
            </button>

            {events.map((event) => (
              <button
                type="button"
                key={event.id}
                onClick={() => handleEventFilter(event.id)}
                className={`border px-4 py-2.5 text-xs transition-all duration-300 ${
                  selectedEventId === event.id
                    ? 'border-primary bg-primary text-black'
                    : 'border-white/10 text-white/60 hover:border-primary hover:text-white'
                }`}
              >
                <FaCalendarAlt className="mr-2 inline" />
                {event.title}
              </button>
            ))}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="mb-5 animate-pulse break-inside-avoid bg-white/[0.06]"
                style={{ height: `${230 + (index % 3) * 75}px` }}
              />
            ))}
          </div>
        )}

        {/* ERROR / EMPTY STATE */}
        {!loading && galleryItems.length === 0 && (
          <div className="border border-white/10 py-20 text-center">
            <FaCamera className="mx-auto mb-5 text-3xl text-primary" />

            <h3 className="text-xl font-semibold">
              {error || 'No gallery items available'}
            </h3>

            <p className="mt-3 text-sm text-white/50">
              Please check back later for new photos and videos.
            </p>
          </div>
        )}

        {/* PREMIUM MASONRY GALLERY */}
        {!loading && galleryItems.length > 0 && (
          <div className="columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3 xl:columns-4">
            {galleryItems.map((item, index) => (
              <motion.button
                type="button"
                key={item.id || index}
                onClick={() => setActiveIndex(index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4 }}
                aria-label={`View ${item.title}`}
                className="group relative mb-4 block w-full break-inside-avoid overflow-hidden border border-white/10 bg-[#101010] text-left sm:mb-5"
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: [
                      '4 / 5',
                      '3 / 4',
                      '4 / 3',
                      '5 / 6',
                      '1 / 1',
                    ][index % 5],
                  }}
                >
                  {item.type === 'video' ? (
                    <>
                      <video
                        src={item.image}
                        muted
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors group-hover:bg-black/35">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-black/40 text-white transition-all group-hover:border-primary group-hover:text-primary">
                          <FaPlay className="ml-1" />
                        </span>
                      </div>

                      <span className="absolute left-4 top-4 bg-black/70 px-3 py-2 text-[10px] uppercase tracking-widest">
                        <FaVideo className="mr-2 inline text-primary" />
                        Video
                      </span>
                    </>
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  {/* Bottom text overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-primary">
                      {item.type === 'video' ? 'Video Collection' : 'Photography'}
                    </p>

                    <h3 className="line-clamp-2 text-base font-medium leading-snug text-white sm:text-lg">
                      {item.title}
                    </h3>

                    {item.event?.title && (
                      <p className="mt-2 text-xs text-white/60">
                        {item.event.title}
                      </p>
                    )}

                    <p className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/70">
                      View Moment
                      <FaArrowRight className="text-primary transition-transform group-hover:translate-x-1" />
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* VIEW FULL GALLERY */}
        <div className="mt-14 text-center sm:mt-20">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-4 border border-white/20 px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-all hover:border-primary hover:bg-primary hover:text-black"
          >
            View Full Gallery
            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* FULL-SCREEN IMAGE / VIDEO VIEWER */}
      <AnimatePresence>
        {activeIndex !== null && galleryItems[activeIndex] && (
          <motion.div
            key="gallery-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Gallery viewer"
          >
            {/* Viewer header */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-8">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.25em] text-primary">
                  Our Gallery
                </p>

                <p className="mt-1 truncate text-sm text-white/80">
                  {galleryItems[activeIndex].title}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <span className="text-xs text-white/60">
                  {activeIndex + 1} / {galleryItems.length}
                </span>

                <button
                  type="button"
                  onClick={closeViewer}
                  aria-label="Close viewer"
                  className="flex h-10 w-10 items-center justify-center border border-white/20 hover:border-primary hover:text-primary"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Main media */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-12 py-5 sm:px-24">
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Previous image"
                className="absolute left-2 z-20 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/60 hover:border-primary hover:text-primary sm:left-6 sm:h-12 sm:w-12"
              >
                <FaChevronLeft />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex h-full w-full items-center justify-center"
                >
                  {galleryItems[activeIndex].type === 'video' ? (
                    <video
                      key={galleryItems[activeIndex].image}
                      ref={viewerVideoRef}
                      src={galleryItems[activeIndex].image}
                      controls
                      autoPlay
                      playsInline
                      muted={isMuted}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Image
                      key={galleryItems[activeIndex].image}
                      src={galleryItems[activeIndex].image}
                      alt={galleryItems[activeIndex].title}
                      fill
                      unoptimized
                      sizes="100vw"
                      className="object-contain"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {galleryItems[activeIndex].type === 'video' && (
                <button
                  type="button"
                  onClick={() => setIsMuted((value) => !value)}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/70 hover:border-primary hover:text-primary"
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
              )}

              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className="absolute right-2 z-20 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/60 hover:border-primary hover:text-primary sm:right-6 sm:h-12 sm:w-12"
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Viewer footer */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/10 px-4 py-4 sm:px-8">
              <div className="min-w-0">
                <p className="truncate text-xs text-white/65">
                  {galleryItems[activeIndex].event?.title || 'Photo & Video Collection'}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous item"
                  className="flex h-9 w-9 items-center justify-center border border-white/20 hover:border-primary hover:text-primary"
                >
                  <FaChevronLeft />
                </button>

                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next item"
                  className="flex h-9 w-9 items-center justify-center border border-white/20 hover:border-primary hover:text-primary"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
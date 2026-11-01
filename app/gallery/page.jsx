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
  FaNewspaper,
} from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import ApiService from '../../services/api';

// Convert relative upload paths into complete media URLs.
const getMediaUrl = (path) => {
  if (!path || typeof path !== 'string') return '';

  if (/^https?:\/\//i.test(path)) return path;

  if (path.startsWith('/uploads/')) {
    const base =
      process.env.NEXT_PUBLIC_MEDIA_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:3001';

    const cleanBase = base.replace(/\/api\/?$/, '').replace(/\/$/, '');
    return `${cleanBase}${path}`;
  }

  return path;
};

const TABS = [
  { id: 'all', label: 'All Moments', icon: FaCamera },
  { id: 'image', label: 'Articles', icon: FaImage },
  // { id: 'event', label: 'Events', icon: FaImage },

  { id: 'video', label: 'Video', icon: FaVideo },
 
];

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  const viewerVideoRef = useRef(null);

  const fetchGalleryItems = useCallback(async (eventId) => {
    try {
      setLoading(true);
      setError(null);

      if (viewerVideoRef.current) {
        viewerVideoRef.current.pause();
        viewerVideoRef.current = null;
      }

      const response = eventId
        ? await ApiService.getEventGallery(eventId)
        : await ApiService.getGallery({ eventId: 'all' });

      if (response.success && Array.isArray(response.data)) {
        const items = response.data
          .filter((item) => item.isActive !== false)
          .map((item) => {
            const type = String(item.mediaType || 'image').toLowerCase();

            return {
              id: item.id,
              type,
              title:
                item.caption ||
                item.title ||
                (item.event
                  ? `Event: ${item.event.title}`
                  : 'A Moment to Remember'),
              image: getMediaUrl(item.mediaUrl),
              description: item.description || item.content || '',
              eventId: item.eventId,
              event: item.event,
            };
          })
          .filter((item) => item.type === 'article' || item.image);

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

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return galleryItems;
    return galleryItems.filter((item) => item.type === activeTab);
  }, [galleryItems, activeTab]);

  const handleEventFilter = (eventId) => {
    setSelectedEventId(eventId);
    setActiveIndex(null);
    fetchGalleryItems(eventId);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveIndex(null);
  };

  const closeViewer = useCallback(() => {
    if (viewerVideoRef.current) {
      viewerVideoRef.current.pause();
      viewerVideoRef.current.removeAttribute('src');
      viewerVideoRef.current.load();
      viewerVideoRef.current = null;
    }

    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === null
        ? 0
        : (current - 1 + filteredItems.length) % filteredItems.length
    );
  }, [filteredItems.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null
        ? 0
        : (current + 1) % filteredItems.length
    );
  }, [filteredItems.length]);

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

    const item = filteredItems[activeIndex];

    if (item?.type === 'video' && viewerVideoRef.current) {
      viewerVideoRef.current.muted = isMuted;
      viewerVideoRef.current.play().catch((err) => {
        console.warn('Video autoplay was blocked:', err);
      });
    }
  }, [activeIndex, filteredItems, isMuted]);

  const imageCount = galleryItems.filter((item) => item.type === 'image').length;
  const videoCount = galleryItems.filter((item) => item.type === 'video').length;
  const articleCount = galleryItems.filter((item) => item.type === 'article').length;

  const activeItem =
    activeIndex !== null ? filteredItems[activeIndex] : null;

  return (
    <section className="min-h-screen overflow-hidden bg-black text-white">
      {/* Hero Banner */}
      <div className="relative h-[320px] w-full overflow-hidden sm:h-[360px] lg:h-[400px]">
        <Image
          src="/images/banner1.jpg"
          alt="Djembe Circle Banner"
          fill
          className="object-cover"
          priority
          unoptimized
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-4 inline-flex items-center border-l-4 border-primary bg-white/5 px-6 py-2 backdrop-blur-sm">
                <span className="text-sm font-semibold text-primary">
                  ✦ Gallery
                </span>
              </div>

              <h1 className="text-4xl font-extrabold text-white md:text-6xl">
                The <span className="text-primary">Djembe Circle</span>
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300 md:text-xl">
                Where rhythm meets community
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        {/* Section heading and statistics */}
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
              Discover the performances, celebrations and experiences that
              make every gathering special.
            </p>
          </div>

          <div className="flex gap-5 border-t border-white/10 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            {[
              { value: galleryItems.length, label: 'Total' },
              { value: imageCount, label: 'Articles' },
              { value: videoCount, label: 'Videos' },
              // { value: articleCount, label: 'Articles' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-semibold tabular-nums">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/45">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Premium content tabs */}
        <div className="mb-7 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const count =
                tab.id === 'all'
                  ? galleryItems.length
                  : galleryItems.filter((item) => item.type === tab.id).length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`group relative inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-all duration-300 sm:px-5 sm:text-sm ${
                    activeTab === tab.id
                      ? 'text-primary'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Icon className="text-[13px]" />
                  {tab.label}
                  <span
                    className={`text-[10px] tabular-nums ${
                      activeTab === tab.id ? 'text-primary/70' : 'text-white/30'
                    }`}
                  >
                    {count}
                  </span>

                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ${
                      activeTab === tab.id ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Event filters */}
        {events.length > 0 && (
          <div className="mb-10 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleEventFilter(null)}
              className={`border px-4 py-2.5 text-xs transition-all duration-300 ${
                selectedEventId === null
                  ? 'border-primary bg-primary text-black'
                  : 'border-white/10 text-white/60 hover:border-primary hover:text-white'
              }`}
            >
              All Events
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

        {/* Loading */}
        {loading && (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="mb-5 animate-pulse break-inside-avoid border border-white/5 bg-white/[0.06]"
                style={{ height: `${230 + (index % 3) * 75}px` }}
              />
            ))}
          </div>
        )}

        {/* Error / Empty state */}
        {!loading && filteredItems.length === 0 && (
          <div className="border border-white/10 bg-white/[0.02] py-20 text-center">
            <FaCamera className="mx-auto mb-5 text-3xl text-primary" />

            <h3 className="text-xl font-semibold">
              {error ||
                (activeTab === 'article'
                  ? 'No articles available yet'
                  : 'No gallery items available')}
            </h3>

            <p className="mt-3 text-sm text-white/50">
              {activeTab === 'article'
                ? 'Articles will appear here when they are added.'
                : 'Please check back later for new photos and videos.'}
            </p>
          </div>
        )}

        {/* Premium masonry gallery */}
        {!loading && filteredItems.length > 0 && (
          <div className="columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3 xl:columns-4">
            {filteredItems.map((item, index) => (
              <motion.article
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4 }}
                className="group relative mb-4 block w-full break-inside-avoid overflow-hidden border border-white/10 bg-[#101010] text-left transition-colors duration-300 hover:border-primary/50 sm:mb-5"
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View ${item.title}`}
                  className="block w-full text-left"
                >
                  <div
                    className="relative overflow-hidden bg-[#151515]"
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
                        {/* Muted autoplay creates a real moving video preview.
                            No backend thumbnail or poster image is required. */}
                        <video
                          key={item.image}
                          src={item.image}
                          muted
                          autoPlay
                          loop
                          playsInline
                          preload="auto"
                          controls={false}
                          disablePictureInPicture
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.style.opacity = '0';
                          }}
                        />

                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/25">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-black/45 text-white backdrop-blur-sm transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-black">
                            <FaPlay className="ml-1" />
                          </span>
                        </div>

                        <span className="absolute left-4 top-4 border border-white/15 bg-black/70 px-3 py-2 text-[10px] uppercase tracking-widest text-white backdrop-blur-md">
                          <FaVideo className="mr-2 inline text-primary" />
                          Video
                        </span>
                      </>
                    ) : item.type === 'article' ? (
                      <div className="flex h-full min-h-[260px] flex-col justify-between bg-gradient-to-br from-[#191919] via-[#101010] to-[#242018] p-6">
                        <div className="flex h-12 w-12 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
                          <FaNewspaper className="text-xl" />
                        </div>

                        <div>
                          <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-primary">
                            Djembe Circle Journal
                          </p>
                          <h3 className="text-xl font-semibold leading-snug text-white">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
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

                    {item.type !== 'article' && (
                      <>
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
                          <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-primary">
                            {item.type === 'video'
                              ? 'Video Collection'
                              : 'Photography'}
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
                      </>
                    )}

                    {item.type === 'article' && (
                      <div className="border-t border-white/10 px-6 py-4">
                        <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60">
                          Read Article
                          <FaArrowRight className="text-primary transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              </motion.article>
            ))}
          </div>
        )}

        {/* View Full Gallery */}
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

      {/* Full-screen image / video / article viewer */}
      <AnimatePresence>
        {activeIndex !== null && activeItem && (
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
                  {activeItem.title}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <span className="text-xs text-white/60">
                  {activeIndex + 1} / {filteredItems.length}
                </span>

                <button
                  type="button"
                  onClick={closeViewer}
                  aria-label="Close viewer"
                  className="flex h-10 w-10 items-center justify-center border border-white/20 transition-colors hover:border-primary hover:text-primary"
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
                aria-label="Previous item"
                className="absolute left-2 z-20 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/60 transition-colors hover:border-primary hover:text-primary sm:left-6 sm:h-12 sm:w-12"
              >
                <FaChevronLeft />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id || activeIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex h-full w-full items-center justify-center"
                >
                  {activeItem.type === 'video' ? (
                    <video
                      key={activeItem.image}
                      ref={viewerVideoRef}
                      src={activeItem.image}
                      controls
                      autoPlay
                      playsInline
                      muted={isMuted}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : activeItem.type === 'article' ? (
                    <article className="max-h-full w-full max-w-3xl overflow-y-auto border border-white/10 bg-[#101010] p-6 sm:p-10">
                      <FaNewspaper className="mb-5 text-3xl text-primary" />
                      <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-primary">
                        Djembe Circle Journal
                      </p>
                      <h2 className="text-2xl font-semibold leading-snug sm:text-4xl">
                        {activeItem.title}
                      </h2>
                      <p className="mt-6 whitespace-pre-line text-sm leading-8 text-white/65 sm:text-base">
                        {activeItem.description ||
                          'Article content has not been added yet.'}
                      </p>
                    </article>
                  ) : (
                    <Image
                      key={activeItem.image}
                      src={activeItem.image}
                      alt={activeItem.title}
                      fill
                      unoptimized
                      sizes="100vw"
                      className="object-contain"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {activeItem.type === 'video' && (
                <button
                  type="button"
                  onClick={() => setIsMuted((value) => !value)}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/70 transition-colors hover:border-primary hover:text-primary"
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
              )}

              <button
                type="button"
                onClick={showNext}
                aria-label="Next item"
                className="absolute right-2 z-20 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/60 transition-colors hover:border-primary hover:text-primary sm:right-6 sm:h-12 sm:w-12"
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Viewer footer */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/10 px-4 py-4 sm:px-8">
              <div className="min-w-0">
                <p className="truncate text-xs text-white/65">
                  {activeItem.event?.title || 'Photo & Video Collection'}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous item"
                  className="flex h-9 w-9 items-center justify-center border border-white/20 transition-colors hover:border-primary hover:text-primary"
                >
                  <FaChevronLeft />
                </button>

                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next item"
                  className="flex h-9 w-9 items-center justify-center border border-white/20 transition-colors hover:border-primary hover:text-primary"
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

'use client';

import { useEffect, useRef, useState } from 'react';

export default function LandingVideo({ onComplete }) {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);

  const startVideo = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      video.muted = false;
      video.volume = 1;

      await video.play();

      setStarted(true);
    } catch (error) {
      console.error('Video playback failed:', error);
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleEnded = () => {
      onComplete();
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">

      {/* Video */}
      <video
        ref={videoRef}
        src="/images/djvideo2.mp4"
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Start Button */}
      {!started && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">

          <button
            onClick={startVideo}
            className="px-8 py-4 rounded-full border border-white/40 bg-black/50 backdrop-blur-md text-white text-lg font-medium hover:bg-white hover:text-black transition-all duration-300"
          >
            ▶ Enter Djembe Circle
          </button>

        </div>
      )}

      {/* Skip */}
      {started && (
        <button
          onClick={onComplete}
          className="absolute bottom-8 right-8 z-20 px-5 py-2.5 rounded-full border border-white/30 bg-black/40 backdrop-blur-sm text-white text-sm hover:bg-white hover:text-black transition-all duration-300"
        >
          Skip
        </button>
      )}

    </div>
  );
}
'use client';

import { useEffect, useRef, useState } from 'react';

export default function LandingVideo({ onComplete }) {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    // Check if video has already been watched in this session
    const hasWatched = sessionStorage.getItem('landingVideoWatched');
    if (hasWatched) {
      setShouldShow(false);
      if (onComplete) {
        onComplete();
      }
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      // Unmute before playing
      video.muted = false;
      
      video.play()
        .then(() => {
          console.log('Video playing with audio!');
          setStarted(true);
        })
        .catch(err => {
          console.error('Play failed:', err);
          // If autoplay with audio fails, try muted first
          video.muted = true;
          video.play().catch(e => console.error('Even muted play failed:', e));
        });
    };

    // Auto play with user gesture
    const handleInteraction = () => {
      playVideo();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    // Try to play automatically first
    setTimeout(playVideo, 200);

    // Also listen for user interaction
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    // Call onComplete when video ends
    const handleEnded = () => {
      console.log('Video ended, calling onComplete...');
      // Store flag in sessionStorage
      sessionStorage.setItem('landingVideoWatched', 'true');
      if (onComplete) {
        onComplete();
      }
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  const handleSkip = () => {
    // Store flag in sessionStorage when skipped
    sessionStorage.setItem('landingVideoWatched', 'true');
    if (onComplete) {
      onComplete();
    }
  };

  // If video shouldn't show, return null
  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <video
        ref={videoRef}
        src="/videos/djvideo2.mp4"
        playsInline
        preload="auto"
        muted={false}
        className="w-full h-full object-cover"
      />
      
      {!started && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <svg className="w-16 h-16 mx-auto text-white/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <p className="mt-4 text-white/60 text-sm">Click to play with sound</p>
          </div>
        </div>
      )}
      
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 z-20 px-5 py-2.5 rounded-full border border-white/30 bg-black/40 backdrop-blur-sm text-white text-sm hover:bg-white hover:text-black transition-all duration-300"
      >
        Skip
      </button>
    </div>
  );
}
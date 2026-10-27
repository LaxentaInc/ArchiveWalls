import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Wallpaper } from '@/shared/types';
import { cn } from '@/lib/utils';

interface WallpaperBackgroundProps {
  wallpaper: Wallpaper | null;
  isBlurred?: boolean;
}

export const WallpaperBackground: React.FC<WallpaperBackgroundProps> = ({
  wallpaper,
  isBlurred = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!videoRef.current) return;
      if (document.hidden) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (!wallpaper) {
    return <div className="fixed inset-0 bg-[#050507]" />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden select-none pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={wallpaper.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className={cn(
            'absolute inset-0 w-full h-full transition-all duration-500',
            isBlurred && 'scale-105 blur-md brightness-75'
          )}
        >
          {wallpaper.type === 'video' ? (
            <video
              ref={videoRef}
              src={wallpaper.src}
              poster={wallpaper.thumbnail}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={wallpaper.src}
              alt={wallpaper.title}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};

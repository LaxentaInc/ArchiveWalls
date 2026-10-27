import { useEffect, useRef, useState } from 'react';
import { ROCK_FRAME_COUNT, getRockFrameUrl } from './constants';

export function useFramePreloader() {
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isInitialFrameReady, setIsInitialFrameReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    // (try) load frame 1 immediately to display something without delay
    const firstImg = new Image();
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current[1] = firstImg;
      setImagesLoaded((prev) => prev + 1);
      setIsInitialFrameReady(true);

      // after frame 1 is ready, asynchronously load the remaining frames
      for (let i = 2; i <= ROCK_FRAME_COUNT; i++) {
        const img = new Image();
        img.onload = () => {
          if (isCancelled) return;
          imagesRef.current[i] = img;
          setImagesLoaded((prev) => prev + 1);
        };
        img.src = getRockFrameUrl(i);
      }
    };

    firstImg.src = getRockFrameUrl(1);

    return () => {
      isCancelled = true;
    };
  }, []);

  return {
    imagesRef,
    imagesLoaded,
    isInitialFrameReady,
    totalFrames: ROCK_FRAME_COUNT,
  };
}

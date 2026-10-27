import React, { useRef } from 'react';
import { CANVAS_SIZE, ROCK_FRAME_COUNT } from './constants';
import { useFramePreloader } from './useFramePreloader';
import { useSmoothScroll } from './useSmoothScroll';
import { useRockAnimationLoop } from './useRockAnimationLoop';

interface RockCanvasProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

// canvas component managing rock frame rendering and wheel interaction
export const RockCanvas: React.FC<RockCanvasProps> = ({ containerRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { imagesRef, imagesLoaded, isInitialFrameReady } = useFramePreloader();
  const { targetFrameRef } = useSmoothScroll();

  useRockAnimationLoop({
    canvasRef,
    containerRef,
    imagesRef,
    targetFrameRef,
    isInitialFrameReady,
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="relative z-10 w-full max-w-[1100px] max-h-screen object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
      />

      {/* loading indicator while background caching the 270 frames */}
      {imagesLoaded < ROCK_FRAME_COUNT && (
        <div className="absolute bottom-6 right-6 text-white/30 text-xs font-mono tracking-widest z-20">
          LOADING ASSETS [{Math.floor((imagesLoaded / ROCK_FRAME_COUNT) * 100)}%]
        </div>
      )}
    </div>
  );
};

export default RockCanvas;

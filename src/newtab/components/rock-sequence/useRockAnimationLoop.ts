import { useEffect, useRef } from 'react';
import { LERP_STEP_FACTOR, LERP_SNAP_THRESHOLD } from './constants';
import { renderRockFrame } from './canvasRenderer';

interface UseRockAnimationLoopProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  imagesRef: React.RefObject<(HTMLImageElement | undefined)[]>;
  targetFrameRef: React.RefObject<number>;
  isInitialFrameReady: boolean;
}

// hook running the frame interpolation loop and dynamically streaming green factor
export function useRockAnimationLoop({
  canvasRef,
  containerRef,
  imagesRef,
  targetFrameRef,
  isInitialFrameReady,
}: UseRockAnimationLoopProps) {
  const currentFrameRef = useRef<number>(1);

  // draw initial frame once ready
  useEffect(() => {
    if (isInitialFrameReady && canvasRef.current && imagesRef.current[1]) {
      renderRockFrame({
        index: 1,
        canvas: canvasRef.current,
        images: imagesRef.current,
      });
    }
  }, [isInitialFrameReady, canvasRef, imagesRef]);

  useEffect(() => {
    let rafId: number;

    const loop = () => {
      const canvas = canvasRef.current;
      const images = imagesRef.current;
      if (!canvas || !images) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      let current = currentFrameRef.current;
      const target = targetFrameRef.current;
      const dist = target - current;

      if (Math.abs(dist) > 0.001) {
        // smooth step factor tuned to 0.045 for long gliding motion
        current += dist * LERP_STEP_FACTOR;

        // snap threshold to eliminate exponential lerp decay tail
        if (Math.abs(target - current) < LERP_SNAP_THRESHOLD) {
          current = target;
        }

        currentFrameRef.current = current;
        const frameIndex = Math.round(current);

        // calculate green transition factor based on asset color thresholds
        // frames 1 to 65 are bare stone, foliage spreads between frame 65 and 130
        const greenFactor = Math.min(1, Math.max(0, (current - 65) / 65));
        const rotationAngle = (current / 270) * 360;

        if (containerRef?.current) {
          containerRef.current.style.setProperty('--green-factor', greenFactor.toFixed(3));
          containerRef.current.style.setProperty('--rock-angle', `${rotationAngle.toFixed(1)}deg`);
        }

        // fallback to closest previously loaded frame if scrolled rapidly
        let targetIndex = frameIndex;
        while (!images[targetIndex] && targetIndex > 1) {
          targetIndex--;
        }

        if (images[targetIndex]) {
          renderRockFrame({
            index: targetIndex,
            canvas,
            images,
          });
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [canvasRef, containerRef, imagesRef, targetFrameRef]);
}

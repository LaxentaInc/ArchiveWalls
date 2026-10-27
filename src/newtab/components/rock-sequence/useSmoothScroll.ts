import { useEffect, useRef } from 'react';
import {
  ROCK_FRAME_COUNT,
  SCROLL_MAX_DELTA,
  SCROLL_MULTIPLIER,
  SCROLL_LERP_FACTOR,
  SCROLL_SNAP_THRESHOLD,
} from './constants';

// momentum based wheel scroll physics hook for driving frame index
export function useSmoothScroll() {
  const targetFrameRef = useRef<number>(1);
  const scrollPositionRef = useRef<number>(0);
  const targetPositionRef = useRef<number>(0);
  const isInteractingRef = useRef<boolean>(false);
  const idleTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // max virtual scroll distance representing full 270 frame revolution
    const maxScroll = 6000;

    const onWheel = (e: WheelEvent) => {
      // amplify wheel delta and clamp to max delta to prevent teleporting
      const amplified = e.deltaY * SCROLL_MULTIPLIER;
      const clampedDelta = Math.max(-SCROLL_MAX_DELTA, Math.min(SCROLL_MAX_DELTA, amplified));

      targetPositionRef.current = (targetPositionRef.current + clampedDelta + maxScroll) % maxScroll;

      isInteractingRef.current = true;
      if (idleTimeoutRef.current) {
        window.clearTimeout(idleTimeoutRef.current);
      }
      idleTimeoutRef.current = window.setTimeout(() => {
        isInteractingRef.current = false;
      }, 2500);
    };

    let rafId: number;

    const loop = () => {
      // if user is idle, add subtle ambient drift rotation
      if (!isInteractingRef.current) {
        targetPositionRef.current = (targetPositionRef.current + 0.8) % maxScroll;
      }

      let current = scrollPositionRef.current;
      const target = targetPositionRef.current;
      const dist = target - current;

      if (Math.abs(dist) > SCROLL_SNAP_THRESHOLD) {
        current += dist * SCROLL_LERP_FACTOR;
        if (Math.abs(target - current) < SCROLL_SNAP_THRESHOLD) {
          current = target;
        }
        scrollPositionRef.current = current;

        // map virtual scroll position to frame index between 1 and 270
        const normalized = (current % maxScroll) / maxScroll;
        const mappedFrame = Math.max(1, Math.min(ROCK_FRAME_COUNT, Math.ceil(normalized * ROCK_FRAME_COUNT)));
        targetFrameRef.current = mappedFrame;
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(rafId);
      if (idleTimeoutRef.current) {
        window.clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  return { targetFrameRef };
}

export const ROCK_FRAME_COUNT = 270;
export const CANVAS_SIZE = 1000;
export const SOURCE_IMAGE_WIDTH = 750;
export const SOURCE_IMAGE_HEIGHT = 820;

export const DEFAULT_ROTATION_DEG = 110;
export const DEFAULT_SCALE = 1.17;
export const LERP_STEP_FACTOR = 0.045;
export const LERP_SNAP_THRESHOLD = 0.012;
export const SCROLL_MAX_DELTA = 400;
export const SCROLL_MULTIPLIER = 1.5;
export const SCROLL_LERP_FACTOR = 0.12;
export const SCROLL_SNAP_THRESHOLD = 0.5;

export const getRockFrameUrl = (frameIndex: number): string => {
  const padded = frameIndex.toString().padStart(4, '0');
  const relativePath = `assets/produx_rock/rock_${padded}.webp`;
  if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
    return chrome.runtime.getURL(relativePath);
  }
  return `/${relativePath}`;
};

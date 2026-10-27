export interface RenderFrameOptions {
  index: number;
  canvas: HTMLCanvasElement;
  images: (HTMLImageElement | undefined)[];
  rotationDeg?: number;
  scale?: number;
  sourceWidth?: number;
  sourceHeight?: number;
}

export interface FramePreloaderState {
  images: (HTMLImageElement | undefined)[];
  imagesLoaded: number;
  isInitialFrameReady: boolean;
  totalFrames: number;
}

export interface RockAnimationState {
  currentFrame: number;
  targetFrame: number;
  isAnimating: boolean;
}

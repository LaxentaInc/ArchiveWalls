// the whole thing is copied over from the production site https://colorwall.xyz.
// check it out, it is really great and cool.
import type { RenderFrameOptions } from './types';
import {
  DEFAULT_ROTATION_DEG,
  DEFAULT_SCALE,
  SOURCE_IMAGE_WIDTH,
  SOURCE_IMAGE_HEIGHT,
} from './constants';

export function renderRockFrame({
  index,
  canvas,
  images,
  rotationDeg = DEFAULT_ROTATION_DEG,
  scale = DEFAULT_SCALE,
  sourceWidth = SOURCE_IMAGE_WIDTH,
  sourceHeight = SOURCE_IMAGE_HEIGHT,
}: RenderFrameOptions): void {
  const img = images[index];
  if (!img) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.drawImage(img, -sourceWidth / 2, -sourceHeight / 2, sourceWidth, sourceHeight);
  ctx.restore();
}

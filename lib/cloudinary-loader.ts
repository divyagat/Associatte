import type { ImageLoaderProps } from 'next/image';

/**
 * Custom Next.js image loader for Cloudinary-hosted assets.
 *
 * Next's built-in optimizer proxies every image through /_next/image. Under the
 * Turbopack dev server that round-trip was timing out on our already-optimized
 * hero image (TimeoutError / 500). Since Cloudinary resizes & re-formats on the
 * fly, we build width-specific delivery URLs ourselves (w_<width>, q_<quality>,
 * f_auto, c_limit) and let the browser fetch straight from the CDN — responsive
 * `sizes`/`srcSet` are preserved, and the proxy that was hanging is skipped.
 *
 * Non-Cloudinary URLs (anything without an `/upload/` segment) are returned
 * untouched, so this is safe to apply per-<Image>.
 */
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const marker = '/upload/';
  const idx = src.indexOf(marker);
  if (idx === -1) return src;

  const base = src.slice(0, idx + marker.length);
  let rest = src.slice(idx + marker.length);

  // Drop an existing leading transform segment (e.g. "f_auto,q_auto/") so we
  // don't stack redundant format/quality params — we re-add our own below.
  // A transform segment starts with a short "x_" option token; a public id or
  // folder (e.g. "b4_ajb1vz", "properties") does not, so those are preserved.
  const firstSeg = rest.split('/')[0];
  if (/^[a-z]{1,3}_[^/]+$/.test(firstSeg)) {
    rest = rest.slice(firstSeg.length + 1);
  }

  const transform = `w_${width},q_${quality ?? 'auto'},f_auto,c_limit`;
  return `${base}${transform}/${rest}`;
}

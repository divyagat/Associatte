// scripts/optimize-images.mjs
//
// Recompress and down-size raster images under /public so the repo and the
// delivered payload stay small. Safe to re-run: it only overwrites a file when
// the re-encoded result is actually smaller.
//
//   node scripts/optimize-images.mjs            # optimize in place
//   node scripts/optimize-images.mjs --dry-run  # report only, write nothing
//
// Originals remain recoverable from git history.

import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const DRY_RUN = process.argv.includes('--dry-run');

// Longest-edge cap. Floorplans need more detail (zoom), so they get a higher cap.
const DEFAULT_MAX_EDGE = 1920;
const FLOORPLAN_MAX_EDGE = 2400;

// webp encode settings — quality 72 is visually near-lossless for photos.
const WEBP_QUALITY = 72;
const WEBP_EFFORT = 5;

// Don't bother with files already this small.
const MIN_BYTES_TO_PROCESS = 30 * 1024; // 30 KB

const RASTER_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function fmt(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function run() {
  let totalBefore = 0;
  let totalAfter = 0;
  let changed = 0;
  let skipped = 0;

  for await (const file of walk(PUBLIC_DIR)) {
    const ext = path.extname(file).toLowerCase();
    if (!RASTER_EXT.has(ext)) continue;

    const { size: before } = await stat(file);
    if (before < MIN_BYTES_TO_PROCESS) {
      totalBefore += before;
      totalAfter += before;
      continue;
    }

    const rel = path.relative(PUBLIC_DIR, file);
    const isFloorplan = /floorplan/i.test(rel);
    const maxEdge = isFloorplan ? FLOORPLAN_MAX_EDGE : DEFAULT_MAX_EDGE;
    // Floorplans contain fine text/dimensions — encode at higher quality so they stay legible.
    const webpQuality = isFloorplan ? 85 : WEBP_QUALITY;

    try {
      const input = await readFile(file);
      const img = sharp(input, { failOn: 'none' });
      const meta = await img.metadata();

      const needsResize =
        (meta.width && meta.width > maxEdge) || (meta.height && meta.height > maxEdge);

      let pipeline = img.rotate(); // respect EXIF orientation
      if (needsResize) {
        pipeline = pipeline.resize({
          width: maxEdge,
          height: maxEdge,
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Re-encode in the SAME format as the source so existing references and
      // served Content-Type stay correct (no orphan files, no MIME mismatch).
      let output;
      if (ext === '.png') {
        output = await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer();
      } else if (ext === '.jpg' || ext === '.jpeg') {
        output = await pipeline.jpeg({ quality: 78, mozjpeg: true }).toBuffer();
      } else {
        output = await pipeline.webp({ quality: webpQuality, effort: WEBP_EFFORT }).toBuffer();
      }

      totalBefore += before;

      // Only keep the new buffer if it's a real win (>3% smaller).
      if (output.length < before * 0.97) {
        totalAfter += output.length;
        changed += 1;
        const saved = `${fmt(before)} -> ${fmt(output.length)}`;
        if (DRY_RUN) {
          console.log(`  would optimize ${rel}  (${saved})`);
        } else {
          await writeFile(file, output);
          console.log(`  optimized ${rel}  (${saved})`);
        }
      } else {
        totalAfter += before;
        skipped += 1;
      }
    } catch (err) {
      totalBefore += before;
      totalAfter += before;
      console.warn(`  ! skipped ${rel}: ${err.message}`);
    }
  }

  console.log('\n--------------------------------------------');
  console.log(`${DRY_RUN ? '[dry run] ' : ''}files changed: ${changed}, unchanged: ${skipped}`);
  console.log(`total: ${fmt(totalBefore)} -> ${fmt(totalAfter)}  (saved ${fmt(totalBefore - totalAfter)})`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

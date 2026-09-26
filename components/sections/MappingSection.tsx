// components/sections/MappingSection.tsx
'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import projectsData from '@/data/projects.json';
import { isPubliclyVisible } from '@/lib/visibility';
import type { Project } from '@/types/project';

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  styles: [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  ],
};

// Roughly between Pune, Mumbai & KDMC — used only until fitBounds() runs.
const DEFAULT_CENTER = { lat: 19.05, lng: 74.2 };
const DEFAULT_ZOOM = 7;

const pinIcon = (selected: boolean) => ({
  url:
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(
      selected
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F8C21C" stroke="#8B0000" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5" fill="#8B0000"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#005E60" stroke="white" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5" fill="white"/></svg>`,
    ),
  scaledSize: new google.maps.Size(30, 38),
  anchor: new google.maps.Point(15, 38),
});

export default function MappingSection() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: apiKey });
  const [selected, setSelected] = useState<Project | null>(null);

  // Our own live map, pinned to every published project's real coordinates —
  // not the third-party "mappingg.com" iframe this section used to embed.
  const pins = useMemo(
    () =>
      (projectsData as Project[]).filter(
        (p): p is Project & { mapCoords: { lat: number; lng: number } } =>
          isPubliclyVisible(p) && Boolean(p.mapCoords),
      ),
    [],
  );

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      if (pins.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        pins.forEach((p) => bounds.extend(p.mapCoords));
        map.fitBounds(bounds, 56);
      }
    },
    [pins],
  );

  return (
    <section aria-labelledby="mapping-heading" className="py-8 md:py-14 bg-slate-50">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-6 md:mb-8"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Explore on the Map
          </span>
          <h2 id="mapping-heading" className="section-title text-[var(--color-text)] text-2xl sm:text-3xl md:text-4xl leading-tight">
            Discover Properties on the <span className="text-[var(--color-primary)]">Live Map</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--color-text-light)]">
            Every pin is one of our verified projects — click one to preview it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white"
        >
          <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-2.5 bg-slate-100 border-b border-gray-200">
            <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--color-text)]">
              <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
              {pins.length} projects across Pune, Mumbai &amp; KDMC
            </span>
            <Link
              href="/properties"
              className="inline-flex items-center gap-1 flex-shrink-0 text-xs sm:text-sm font-semibold text-[var(--color-primary)] hover:opacity-80 transition-opacity"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative w-full h-[280px] sm:h-[380px] md:h-[460px] bg-slate-100">
            {!apiKey ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6 bg-gradient-to-br from-slate-50 to-slate-100">
                <MapPin className="w-8 h-8 text-[var(--color-primary)]" />
                <p className="text-sm text-[var(--color-text-light)] max-w-xs">
                  {process.env.NODE_ENV === 'development'
                    ? 'Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env to show live pins here.'
                    : 'Explore all our verified projects across Pune, Mumbai & KDMC.'}
                </p>
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
                >
                  Browse Properties
                </Link>
              </div>
            ) : loadError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <p className="text-sm text-red-600">Map failed to load</p>
              </div>
            ) : !isLoaded ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[var(--color-text-light)]">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
                <span className="text-sm">Loading map…</span>
              </div>
            ) : (
              <GoogleMap
                mapContainerClassName="w-full h-full"
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                options={MAP_OPTIONS}
                onLoad={onMapLoad}
              >
                {pins.map((project) => (
                  <Marker
                    key={project.slug}
                    position={project.mapCoords}
                    onClick={() => setSelected(project)}
                    icon={pinIcon(selected?.slug === project.slug)}
                  />
                ))}

                {selected && (
                  <InfoWindow
                    position={selected.mapCoords}
                    onCloseClick={() => setSelected(null)}
                    options={{ pixelOffset: new google.maps.Size(0, -38) }}
                  >
                    <Link href={`/property/${selected.slug}`} onClick={() => setSelected(null)} className="block w-56 p-1">
                      <div className="flex gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                          <Image src={selected.image} alt={selected.name} fill sizes="56px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{selected.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {selected.fullLocation?.area || selected.location}
                          </p>
                          <p className="text-sm font-bold text-[#8B0000] mt-1">{selected.price}</p>
                        </div>
                      </div>
                    </Link>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

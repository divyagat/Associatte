// lib/location-cards.ts
//
// Client-safe helpers for the city cards on the homepage and /locations.
// Counts come from the bundled project data (previously hard-coded numbers such
// as "48 Projects" for Mumbai, which had 6). Navi Mumbai projects are listed on
// /locations/mumbai, so that card links there; cities with no live projects
// get a count of 0 and their cards are hidden by the callers.

import projectsData from '../data/projects.json';

type ProjectLite = { location?: string; status?: string; fullLocation?: { city?: string } };

const LIVE = (projectsData as ProjectLite[]).filter((p) => !p.status || p.status === 'published');

export function liveProjectCount(slug: string): number {
  if (slug === 'navi-mumbai') {
    return LIVE.filter((p) => (p.fullLocation?.city || '').toLowerCase() === 'navi mumbai').length;
  }
  return LIVE.filter((p) => (p.location || '').toLowerCase() === slug).length;
}

export function locationHref(slug: string): string {
  return `/locations/${slug === 'navi-mumbai' ? 'mumbai' : slug}`;
}

// lib/awards-data.ts
// Single source of truth for Awards & Recognition — used by the home-page
// AwardsSection and the dedicated /awards page. Icons are referenced by name
// (see ICON map in the consuming components) so this file stays free of JSX.

export type AwardIconName =
  | 'TrendingUp'
  | 'Star'
  | 'Award'
  | 'Building'
  | 'Trophy'
  | 'Medal'
  | 'Users'
  | 'Crown'
  | 'ShieldCheck';

export interface AwardItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: AwardIconName;
  metric: string;
  year: string;
  gradient: string;
  glow: string;
  ribbon: string;
}

export interface AwardStat {
  label: string;
  value: number;
  suffix: string;
  icon: AwardIconName;
  accent: string;
}

export const AWARDS: AwardItem[] = [
  {
    id: 1,
    title: 'Best Performance',
    subtitle: 'Sales Excellence Award',
    description:
      'Recognized for outstanding sales achievement in 2024 across all luxury segments.',
    icon: 'TrendingUp',
    metric: 'Top 1%',
    year: '2024',
    gradient: 'from-[#005E60] via-[#008B8B] to-[#00A8A8]',
    glow: 'shadow-[#005E60]/30',
    ribbon: 'bg-gradient-to-r from-[#F8C21C] to-[#DAA520]',
  },
  {
    id: 2,
    title: 'Game Changer',
    subtitle: 'Innovation Award',
    description:
      'Revolutionary approach to customer service that redefined industry standards.',
    icon: 'Star',
    metric: 'Winner',
    year: '2022',
    gradient: 'from-[#F8C21C] via-[#FFD700] to-[#DAA520]',
    glow: 'shadow-[#F8C21C]/40',
    ribbon: 'bg-gradient-to-r from-[#8B0000] to-[#A52A2A]',
  },
  {
    id: 3,
    title: 'Platinum Star',
    subtitle: 'Luxury Segment Leader',
    description:
      'Premium property sales excellence recognition for consecutive years.',
    icon: 'Award',
    metric: 'Platinum',
    year: '2023',
    gradient: 'from-[#8B0000] via-[#A52A2A] to-[#B22222]',
    glow: 'shadow-[#8B0000]/30',
    ribbon: 'bg-gradient-to-r from-[#005E60] to-[#008B8B]',
  },
  {
    id: 4,
    title: 'Top Performer',
    subtitle: 'Residential Category',
    description:
      'Leading residential property consultant with highest client satisfaction ratings.',
    icon: 'Building',
    metric: '#1 Ranked',
    year: '2024',
    gradient: 'from-[#005E60] via-[#008B8B] to-[#00A8A8]',
    glow: 'shadow-[#005E60]/30',
    ribbon: 'bg-gradient-to-r from-[#F8C21C] to-[#DAA520]',
  },
];

export const AWARD_STATS: AwardStat[] = [
  { label: 'Years of Excellence', value: 15, suffix: '+', icon: 'Trophy', accent: '#005E60' },
  { label: 'Awards Won', value: 50, suffix: '+', icon: 'Medal', accent: '#F8C21C' },
  { label: 'Happy Clients', value: 5000, suffix: '+', icon: 'Users', accent: '#8B0000' },
  { label: 'Projects Completed', value: 200, suffix: '+', icon: 'Building', accent: '#005E60' },
];

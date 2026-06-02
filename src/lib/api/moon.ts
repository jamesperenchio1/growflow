import type { MoonPhase } from '@/types';

// Known new moon: 6 Jan 2000 18:14 UTC
const KNOWN_NEW_MOON = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
const SYNODIC_MONTH = 29.53059;

export function getMoonPhase(date: Date): MoonPhase {
  const diffMs = date.getTime() - KNOWN_NEW_MOON.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const cycles = diffDays / SYNODIC_MONTH;
  const phaseDecimal = cycles - Math.floor(cycles);
  const phase = Math.floor(phaseDecimal * 8) % 8;
  const illumination = Math.round((1 - Math.cos(phaseDecimal * 2 * Math.PI)) / 2 * 100);

  return {
    phase,
    illumination,
    name: getMoonPhaseName(phase),
    plantingAdvice: getPlantingAdvice(phase),
  };
}

export function getMoonPhaseName(phase: number): string {
  const names = [
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Third Quarter',
    'Waning Crescent',
  ];
  return names[phase] ?? 'Unknown';
}

export function getMoonPhaseEmoji(phase: number): string {
  const emojis = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  return emojis[phase] ?? '🌑';
}

function getPlantingAdvice(phase: number): string {
  switch (phase) {
    case 0:
      return 'New Moon — Rest the soil. Good time for planning and preparing beds.';
    case 1:
      return 'Waxing Crescent — Ideal for planting above-ground crops with leafy growth.';
    case 2:
      return 'First Quarter — Good for planting annuals and above-ground vegetables.';
    case 3:
      return 'Waxing Gibbous — Excellent for planting fruiting and flowering crops.';
    case 4:
      return 'Full Moon — Best for root crops and transplanting. Strong gravitational pull aids root growth.';
    case 5:
      return 'Waning Gibbous — Good for pruning and harvesting. Avoid planting.';
    case 6:
      return 'Third Quarter — Focus on maintenance, weeding, and pest control.';
    case 7:
      return 'Waning Crescent — Rest period. Prepare compost and plan next cycle.';
    default:
      return 'No specific advice available.';
  }
}

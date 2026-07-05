import type { AccentColor, DifficultyLevel } from '@/utils/storage';

export const difficultyOptions: Array<{ label: DifficultyLevel; time: number; color: string }> = [
  { label: 'Easy', time: 90, color: '#34d399' },
  { label: 'Medium', time: 60, color: '#f59e0b' },
  { label: 'Hard', time: 30, color: '#f43f5e' },
];

export const accentOptions: Array<{ value: AccentColor; label: string; color: string }> = [
  { value: 'red', label: 'Red', color: '#ff3b30' },
  { value: 'blue', label: 'Blue', color: '#3b82f6' },
  { value: 'green', label: 'Green', color: '#34d399' },
];

export function getDifficultyDuration(level: DifficultyLevel) {
  return difficultyOptions.find((option) => option.label === level)?.time ?? 60;
}

export function getAccentColor(accentColor: AccentColor | string) {
  return accentOptions.find((option) => option.value === accentColor)?.color ?? '#ff3b30';
}

export function getAccentGradientColors(accentColor: AccentColor | string): [string, string] {
  const baseColor = getAccentColor(accentColor);
  if (baseColor === '#3b82f6') {
    return [baseColor, '#60a5fa'];
  }
  if (baseColor === '#34d399') {
    return [baseColor, '#6ee7b7'];
  }
  return [baseColor, '#ff6b5e'];
}

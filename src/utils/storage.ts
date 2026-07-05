import AsyncStorage from '@react-native-async-storage/async-storage';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type ThemeMode = 'dark' | 'light';
export type AccentColor = 'red' | 'blue' | 'green';

export type GameSettings = {
  backgroundMusic: boolean;
  soundEffects: boolean;
  vibration: boolean;
  timerFlashWarning: boolean;
  defaultDifficulty: DifficultyLevel;
  themeMode: ThemeMode;
  accentColor: AccentColor;
};

export type GameStats = {
  totalGamesPlayed: number;
  totalWins: number;
  totalLosses: number;
  bestRemainingTime: number;
};

const SETTINGS_KEY = 'bomb-defusal-settings';
const HIGH_SCORE_KEY = 'bomb-defusal-high-score';
const STATS_KEY = 'bomb-defusal-stats';

export const DEFAULT_SETTINGS: GameSettings = {
  backgroundMusic: true,
  soundEffects: true,
  vibration: true,
  timerFlashWarning: true,
  defaultDifficulty: 'Medium',
  themeMode: 'dark',
  accentColor: 'red',
};

export const DEFAULT_STATS: GameStats = {
  totalGamesPlayed: 0,
  totalWins: 0,
  totalLosses: 0,
  bestRemainingTime: 0,
};

function mergeSettings(savedSettings: Partial<GameSettings> | null | undefined): GameSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...(savedSettings ?? {}),
  };
}

function mergeStats(savedStats: Partial<GameStats> | null | undefined): GameStats {
  return {
    ...DEFAULT_STATS,
    ...(savedStats ?? {}),
  };
}

export async function loadSettings(): Promise<GameSettings> {
  try {
    const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!savedSettings) return DEFAULT_SETTINGS;
    const parsedSettings = JSON.parse(savedSettings) as Partial<GameSettings>;
    return mergeSettings(parsedSettings);
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: GameSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function loadHighScore(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(HIGH_SCORE_KEY);
    return value ? Number(value) : 0;
  } catch (error) {
    return 0;
  }
}

export async function saveHighScore(score: number): Promise<number> {
  const currentHighScore = await loadHighScore();
  const nextHighScore = Math.max(currentHighScore, score);
  await AsyncStorage.setItem(HIGH_SCORE_KEY, String(nextHighScore));
  return nextHighScore;
}

export async function loadStats(): Promise<GameStats> {
  try {
    const savedStats = await AsyncStorage.getItem(STATS_KEY);
    if (!savedStats) return DEFAULT_STATS;
    const parsedStats = JSON.parse(savedStats) as Partial<GameStats>;
    return mergeStats(parsedStats);
  } catch (error) {
    return DEFAULT_STATS;
  }
}

export async function saveStats(stats: GameStats): Promise<void> {
  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export async function recordGameResult(won: boolean, score: number): Promise<GameStats> {
  const currentStats = await loadStats();
  const nextStats: GameStats = {
    totalGamesPlayed: currentStats.totalGamesPlayed + 1,
    totalWins: currentStats.totalWins + (won ? 1 : 0),
    totalLosses: currentStats.totalLosses + (won ? 0 : 1),
    bestRemainingTime: Math.max(currentStats.bestRemainingTime, score),
  };
  await saveStats(nextStats);
  return nextStats;
}

export async function resetHighScore(): Promise<number> {
  await AsyncStorage.removeItem(HIGH_SCORE_KEY);
  return 0;
}

export async function resetStats(): Promise<GameStats> {
  await AsyncStorage.removeItem(STATS_KEY);
  return DEFAULT_STATS;
}

export async function resetAllGameData(): Promise<void> {
  await AsyncStorage.removeItem(HIGH_SCORE_KEY);
  await AsyncStorage.removeItem(STATS_KEY);
  await AsyncStorage.removeItem(SETTINGS_KEY);
}

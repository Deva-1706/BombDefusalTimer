import { useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_SETTINGS, loadSettings, saveSettings, type GameSettings } from '@/utils/storage';

export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      const savedSettings = await loadSettings();
      if (isActive) {
        setSettings(savedSettings);
        setIsLoaded(true);
      }
    };

    void load();
    return () => {
      isActive = false;
    };
  }, []);

  const updateSetting = useCallback(async <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    const nextSettings = { ...settings, [key]: value };
    setSettings(nextSettings);
    await saveSettings(nextSettings);
  }, [settings]);

  const accentColor = useMemo(() => {
    if (settings.accentColor === 'blue') return '#3b82f6';
    if (settings.accentColor === 'green') return '#34d399';
    return '#ff3b30';
  }, [settings.accentColor]);

  return {
    settings,
    isLoaded,
    accentColor,
    updateSetting,
    setSettings,
  };
}

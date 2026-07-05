import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppShell } from '@/components/ui/app-shell';
import { SectionCard } from '@/components/ui/section-card';
import { SettingRow } from '@/components/ui/setting-row';
import { useGameSettings } from '@/hooks/use-game-settings';

import {
  DEFAULT_SETTINGS,
  resetAllGameData,
  resetHighScore,
  resetStats,
  saveSettings,
} from '@/utils/storage';
import { accentOptions, difficultyOptions } from '@/utils/game-config';

export default function SettingsScreen() {
  const { settings, isLoaded, accentColor, updateSetting, setSettings } = useGameSettings();

  const handleResetHighScore = async () => {
    await resetHighScore();
    Alert.alert('Success', 'High score reset.');
  };

  const handleResetStats = async () => {
    await resetStats();
    Alert.alert('Success', 'Statistics reset.');
  };

  const handleResetAllData = async () => {
    Alert.alert('Reset All Game Data', 'This will erase all saved settings, scores, and statistics. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await resetAllGameData();
          setSettings(DEFAULT_SETTINGS);
          await saveSettings(DEFAULT_SETTINGS);
          Alert.alert('Done', 'All game data has been cleared.');
        },
      },
    ]);
  };

  if (!isLoaded) {
    return (
      <AppShell title="Settings" showHeader>
        <View style={styles.loadingScreen}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell title="Settings" showHeader>
      <View style={[styles.screen, settings.themeMode === 'light' ? styles.screenLight : null]}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={settings.themeMode === 'light' ? '#111827' : '#ffffff'} />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <SectionCard title="Audio" iconName="musical-notes" iconColor={accentColor} titleStyle={settings.themeMode === 'light' ? styles.titleLight : undefined} style={settings.themeMode === 'light' ? styles.cardLight : undefined}>
            <SettingRow label="Background Music" hint="Play music while you play." isLightTheme={settings.themeMode === 'light'}>
              <Switch value={settings.backgroundMusic} onValueChange={(value) => updateSetting('backgroundMusic', value)} thumbColor="#ffffff" trackColor={{ true: accentColor, false: '#4b5563' }} />
            </SettingRow>
            <SettingRow label="Sound Effects" hint="Enable button and game sounds." isLightTheme={settings.themeMode === 'light'}>
              <Switch value={settings.soundEffects} onValueChange={(value) => updateSetting('soundEffects', value)} thumbColor="#ffffff" trackColor={{ true: accentColor, false: '#4b5563' }} />
            </SettingRow>
          </SectionCard>

          <SectionCard title="Gameplay" iconName="game-controller" iconColor={accentColor} titleStyle={settings.themeMode === 'light' ? styles.titleLight : undefined} style={settings.themeMode === 'light' ? styles.cardLight : undefined}>
            <SettingRow label="Vibration" hint="Feel haptic feedback on mistakes." isLightTheme={settings.themeMode === 'light'}>
              <Switch value={settings.vibration} onValueChange={(value) => updateSetting('vibration', value)} thumbColor="#ffffff" trackColor={{ true: accentColor, false: '#4b5563' }} />
            </SettingRow>
            <SettingRow label="Timer Flash Warning" hint="Flash the timer when time is running low." isLightTheme={settings.themeMode === 'light'}>
              <Switch value={settings.timerFlashWarning} onValueChange={(value) => updateSetting('timerFlashWarning', value)} thumbColor="#ffffff" trackColor={{ true: accentColor, false: '#4b5563' }} />
            </SettingRow>
            <SettingRow label="Default Difficulty" hint="Choose the first difficulty you see." isLightTheme={settings.themeMode === 'light'}>
              <View style={styles.optionGroup}>
                {difficultyOptions.map((option) => {
                  const selected = settings.defaultDifficulty === option.label;
                  return (
                    <TouchableOpacity
                      key={option.label}
                      style={[styles.optionChip, selected && { backgroundColor: accentColor }]}
                      onPress={() => updateSetting('defaultDifficulty', option.label)}
                    >
                      <Text style={[styles.optionChipText, selected ? styles.optionChipTextSelected : null]}>{option.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </SettingRow>
          </SectionCard>

          <SectionCard title="Appearance" iconName="color-palette" iconColor={accentColor} titleStyle={settings.themeMode === 'light' ? styles.titleLight : undefined} style={settings.themeMode === 'light' ? styles.cardLight : undefined}>
            <SettingRow label="Dark Mode" hint="Use the dark interface by default." isLightTheme={settings.themeMode === 'light'}>
              <Switch value={settings.themeMode === 'dark'} onValueChange={(value) => updateSetting('themeMode', value ? 'dark' : 'light')} thumbColor="#ffffff" trackColor={{ true: accentColor, false: '#4b5563' }} />
            </SettingRow>
            <SettingRow label="Accent Color" hint="Pick a color for selections and buttons." isLightTheme={settings.themeMode === 'light'}>
              <View style={styles.optionGroup}>
                {accentOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.colorSwatch, { backgroundColor: option.color }, settings.accentColor === option.value && styles.colorSwatchSelected]}
                    onPress={() => updateSetting('accentColor', option.value)}
                  />
                ))}
              </View>
            </SettingRow>
          </SectionCard>

          <SectionCard title="Data Management" iconName="folder" iconColor={accentColor} titleStyle={settings.themeMode === 'light' ? styles.titleLight : undefined} style={settings.themeMode === 'light' ? styles.cardLight : undefined}>
            <TouchableOpacity style={styles.actionButton} onPress={handleResetHighScore}>
              <Text style={styles.actionButtonText}>Reset High Score</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleResetStats}>
              <Text style={styles.actionButtonText}>Reset Statistics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleResetAllData}>
              <Text style={styles.actionButtonText}>Reset All Game Data</Text>
            </TouchableOpacity>
          </SectionCard>

          <SectionCard title="About" iconName="information-circle" iconColor={accentColor} titleStyle={settings.themeMode === 'light' ? styles.titleLight : undefined} style={settings.themeMode === 'light' ? styles.cardLight : undefined}>
            <Text style={[styles.aboutTitle, settings.themeMode === 'light' ? styles.titleLight : null]}>Bomb Defusal Timer</Text>
            <Text style={[styles.aboutText, settings.themeMode === 'light' ? styles.hintLight : null]}>Version 1.0.0</Text>
            <Text style={[styles.aboutText, settings.themeMode === 'light' ? styles.hintLight : null]}>Developer Name</Text>
            <Text style={[styles.aboutText, settings.themeMode === 'light' ? styles.hintLight : null]}>A fast-paced arcade game where you race against the clock to defuse a ticking bomb.</Text>
          </SectionCard>
        </ScrollView>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09090f',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  screen: {
    flex: 1,
    backgroundColor: '#09090f',
    paddingTop: 48,
  },
  screenLight: {
    backgroundColor: '#f8fafc',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  titleLight: {
    color: '#111827',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
  },
  hintLight: {
    color: '#6b7280',
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 6,
  },
  optionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#1f212b',
  },
  optionChipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  optionChipTextSelected: {
    color: '#ffffff',
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: '#ffffff',
  },
  actionButton: {
    backgroundColor: '#1f212b',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  dangerButton: {
    backgroundColor: '#7f1d1d',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  aboutText: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 4,
  },
});

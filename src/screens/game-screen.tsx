import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AnimatedBomb } from '@/components/animated-bomb';
import { AppShell } from '@/components/ui/app-shell';
import { PrimaryButton } from '@/components/ui/primary-button';
import { playSoundEffect, stopSoundEffect, triggerHapticFeedback } from '@/utils/audio';
import {
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
  loadHighScore,
  loadSettings,
  loadStats,
  recordGameResult,
  saveHighScore,
  type DifficultyLevel,
  type GameSettings,
  type GameStats,
} from '@/utils/storage';
import { difficultyOptions, getAccentColor, getDifficultyDuration } from '@/utils/game-config';

export default function GameScreen() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [secretCode, setSecretCode] = useState('');
  const [enteredCode, setEnteredCode] = useState(['', '', '', '']);
  const [isDefused, setIsDefused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Medium');
  const [score, setScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [highScore, setHighScore] = useState(0);
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const timerOpacity = useRef(new Animated.Value(1)).current;
  const explosionScale = useRef(new Animated.Value(0.5)).current;
  const celebrationOpacity = useRef(new Animated.Value(0)).current;
  const loadingSpin = useRef(new Animated.Value(0)).current;
  const scoreValue = useRef(new Animated.Value(0)).current;
  const startGameTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const accentColor = useMemo(() => getAccentColor(settings.accentColor), [settings.accentColor]);
  const difficultyDuration = useMemo(() => getDifficultyDuration(selectedDifficulty), [selectedDifficulty]);

  const shouldPlaySoundEffects = settings.soundEffects && !isMuted;
  const shouldPlayBackgroundAudio = settings.backgroundMusic && settings.soundEffects && !isMuted;

  useEffect(() => {
    const loadPreferences = async () => {
      const savedSettings = await loadSettings();
      setSettings(savedSettings);
      setSelectedDifficulty(savedSettings.defaultDifficulty);
      const savedHighScore = await loadHighScore();
      setHighScore(savedHighScore);
      const savedStats = await loadStats();
      setStats(savedStats);
    };

    void loadPreferences();
  }, []);

  useEffect(() => {
    Animated.timing(scoreValue, {
      toValue: score,
      duration: 320,
      useNativeDriver: false,
    }).start();
  }, [score, scoreValue]);

  useEffect(() => {
    return () => {
      if (startGameTimeout.current) {
        clearTimeout(startGameTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isGameStarted || isDefused || isGameOver) return;
    const intervalId = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          clearInterval(intervalId);
          setIsGameOver(true);
          return 0;
        }
        return currentTime - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isGameStarted, isDefused, isGameOver]);

  useEffect(() => {
    if (isGameStarted && !isDefused && !isGameOver && !isLoading) {
      void playSoundEffect('tick', !shouldPlayBackgroundAudio);
      return () => {
        void stopSoundEffect('tick');
      };
    }
    void stopSoundEffect('tick');
  }, [isGameStarted, isDefused, isGameOver, isLoading, shouldPlayBackgroundAudio]);

  useEffect(() => {
    if (settings.timerFlashWarning && timeLeft <= 10 && isGameStarted && !isDefused && !isGameOver) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(timerOpacity, { toValue: 0.35, duration: 320, useNativeDriver: true }),
          Animated.timing(timerOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    }
    timerOpacity.setValue(1);
  }, [settings.timerFlashWarning, timeLeft, isGameStarted, isDefused, isGameOver, timerOpacity]);

  useEffect(() => {
    if (isLoading) {
      const animation = Animated.loop(
        Animated.timing(loadingSpin, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      );
      animation.start();
      return () => animation.stop();
    }
    loadingSpin.setValue(0);
  }, [isLoading, loadingSpin]);

  useEffect(() => {
    if (isGameOver) {
      if (settings.vibration) void triggerHapticFeedback('warning');
      if (shouldPlaySoundEffects) void playSoundEffect('explosion', false);
      Animated.timing(explosionScale, { toValue: 1.15, duration: 400, useNativeDriver: true }).start();
    }
  }, [isGameOver, settings.vibration, shouldPlaySoundEffects, explosionScale]);

  useEffect(() => {
    if (isDefused) {
      Animated.timing(celebrationOpacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    }
  }, [isDefused, celebrationOpacity]);

  useEffect(() => {
    if (!isDefused && !isGameOver) return;
    const saveProgress = async () => {
      const won = isDefused;
      const nextStats = await recordGameResult(won, won ? score : 0);
      setStats(nextStats);
      const nextHighScore = await saveHighScore(won ? score : 0);
      setHighScore(nextHighScore);
    };
    void saveProgress();
  }, [isDefused, isGameOver, score]);

  const handleButtonPress = useCallback(() => {
    if (shouldPlaySoundEffects) void playSoundEffect('button');
    if (settings.vibration) void triggerHapticFeedback('impact');
  }, [settings.vibration, shouldPlaySoundEffects]);

  const startGame = useCallback(() => {
    handleButtonPress();
    if (startGameTimeout.current) {
      clearTimeout(startGameTimeout.current);
    }

    setIsLoading(true);
    setIsGameStarted(false);
    setIsDefused(false);
    setIsGameOver(false);
    setEnteredCode(['', '', '', '']);
    setStatusMessage('');
    setIsSuccessMessage(false);
    setScore(0);

    startGameTimeout.current = setTimeout(() => {
      const generatedCode = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
      const nextDuration = getDifficultyDuration(selectedDifficulty);
      setSecretCode(generatedCode);
      setTimeLeft(nextDuration);
      setIsGameStarted(true);
      setIsLoading(false);
      startGameTimeout.current = null;
    }, 900);
  }, [handleButtonPress, selectedDifficulty]);

  const defuseBomb = () => {
    if (isGameOver || isDefused) return;
    handleButtonPress();
    const enteredValue = enteredCode.join('');
    if (enteredValue === secretCode) {
      setIsDefused(true);
      setStatusMessage('Bomb defused successfully');
      setIsSuccessMessage(true);
      setScore(timeLeft);
      if (!isMuted) void playSoundEffect('success');
    } else {
      setShakeTrigger((current) => current + 1);
      setStatusMessage('Incorrect code. Try again.');
      setIsSuccessMessage(false);
      if (settings.vibration) void triggerHapticFeedback('warning');
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (isGameOver || isDefused) return;
    const cleanValue = value.replace(/\D/g, '').slice(0, 1);
    const nextCode = [...enteredCode];
    nextCode[index] = cleanValue;
    setEnteredCode(nextCode);
  };

  const progress = (timeLeft / difficultyDuration) * 100;

  return (
    <AppShell title="Bomb Defusal Timer" showHeader>
      <View style={styles.screen}>
        <View style={styles.headerStats}>
          <View style={styles.statChip}>
            <Ionicons name="trophy" size={16} color="#fbbf24" />
            <Text style={styles.statText}>High {highScore}</Text>
          </View>
          <View style={styles.statChip}>
            <Ionicons name="podium" size={16} color="#34d399" />
            <Text style={styles.statText}>Wins {stats.totalWins}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={[styles.timerRow, isTablet && styles.timerRowTablet]}>
            <View style={styles.circularTimerWrapper}>
              <Animated.View style={[styles.circularTimer, { opacity: timerOpacity }]}>
                <Text style={styles.circularTimerText}>{timeLeft}</Text>
              </Animated.View>
            </View>
            <View style={styles.progressColumn}>
              <Text style={styles.label}>Time Remaining</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.max(progress, 5)}%`, backgroundColor: accentColor }]} />
              </View>
              <Text style={styles.subText}>Current difficulty: {selectedDifficulty}</Text>
            </View>
          </View>

          <AnimatedBomb isRunning={isGameStarted && !isDefused && !isGameOver} isGameOver={isGameOver} isDefused={isDefused} shakeTrigger={shakeTrigger} />

          {!isGameStarted && !isLoading ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose your mission</Text>
              <View style={styles.difficultyRow}>
                {difficultyOptions.map((option) => {
                  const isSelected = selectedDifficulty === option.label;
                  return (
                    <Pressable
                      key={option.label}
                      accessibilityRole="button"
                      accessibilityLabel={`Set difficulty ${option.label}`}
                      onPress={() => {
                        handleButtonPress();
                        setSelectedDifficulty(option.label);
                      }}
                      style={[styles.optionCard, isSelected && { borderColor: accentColor, backgroundColor: `${accentColor}22` }]}
                    >
                      <Text style={styles.optionLabel}>{option.label}</Text>
                      <Text style={styles.optionTime}>{option.time}s</Text>
                    </Pressable>
                  );
                })}
              </View>
              <PrimaryButton title="Start Mission" onPress={startGame} accentColor={accentColor} icon={<Ionicons name="play" size={16} color="#fff" />} />
            </View>
          ) : null}

          {isLoading ? (
            <View style={styles.loadingBox}>
              <Animated.View style={[styles.loadingSpinner, { transform: [{ rotate: loadingSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }]} />
              <Text style={styles.loadingTitle}>Preparing mission...</Text>
              <Text style={styles.loadingSubtitle}>Generating your defusal code</Text>
            </View>
          ) : null}

          {isGameStarted && !isDefused && !isGameOver && !isLoading ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Enter the code</Text>
              <View style={styles.inputRow}>
                {enteredCode.map((digit, index) => (
                  <TextInput
                    key={index}
                    accessibilityLabel={`Code input ${index + 1}`}
                    style={styles.inputBox}
                    value={digit}
                    onChangeText={(value) => handleCodeChange(index, value)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    placeholder="0"
                    placeholderTextColor="#6b7280"
                  />
                ))}
              </View>
              <PrimaryButton title="Defuse Bomb" onPress={defuseBomb} accentColor={accentColor} icon={<Ionicons name="shield-checkmark" size={16} color="#fff" />} />
              {statusMessage ? <Text style={isSuccessMessage ? styles.successText : styles.errorText}>{statusMessage}</Text> : null}
            </View>
          ) : null}

          {isGameOver ? (
            <Animated.View style={[styles.resultCard, { transform: [{ scale: explosionScale }] }]}>
              <Text style={styles.resultIcon}>💥</Text>
              <Text style={styles.resultTitle}>Mission Failed</Text>
              <Text style={styles.resultSubtitle}>The bomb detonated before you could enter the code.</Text>
              <Text style={styles.resultScore}>Final Score: {score}</Text>
              <PrimaryButton title="Play Again" onPress={startGame} accentColor={accentColor} icon={<Ionicons name="refresh" size={16} color="#fff" />} />
            </Animated.View>
          ) : null}

          {isDefused ? (
            <Animated.View style={[styles.resultCard, { opacity: celebrationOpacity }]}> 
              <Text style={styles.resultIcon}>🎉</Text>
              <Text style={styles.resultTitle}>Mission Complete</Text>
              <Text style={styles.resultSubtitle}>You defused the bomb and saved the day.</Text>
              <Text style={styles.resultScore}>Bonus Score: {score}</Text>
              <PrimaryButton title="Play Again" onPress={startGame} accentColor={accentColor} icon={<Ionicons name="refresh" size={16} color="#fff" />} />
            </Animated.View>
          ) : null}
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingVertical: 8,
    gap: 6,
  },
  statText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(8, 12, 24, 0.9)',
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    alignItems: 'center',
  },
  timerRow: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    gap: 14,
  },
  timerRowTablet: {
    flexDirection: 'row',
  },
  circularTimerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularTimer: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 8,
    borderColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  circularTimerText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },
  progressColumn: {
    flex: 1,
    width: '100%',
  },
  label: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 6,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#1f2937',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  subText: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 6,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  difficultyRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  optionCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  optionLabel: {
    color: '#fff',
    fontWeight: '800',
  },
  optionTime: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingSpinner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#ff3b30',
    borderTopColor: '#fff',
    marginBottom: 10,
  },
  loadingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  loadingSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 14,
    gap: 8,
  },
  inputBox: {
    flex: 1,
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ff3b30',
    color: '#fff',
    backgroundColor: '#111827',
    fontSize: 24,
    fontWeight: '700',
  },
  successText: {
    color: '#34d399',
    fontWeight: '700',
    marginTop: 8,
  },
  errorText: {
    color: '#fb7185',
    fontWeight: '700',
    marginTop: 8,
  },
  resultCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 18,
  },
  resultIcon: {
    fontSize: 50,
    marginBottom: 8,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  resultSubtitle: {
    color: '#cbd5e1',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
  resultScore: {
    color: '#fff',
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 12,
  },
});

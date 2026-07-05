import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

const soundUrls = {
  tick: 'https://www.soundjay.com/clock/sounds/clock-tick-1.mp3',
  button: 'https://www.soundjay.com/buttons/sounds/button-16.mp3',
  success: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
  explosion: 'https://www.soundjay.com/human/sounds/explosion-01.mp3',
};

const soundCache: Record<string, Audio.Sound | null> = {};
const scheduledStops: Record<string, ReturnType<typeof setTimeout> | null> = {};
let audioModeConfigured = false;

async function ensureAudioReady() {
  if (!audioModeConfigured) {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
    audioModeConfigured = true;
  }
}

export async function playSoundEffect(effect: 'tick' | 'button' | 'success' | 'explosion', muted = false) {
  if (muted) {
    return;
  }

  try {
    await ensureAudioReady();

    const cachedSound = soundCache[effect];
    if (cachedSound) {
      await cachedSound.stopAsync();
      await cachedSound.playFromPositionAsync(0);
      return;
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: soundUrls[effect] },
      {
        shouldPlay: true,
        isLooping: effect === 'tick',
        volume: effect === 'tick' ? 0.2 : 0.5,
      },
    );

    soundCache[effect] = sound;

    if (effect !== 'tick') {
      if (scheduledStops[effect]) {
        clearTimeout(scheduledStops[effect]!);
      }
      scheduledStops[effect] = setTimeout(() => {
        void sound.stopAsync().catch(() => undefined);
        scheduledStops[effect] = null;
      }, 1800);
    }
  } catch (error) {
    // Ignore audio errors so the game keeps running smoothly.
  }
}

export async function stopSoundEffect(effect: 'tick' | 'button' | 'success' | 'explosion') {
  try {
    if (scheduledStops[effect]) {
      clearTimeout(scheduledStops[effect]!);
      scheduledStops[effect] = null;
    }

    const cachedSound = soundCache[effect];
    if (cachedSound) {
      await cachedSound.stopAsync();
    }
  } catch (error) {
    // Ignore cleanup errors.
  }
}

export async function triggerHapticFeedback(type: 'impact' | 'warning' = 'impact') {
  try {
    if (type === 'warning') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  } catch (error) {
    // Ignore haptic errors on unsupported devices.
  }
}

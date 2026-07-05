import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type AnimatedBombProps = {
  isRunning: boolean;
  isGameOver: boolean;
  isDefused: boolean;
  shakeTrigger: number;
};

export function AnimatedBomb({ isRunning, isGameOver, isDefused, shakeTrigger }: AnimatedBombProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const [hasShaken, setHasShaken] = useState(false);

  useEffect(() => {
    if (isRunning && !isGameOver && !isDefused) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.06, duration: 600, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0.98, duration: 600, useNativeDriver: true }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    }

    pulse.setValue(1);
  }, [isRunning, isGameOver, isDefused, pulse]);

  useEffect(() => {
    if (shakeTrigger > 0 && !hasShaken) {
      setHasShaken(true);
      Animated.sequence([
        Animated.timing(translateX, { toValue: -8, duration: 45, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 8, duration: 45, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: -6, duration: 45, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 6, duration: 45, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 0, duration: 45, useNativeDriver: true }),
      ]).start(() => setHasShaken(false));
    }
  }, [shakeTrigger, hasShaken, translateX]);

  return (
    <Animated.View style={[styles.bombWrapper, { transform: [{ scale: pulse }, { translateX }] }]}> 
      <View style={styles.bombGlow} />
      <View style={styles.bombBody}>
        <View style={styles.topBand} />
        <View style={styles.centerRing} />
      </View>
      <View style={styles.fuseWrapper}>
        <View style={styles.fuse} />
        <View style={styles.fuseTip} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bombWrapper: {
    width: 160,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  bombGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#ff3b30',
    opacity: 0.16,
  },
  bombBody: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#1f212b',
    borderWidth: 3,
    borderColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBand: {
    position: 'absolute',
    top: 18,
    width: 70,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff6b5e',
  },
  centerRing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 4,
    borderColor: '#ffb3b3',
  },
  fuseWrapper: {
    position: 'absolute',
    top: 10,
    right: 20,
    width: 30,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fuse: {
    width: 6,
    height: 46,
    borderRadius: 3,
    backgroundColor: '#8c5a00',
  },
  fuseTip: {
    position: 'absolute',
    top: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffb347',
  },
});

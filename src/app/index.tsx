import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/ui/app-shell';
import { PrimaryButton } from '@/components/ui/primary-button';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <AppShell title="Home" showHeader>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1f2937', '#111827', '#09090f']} style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Ionicons name="rocket" size={18} color="#fff" />
            </View>
            <Text style={styles.heroLabel}>Mission ready</Text>
          </View>

          <Text style={styles.heroTitle}>Bomb Defusal Timer</Text>
          <Text style={styles.heroSubtitle}>
            A polished mobile challenge where precision, timing, and calm focus decide the outcome.
          </Text>

          <PrimaryButton
            title="Start Mission"
            onPress={() => router.push('/game')}
            accentColor="#ff3b30"
            icon={<Ionicons name="play" size={16} color="#fff" />}
          />
        </LinearGradient>

        <View style={styles.grid}>
          <View style={styles.featureCard}>
            <Ionicons name="stats-chart" size={22} color="#34d399" />
            <Text style={styles.featureTitle}>Track progress</Text>
            <Text style={styles.featureText}>Review your wins, losses, and best remaining time in one place.</Text>
            <PrimaryButton title="View Stats" onPress={() => router.push('/stats')} accentColor="#34d399" />
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="settings" size={22} color="#3b82f6" />
            <Text style={styles.featureTitle}>Customize play</Text>
            <Text style={styles.featureText}>Tune audio, vibration, difficulty, theme, and accent color to your style.</Text>
            <PrimaryButton title="Open Settings" onPress={() => router.push('/settings')} accentColor="#3b82f6" />
          </View>
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 24,
  },
  heroCard: {
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  heroBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroLabel: {
    color: '#dbeafe',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  grid: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: 'rgba(8, 12, 24, 0.9)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  featureTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 4,
  },
  featureText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
});

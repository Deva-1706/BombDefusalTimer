import { View, Text, StyleSheet } from 'react-native';
import { AppShell } from '@/components/ui/app-shell';
import { DEFAULT_STATS, loadStats } from '@/utils/storage';
import { useEffect, useState } from 'react';

export default function StatsScreen() {
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    const load = async () => {
      const saved = await loadStats();
      setStats(saved);
    };
    void load();
  }, []);

  return (
    <AppShell title="Statistics" showHeader>
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Mission Summary</Text>
          <Text style={styles.metric}>Games Played: {stats.totalGamesPlayed}</Text>
          <Text style={styles.metric}>Wins: {stats.totalWins}</Text>
          <Text style={styles.metric}>Losses: {stats.totalLosses}</Text>
          <Text style={styles.metric}>Best Remaining Time: {stats.bestRemainingTime}s</Text>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  card: {
    backgroundColor: 'rgba(8, 12, 24, 0.9)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 12 },
  metric: { color: '#cbd5e1', fontSize: 15, marginBottom: 8 },
});

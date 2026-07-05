import { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const tabs = [
  { name: 'Home', href: '/', icon: 'home' },
  { name: 'Game', href: '/game', icon: 'flash' },
  { name: 'Statistics', href: '/stats', icon: 'stats-chart' },
  { name: 'Settings', href: '/settings', icon: 'settings' },
] as const;

type AppShellProps = {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
};

export function AppShell({ children, title = 'Bomb Defusal Timer', showHeader = true }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <LinearGradient colors={['#060816', '#12182b', '#1b2140']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        {showHeader ? (
          <View style={styles.header}>
            <View>
              <Text style={styles.headerEyebrow}>Mission Control</Text>
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
            <View style={styles.headerBadge}>
              <Ionicons name="radio" size={16} color="#fff" />
            </View>
          </View>
        ) : null}

        <View style={styles.content}>{children}</View>

        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <TouchableOpacity
                key={tab.href}
                accessibilityRole="button"
                accessibilityLabel={tab.name}
                onPress={() => router.replace(tab.href as never)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
                <Ionicons name={tab.icon as never} size={18} color={isActive ? '#fff' : '#9ca3af'} />
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerEyebrow: {
    color: '#8b9dff',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(5, 8, 20, 0.82)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 999,
    marginHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255,59,48,0.2)',
  },
  tabText: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 3,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
});

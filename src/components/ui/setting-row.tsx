import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SettingRowProps = {
  label: string;
  hint: string;
  isLightTheme?: boolean;
  children: ReactNode;
};

export function SettingRow({ label, hint, isLightTheme = false, children }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingTextBlock}>
        <Text style={[styles.settingLabel, isLightTheme && styles.titleLight]}>{label}</Text>
        <Text style={[styles.settingHint, isLightTheme && styles.hintLight]}>{hint}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  settingTextBlock: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  settingHint: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  titleLight: {
    color: '#111827',
  },
  hintLight: {
    color: '#6b7280',
  },
});

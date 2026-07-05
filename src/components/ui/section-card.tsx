import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SectionCardProps = {
  title: string;
  iconName: string;
  iconColor?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<any>;
  containerStyle?: StyleProp<ViewStyle>;
};

export function SectionCard({
  title,
  iconName,
  iconColor = '#ff3b30',
  children,
  style,
  titleStyle,
  containerStyle,
}: SectionCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardHeader}>
        <Ionicons name={iconName as never} size={20} color={iconColor} />
        <Text style={[styles.cardTitle, titleStyle]}>{title}</Text>
      </View>
      <View style={containerStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(8, 12, 24, 0.9)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

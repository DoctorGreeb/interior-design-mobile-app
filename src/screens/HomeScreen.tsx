import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../constants/theme';
import { roomTemplates } from '../data/furniture';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.md * 3) / 2;

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Привет 👋</Text>
            <Text style={styles.title}>Создай интерьер мечты</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Hero card */}
        <TouchableOpacity
          style={styles.hero}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Planner')}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroEmoji}>🏡</Text>
            <Text style={styles.heroTitle}>Начать новый проект</Text>
            <Text style={styles.heroSub}>Выбери комнату и расставь мебель</Text>
            <View style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>Открыть планировщик</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Room templates */}
        <Text style={styles.sectionTitle}>Шаблоны комнат</Text>
        <View style={styles.grid}>
          {roomTemplates.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={styles.roomCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Planner', { roomId: room.id })}
            >
              <Text style={styles.roomEmoji}>{room.emoji}</Text>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.roomDesc}>{room.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick tips */}
        <Text style={styles.sectionTitle}>Советы дизайнера</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={28} color={colors.secondary} />
          <View style={styles.tipText}>
            <Text style={styles.tipTitle}>Правило 60-30-10</Text>
            <Text style={styles.tipBody}>
              60% — основной цвет, 30% — вторичный, 10% — акцент. Идеальный баланс для любого интерьера.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  heroEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: spacing.md,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    gap: 6,
  },
  heroBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  roomCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  roomEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  roomDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    alignItems: 'flex-start',
    elevation: 1,
  },
  tipText: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  tipBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

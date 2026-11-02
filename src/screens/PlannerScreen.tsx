import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../constants/theme';
import { furniture, roomTemplates, FurnitureItem } from '../data/furniture';

const { width: SCREEN_W } = Dimensions.get('window');
const CANVAS_SIZE = SCREEN_W - spacing.md * 2;
const SCALE = CANVAS_SIZE / 500;

type PlacedItem = {
  id: string;
  item: FurnitureItem;
  x: number;
  y: number;
  rotation: number;
};

export default function PlannerScreen({ route }: any) {
  const roomId = route?.params?.roomId || 'living';
  const room = roomTemplates.find((r) => r.id === roomId) || roomTemplates[0];

  const [placed, setPlaced] = useState<PlacedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);

  const addItem = useCallback((item: FurnitureItem) => {
    const newItem: PlacedItem = {
      id: `${item.id}-${Date.now()}`,
      item,
      x: 40 + Math.random() * 80,
      y: 40 + Math.random() * 80,
      rotation: 0,
    };
    setPlaced((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
    setShowCatalog(false);
  }, []);

  const removeSelected = () => {
    if (!selectedId) return;
    setPlaced((prev) => prev.filter((p) => p.id !== selectedId));
    setSelectedId(null);
  };

  const rotateSelected = () => {
    if (!selectedId) return;
    setPlaced((prev) =>
      prev.map((p) =>
        p.id === selectedId ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    );
  };

  const moveSelected = (dx: number, dy: number) => {
    if (!selectedId) return;
    setPlaced((prev) =>
      prev.map((p) => {
        if (p.id !== selectedId) return p;
        const maxX = CANVAS_SIZE - p.item.width * SCALE;
        const maxY = CANVAS_SIZE - p.item.depth * SCALE;
        return {
          ...p,
          x: Math.max(0, Math.min(maxX, p.x + dx)),
          y: Math.max(0, Math.min(maxY, p.y + dy)),
        };
      })
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{room.emoji} {room.name}</Text>
          <Text style={styles.sub}>{room.description}</Text>
        </View>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => Alert.alert('Сохранено', 'Проект сохранён в «Мои проекты»')}
        >
          <Ionicons name="save-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.canvasWrap}>
        <View style={[styles.canvas, { width: CANVAS_SIZE, height: CANVAS_SIZE }]}>
          {[...Array(5)].map((_, i) => (
            <View key={`h${i}`} style={[styles.gridLineH, { top: (CANVAS_SIZE / 5) * i }]} />
          ))}
          {[...Array(5)].map((_, i) => (
            <View key={`v${i}`} style={[styles.gridLineV, { left: (CANVAS_SIZE / 5) * i }]} />
          ))}

          {placed.map((p) => {
            const w = p.item.width * SCALE;
            const h = p.item.depth * SCALE;
            const selected = selectedId === p.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => setSelectedId(p.id)}
                style={[
                  styles.furniture,
                  {
                    width: w,
                    height: h,
                    left: p.x,
                    top: p.y,
                    backgroundColor: p.item.color + 'CC',
                    borderColor: selected ? colors.secondary : 'transparent',
                    borderWidth: selected ? 3 : 0,
                    transform: [{ rotate: `${p.rotation}deg` }],
                  },
                ]}
              >
                <Text style={styles.furnitureEmoji}>{p.item.emoji}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Move controls */}
      {selectedId && (
        <View style={styles.movePad}>
          <TouchableOpacity style={styles.moveBtn} onPress={() => moveSelected(0, -20)}>
            <Ionicons name="chevron-up" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.moveRow}>
            <TouchableOpacity style={styles.moveBtn} onPress={() => moveSelected(-20, 0)}>
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.moveBtn} onPress={() => moveSelected(20, 0)}>
              <Ionicons name="chevron-forward" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.moveBtn} onPress={() => moveSelected(0, 20)}>
            <Ionicons name="chevron-down" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tools}>
        <TouchableOpacity
          style={[styles.toolBtn, !selectedId && styles.toolDisabled]}
          onPress={rotateSelected}
          disabled={!selectedId}
        >
          <Ionicons name="refresh" size={22} color={selectedId ? colors.primary : '#ccc'} />
          <Text style={styles.toolLabel}>Повернуть</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolBtn, !selectedId && styles.toolDisabled]}
          onPress={removeSelected}
          disabled={!selectedId}
        >
          <Ionicons name="trash-outline" size={22} color={selectedId ? colors.danger : '#ccc'} />
          <Text style={styles.toolLabel}>Удалить</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolBtn, styles.addTool]}
          onPress={() => setShowCatalog(!showCatalog)}
        >
          <Ionicons name="add-circle" size={28} color="#fff" />
          <Text style={[styles.toolLabel, { color: '#fff' }]}>Добавить</Text>
        </TouchableOpacity>
      </View>

      {showCatalog && (
        <View style={styles.miniCatalog}>
          <Text style={styles.miniTitle}>Выбери мебель</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {furniture.slice(0, 10).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.miniItem}
                onPress={() => addItem(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.miniEmoji}>{item.emoji}</Text>
                <Text style={styles.miniName} numberOfLines={1}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.textSecondary },
  saveBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasWrap: { alignItems: 'center', marginVertical: spacing.sm },
  canvas: {
    backgroundColor: colors.roomBg,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  furniture: {
    position: 'absolute',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  furnitureEmoji: { fontSize: 20 },
  movePad: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  moveRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  moveBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    margin: 4,
  },
  tools: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    elevation: 2,
  },
  toolBtn: {
    alignItems: 'center',
    padding: spacing.sm,
    minWidth: 70,
  },
  toolDisabled: { opacity: 0.5 },
  addTool: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  toolLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  miniCatalog: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: spacing.sm,
  },
  miniTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  miniItem: {
    width: 80,
    alignItems: 'center',
    marginRight: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  miniEmoji: { fontSize: 28 },
  miniName: {
    fontSize: 11,
    color: colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
});

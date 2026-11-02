import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { colors, spacing, radius } from '../constants/theme';
import { furniture, roomTemplates, FurnitureItem } from '../data/furniture';

const { width: SCREEN_W } = Dimensions.get('window');
const CANVAS_SIZE = SCREEN_W - spacing.md * 2;
const SCALE = CANVAS_SIZE / 500; // 500cm room base

type PlacedItem = {
  id: string;
  item: FurnitureItem;
  x: number;
  y: number;
  rotation: number;
};

function DraggableItem({
  placed,
  onUpdate,
  onSelect,
  selected,
}: {
  placed: PlacedItem;
  onUpdate: (id: string, x: number, y: number) => void;
  onSelect: (id: string) => void;
  selected: boolean;
}) {
  const translateX = useSharedValue(placed.x);
  const translateY = useSharedValue(placed.y);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
      runOnJS(onSelect)(placed.id);
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    })
    .onEnd(() => {
      // clamp inside canvas
      const maxX = CANVAS_SIZE - placed.item.width * SCALE;
      const maxY = CANVAS_SIZE - placed.item.depth * SCALE;
      translateX.value = withSpring(Math.max(0, Math.min(maxX, translateX.value)));
      translateY.value = withSpring(Math.max(0, Math.min(maxY, translateY.value)));
      runOnJS(onUpdate)(placed.id, translateX.value, translateY.value);
    });

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${placed.rotation}deg` },
    ],
  }));

  const w = placed.item.width * SCALE;
  const h = placed.item.depth * SCALE;

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.furniture,
          {
            width: w,
            height: h,
            backgroundColor: placed.item.color + 'CC',
            borderColor: selected ? colors.secondary : 'transparent',
            borderWidth: selected ? 3 : 0,
          },
          style,
        ]}
      >
        <Text style={styles.furnitureEmoji}>{placed.item.emoji}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

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
      x: 40 + Math.random() * 60,
      y: 40 + Math.random() * 60,
      rotation: 0,
    };
    setPlaced((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
    setShowCatalog(false);
  }, []);

  const updatePos = useCallback((id: string, x: number, y: number) => {
    setPlaced((prev) =>
      prev.map((p) => (p.id === id ? { ...p, x, y } : p))
    );
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
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

      {/* Canvas */}
      <View style={styles.canvasWrap}>
        <View style={[styles.canvas, { width: CANVAS_SIZE, height: CANVAS_SIZE }]}>
          {/* grid */}
          {[...Array(5)].map((_, i) => (
            <View
              key={`h${i}`}
              style={[styles.gridLineH, { top: (CANVAS_SIZE / 5) * i }]}
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <View
              key={`v${i}`}
              style={[styles.gridLineV, { left: (CANVAS_SIZE / 5) * i }]}
            />
          ))}

          {placed.map((p) => (
            <DraggableItem
              key={p.id}
              placed={p}
              onUpdate={updatePos}
              onSelect={setSelectedId}
              selected={selectedId === p.id}
            />
          ))}
        </View>
      </View>

      {/* Tools */}
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

      {/* Mini catalog */}
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  sub: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  saveBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasWrap: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
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
  furnitureEmoji: {
    fontSize: 20,
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
  toolDisabled: {
    opacity: 0.5,
  },
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
  miniEmoji: {
    fontSize: 28,
  },
  miniName: {
    fontSize: 11,
    color: colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
});

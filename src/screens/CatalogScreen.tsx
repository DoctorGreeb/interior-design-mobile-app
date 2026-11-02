import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../constants/theme';
import { furniture, categories, FurnitureItem } from '../data/furniture';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.md * 3) / 2;

export default function CatalogScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return furniture.filter((item) => {
      const matchCat = !selectedCategory || item.category === selectedCategory;
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, search]);

  const renderItem = ({ item }: { item: FurnitureItem }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={[styles.emojiBox, { backgroundColor: item.color + '22' }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.size}>{item.width}×{item.depth} см</Text>
      <Text style={styles.price}>{item.price.toLocaleString('ru-RU')} ₽</Text>
      <TouchableOpacity style={styles.addBtn} activeOpacity={0.7}>
        <Ionicons name="add" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Каталог мебели</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        horizontal
        data={[{ id: null, name: 'Все', emoji: '✨' }, ...categories]}
        keyExtractor={(item) => item.id || 'all'}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cats}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.catChip,
              selectedCategory === item.id && styles.catChipActive,
            ]}
            onPress={() => setSelectedCategory(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.catEmoji}>{item.emoji}</Text>
            <Text
              style={[
                styles.catText,
                selectedCategory === item.id && styles.catTextActive,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Ничего не найдено</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  cats: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.full,
    marginRight: spacing.sm,
    gap: 6,
  },
  catChipActive: {
    backgroundColor: colors.primary,
  },
  catEmoji: {
    fontSize: 16,
  },
  catText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  catTextActive: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  emojiBox: {
    height: 80,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emoji: {
    fontSize: 36,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  size: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 6,
  },
  addBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 40,
    fontSize: 16,
  },
});

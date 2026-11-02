export type FurnitureItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  width: number;  // cm
  depth: number;
  color: string;
  emoji: string;
};

export const categories = [
  { id: 'sofa', name: 'Диваны', emoji: '🛋️' },
  { id: 'table', name: 'Столы', emoji: '🪵' },
  { id: 'chair', name: 'Стулья', emoji: '🪑' },
  { id: 'bed', name: 'Кровати', emoji: '🛏️' },
  { id: 'storage', name: 'Хранение', emoji: '🗄️' },
  { id: 'decor', name: 'Декор', emoji: '🪴' },
];

export const furniture: FurnitureItem[] = [
  { id: '1', name: 'Диван «Лофт»', category: 'sofa', price: 45900, width: 220, depth: 90, color: '#5B4B8A', emoji: '🛋️' },
  { id: '2', name: 'Диван угловой', category: 'sofa', price: 68900, width: 280, depth: 180, color: '#4A5568', emoji: '🛋️' },
  { id: '3', name: 'Кресло «Облако»', category: 'sofa', price: 18900, width: 85, depth: 85, color: '#E8B86D', emoji: '🪑' },
  { id: '4', name: 'Обеденный стол', category: 'table', price: 24900, width: 160, depth: 90, color: '#8B7355', emoji: '🪵' },
  { id: '5', name: 'Журнальный столик', category: 'table', price: 9900, width: 90, depth: 50, color: '#A0522D', emoji: '🪵' },
  { id: '6', name: 'Рабочий стол', category: 'table', price: 15900, width: 120, depth: 60, color: '#2D3748', emoji: '🖥️' },
  { id: '7', name: 'Стул «Сканди»', category: 'chair', price: 5900, width: 45, depth: 50, color: '#F5F5DC', emoji: '🪑' },
  { id: '8', name: 'Барный стул', category: 'chair', price: 7900, width: 40, depth: 40, color: '#1A202C', emoji: '🪑' },
  { id: '9', name: 'Кровать «Королевская»', category: 'bed', price: 54900, width: 180, depth: 200, color: '#5B4B8A', emoji: '🛏️' },
  { id: '10', name: 'Кровать односпальная', category: 'bed', price: 28900, width: 90, depth: 200, color: '#718096', emoji: '🛏️' },
  { id: '11', name: 'Шкаф-купе', category: 'storage', price: 39900, width: 200, depth: 60, color: '#E2E8F0', emoji: '🗄️' },
  { id: '12', name: 'Комод', category: 'storage', price: 14900, width: 100, depth: 45, color: '#A0AEC0', emoji: '🗄️' },
  { id: '13', name: 'Торшер', category: 'decor', price: 6900, width: 40, depth: 40, color: '#ECC94B', emoji: '💡' },
  { id: '14', name: 'Растение в горшке', category: 'decor', price: 2900, width: 30, depth: 30, color: '#48BB78', emoji: '🪴' },
  { id: '15', name: 'Ковёр', category: 'decor', price: 12900, width: 200, depth: 140, color: '#C53030', emoji: '🧶' },
];

export const roomTemplates = [
  { id: 'living', name: 'Гостиная', emoji: '🛋️', width: 500, depth: 400, description: 'Просторная гостиная 20 м²' },
  { id: 'bedroom', name: 'Спальня', emoji: '🛏️', width: 400, depth: 350, description: 'Уютная спальня 14 м²' },
  { id: 'kitchen', name: 'Кухня', emoji: '🍳', width: 350, depth: 300, description: 'Функциональная кухня 10.5 м²' },
  { id: 'office', name: 'Кабинет', emoji: '💼', width: 300, depth: 300, description: 'Домашний офис 9 м²' },
  { id: 'kids', name: 'Детская', emoji: '🧸', width: 350, depth: 350, description: 'Яркая детская 12 м²' },
];

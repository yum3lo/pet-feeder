import {type ReactElement} from 'react';
import {type FlatListProps } from 'react-native';

export type FeedingEntry = { id: string; time: string; amount: string; deviceName: string };
export type FeedingSection = { title: string; date: string; data: FeedingEntry[] };

export type FeedingProps = {
  sections: FeedingSection[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  markedDates: Record<string, object>;
  onRefresh?: () => void;
};

export type MealItem = { id: string; time: string; amount: string; isActive: boolean };

export type MealProps = {
  meals: MealItem[];
  onPressItem: (meal: MealItem) => void;
  onToggle: (id: string, isActive: boolean) => void;
  onAdd: () => void;
  emptyComponent?: ReactElement;
};


export type PagingCarouselHandle = {
  scrollToIndex: (index: number, animated?: boolean) => void;
};

export type PagingCarouselProps<T> = {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number) => ReactElement;
  itemWidth: number;
  onIndexChange?: (index: number) => void;
} & Omit<FlatListProps<T>, 'data' | 'keyExtractor' | 'renderItem' | 'horizontal' | 'pagingEnabled'>;

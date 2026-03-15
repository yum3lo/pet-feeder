import {type ReactElement} from 'react';
import {type FlatListProps } from 'react-native';

export type FeedingEntry = { id: string; time: string; amount: string };
export type FeedingSection = { title: string; data: FeedingEntry[] };

export type FeedingProps = {
  sections: FeedingSection[];
  query: string;
  onQueryChange: (q: string) => void;
  onRefresh?: () => void;
};

export type MealItem = { id: string; time: string; amount: string };

export type MealProps = {
  meals: MealItem[];
  onPressItem: (meal: MealItem) => void;
  onAdd: () => void;
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

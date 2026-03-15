import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ReactElement,
} from 'react';
import { FlatList, type FlatListProps } from 'react-native';

export type PagingCarouselHandle = {
  scrollToIndex: (index: number, animated?: boolean) => void;
};

type Props<T> = {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number) => ReactElement;
  itemWidth: number;
  onIndexChange?: (index: number) => void;
} & Omit<FlatListProps<T>, 'data' | 'keyExtractor' | 'renderItem' | 'horizontal' | 'pagingEnabled'>;

function PagingCarouselInner<T>(
  { data, keyExtractor, renderItem, itemWidth, onIndexChange, ...rest }: Props<T>,
  ref: React.Ref<PagingCarouselHandle>,
) {
  const flatListRef = useRef<FlatList<T>>(null);

  useImperativeHandle(ref, () => ({
    scrollToIndex: (index: number, animated = false) => {
      flatListRef.current?.scrollToIndex({ index, animated });
    },
  }));

  return (
    <FlatList<T>
      ref={flatListRef}
      data={data}
      keyExtractor={keyExtractor}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={itemWidth}
      onMomentumScrollEnd={(e) => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / itemWidth);
        onIndexChange?.(idx);
      }}
      renderItem={({ item, index }) => renderItem(item, index)}
      {...rest}
    />
  );
}

export const PagingCarousel = forwardRef(PagingCarouselInner) as <T>(
  props: Props<T> & { ref?: React.Ref<PagingCarouselHandle> },
) => ReactElement;

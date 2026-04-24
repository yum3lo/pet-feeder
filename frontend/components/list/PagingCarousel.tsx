import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ReactElement,
} from 'react';
import { FlatList} from 'react-native';

import { type PagingCarouselHandle, type PagingCarouselProps } from './types';

type Props<T> = PagingCarouselProps<T>;

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
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={itemWidth}
      snapToAlignment="start"
      disableIntervalMomentum
      getItemLayout={(_: any, index: number) => ({
        length: itemWidth,
        offset: itemWidth * index,
        index,
      })}
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

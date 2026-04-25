import { MealCard } from '@/components';
import { useGetPetSchedules } from '@/services';

import type { ViewStyle } from 'react-native';

type Props = {
  petId: number;
  petName: string;
  cardStyle?: ViewStyle;
};

export default function MealCardWithSchedule({ petId, petName, cardStyle }: Props) {
  const { data: schedules = [] } = useGetPetSchedules(petId);
  const nextMeal = schedules[0] ?? null;
  return (
    <MealCard
      petName={petName}
      time={nextMeal?.time ?? '—'}
      amount={nextMeal?.portionSize}
      cardStyle={cardStyle}
    />
  );
}

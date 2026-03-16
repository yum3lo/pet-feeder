import { MealCard } from '@/components';
import { useGetCatSchedules } from '@/services';

type Props = {
  catId: number;
  catName: string;
};

export default function MealCardWithSchedule({ catId, catName }: Props) {
  const { data: schedules = [] } = useGetCatSchedules(catId);
  const nextMeal = schedules[0] ?? null;
  return (
    <MealCard
      catName={catName}
      time={nextMeal?.time ?? '—'}
      amount={nextMeal?.amount}
    />
  );
}

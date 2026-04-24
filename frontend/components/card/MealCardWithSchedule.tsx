import { MealCard } from '@/components';
import { useGetPetSchedules } from '@/services';

type Props = {
  petId: number;
  petName: string;
};

export default function MealCardWithSchedule({ petId, petName }: Props) {
  const { data: schedules = [] } = useGetPetSchedules(petId);
  const nextMeal = schedules[0] ?? null;
  return (
    <MealCard
      petName={petName}
      time={nextMeal?.time ?? '—'}
      amount={nextMeal?.amount}
    />
  );
}

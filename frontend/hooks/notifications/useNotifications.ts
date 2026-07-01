import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { api } from '@/services/api';
import { useGetPets } from '@/services';
import { type Schedule } from '@/types';
import { toCapitalize } from '@/utils';

async function scheduleRealFeedingReminders(pets: { id: number; name: string }[]) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const allSchedules = await Promise.all(
    pets.map(async (pet) => {
      try {
        const { data } = await api.get<Schedule[]>(`/feeding/schedules/pet/${pet.id}`);
        return data
          .filter((s) => s.isActive)
          .map((s) => ({ petName: pet.name, time: s.time }));
      } catch {
        return [];
      }
    }),
  );

  for (const { petName, time } of allSchedules.flat()) {
    const [hStr, mStr] = time.split(':');
    let hour = parseInt(hStr, 10);
    let minute = parseInt(mStr, 10) - 10;

    if (minute < 0) {
      minute += 60;
      hour = (hour - 1 + 24) % 24;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Smart Pet Feeder',
        body: `Feeding ${toCapitalize(petName)} in 10 minutes`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  }
}

export function useNotifications() {
  const { data: pets = [] } = useGetPets();

  useEffect(() => {
    if (pets.length > 0) {
      scheduleRealFeedingReminders(pets);
    }
  }, [pets]);
}

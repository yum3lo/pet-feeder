import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';

import { getMockAllSchedules } from '@/services';
import { toCapitalize } from '@/utils';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const LOW_FOOD_THRESHOLD_G = 20;

async function scheduleFeeedingReminders() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const schedules = await getMockAllSchedules();

  for (const { petName, time } of schedules) {
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

export function useNotifications(foodWeightGrams: number) {
  const lowFoodNotified = useRef(false);

  useEffect(() => {
    scheduleFeeedingReminders();
  }, []);

  useEffect(() => {
    if (foodWeightGrams < LOW_FOOD_THRESHOLD_G && !lowFoodNotified.current) {
      lowFoodNotified.current = true;
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Smart Pet Feeder',
          body: 'Food tank low. Please refill soon',
        },
        trigger: null,
      });
    } else if (foodWeightGrams >= LOW_FOOD_THRESHOLD_G) {
      lowFoodNotified.current = false;
    }
  }, [foodWeightGrams]);
}

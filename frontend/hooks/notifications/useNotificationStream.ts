import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef } from 'react';

import { TOKEN_KEY } from '@/constants';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
const RECONNECT_DELAY_MS = 5_000;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotificationStream() {
  const abortRef = useRef<AbortController | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;

    async function connect() {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token || !active) return;

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted' || !active) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(`${BASE_URL}/notifications/stream`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          scheduleReconnect();
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (active) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE messages are separated by double newlines
          const messages = buffer.split('\n\n');
          buffer = messages.pop() ?? '';

          for (const message of messages) {
            const dataLine = message
              .split('\n')
              .find((line) => line.startsWith('data:'));

            if (!dataLine) continue;

            try {
              const payload = JSON.parse(dataLine.slice(5).trim());
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Smart Pet Feeder',
                  body: payload.message ?? 'New notification',
                },
                trigger: null,
              });
            } catch {
              // ignore malformed events
            }
          }
        }

        if (active) scheduleReconnect();
      } catch (err: unknown) {
        if (active && !(err instanceof Error && err.name === 'AbortError')) {
          scheduleReconnect();
        }
      }
    }

    function scheduleReconnect() {
      if (!active) return;
      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY_MS);
    }

    connect();

    return () => {
      active = false;
      abortRef.current?.abort();
      if (reconnectTimer.current !== null) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, []);
}

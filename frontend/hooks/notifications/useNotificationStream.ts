import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef } from 'react';

import { TOKEN_KEY } from '@/constants';
import { notificationEmitter } from '@/utils';

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
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    let processedLength = 0;

    async function connect() {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token || !active) return;

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted' || !active) return;

      xhrRef.current?.abort();
      processedLength = 0;

      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      let buffer = '';

      function processChunk(newText: string) {
        buffer += newText;
        const messages = buffer.split('\n\n');
        buffer = messages.pop() ?? '';

        for (const message of messages) {
          const dataLine = message
            .split('\n')
            .find((line) => line.startsWith('data:'));

          if (!dataLine) continue;

          try {
            const payload = JSON.parse(dataLine.slice(5).trim());

            if (payload.type) {
              notificationEmitter.emit(payload.type, payload);
            } else {
              Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Smart Pet Feeder',
                  body: payload.message ?? 'New notification',
                },
                trigger: null,
              });
            }
          } catch {
            // ignore malformed events
          }
        }
      }

      xhr.open('GET', `${BASE_URL}/notifications/stream`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Accept', 'text/event-stream');
      xhr.setRequestHeader('Cache-Control', 'no-cache');

      xhr.onprogress = () => {
        const newText = xhr.responseText.slice(processedLength);
        processedLength = xhr.responseText.length;
        if (newText) processChunk(newText);
      };

      xhr.onload = () => {
        if (active) scheduleReconnect();
      };

      xhr.onerror = () => {
        if (active) scheduleReconnect();
      };

      xhr.send();
    }

    function scheduleReconnect() {
      if (!active) return;
      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY_MS);
    }

    connect();

    return () => {
      active = false;
      xhrRef.current?.abort();
      if (reconnectTimer.current !== null) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, []);
}

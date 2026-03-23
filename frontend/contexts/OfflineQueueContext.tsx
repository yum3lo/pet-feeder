import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { BackOnlineModal } from '@/components';
import { useSharedNetworkStatus, useToast  } from '@/contexts';
import { createPet, deletePet, updatePet, uploadPetImage } from '@/services';

import type { CreatePetPayload } from '@/types';


export type OfflineOp =
  | { type: 'createPet'; payload: CreatePetPayload & { photo?: string } }
  | { type: 'updatePet'; payload: { id: number } & Partial<CreatePetPayload> & { photo?: string } }
  | { type: 'deletePet'; payload: { id: number } };

type OfflineQueueContextValue = {
  enqueue: (op: OfflineOp) => Promise<void>;
};

const QUEUE_KEY = 'offline_op_queue';

async function readQueue(): Promise<OfflineOp[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? (JSON.parse(raw) as OfflineOp[]) : [];
}

async function writeQueue(ops: OfflineOp[]): Promise<void> {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(ops));
}

const OfflineQueueContext = createContext<OfflineQueueContextValue | null>(null);

export function OfflineQueueProvider({ children }: { children: ReactNode }) {
  const { isOnline } = useSharedNetworkStatus();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const wasOnlineRef = useRef(true);
  const [syncedCount, setSyncedCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {

    if (!isOnline) {
      wasOnlineRef.current = false;
      return;
    }

    const cameBackOnline = !wasOnlineRef.current;
    wasOnlineRef.current = true;

    const processQueue = async () => {
      const ops = await readQueue();
      if (ops.length === 0) {
        if (cameBackOnline) {
          showToast("You're back online", 'success', 'bottom');
        }
        return;
      }

      const remaining: OfflineOp[] = [];
      let successCount = 0;

      for (const op of ops) {
        try {
          if (op.type === 'createPet') {
            const { photo, ...petPayload } = op.payload;
            const cat = await createPet(petPayload);
            if (photo) await uploadPetImage({ id: cat.id, uri: photo });
            successCount += 1;
          } else if (op.type === 'updatePet') {
            const { photo, ...petPayload } = op.payload;
            await updatePet(petPayload);
            if (photo) await uploadPetImage({ id: petPayload.id, uri: photo });
            successCount += 1;
          } else if (op.type === 'deletePet') {
            await deletePet(op.payload.id);
            successCount += 1;
          }
        } catch (e: any) {
          const status = e?.response?.status;
          const responseData = e?.response?.data;
          // Only retry on network errors or 5xx — discard permanent 4xx failures
          if (!status || status >= 500) {
            remaining.push(op);
          }
          if (status && status >= 400 && status < 500) {
            showToast(`Sync failed (${status}): ${responseData?.message ?? e?.message}`, 'error');
          }
        }
      }

      await writeQueue(remaining);

      if (successCount > 0) {
        queryClient.invalidateQueries({ queryKey: ['cats'] });
        setSyncedCount(successCount);
        setModalVisible(true);
      }
    };

    processQueue();
  }, [isOnline, queryClient]);

  const enqueue = async (op: OfflineOp): Promise<void> => {
    const ops = await readQueue();
    ops.push(op);
    await writeQueue(ops);
  };

  return (
    <OfflineQueueContext.Provider value={{ enqueue }}>
      {children}
      <BackOnlineModal
        visible={modalVisible}
        syncedCount={syncedCount}
        onClose={() => setModalVisible(false)}
      />
    </OfflineQueueContext.Provider>
  );
}

export function useOfflineQueue() {
  const ctx = useContext(OfflineQueueContext);
  if (!ctx) throw new Error('useOfflineQueue must be used inside OfflineQueueProvider');
  return ctx;
}

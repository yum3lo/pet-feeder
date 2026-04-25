export interface Schedule {
  id: number;
  time: string;        // "HH:mm"
  portionSize: number; // grams
  isActive: boolean;
  deviceId: string;
}

export interface FeedingRecord {
  time: string;   // "HH:mm"
  amount: number; // grams
}

export interface FeedingHistoryEntry {
  id: number;
  petId: number;
  deviceId: string;
  scheduledGrams: number;
  dispensedGrams: number;
  consumedGrams: number | null;
  leftoverGrams: number | null;
  feedingType: string;
  status: string;
  timestamp: string; // ISO
}
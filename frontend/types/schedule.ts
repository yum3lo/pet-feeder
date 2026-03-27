export interface Schedule {
  id: number;
  time: string;   // "HH:mm"
  amount: number; // grams
}

export interface FeedingRecord {
  time: string;   // "HH:mm"
  amount: number; // grams
}

export interface FeedingHistoryEntry {
  id: string;
  date: string;         
  feedings: FeedingRecord[];
}
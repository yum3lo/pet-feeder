export interface Schedule {
    time: string; // "HH:mm" format
    amount: number; // grams
}

export interface FeedingHistory {}

export interface Pet {
    id: string;
    name: string;
    photoUrl: string;
    schedule: Schedule[];
    history: FeedingHistory[];
}

export interface AppState {
    pet: Pet | null;
    loading: boolean;
    error: string | null;
}
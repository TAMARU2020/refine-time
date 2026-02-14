export interface Appointment {
  id: string;
  name: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  note?: string;
  createdAt: string;
}

export interface BlockedSlot {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM — if undefined, whole day is blocked
}

export interface AppSettings {
  slotDuration: number; // default 30
  workingHours: {
    start: string; // "09:00"
    end: string;   // "19:00"
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  slotDuration: 30,
  workingHours: {
    start: "09:00",
    end: "19:00",
  },
};

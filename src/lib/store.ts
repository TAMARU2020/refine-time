import { Appointment, BlockedSlot, AppSettings, DEFAULT_SETTINGS } from "@/types/appointment";

const KEYS = {
  appointments: "barbershop_appointments",
  blocked: "barbershop_blocked",
  settings: "barbershop_settings",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Appointments
export function getAppointments(): Appointment[] {
  return load<Appointment[]>(KEYS.appointments, []);
}

export function addAppointment(appt: Appointment): void {
  const all = getAppointments();
  all.push(appt);
  save(KEYS.appointments, all);
}

export function deleteAppointment(id: string): void {
  const all = getAppointments().filter((a) => a.id !== id);
  save(KEYS.appointments, all);
}

export function getAppointmentsByPhone(phone: string): Appointment[] {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  return getAppointments().filter(
    (a) => a.phone === phone && a.date >= today
  );
}

export function getAppointmentsByDate(date: string): Appointment[] {
  return getAppointments().filter((a) => a.date === date);
}

// Blocked slots
export function getBlockedSlots(): BlockedSlot[] {
  return load<BlockedSlot[]>(KEYS.blocked, []);
}

export function addBlockedSlot(slot: BlockedSlot): void {
  const all = getBlockedSlots();
  all.push(slot);
  save(KEYS.blocked, all);
}

export function removeBlockedSlot(id: string): void {
  const all = getBlockedSlots().filter((s) => s.id !== id);
  save(KEYS.blocked, all);
}

export function isDayBlocked(date: string): boolean {
  return getBlockedSlots().some((s) => s.date === date && !s.time);
}

export function isSlotBlocked(date: string, time: string): boolean {
  return getBlockedSlots().some(
    (s) => s.date === date && (s.time === time || !s.time)
  );
}

// Settings
export function getSettings(): AppSettings {
  return load<AppSettings>(KEYS.settings, DEFAULT_SETTINGS);
}

export function updateSettings(settings: Partial<AppSettings>): void {
  const current = getSettings();
  save(KEYS.settings, { ...current, ...settings });
}

// Time slot generation
export function generateTimeSlots(date: string): string[] {
  const settings = getSettings();
  const appointments = getAppointmentsByDate(date);
  const { start, end } = settings.workingHours;
  const duration = settings.slotDuration;

  const slots: string[] = [];
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  const startMin = startH * 60 + startM;
  const endMin = endH * 60 + endM;

  for (let m = startMin; m + duration <= endMin; m += duration) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const timeStr = `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;

    // Check if blocked
    if (isSlotBlocked(date, timeStr)) continue;

    // Check if overlaps with existing appointment
    const overlaps = appointments.some((appt) => {
      const [ah, am] = appt.time.split(":").map(Number);
      const apptStart = ah * 60 + am;
      const apptEnd = apptStart + appt.duration;
      const slotStart = m;
      const slotEnd = m + duration;
      return slotStart < apptEnd && slotEnd > apptStart;
    });

    if (!overlaps) {
      slots.push(timeStr);
    }
  }

  return slots;
}

// Occupancy calculation
export function getDayOccupancy(date: string): number {
  const settings = getSettings();
  const { start, end } = settings.workingHours;
  const duration = settings.slotDuration;
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
  const totalSlots = Math.floor(totalMinutes / duration);

  if (isDayBlocked(date)) return 100;

  const appointments = getAppointmentsByDate(date);
  const blockedSlots = getBlockedSlots().filter(
    (s) => s.date === date && s.time
  );

  const occupied = appointments.length + blockedSlots.length;
  return Math.min(100, Math.round((occupied / totalSlots) * 100));
}

// Check if a date has any availability
export function hasAvailability(date: string): boolean {
  if (isDayBlocked(date)) return false;
  return generateTimeSlots(date).length > 0;
}

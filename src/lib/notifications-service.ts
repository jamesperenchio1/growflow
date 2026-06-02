import { db } from '@/lib/db';

const SCHEDULED_KEY = 'growflow-scheduled-notifications';

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  timeoutId: ReturnType<typeof setTimeout>;
}

let scheduled: ScheduledNotification[] = [];

try {
  const stored = localStorage.getItem(SCHEDULED_KEY);
  if (stored) {
    const parsed = JSON.parse(stored) as Array<{ id: string; title: string; body: string; scheduledAt: number; delayMs: number }>;
    const now = Date.now();
    for (const item of parsed) {
      const remaining = item.scheduledAt + item.delayMs - now;
      if (remaining > 0) {
        const timeoutId = setTimeout(() => {
          sendNotification(item.title, item.body);
          removeScheduled(item.id);
        }, remaining);
        scheduled.push({ id: item.id, title: item.title, body: item.body, timeoutId });
      }
    }
  }
} catch {
  // ignore localStorage errors
}

function persistScheduled() {
  try {
    const serializable = scheduled.map((s) => ({
      id: s.id,
      title: s.title,
      body: s.body,
    }));
    localStorage.setItem(SCHEDULED_KEY, JSON.stringify(serializable));
  } catch {
    // ignore
  }
}

function removeScheduled(id: string) {
  scheduled = scheduled.filter((s) => s.id !== id);
  persistScheduled();
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return 'denied';
  }
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export function sendNotification(title: string, body: string, options?: NotificationOptions): boolean {
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: options?.tag ?? title,
      ...options,
    });
    return true;
  } catch {
    return false;
  }
}

export function scheduleNotification(title: string, body: string, delayMs: number): string {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const timeoutId = setTimeout(() => {
    sendNotification(title, body);
    removeScheduled(id);
  }, delayMs);

  scheduled.push({ id, title, body, timeoutId });
  persistScheduled();
  return id;
}

export function cancelScheduledNotification(id: string): boolean {
  const item = scheduled.find((s) => s.id === id);
  if (!item) return false;
  clearTimeout(item.timeoutId);
  removeScheduled(id);
  return true;
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const row = await db.settings.get('notifications');
    if (row && typeof row.value === 'object' && row.value !== null) {
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...(row.value as NotificationSettings) };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_NOTIFICATION_SETTINGS };
}

export async function setNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
  const current = await getNotificationSettings();
  const next = { ...current, ...settings };
  await db.settings.put({ key: 'notifications', value: next });
}

export interface NotificationSettings {
  enabled: boolean;
  taskReminders: boolean;
  overdueTaskAlerts: boolean;
  iotOutOfRangeAlerts: boolean;
  harvestWindowReminders: boolean;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  taskReminders: true,
  overdueTaskAlerts: true,
  iotOutOfRangeAlerts: true,
  harvestWindowReminders: true,
};

'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  isNotificationSupported,
  requestNotificationPermission,
  getNotificationPermission,
  sendNotification,
  getNotificationSettings,
  setNotificationSettings,
  type NotificationSettings,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '@/lib/notifications-service';

interface UseNotificationsResult {
  permission: NotificationPermission;
  isSupported: boolean;
  settings: NotificationSettings;
  loading: boolean;
  requestPermission: () => Promise<void>;
  send: (title: string, body: string) => boolean;
  updateSettings: (partial: Partial<NotificationSettings>) => Promise<void>;
}

export function useNotifications(): UseNotificationsResult {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [loading, setLoading] = useState(true);
  const isSupported = isNotificationSupported();

  useEffect(() => {
    if (isSupported) {
      setPermission(getNotificationPermission());
    }
    getNotificationSettings()
      .then((s) => setSettings(s))
      .finally(() => setLoading(false));
  }, [isSupported]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return;
    const result = await requestNotificationPermission();
    setPermission(result);
  }, [isSupported]);

  const send = useCallback((title: string, body: string) => {
    return sendNotification(title, body);
  }, []);

  const updateSettings = useCallback(async (partial: Partial<NotificationSettings>) => {
    await setNotificationSettings(partial);
    const next = await getNotificationSettings();
    setSettings(next);
  }, []);

  return {
    permission,
    isSupported,
    settings,
    loading,
    requestPermission,
    send,
    updateSettings,
  };
}

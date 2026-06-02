'use client';

import { useEffect, useRef } from 'react';
import { usePlants } from '@/hooks/use-plants';
import { useTasks } from '@/hooks/use-tasks';
import { useWeather } from '@/hooks/use-weather';
import {
  sendNotification,
  getNotificationSettings,
  scheduleNotification,
} from '@/lib/notifications-service';
import { db } from '@/lib/db';
import { isBefore, startOfDay, addDays, differenceInDays } from 'date-fns';

const HARVEST_CHECK_KEY = 'growflow-last-harvest-check';
const TASK_REMINDER_KEY = 'growflow-last-task-reminder';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { plants } = usePlants();
  const { tasks } = useTasks('today');
  const { weather, alerts } = useWeather();

  const alertedHazardsRef = useRef<Set<string>>(new Set());

  // Load previously alerted hazards from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('growflow-alerted-hazards');
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        alertedHazardsRef.current = new Set(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist alerted hazards
  useEffect(() => {
    try {
      localStorage.setItem(
        'growflow-alerted-hazards',
        JSON.stringify(Array.from(alertedHazardsRef.current))
      );
    } catch {
      // ignore
    }
  }, [weather]);

  // Weather hazard notifications
  useEffect(() => {
    if (!alerts || alerts.length === 0) return;

    getNotificationSettings().then((settings) => {
      if (!settings.enabled) return;

      for (const alert of alerts) {
        const alertKey = `${alert.type}-${alert.severity}-${alert.title}`;
        if (alertedHazardsRef.current.has(alertKey)) continue;

        let title = '';
        let body = '';

        switch (alert.type) {
          case 'heatwave':
            title = `🌡️ ${alert.title}`;
            body = `${alert.description} ${alert.farmingAction.slice(0, 80)}...`;
            break;
          case 'flooding':
          case 'monsoon':
            title = `🌧️ ${alert.title}`;
            body = `${alert.description} ${alert.farmingAction.slice(0, 80)}...`;
            break;
          case 'drought':
            title = `☀️ ${alert.title}`;
            body = `${alert.description} ${alert.farmingAction.slice(0, 80)}...`;
            break;
          case 'fungal_risk':
            title = `🍄 ${alert.title}`;
            body = `${alert.description} ${alert.farmingAction.slice(0, 80)}...`;
            break;
          case 'typhoon':
            title = `🌪️ ${alert.title}`;
            body = `${alert.description} ${alert.farmingAction.slice(0, 80)}...`;
            break;
        }

        if (title) {
          sendNotification(title, body);
          alertedHazardsRef.current.add(alertKey);
        }
      }

      try {
        localStorage.setItem(
          'growflow-alerted-hazards',
          JSON.stringify(Array.from(alertedHazardsRef.current))
        );
      } catch {
        // ignore
      }
    });
  }, [alerts]);

  // Daily task reminders at 8 AM
  useEffect(() => {
    if (tasks.length === 0) return;

    getNotificationSettings().then((settings) => {
      if (!settings.enabled || !settings.taskReminders) return;

      const now = new Date();
      const today8am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
      if (isBefore(now, today8am)) {
        const delayMs = today8am.getTime() - now.getTime();
        const lastCheck = localStorage.getItem(TASK_REMINDER_KEY);
        const todayKey = startOfDay(now).toISOString();
        if (lastCheck !== todayKey) {
          scheduleNotification(
            '🌱 Task Reminder',
            `${tasks.length} task${tasks.length > 1 ? 's' : ''} due today — Check your garden`,
            delayMs
          );
          localStorage.setItem(TASK_REMINDER_KEY, todayKey);
        }
      }
    });
  }, [tasks]);

  // Harvest window reminders (3 days before expected harvest)
  useEffect(() => {
    if (plants.length === 0) return;

    getNotificationSettings().then((settings) => {
      if (!settings.enabled || !settings.harvestWindowReminders) return;

      const now = new Date();
      const todayKey = startOfDay(now).toISOString();
      const lastCheck = localStorage.getItem(HARVEST_CHECK_KEY);
      if (lastCheck === todayKey) return;

      db.yieldReferences.toArray().then((refs) => {
        for (const plant of plants) {
          const ref = refs.find((r) => r.plantName.toLowerCase() === plant.name.toLowerCase());
          if (!ref) continue;

          const planted = new Date(plant.plantedDate);
          const expectedHarvest = addDays(planted, ref.daysToFirstHarvest);
          const daysUntil = differenceInDays(expectedHarvest, now);

          if (daysUntil === 3) {
            sendNotification(
              '🥬 Harvest Window Approaching',
              `${plant.name} harvest window opens in 3 days`
            );
          }
        }
        localStorage.setItem(HARVEST_CHECK_KEY, todayKey);
      });
    });
  }, [plants]);

  return <>{children}</>;
}

'use client';

import { useState } from 'react';
import { X, AlertTriangle, CloudRain, Sun, Wind, Droplets, CloudLightning } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ThaiHazard } from '@/types';

interface AlertBannerProps {
  alerts: ThaiHazard[];
  onViewAll?: () => void;
}

const severityConfig = {
  extreme: {
    border: 'border-l-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    iconBg: 'bg-rose-100 dark:bg-rose-950/40',
    iconColor: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    label: 'Extreme',
  },
  high: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    iconBg: 'bg-amber-100 dark:bg-amber-950/40',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    label: 'High',
  },
  moderate: {
    border: 'border-l-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
    iconBg: 'bg-yellow-100 dark:bg-yellow-950/40',
    iconColor: 'text-yellow-600',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300',
    label: 'Moderate',
  },
  low: {
    border: 'border-l-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    iconBg: 'bg-blue-100 dark:bg-blue-950/40',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    label: 'Low',
  },
};

function HazardIcon({ type }: { type: ThaiHazard['type'] }) {
  switch (type) {
    case 'heatwave':
      return <Sun className="size-5" />;
    case 'flooding':
    case 'monsoon':
      return <CloudRain className="size-5" />;
    case 'drought':
      return <Droplets className="size-5" />;
    case 'fungal_risk':
      return <CloudLightning className="size-5" />;
    case 'typhoon':
      return <Wind className="size-5" />;
    default:
      return <AlertTriangle className="size-5" />;
  }
}

export function AlertBanner({ alerts, onViewAll }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!alerts.length || dismissed) return null;

  const topAlert = alerts[0];
  const config = severityConfig[topAlert.severity];

  return (
    <div
      className={cn(
        'relative rounded-xl border-0 shadow-sm border-l-4 p-4 mb-5',
        config.border,
        config.bg
      )}
    >
      <div className="flex items-start gap-3 pr-8">
        <div className={cn('icon-circle size-9 shrink-0', config.iconBg, config.iconColor)}>
          <HazardIcon type={topAlert.type} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm">{topAlert.title}</h4>
            <Badge className={cn('text-[10px] px-1.5 py-0', config.badge)}>{config.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{topAlert.description}</p>
          <p className="text-xs mt-1.5 opacity-80">
            <span className="font-medium">Action:</span> {topAlert.farmingAction}
          </p>
          {alerts.length > 1 && (
            <p className="text-xs text-muted-foreground mt-1">
              +{alerts.length - 1} more alert{alerts.length > 2 ? 's' : ''}
            </p>
          )}
        </div>
        {onViewAll && (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-xs h-7 px-2"
            onClick={onViewAll}
          >
            View All
          </Button>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss alert"
      >
        <X className="size-4 text-muted-foreground" />
      </button>
    </div>
  );
}

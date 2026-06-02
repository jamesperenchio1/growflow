"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface GrowthChartProps {
  data: ChartDataPoint[];
  title: string;
  unit?: string;
  color?: string;
  type?: "line" | "area" | "bar";
  thresholdMin?: number;
  thresholdMax?: number;
  className?: string;
  height?: number;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function ChartTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: Array<{ value: number; color: string }>;
  label?: string;
  unit?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-sm">
      <p className="text-xs text-muted-foreground mb-1">
        {label ? formatDate(label) : ""}
      </p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.value}
          {unit}
        </p>
      ))}
    </div>
  );
}

export function GrowthChart({
  data,
  title,
  unit = "",
  color = "hsl(158 64% 42%)",
  type = "line",
  thresholdMin,
  thresholdMax,
  className,
  height = 240,
}: GrowthChartProps) {
  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [data]);

  const gridColor = "hsl(var(--border))";
  const tickColor = "hsl(var(--muted-foreground))";

  const commonElements = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
      <XAxis
        dataKey="date"
        tickFormatter={formatDate}
        tick={{ fontSize: 11, fill: tickColor }}
        axisLine={{ stroke: gridColor }}
        tickLine={false}
      />
      <YAxis
        tick={{ fontSize: 11, fill: tickColor }}
        axisLine={false}
        tickLine={false}
        width={40}
        unit={unit}
      />
      <Tooltip content={<ChartTooltip unit={unit} />} />
      {thresholdMin !== undefined && (
        <ReferenceLine
          y={thresholdMin}
          stroke="hsl(38 92% 50%)"
          strokeDasharray="4 4"
        />
      )}
      {thresholdMax !== undefined && (
        <ReferenceLine
          y={thresholdMax}
          stroke="hsl(38 92% 50%)"
          strokeDasharray="4 4"
        />
      )}
    </>
  );

  return (
    <div className={cn("w-full", className)}>
      <p className="text-sm font-medium mb-3">{title}</p>
      <ResponsiveContainer width="100%" height={height}>
        {type === "area" ? (
          <AreaChart
            data={sortedData}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            {commonElements}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.15}
              strokeWidth={2}
              dot={{ r: 3, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        ) : type === "bar" ? (
          <BarChart
            data={sortedData}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            {commonElements}
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart
            data={sortedData}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            {commonElements}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

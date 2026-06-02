"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  LayoutDashboard,
  Grid3x3,
  Leaf,
  CheckCircle2,
  CalendarDays,
  FlaskConical,
  Pipette,
  Cpu,
  CloudSun,
  BookOpen,
  Bug,
  Settings,
  Sprout,
  CheckSquare,
  MapPin,
  ShieldAlert,
  Flower2,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGlobalSearch,
  type SearchResult,
  getRecentSearches,
  addRecentSearch,
} from "@/hooks/use-global-search";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Grid3x3,
  Leaf,
  CheckCircle2,
  CalendarDays,
  FlaskConical,
  Pipette,
  Cpu,
  CloudSun,
  BookOpen,
  Bug,
  Settings,
  Sprout,
  CheckSquare,
  MapPin,
  ShieldAlert,
  Flower2,
};

function SearchIcon({ name }: { name: string }) {
  const Icon = iconMap[name] || Search;
  return <Icon className="size-4 shrink-0" />;
}

type GroupKey = SearchResult["type"];

const groupOrder: GroupKey[] = ["page", "plant", "task", "space", "reference"];

const groupLabels: Record<GroupKey, string> = {
  page: "Pages",
  plant: "My Plants",
  task: "Tasks",
  space: "Spaces",
  reference: "Reference",
};

function groupResults(results: SearchResult[]): Record<GroupKey, SearchResult[]> {
  const groups: Record<GroupKey, SearchResult[]> = {
    page: [],
    plant: [],
    task: [],
    space: [],
    reference: [],
  };
  results.forEach((r) => {
    groups[r.type].push(r);
  });
  return groups;
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const q = query.trim().toLowerCase();
  const parts: (string | React.ReactElement)[] = [];
  let remaining = text;
  let idx = remaining.toLowerCase().indexOf(q);
  let key = 0;
  while (idx !== -1 && remaining.length > 0) {
    if (idx > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
    }
    parts.push(
      <mark key={key++} className="bg-transparent text-emerald-600 dark:text-emerald-400 font-semibold">
        {remaining.slice(idx, idx + q.length)}
      </mark>
    );
    remaining = remaining.slice(idx + q.length);
    idx = remaining.toLowerCase().indexOf(q);
  }
  if (remaining.length > 0) {
    parts.push(<span key={key++}>{remaining}</span>);
  }
  return <>{parts}</>;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { query, setQuery, results, loading } = useGlobalSearch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const groups = useMemo(() => groupResults(results), [results]);

  const flatResults = useMemo(() => {
    const arr: SearchResult[] = [];
    groupOrder.forEach((key) => {
      arr.push(...groups[key]);
    });
    return arr;
  }, [groups]);

  useEffect(() => {
    if (open) {
      setSelectedIndex(0);
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, results]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      addRecentSearch(result.title);
      onOpenChange(false);
      setQuery("");
      if (result.href) {
        router.push(result.href);
      } else if (result.action) {
        result.action();
      }
    },
    [onOpenChange, router, setQuery]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < flatResults.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : flatResults.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const result = flatResults[selectedIndex];
        if (result) {
          handleSelect(result);
        }
      } else if (e.key === "Escape") {
        onOpenChange(false);
      } else if (/^[1-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
        const idx = parseInt(e.key, 10) - 1;
        const result = flatResults[idx];
        if (result) {
          e.preventDefault();
          handleSelect(result);
        }
      }
    },
    [flatResults, selectedIndex, handleSelect, onOpenChange]
  );

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${selectedIndex}"]`
    );
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  const hasResults = flatResults.length > 0;
  const showRecent = !query.trim() && recentSearches.length > 0;

  let globalIndex = 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="fixed left-1/2 top-[15%] z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 translate-y-0 gap-0 overflow-hidden rounded-2xl border bg-background p-0 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2"
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        {/* Search input */}
        <div className="flex items-center gap-3 border-b px-4 py-4">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search plants, tasks, spaces, pages..."
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              Clear
            </button>
          ) : (
            <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
              ESC
            </kbd>
          )}
        </div>

        {/* Results */}
        <ScrollArea className="max-h-[60vh]">
          <div ref={listRef} className="py-2">
            {loading && query.trim() ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            ) : showRecent ? (
              <div className="px-2">
                <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent Searches
                </div>
                {recentSearches.map((term, i) => (
                  <button
                    key={term}
                    data-index={i}
                    onClick={() => setQuery(term)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      selectedIndex === i ? "bg-accent" : "hover:bg-accent/50"
                    )}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <Search className="size-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1 text-sm font-medium">{term}</span>
                    <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />
                  </button>
                ))}
                <div className="mt-2 px-3 py-2 text-xs text-muted-foreground">
                  Type to search across plants, tasks, spaces, pages, and reference data.
                </div>
              </div>
            ) : !hasResults && query.trim() ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <Search className="size-8 text-muted-foreground/50" />
                <p className="text-sm font-medium">
                  No results found for &quot;{query.trim()}&quot;
                </p>
                <p className="text-xs text-muted-foreground">
                  Try a different keyword or check your spelling.
                </p>
              </div>
            ) : !hasResults && !query.trim() ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                Type to search across plants, tasks, spaces, pages, and reference data.
              </div>
            ) : (
              <div className="px-2">
                {groupOrder.map((groupKey) => {
                  const items = groups[groupKey];
                  if (items.length === 0) return null;
                  return (
                    <div key={groupKey} className="mb-1">
                      <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {groupLabels[groupKey]}
                      </div>
                      {items.map((item) => {
                        const idx = globalIndex++;
                        const isSelected = idx === selectedIndex;
                        return (
                          <button
                            key={item.id}
                            data-index={idx}
                            onClick={() => handleSelect(item)}
                            className={cn(
                              "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                              isSelected ? "bg-accent" : "hover:bg-accent/50"
                            )}
                            onMouseEnter={() => setSelectedIndex(idx)}
                          >
                            <span
                              className={cn(
                                "flex size-7 shrink-0 items-center justify-center rounded-md",
                                isSelected
                                  ? "bg-background text-foreground"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              <SearchIcon name={item.icon} />
                            </span>
                            <div className="flex flex-1 flex-col overflow-hidden">
                              <span className="truncate text-sm font-medium">
                                <Highlight text={item.title} query={query} />
                              </span>
                              <span className="truncate text-xs text-muted-foreground">
                                {item.subtitle}
                              </span>
                            </div>
                            {idx < 9 && (
                              <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
                                {idx + 1}
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="size-3" /> to select
            </span>
            <span className="hidden items-center gap-1 sm:flex">
              <ArrowUp className="size-3" />
              <ArrowDown className="size-3" /> to navigate
            </span>
          </div>
          <span className="hidden sm:inline">{flatResults.length} results</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { open, setOpen };
}

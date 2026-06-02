"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Heart,
  Share2,
  X,
  BookOpen,
  Leaf,
  Droplets,
  Bug,
  Sun,
  Thermometer,
  FlaskConical,
  Sprout,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Star,
  Snowflake,
  CloudRain,
  Wrench,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { growingTips, getCurrentThaiSeason, type GrowingTip } from "@/data/growing-tips";

const categories: { key: string; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All", icon: BookOpen },
  { key: "seasonal", label: "Seasonal", icon: Sun },
  { key: "plant_care", label: "Plant Care", icon: Leaf },
  { key: "hydroponics", label: "Hydroponics", icon: Droplets },
  { key: "pest_control", label: "Pest Control", icon: Bug },
  { key: "harvest", label: "Harvest", icon: Sprout },
  { key: "beginner", label: "Beginner", icon: Star },
  { key: "advanced", label: "Advanced", icon: Wrench },
];

const categoryStyles: Record<string, string> = {
  seasonal: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  plant_care: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  hydroponics: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300",
  pest_control: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  harvest: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  beginner: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300",
  advanced: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
};

const difficultyStyles: Record<string, string> = {
  beginner: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
  intermediate: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
  advanced: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
};

const seasonIcons: Record<string, React.ElementType> = {
  cool: Snowflake,
  hot: Sun,
  rainy: CloudRain,
  all: Thermometer,
};

function getRelatedTips(tip: GrowingTip): GrowingTip[] {
  return growingTips
    .filter(
      (t) =>
        t.id !== tip.id &&
        (t.category === tip.category || t.tags.some((tag) => tip.tags.includes(tag)))
    )
    .slice(0, 3);
}

export default function LearnPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [dialogTip, setDialogTip] = useState<GrowingTip | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("growflow-favorite-tips");
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        setFavorites(new Set(parsed));
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem("growflow-favorite-tips", JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const currentSeason = useMemo(() => getCurrentThaiSeason(), []);

  const filteredTips = useMemo(() => {
    let tips = growingTips;

    // Category filter
    if (activeCategory === "favorites") {
      tips = tips.filter((t) => favorites.has(t.id));
    } else if (activeCategory !== "all") {
      tips = tips.filter((t) => t.category === activeCategory);
    }

    // Search filter
    const q = search.trim().toLowerCase();
    if (q) {
      tips = tips.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.relatedPlants?.some((p) => p.toLowerCase().includes(q)) ||
          t.difficulty.toLowerCase().includes(q) ||
          (t.season && t.season.toLowerCase().includes(q))
      );
    }

    return tips;
  }, [activeCategory, search, favorites]);

  const featuredTips = useMemo(() => {
    // Prioritize: current season tips, then beginner tips, then first 3
    const seasonTips = growingTips.filter(
      (t) => t.season === currentSeason.season && t.difficulty === "beginner"
    );
    const beginnerTips = growingTips.filter(
      (t) => t.difficulty === "beginner" && !seasonTips.includes(t)
    );
    return [...seasonTips, ...beginnerTips].slice(0, 3);
  }, [currentSeason]);

  const seasonTipCount = useMemo(() => {
    return growingTips.filter((t) => t.season === currentSeason.season).length;
  }, [currentSeason]);

  const handleShare = useCallback(async (tip: GrowingTip) => {
    const text = `${tip.title}\n\n${tip.content}\n\n— GrowFlow Growing Guide`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  }, []);

  const SeasonIcon = seasonIcons[currentSeason.season] || Sun;

  return (
    <PageShell>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Growing Guide</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Curated tips, seasonal advice, and plant-specific guides for Thai growers.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search tips, plants, tags..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Seasonal Banner */}
        <Card className="border-0 shadow-sm gradient-slate">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="icon-circle size-12 bg-slate-100 dark:bg-slate-900 shrink-0">
                <SeasonIcon className="size-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  It&apos;s {currentSeason.name}
                </p>
                <h3 className="text-base font-semibold mt-0.5">
                  {seasonTipCount} tips for growing in the {currentSeason.season} season
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentSeason.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                {cat.label}
              </button>
            );
          })}
          <button
            onClick={() => setActiveCategory("favorites")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeCategory === "favorites"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            <Heart
              className={cn(
                "size-3.5",
                favorites.size > 0 && activeCategory !== "favorites" && "fill-rose-500 text-rose-500"
              )}
            />
            My Favorites
            {favorites.size > 0 && (
              <span
                className={cn(
                  "ml-0.5 rounded-full px-1.5 py-0 text-[10px] font-bold",
                  activeCategory === "favorites"
                    ? "bg-white/20 text-white"
                    : "bg-rose-100 text-rose-700"
                )}
              >
                {favorites.size}
              </span>
            )}
          </button>
        </div>

        {/* Featured Tips */}
        {activeCategory === "all" && !search && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Featured Tips
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {featuredTips.map((tip) => {
                const Icon =
                  categories.find((c) => c.key === tip.category)?.icon || BookOpen;
                return (
                  <Card
                    key={tip.id}
                    className="border-0 shadow-sm gradient-slate cursor-pointer card-hover"
                    onClick={() => setDialogTip(tip)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="icon-circle size-8 bg-white/60 dark:bg-white/10">
                          <Icon className="size-4 text-foreground" />
                        </div>
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] h-5 capitalize", difficultyStyles[tip.difficulty])}
                        >
                          {tip.difficulty}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-sm leading-snug">{tip.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                        {tip.content}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Tips Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {activeCategory === "favorites"
                ? "Saved Tips"
                : activeCategory === "all"
                ? "All Tips"
                : categories.find((c) => c.key === activeCategory)?.label}
            </h3>
            <span className="text-xs text-muted-foreground">
              {filteredTips.length} tip{filteredTips.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredTips.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-10 text-center">
                <BookOpen className="size-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No tips match your search</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("all");
                  }}
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTips.map((tip) => {
                const isExpanded = expandedIds.has(tip.id);
                const isFav = favorites.has(tip.id);
                const CategoryIcon = categories.find((c) => c.key === tip.category)?.icon || BookOpen;
                const SeasonTagIcon = tip.season ? seasonIcons[tip.season] : null;

                return (
                  <Card
                    key={tip.id}
                    className={cn(
                      "border-0 shadow-sm flex flex-col transition-all",
                      isExpanded && "md:col-span-2 lg:col-span-1"
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "icon-circle size-8 shrink-0",
                              categoryStyles[tip.category]
                            )}
                          >
                            <CategoryIcon className="size-4" />
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] h-5 capitalize",
                              difficultyStyles[tip.difficulty]
                            )}
                          >
                            {tip.difficulty}
                          </Badge>
                        </div>
                        <button
                          onClick={() => toggleFavorite(tip.id)}
                          className="shrink-0 text-muted-foreground hover:text-rose-500 transition-colors"
                          title={isFav ? "Remove from favorites" : "Save to favorites"}
                        >
                          <Heart
                            className={cn("size-4", isFav && "fill-rose-500 text-rose-500")}
                          />
                        </button>
                      </div>
                      <CardTitle
                        className="text-base mt-2 cursor-pointer hover:text-emerald-600 transition-colors"
                        onClick={() => setDialogTip(tip)}
                      >
                        {tip.title}
                      </CardTitle>
                      <CardDescription
                        className={cn(
                          "mt-1.5 leading-relaxed",
                          !isExpanded && "line-clamp-3"
                        )}
                      >
                        {tip.content}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pt-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {tip.season && SeasonTagIcon && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                            <SeasonTagIcon className="size-3" />
                            {tip.season === "all" ? "All seasons" : tip.season}
                          </span>
                        )}
                        {tip.relatedPlants?.slice(0, 3).map((plant) => (
                          <span
                            key={plant}
                            className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300"
                          >
                            {plant}
                          </span>
                        ))}
                        {tip.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-muted-foreground"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleExpanded(tip.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              Show less <ChevronUp className="size-3.5" />
                            </>
                          ) : (
                            <>
                              Read more <ChevronDown className="size-3.5" />
                            </>
                          )}
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs gap-1"
                          onClick={() => setDialogTip(tip)}
                        >
                          Details <ArrowRight className="size-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Data Sources Card (preserved from original) */}
        <Card className="border-0 shadow-sm gradient-slate">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="icon-circle size-9 bg-emerald-100 dark:bg-emerald-950/30">
                <BookOpen className="size-4 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-base">Data Sources</CardTitle>
                <CardDescription>Authoritative references used throughout GrowFlow</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {[
              { author: "Resh, H.M. (2013)", title: "Hydroponic Food Production", edition: "7th Ed. CRC Press", desc: "The definitive reference on hydroponic system design and operation." },
              { author: "New Mexico State University", title: "Aquaponics Circular CR680", desc: "Research-backed guidance on aquaponic system design and fish-plant integration." },
              { author: "EU TransFarm Aquaponics Report", title: "", desc: "European Commission-funded research on sustainable aquaponics production." },
              { author: "McGill University", title: "", desc: "Hydroponics nutrient research and EC/pH management guidelines." },
              { author: "Open-Meteo", title: "", desc: "Free weather API providing global forecast data without API keys." },
            ].map((source) => (
              <div key={source.author} className="rounded-xl border bg-card/50 p-3.5">
                <p className="font-semibold text-foreground text-sm">
                  {source.author} {source.title && <span className="text-muted-foreground">— <em>{source.title}</em>{source.edition && `, ${source.edition}`}</span>}
                </p>
                <p className="text-xs mt-0.5">{source.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tip Detail Dialog */}
      <Dialog open={!!dialogTip} onOpenChange={(open) => !open && setDialogTip(null)}>
        {dialogTip && (
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={cn(
                    "icon-circle size-8",
                    categoryStyles[dialogTip.category]
                  )}
                >
                  {(() => {
                    const Icon =
                      categories.find((c) => c.key === dialogTip.category)?.icon ||
                      BookOpen;
                    return <Icon className="size-4" />;
                  })()}
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] h-5 capitalize",
                    difficultyStyles[dialogTip.difficulty]
                  )}
                >
                  {dialogTip.difficulty}
                </Badge>
                {dialogTip.season && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                    {(() => {
                      const SIcon = seasonIcons[dialogTip.season] || Thermometer;
                      return <SIcon className="size-3" />;
                    })()}
                    {dialogTip.season === "all" ? "All seasons" : dialogTip.season}
                  </span>
                )}
              </div>
              <DialogTitle className="text-left">{dialogTip.title}</DialogTitle>
              <DialogDescription className="text-left leading-relaxed text-foreground/80">
                {dialogTip.content}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Related plants */}
              {dialogTip.relatedPlants && dialogTip.relatedPlants.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Related Plants
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {dialogTip.relatedPlants.map((plant) => (
                      <span
                        key={plant}
                        className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                      >
                        {plant}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {dialogTip.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related tips */}
              {getRelatedTips(dialogTip).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Related Tips
                  </p>
                  <div className="space-y-2">
                    {getRelatedTips(dialogTip).map((related) => (
                      <button
                        key={related.id}
                        onClick={() => setDialogTip(related)}
                        className="w-full text-left rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <p className="text-sm font-medium">{related.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {related.content}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "gap-1.5 flex-1",
                    favorites.has(dialogTip.id) &&
                      "border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  )}
                  onClick={() => toggleFavorite(dialogTip.id)}
                >
                  <Heart
                    className={cn(
                      "size-4",
                      favorites.has(dialogTip.id) && "fill-rose-500 text-rose-500"
                    )}
                  />
                  {favorites.has(dialogTip.id) ? "Saved" : "Save to favorites"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 flex-1"
                  onClick={() => handleShare(dialogTip)}
                >
                  <Share2 className="size-4" />
                  Share
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </PageShell>
  );
}

"use client";

import { BookOpen, Leaf, Droplets, Bug, Sun, Thermometer, FlaskConical, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const guides = [
  {
    title: "Getting Started with Hydroponics",
    description: "Learn the fundamentals of soilless growing. Covers DWC, NFT, and Kratky methods for beginners.",
    icon: Droplets,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-950/30",
    tags: ["Beginner", "Hydroponics"],
    readTime: "8 min",
  },
  {
    title: "pH and EC Management",
    description: "Why pH and electrical conductivity matter, how to measure them, and what to do when they drift.",
    icon: FlaskConical,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-950/30",
    tags: ["Intermediate", "Nutrients"],
    readTime: "6 min",
  },
  {
    title: "Thai Weather & Growing Seasons",
    description: "Navigate Thailand's three-season climate. When to plant, when to shade, and how to handle monsoons.",
    icon: Sun,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-950/30",
    tags: ["Beginner", "Climate"],
    readTime: "7 min",
  },
  {
    title: "Companion Planting Guide",
    description: "Which plants grow well together and which to keep apart. Based on research-backed companion planting data.",
    icon: Leaf,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30",
    tags: ["All Levels", "Planning"],
    readTime: "5 min",
  },
  {
    title: "Common Pests & Organic Control",
    description: "Identify and manage aphids, whiteflies, spider mites, and fungal issues with organic methods.",
    icon: Bug,
    color: "bg-red-100 text-red-600 dark:bg-red-950/30",
    tags: ["Intermediate", "Pest Control"],
    readTime: "10 min",
  },
  {
    title: "Temperature & Humidity Control",
    description: "Optimal ranges for different crops. How to cool in hot seasons and manage humidity to prevent mold.",
    icon: Thermometer,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-950/30",
    tags: ["Intermediate", "Environment"],
    readTime: "6 min",
  },
];

export default function LearnPage() {
  return (
    <PageShell>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Learn</h2>
          <p className="text-sm text-muted-foreground mt-1">Guides and references to level up your growing skills.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Card key={guide.title} className="card-hover cursor-pointer shadow-sm flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("icon-circle size-10", guide.color)}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{guide.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="mt-2 leading-relaxed">{guide.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex items-center justify-between pt-0">
                  <div className="flex flex-wrap gap-1">
                    {guide.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] h-5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">{guide.readTime}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>

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
    </PageShell>
  );
}

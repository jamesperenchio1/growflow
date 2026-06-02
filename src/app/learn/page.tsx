"use client";

import { BookOpen, Leaf, Droplets, Bug, Sun, Thermometer, FlaskConical } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const guides = [
  {
    title: "Getting Started with Hydroponics",
    description: "Learn the fundamentals of soilless growing. Covers DWC, NFT, and Kratky methods for beginners.",
    icon: Droplets,
    tags: ["Beginner", "Hydroponics"],
    readTime: "8 min",
  },
  {
    title: "pH and EC Management",
    description: "Why pH and electrical conductivity matter, how to measure them, and what to do when they drift.",
    icon: FlaskConical,
    tags: ["Intermediate", "Nutrients"],
    readTime: "6 min",
  },
  {
    title: "Thai Weather & Growing Seasons",
    description: "Navigate Thailand's three-season climate. When to plant, when to shade, and how to handle monsoons.",
    icon: Sun,
    tags: ["Beginner", "Climate"],
    readTime: "7 min",
  },
  {
    title: "Companion Planting Guide",
    description: "Which plants grow well together and which to keep apart. Based on research-backed companion planting data.",
    icon: Leaf,
    tags: ["All Levels", "Planning"],
    readTime: "5 min",
  },
  {
    title: "Common Pests & Organic Control",
    description: "Identify and manage aphids, whiteflies, spider mites, and fungal issues with organic methods.",
    icon: Bug,
    tags: ["Intermediate", "Pest Control"],
    readTime: "10 min",
  },
  {
    title: "Temperature & Humidity Control",
    description: "Optimal ranges for different crops. How to cool in hot seasons and manage humidity to prevent mold.",
    icon: Thermometer,
    tags: ["Intermediate", "Environment"],
    readTime: "6 min",
  },
];

export default function LearnPage() {
  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Learn</h2>
          <p className="text-muted-foreground">Guides and references to level up your growing skills.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Card key={guide.title} className="flex flex-col transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                      <Icon className="size-5 text-emerald-500" />
                    </div>
                    <CardTitle className="text-base">{guide.title}</CardTitle>
                  </div>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {guide.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-emerald-500" />
              Data Sources
            </CardTitle>
            <CardDescription>Authoritative references used throughout GrowFlow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Resh, H.M. (2013)</strong> —{" "}
              <em>Hydroponic Food Production</em>, 7th Ed. CRC Press. The definitive reference on hydroponic system design and operation.
            </p>
            <p>
              <strong className="text-foreground">New Mexico State University</strong> — Aquaponics Circular CR680. Research-backed guidance on aquaponic system design and fish-plant integration.
            </p>
            <p>
              <strong className="text-foreground">EU TransFarm Aquaponics Report</strong> — European Commission-funded research on sustainable aquaponics production.
            </p>
            <p>
              <strong className="text-foreground">McGill University</strong> — Hydroponics nutrient research and EC/pH management guidelines.
            </p>
            <p>
              <strong className="text-foreground">Open-Meteo</strong> — Free weather API providing global forecast data without API keys.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

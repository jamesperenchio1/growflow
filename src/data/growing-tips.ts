export interface GrowingTip {
  id: string;
  title: string;
  content: string;
  category: 'seasonal' | 'plant_care' | 'hydroponics' | 'pest_control' | 'harvest' | 'beginner' | 'advanced';
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relatedPlants?: string[];
  season?: 'cool' | 'hot' | 'rainy' | 'all';
  createdAt: string;
}

export const growingTips: GrowingTip[] = [
  // Seasonal — Thailand-focused
  {
    id: "seasonal-cool",
    title: "Cool Season Leafy Greens",
    content:
      "November through February is the best time for leafy greens in Thailand. Lower humidity means less fungal risk. Start lettuce, kale, and spinach now. Daytime temperatures around 22–28°C are ideal for germination. Use this window to succession-plant every two weeks for continuous harvests.",
    category: "seasonal",
    tags: ["thailand", "cool season", "leafy greens", "succession planting"],
    difficulty: "beginner",
    relatedPlants: ["Lettuce", "Kale", "Spinach"],
    season: "cool",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "seasonal-hot",
    title: "Hot Season Heat Management",
    content:
      "March through June demands heat-tolerant crops. Increase shading to 30–40% during peak hours. Monitor water temperature closely — above 28°C stresses roots and reduces oxygen solubility. Consider adding frozen water bottles to reservoirs on extreme days. Focus on okra, bird chili, and basil which thrive in heat.",
    category: "seasonal",
    tags: ["thailand", "hot season", "shading", "water temperature"],
    difficulty: "intermediate",
    relatedPlants: ["Bird Chili", "Thai Basil", "Morning Glory"],
    season: "hot",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "seasonal-rainy",
    title: "Rainy Season Flood Prevention",
    content:
      "July through October brings monsoons. Elevate pots and reservoirs to prevent flooding. Increase drainage in your media — add extra perlite or coarse gravel. Watch for fungal outbreaks and increase airflow with circulation fans. Harvest frequently to reduce plant density and improve ventilation around canopies.",
    category: "seasonal",
    tags: ["thailand", "rainy season", "drainage", "fungal prevention"],
    difficulty: "intermediate",
    relatedPlants: ["Morning Glory", "Long Bean"],
    season: "rainy",
    createdAt: "2024-01-15T00:00:00Z",
  },

  // Plant Care
  {
    id: "plantcare-transplant",
    title: "Harden Off Before Transplanting",
    content:
      "Transplant shock is the leading cause of seedling death in hydroponics. Always harden seedlings for 3–5 days before moving them to the main system. Start with 2 hours of exposure, gradually increasing time and light intensity. This toughens cell walls and prepares roots for stronger nutrient solutions.",
    category: "plant_care",
    tags: ["seedlings", "transplant", "hardening off"],
    difficulty: "beginner",
    relatedPlants: ["Tomato", "Bell Pepper", "Broccoli"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "plantcare-root-prune",
    title: "Monthly Root Pruning Prevents Rot",
    content:
      "In hydroponics, trim brown or dead roots monthly to prevent rot from spreading. Use sterile scissors and remove only mushy, dark tissue. Healthy roots are white or cream-colored with fine fuzzy root hairs. After pruning, add a mild hydrogen peroxide solution (3ml/L of 3% H2O2) to sanitize the reservoir.",
    category: "plant_care",
    tags: ["roots", "pruning", "root rot", "sterilization"],
    difficulty: "intermediate",
    relatedPlants: ["Lettuce", "Basil", "Tomato"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "plantcare-light-distance",
    title: "LED Light Distance for Vegetative Stage",
    content:
      "Keep LED grow lights 30–45cm from the plant canopy during vegetative stage. Too close causes light burn and leaf curling; too far causes leggy, weak growth. Full-spectrum white LEDs can sit slightly closer than blurple panels. Adjust height as plants grow — a good rule is hand-test: if it feels warm on your palm after 30 seconds, it's too close.",
    category: "plant_care",
    tags: ["lighting", "LED", "vegetative", "canopy management"],
    difficulty: "beginner",
    relatedPlants: ["Lettuce", "Spinach", "Kale"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "plantcare-oxygen",
    title: "Oxygen Is King in DWC",
    content:
      "Ensure air stones run 24/7 in Deep Water Culture. Roots need oxygen far more than they need nutrients. Dissolved oxygen below 4ppm causes root stress; below 2ppm triggers root rot within days. Warm water holds less oxygen, so increase aeration in hot seasons. A single large air stone beats multiple small ones for even distribution.",
    category: "plant_care",
    tags: ["DWC", "aeration", "dissolved oxygen", "air stones"],
    difficulty: "intermediate",
    relatedPlants: ["Lettuce", "Basil", "Tomato"],
    createdAt: "2024-01-15T00:00:00Z",
  },

  // Hydroponics
  {
    id: "hydro-ph-timing",
    title: "Check pH After Adding Nutrients",
    content:
      "Always check pH AFTER adding nutrients, not before. Concentrated nutrients drastically change pH — a starting pH of 7.0 can drop to 5.2 after adding bloom solution. Mix thoroughly, wait 5 minutes, then test. Adjust with pH up or down in small increments (0.1–0.2 at a time) to avoid overshooting.",
    category: "hydroponics",
    tags: ["pH", "nutrients", "water chemistry", "EC management"],
    difficulty: "beginner",
    relatedPlants: ["Tomato", "Bell Pepper", "Cucumber"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "hydro-reservoir-change",
    title: "Top Off Daily, Change Every Two Weeks",
    content:
      "Top off your reservoir with pH-adjusted water daily. Plants transpire quickly in warm climates, and falling water levels concentrate nutrients. Perform a complete reservoir change every 14 days to reset the nutrient profile and prevent salt buildup. Use this change to inspect and clean pumps, air stones, and tubing.",
    category: "hydroponics",
    tags: ["reservoir", "nutrient change", "maintenance", "salt buildup"],
    difficulty: "beginner",
    relatedPlants: ["Lettuce", "Basil", "Spinach"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "hydro-ec-creep",
    title: "EC Creep Means Over-Feeding",
    content:
      "If EC rises between reservoir changes, your plants are drinking more water than nutrients — a signal you're over-feeding. Gradually reduce nutrient strength by 10–15% until EC holds steady or slightly drops. This is common in leafy greens and herbs which have lower nutrient demands than fruiting crops.",
    category: "hydroponics",
    tags: ["EC", "nutrient strength", "over-feeding", "leafy greens"],
    difficulty: "intermediate",
    relatedPlants: ["Lettuce", "Spinach", "Basil"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "hydro-ec-drop",
    title: "EC Drop Means Hungry Plants",
    content:
      "If EC drops between reservoir changes, your plants are consuming nutrients faster than water — they're hungry. Increase nutrient strength by 10–15% and monitor daily. Fruiting plants like tomatoes and peppers often show EC drops during heavy flowering and fruit set when nutrient demand spikes.",
    category: "hydroponics",
    tags: ["EC", "nutrient strength", "fruiting", "flowering"],
    difficulty: "intermediate",
    relatedPlants: ["Tomato", "Bell Pepper", "Bird Chili"],
    createdAt: "2024-01-15T00:00:00Z",
  },

  // Pest Control
  {
    id: "pest-inspection",
    title: "Weekly Inspection with a Hand Lens",
    content:
      "Inspect plants weekly with a 10x hand lens. Early detection is everything in pest management. Look at leaf undersides, stem joints, and new growth tips. Catching a single aphid colony before it spreads saves weeks of remediation. Keep a log with dates, findings, and treatments to track patterns.",
    category: "pest_control",
    tags: ["inspection", "early detection", "IPM", "prevention"],
    difficulty: "beginner",
    relatedPlants: ["Tomato", "Basil", "Cucumber"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "pest-sticky-traps",
    title: "Yellow Sticky Traps for Fungus Gnats",
    content:
      "Place yellow sticky traps near soil level or reservoir openings to catch fungus gnats before they breed. One adult gnat can lay 200 eggs. Replace traps every 2–3 weeks or when coverage exceeds 50%. For severe infestations, top-dress media with a 1cm layer of coarse sand to block egg-laying access.",
    category: "pest_control",
    tags: ["fungus gnats", "sticky traps", "prevention", "monitoring"],
    difficulty: "beginner",
    relatedPlants: ["Lettuce", "Spinach", "Kale"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "pest-neem-oil",
    title: "Neem Oil Works Best as Prevention",
    content:
      "Neem oil is most effective as a preventive spray every 7–10 days, not as a cure for heavy infestations. It disrupts feeding and breeding cycles. Apply in the evening to avoid leaf burn. Mix 5ml neem oil + 2ml insecticidal soap per liter of warm water. Shake frequently during application — oil separates quickly.",
    category: "pest_control",
    tags: ["neem oil", "organic", "preventive", "spray timing"],
    difficulty: "intermediate",
    relatedPlants: ["Tomato", "Cucumber", "Bell Pepper"],
    createdAt: "2024-01-15T00:00:00Z",
  },

  // Harvest
  {
    id: "harvest-morning",
    title: "Harvest in the Morning for Peak Nutrition",
    content:
      "Harvest leafy greens and herbs in the morning, shortly after lights turn on, for peak nutrient density. Plants accumulate sugars and nutrients during the day but respire them overnight. Morning harvest captures the maximum sugar, vitamin, and mineral content before the day's heat causes wilting.",
    category: "harvest",
    tags: ["timing", "nutrient density", "leafy greens", "herbs"],
    difficulty: "beginner",
    relatedPlants: ["Lettuce", "Spinach", "Basil", "Kale"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "harvest-cut-come-again",
    title: "Cut-and-Come-Again Lettuce",
    content:
      "For lettuce, harvest outer leaves and let the center regrow for 2–3 additional harvests. Cut 2–3cm above the crown with clean scissors. This method extends harvest windows from 4 weeks to 10–12 weeks per plant. Stop when the center stalk elongates (bolts) — the leaves turn bitter after bolting begins.",
    category: "harvest",
    tags: ["lettuce", "succession harvest", "crown cutting", "bolting"],
    difficulty: "beginner",
    relatedPlants: ["Lettuce", "Spinach", "Kale"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "harvest-tomato",
    title: "Tomato Ripeness Indicators",
    content:
      "Tomatoes are ready when they slightly soften to gentle pressure and color is uniform from stem to blossom end. For best flavor, let vine-ripened tomatoes stay on the plant until 90% colored. If splitting threatens due to rain, harvest at 80% color and finish indoors at room temperature — never refrigerate fresh tomatoes.",
    category: "harvest",
    tags: ["tomato", "ripeness", "vine-ripened", "storage"],
    difficulty: "beginner",
    relatedPlants: ["Tomato", "Bell Pepper", "Bird Chili"],
    createdAt: "2024-01-15T00:00:00Z",
  },

  // Beginner
  {
    id: "beginner-start-lettuce",
    title: "Start with Lettuce or Basil",
    content:
      "Begin your hydroponic journey with lettuce or basil. They germinate in 3–5 days, grow rapidly, and forgive common beginner mistakes like minor pH drift or weak nutrient solutions. Success with these builds confidence and teaches reservoir management before moving to demanding fruiting crops.",
    category: "beginner",
    tags: ["getting started", "easy crops", "confidence building"],
    difficulty: "beginner",
    relatedPlants: ["Lettuce", "Basil", "Thai Basil"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "beginner-dont-overcrowd",
    title: "One Healthy Plant Beats Ten Struggling Ones",
    content:
      "Resist the urge to overcrowd your system. Overcrowding blocks light, reduces airflow, and triggers pest outbreaks. Follow spacing guidelines: 20cm for lettuce, 50cm for tomatoes. A single thriving plant produces more than three stunted ones competing for the same resources.",
    category: "beginner",
    tags: ["spacing", "plant density", "airflow", "yield"],
    difficulty: "beginner",
    relatedPlants: ["Lettuce", "Tomato", "Kale"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "beginner-journal",
    title: "Keep a Grow Journal",
    content:
      "What you measure, you can improve. Keep a simple grow journal noting planting dates, nutrient changes, pH/EC readings, pest sightings, and harvest weights. After two or three cycles, patterns emerge. You'll know exactly when your reservoir drifts, which varieties perform best, and how long each stage takes in your specific environment.",
    category: "beginner",
    tags: ["journal", "tracking", "improvement", "data"],
    difficulty: "beginner",
    relatedPlants: [],
    createdAt: "2024-01-15T00:00:00Z",
  },

  // Advanced
  {
    id: "advanced-co2",
    title: "Supplemental CO2 Boosts Yields 20–30%",
    content:
      "In sealed grow rooms, supplemental CO2 to 1000–1200 ppm can increase yields 20–30%. Natural ambient CO2 is ~420 ppm. Use a CO2 monitor and controller for safety. Only supplement when lights are on — plants don't absorb CO2 in darkness. Ensure temperatures rise to 28–30°C for optimal CO2 utilization; otherwise the extra carbon can't be metabolized.",
    category: "advanced",
    tags: ["CO2", "sealed room", "yield optimization", "environment control"],
    difficulty: "advanced",
    relatedPlants: ["Tomato", "Bell Pepper", "Cucumber"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "advanced-kratky",
    title: "Kratky Method Limitations",
    content:
      "The Kratky method works brilliantly for leafy greens but not for fruiting plants long-term. Leafy crops finish before the reservoir depletes and air gap forms naturally. Fruiting plants like tomatoes need continuous nutrient delivery for 3+ months — the static Kratky reservoir can't support extended heavy feeding without supplementation.",
    category: "advanced",
    tags: ["Kratky", "passive hydroponics", "leafy greens", "fruiting crops"],
    difficulty: "advanced",
    relatedPlants: ["Lettuce", "Spinach", "Basil"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "advanced-ro-water",
    title: "RO Water Needs Cal-Mag Supplement",
    content:
      "Reverse osmosis water gives you a clean slate with predictable pH and zero contaminants. However, it also removes calcium and magnesium — essential secondary nutrients. Always add a Cal-Mag supplement (typically 1–2ml/L) when using RO or distilled water. Without it, you'll see blossom end rot in tomatoes and interveinal chlorosis in leafy greens.",
    category: "advanced",
    tags: ["reverse osmosis", "water quality", "calcium", "magnesium"],
    difficulty: "advanced",
    relatedPlants: ["Tomato", "Bell Pepper", "Lettuce"],
    createdAt: "2024-01-15T00:00:00Z",
  },
];

export function getCurrentThaiSeason(): {
  season: 'cool' | 'hot' | 'rainy';
  name: string;
  description: string;
} {
  const month = new Date().getMonth(); // 0-11
  if (month >= 10 || month <= 1) {
    return {
      season: 'cool',
      name: 'Cool Season',
      description: 'Best time for leafy greens. Lower humidity means less fungal risk.',
    };
  }
  if (month >= 2 && month <= 5) {
    return {
      season: 'hot',
      name: 'Hot Season',
      description: 'Focus on heat-tolerant crops and manage water temperature.',
    };
  }
  return {
    season: 'rainy',
    name: 'Rainy Season',
    description: 'Elevate pots, increase drainage, and watch for fungal outbreaks.',
  };
}

export function getTipsByCategory(category: GrowingTip['category']): GrowingTip[] {
  return growingTips.filter((t) => t.category === category);
}

export function getTipsBySeason(season: GrowingTip['season']): GrowingTip[] {
  return growingTips.filter((t) => t.season === season || t.season === 'all');
}

export function getTipsByDifficulty(difficulty: GrowingTip['difficulty']): GrowingTip[] {
  return growingTips.filter((t) => t.difficulty === difficulty);
}

export function searchTips(query: string): GrowingTip[] {
  const q = query.toLowerCase();
  return growingTips.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      t.relatedPlants?.some((p) => p.toLowerCase().includes(q))
  );
}

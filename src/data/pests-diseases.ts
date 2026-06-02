export type PestDiseaseCategory = 'pest' | 'disease';
export type Severity = 'low' | 'medium' | 'high';
export type GrowthStage = 'germination' | 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvesting';

export interface PestDisease {
  id: string;
  name: string;
  category: PestDiseaseCategory;
  severity: Severity;
  symptoms: string[];
  treatments: string[];
  prevention: string[];
  affectedPlants: string[];
  imageKeyword: string;
  lifeCycle: string[];
  treatmentTimeline: { day: string; action: string }[];
  affectedGrowthStages: GrowthStage[];
}

export const pestsAndDiseases: PestDisease[] = [
  // ─── PESTS ───
  {
    id: 'aphids',
    name: 'Aphids',
    category: 'pest',
    severity: 'medium',
    symptoms: [
      'Green, black, or gray soft-bodied insects clustering on stems and leaf undersides',
      'Yellowing leaves and stunted growth from sap loss',
      'Sticky honeydew excretion leading to sooty mold',
      'Distorted or curling new growth',
    ],
    treatments: [
      'Insecticidal soap spray — coat undersides of leaves thoroughly',
      'Neem oil application every 5–7 days until clear',
      'Release ladybugs or lacewings for biological control',
      'Strong water spray to physically dislodge colonies',
    ],
    prevention: [
      'Use reflective mulch to confuse flying adults',
      'Inspect new plants before introducing to grow area',
      'Encourage beneficial insect habitat near growing space',
      'Maintain balanced fertility — avoid excessive nitrogen',
    ],
    affectedPlants: ['Tomato', 'Lettuce', 'Basil', 'Bell Pepper', 'Cucumber', 'Spinach', 'Kale', 'Broccoli', 'Marigold', 'Strawberry'],
    imageKeyword: 'aphids on leaf',
    lifeCycle: [
      'Egg: Overwintering eggs hatch in spring (2–3 days)',
      'Nymph: 4 instars, reproduces asexually, matures in 7–10 days',
      'Adult: Live 20–40 days, produce 50–100 offspring each',
      'Winged form: Develops when colony is crowded to spread to new plants',
    ],
    treatmentTimeline: [
      { day: 'Day 1', action: 'Isolate infected plants and inspect all neighbors' },
      { day: 'Day 1', action: 'Spray insecticidal soap or neem oil thoroughly' },
      { day: 'Day 3', action: 'Reapply treatment and check for survivors' },
      { day: 'Day 7', action: 'Third application if needed; release beneficial insects' },
      { day: 'Day 14', action: 'Monitor weekly; maintain preventive sprays' },
    ],
    affectedGrowthStages: ['seedling', 'vegetative', 'flowering'],
  },
  {
    id: 'spider-mites',
    name: 'Spider Mites',
    category: 'pest',
    severity: 'high',
    symptoms: [
      'Tiny arachnids (<1mm) appearing red, brown, or yellow',
      'Fine silk webbing on leaf undersides and between stems',
      'Stippling — tiny pale dots across leaf surface',
      'Progressive yellowing, bronzing, and premature leaf drop',
      'Wipe underside of leaf with white tissue — red streaks confirm mites',
    ],
    treatments: [
      'Insecticidal soap or horticultural oil focused on leaf undersides',
      'Introduce predatory mites (Phytoseiulus persimilis)',
      'Increase humidity with regular misting',
      'Prune and remove heavily infested leaves',
    ],
    prevention: [
      'Regular misting to keep humidity above 50%',
      'Avoid water stress — stressed plants attract mites',
      'Inspect plants weekly with a hand lens',
      'Quarantine new plants for 7–10 days',
    ],
    affectedPlants: ['Tomato', 'Bell Pepper', 'Cucumber', 'Spinach', 'Strawberry', 'Marigold', 'Basil', 'Bird Chili'],
    imageKeyword: 'spider mite damage',
    lifeCycle: [
      'Egg: Laid on leaf undersides, hatch in 3–5 days at warm temperatures',
      'Larva: 6-legged, feeds immediately, lasts 2–4 days',
      'Nymph: 8-legged, 2 instars over 3–5 days',
      'Adult: Live 2–4 weeks, females lay 100+ eggs in lifetime',
    ],
    treatmentTimeline: [
      { day: 'Day 1', action: 'Increase humidity and isolate affected plants' },
      { day: 'Day 1', action: 'Spray insecticidal soap or horticultural oil on all leaf undersides' },
      { day: 'Day 2', action: 'Release predatory mites if available' },
      { day: 'Day 4', action: 'Reapply spray; prune heavily damaged leaves' },
      { day: 'Day 7', action: 'Third spray application' },
      { day: 'Day 14', action: 'Continue weekly monitoring and misting' },
    ],
    affectedGrowthStages: ['vegetative', 'flowering', 'fruiting'],
  },
  {
    id: 'whiteflies',
    name: 'Whiteflies',
    category: 'pest',
    severity: 'medium',
    symptoms: [
      'Small white moth-like insects (~1mm) on leaf undersides',
      'Clouds of white adults flying up when plant is disturbed',
      'Yellowing, wilting, and reduced vigor',
      'Honeydew secretion and subsequent sooty mold growth',
    ],
    treatments: [
      'Yellow sticky traps placed near canopy level',
      'Insecticidal soap or neem oil sprays on leaf undersides',
      'Vacuum adults gently for light infestations (early morning best)',
      'Encarsia formosa parasitic wasps for biological control',
    ],
    prevention: [
      'Install insect screens on vents and openings',
      'Reflective mulch to repel landing adults',
      'Remove weeds that serve as alternate hosts',
      'Monitor with yellow traps year-round',
    ],
    affectedPlants: ['Tomato', 'Lettuce', 'Basil', 'Bell Pepper', 'Cucumber', 'Broccoli', 'Thai Basil', 'Bird Chili', 'Marigold', 'Thai Eggplant'],
    imageKeyword: 'whitefly infestation',
    lifeCycle: [
      'Egg: Laid in circles on leaf undersides, hatch in 5–10 days',
      'Crawler: Mobile first instar, settles to feed within hours',
      'Pupa: 3 sessile instars over 2–3 weeks',
      'Adult: Emerges from pupal case, lives 1–2 months',
    ],
    treatmentTimeline: [
      { day: 'Day 1', action: 'Hang yellow sticky traps and vacuum adults' },
      { day: 'Day 1', action: 'Spray insecticidal soap on leaf undersides' },
      { day: 'Day 4', action: 'Reapply spray and check trap counts' },
      { day: 'Day 7', action: 'Third application; release Encarsia wasps if severe' },
      { day: 'Day 14', action: 'Continue weekly sprays until populations decline' },
    ],
    affectedGrowthStages: ['seedling', 'vegetative', 'flowering'],
  },
  {
    id: 'thrips',
    name: 'Thrips',
    category: 'pest',
    severity: 'medium',
    symptoms: [
      'Slender insects (~1–2mm) scraping leaf cells',
      'Silvery streaks and leaf deformities on new growth',
      'Tiny black specks (excrement) on leaves and fruit',
      'Browning at leaf edges and flower damage',
    ],
    treatments: [
      'Blue sticky traps — thrips prefer blue over yellow',
      'Spinosad-based organic insecticide',
      'Beneficial nematodes (Steinernema feltiae) in growing media',
      'Reflective mulch to disorient adults',
    ],
    prevention: [
      'Remove weeds and plant debris near growing area',
      'Reflective mulch at planting time',
      'Maintain good spacing for air circulation',
      'Inspect flowers and new growth weekly',
    ],
    affectedPlants: ['Onion', 'Bird Chili', 'Marigold', 'Basil', 'Bell Pepper', 'Tomato'],
    imageKeyword: 'thrips damage leaf',
    lifeCycle: [
      'Egg: Laid in plant tissue, hatch in 2–7 days',
      'Larva: 2 instars, feeds actively for 3–5 days',
      'Pupa: Drops to soil or leaf litter for 2–5 days',
      'Adult: Emerges, lives 20–45 days, lays 50–300 eggs',
    ],
    treatmentTimeline: [
      { day: 'Day 1', action: 'Hang blue sticky traps and inspect flowers' },
      { day: 'Day 1', action: 'Apply spinosad spray to leaves and flowers' },
      { day: 'Day 3', action: 'Apply beneficial nematodes to growing media' },
      { day: 'Day 7', action: 'Reapply spinosad if trap counts remain high' },
      { day: 'Day 14', action: 'Continue monitoring traps weekly' },
    ],
    affectedGrowthStages: ['vegetative', 'flowering', 'fruiting'],
  },
  {
    id: 'fungus-gnats',
    name: 'Fungus Gnats',
    category: 'pest',
    severity: 'low',
    symptoms: [
      'Small dark flies hovering around soil surface or media',
      'Larvae in root zone — translucent worms with black heads',
      'Stunted growth from root feeding damage',
      'Increased susceptibility to root rot pathogens',
    ],
    treatments: [
      'Yellow sticky traps to catch adult flies',
      'BTi (Bacillus thuringiensis israelensis) drench for larvae',
      'Sand or diatomaceous earth layer on media surface',
      'Allow top layer of media to dry between waterings',
    ],
    prevention: [
      'Let top 2–3 cm of growing media dry between irrigations',
      'Ensure good drainage and avoid overwatering',
      'Use sterile growing media',
      'Remove algae and organic debris from reservoir surfaces',
    ],
    affectedPlants: ['Lettuce', 'Basil', 'Spinach', 'Kale', 'Broccoli', 'Tomato', 'Strawberry'],
    imageKeyword: 'fungus gnat hydroponic',
    lifeCycle: [
      'Egg: Laid in moist media, hatch in 4–6 days',
      'Larva: Feeds on fungi and roots for 12–14 days',
      'Pupa: In media for 4–6 days',
      'Adult: Emerges, lives 7–10 days, lays 100–200 eggs',
    ],
    treatmentTimeline: [
      { day: 'Day 1', action: 'Hang yellow sticky traps and reduce watering' },
      { day: 'Day 1', action: 'Apply BTi drench to growing media' },
      { day: 'Day 3', action: 'Add sand or diatomaceous earth layer on media surface' },
      { day: 'Day 7', action: 'Reapply BTi drench' },
      { day: 'Day 14', action: 'Continue dry-top strategy and monitor traps' },
    ],
    affectedGrowthStages: ['germination', 'seedling', 'vegetative'],
  },

  // ─── DISEASES ───
  {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    category: 'disease',
    severity: 'medium',
    symptoms: [
      'White powdery patches on leaves, stems, and flowers',
      'Distorted or stunted new growth',
      'Leaves may yellow and dry out prematurely',
      'Unlike downy mildew, thrives in dry leaf conditions with high humidity',
    ],
    treatments: [
      'Baking soda spray: 1 tbsp baking soda + 1 tsp horticultural oil per gallon of water',
      'Neem oil every 5–7 days',
      'Milk spray: 1 part milk to 9 parts water',
      'Sulfur-based organic fungicide as last resort',
    ],
    prevention: [
      'Increase airflow with fans and proper plant spacing',
      'Avoid overhead watering that wets foliage',
      'Remove and destroy severely infected leaves',
      'Choose resistant varieties when available',
    ],
    affectedPlants: ['Lettuce', 'Cucumber', 'Spinach', 'Kale', 'Basil', 'Tomato', 'Marigold', 'Strawberry', 'Carrot', 'Bitter Melon'],
    imageKeyword: 'powdery mildew leaf',
    lifeCycle: [
      'Spore: Wind-dispersed conidia germinate on leaf surface in 2–4 hours',
      'Infection: Mycelium spreads across surface, extracts nutrients (3–7 days)',
      'Sporulation: New conidia form on white patches, spreading rapidly',
      'Overwintering: Chasmothecia form on dead tissue for next season',
    ],
    treatmentTimeline: [
      { day: 'Day 1', action: 'Remove and destroy severely infected leaves' },
      { day: 'Day 1', action: 'Apply baking soda or milk spray to all foliage' },
      { day: 'Day 3', action: 'Increase airflow with fans or spacing adjustments' },
      { day: 'Day 5', action: 'Reapply spray; inspect for new patches' },
      { day: 'Day 10', action: 'Continue every 5–7 days until clear' },
    ],
    affectedGrowthStages: ['vegetative', 'flowering', 'fruiting'],
  },
  {
    id: 'botrytis',
    name: 'Botrytis (Gray Mold)',
    category: 'disease',
    severity: 'high',
    symptoms: [
      'Gray fuzzy mold on flowers, foliage, and fruits',
      'Brown spots on petals and soft rot on fruit',
      'Spreads rapidly in cool, humid conditions',
      'Infected tissue becomes water-soaked and necrotic',
    ],
    treatments: [
      'Remove and destroy all infected plant parts immediately',
      'Improve air circulation and reduce humidity',
      'Copper-based fungicide for severe infections',
      'Space plants to allow rapid drying of foliage',
    ],
    prevention: [
      'Dehumidify growing area — keep RH below 60%',
      'Maintain adequate plant spacing',
      'Remove dead flowers, leaves, and plant debris promptly',
      'Avoid wetting flowers and fruit during irrigation',
    ],
    affectedPlants: ['Strawberry', 'Tomato', 'Basil', 'Lettuce', 'Bell Pepper', 'Marigold', 'Broccoli', 'Thai Basil'],
    imageKeyword: 'botrytis gray mold',
    lifeCycle: [
      'Spore: Conidia spread by air and water splash',
      'Germination: Occurs on senescent tissue or wounds in 4–8 hours',
      'Infection: Gray mycelium colonizes tissue in 24–48 hours at high humidity',
      'Sporulation: Millions of new spores produced on gray fuzz',
    ],
    treatmentTimeline: [
      { day: 'Day 1', action: 'Remove all infected tissue immediately — do not compost' },
      { day: 'Day 1', action: 'Reduce humidity and increase airflow' },
      { day: 'Day 2', action: 'Apply copper fungicide if infection is severe' },
      { day: 'Day 5', action: 'Reinspect and remove any new infected material' },
      { day: 'Day 7', action: 'Reapply fungicide if conditions remain humid' },
    ],
    affectedGrowthStages: ['flowering', 'fruiting', 'harvesting'],
  },
  {
    id: 'pythium',
    name: 'Pythium (Root Rot)',
    category: 'disease',
    severity: 'high',
    symptoms: [
      'Waterlogged, mushy, brown or black roots',
      'Roots slough off easily when touched',
      'Plants wilt during lights-on despite wet conditions',
      'Stunted growth and yellowing of upper foliage',
      'Highly infectious — spreads rapidly through shared reservoir',
    ],
    treatments: [
      'Hydrogen peroxide drench: 3% H₂O₂ at 3 ml per liter',
      'Add beneficial microbes (Bacillus subtilis, Trichoderma)',
      'Complete water change and system sterilization',
      'Remove and destroy severely affected plants',
    ],
    prevention: [
      'Keep system and reservoir meticulously clean',
      'Ensure adequate oxygenation with air stones or falling water',
      'Remove dead roots immediately during inspections',
      'Maintain water temperature below 22°C (72°F)',
    ],
    affectedPlants: ['Lettuce', 'Basil', 'Spinach', 'Tomato', 'Cucumber', 'Strawberry', 'Kale', 'Broccoli', 'Morning Glory'],
    imageKeyword: 'pythium root rot hydroponic',
    lifeCycle: [
      'Oospore: Survives in water and debris for months to years',
      'Zoospore: Motile spores swim to roots in water (flagellated)',
      'Infection: Enters root tips and cortex, causing rot in 24–72 hours',
      'Sporulation: New zoospores released into water to infect other plants',
    ],
    treatmentTimeline: [
      { day: 'Day 1', action: 'Remove severely affected plants immediately' },
      { day: 'Day 1', action: 'Drain reservoir and sterilize with H₂O₂' },
      { day: 'Day 1', action: 'Refill with fresh nutrient solution + beneficial microbes' },
      { day: 'Day 3', action: 'Check remaining plants for root health' },
      { day: 'Day 7', action: 'Add second dose of beneficial microbes' },
      { day: 'Day 14', action: 'Monitor water temp and root color weekly' },
    ],
    affectedGrowthStages: ['seedling', 'vegetative', 'flowering'],
  },
  {
    id: 'bacterial-spot',
    name: 'Bacterial Spot',
    category: 'disease',
    severity: 'medium',
    symptoms: [
      'Small water-soaked lesions on leaves and fruit',
      'Lesions turn black or greasy-looking with yellow halos',
      'Severe defoliation in warm, wet conditions',
      'Fruit shows raised scabby spots',
    ],
    treatments: [
      'Copper-based bactericide sprays',
      'Remove and destroy infected tissue — do not compost',
      'Avoid working with wet plants',
      'Reduce overhead irrigation',
    ],
    prevention: [
      'Sterilize tools between plants with 10% bleach or alcohol',
      'Avoid overhead watering that splashes bacteria',
      'Plant resistant varieties when available',
      'Rotate crops and use pathogen-free seed',
    ],
    affectedPlants: ['Tomato', 'Bell Pepper', 'Bird Chili', 'Thai Eggplant'],
    imageKeyword: 'bacterial spot tomato',
    lifeCycle: [
      'Bacteria: Overwinters in seed and plant debris',
      'Entry: Enters through stomata or wounds during wet conditions',
      'Multiplication: Spreads intercellularly, causing lesions in 3–7 days',
      'Spread: Rain splash and human contact move bacteria to new plants',
    ],
    treatmentTimeline: [
      { day: 'Day 1', action: 'Remove infected leaves and fruit; sterilize tools' },
      { day: 'Day 1', action: 'Apply copper bactericide spray' },
      { day: 'Day 3', action: 'Avoid watering foliage; water at base only' },
      { day: 'Day 7', action: 'Reapply copper spray' },
      { day: 'Day 14', action: 'Continue weekly applications if wet weather persists' },
    ],
    affectedGrowthStages: ['vegetative', 'flowering', 'fruiting'],
  },
  {
    id: 'downy-mildew',
    name: 'Downy Mildew',
    category: 'disease',
    severity: 'high',
    symptoms: [
      'Yellow angular spots on upper leaf surface bounded by veins',
      'Fuzzy grayish-purple growth on leaf undersides',
      'Leaves curl, wither, and die from older growth upward',
      'Spreads rapidly in cool, humid nights with warm days',
    ],
    treatments: [
      'Copper fungicide spray at first sign',
      'Remove and destroy severely infected leaves',
      'Improve air circulation immediately',
      'Reduce humidity in growing environment',
    ],
    prevention: [
      'Avoid leaf wetness — water at base, not overhead',
      'Space plants for rapid drying and airflow',
      'Water in morning so foliage dries before evening',
      'Choose resistant varieties',
    ],
    affectedPlants: ['Lettuce', 'Basil', 'Cucumber', 'Spinach', 'Kale', 'Onion', 'Broccoli', 'Morning Glory', 'Bitter Melon'],
    imageKeyword: 'downy mildew leaf',
    lifeCycle: [
      'Oospore: Overwinters in soil and plant debris',
      'Sporangia: Produced on leaf undersides during humid nights',
      'Zoospore: Released from sporangia, swim to new leaves in moisture',
      'Infection: Enters leaf stomata, symptoms appear in 3–5 days',
    ],
    treatmentTimeline: [
      { day: 'Day 1', action: 'Remove infected leaves and improve airflow' },
      { day: 'Day 1', action: 'Apply copper fungicide to all foliage' },
      { day: 'Day 3', action: 'Ensure foliage dries completely between waterings' },
      { day: 'Day 7', action: 'Reapply copper spray' },
      { day: 'Day 14', action: 'Continue weekly monitoring and preventive sprays' },
    ],
    affectedGrowthStages: ['seedling', 'vegetative', 'flowering'],
  },
  {
    id: 'fusarium-wilt',
    name: 'Fusarium Wilt',
    category: 'disease',
    severity: 'high',
    symptoms: [
      'Yellowing and wilting on one side of the plant first',
      'Vascular discoloration visible when stem is cut open',
      'Progressive wilting despite adequate water',
      'Stunted growth and eventual plant death',
    ],
    treatments: [
      'No cure available — remove and destroy entire plant',
      'Do not compost infected material',
      'Sterilize all equipment that contacted infected plants',
    ],
    prevention: [
      'Use sterile growing media and pathogen-free transplants',
      'Plant resistant varieties (look for F1, F2, F3 codes)',
      'Clean and sterilize all tools and system components',
      'Avoid moving soil or unsterilized media into hydro system',
    ],
    affectedPlants: ['Basil', 'Tomato', 'Spinach', 'Kale', 'Lettuce', 'Bell Pepper', 'Bird Chili', 'Bitter Melon'],
    imageKeyword: 'fusarium wilt tomato',
    lifeCycle: [
      'Chlamydospore: Survives in soil and debris for 10+ years',
      'Germination: Triggered by root exudates near plant roots',
      'Infection: Enters roots, colonizes xylem vessels, blocks water transport',
      'Spread: Spores move through water and contaminated tools/equipment',
    ],
    treatmentTimeline: [
      { day: 'Day 1', action: 'Remove and destroy entire infected plant' },
      { day: 'Day 1', action: 'Sterilize all tools, trellises, and surfaces with bleach' },
      { day: 'Day 1', action: 'Drain and sterilize reservoir if hydroponic' },
      { day: 'Day 7', action: 'Inspect neighboring plants for early symptoms' },
      { day: 'Ongoing', action: 'Only use resistant varieties in affected area' },
    ],
    affectedGrowthStages: ['seedling', 'vegetative', 'flowering'],
  },
  {
    id: 'tmv',
    name: 'Tobacco Mosaic Virus (TMV)',
    category: 'disease',
    severity: 'high',
    symptoms: [
      'Mottled light and dark green pattern on leaves',
      'Leaf curling, distortion, and stunted growth',
      'Reduced fruit set and uneven ripening',
      'Spreads by direct contact — highly contagious on hands and tools',
    ],
    treatments: [
      'No cure — remove and destroy entire plant immediately',
      'Do not compost infected plants',
      'Sterilize all tools, trellises, and surfaces',
    ],
    prevention: [
      'Wash hands thoroughly with soap before handling plants',
      'Sterilize tools between plants with 10% bleach',
      'Plant resistant varieties (TMV-resistant)',
      'Avoid smoking near plants — tobacco can carry the virus',
    ],
    affectedPlants: ['Tomato', 'Bell Pepper', 'Bird Chili', 'Long Bean', 'Thai Eggplant'],
    imageKeyword: 'tobacco mosaic virus',
    lifeCycle: [
      'Virus particle: Extremely stable, survives years on surfaces and in seed coats',
      'Entry: Enters through wounds or abrasion during handling',
      'Replication: Multiplies in plant cells, spreads systemically via plasmodesmata',
      'Transmission: Spread by human contact, tools, and occasionally seed',
    ],
    treatmentTimeline: [
      { day: 'Day 1', action: 'Remove and destroy infected plant immediately' },
      { day: 'Day 1', action: 'Wash hands thoroughly; sterilize all tools and surfaces' },
      { day: 'Day 1', action: 'Do not touch other plants until hands are washed' },
      { day: 'Day 3', action: 'Inspect all neighboring plants for mosaic patterns' },
      { day: 'Ongoing', action: 'Only plant TMV-resistant varieties in future' },
    ],
    affectedGrowthStages: ['seedling', 'vegetative', 'flowering'],
  },
];

export function getPestDiseaseById(id: string): PestDisease | undefined {
  return pestsAndDiseases.find((p) => p.id === id);
}

export function searchPestsDiseases(query: string): PestDisease[] {
  const q = query.toLowerCase();
  return pestsAndDiseases.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.symptoms.some((s) => s.toLowerCase().includes(q)) ||
      p.affectedPlants.some((a) => a.toLowerCase().includes(q)) ||
      p.treatments.some((t) => t.toLowerCase().includes(q)) ||
      p.prevention.some((pr) => pr.toLowerCase().includes(q))
  );
}

export function getPestsDiseasesByCategory(category: PestDiseaseCategory): PestDisease[] {
  return pestsAndDiseases.filter((p) => p.category === category);
}

export function getPestsDiseasesBySeverity(severity: Severity): PestDisease[] {
  return pestsAndDiseases.filter((p) => p.severity === severity);
}

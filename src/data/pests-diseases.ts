export type PestDiseaseCategory = 'pest' | 'disease';
export type Severity = 'low' | 'medium' | 'high';

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

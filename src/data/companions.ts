export interface CompanionPair {
  plantA: string;
  plantB: string;
  relationship: 'beneficial' | 'harmful' | 'neutral';
  reason: string;
  strength: 'strong' | 'moderate' | 'weak';
}

export interface PlantCompanionInfo {
  plantName: string;
  category: string;
  bestCompanions: string[];
  avoid: string[];
  notes: string;
}

export const companionPairs: CompanionPair[] = [
  // Beneficial pairs
  {
    plantA: 'Tomato',
    plantB: 'Basil',
    relationship: 'beneficial',
    reason: 'Basil repels hornworms, whiteflies, and aphids; enhances tomato flavor.',
    strength: 'strong',
  },
  {
    plantA: 'Tomato',
    plantB: 'Marigold',
    relationship: 'beneficial',
    reason: 'Marigolds reduce whitefly populations and repel root-knot nematodes.',
    strength: 'strong',
  },
  {
    plantA: 'Carrot',
    plantB: 'Onion',
    relationship: 'beneficial',
    reason: 'Mutual pest deterrence — onions repel carrot fly, carrots repel onion fly.',
    strength: 'strong',
  },
  {
    plantA: 'Broccoli',
    plantB: 'Dill',
    relationship: 'beneficial',
    reason: 'Dill attracts parasitic wasps that prey on cabbage worms and aphids.',
    strength: 'moderate',
  },
  {
    plantA: 'Cucumber',
    plantB: 'Radish',
    relationship: 'beneficial',
    reason: 'Radishes deter cucumber beetles and can act as a trap crop.',
    strength: 'moderate',
  },
  {
    plantA: 'Bell Pepper',
    plantB: 'Basil',
    relationship: 'beneficial',
    reason: 'Basil wards off aphids and spider mites that target peppers.',
    strength: 'moderate',
  },
  {
    plantA: 'Kale',
    plantB: 'Dill',
    relationship: 'beneficial',
    reason: 'Dill attracts beneficial insects that control kale pests.',
    strength: 'moderate',
  },
  {
    plantA: 'Lettuce',
    plantB: 'Carrot',
    relationship: 'beneficial',
    reason: 'Carrot roots break up soil, helping lettuce establish shallow roots.',
    strength: 'weak',
  },
  {
    plantA: 'Lettuce',
    plantB: 'Radish',
    relationship: 'beneficial',
    reason: 'Radishes break up soil crust and mature quickly alongside lettuce.',
    strength: 'weak',
  },
  {
    plantA: 'Spinach',
    plantB: 'Strawberry',
    relationship: 'beneficial',
    reason: 'Strawberry ground cover helps keep spinach roots cool and moist.',
    strength: 'weak',
  },
  {
    plantA: 'Thai Eggplant',
    plantB: 'Basil',
    relationship: 'beneficial',
    reason: 'Basil repels flea beetles and spider mites common on eggplants.',
    strength: 'moderate',
  },
  {
    plantA: 'Bird Chili',
    plantB: 'Basil',
    relationship: 'beneficial',
    reason: 'Basil helps repel thrips and aphids from chili plants.',
    strength: 'moderate',
  },
  {
    plantA: 'Cucumber',
    plantB: 'Marigold',
    relationship: 'beneficial',
    reason: 'Marigolds repel nematodes and some cucumber pests.',
    strength: 'moderate',
  },
  {
    plantA: 'Broccoli',
    plantB: 'Onion',
    relationship: 'beneficial',
    reason: 'Onion scent confuses cabbage pests like root maggots and worms.',
    strength: 'moderate',
  },
  {
    plantA: 'Strawberry',
    plantB: 'Onion',
    relationship: 'beneficial',
    reason: 'Onions deter some pests and do not compete for root space.',
    strength: 'weak',
  },
  // Harmful pairs
  {
    plantA: 'Tomato',
    plantB: 'Fennel',
    relationship: 'harmful',
    reason: 'Fennel releases compounds that inhibit tomato growth and development.',
    strength: 'strong',
  },
  {
    plantA: 'Long Bean',
    plantB: 'Onion',
    relationship: 'harmful',
    reason: 'Onions and garlic stunt bean growth by inhibiting nitrogen fixation.',
    strength: 'strong',
  },
  {
    plantA: 'Broccoli',
    plantB: 'Strawberry',
    relationship: 'harmful',
    reason: 'Strawberries compete for nutrients and attract slugs to brassicas.',
    strength: 'moderate',
  },
  {
    plantA: 'Carrot',
    plantB: 'Dill',
    relationship: 'harmful',
    reason: 'Dill can stunt carrot growth when mature and may cross-attract pests.',
    strength: 'moderate',
  },
  {
    plantA: 'Tomato',
    plantB: 'Potato',
    relationship: 'harmful',
    reason: 'Both are susceptible to early and late blight; risk increases when planted together.',
    strength: 'strong',
  },
  {
    plantA: 'Bell Pepper',
    plantB: 'Long Bean',
    relationship: 'harmful',
    reason: 'Beans can stunt pepper growth through root competition and shading.',
    strength: 'moderate',
  },
  {
    plantA: 'Kale',
    plantB: 'Strawberry',
    relationship: 'harmful',
    reason: 'Strawberries compete for soil nutrients and attract aphids.',
    strength: 'moderate',
  },
  {
    plantA: 'Lettuce',
    plantB: 'Broccoli',
    relationship: 'harmful',
    reason: 'Broccoli roots exude compounds that can inhibit lettuce germination.',
    strength: 'weak',
  },
];

export const plantCompanionInfos: PlantCompanionInfo[] = [
  {
    plantName: 'Tomato',
    category: 'vegetable',
    bestCompanions: ['Basil', 'Marigold', 'Carrot', 'Onion'],
    avoid: ['Fennel', 'Potato', 'Kohlrabi'],
    notes: 'Classic companions: basil improves flavor and repels hornworms; marigolds protect roots from nematodes. Keep away from potatoes to prevent blight spread.',
  },
  {
    plantName: 'Lettuce',
    category: 'vegetable',
    bestCompanions: ['Carrot', 'Radish', 'Strawberry', 'Cucumber'],
    avoid: ['Broccoli', 'Cabbage', 'Parsley'],
    notes: 'Shallow-rooted lettuce benefits from soil-busting neighbors like carrots and radishes. Avoid heavy-feeding brassicas nearby.',
  },
  {
    plantName: 'Basil',
    category: 'herb',
    bestCompanions: ['Tomato', 'Pepper', 'Eggplant', 'Cucumber', 'Marigold'],
    avoid: ['Rue', 'Sage', 'Rosemary'],
    notes: 'A universal companion herb. Strong aroma repels aphids, whiteflies, and hornworms for solanaceous crops.',
  },
  {
    plantName: 'Bell Pepper',
    category: 'vegetable',
    bestCompanions: ['Basil', 'Onion', 'Carrot', 'Okra', 'Marigold'],
    avoid: ['Fennel', 'Kohlrabi', 'Apricot'],
    notes: 'Peppers thrive with basil and onion nearby for pest deterrence. Avoid fennel which inhibits nightshade growth.',
  },
  {
    plantName: 'Cucumber',
    category: 'vegetable',
    bestCompanions: ['Nasturtium', 'Corn', 'Beans', 'Radish', 'Marigold'],
    avoid: ['Potato', 'Sage', 'Aromatic herbs'],
    notes: 'Radishes act as a trap crop for cucumber beetles. Marigolds reduce nematode pressure in the soil.',
  },
  {
    plantName: 'Spinach',
    category: 'vegetable',
    bestCompanions: ['Coriander', 'Strawberry', 'Peas', 'Beans'],
    avoid: ['Potato'],
    notes: 'Spinach likes cool, moist conditions. Strawberries can provide living mulch when managed carefully.',
  },
  {
    plantName: 'Kale',
    category: 'vegetable',
    bestCompanions: ['Dill', 'Beet', 'Onion', 'Celery', 'Chamomile'],
    avoid: ['Strawberry', 'Tomato', 'Bean'],
    notes: 'Dill and chamomile attract parasitic wasps and hoverflies that attack cabbage worms. Onions mask brassica scent.',
  },
  {
    plantName: 'Carrot',
    category: 'vegetable',
    bestCompanions: ['Tomato', 'Lettuce', 'Onion', 'Radish', 'Peas'],
    avoid: ['Dill', 'Parsnip'],
    notes: 'Onions are the classic carrot companion, confusing carrot fly with their strong scent. Avoid dill which stunts root growth.',
  },
  {
    plantName: 'Onion',
    category: 'vegetable',
    bestCompanions: ['Carrot', 'Lettuce', 'Tomato', 'Broccoli', 'Strawberry'],
    avoid: ['Beans', 'Peas', 'Sage', 'Asparagus'],
    notes: 'Onions protect many crops from pests with their pungent aroma. Never plant near legumes — they stunt each other.',
  },
  {
    plantName: 'Broccoli',
    category: 'vegetable',
    bestCompanions: ['Onion', 'Celery', 'Dill', 'Chamomile', 'Mint'],
    avoid: ['Strawberry', 'Tomato', 'Pole Bean'],
    notes: 'Aromatic herbs like dill and chamomile attract beneficial predatory insects. Keep strawberries away to avoid pest crossover.',
  },
  {
    plantName: 'Thai Basil',
    category: 'herb',
    bestCompanions: ['Tomato', 'Pepper', 'Eggplant', 'Cucumber'],
    avoid: ['Rue', 'Sage'],
    notes: 'Same companion benefits as sweet basil. Excellent for tropical gardens paired with peppers and eggplants.',
  },
  {
    plantName: 'Bird Chili',
    category: 'vegetable',
    bestCompanions: ['Basil', 'Marigold', 'Onion', 'Carrot'],
    avoid: ['Fennel', 'Kohlrabi', 'Apricot'],
    notes: 'Treat like bell peppers for companions. Basil is especially effective against thrips and aphids on chili.',
  },
  {
    plantName: 'Morning Glory',
    category: 'vegetable',
    bestCompanions: ['Long Bean', 'Corn', 'Okra'],
    avoid: ['Sweet Potato'],
    notes: 'Traditional Thai combination with long beans and corn. Climbing vines need support from sturdy companions.',
  },
  {
    plantName: 'Long Bean',
    category: 'vegetable',
    bestCompanions: ['Corn', 'Okra', 'Morning Glory'],
    avoid: ['Onion', 'Garlic', 'Chives'],
    notes: 'Legumes fix nitrogen for heavy feeders like corn. Absolutely avoid alliums which inhibit nitrogen fixation.',
  },
  {
    plantName: 'Thai Eggplant',
    category: 'vegetable',
    bestCompanions: ['Basil', 'Marigold', 'Pepper', 'Nasturtium'],
    avoid: ['Fennel', 'Tomato', 'Potato'],
    notes: 'Basil and marigolds help repel flea beetles, the eggplant\'s most common pest in tropical climates.',
  },
  {
    plantName: 'Bitter Melon',
    category: 'vegetable',
    bestCompanions: ['Nasturtium', 'Basil', 'Corn'],
    avoid: ['Potato', 'Sweet Potato'],
    notes: 'Vining bitter melon climbs well with corn support. Nasturtiums trap aphids and fruit flies.',
  },
  {
    plantName: 'Marigold',
    category: 'flower',
    bestCompanions: ['Tomato', 'Chili', 'Eggplant', 'Cucumber', 'Basil'],
    avoid: [],
    notes: 'The ultimate companion flower. Root exudates suppress nematodes and flowers attract pollinators to vegetable beds.',
  },
  {
    plantName: 'Strawberry',
    category: 'fruit',
    bestCompanions: ['Lettuce', 'Spinach', 'Onion', 'Thyme', 'Borage'],
    avoid: ['Broccoli', 'Cabbage', 'Kale', 'Tomato', 'Potato'],
    notes: 'Low-growing strawberries work well with upright spinach and lettuce. Avoid brassicas which share common pests.',
  },
];

export function getCompanionPairsForPlant(plantName: string): CompanionPair[] {
  return companionPairs.filter(
    (p) => p.plantA.toLowerCase() === plantName.toLowerCase() || p.plantB.toLowerCase() === plantName.toLowerCase()
  );
}

export function getPlantCompanionInfo(plantName: string): PlantCompanionInfo | undefined {
  return plantCompanionInfos.find((p) => p.plantName.toLowerCase() === plantName.toLowerCase());
}

export function getAllPlantNames(): string[] {
  return plantCompanionInfos.map((p) => p.plantName).sort();
}

import { GrowingSystem } from '@/types';

export const growingSystems: GrowingSystem[] = [
  {
    id: 'nft',
    name: 'Nutrient Film Technique (NFT)',
    description:
      'A thin film of nutrient solution continuously flows over plant roots in sloped channels. Ideal for leafy greens and herbs with small root systems.',
    difficulty: 'intermediate',
    idealCrops: ['Lettuce', 'Spinach', 'Kale', 'Bok Choy', 'Thai Basil', 'Mint', 'Coriander', 'Strawberry'],
    pros: ['Water efficient', 'Fast growth rates', 'Easy to inspect roots', 'Scalable', 'No growing medium needed'],
    cons: ['Pump failure is critical', 'Not suitable for large/root crops', 'Risk of root drying', 'Channel clogging'],
    setupCost: 'medium',
    maintenanceLevel: 'medium',
  },
  {
    id: 'dwc',
    name: 'Deep Water Culture (DWC)',
    description:
      'Plant roots are suspended in a nutrient-rich, oxygenated water reservoir. An air pump provides continuous oxygen to prevent root rot.',
    difficulty: 'beginner',
    idealCrops: ['Lettuce', 'Spinach', 'Bok Choy', 'Thai Basil', 'Mint', 'Coriander', 'Kale'],
    pros: ['Simple to build and operate', 'Low maintenance', 'Fast plant growth', 'Great for beginners', 'No watering schedule needed'],
    cons: ['Power failure is catastrophic', 'Water temperature must be controlled', 'Difficult to move plants', 'Algae growth risk in reservoirs'],
    setupCost: 'low',
    maintenanceLevel: 'low',
  },
  {
    id: 'ebb-flow',
    name: 'Ebb and Flow (Flood and Drain)',
    description:
      'Grow tray is periodically flooded with nutrient solution, then drained back to reservoir. Mimics natural tidal patterns.',
    difficulty: 'intermediate',
    idealCrops: ['Tomato', 'Bell Pepper', 'Eggplant', 'Broccoli', 'Cauliflower', 'Cabbage', 'Herbs', 'Strawberry'],
    pros: ['Versatile for many crops', 'Good root oxygenation', 'Reliable and forgiving', 'Easy to expand'],
    cons: ['Requires timer and pump', 'Medium complexity', 'Growing medium costs', 'Risk of root diseases if drainage poor'],
    setupCost: 'medium',
    maintenanceLevel: 'medium',
  },
  {
    id: 'drip',
    name: 'Drip System',
    description:
      'Nutrient solution is dripped directly onto the base of each plant through emitters. Can be recovery or non-recovery.',
    difficulty: 'intermediate',
    idealCrops: ['Tomato', 'Bell Pepper', 'Eggplant', 'Cucumber', 'Zucchini', 'Pumpkin', 'Melon', 'Watermelon', 'Papaya'],
    pros: ['Highly efficient water use', 'Precise nutrient delivery', 'Scalable to any size', 'Works with many media'],
    cons: ['Emitter clogging', 'Requires regular maintenance', 'Higher initial cost', 'pH and EC drift possible'],
    setupCost: 'medium',
    maintenanceLevel: 'medium',
  },
  {
    id: 'aeroponics',
    name: 'Aeroponics',
    description:
      'Plant roots hang in air and are misted with nutrient solution at intervals. Provides maximum oxygen exposure to roots.',
    difficulty: 'advanced',
    idealCrops: ['Lettuce', 'Thai Basil', 'Mint', 'Tomato', 'Bell Pepper', 'Strawberry', 'Cucumber'],
    pros: ['Fastest growth rates', 'Highest oxygen delivery', 'Extremely water efficient', 'No growing medium'],
    cons: ['Very high technical complexity', 'Nozzle clogging', 'Power failure is fatal within hours', 'Expensive to set up'],
    setupCost: 'high',
    maintenanceLevel: 'high',
  },
  {
    id: 'wicking',
    name: 'Wicking System',
    description:
      'Passive system where a wick draws nutrient solution from reservoir to plant roots by capillary action. No pumps needed.',
    difficulty: 'beginner',
    idealCrops: ['Lettuce', 'Spinach', 'Bok Choy', 'Herbs', 'Radish', 'Spring Onion'],
    pros: ['No electricity required', 'Very simple', 'Low cost', 'No moving parts', 'Great for indoor/educational'],
    cons: ['Limited to small plants', 'Wick can become saturated or clogged', 'Slow growth compared to active systems', 'Not scalable'],
    setupCost: 'low',
    maintenanceLevel: 'low',
  },
  {
    id: 'dutch-bucket',
    name: 'Dutch Bucket',
    description:
      'Individual buckets filled with growing medium, each with a drip emitter. Excess solution drains to a common return line.',
    difficulty: 'intermediate',
    idealCrops: ['Tomato', 'Bell Pepper', 'Eggplant', 'Cucumber', 'Zucchini', 'Pumpkin', 'Melon', 'Bitter Melon'],
    pros: ['Excellent for vining/fruiting crops', 'Individual plant management', 'Good drainage and aeration', 'Modular and expandable'],
    cons: ['Higher medium cost per plant', 'More plumbing', 'Requires more space', 'Regular emitter cleaning needed'],
    setupCost: 'medium',
    maintenanceLevel: 'medium',
  },
  {
    id: 'kratky',
    name: 'Kratky Method',
    description:
      'Passive non-circulating DWC. Plants in net pots partially submerged; as water level drops, roots access air gap. No pumps or electricity.',
    difficulty: 'beginner',
    idealCrops: ['Lettuce', 'Spinach', 'Bok Choy', 'Thai Basil', 'Mint', 'Coriander', 'Kale', 'Swiss Chard'],
    pros: ['Zero electricity', 'Extremely simple', 'Very low cost', 'Perfect for beginners', 'Low maintenance'],
    cons: ['Single harvest per reservoir fill', 'Not for large/fruiting plants', 'Water level must be carefully set initially', 'Temperature sensitive'],
    setupCost: 'low',
    maintenanceLevel: 'low',
  },
  {
    id: 'vertical-tower',
    name: 'Vertical Tower',
    description:
      'Plants grown in stacked vertical columns with nutrient solution pumped to the top and cascading down. Maximizes space efficiency.',
    difficulty: 'intermediate',
    idealCrops: ['Lettuce', 'Spinach', 'Bok Choy', 'Thai Basil', 'Mint', 'Coriander', 'Strawberry', 'Kale'],
    pros: ['Extremely space efficient', 'High plant density', 'Aesthetic appeal', 'Good for urban farming'],
    cons: ['Uneven light distribution', 'Pump and plumbing complexity', 'Hard to reach top plants', 'Higher initial cost'],
    setupCost: 'high',
    maintenanceLevel: 'medium',
  },
  {
    id: 'rail-gutter',
    name: 'Rail / Gutter System',
    description:
      'Plants grown in horizontal rain gutters or PVC pipes, typically using NFT or drip principles. Great for green walls and small spaces.',
    difficulty: 'beginner',
    idealCrops: ['Lettuce', 'Spinach', 'Bok Choy', 'Thai Basil', 'Mint', 'Coriander', 'Strawberry', 'Spring Onion'],
    pros: ['Space efficient', 'Easy to build from gutters', 'Good for walls and fences', 'Low cost DIY option'],
    cons: ['Limited root space', 'Can heat up in sun', 'Not for large plants', 'Drainage design critical'],
    setupCost: 'low',
    maintenanceLevel: 'low',
  },
  {
    id: 'media-aquaponics',
    name: 'Media-Based Aquaponics',
    description:
      'Fish tank water is pumped into grow beds filled with media (clay pebbles, gravel). Plants filter water which returns to fish tank.',
    difficulty: 'intermediate',
    idealCrops: ['Tomato', 'Bell Pepper', 'Cucumber', 'Eggplant', 'Herbs', 'Lettuce', 'Kale', 'Strawberry'],
    pros: ['Dual production (fish + plants)', 'No synthetic fertilizers', 'Natural ecosystem', 'Low water use long-term'],
    cons: ['Requires fish knowledge', 'System cycling takes weeks', 'pH balancing is tricky', 'Higher initial complexity'],
    setupCost: 'high',
    maintenanceLevel: 'high',
  },
  {
    id: 'nft-aquaponics',
    name: 'NFT Aquaponics',
    description:
      'Combines aquaculture with NFT channels. Fish water is filtered and passed through NFT channels before returning to fish tank.',
    difficulty: 'advanced',
    idealCrops: ['Lettuce', 'Spinach', 'Bok Choy', 'Thai Basil', 'Mint', 'Coriander', 'Kale', 'Swiss Chard'],
    pros: ['Very fast plant growth', 'Highly water efficient', 'Clean NFT channels', 'Good for leafy greens'],
    cons: ['Requires excellent filtration', 'Fish waste solids must be removed', 'Advanced balancing needed', 'High technical complexity'],
    setupCost: 'high',
    maintenanceLevel: 'high',
  },
];

export function getSystemById(id: string): GrowingSystem | undefined {
  return growingSystems.find((s) => s.id === id);
}

export function getSystemsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): GrowingSystem[] {
  return growingSystems.filter((s) => s.difficulty === difficulty);
}

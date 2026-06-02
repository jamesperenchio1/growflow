import { NutrientBrand, GrowthStage } from '@/types';

export const nutrientBrands: NutrientBrand[] = [
  {
    name: 'General Hydroponics',
    country: 'US',
    products: [
      { name: 'FloraGro', type: 'base', npk: '2-1-6', mlPerLiter: 2.5, stages: ['seedling', 'vegetative'] },
      { name: 'FloraBloom', type: 'base', npk: '0-5-4', mlPerLiter: 2.5, stages: ['flowering', 'fruiting'] },
      { name: 'FloraMicro', type: 'base', npk: '5-0-1', mlPerLiter: 2.5, stages: ['germination', 'seedling', 'vegetative', 'flowering', 'fruiting'] },
      { name: 'CALiMAGic', type: 'supplement', npk: '1-0-0', mlPerLiter: 1.0, stages: ['vegetative', 'flowering', 'fruiting'] },
      { name: 'pH Down', type: 'ph_down', mlPerLiter: 0.5, stages: ['germination', 'seedling', 'vegetative', 'flowering', 'fruiting'] },
    ],
  },
  {
    name: 'Masterblend',
    country: 'US',
    products: [
      { name: '4-18-38 Tomato Formula', type: 'base', npk: '4-18-38', mlPerLiter: 2.0, stages: ['vegetative', 'flowering', 'fruiting'] },
      { name: 'Calcium Nitrate', type: 'supplement', npk: '15.5-0-0', mlPerLiter: 2.0, stages: ['vegetative', 'flowering', 'fruiting'] },
      { name: 'Epsom Salt', type: 'supplement', npk: '0-0-0', mlPerLiter: 1.0, stages: ['vegetative', 'flowering', 'fruiting'] },
    ],
  },
  {
    name: 'Hydro A+B Thai',
    country: 'Thailand',
    products: [
      { name: 'Hydro A', type: 'base', npk: '4-0-4', mlPerLiter: 2.0, stages: ['germination', 'seedling', 'vegetative', 'flowering', 'fruiting'] },
      { name: 'Hydro B', type: 'base', npk: '1-4-6', mlPerLiter: 2.0, stages: ['germination', 'seedling', 'vegetative', 'flowering', 'fruiting'] },
      { name: 'Cal-Mag Thai', type: 'supplement', npk: '2-0-0', mlPerLiter: 1.0, stages: ['vegetative', 'flowering', 'fruiting'] },
      { name: 'pH Adjust Thai', type: 'ph_down', mlPerLiter: 0.5, stages: ['germination', 'seedling', 'vegetative', 'flowering', 'fruiting'] },
    ],
  },
  {
    name: 'BioThai',
    country: 'Thailand',
    products: [
      { name: 'Bio Veg', type: 'base', npk: '3-1-4', mlPerLiter: 3.0, stages: ['seedling', 'vegetative'] },
      { name: 'Bio Bloom', type: 'base', npk: '1-3-5', mlPerLiter: 3.0, stages: ['flowering', 'fruiting'] },
      { name: 'Bio Root', type: 'supplement', npk: '0.5-0-0.5', mlPerLiter: 2.0, stages: ['germination', 'seedling'] },
      { name: 'Bio Boost', type: 'supplement', npk: '0-1-2', mlPerLiter: 1.5, stages: ['flowering', 'fruiting'] },
    ],
  },
  {
    name: 'Chia Tai',
    country: 'Thailand',
    products: [
      { name: 'CT Hydro Grow', type: 'base', npk: '7-3-5', mlPerLiter: 2.0, stages: ['seedling', 'vegetative'] },
      { name: 'CT Hydro Bloom', type: 'base', npk: '3-5-8', mlPerLiter: 2.0, stages: ['flowering', 'fruiting'] },
      { name: 'CT Cal-Mag', type: 'supplement', npk: '2-0-0', mlPerLiter: 1.0, stages: ['vegetative', 'flowering', 'fruiting'] },
    ],
  },
  {
    name: 'Canna',
    country: 'Netherlands',
    products: [
      { name: 'Canna Vega', type: 'base', npk: '6-2-8', mlPerLiter: 2.0, stages: ['seedling', 'vegetative'] },
      { name: 'Canna Flores', type: 'base', npk: '2-2-4', mlPerLiter: 2.0, stages: ['flowering', 'fruiting'] },
      { name: 'Canna Rhizotonic', type: 'supplement', npk: '0-0-0', mlPerLiter: 2.0, stages: ['germination', 'seedling'] },
      { name: 'Canna PK 13/14', type: 'supplement', npk: '0-13-14', mlPerLiter: 1.5, stages: ['flowering', 'fruiting'] },
      { name: 'Canna Cannazym', type: 'supplement', npk: '0-0-0', mlPerLiter: 2.0, stages: ['vegetative', 'flowering', 'fruiting'] },
    ],
  },
];

function stageTargets(
  g: [number, number, number, number, number, number],
  s: [number, number, number, number, number, number],
  v: [number, number, number, number, number, number],
  f: [number, number, number, number, number, number],
  fr: [number, number, number, number, number, number]
): Record<string, { ec: [number, number]; ph: [number, number]; npk: [number, number, number] }> {
  return {
    germination: { ec: [g[0], g[1]], ph: [g[2], g[3]], npk: [g[4], g[5], g[5]] },
    seedling: { ec: [s[0], s[1]], ph: [s[2], s[3]], npk: [s[4], s[5], s[5]] },
    vegetative: { ec: [v[0], v[1]], ph: [v[2], v[3]], npk: [v[4], v[5], v[5]] },
    flowering: { ec: [f[0], f[1]], ph: [f[2], f[3]], npk: [f[4], f[5], f[5]] },
    fruiting: { ec: [fr[0], fr[1]], ph: [fr[2], fr[3]], npk: [fr[4], fr[5], fr[5]] },
  };
}

const vLow = stageTargets(
  [0.8, 1.2, 5.5, 6.0, 1, 1],
  [1.0, 1.4, 5.5, 6.0, 2, 1],
  [1.2, 1.6, 5.8, 6.2, 2, 1],
  [1.2, 1.6, 5.8, 6.2, 2, 1],
  [1.0, 1.4, 5.8, 6.2, 2, 1]
);

const vMed = stageTargets(
  [0.8, 1.2, 5.5, 6.0, 1, 1],
  [1.0, 1.4, 5.5, 6.0, 2, 1],
  [1.5, 2.0, 5.8, 6.2, 3, 1],
  [1.8, 2.4, 5.8, 6.3, 2, 2],
  [2.0, 2.8, 5.8, 6.3, 2, 2]
);

const vHigh = stageTargets(
  [0.8, 1.2, 5.5, 6.0, 1, 1],
  [1.0, 1.4, 5.5, 6.0, 2, 1],
  [1.8, 2.5, 5.8, 6.3, 3, 1],
  [2.0, 2.8, 5.8, 6.3, 2, 2],
  [2.2, 3.0, 5.8, 6.3, 2, 2]
);

const herbLow = stageTargets(
  [0.5, 1.0, 5.5, 6.0, 1, 1],
  [0.8, 1.2, 5.5, 6.0, 2, 1],
  [1.0, 1.4, 5.8, 6.2, 2, 1],
  [1.0, 1.4, 5.8, 6.2, 2, 1],
  [1.0, 1.4, 5.8, 6.2, 2, 1]
);

const herbMed = stageTargets(
  [0.5, 1.0, 5.5, 6.0, 1, 1],
  [0.8, 1.2, 5.5, 6.0, 2, 1],
  [1.2, 1.6, 5.8, 6.2, 3, 1],
  [1.2, 1.6, 5.8, 6.2, 2, 2],
  [1.2, 1.6, 5.8, 6.2, 2, 2]
);

const fruitMed = stageTargets(
  [0.5, 1.0, 5.5, 6.0, 1, 1],
  [1.0, 1.5, 5.5, 6.0, 2, 1],
  [1.5, 2.2, 5.8, 6.3, 3, 1],
  [1.8, 2.5, 5.8, 6.3, 2, 2],
  [2.0, 3.0, 5.8, 6.3, 2, 2]
);

const fruitHigh = stageTargets(
  [0.5, 1.0, 5.5, 6.0, 1, 1],
  [1.0, 1.5, 5.5, 6.0, 2, 1],
  [1.8, 2.5, 5.8, 6.3, 3, 1],
  [2.0, 2.8, 5.8, 6.3, 2, 2],
  [2.2, 3.2, 5.8, 6.3, 2, 2]
);

const flowerMed = stageTargets(
  [0.5, 1.0, 5.5, 6.0, 1, 1],
  [0.8, 1.2, 5.5, 6.2, 2, 1],
  [1.2, 1.8, 5.8, 6.2, 3, 1],
  [1.5, 2.0, 5.8, 6.3, 2, 2],
  [1.2, 1.8, 5.8, 6.3, 2, 2]
);

export const nutrientTargets: Record<string, Record<string, { ec: [number, number]; ph: [number, number]; npk: [number, number, number] }>> = {
  // Thai staples
  'Thai Basil': herbMed,
  'Bird Chili': vMed,
  'Morning Glory': vLow,
  'Long Bean': vMed,
  'Thai Eggplant': vMed,
  'Bitter Melon': vMed,
  'Cucumber': vMed,
  'Tomato': vMed,
  'Lemongrass': herbMed,
  'Coriander': herbLow,
  'Turmeric': herbMed,
  'Galangal': herbMed,
  'Garlic': vLow,
  'Papaya': fruitHigh,
  'Banana': fruitHigh,
  'Mango': fruitHigh,
  'Lime': fruitHigh,
  'Thai Chili': vMed,
  'Holy Basil': herbMed,
  'Ginger': herbMed,

  // Global vegetables
  'Lettuce': vLow,
  'Spinach': vLow,
  'Kale': vMed,
  'Carrot': vLow,
  'Radish': vLow,
  'Beetroot': vLow,
  'Onion': vLow,
  'Potato': vMed,
  'Sweet Potato': vMed,
  'Bell Pepper': vMed,
  'Zucchini': vMed,
  'Pumpkin': vMed,
  'Corn': vMed,
  'Broccoli': vMed,
  'Cauliflower': vMed,
  'Cabbage': vMed,
  'Celery': vMed,
  'Peas': vLow,
  'Green Beans': vMed,
  'Asparagus': vLow,
  'Melon': vMed,
  'Watermelon': vMed,
  'Eggplant': vMed,
  'Brussels Sprouts': vMed,
  'Okra': vMed,
  'Swiss Chard': vMed,
  'Bok Choy': vLow,
  'Leek': vLow,
  'Shallot': vLow,
  'Spring Onion': vLow,
  'Turnip': vLow,
  'Parsnip': vLow,
  'Artichoke': vMed,
  'Rhubarb': vLow,
  'Fennel': vLow,
  'Snow Peas': vLow,

  // Herbs
  'Mint': herbMed,
  'Rosemary': herbLow,
  'Thyme': herbLow,
  'Oregano': herbLow,
  'Parsley': herbLow,
  'Dill': herbMed,
  'Chives': vLow,
  'Sage': herbLow,
  'Sweet Basil': herbMed,
  'Tarragon': herbLow,
  'Lavender': herbLow,
  'Chamomile': herbLow,
  'Marjoram': herbLow,
  'Bay Leaf': herbLow,
  'Lemon Balm': herbMed,

  // Fruits
  'Strawberry': fruitMed,
  'Blueberry': fruitMed,
  'Raspberry': fruitMed,
  'Blackberry': fruitMed,
  'Pineapple': fruitMed,
  'Orange': fruitHigh,
  'Lemon': fruitHigh,
  'Grapefruit': fruitHigh,
  'Apple': fruitHigh,
  'Pear': fruitHigh,
  'Peach': fruitHigh,
  'Plum': fruitHigh,
  'Cherry': fruitHigh,
  'Grape': fruitMed,
  'Kiwi': fruitMed,
  'Passion Fruit': fruitMed,
  'Dragon Fruit': fruitMed,
  'Lychee': fruitHigh,
  'Longan': fruitHigh,
  'Rambutan': fruitHigh,
  'Durian': fruitHigh,
  'Jackfruit': fruitHigh,
  'Coconut': fruitHigh,
  'Tamarind': fruitHigh,
  'Avocado': fruitHigh,

  // Flowers
  'Marigold': flowerMed,
  'Sunflower': flowerMed,
  'Nasturtium': flowerMed,
  'Borage': flowerMed,
  'Calendula': flowerMed,
  'Zinnia': flowerMed,
  'Cosmos': flowerMed,
  'Viola': flowerMed,
  'Snapdragon': flowerMed,
  'Petunia': flowerMed,
  'Pansy': flowerMed,
};

export function getNutrientTarget(
  plantName: string,
  stage: GrowthStage
): { ec: [number, number]; ph: [number, number]; npk: [number, number, number] } | undefined {
  const plant = nutrientTargets[plantName];
  if (!plant) return undefined;
  return plant[stage];
}

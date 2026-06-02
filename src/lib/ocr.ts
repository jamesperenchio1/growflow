export interface ExtractedSeedData {
  plantName: string | null;
  variety: string | null;
  daysToGermination: number | null;
  daysToMaturity: number | null;
  sowingDepthMm: number | null;
  spacingCm: number | null;
  sunNeeds: 'full' | 'partial' | 'shade' | null;
  confidence: number;
}

export async function extractSeedPacketData(imageBlob: Blob): Promise<ExtractedSeedData> {
  const { createWorker } = await import('tesseract.js');

  const worker = await createWorker('eng');
  try {
    const {
      data: { text, confidence },
    } = await worker.recognize(imageBlob);

    const normalized = text.toLowerCase().replace(/[^a-z0-9\s.,\-/()]/g, ' ');

    return {
      plantName: parsePlantName(normalized),
      variety: parseVariety(normalized),
      daysToGermination: parseDaysToGermination(normalized),
      daysToMaturity: parseDaysToMaturity(normalized),
      sowingDepthMm: parseDepth(normalized),
      spacingCm: parseSpacing(normalized),
      sunNeeds: parseSunNeeds(normalized),
      confidence: Math.round(confidence),
    };
  } finally {
    await worker.terminate();
  }
}

function parsePlantName(text: string): string | null {
  // Look for common patterns like "[Name] seeds" or "[Name] variety"
  const patterns = [
    /(?:variety|type)\s*[:\-]?\s*([a-z]+(?:\s+[a-z]+){0,2})/,
    /^\s*([a-z]+(?:\s+[a-z]+){0,2})\s+(?:seeds?|packet)/,
    /([a-z]+(?:\s+[a-z]+){0,2})\s+(?:hybrid|heirloom|organic)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name.length > 2) {
        return capitalize(name);
      }
    }
  }

  // Fallback: first word that looks like a plant name
  const commonPlants = [
    'tomato', 'lettuce', 'basil', 'pepper', 'cucumber', 'spinach',
    'kale', 'bean', 'carrot', 'onion', 'garlic', 'corn', 'squash',
    'melon', 'watermelon', 'pumpkin', 'broccoli', 'cauliflower',
    'cabbage', 'radish', 'beet', 'pea', 'mint', 'thyme', 'rosemary',
    'parsley', 'cilantro', 'dill', 'oregano', 'sage', 'chive',
  ];

  for (const plant of commonPlants) {
    if (text.includes(plant)) {
      return capitalize(plant);
    }
  }

  return null;
}

function parseVariety(text: string): string | null {
  const match = text.match(/variety\s*[:\-]?\s*([a-z0-9\s]+?)(?:\n|\r|days|germination|maturity|sow|plant|sun|$)/i);
  if (match && match[1]) {
    const variety = match[1].trim();
    if (variety.length > 2) {
      return capitalize(variety);
    }
  }
  return null;
}

function parseDaysToGermination(text: string): number | null {
  const patterns = [
    /germination\s*[:\-]?\s*(\d+)\s*(?:to|-|~)?\s*\d*\s*days?/,
    /(?:germinates?|sprouts?)\s+in\s+(\d+)\s*(?:to|-|~)?\s*\d*\s*days?/,
    /(\d+)\s*(?:to|-|~)?\s*\d*\s*days?\s+to\s+germinate/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  return null;
}

function parseDaysToMaturity(text: string): number | null {
  const patterns = [
    /maturity\s*[:\-]?\s*(\d+)\s*(?:to|-|~)?\s*\d*\s*days?/,
    /(?:matures?|harvest)\s+in\s+(\d+)\s*(?:to|-|~)?\s*\d*\s*days?/,
    /(\d+)\s*(?:to|-|~)?\s*\d*\s*days?\s+to\s+matur/,
    /(\d+)\s*days?\s*\n/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  return null;
}

function parseDepth(text: string): number | null {
  const patterns = [
    /(?:sow|plant|seed)\s+(?:at|to)?\s*depth\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:mm|cm|in)/,
    /depth\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:mm|cm|in)/,
    /(?:sow|plant)\s+(\d+(?:\.\d+)?)\s*(?:mm|cm|in)\s*(?:deep|down)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      let val = parseFloat(match[1]);
      if (text.substring(match.index ?? 0, (match.index ?? 0) + 20).includes('cm')) {
        val = val * 10;
      } else if (text.substring(match.index ?? 0, (match.index ?? 0) + 20).includes('in')) {
        val = val * 25.4;
      }
      return Math.round(val);
    }
  }
  return null;
}

function parseSpacing(text: string): number | null {
  const patterns = [
    /(?:space|spacing|plant)\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:cm|in|mm)?\s*(?:apart|between)/,
    /spacing\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:cm|in|mm)/,
    /(\d+(?:\.\d+)?)\s*(?:cm|in|mm)\s*spacing/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      let val = parseFloat(match[1]);
      if (text.substring(match.index ?? 0, (match.index ?? 0) + 20).includes('in')) {
        val = val * 2.54;
      } else if (text.substring(match.index ?? 0, (match.index ?? 0) + 20).includes('mm')) {
        val = val / 10;
      }
      return Math.round(val);
    }
  }
  return null;
}

function parseSunNeeds(text: string): 'full' | 'partial' | 'shade' | null {
  if (text.includes('full sun') || text.includes('direct sun')) return 'full';
  if (text.includes('partial sun') || text.includes('partial shade') || text.includes('part sun')) return 'partial';
  if (text.includes('full shade') || text.includes('shade')) return 'shade';
  if (text.includes('sun')) return 'full';
  return null;
}

function capitalize(str: string): string {
  return str
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

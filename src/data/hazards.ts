import { ThaiHazard } from '@/types';

function getThaiSeason(date: Date): 'cool' | 'hot' | 'rainy' {
  const month = date.getMonth() + 1; // 1-indexed
  if (month >= 11 || month <= 2) return 'cool';
  if (month >= 3 && month <= 5) return 'hot';
  return 'rainy';
}

export function evaluateThaiHazards(
  date: Date,
  temp: number,
  precipitation: number,
  humidity: number,
  windSpeed: number
): ThaiHazard[] {
  const hazards: ThaiHazard[] = [];
  const season = getThaiSeason(date);

  // Heatwave
  if (temp >= 42) {
    hazards.push({
      type: 'heatwave',
      severity: 'extreme',
      title: 'Extreme Heatwave',
      description: 'Extreme heat stress. Crop failure risk for most vegetables.',
      farmingAction: 'Provide heavy shade cloth (50-70%), increase watering frequency, misting systems, avoid transplanting.',
    });
  } else if (temp >= 38) {
    hazards.push({
      type: 'heatwave',
      severity: 'high',
      title: 'Severe Heat Stress',
      description: 'Severe heat stress. Fruit drop and blossom abortion likely.',
      farmingAction: 'Install shade cloth, increase irrigation, apply mulch, water early morning and evening.',
    });
  } else if (temp >= 35 && season === 'hot') {
    hazards.push({
      type: 'heatwave',
      severity: 'moderate',
      title: 'Hot Season Heat',
      description: 'Elevated temperatures during hot season. Monitor sensitive crops.',
      farmingAction: 'Partial shade for leafy greens, increase watering, avoid fertilizing during peak heat.',
    });
  } else if (temp >= 33 && season === 'cool') {
    hazards.push({
      type: 'heatwave',
      severity: 'low',
      title: 'Unseasonable Warmth',
      description: 'Unusually warm for cool season. Some cool-season crops may bolt.',
      farmingAction: 'Monitor lettuce and spinach for bolting; provide light afternoon shade.',
    });
  }

  // Flooding
  if (precipitation >= 100) {
    hazards.push({
      type: 'flooding',
      severity: 'extreme',
      title: 'Flash Flood Risk',
      description: 'Heavy rainfall causing flash flood risk. Root rot imminent.',
      farmingAction: 'Evacuate seedlings to higher ground, ensure drainage channels are clear, harvest mature crops immediately.',
    });
  } else if (precipitation >= 70) {
    hazards.push({
      type: 'flooding',
      severity: 'high',
      title: 'Heavy Rainfall',
      description: 'Significant rainfall. Waterlogging risk for container and raised bed systems.',
      farmingAction: 'Check drainage, raise containers, reduce irrigation, monitor for root rot symptoms.',
    });
  } else if (precipitation >= 40 && season === 'rainy') {
    hazards.push({
      type: 'flooding',
      severity: 'moderate',
      title: 'Monsoon Rainfall',
      description: 'Monsoon rainfall. Slow drainage may affect root health.',
      farmingAction: 'Ensure raised beds and containers have drainage holes, reduce watering schedule.',
    });
  } else if (precipitation >= 25 && season === 'cool') {
    hazards.push({
      type: 'flooding',
      severity: 'low',
      title: 'Above-Average Rain',
      description: 'Above-average rainfall for cool season. Monitor soil moisture.',
      farmingAction: 'Reduce supplemental watering, check drainage systems.',
    });
  }

  // Drought
  if (precipitation === 0 && humidity < 30 && temp > 35) {
    hazards.push({
      type: 'drought',
      severity: 'high',
      title: 'Critical Dry Conditions',
      description: 'Critical dry conditions with high evapotranspiration.',
      farmingAction: 'Increase irrigation to twice daily, deep water in early morning, apply thick mulch layer.',
    });
  } else if (precipitation < 5 && humidity < 40 && temp > 32) {
    hazards.push({
      type: 'drought',
      severity: 'moderate',
      title: 'Dry Spell',
      description: 'Dry spell with low humidity. Soil moisture depleting rapidly.',
      farmingAction: 'Increase watering frequency, mulch heavily, avoid overhead watering to reduce evaporation.',
    });
  } else if (precipitation < 10 && humidity < 50 && season === 'hot') {
    hazards.push({
      type: 'drought',
      severity: 'low',
      title: 'Low Moisture',
      description: 'Below-average moisture during hot season.',
      farmingAction: 'Monitor soil moisture regularly, maintain mulch layer.',
    });
  }

  // Fungal risk
  if (humidity >= 90 && temp >= 25 && precipitation >= 20) {
    hazards.push({
      type: 'fungal_risk',
      severity: 'extreme',
      title: 'Extreme Fungal Risk',
      description: 'Conditions highly favorable for fungal diseases. Downy mildew, blight, and root rot risk.',
      farmingAction: 'Apply preventive fungicide (organic: copper, neem), increase air circulation, avoid wetting foliage, remove infected plant material immediately.',
    });
  } else if (humidity >= 85 && temp >= 22 && precipitation >= 10) {
    hazards.push({
      type: 'fungal_risk',
      severity: 'high',
      title: 'High Fungal Risk',
      description: 'High humidity and moisture favor fungal growth.',
      farmingAction: 'Space plants for airflow, water at soil level, apply preventive copper spray, harvest in dry conditions.',
    });
  } else if (humidity >= 80 && temp >= 20) {
    hazards.push({
      type: 'fungal_risk',
      severity: 'moderate',
      title: 'Elevated Fungal Risk',
      description: 'Elevated humidity may promote fungal issues.',
      farmingAction: 'Monitor for early signs of mildew, ensure good spacing, avoid evening watering.',
    });
  } else if (humidity >= 75 && season === 'rainy') {
    hazards.push({
      type: 'fungal_risk',
      severity: 'low',
      title: 'Monsoon Humidity',
      description: 'Monsoon humidity baseline. Standard fungal vigilance required.',
      farmingAction: 'Regular scouting for diseases, maintain clean growing area.',
    });
  }

  // Typhoon
  if (windSpeed >= 118) {
    hazards.push({
      type: 'typhoon',
      severity: 'extreme',
      title: 'Super Typhoon',
      description: 'Super typhoon conditions. Catastrophic damage to crops and structures.',
      farmingAction: 'Secure or move all lightweight structures indoors, harvest all mature crops, brace trellises, seek personal safety.',
    });
  } else if (windSpeed >= 89) {
    hazards.push({
      type: 'typhoon',
      severity: 'high',
      title: 'Typhoon Conditions',
      description: 'Typhoon-force winds expected. Major structural and crop damage likely.',
      farmingAction: 'Secure greenhouses and shade houses, harvest mature produce, lower or remove shade cloth, move containers to sheltered area.',
    });
  } else if (windSpeed >= 64) {
    hazards.push({
      type: 'typhoon',
      severity: 'moderate',
      title: 'Severe Tropical Storm',
      description: 'Severe tropical storm winds. Young plants and trellises at risk.',
      farmingAction: 'Stake tall plants, secure trellises, move lightweight containers, postpone transplanting.',
    });
  } else if (windSpeed >= 40 && season === 'rainy') {
    hazards.push({
      type: 'typhoon',
      severity: 'low',
      title: 'Strong Monsoon Winds',
      description: 'Strong monsoon winds. Some physical damage possible.',
      farmingAction: 'Check plant staking, secure loose items, monitor for wind burn on sensitive plants.',
    });
  }

  // Monsoon
  if (season === 'rainy' && precipitation >= 50 && humidity >= 85) {
    hazards.push({
      type: 'monsoon',
      severity: 'high',
      title: 'Active Monsoon',
      description: 'Active monsoon conditions. Prolonged wet weather challenges.',
      farmingAction: 'Prioritize drainage, use raised beds, cover sensitive crops, reduce nitrogen fertilizer, increase fungicide applications.',
    });
  } else if (season === 'rainy' && precipitation >= 30 && humidity >= 80) {
    hazards.push({
      type: 'monsoon',
      severity: 'moderate',
      title: 'Monsoon Conditions',
      description: 'Monsoon conditions affecting pollination and fruit set.',
      farmingAction: 'Hand pollinate tomatoes and peppers if needed, ensure drainage, harvest before heavy rain events.',
    });
  } else if (season === 'rainy' && precipitation >= 15) {
    hazards.push({
      type: 'monsoon',
      severity: 'low',
      title: 'Typical Monsoon',
      description: 'Typical monsoon rainfall. Standard wet-season practices apply.',
      farmingAction: 'Maintain drainage, scout for pests and diseases, avoid working in wet soil.',
    });
  }

  return hazards.sort((a, b) => {
    const order = { extreme: 4, high: 3, moderate: 2, low: 1 };
    return order[b.severity] - order[a.severity];
  });
}

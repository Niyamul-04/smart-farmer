export interface Division {
  id: string;
  name: string;
  bnName: string;
  lat: number;
  lon: number;
  districtsCount: number;
}

export interface Upazila {
  id: string;
  name: string;
  bnName: string;
  lat: number;
  lon: number;
}

export interface District {
  id: string;
  name: string;
  bnName: string;
  divisionId: string;
  divisionName: string;
  divisionBnName: string;
  lat: number;
  lon: number;
  aeZone: string;
  aeZoneBn: string;
  primaryCrops: string[];
  upazilas: Upazila[];
}

export interface WeatherCondition {
  code: number;
  descriptionBn: string;
  descriptionEn: string;
  icon: string;
  isRain: boolean;
  isThunder: boolean;
  isFog: boolean;
}

export interface DayPeriodForecast {
  periodNameBn: string;
  periodNameEn: string;
  timeRange: string;
  avgTemp: number;
  rainProb: number;
  conditionBn: string;
  conditionEn: string;
  icon: string;
  farmerAdviceBn: string;
}

export interface HourlyForecastItem {
  time: string;
  hour: number;
  temp: number;
  apparentTemp: number;
  rainProb: number;
  precipitationMm: number;
  humidity: number;
  windSpeedKmh: number;
  conditionBn: string;
  conditionEn: string;
  icon: string;
}

export interface DailyForecastItem {
  date: string;
  dayNameBn: string;
  dayNameEn: string;
  maxTemp: number;
  minTemp: number;
  rainProbMax: number;
  precipitationSumMm: number;
  windSpeedMaxKmh: number;
  sunrise: string;
  sunset: string;
  conditionBn: string;
  conditionEn: string;
  icon: string;
  riskAlertBn?: string;
  farmerAdviceBn: string;
  publicAdviceBn: string;
}

export interface WeatherData {
  location: {
    lat: number;
    lon: number;
    district?: string;
    districtBn?: string;
    upazila?: string;
    upazilaBn?: string;
  };
  current: {
    temp: number;
    apparentTemp: number;
    maxTempToday: number;
    minTempToday: number;
    humidity: number;
    windSpeedKmh: number;
    windDirectionDeg: number;
    cloudCoverPercent: number;
    precipitationMm: number;
    rainProbNow: number;
    uvIndex: number;
    condition: WeatherCondition;
    sunrise: string;
    sunset: string;
  };
  periodsToday: DayPeriodForecast[];
  hourly24h: HourlyForecastItem[];
  daily7d: DailyForecastItem[];
  practicalAdvice: {
    farmerHeadlineBn: string;
    farmerDetailsBn: string[];
    publicHeadlineBn: string;
    publicSuggestionsBn: {
      travelBn: string;
      outdoorWorkBn: string;
      clothesDryingBn: string;
      umbrellaNeeded: boolean;
      umbrellaAdviceBn: string;
    };
  };
  attribution: {
    provider: string;
    license: string;
    lastUpdated: string;
    forecastGrid: string;
    disclaimerBn: string;
  };
}

export interface CropVariety {
  name: string;
  bnName: string;
  source: string;
  durationDays: number;
  yieldPerDecimalKg: number;
  yieldPerBighaMaund: number;
  characteristicsBn: string;
  specialTraitBn: string;
}

export interface CropCostBenchmark {
  seedCostPerDecimal: number;
  fertilizerCostPerDecimal: number;
  pesticideCostPerDecimal: number;
  laborCostPerDecimal: number;
  irrigationCostPerDecimal: number;
  landPrepCostPerDecimal: number;
  transportOtherCostPerDecimal: number;
  avgExpectedYieldPerDecimalKg: number;
  avgSellingPricePerKg: number;
}

export interface CropData {
  id: string;
  name: string;
  bnName: string;
  category: "cereal" | "oilseed" | "pulse" | "vegetable" | "cash_crop" | "fruit";
  categoryBn: string;
  season: "rabi" | "kharif_1" | "kharif_2" | "year_round";
  seasonBn: string;
  bengaliMonths: string;
  sowingWindowStartMonth: number;
  sowingWindowEndMonth: number;
  harvestWindowStartMonth: number;
  harvestWindowEndMonth: number;
  durationDaysRange: [number, number];
  waterRequirementBn: string;
  soilSuitabilityBn: string;
  landPreparationBn: string;
  weatherRisksBn: string[];
  preventiveMeasuresBn: string[];
  advisoryThresholds: {
    maxTempAlert?: number;
    minTempAlert?: number;
    heavyRainRisk?: boolean;
    droughtSensitive?: boolean;
    highHumidityRisk?: boolean;
  };
  varieties: CropVariety[];
  benchmarkCost: CropCostBenchmark;
  sourceAuthority: string;
  sourceUrl: string;
  lastVerifiedDate: string;
  imageUrl: string;
}

export interface CropRecommendationItem {
  crop: CropData;
  isPrimaryForDistrict: boolean;
  sowingStatus: "active" | "upcoming" | "past";
  sowingStatusBn: string;
  seasonMatch: boolean;
  suitabilityScore: number;
  suitabilityLevelBn: "অত্যন্ত উপযুক্ত" | "উপযুক্ত" | "সতর্কতামূলক";
  reasonBn: string;
  recommendedVarietiesBn: string[];
}

export interface FarmingAlert {
  id: string;
  severity: "critical" | "warning" | "advisory" | "good_news";
  severityBn: "জরুরি সতর্কতা" | "সতর্কবার্তা" | "কৃষি পরামর্শ" | "অনুকূল সংবাদ";
  titleBn: string;
  titleEn: string;
  timeWindowBn: string;
  relevantCropsBn: string[];
  affectedActivityBn: string;
  reasonBn: string;
  actionStepBn: string;
  sourceAuthority: string;
  confidence: "high" | "medium" | "low";
}

export type LandUnit = "decimal" | "bigha" | "acre";

export interface ExpenseBreakdown {
  seedCost: number;
  fertilizerCost: number;
  pesticideCost: number;
  laborCost: number;
  irrigationCost: number;
  landPrepCost: number;
  transportOtherCost: number;
}

export interface CalculationResult {
  cropId: string;
  cropName: string;
  cropBnName: string;
  landAreaInput: number;
  landUnit: LandUnit;
  normalizedAreaDecimal: number;
  areaInBigha: number;
  areaInAcre: number;
  expenses: ExpenseBreakdown;
  totalProductionCost: number;
  costPerDecimal: number;
  costPerBigha: number;
  expectedYieldKg: number;
  expectedYieldMaund: number;
  expectedSellingPricePerKg: number;
  expectedSellingPricePerMaund: number;
  grossRevenue: number;
  netProfit: number;
  profitPerDecimal: number;
  profitPerBigha: number;
  breakEvenPricePerKg: number;
  breakEvenPricePerMaund: number;
  roiPercentage: number;
  isProfitable: boolean;
  benchmarkSource: string;
  disclaimerBn: string;
}

import { CROPS_DATABASE, CropData } from "../data/cropDatabase.js";
import { DISTRICTS } from "../data/bangladeshLocations.js";

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

export interface CalculationInput {
  districtId: string;
  cropId: string;
  varietyName?: string;
  landArea: number;
  landUnit: LandUnit;
  expenses?: Partial<ExpenseBreakdown>;
  expectedYieldKg?: number;
  expectedSellingPricePerKg?: number;
}

export interface CalculationResult {
  cropId: string;
  cropName: string;
  cropBnName: string;
  landAreaInput: number;
  landUnit: LandUnit;
  normalizedAreaDecimal: number; // in decimals
  areaInBigha: number;
  areaInAcre: number;
  expenses: ExpenseBreakdown;
  totalProductionCost: number;
  costPerDecimal: number;
  costPerBigha: number;
  expectedYieldKg: number;
  expectedYieldMaund: number; // 1 maund = 40 kg
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

export function convertToDecimals(area: number, unit: LandUnit): number {
  switch (unit) {
    case "decimal":
      return area;
    case "bigha":
      return area * 33; // Standard BD Bigha = 33 Decimals
    case "acre":
      return area * 100; // 1 Acre = 100 Decimals
    default:
      return area;
  }
}

export function calculateCropProfitability(input: CalculationInput): CalculationResult {
  const crop = CROPS_DATABASE.find(c => c.id === input.cropId) || CROPS_DATABASE[0];
  const decimals = Math.max(0.1, convertToDecimals(input.landArea, input.landUnit));
  const bighas = decimals / 33;
  const acres = decimals / 100;

  const bench = crop.benchmarkCost;

  // Use provided expenses or fallback to official benchmark scaled to decimals
  const expenses: ExpenseBreakdown = {
    seedCost: input.expenses?.seedCost ?? Math.round(bench.seedCostPerDecimal * decimals),
    fertilizerCost: input.expenses?.fertilizerCost ?? Math.round(bench.fertilizerCostPerDecimal * decimals),
    pesticideCost: input.expenses?.pesticideCost ?? Math.round(bench.pesticideCostPerDecimal * decimals),
    laborCost: input.expenses?.laborCost ?? Math.round(bench.laborCostPerDecimal * decimals),
    irrigationCost: input.expenses?.irrigationCost ?? Math.round(bench.irrigationCostPerDecimal * decimals),
    landPrepCost: input.expenses?.landPrepCost ?? Math.round(bench.landPrepCostPerDecimal * decimals),
    transportOtherCost: input.expenses?.transportOtherCost ?? Math.round(bench.transportOtherCostPerDecimal * decimals)
  };

  const totalProductionCost =
    expenses.seedCost +
    expenses.fertilizerCost +
    expenses.pesticideCost +
    expenses.laborCost +
    expenses.irrigationCost +
    expenses.landPrepCost +
    expenses.transportOtherCost;

  const expectedYieldKg = input.expectedYieldKg ?? Math.round(bench.avgExpectedYieldPerDecimalKg * decimals);
  const expectedSellingPricePerKg = input.expectedSellingPricePerKg ?? bench.avgSellingPricePerKg;

  const grossRevenue = Math.round(expectedYieldKg * expectedSellingPricePerKg);
  const netProfit = grossRevenue - totalProductionCost;

  const costPerDecimal = Math.round(totalProductionCost / decimals);
  const costPerBigha = Math.round(costPerDecimal * 33);
  const profitPerDecimal = Math.round(netProfit / decimals);
  const profitPerBigha = Math.round(profitPerDecimal * 33);

  const breakEvenPricePerKg = expectedYieldKg > 0 ? Math.round((totalProductionCost / expectedYieldKg) * 10) / 10 : 0;
  const breakEvenPricePerMaund = Math.round(breakEvenPricePerKg * 40);

  const roiPercentage = totalProductionCost > 0 ? Math.round((netProfit / totalProductionCost) * 100) : 0;

  return {
    cropId: crop.id,
    cropName: crop.name,
    cropBnName: crop.bnName,
    landAreaInput: input.landArea,
    landUnit: input.landUnit,
    normalizedAreaDecimal: Math.round(decimals * 10) / 10,
    areaInBigha: Math.round(bighas * 100) / 100,
    areaInAcre: Math.round(acres * 100) / 100,
    expenses,
    totalProductionCost,
    costPerDecimal,
    costPerBigha,
    expectedYieldKg,
    expectedYieldMaund: Math.round((expectedYieldKg / 40) * 10) / 10,
    expectedSellingPricePerKg,
    expectedSellingPricePerMaund: Math.round(expectedSellingPricePerKg * 40),
    grossRevenue,
    netProfit,
    profitPerDecimal,
    profitPerBigha,
    breakEvenPricePerKg,
    breakEvenPricePerMaund,
    roiPercentage,
    isProfitable: netProfit > 0,
    benchmarkSource: crop.sourceAuthority,
    disclaimerBn: "এই হিসাবটি কৃষি গবেষণা ও মাঠ পর্যায়ের গড় ব্যয়ের ওপর ভিত্তি করে প্রাক্কলিত। আবহাওয়া, সার ও শ্রমিকের স্থানীয় মজুরি এবং বাজারের আকস্মিক দর ওঠানামার ওপর বাস্তব লাভ-ক্ষতি নির্ভর করে। আপনি যেকোনো খরচ পরিবর্তন করে সঠিক হিসাব বের করতে পারেন।"
  };
}

export function compareCrops(
  districtId: string,
  landArea: number,
  landUnit: LandUnit,
  cropIds: string[]
): CalculationResult[] {
  return cropIds.map(cropId =>
    calculateCropProfitability({
      districtId,
      cropId,
      landArea,
      landUnit
    })
  );
}

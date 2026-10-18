import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "../context/LocationContext";
import { CalculationResult, LandUnit, CropData } from "../types";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  PieChart,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  RotateCcw,
  Edit3
} from "lucide-react";

interface ProfitCalculatorProps {
  initialCropId?: string;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ initialCropId }) => {
  const { language, toBengaliNumber } = useLanguage();
  const { selectedDistrict } = useLocation();

  const [crops, setCrops] = useState<CropData[]>([]);
  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId || "boro_rice");
  const [landArea, setLandArea] = useState<number>(33); // default 1 bigha
  const [landUnit, setLandUnit] = useState<LandUnit>("decimal");

  // Track if user is in manual custom mode
  const [isManualCustom, setIsManualCustom] = useState<boolean>(false);

  // Editable Expense Inputs
  const [seedCost, setSeedCost] = useState<number>(0);
  const [fertilizerCost, setFertilizerCost] = useState<number>(0);
  const [pesticideCost, setPesticideCost] = useState<number>(0);
  const [laborCost, setLaborCost] = useState<number>(0);
  const [irrigationCost, setIrrigationCost] = useState<number>(0);
  const [landPrepCost, setLandPrepCost] = useState<number>(0);
  const [transportCost, setTransportCost] = useState<number>(0);

  // Yield & Price Inputs
  const [expectedYieldKg, setExpectedYieldKg] = useState<number>(0);
  const [sellingPricePerKg, setSellingPricePerKg] = useState<number>(0);

  // Calculation Results
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Multi-crop comparison state
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [comparisonResults, setComparisonResults] = useState<CalculationResult[]>([]);
  const [compareCropsSelection, setCompareCropsSelection] = useState<string[]>(["boro_rice", "potato", "maize"]);

  // Calculate live financial metrics instantly in real-time
  const calculateFinancials = (
    cId: string,
    area: number,
    unit: LandUnit,
    sCost: number,
    fCost: number,
    pCost: number,
    lCost: number,
    iCost: number,
    lpCost: number,
    tCost: number,
    yieldKg: number,
    pricePerKg: number
  ): CalculationResult => {
    const crop = crops.find(c => c.id === cId);
    let decimals = area;
    if (unit === "bigha") decimals = area * 33;
    if (unit === "acre") decimals = area * 100;
    decimals = Math.max(0.1, decimals);
    const bighas = decimals / 33;
    const acres = decimals / 100;

    const totalCost = (sCost || 0) + (fCost || 0) + (pCost || 0) + (lCost || 0) + (iCost || 0) + (lpCost || 0) + (tCost || 0);
    const grossRev = Math.round((yieldKg || 0) * (pricePerKg || 0));
    const profit = grossRev - totalCost;

    const costPerDec = Math.round(totalCost / decimals);
    const costPerBigha = Math.round(totalCost / bighas);
    const profitPerDec = Math.round(profit / decimals);
    const profitPerBigha = Math.round(profit / bighas);

    const breakEvenPerKg = yieldKg > 0 ? parseFloat((totalCost / yieldKg).toFixed(2)) : 0;
    const breakEvenPerMaund = parseFloat((breakEvenPerKg * 40).toFixed(1));
    const roi = totalCost > 0 ? parseFloat(((profit / totalCost) * 100).toFixed(1)) : 0;

    return {
      cropId: cId,
      cropName: crop?.name || "Selected Crop",
      cropBnName: crop?.bnName || "নির্বাচিত ফসল",
      landAreaInput: area,
      landUnit: unit,
      normalizedAreaDecimal: decimals,
      areaInBigha: parseFloat(bighas.toFixed(2)),
      areaInAcre: parseFloat(acres.toFixed(2)),
      expenses: {
        seedCost: sCost || 0,
        fertilizerCost: fCost || 0,
        pesticideCost: pCost || 0,
        laborCost: lCost || 0,
        irrigationCost: iCost || 0,
        landPrepCost: lpCost || 0,
        transportOtherCost: tCost || 0
      },
      totalProductionCost: totalCost,
      costPerDecimal: costPerDec,
      costPerBigha: costPerBigha,
      expectedYieldKg: yieldKg || 0,
      expectedYieldMaund: parseFloat(((yieldKg || 0) / 40).toFixed(1)),
      expectedSellingPricePerKg: pricePerKg || 0,
      expectedSellingPricePerMaund: Math.round((pricePerKg || 0) * 40),
      grossRevenue: grossRev,
      netProfit: profit,
      profitPerDecimal: profitPerDec,
      profitPerBigha: profitPerBigha,
      breakEvenPricePerKg: breakEvenPerKg,
      breakEvenPricePerMaund: breakEvenPerMaund,
      roiPercentage: roi,
      isProfitable: profit >= 0,
      benchmarkSource: crop?.sourceAuthority || "কৃষি গবেষণা প্রতিষ্ঠান ও বাজার দর",
      disclaimerBn: "প্রদত্ত হিসাব আপনার নিজস্ব বাস্তব ইনপুট অনুযায়ী সরাসরি গণনাকৃত। স্থানীয় বাজারদর ও আবহাওয়া পরিস্থিতি বিবেচনায় রাখুন।"
    };
  };

  // Fetch Crops on Mount
  useEffect(() => {
    async function loadCrops() {
      try {
        const res = await fetch("/api/crops");
        const data = await res.json();
        if (data.success && data.crops.length > 0) {
          setCrops(data.crops);
          const initialCrop = data.crops.find((c: CropData) => c.id === (initialCropId || "boro_rice")) || data.crops[0];
          applyBenchmarkValues(initialCrop, landArea, landUnit);
        }
      } catch (err) {
        console.error("Failed to load crops:", err);
      }
    }
    loadCrops();
  }, [initialCropId]);

  // Apply Benchmark Values helper
  const applyBenchmarkValues = (crop: CropData, area: number, unit: LandUnit) => {
    let decimals = area;
    if (unit === "bigha") decimals = area * 33;
    if (unit === "acre") decimals = area * 100;
    decimals = Math.max(0.1, decimals);

    const b = crop.benchmarkCost;
    const s = Math.round(b.seedCostPerDecimal * decimals);
    const f = Math.round(b.fertilizerCostPerDecimal * decimals);
    const p = Math.round(b.pesticideCostPerDecimal * decimals);
    const l = Math.round(b.laborCostPerDecimal * decimals);
    const i = Math.round(b.irrigationCostPerDecimal * decimals);
    const lp = Math.round(b.landPrepCostPerDecimal * decimals);
    const t = Math.round(b.transportOtherCostPerDecimal * decimals);
    const yKg = Math.round(b.avgExpectedYieldPerDecimalKg * decimals);
    const price = b.avgSellingPricePerKg;

    setSeedCost(s);
    setFertilizerCost(f);
    setPesticideCost(p);
    setLaborCost(l);
    setIrrigationCost(i);
    setLandPrepCost(lp);
    setTransportCost(t);
    setExpectedYieldKg(yKg);
    setSellingPricePerKg(price);
    setIsManualCustom(false);

    // Immediately calculate and set result
    const calc = calculateFinancials(crop.id, area, unit, s, f, p, l, i, lp, t, yKg, price);
    setResult(calc);
  };

  const handleCropChange = (cropId: string) => {
    setSelectedCropId(cropId);
    const crop = crops.find(c => c.id === cropId);
    if (crop) {
      applyBenchmarkValues(crop, landArea, landUnit);
    }
  };

  const handleAreaChange = (val: number) => {
    const newArea = Math.max(0.1, val);
    setLandArea(newArea);
    const crop = crops.find(c => c.id === selectedCropId);
    if (crop) {
      applyBenchmarkValues(crop, newArea, landUnit);
    }
  };

  const handleUnitChange = (unit: LandUnit) => {
    setLandUnit(unit);
    const crop = crops.find(c => c.id === selectedCropId);
    if (crop) {
      applyBenchmarkValues(crop, landArea, unit);
    }
  };

  const handleResetToBenchmark = () => {
    const crop = crops.find(c => c.id === selectedCropId);
    if (crop) {
      applyBenchmarkValues(crop, landArea, landUnit);
    }
  };

  // Real-time live update for manual inputs
  const updateManualField = (
    field: string,
    value: number
  ) => {
    setIsManualCustom(true);
    let s = seedCost;
    let f = fertilizerCost;
    let p = pesticideCost;
    let l = laborCost;
    let i = irrigationCost;
    let lp = landPrepCost;
    let t = transportCost;
    let y = expectedYieldKg;
    let pr = sellingPricePerKg;

    if (field === "seedCost") { setSeedCost(value); s = value; }
    else if (field === "fertilizerCost") { setFertilizerCost(value); f = value; }
    else if (field === "pesticideCost") { setPesticideCost(value); p = value; }
    else if (field === "laborCost") { setLaborCost(value); l = value; }
    else if (field === "irrigationCost") { setIrrigationCost(value); i = value; }
    else if (field === "landPrepCost") { setLandPrepCost(value); lp = value; }
    else if (field === "transportCost") { setTransportCost(value); t = value; }
    else if (field === "expectedYieldKg") { setExpectedYieldKg(value); y = value; }
    else if (field === "sellingPricePerKg") { setSellingPricePerKg(value); pr = value; }

    const updatedResult = calculateFinancials(
      selectedCropId,
      landArea,
      landUnit,
      s, f, p, l, i, lp, t, y, pr
    );
    setResult(updatedResult);
  };

  // Manual Trigger Button (also syncs with server)
  const runCalculation = async () => {
    setIsCalculating(true);
    // Instant local calculation first so user never waits
    const localCalc = calculateFinancials(
      selectedCropId,
      landArea,
      landUnit,
      seedCost,
      fertilizerCost,
      pesticideCost,
      laborCost,
      irrigationCost,
      landPrepCost,
      transportCost,
      expectedYieldKg,
      sellingPricePerKg
    );
    setResult(localCalc);

    // Also attempt server sync
    try {
      const payload = {
        districtId: selectedDistrict?.id || "dhaka",
        cropId: selectedCropId,
        landArea,
        landUnit,
        expenses: {
          seedCost,
          fertilizerCost,
          pesticideCost,
          laborCost,
          irrigationCost,
          landPrepCost,
          transportOtherCost: transportCost
        },
        expectedYieldKg,
        expectedSellingPricePerKg: sellingPricePerKg
      };

      const res = await fetch("/api/profitability/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.calculation) {
        setResult(data.calculation);
      }
    } catch (err) {
      console.warn("Server calculation call failed, using instant local calculations:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  // Run multi-crop comparison
  const runComparison = async () => {
    try {
      const payload = {
        districtId: selectedDistrict?.id || "dhaka",
        landArea,
        landUnit,
        cropIds: compareCropsSelection
      };
      const res = await fetch("/api/profitability/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setComparisonResults(data.comparisons);
      }
    } catch (err) {
      console.error("Comparison failed:", err);
    }
  };

  useEffect(() => {
    if (compareMode) {
      runComparison();
    }
  }, [compareMode, compareCropsSelection, landArea, landUnit]);

  // Live sum of total costs for the expense header
  const liveTotalExpenses = useMemo(() => {
    return (seedCost || 0) + (fertilizerCost || 0) + (pesticideCost || 0) + (laborCost || 0) + (irrigationCost || 0) + (landPrepCost || 0) + (transportCost || 0);
  }, [seedCost, fertilizerCost, pesticideCost, laborCost, irrigationCost, landPrepCost, transportCost]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>{language === "bn" ? "কৃষি লাভ-ক্ষতি ও ব্যয় হিসাব ক্যালকুলেটর" : "Profitability & Cultivation Planner"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {language === "bn" ? "ফসল চাষের সম্ভাব্য খরচ, ফলন ও নিট লাভ প্রাক্কলন" : "Crop Cultivation Costs, Yield & Net Profit Estimation"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === "bn"
              ? "স্বচ্ছ গাণিতিক সূত্র ও আপনার নিজস্ব বাস্তব খরচের ভিত্তিতে লাইভ হিসাব। যেকোনো সংখ্যা পরিবর্তন করলেই সাথে সাথে আপডেট হবে।"
              : "Instant live recalculation as you type. All cost and yield parameters are fully editable."}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setCompareMode(false)}
            className={`px-3 py-2 rounded-lg transition-all ${
              !compareMode ? "bg-white text-emerald-800 shadow-sm font-bold" : "text-slate-600"
            }`}
          >
            {language === "bn" ? "একক ফসল ক্যালকুলেটর" : "Single Crop"}
          </button>
          <button
            onClick={() => setCompareMode(true)}
            className={`px-3 py-2 rounded-lg transition-all ${
              compareMode ? "bg-white text-emerald-800 shadow-sm font-bold" : "text-slate-600"
            }`}
          >
            {language === "bn" ? "পাশাপাশি একাধিক ফসল তুলনা" : "Compare Crops"}
          </button>
        </div>
      </div>

      {!compareMode ? (
        /* Single Crop Calculator View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Section (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-emerald-600">📝</span>
                <span>{language === "bn" ? "জমি ও ফসলের তথ্য প্রদান করুন" : "Enter Land & Crop Inputs"}</span>
              </h2>

              {isManualCustom ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full animate-in fade-in">
                  <Edit3 className="w-3 h-3 text-amber-600" />
                  <span>{language === "bn" ? "কাস্টম ম্যানুয়াল হিসাব চলছে" : "Custom Inputs Active"}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{language === "bn" ? "সরকারি গড় বেঞ্চমার্ক" : "Standard Benchmark"}</span>
                </span>
              )}
            </div>

            {/* Candidate Crop & Land Area Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === "bn" ? "বিবেচ্য ফসল নির্বাচন করুন" : "Select Candidate Crop"}
                </label>
                <select
                  value={selectedCropId}
                  onChange={e => handleCropChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {crops.map(c => (
                    <option key={c.id} value={c.id}>
                      {language === "bn" ? c.bnName : c.name} ({c.seasonBn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === "bn" ? "জমির একক ও পরিমাণ" : "Land Area & Unit"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0.1"
                    step="1"
                    value={landArea || ""}
                    onChange={e => handleAreaChange(parseFloat(e.target.value) || 0)}
                    className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none tabular-nums"
                  />
                  <select
                    value={landUnit}
                    onChange={e => handleUnitChange(e.target.value as LandUnit)}
                    className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="decimal">{language === "bn" ? "শতাংশ / ডেসিমাল" : "Decimal"}</option>
                    <option value="bigha">{language === "bn" ? "বিঘা (৩৩ শতাংশ)" : "Bigha (33 Dec)"}</option>
                    <option value="acre">{language === "bn" ? "একর (১০০ শতাংশ)" : "Acre (100 Dec)"}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Editable Expenses Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span>{language === "bn" ? "উৎপাদন খরচের খাতসমূহ (টাকায়):" : "Production Expenses (BDT):"}</span>
                  <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    মোট: ৳ {toBengaliNumber(liveTotalExpenses.toLocaleString())}
                  </span>
                </div>
                {isManualCustom && (
                  <button
                    onClick={handleResetToBenchmark}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{language === "bn" ? "গড় মানে রিসেট" : "Reset Default"}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">{language === "bn" ? "১. বীজ / চারা ক্রয়:" : "1. Seeds / Seedlings:"}</label>
                  <input
                    type="number"
                    value={seedCost === 0 && !isManualCustom ? 0 : (seedCost || "")}
                    onChange={e => updateManualField("seedCost", parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">{language === "bn" ? "২. রাসায়নিক ও জৈব সার:" : "2. Fertilizers:"}</label>
                  <input
                    type="number"
                    value={fertilizerCost === 0 && !isManualCustom ? 0 : (fertilizerCost || "")}
                    onChange={e => updateManualField("fertilizerCost", parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">{language === "bn" ? "৩. ফসল সুরক্ষা ও পরিচর্যা খরচ:" : "3. Crop Protection & Care:"}</label>
                  <input
                    type="number"
                    value={pesticideCost === 0 && !isManualCustom ? 0 : (pesticideCost || "")}
                    onChange={e => updateManualField("pesticideCost", parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">{language === "bn" ? "৪. শ্রমিক মজুরি (রোপণ ও নিড়ানি):" : "4. Labor Costs:"}</label>
                  <input
                    type="number"
                    value={laborCost === 0 && !isManualCustom ? 0 : (laborCost || "")}
                    onChange={e => updateManualField("laborCost", parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">{language === "bn" ? "৫. সেচ ও পাম্প জ্বালানি:" : "5. Irrigation:"}</label>
                  <input
                    type="number"
                    value={irrigationCost === 0 && !isManualCustom ? 0 : (irrigationCost || "")}
                    onChange={e => updateManualField("irrigationCost", parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">{language === "bn" ? "৬. জমি চাষ ও ট্রাক্টর খরচ:" : "6. Land Prep / Tiller:"}</label>
                  <input
                    type="number"
                    value={landPrepCost === 0 && !isManualCustom ? 0 : (landPrepCost || "")}
                    onChange={e => updateManualField("landPrepCost", parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 mb-1 font-medium">{language === "bn" ? "৭. ফসল কাটা, পরিবহন ও আনুষঙ্গিক:" : "7. Harvest & Transport:"}</label>
                  <input
                    type="number"
                    value={transportCost === 0 && !isManualCustom ? 0 : (transportCost || "")}
                    onChange={e => updateManualField("transportCost", parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  />
                </div>
              </div>
            </div>

            {/* Yield and Selling Price */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === "bn" ? "প্রত্যাশিত মোট ফলন (কেজি)" : "Expected Total Yield (Kg)"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={expectedYieldKg || ""}
                    onChange={e => updateManualField("expectedYieldKg", parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                    ≈ {toBengaliNumber(((expectedYieldKg || 0) / 40).toFixed(1))} {language === "bn" ? "মণ" : "maund"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === "bn" ? "প্রত্যাশিত বিক্রয় দর (প্রতি কেজি টাকা)" : "Expected Selling Price (BDT/Kg)"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={sellingPricePerKg || ""}
                    onChange={e => updateManualField("sellingPricePerKg", parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                    ≈ {toBengaliNumber(((sellingPricePerKg || 0) * 40).toFixed(0))} {language === "bn" ? "টাকা/মণ" : "BDT/maund"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={runCalculation}
              disabled={isCalculating}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isCalculating ? "animate-spin" : ""}`} />
              <span>{language === "bn" ? "হিসাব পুনরায় গণনা ও রিফ্রেশ করুন" : "Recalculate Profit"}</span>
            </button>
          </div>

          {/* Outputs Summary Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {result ? (
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 rounded-3xl shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      {language === "bn" ? "প্রাক্কলিত অর্থনৈতিক ফলাফল" : "Estimated Financial Result"}
                    </span>
                    <h2 className="text-xl font-extrabold text-white mt-0.5">
                      {result.cropBnName}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {toBengaliNumber(result.landAreaInput)} {result.landUnit === "bigha" ? "বিঘা" : result.landUnit === "acre" ? "একর" : "শতাংশ"} জমি
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      result.isProfitable
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-red-500/20 text-red-300 border-red-500/40"
                    }`}
                  >
                    {result.isProfitable ? (language === "bn" ? "লাভজনক" : "Profitable") : (language === "bn" ? "লোকসান" : "Loss")}
                  </span>
                </div>

                {/* Net Profit Hero Callout */}
                <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-lg">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">{language === "bn" ? "সম্ভাব্য নিট লাভ / ক্ষতি:" : "Estimated Net Profit:"}</div>
                  <div
                    className={`text-4xl sm:text-5xl font-black mt-2 tabular-nums drop-shadow-sm ${
                      result.netProfit >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    ৳ {toBengaliNumber(result.netProfit.toLocaleString())}
                  </div>
                  <div className="text-xs text-slate-200 mt-2 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <span className="bg-white/15 px-2.5 py-1 rounded-lg">
                      {language === "bn" ? "বিনিয়োগ ফেরত (ROI): " : "ROI: "}
                      <strong className="text-amber-300 font-extrabold text-sm">{toBengaliNumber(result.roiPercentage)}%</strong>
                    </span>
                    <span className="bg-white/15 px-2.5 py-1 rounded-lg">
                      {language === "bn" ? "বিঘা প্রতি লাভ: " : "Per Bigha: "}
                      <strong className="text-emerald-300 font-extrabold text-sm">৳ {toBengaliNumber(result.profitPerBigha.toLocaleString())}</strong>
                    </span>
                  </div>
                </div>

                {/* Costs & Revenue Breakdown */}
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-300 font-medium">{language === "bn" ? "মোট উৎপাদন ব্যয়:" : "Total Production Cost:"}</span>
                    <strong className="text-white text-base sm:text-lg font-extrabold tabular-nums">৳ {toBengaliNumber(result.totalProductionCost.toLocaleString())}</strong>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-300 font-medium">{language === "bn" ? "মোট প্রত্যাশিত বিক্রয়মূল্য:" : "Gross Expected Revenue:"}</span>
                    <strong className="text-amber-300 text-base sm:text-lg font-extrabold tabular-nums">৳ {toBengaliNumber(result.grossRevenue.toLocaleString())}</strong>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-300 font-medium">{language === "bn" ? "ব্রেক-ইভেন দর (কেজি প্রতি):" : "Break-even Price / Kg:"}</span>
                    <strong className="text-teal-300 text-sm sm:text-base font-bold tabular-nums">৳ {toBengaliNumber(result.breakEvenPricePerKg)} / কেজি</strong>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-300 font-medium">{language === "bn" ? "ব্রেক-ইভেন দর (মণ প্রতি):" : "Break-even Price / Maund:"}</span>
                    <strong className="text-teal-300 text-sm sm:text-base font-bold tabular-nums">৳ {toBengaliNumber(result.breakEvenPricePerMaund)} / মণ</strong>
                  </div>
                </div>

                {/* Formulas & Disclaimer */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] text-slate-300 space-y-1">
                  <p className="font-semibold text-emerald-300">💡 {language === "bn" ? "হিসাবের স্বচ্ছ সূত্র:" : "Transparent Formulas:"}</p>
                  <p>মোট আয় = প্রত্যাশিত ফলন (কেজি) × কেজি প্রতি দর</p>
                  <p>নিট লাভ = মোট আয় − মোট উৎপাদন ব্যয়</p>
                  <p className="pt-1 text-[10px] text-slate-400">{result.disclaimerBn}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* Multi-Crop Comparison View */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              <span>{language === "bn" ? "একই জমির জন্য একাধিক ফসলের তুলনামূলক বিশ্লেষণ" : "Side-by-Side Crop Comparison"}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {toBengaliNumber(landArea)} {landUnit === "bigha" ? "বিঘা" : landUnit === "acre" ? "একর" : "শতাংশ"} জমির জন্য কোন ফসলে কত খরচ ও লাভ হবে তা তুলনা করুন।
            </p>
          </div>

          {/* Crop Selector Chips */}
          <div className="flex flex-wrap gap-2">
            {crops.map(c => {
              const isSelected = compareCropsSelection.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    if (isSelected && compareCropsSelection.length > 1) {
                      setCompareCropsSelection(compareCropsSelection.filter(id => id !== c.id));
                    } else if (!isSelected && compareCropsSelection.length < 4) {
                      setCompareCropsSelection([...compareCropsSelection, c.id]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-sm font-bold"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {language === "bn" ? c.bnName : c.name}
                </button>
              );
            })}
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparisonResults.map(comp => (
              <div
                key={comp.cropId}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-lg transition-all space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">
                    {comp.cropBnName}
                  </h3>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      comp.isProfitable ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {comp.isProfitable ? "লাভজনক" : "লোকসান"}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">মোট খরচ:</span>
                    <strong className="text-slate-800 tabular-nums">৳ {toBengaliNumber(comp.totalProductionCost.toLocaleString())}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">প্রত্যাশিত আয়:</span>
                    <strong className="text-slate-800 tabular-nums">৳ {toBengaliNumber(comp.grossRevenue.toLocaleString())}</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                    <span className="text-slate-700">সম্ভাব্য লাভ:</span>
                    <span className={`tabular-nums ${comp.netProfit >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                      ৳ {toBengaliNumber(comp.netProfit.toLocaleString())}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">ব্রেক-ইভেন দর:</span>
                    <span className="text-teal-700 font-medium tabular-nums">৳ {toBengaliNumber(comp.breakEvenPricePerKg)} / কেজি</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">বিঘা প্রতি লাভ:</span>
                  <span className="font-extrabold text-emerald-700 tabular-nums">৳ {toBengaliNumber(comp.profitPerBigha.toLocaleString())}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

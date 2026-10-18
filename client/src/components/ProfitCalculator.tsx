import React, { useState, useEffect } from "react";
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
  Sparkles
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

  // When crop or area/unit changes, populate default benchmarks
  const applyBenchmarkValues = (crop: CropData, area: number, unit: LandUnit) => {
    let decimals = area;
    if (unit === "bigha") decimals = area * 33;
    if (unit === "acre") decimals = area * 100;
    decimals = Math.max(0.1, decimals);

    const b = crop.benchmarkCost;
    setSeedCost(Math.round(b.seedCostPerDecimal * decimals));
    setFertilizerCost(Math.round(b.fertilizerCostPerDecimal * decimals));
    setPesticideCost(Math.round(b.pesticideCostPerDecimal * decimals));
    setLaborCost(Math.round(b.laborCostPerDecimal * decimals));
    setIrrigationCost(Math.round(b.irrigationCostPerDecimal * decimals));
    setLandPrepCost(Math.round(b.landPrepCostPerDecimal * decimals));
    setTransportCost(Math.round(b.transportOtherCostPerDecimal * decimals));

    setExpectedYieldKg(Math.round(b.avgExpectedYieldPerDecimalKg * decimals));
    setSellingPricePerKg(b.avgSellingPricePerKg);
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

  // Perform Calculation Request
  const runCalculation = async () => {
    setIsCalculating(true);
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
      if (data.success) {
        setResult(data.calculation);
      }
    } catch (err) {
      console.error("Calculation failed:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  // Initial calculation trigger when inputs load
  useEffect(() => {
    if (expectedYieldKg > 0 && sellingPricePerKg > 0) {
      runCalculation();
    }
  }, [expectedYieldKg, sellingPricePerKg]);

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
              ? "স্বচ্ছ গাণিতিক সূত্র ও স্থানীয় কৃষি গবেষণা উপাত্তের ভিত্তিতে তৈরি। সকল মান সম্পাদনাযোগ্য।"
              : "Transparent formulas with editable costs, yields, and local benchmarks."}
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
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="text-emerald-600">📝</span>
              <span>{language === "bn" ? "জমি ও ফসলের তথ্য প্রদান করুন" : "Enter Land & Crop Inputs"}</span>
            </h2>

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
                    value={landArea}
                    onChange={e => handleAreaChange(parseFloat(e.target.value) || 1)}
                    className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                <span>{language === "bn" ? "উৎপাদন খরচের বিস্তারিত (টাকায়)" : "Production Expenses (BDT)"}</span>
                <span className="text-[11px] font-normal text-emerald-700">
                  {language === "bn" ? "যেকোনো খরচ এডিট করতে পারেন" : "Editable"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">{language === "bn" ? "১. বীজ / চারা ক্রয়:" : "1. Seeds / Seedlings:"}</label>
                  <input
                    type="number"
                    value={seedCost}
                    onChange={e => setSeedCost(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">{language === "bn" ? "২. রাসায়নিক ও জৈব সার:" : "2. Fertilizers:"}</label>
                  <input
                    type="number"
                    value={fertilizerCost}
                    onChange={e => setFertilizerCost(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">{language === "bn" ? "৩. কীটনাশক ও বালাই ব্যবস্থাপনা:" : "3. Pesticides:"}</label>
                  <input
                    type="number"
                    value={pesticideCost}
                    onChange={e => setPesticideCost(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">{language === "bn" ? "৪. শ্রমিক মজুরি (রোপণ ও নিড়ানি):" : "4. Labor Costs:"}</label>
                  <input
                    type="number"
                    value={laborCost}
                    onChange={e => setLaborCost(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">{language === "bn" ? "৫. সেচ ও পাম্প জ্বালানি:" : "5. Irrigation:"}</label>
                  <input
                    type="number"
                    value={irrigationCost}
                    onChange={e => setIrrigationCost(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">{language === "bn" ? "৬. জমি চাষ ও ট্রাক্টর খরচ:" : "6. Land Prep / Tiller:"}</label>
                  <input
                    type="number"
                    value={landPrepCost}
                    onChange={e => setLandPrepCost(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 mb-1">{language === "bn" ? "৭. ফসল কাটা, পরিবহন ও আনুষঙ্গিক:" : "7. Harvest & Transport:"}</label>
                  <input
                    type="number"
                    value={transportCost}
                    onChange={e => setTransportCost(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
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
                    value={expectedYieldKg}
                    onChange={e => setExpectedYieldKg(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                    ≈ {toBengaliNumber((expectedYieldKg / 40).toFixed(1))} {language === "bn" ? "মণ" : "maund"}
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
                    value={sellingPricePerKg}
                    onChange={e => setSellingPricePerKg(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                    ≈ {toBengaliNumber((sellingPricePerKg * 40).toFixed(0))} {language === "bn" ? "টাকা/মণ" : "BDT/maund"}
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
              <span>{language === "bn" ? "হিসাব পুনরায় গণনা করুন" : "Recalculate Profit"}</span>
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
                    <strong className="text-slate-800">৳ {toBengaliNumber(comp.totalProductionCost.toLocaleString())}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">মোট প্রত্যাশিত আয়:</span>
                    <strong className="text-slate-800">৳ {toBengaliNumber(comp.grossRevenue.toLocaleString())}</strong>
                  </div>

                  <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-700">সম্ভাব্য নিট লাভ:</span>
                    <strong className={comp.netProfit >= 0 ? "text-emerald-700 font-extrabold" : "text-red-600 font-extrabold"}>
                      ৳ {toBengaliNumber(comp.netProfit.toLocaleString())}
                    </strong>
                  </div>

                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>বিঘা প্রতি লাভ:</span>
                    <span>৳ {toBengaliNumber(comp.profitPerBigha.toLocaleString())}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>ব্রেক-ইভেন দর:</span>
                    <span>৳ {toBengaliNumber(comp.breakEvenPricePerKg)} / কেজি</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>বিনিয়োগের মুনাফা (ROI):</span>
                    <span className="font-bold text-emerald-600">{toBengaliNumber(comp.roiPercentage)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

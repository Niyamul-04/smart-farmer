import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "../context/LocationContext";
import { CropRecommendationItem } from "../types";
import {
  Sprout,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calculator,
  Award,
  Sparkles,
  MapPin
} from "lucide-react";

interface CropRecommendationExplorerProps {
  onPlanCropProfit?: (cropId: string) => void;
}

export const CropRecommendationExplorer: React.FC<CropRecommendationExplorerProps> = ({
  onPlanCropProfit
}) => {
  const { language, toBengaliNumber } = useLanguage();
  const { selectedDistrict, setIsSearchModalOpen } = useLocation();

  const [recommendations, setRecommendations] = useState<CropRecommendationItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [seasonNameBn, setSeasonNameBn] = useState<string>("");
  const [monthNameBn, setMonthNameBn] = useState<string>("");

  const months = [
    { num: 1, bn: "জানুয়ারি (পৌষ-মাঘ)" },
    { num: 2, bn: "ফেব্রুয়ারি (মাঘ-ফাল্গুন)" },
    { num: 3, bn: "মার্চ (ফাল্গুন-চৈত্র)" },
    { num: 4, bn: "এপ্রিল (চৈত্র-বৈশাখ)" },
    { num: 5, bn: "মে (বৈশাখ-জ্যৈষ্ঠ)" },
    { num: 6, bn: "জুন (জ্যৈষ্ঠ-আষাঢ়)" },
    { num: 7, bn: "জুলাই (আষাঢ়-শ্রাবণ)" },
    { num: 8, bn: "আগস্ট (শ্রাবণ-ভাদ্র)" },
    { num: 9, bn: "সেপ্টেম্বর (ভাদ্র-আশ্বিন)" },
    { num: 10, bn: "অক্টোবর (আশ্বিন-কার্তিক)" },
    { num: 11, bn: "নভেম্বর (কার্তিক-অগ্রহায়ণ)" },
    { num: 12, bn: "ডিসেম্বর (অগ্রহায়ণ-পৌষ)" }
  ];

  useEffect(() => {
    async function loadRecommendations() {
      setIsLoading(true);
      try {
        const distId = selectedDistrict?.id || "dhaka";
        const res = await fetch(`/api/crops/recommendations?districtId=${distId}&month=${selectedMonth}`);
        const data = await res.json();
        if (data.success) {
          setRecommendations(data.recommendations);
          setSeasonNameBn(data.seasonBn);
          setMonthNameBn(data.monthNameBn);
        }
      } catch (err) {
        console.error("Recommendations fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadRecommendations();
  }, [selectedDistrict, selectedMonth]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>{language === "bn" ? "কৃষি অঞ্চলভিত্তিক সুপারিশ ইঞ্জিন" : "Agro-Ecological Recommendation Engine"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {selectedDistrict ? (language === "bn" ? selectedDistrict.bnName : selectedDistrict.name) : "ঢাকা"}{" "}
            {language === "bn" ? "জেলার জন্য উপযুক্ত ফসল নির্বাচন" : "Crop Suitability Analysis"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === "bn" ? "কৃষি অঞ্চল: " : "Zone: "}
            <span className="font-semibold text-slate-700">
              {selectedDistrict ? (language === "bn" ? selectedDistrict.aeZoneBn : selectedDistrict.aeZone) : ""}
            </span>
            {" • "}
            {language === "bn" ? "বর্তমান সময়কাল: " : "Period: "}
            <span className="font-semibold text-emerald-800">{monthNameBn} ({seasonNameBn})</span>
          </p>
        </div>

        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold border border-emerald-200 transition-colors self-start md:self-auto"
        >
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>{language === "bn" ? "অন্যান্য জেলা দেখুন" : "Change District"}</span>
        </button>
      </div>

      {/* Month Selector Carousel */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>{language === "bn" ? "মাস অনুযায়ী ফসলের উপযুক্ততা দেখুন:" : "Select Month to Plan Ahead:"}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1.5">
          {months.map(m => (
            <button
              key={m.num}
              onClick={() => setSelectedMonth(m.num)}
              className={`p-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                selectedMonth === m.num
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-sm font-bold"
                  : "bg-slate-50 hover:bg-emerald-50 text-slate-700 border-slate-200"
              }`}
            >
              <div className="truncate">{m.bn}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards List */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-44 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="h-44 bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((item, idx) => {
            const isTopMatch = item.suitabilityScore >= 80;

            return (
              <div
                key={item.crop.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                  isTopMatch
                    ? "border-emerald-300 ring-1 ring-emerald-400 bg-gradient-to-r from-emerald-50/40 to-white"
                    : "border-slate-200 hover:border-emerald-200"
                }`}
              >
                {/* Left Column: Crop Identity & Score */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-slate-900">
                      {language === "bn" ? item.crop.bnName : item.crop.name}
                    </span>

                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {item.crop.categoryBn}
                    </span>

                    {item.isPrimaryForDistrict && (
                      <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>{language === "bn" ? "জেলার প্রধান ফসল" : "District Specialty"}</span>
                      </span>
                    )}

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        item.sowingStatus === "active"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : item.sowingStatus === "upcoming"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {item.sowingStatusBn}
                    </span>
                  </div>

                  {/* Recommendation Reason */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {item.reasonBn}
                  </p>

                  {/* Recommended Varieties */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-semibold text-slate-600">
                      {language === "bn" ? "সুপারিশকৃত জাতসমূহ: " : "Varieties: "}
                    </span>
                    {item.recommendedVarietiesBn.map((varName, vIdx) => (
                      <span
                        key={vIdx}
                        className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        {varName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Column: Score Badge & Profit Calculator Action */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <div className="text-[11px] text-slate-500 font-medium">
                      {language === "bn" ? "উপযুক্ততা স্কোর" : "Match Score"}
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-700">
                      {toBengaliNumber(item.suitabilityScore)} / {toBengaliNumber(100)}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {item.suitabilityLevelBn}
                    </span>
                  </div>

                  {onPlanCropProfit && (
                    <button
                      onClick={() => onPlanCropProfit(item.crop.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-sm"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>{language === "bn" ? "লাভ-ক্ষতি হিসাব করুন" : "Calculate Profit"}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

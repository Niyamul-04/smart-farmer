import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { CropData } from "../types";
import {
  Calendar,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Droplets,
  ShieldAlert,
  Sprout,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export const CropCalendar: React.FC = () => {
  const { language, toBengaliNumber } = useLanguage();
  const [crops, setCrops] = useState<CropData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSeason, setSelectedSeason] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedCropId, setExpandedCropId] = useState<string | null>(null);

  const months = [
    { num: 1, bn: "জানুয়ারি (পৌষ-মাঘ)", en: "January" },
    { num: 2, bn: "ফেব্রুয়ারি (মাঘ-ফাল্গুন)", en: "February" },
    { num: 3, bn: "মার্চ (ফাল্গুন-চৈত্র)", en: "March" },
    { num: 4, bn: "এপ্রিল (চৈত্র-বৈশাখ)", en: "April" },
    { num: 5, bn: "মে (বৈশাখ-জ্যৈষ্ঠ)", en: "May" },
    { num: 6, bn: "জুন (জ্যৈষ্ঠ-আষাঢ়)", en: "June" },
    { num: 7, bn: "জুলাই (আষাঢ়-শ্রাবণ)", en: "July" },
    { num: 8, bn: "আগস্ট (শ্রাবণ-ভাদ্র)", en: "August" },
    { num: 9, bn: "সেপ্টেম্বর (ভাদ্র-আশ্বিন)", en: "September" },
    { num: 10, bn: "অক্টোবর (আশ্বিন-কার্তিক)", en: "October" },
    { num: 11, bn: "নভেম্বর (কার্তিক-অগ্রহায়ণ)", en: "November" },
    { num: 12, bn: "ডিসেম্বর (অগ্রহায়ণ-পৌষ)", en: "December" }
  ];

  const seasons = [
    { id: "all", bn: "সকল ফসল", en: "All Crops" },
    { id: "rabi", bn: "রবি মৌসুম (শীতকালীন)", en: "Rabi (Winter)" },
    { id: "kharif_1", bn: "খরিফ-১ মৌসুম (প্রাক-বর্ষা)", en: "Kharif-1 (Pre-Monsoon)" },
    { id: "kharif_2", bn: "খরিফ-২ মৌসুম (বর্ষা-শরৎ)", en: "Kharif-2 (Monsoon)" }
  ];

  useEffect(() => {
    async function loadCrops() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/crops");
        const data = await res.json();
        if (data.success) {
          setCrops(data.crops);
        }
      } catch (err) {
        console.error("Failed to load crops:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCrops();
  }, []);

  const getSowingStatus = (crop: CropData) => {
    const start = crop.sowingWindowStartMonth;
    const end = crop.sowingWindowEndMonth;
    const isInside =
      start <= end
        ? selectedMonth >= start && selectedMonth <= end
        : selectedMonth >= start || selectedMonth <= end;

    const nextM = selectedMonth === 12 ? 1 : selectedMonth + 1;
    const isUpcoming =
      start <= end
        ? nextM >= start && nextM <= end
        : nextM >= start || nextM <= end;

    if (isInside) {
      return {
        type: "active",
        label: language === "bn" ? "অনুকূল সময় (সক্রিয় বপন)" : "Active Sowing Window",
        color: "bg-emerald-100 text-emerald-800 border-emerald-300"
      };
    }
    if (isUpcoming) {
      return {
        type: "upcoming",
        label: language === "bn" ? "আসন্ন মৌসুম (প্রস্তুতি নিন)" : "Upcoming Window",
        color: "bg-amber-100 text-amber-800 border-amber-300"
      };
    }
    return {
      type: "past",
      label: language === "bn" ? "বপনের সময় শেষ" : "Past Window",
      color: "bg-slate-100 text-slate-600 border-slate-200"
    };
  };

  const filteredCrops = crops.filter(crop => {
    const matchesSeason = selectedSeason === "all" || crop.season === selectedSeason;
    const matchesQuery =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.bnName.includes(searchQuery) ||
      crop.varieties.some(v => v.bnName.includes(searchQuery) || v.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSeason && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{language === "bn" ? "কৃষি ক্যালেন্ডার নির্দেশিকা" : "Bangladesh Crop Calendar"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {language === "bn" ? "ঋতুভিত্তিক ফসলের পঞ্জিকা ও চাষাবাদ সময়সূচী" : "Seasonal Crop Calendar & Cultivation Schedules"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === "bn"
              ? "বারি (BARI), ব্রি (BRRI) ও কৃষি সম্প্রসারণ অধিদপ্তর (DAE) কর্তৃক যাচাইকৃত বৈজ্ঞানিক সময়সীমা।"
              : "Scientifically verified cultivation windows from BRRI, BARI, and DAE."}
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === "bn" ? "ফসল বা জাত খুঁজুন (যেমন: ব্রি ধান)..." : "Search crop or variety..."}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Month & Season Filter Controls */}
      <div className="space-y-3">
        {/* Season Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {seasons.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSeason(s.id)}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedSeason === s.id
                  ? "bg-emerald-600 text-white shadow-sm font-bold"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {language === "bn" ? s.bn : s.en}
            </button>
          ))}
        </div>

        {/* 12 Months Pills */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === "bn" ? "মাসের সাপেক্ষে ফসলের অবস্থা নির্বাচন করুন:" : "Select Month:"}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1.5">
            {months.map(m => (
              <button
                key={m.num}
                onClick={() => setSelectedMonth(m.num)}
                className={`p-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                  selectedMonth === m.num
                    ? "bg-emerald-500 text-white border-emerald-600 shadow-sm font-bold"
                    : "bg-slate-50 hover:bg-emerald-50 text-slate-700 border-slate-200"
                }`}
              >
                <div className="truncate">{language === "bn" ? m.bn : m.en}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Crop Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>
      ) : filteredCrops.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600 text-sm font-medium">কোনো ফসল খুঁজে পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCrops.map(crop => {
            const status = getSowingStatus(crop);
            const isExpanded = expandedCropId === crop.id;

            return (
              <div
                key={crop.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 space-y-4">
                  {/* Top Bar: Crop Name & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900">
                          {language === "bn" ? crop.bnName : crop.name}
                        </h2>
                        <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                          {crop.categoryBn}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {crop.seasonBn} • {crop.bengaliMonths}
                      </p>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-500 block">{language === "bn" ? "জীবনকাল:" : "Duration:"}</span>
                      <strong className="text-slate-800">
                        {toBengaliNumber(crop.durationDaysRange[0])} - {toBengaliNumber(crop.durationDaysRange[1])} {language === "bn" ? "দিন" : "days"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{language === "bn" ? "গড় ফলন:" : "Avg Yield:"}</span>
                      <strong className="text-emerald-700">
                        {toBengaliNumber(crop.benchmarkCost.avgExpectedYieldPerDecimalKg)} {language === "bn" ? "কেজি / শতাংশ" : "kg/dec"}
                      </strong>
                    </div>
                  </div>

                  {/* Cultivation Details */}
                  <div className="space-y-2 text-xs text-slate-700">
                    <p>
                      <strong className="text-slate-900">{language === "bn" ? "মাটি ও জমি:" : "Soil:"}</strong>{" "}
                      {crop.soilSuitabilityBn}
                    </p>
                    <p>
                      <strong className="text-slate-900">{language === "bn" ? "সেচ ও পানি:" : "Water:"}</strong>{" "}
                      {crop.waterRequirementBn}
                    </p>
                  </div>

                  {/* Weather Risks & Prevention */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5 text-xs">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{language === "bn" ? "আবহাওয়া ঝুঁকি ও প্রতিকার" : "Weather Risks & Measures"}</span>
                    </div>
                    <p className="text-amber-800 leading-relaxed">
                      ⚠️ {crop.weatherRisksBn[0]}
                    </p>
                    <p className="text-emerald-900 font-medium leading-relaxed">
                      💡 {crop.preventiveMeasuresBn[0]}
                    </p>
                  </div>

                  {/* Expandable Varieties Section */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
                      <div className="font-bold text-xs text-slate-900">
                        {language === "bn" ? "অনুমোদিত ও উচ্চফলনশীল জাতসমূহ:" : "Approved Varieties:"}
                      </div>
                      <div className="space-y-2">
                        {crop.varieties.map((v, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                            <div className="flex items-center justify-between font-bold text-emerald-800">
                              <span>{language === "bn" ? v.bnName : v.name}</span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                {v.durationDays} {language === "bn" ? "দিন" : "days"} • {v.yieldPerBighaMaund} {language === "bn" ? "মণ/বিঘা" : "maund/bigha"}
                              </span>
                            </div>
                            <p className="text-slate-600">{v.characteristicsBn}</p>
                            <p className="text-emerald-700 font-medium">⭐ {v.specialTraitBn}</p>
                          </div>
                        ))}
                      </div>

                      {/* Source attribution */}
                      <div className="text-[11px] text-slate-500 pt-2 flex items-center justify-between">
                        <span>
                          {language === "bn" ? "উৎস: " : "Source: "}
                          <strong className="text-slate-700">{crop.sourceAuthority}</strong>
                        </span>
                        <span>
                          {language === "bn" ? "হালনাগাদ: " : "Verified: "}
                          {toBengaliNumber(crop.lastVerifiedDate)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Toggle Button */}
                <button
                  onClick={() => setExpandedCropId(isExpanded ? null : crop.id)}
                  className="w-full py-2.5 bg-slate-50 hover:bg-emerald-50 border-t border-slate-100 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-1 transition-colors"
                >
                  <span>{isExpanded ? (language === "bn" ? "সংক্ষেপ করুন" : "Show Less") : (language === "bn" ? "অনুমোদিত জাত ও বিস্তারিত তথ্য দেখুন" : "View Varieties & Details")}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

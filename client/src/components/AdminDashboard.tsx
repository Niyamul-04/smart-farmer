import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { CropData } from "../types";
import {
  Settings,
  Server,
  Database,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  Clock,
  Layers,
  Sparkles
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const { language, toBengaliNumber } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [crops, setCrops] = useState<CropData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"sources" | "crops">("sources");

  useEffect(() => {
    async function loadAdminData() {
      setIsLoading(true);
      try {
        const [statsRes, cropsRes] = await Promise.all([
          fetch("/api/admin/stats").then(r => r.json()),
          fetch("/api/admin/crops").then(r => r.json())
        ]);
        if (statsRes.success) setStats(statsRes);
        if (cropsRes.success) setCrops(cropsRes.crops);
      } catch (err) {
        console.error("Admin data error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const sourcesList = [
    {
      name: "বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI)",
      nameEn: "Bangladesh Rice Research Institute",
      url: "https://brri.gov.bd",
      coverage: "সমগ্র বাংলাদেশ (বোরো, আমন ও আউশ ধান)",
      verified: "২০২৬-০১-১৫",
      status: "যাচাইকৃত (Verified)",
      type: "অফিসিয়াল সরকারি জাত ও গবেষণা উপাত্ত"
    },
    {
      name: "বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট (BARI)",
      nameEn: "Bangladesh Agricultural Research Institute",
      url: "https://bari.gov.bd",
      coverage: "গম, ভুট্টা, আলু, ডাল, তৈলবীজ, মসলা ও শাকসবজি",
      verified: "২০২৬-০১-১৮",
      status: "যাচাইকৃত (Verified)",
      type: "অফিসিয়াল সরকারি ফসল ও জাত ব্যবস্থাপনা"
    },
    {
      name: "বাংলাদেশ পাট গবেষণা ইনস্টিটিউট (BJRI)",
      nameEn: "Bangladesh Jute Research Institute",
      url: "https://bjri.gov.bd",
      coverage: "তোষা ও দেশি পাট, রিবন রেটিং ও জাগ ব্যবস্থাপনা",
      verified: "২০২৬-০১-২০",
      status: "যাচাইকৃত (Verified)",
      type: "পাট ও আঁশ ফসল নির্দেশিকা"
    },
    {
      name: "কৃষি সম্প্রসারণ অধিদপ্তর (DAE) ও BAMIS",
      nameEn: "Department of Agricultural Extension & BAMIS",
      url: "https://dae.gov.bd",
      coverage: "৬৪ জেলার শস্য ক্যালেন্ডার, ব্যয় প্রাক্কলন ও কৃষি আবহাওয়া",
      verified: "২০২৬-০২-০১",
      status: "যাচাইকৃত (Verified)",
      type: "মাঠ পর্যায়ের বাস্তবায়ন ও সার সুপারিশ"
    },
    {
      name: "Open-Meteo Weather API (ECMWF & GFS)",
      nameEn: "Open-Meteo Meteorological Service",
      url: "https://open-meteo.com",
      coverage: "বাংলাদেশের যেকোনো জিপিএস কোঅর্ডিনেট (নিকটতম হাই-রেজোলিউশন গ্রিড)",
      verified: "রিয়েল-টাইম লাইভ ক্যাশড",
      status: "সক্রিয় (Active CC BY 4.0)",
      type: "উচ্চ নির্ভুল গ্লোবাল পূর্বাভাস মডেল"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Settings className="w-4 h-4 text-emerald-600" />
            <span>{language === "bn" ? "তথ্য উপাত্ত ও গবেষণা উৎস নিয়ন্ত্রণ" : "Sources, Verification & Admin"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {language === "bn" ? "যাচাইকৃত উৎস ও সিস্টেম প্রশাসন" : "Verified Data Sources & System Admin"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === "bn"
              ? "কৃষি তথ্য ও আবহাওয়ার স্বচ্ছতা বজায় রাখতে প্রতিটি উপাত্তের আনুষ্ঠানিক উৎস নথিভুক্ত রাখা হয়।"
              : "Maintaining source transparency, research citations, and server integrity."}
          </p>
        </div>

        {/* View Switch */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setActiveTab("sources")}
            className={`px-3 py-2 rounded-lg transition-all ${
              activeTab === "sources" ? "bg-white text-emerald-800 shadow-sm font-bold" : "text-slate-600"
            }`}
          >
            {language === "bn" ? "উপাত্তের উৎস ও লাইসেন্স" : "Sources & Licensing"}
          </button>
          <button
            onClick={() => setActiveTab("crops")}
            className={`px-3 py-2 rounded-lg transition-all ${
              activeTab === "crops" ? "bg-white text-emerald-800 shadow-sm font-bold" : "text-slate-600"
            }`}
          >
            {language === "bn" ? "নিবন্ধিত ফসলের ডাটাবেজ" : "Crop Registry"}
          </button>
        </div>
      </div>

      {/* Live System Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>{language === "bn" ? "সার্ভার আপটাইম" : "Server Uptime"}</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {toBengaliNumber(Math.round(stats.serverUptimeSeconds / 60))} {language === "bn" ? "মিনিট" : "min"}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Database className="w-4 h-4 text-blue-600" />
              <span>{language === "bn" ? "প্রশাসনিক জেলা" : "Districts"}</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {toBengaliNumber(stats.districtsCount)} {language === "bn" ? "টি জেলা" : "Districts"}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>{language === "bn" ? "মোট উপজেলা" : "Upazilas"}</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {toBengaliNumber(stats.upazilasTotalCount)} {language === "bn" ? "টি" : "Units"}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === "bn" ? "যাচাইকৃত প্রধান ফসল" : "Verified Crops"}</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {toBengaliNumber(stats.activeCropsCount)} {language === "bn" ? "টি" : "Crops"}
            </div>
          </div>
        </div>
      )}

      {activeTab === "sources" ? (
        /* Sources Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">
              {language === "bn" ? "প্রাতিষ্ঠানিক গবেষণা ও আবহাওয়া অংশীদারিত্ব" : "Institutional & Weather Sources"}
            </span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {language === "bn" ? "১০০% ওপেন ও সরকারি লাইসেন্সকৃত" : "Open & Verified"}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {sourcesList.map((src, idx) => (
              <div key={idx} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                      {src.name}
                    </h2>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-800"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-500">{src.nameEn}</p>
                  <p className="text-xs text-slate-700">
                    <strong>{language === "bn" ? "আওতাভুক্ত ডাটা:" : "Coverage:"}</strong> {src.coverage}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="inline-block text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full mb-1">
                    {src.status}
                  </span>
                  <div className="text-[11px] text-slate-500">
                    {language === "bn" ? "সর্বশেষ তথ্য হালনাগাদ: " : "Last Verified: "}
                    <strong>{toBengaliNumber(src.verified)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Crop Registry View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">
              {language === "bn" ? "নিবন্ধিত ১২টি প্রধান শস্যের ডাটাবেজ" : "12 Registered Master Crops"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
                <tr>
                  <th className="p-3">ফসল</th>
                  <th className="p-3">মৌসুম</th>
                  <th className="p-3">জীবনকাল</th>
                  <th className="p-3">গড় ফলন</th>
                  <th className="p-3">গড় বিক্রয়দর</th>
                  <th className="p-3">যাচাইকারী সংস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {crops.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">
                      {c.bnName} ({c.name})
                    </td>
                    <td className="p-3 text-slate-600">{c.seasonBn}</td>
                    <td className="p-3 text-slate-700 font-semibold">
                      {toBengaliNumber(c.durationDaysRange[0])}-{toBengaliNumber(c.durationDaysRange[1])} দিন
                    </td>
                    <td className="p-3 text-emerald-700 font-bold">
                      {toBengaliNumber(c.benchmarkCost.avgExpectedYieldPerDecimalKg)} কেজি/শতাংশ
                    </td>
                    <td className="p-3 text-slate-800">
                      ৳ {toBengaliNumber(c.benchmarkCost.avgSellingPricePerKg)} / কেজি
                    </td>
                    <td className="p-3 text-slate-500">{c.sourceAuthority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

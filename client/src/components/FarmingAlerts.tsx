import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "../context/LocationContext";
import { FarmingAlert } from "../types";
import {
  BellRing,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Info,
  Calendar,
  Layers
} from "lucide-react";

export const FarmingAlerts: React.FC = () => {
  const { language } = useLanguage();
  const { selectedDistrict, selectedUpazila, coordinates, setIsSearchModalOpen } = useLocation();

  const [alerts, setAlerts] = useState<FarmingAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  useEffect(() => {
    async function loadAlerts() {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          lat: coordinates.lat.toString(),
          lon: coordinates.lon.toString(),
          district: selectedDistrict?.name || "Dhaka",
          districtBn: selectedDistrict?.bnName || "ঢাকা"
        });

        const res = await fetch(`/api/advisories/active?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setAlerts(data.alerts);
        }
      } catch (err) {
        console.error("Alerts fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAlerts();
  }, [coordinates, selectedDistrict]);

  const filteredAlerts =
    filterSeverity === "all"
      ? alerts
      : alerts.filter(a => a.severity === filterSeverity);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          cardBg: "bg-red-50/70 border-red-300 ring-1 ring-red-400",
          badgeBg: "bg-red-600 text-white",
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
          titleColor: "text-red-950"
        };
      case "warning":
        return {
          cardBg: "bg-amber-50/70 border-amber-300",
          badgeBg: "bg-amber-500 text-slate-900 font-bold",
          icon: <ShieldAlert className="w-5 h-5 text-amber-600" />,
          titleColor: "text-amber-950"
        };
      case "good_news":
        return {
          cardBg: "bg-emerald-50/70 border-emerald-300",
          badgeBg: "bg-emerald-600 text-white",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
          titleColor: "text-emerald-950"
        };
      default:
        return {
          cardBg: "bg-blue-50/70 border-blue-300",
          badgeBg: "bg-blue-600 text-white",
          icon: <Info className="w-5 h-5 text-blue-600" />,
          titleColor: "text-blue-950"
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <BellRing className="w-4 h-4 text-emerald-600" />
            <span>{language === "bn" ? "আবহাওয়া ভিত্তিক কৃষি পূর্বাভাস ও সতর্কতা" : "Weather-Driven Farming Advisory Engine"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {selectedDistrict ? (language === "bn" ? selectedDistrict.bnName : selectedDistrict.name) : "ঢাকা"}{" "}
            {selectedUpazila && `(${language === "bn" ? selectedUpazila.bnName : selectedUpazila.name})`}{" "}
            {language === "bn" ? "এলাকার সক্রিয় কৃষি সতর্কবার্তা" : "Active Agro-Advisories"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === "bn"
              ? "আবহাওয়ার ৭ দিনের পূর্বাভাসের ওপর ভিত্তি করে পরিচালিত স্বয়ংক্রিয় বিধি-নির্ভর বিশ্লেষণ।"
              : "Rule-based contextual advisories dynamically computed from the 7-day forecast."}
          </p>
        </div>

        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold border border-emerald-200 transition-colors self-start md:self-auto"
        >
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>{language === "bn" ? "স্থান পরিবর্তন" : "Change Location"}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilterSeverity("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterSeverity === "all"
              ? "bg-emerald-600 text-white shadow-sm font-bold"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          {language === "bn" ? "সকল সতর্কতা" : "All Alerts"} ({alerts.length})
        </button>
        <button
          onClick={() => setFilterSeverity("critical")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterSeverity === "critical"
              ? "bg-red-600 text-white shadow-sm font-bold"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          {language === "bn" ? "জরুরি সতর্কতা" : "Critical"}
        </button>
        <button
          onClick={() => setFilterSeverity("warning")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterSeverity === "warning"
              ? "bg-amber-500 text-slate-900 shadow-sm font-bold"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          {language === "bn" ? "সতর্কবার্তা" : "Warnings"}
        </button>
        <button
          onClick={() => setFilterSeverity("advisory")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterSeverity === "advisory"
              ? "bg-blue-600 text-white shadow-sm font-bold"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          {language === "bn" ? "কৃষি পরামর্শ" : "Advisories"}
        </button>
        <button
          onClick={() => setFilterSeverity("good_news")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterSeverity === "good_news"
              ? "bg-emerald-600 text-white shadow-sm font-bold"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          {language === "bn" ? "অনুকূল সময়" : "Favorable"}
        </button>
      </div>

      {/* Alerts Grid */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-44 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="h-44 bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">
            {language === "bn" ? "কোনো চরম দুর্যোগ বা সতর্কবার্তা নেই" : "No Critical Agro-Weather Alerts"}
          </h2>
          <p className="text-xs text-slate-500">
            {language === "bn"
              ? "বর্তমান আবহাওয়া ফসল পরিচর্যা ও স্বাভাবিক চাষাবাদের জন্য উপযোগী।"
              : "Current weather conditions are favorable for ongoing agricultural tasks."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map(alert => {
            const style = getSeverityStyle(alert.severity);

            return (
              <div
                key={alert.id}
                className={`p-6 rounded-2xl border shadow-sm transition-all ${style.cardBg}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-xs shrink-0 mt-0.5">
                      {style.icon}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${style.badgeBg}`}>
                          {alert.severityBn}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{alert.timeWindowBn}</span>
                        </span>
                      </div>
                      <h2 className={`text-lg font-bold ${style.titleColor}`}>
                        {alert.titleBn}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs sm:text-sm">
                  <div className="p-3 bg-white/70 rounded-xl border border-black/5 space-y-1">
                    <div className="text-slate-600 font-semibold flex items-center gap-1.5">
                      <span className="text-red-500">⚠️</span>
                      <span>{language === "bn" ? "আবহাওয়াগত কারণ ও ঝুঁকি:" : "Reason:"}</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">{alert.reasonBn}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200/60 shadow-xs space-y-1">
                    <div className="text-emerald-800 font-bold flex items-center gap-1.5">
                      <span className="text-emerald-600">💡</span>
                      <span>{language === "bn" ? "কৃষকের করণীয় পদক্ষেপ:" : "Action Plan:"}</span>
                    </div>
                    <p className="text-slate-900 font-medium leading-relaxed">{alert.actionStepBn}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2">
                    <div>
                      <strong className="text-slate-700">{language === "bn" ? "প্রভাবিত ফসল: " : "Affected crops: "}</strong>
                      <span>{alert.relevantCropsBn.join(", ")}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {language === "bn" ? "উৎস: " : "Source: "}
                      {alert.sourceAuthority}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

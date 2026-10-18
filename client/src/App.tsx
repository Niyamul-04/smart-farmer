import React, { useState } from "react";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { LocationProvider } from "./context/LocationContext";
import { Navbar } from "./components/Navbar";
import { LocationSearchModal } from "./components/LocationSearchModal";
import { WeatherDashboard } from "./components/WeatherDashboard";
import { BangladeshMap } from "./components/BangladeshMap";
import { CropCalendar } from "./components/CropCalendar";
import { CropRecommendationExplorer } from "./components/CropRecommendationExplorer";
import { ProfitCalculator } from "./components/ProfitCalculator";
import { FarmingAlerts } from "./components/FarmingAlerts";
import { GeneralPublicWeather } from "./components/GeneralPublicWeather";
import { AdminDashboard } from "./components/AdminDashboard";
import { NiyamulAI } from "./components/NiyamulAI";
import {
  CloudSun,
  MapPin,
  Calendar,
  Sprout,
  Calculator,
  BellRing,
  Users,
  Sparkles,
  Bot
} from "lucide-react";

const MainContent: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("weather");
  const [plannerSelectedCrop, setPlannerSelectedCrop] = useState<string>("boro_rice");

  const handlePlanCropProfit = (cropId: string) => {
    setPlannerSelectedCrop(cropId);
    setActiveTab("profit-planner");
  };

  const handleSelectDistrictWeather = () => {
    setActiveTab("weather");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16 lg:pb-0">
      {/* Header & Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Location Search & Selector Modal */}
      <LocationSearchModal />

      {/* Main Page Content */}
      <main className="flex-1 animate-in fade-in duration-200">
        {activeTab === "weather" && <WeatherDashboard />}
        {activeTab === "niyamul-ai" && <NiyamulAI />}
        {activeTab === "map" && (
          <BangladeshMap onSelectDistrictWeather={handleSelectDistrictWeather} />
        )}
        {activeTab === "crop-calendar" && <CropCalendar />}
        {activeTab === "crop-advisor" && (
          <CropRecommendationExplorer onPlanCropProfit={handlePlanCropProfit} />
        )}
        {activeTab === "profit-planner" && (
          <ProfitCalculator initialCropId={plannerSelectedCrop} />
        )}
        {activeTab === "farming-alerts" && <FarmingAlerts />}
        {activeTab === "public-weather" && <GeneralPublicWeather />}
        {activeTab === "admin" && <AdminDashboard />}
      </main>

      {/* Floating Niyamul AI Quick Assistant Launcher Button */}
      {activeTab !== "niyamul-ai" && (
        <button
          onClick={() => setActiveTab("niyamul-ai")}
          className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white px-4 py-3 rounded-full shadow-2xl border-2 border-amber-400 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group cursor-pointer"
          title="নিয়ামুল এআই (Niyamul AI)-এর সাথে কথা বলুন"
        >
          <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-base shadow-sm shrink-0">
            🤖
          </div>
          <div className="text-left pr-1">
            <div className="text-xs font-black tracking-wide flex items-center gap-1.5 text-white">
              <span>{language === "bn" ? "নিয়ামুল এআই" : "Niyamul AI"}</span>
              <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                Smart
              </span>
            </div>
            <div className="text-[10px] text-emerald-200 font-medium">
              {language === "bn" ? "কৃষি ও আবহাওয়া প্রশ্ন করুন" : "Ask Agro & Weather"}
            </div>
          </div>
        </button>
      )}

      {/* Mobile Bottom Navigation Bar (1-Thumb Easy Touch) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1">
        <div className="grid grid-cols-5 gap-1">
          <button
            onClick={() => setActiveTab("weather")}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === "weather" ? "text-emerald-700 font-bold" : "text-slate-500"
            }`}
          >
            <CloudSun className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">
              {language === "bn" ? "আবহাওয়া" : "Weather"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("niyamul-ai")}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === "niyamul-ai" ? "text-emerald-700 font-extrabold" : "text-amber-700 font-bold"
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5 text-amber-500 animate-pulse" />
            <span className="text-[10px] leading-tight text-emerald-800 font-bold">
              {language === "bn" ? "নিয়ামুল AI" : "AI Advisor"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("map")}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === "map" ? "text-emerald-700 font-bold" : "text-slate-500"
            }`}
          >
            <MapPin className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">
              {language === "bn" ? "মানচিত্র" : "Map"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("profit-planner")}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === "profit-planner" ? "text-emerald-700 font-bold" : "text-slate-500"
            }`}
          >
            <Calculator className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">
              {language === "bn" ? "লাভ-ক্ষতি" : "Planner"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("farming-alerts")}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === "farming-alerts" ? "text-emerald-700 font-bold" : "text-slate-500"
            }`}
          >
            <BellRing className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">
              {language === "bn" ? "সতর্কতা" : "Alerts"}
            </span>
          </button>
        </div>
      </nav>

      {/* Desktop / Global Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="text-white font-bold text-sm flex items-center justify-center md:justify-start gap-2">
              <span>🌾</span>
              <span>আবহাওয়া বন্ধু — Smart Bangladesh Weather & Agriculture</span>
            </div>
            <p className="mt-1 text-slate-400 font-medium">
              {language === "bn"
                ? "কৃষি সম্প্রসারণ অধিদপ্তর (DAE), ব্রি (BRRI), বারি (BARI) ও ওপেন-মেটিও ওপেন ডাটা সহযোগিতায় প্রস্তুত • এআই সহায়ক: নিয়ামুল এআই।"
                : "Powered by Open-Meteo, BRRI, BARI, and DAE verified research data • AI Advisor: Niyamul AI."}
            </p>
          </div>

          <div className="text-slate-500 text-[11px] leading-relaxed">
            <p>
              {language === "bn"
                ? "পূর্বাভাস পরিবর্তনশীল প্রকৃতির ওপর নির্ভরশীল। জরুরি দুর্যোগকালীন পরিস্থিতিতে আবহাওয়া অধিদপ্তরের বার্তা অনুসরণ করুন।"
                : "Forecasts are probabilistic model-based guidance. Follow official BMD emergency bulletins for disasters."}
            </p>
            <p className="mt-0.5">© ২০২৬ আবহাওয়া বন্ধু • তৈরি করেছেন নিয়ামুল (Niyamul)</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <LocationProvider>
        <MainContent />
      </LocationProvider>
    </LanguageProvider>
  );
};

export default App;

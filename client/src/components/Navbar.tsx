import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "../context/LocationContext";
import {
  CloudSun,
  MapPin,
  Navigation,
  Globe,
  Menu,
  X,
  Search,
  Calendar,
  Sprout,
  Calculator,
  BellRing,
  Users,
  Settings,
  Sparkles,
  Bot
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const {
    selectedDistrict,
    selectedUpazila,
    requestBrowserLocation,
    isGeolocating,
    setIsSearchModalOpen
  } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "weather", labelKey: "navWeather", icon: CloudSun },
    { id: "niyamul-ai", labelKey: "navNiyamulAI", icon: Sparkles, isSpecial: true },
    { id: "map", labelKey: "navMap", icon: MapPin },
    { id: "crop-calendar", labelKey: "navCropCalendar", icon: Calendar },
    { id: "crop-advisor", labelKey: "navCropAdvisor", icon: Sprout },
    { id: "profit-planner", labelKey: "navProfitPlanner", icon: Calculator },
    { id: "farming-alerts", labelKey: "navFarmingAlerts", icon: BellRing },
    { id: "public-weather", labelKey: "navPublicWeather", icon: Users },
    { id: "admin", labelKey: "navAdmin", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      {/* Top Banner / Location Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-sm">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌾</span>
            <div>
              <span className="font-bold text-base tracking-wide">
                {language === "bn" ? "আবহাওয়া বন্ধু" : "Abhawa Bondhu"}
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-emerald-200">
                {t("appSubtitle")}
              </span>
            </div>
          </div>

          {/* Current Location & GPS Switch */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-1.5 bg-emerald-900/60 hover:bg-emerald-900 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-emerald-500/40 transition-colors"
              title="স্থান পরিবর্তন করতে ক্লিক করুন"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {selectedDistrict
                  ? `${language === "bn" ? selectedDistrict.bnName : selectedDistrict.name}${
                      selectedUpazila ? ` (${language === "bn" ? selectedUpazila.bnName : selectedUpazila.name})` : ""
                    }`
                  : t("selectLocation")}
              </span>
              <Search className="w-3 h-3 ml-1 text-emerald-300" />
            </button>

            <button
              onClick={requestBrowserLocation}
              disabled={isGeolocating}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-900 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm transition-all"
              title="ব্রাউজার জিপিএস দিয়ে আপনার জেলা নির্ধারণ করুন"
            >
              <Navigation className={`w-3.5 h-3.5 ${isGeolocating ? "animate-spin" : ""}`} />
              <span className="hidden xs:inline">
                {isGeolocating ? (language === "bn" ? "খুঁজছি..." : "Locating...") : t("myLocation")}
              </span>
            </button>

            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-full text-xs font-bold transition-colors ml-1"
              title="বাংলা বা ইংরেজি ভাষা পরিবর্তন করুন"
            >
              <Globe className="w-3 h-3 text-emerald-200" />
              <span>{language === "bn" ? "English" : "বাংলা"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isSpecial = (item as any).isSpecial;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? isSpecial
                        ? "bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white shadow-md ring-2 ring-amber-400 font-bold"
                        : "bg-emerald-600 text-white shadow-sm"
                      : isSpecial
                      ? "bg-amber-50 text-emerald-900 hover:bg-amber-100 border border-amber-300 font-bold shadow-xs"
                      : "text-slate-700 hover:text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : isSpecial ? "text-amber-600" : "text-emerald-600"}`} />
                  <span>{t(item.labelKey)}</span>
                  {isSpecial && (
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 uppercase">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Active Tab Title & Hamburger */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <span className="text-emerald-800 font-bold text-sm flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              {t(navItems.find((i) => i.id === activeTab)?.labelKey || "navWeather")}
            </span>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-emerald-50 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-emerald-700" /> : <Menu className="w-6 h-6 text-emerald-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white px-4 py-3 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-600"}`} />
                  <span className="text-left line-clamp-1">{t(item.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

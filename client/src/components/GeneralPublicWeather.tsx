import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "../context/LocationContext";
import { WeatherData } from "../types";
import {
  Users,
  Umbrella,
  Shirt,
  Car,
  Briefcase,
  Sun,
  CloudRain,
  MapPin,
  Sparkles,
  HeartHandshake,
  CheckCircle2
} from "lucide-react";

export const GeneralPublicWeather: React.FC = () => {
  const { language, toBengaliNumber } = useLanguage();
  const { selectedDistrict, selectedUpazila, coordinates, setIsSearchModalOpen } = useLocation();

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadWeather() {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          lat: coordinates.lat.toString(),
          lon: coordinates.lon.toString(),
          district: selectedDistrict?.name || "Dhaka",
          districtBn: selectedDistrict?.bnName || "ঢাকা"
        });

        const res = await fetch(`/api/weather?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setWeatherData(data.weather);
        }
      } catch (err) {
        console.error("Public weather error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadWeather();
  }, [coordinates, selectedDistrict]);

  if (isLoading || !weatherData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-44 bg-slate-200 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-36 bg-slate-200 rounded-2xl"></div>
          <div className="h-36 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const { current, practicalAdvice, daily7d } = weatherData;
  const suggestions = practicalAdvice.publicSuggestionsBn;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>{language === "bn" ? "সাধারণ নাগরিক পূর্বাভাস ড্যাশবোর্ড" : "General Public Weather View"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {selectedDistrict ? (language === "bn" ? selectedDistrict.bnName : selectedDistrict.name) : "ঢাকা"}{" "}
            {selectedUpazila && `(${language === "bn" ? selectedUpazila.bnName : selectedUpazila.name})`}{" "}
            {language === "bn" ? "দৈনন্দিন জীবন ও চলাচলের পূর্বাভাস" : "Daily Lifestyle & Commute Guide"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === "bn"
              ? "শিক্ষার্থী, চাকরিজীবী, ব্যবসায়ী, পথচারী ও গৃহিণীদের জন্য সহজ ভাষায় দৈনন্দিন টিপস।"
              : "Simple, practical guidance for students, commuters, shopkeepers, and families."}
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

      {/* Headline Card */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">
            {language === "bn" ? "আজকের সার্বিক পরিস্থিতি" : "Overall Outlook"}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold mt-1">
            {practicalAdvice.publicHeadlineBn}
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 mt-2">
            {language === "bn" ? "বর্তমান তাপমাত্রা: " : "Current: "}
            <strong>{toBengaliNumber(current.temp)}°C</strong> ({current.condition.descriptionBn}) •{" "}
            {language === "bn" ? "অনুভূত: " : "Feels: "}
            <strong>{toBengaliNumber(current.apparentTemp)}°C</strong>
          </p>
        </div>
        <div className="hidden sm:block text-5xl">
          {current.condition.isRain ? "🌧️" : "☀️"}
        </div>
      </div>

      {/* 4 Practical Lifestyle Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Umbrella Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${suggestions.umbrellaNeeded ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
              <Umbrella className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">{language === "bn" ? "ছাতা লাগবে কি?" : "Umbrella Needed?"}</div>
              <h2 className="text-base font-bold text-slate-900">
                {suggestions.umbrellaNeeded ? (language === "bn" ? "হ্যাঁ, সাথে রাখুন" : "Yes, Carry One") : (language === "bn" ? "প্রয়োজন নেই" : "Not Required")}
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
            {suggestions.umbrellaAdviceBn}
          </p>
        </div>

        {/* Clothes Drying */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">{language === "bn" ? "কাপড় শুকানো" : "Drying Clothes"}</div>
              <h2 className="text-base font-bold text-slate-900">
                {language === "bn" ? "রোদে শুকানোর সুযোগ" : "Sunlight Exposure"}
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
            {suggestions.clothesDryingBn}
          </p>
        </div>

        {/* Commute and Travel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">{language === "bn" ? "যাতায়াত ও রাস্তাঘাট" : "Travel & Commute"}</div>
              <h2 className="text-base font-bold text-slate-900">
                {language === "bn" ? "সড়ক পরিস্থিতি" : "Road Conditions"}
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
            {suggestions.travelBn}
          </p>
        </div>

        {/* Outdoor Work */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-100 text-teal-700 rounded-2xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">{language === "bn" ? "বাইরে কাজকর্ম" : "Outdoor Activity"}</div>
              <h2 className="text-base font-bold text-slate-900">
                {language === "bn" ? "শারীরিক স্বস্তি" : "Comfort Level"}
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
            {suggestions.outdoorWorkBn}
          </p>
        </div>
      </div>

      {/* 3-Day Simple Public Outlook */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>{language === "bn" ? "আগামী ৩ দিনের সংক্ষিপ্ত জীবনযাত্রা গাইড" : "Next 3 Days Commuter Outlook"}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {daily7d.slice(0, 3).map((d, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                <span>{language === "bn" ? d.dayNameBn : d.dayNameEn}</span>
                <span className="text-emerald-700">
                  {toBengaliNumber(d.maxTemp)}°C / {toBengaliNumber(d.minTemp)}°C
                </span>
              </div>
              <p className="text-slate-600 font-medium">{d.conditionBn}</p>
              <p className="text-slate-700 pt-1 border-t border-slate-200 leading-snug">
                🚗 {d.publicAdviceBn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

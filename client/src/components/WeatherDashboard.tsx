import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "../context/LocationContext";
import { WeatherData } from "../types";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Droplets,
  Wind,
  Compass,
  Sunrise,
  Sunset,
  Thermometer,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  Clock,
  Umbrella
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

export const WeatherDashboard: React.FC = () => {
  const { language, t, toBengaliNumber } = useLanguage();
  const { selectedDistrict, selectedUpazila, coordinates, setIsSearchModalOpen } = useLocation();

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartMode, setChartMode] = useState<"temp" | "rain">("temp");

  useEffect(() => {
    async function loadWeather() {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          lat: coordinates.lat.toString(),
          lon: coordinates.lon.toString(),
          district: selectedDistrict?.name || "Dhaka",
          districtBn: selectedDistrict?.bnName || "ঢাকা",
          upazila: selectedUpazila?.name || "",
          upazilaBn: selectedUpazila?.bnName || ""
        });

        const res = await fetch(`/api/weather?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setWeatherData(data.weather);
        } else {
          setError(data.message || "Failed to load weather");
        }
      } catch (err) {
        console.error("Weather fetch failed:", err);
        setError("আবহাওয়ার তথ্য লোড করতে ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।");
      } finally {
        setIsLoading(false);
      }
    }

    loadWeather();
  }, [coordinates, selectedDistrict, selectedUpazila]);

  const getWeatherIcon = (iconName: string, className = "w-6 h-6") => {
    switch (iconName) {
      case "sun":
        return <Sun className={`${className} text-amber-500`} />;
      case "cloud-sun":
        return <CloudSun className={`${className} text-amber-400`} />;
      case "cloud":
        return <Cloud className={`${className} text-slate-400`} />;
      case "cloud-drizzle":
        return <CloudDrizzle className={`${className} text-sky-400`} />;
      case "cloud-rain":
      case "cloud-lightning-rain":
        return <CloudRain className={`${className} text-blue-500`} />;
      case "cloud-lightning":
      case "cloud-hail":
        return <CloudLightning className={`${className} text-purple-500`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        {/* Skeleton */}
        <div className="h-44 bg-slate-200 rounded-3xl mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
        </div>
        <div className="h-64 bg-slate-200 rounded-3xl mb-6"></div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-900 mb-2">আবহাওয়ার তথ্য পাওয়া যায়নি</h3>
        <p className="text-sm text-red-700 mb-4">{error || "কিছুক্ষণ পর আবার চেষ্টা করুন।"}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm"
        >
          পুনরায় চেষ্টা করুন
        </button>
      </div>
    );
  }

  const { current, periodsToday, hourly24h, daily7d, practicalAdvice, attribution } = weatherData;

  // Hourly chart data formatted for Recharts
  const chartData = hourly24h.map(item => ({
    time: language === "bn" ? toBengaliNumber(item.time) : item.time,
    temp: item.temp,
    rainProb: item.rainProb,
    precipitation: item.precipitationMm
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Location Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-semibold text-emerald-800 tracking-wider uppercase">
              {language === "bn" ? "লাইভ পূর্বাভাস কেন্দ্র" : "Live Forecast Center"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            {selectedDistrict ? (language === "bn" ? selectedDistrict.bnName : selectedDistrict.name) : "ঢাকা"}
            {selectedUpazila && (
              <span className="text-emerald-700 text-base sm:text-lg font-normal ml-2">
                ({language === "bn" ? selectedUpazila.bnName : selectedUpazila.name} উপজেলা)
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === "bn" ? "কৃষি অঞ্চল: " : "Agro-zone: "}
            <span className="font-medium text-slate-700">
              {selectedDistrict ? (language === "bn" ? selectedDistrict.aeZoneBn : selectedDistrict.aeZone) : ""}
            </span>
            {" • "}
            {language === "bn" ? "গ্রিড: " : "Grid: "}
            {toBengaliNumber(coordinates.lat.toFixed(2))}°N, {toBengaliNumber(coordinates.lon.toFixed(2))}°E
          </p>
        </div>

        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold border border-emerald-200 transition-colors"
        >
          {language === "bn" ? "জেলা বা উপজেলা পরিবর্তন" : "Change Location"}
        </button>
      </div>

      {/* Main Hero Card: Current Weather */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Temperature & Condition */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold mb-3">
              {getWeatherIcon(current.condition.icon, "w-4 h-4")}
              <span>{language === "bn" ? current.condition.descriptionBn : current.condition.descriptionEn}</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight drop-shadow-sm font-sans tabular-nums">
                {toBengaliNumber(current.temp)}°
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                {language === "bn" ? "সে." : "C"}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-100">
              <span className="bg-white/15 px-3 py-1 rounded-full border border-white/20">
                {language === "bn" ? "অনুভূত: " : "Feels: "}
                <strong className="text-amber-300 text-sm font-bold">{toBengaliNumber(current.apparentTemp)}°C</strong>
              </span>
              <span className="bg-white/15 px-3 py-1 rounded-full border border-white/20">
                {language === "bn" ? "সর্বোচ্চ: " : "High: "}
                <strong className="text-white text-sm font-bold">{toBengaliNumber(current.maxTempToday)}°C</strong>
              </span>
              <span className="bg-white/15 px-3 py-1 rounded-full border border-white/20">
                {language === "bn" ? "সর্বনিম্ন: " : "Low: "}
                <strong className="text-teal-200 text-sm font-bold">{toBengaliNumber(current.minTempToday)}°C</strong>
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full md:w-auto">
            <div className="bg-white/15 backdrop-blur-xl p-4 rounded-2xl border border-white/25 shadow-lg">
              <div className="flex items-center gap-1.5 text-emerald-100 text-xs font-semibold">
                <Droplets className="w-4 h-4 text-sky-300" />
                <span>{t("humidity")}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1.5 tabular-nums">
                {toBengaliNumber(current.humidity)}%
              </div>
              <div className="text-[10px] text-emerald-200 mt-0.5">আর্দ্রতার মান</div>
            </div>

            <div className="bg-white/15 backdrop-blur-xl p-4 rounded-2xl border border-white/25 shadow-lg">
              <div className="flex items-center gap-1.5 text-emerald-100 text-xs font-semibold">
                <CloudRain className="w-4 h-4 text-blue-300" />
                <span>{t("rainProb")}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-300 mt-1.5 tabular-nums">
                {toBengaliNumber(current.rainProbNow)}%
              </div>
              <div className="text-[10px] text-emerald-200 mt-0.5">বৃষ্টির সম্ভাবনা</div>
            </div>

            <div className="bg-white/15 backdrop-blur-xl p-4 rounded-2xl border border-white/25 shadow-lg">
              <div className="flex items-center gap-1.5 text-emerald-100 text-xs font-semibold">
                <Wind className="w-4 h-4 text-teal-300" />
                <span>{t("windSpeed")}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1.5 tabular-nums">
                {toBengaliNumber(current.windSpeedKmh)}
                <span className="text-xs font-bold text-emerald-200 ml-1">{language === "bn" ? "কিমি/ঘ" : "km/h"}</span>
              </div>
              <div className="text-[10px] text-emerald-200 mt-0.5">বাতাসের গতি</div>
            </div>

            <div className="bg-white/15 backdrop-blur-xl p-4 rounded-2xl border border-white/25 shadow-lg">
              <div className="flex items-center gap-1.5 text-emerald-100 text-xs font-semibold">
                <Sunrise className="w-4 h-4 text-amber-300" />
                <span>{t("sunrise")}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1.5 tabular-nums">
                {toBengaliNumber(current.sunrise)}
              </div>
              <div className="text-[10px] text-emerald-200 mt-0.5">আজ সকালে</div>
            </div>
          </div>
        </div>
      </div>

      {/* Practical Farmer Guidance Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-amber-100 rounded-xl text-amber-800 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h2 className="font-bold text-amber-950 text-base sm:text-lg">
              {practicalAdvice.farmerHeadlineBn}
            </h2>
            <ul className="space-y-1.5 text-sm text-amber-900 list-disc list-inside">
              {practicalAdvice.farmerDetailsBn.map((detail, idx) => (
                <li key={idx} className="leading-relaxed">
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Today's Timeline: সকাল, দুপুর, বিকাল, রাত */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>{t("dayTimeline")}</span>
          </h2>
          <span className="text-xs text-slate-500">
            {language === "bn" ? "দিনের ৪টি ভাগের কৃষি অবস্থা" : "4 periods of the day"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {periodsToday.map((period, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-base">
                    {language === "bn" ? period.periodNameBn : period.periodNameEn}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {toBengaliNumber(period.timeRange)}
                  </span>
                </div>

                <div className="flex items-center gap-3.5 my-2.5">
                  <div className="p-2 bg-slate-100 rounded-2xl shrink-0">
                    {getWeatherIcon(period.icon, "w-8 h-8")}
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">
                      {toBengaliNumber(period.avgTemp)}°C
                    </div>
                    <div className="text-xs font-bold mt-0.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                        period.rainProb >= 40 ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-700"
                      }`}>
                        <Droplets className="w-3 h-3 text-blue-500" />
                        <span>{language === "bn" ? "বৃষ্টি " : "Rain "}</span>
                        <strong>{toBengaliNumber(period.rainProb)}%</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-bold text-emerald-800 mt-2 bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                  {period.conditionBn}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 leading-snug">
                🌾 {period.farmerAdviceBn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 24-Hour Forecast Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-emerald-600" />
              <span>{t("hourlyForecast")}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {language === "bn"
                ? "তাপমাত্রা ও বৃষ্টিপাতের ঘণ্টাওয়ারী গ্রাফ"
                : "24-hour temperature and rainfall outlook"}
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setChartMode("temp")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMode === "temp" ? "bg-white text-emerald-800 shadow-sm font-bold" : "text-slate-600"
              }`}
            >
              {language === "bn" ? "তাপমাত্রা (°C)" : "Temperature (°C)"}
            </button>
            <button
              onClick={() => setChartMode("rain")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMode === "rain" ? "bg-white text-blue-800 shadow-sm font-bold" : "text-slate-600"
              }`}
            >
              {language === "bn" ? "বৃষ্টির সম্ভাবনা (%)" : "Rain Probability (%)"}
            </button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === "temp" ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={["auto", "auto"]} unit="°" tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-lg border border-slate-700">
                          <p className="font-bold text-amber-300">{data.time}</p>
                          <p className="mt-1">
                            {language === "bn" ? "তাপমাত্রা: " : "Temp: "}
                            <strong className="text-emerald-400">{toBengaliNumber(data.temp)}°C</strong>
                          </p>
                          <p>
                            {language === "bn" ? "বৃষ্টির শঙ্কা: " : "Rain prob: "}
                            <strong className="text-sky-300">{toBengaliNumber(data.rainProb)}%</strong>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="temp" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
              </AreaChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-lg border border-slate-700">
                          <p className="font-bold text-sky-300">{data.time}</p>
                          <p className="mt-1">
                            {language === "bn" ? "বৃষ্টিপাতের সম্ভাবনা: " : "Rain Probability: "}
                            <strong className="text-blue-400">{toBengaliNumber(data.rainProb)}%</strong>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="rainProb" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <span>{t("dailyForecast")}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {daily7d.map((day, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                idx === 0
                  ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400"
                  : "bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {language === "bn" ? day.dayNameBn : day.dayNameEn}
                  </span>
                  {idx === 0 && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                      {language === "bn" ? "আজ" : "Today"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 my-3">
                  {getWeatherIcon(day.icon, "w-8 h-8")}
                  <div>
                    <div className="font-extrabold text-slate-800 text-lg">
                      {toBengaliNumber(day.maxTemp)}°
                      <span className="text-slate-400 font-normal text-xs ml-1">
                        / {toBengaliNumber(day.minTemp)}°
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-medium text-slate-700">
                  {day.conditionBn}
                </p>

                <div className="mt-2 text-xs flex items-center gap-1.5 text-blue-600 font-semibold">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>
                    {language === "bn" ? "বৃষ্টি: " : "Rain: "}
                    {toBengaliNumber(day.rainProbMax)}%
                  </span>
                </div>

                {day.riskAlertBn && (
                  <div className="mt-2 p-1.5 bg-red-50 text-red-700 text-[11px] font-semibold rounded-lg border border-red-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0 text-red-600" />
                    <span>{day.riskAlertBn}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                🌾 {day.farmerAdviceBn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attribution & Legal Notice */}
      <div className="bg-slate-100 rounded-2xl p-4 text-xs text-slate-600 border border-slate-200 space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>{attribution.provider}</span>
        </div>
        <p className="leading-relaxed">
          {attribution.disclaimerBn}
        </p>
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
          <span>{attribution.forecastGrid}</span>
          <span>
            {language === "bn" ? "সর্বশেষ হালনাগাদ: " : "Updated: "}
            <strong>{toBengaliNumber(attribution.lastUpdated)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

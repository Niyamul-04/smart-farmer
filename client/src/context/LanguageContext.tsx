import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "bn" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  toBengaliNumber: (num: number | string) => string;
}

const translations: Record<string, { bn: string; en: string }> = {
  // Brand & Header
  appTitle: { bn: "আবহাওয়া বন্ধু", en: "Abhawa Bondhu" },
  appSubtitle: { bn: "স্মার্ট বাংলাদেশ আবহাওয়া ও কৃষি প্ল্যাটফর্ম", en: "Smart Bangladesh Weather & Agriculture" },
  selectLocation: { bn: "স্থান নির্বাচন করুন", en: "Select Location" },
  myLocation: { bn: "আমার অবস্থান", en: "My Location" },
  searchPlaceholder: { bn: "বিভাগ, জেলা, বা উপজেলা খুঁজুন...", en: "Search division, district, or upazila..." },
  
  // Navigation Tabs
  navWeather: { bn: "আবহাওয়া ড্যাশবোর্ড", en: "Weather Dashboard" },
  navMap: { bn: "বাংলাদেশ মানচিত্র", en: "Bangladesh Map" },
  navCropCalendar: { bn: "ফসলের ক্যালেন্ডার", en: "Crop Calendar" },
  navCropAdvisor: { bn: "উপযুক্ত ফসল নির্বাচন", en: "Crop Recommendations" },
  navProfitPlanner: { bn: "লাভ-ক্ষতি ও ব্যয় হিসাব", en: "Profitability Planner" },
  navFarmingAlerts: { bn: "আবহাওয়া ও কৃষি সতর্কতা", en: "Farming Alerts" },
  navPublicWeather: { bn: "সাধারণ পূর্বাভাস", en: "General Public Weather" },
  navNiyamulAI: { bn: "নিয়ামুল এআই (AI)", en: "Niyamul AI" },
  navAdmin: { bn: "তথ্য ও প্রশাসন", en: "Admin & Sources" },

  // Weather terms
  currentTemp: { bn: "বর্তমান তাপমাত্রা", en: "Current Temp" },
  feelsLike: { bn: "অনুভূত তাপমাত্রা", en: "Feels Like" },
  maxMinToday: { bn: "আজকের সর্বোচ্চ / সর্বনিম্ন", en: "Today's Max / Min" },
  humidity: { bn: "আর্দ্রতা", en: "Humidity" },
  windSpeed: { bn: "বাতাসের গতি", en: "Wind Speed" },
  rainProb: { bn: "বৃষ্টির সম্ভাবনা", en: "Rain Probability" },
  precipitation: { bn: "বৃষ্টিপাতের পরিমাণ", en: "Precipitation" },
  cloudCover: { bn: "মেঘের আচ্ছাদন", en: "Cloud Cover" },
  sunrise: { bn: "সূর্যোদয়", en: "Sunrise" },
  sunset: { bn: "সূর্যাস্ত", en: "Sunset" },
  hourlyForecast: { bn: "আগামী ২৪ ঘণ্টার আবহাওয়া", en: "Next 24h Forecast" },
  dailyForecast: { bn: "আগামী ৭ দিনের পূর্বাভাস", en: "7-Day Outlook" },
  dayTimeline: { bn: "আজকের দিনলিপি", en: "Today's Timeline" },
  morning: { bn: "সকাল", en: "Morning" },
  noon: { bn: "দুপুর", en: "Noon" },
  afternoon: { bn: "বিকাল", en: "Afternoon" },
  night: { bn: "রাত", en: "Night" },

  // Advisory & Farming
  farmerAdviceHeadline: { bn: "কৃষকদের জন্য বিশেষ পূর্বাভাস ও করণীয়", en: "Farmer Advisory & Field Guidance" },
  publicSuggestions: { bn: "দৈনন্দিন সাধারণ পরামর্শ", en: "Daily Public Suggestions" },
  umbrellaStatus: { bn: "ছাতা প্রয়োজন কি না", en: "Umbrella Needed?" },
  clothesDrying: { bn: "কাপড় শুকানো", en: "Clothes Drying" },
  travelConditions: { bn: "যাতায়াত ও ভ্রমণ", en: "Travel Conditions" },
  outdoorWork: { bn: "বাইরে কাজকর্ম", en: "Outdoor Work" },

  // Profitability Calculator
  landArea: { bn: "জমির পরিমাণ", en: "Land Area" },
  unitDecimal: { bn: "শতাংশ / ডেসিমাল", en: "Decimal" },
  unitBigha: { bn: "বিঘা (৩৩ শতাংশ)", en: "Bigha (33 Decimals)" },
  unitAcre: { bn: "একর (১০০ শতাংশ)", en: "Acre (100 Decimals)" },
  candidateCrop: { bn: "বিবেচ্য ফসল", en: "Candidate Crop" },
  productionCost: { bn: "মোট উৎপাদন ব্যয়", en: "Total Production Cost" },
  grossRevenue: { bn: "আনুমানিক মোট বিক্রয়মূল্য", en: "Expected Gross Revenue" },
  netProfit: { bn: "আনুমানিক নিট লাভ", en: "Estimated Net Profit" },
  profitPerBigha: { bn: "বিঘা প্রতি আনুমানিক লাভ", en: "Profit per Bigha" },
  profitPerDecimal: { bn: "শতাংশ প্রতি লাভ", en: "Profit per Decimal" },
  breakEvenPrice: { bn: "ব্রেক-ইভেন দর (কেজি প্রতি)", en: "Break-even Price (per Kg)" },
  calculateBtn: { bn: "লাভ-ক্ষতির হিসাব দেখুন", en: "Calculate Profit & Loss" },
  compareCropsBtn: { bn: "পাশাপাশি তুলনা করুন", en: "Side-by-Side Crop Comparison" },

  // Admin & Meta
  lastUpdated: { bn: "সর্বশেষ আপডেট", en: "Last Updated" },
  dataSource: { bn: "উপাত্তের উৎস", en: "Data Source" },
  disclaimer: { bn: "সতর্কবার্তা ও সীমাবদ্ধতা", en: "Disclaimer & Limitations" }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("abhawa_language") as Language) || "bn";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("abhawa_language", lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === "bn" ? "en" : "bn");
  };

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["bn"] || key;
  };

  const toBengaliNumber = (num: number | string): string => {
    if (language === "en") return String(num);
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(num).replace(/[0-9]/g, digit => bengaliDigits[parseInt(digit, 10)]);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, toBengaliNumber }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

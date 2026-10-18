import { WeatherResponse } from "./weatherService.js";
import { CROPS_DATABASE, CropData } from "../data/cropDatabase.js";

export interface FarmingAlert {
  id: string;
  severity: "critical" | "warning" | "advisory" | "good_news";
  severityBn: "জরুরি সতর্কতা" | "সতর্কবার্তা" | "কৃষি পরামর্শ" | "অনুকূল সংবাদ";
  titleBn: string;
  titleEn: string;
  timeWindowBn: string;
  relevantCropsBn: string[];
  affectedActivityBn: string;
  reasonBn: string;
  actionStepBn: string;
  sourceAuthority: string;
  confidence: "high" | "medium" | "low";
}

export function generateFarmingAlerts(
  weather: WeatherResponse,
  selectedCropId?: string
): FarmingAlert[] {
  const alerts: FarmingAlert[] = [];
  const currentTemp = weather.current.temp;
  const maxTemp3d = Math.max(...weather.daily7d.slice(0, 3).map(d => d.maxTemp));
  const minTemp3d = Math.min(...weather.daily7d.slice(0, 3).map(d => d.minTemp));
  const maxRainProb3d = Math.max(...weather.daily7d.slice(0, 3).map(d => d.rainProbMax));
  const totalRainMm3d = weather.daily7d.slice(0, 3).reduce((sum, d) => sum + d.precipitationSumMm, 0);
  const maxWindKmh = Math.max(...weather.daily7d.slice(0, 3).map(d => d.windSpeedMaxKmh));
  const hasThunderstorm = weather.daily7d.slice(0, 3).some(d => d.icon.includes("lightning"));

  // 1. বজ্রপাত ও কালবৈশাখী জরুরি সতর্কতা (Critical Alert)
  if (hasThunderstorm || weather.current.condition.isThunder) {
    alerts.push({
      id: "alert_thunderstorm",
      severity: "critical",
      severityBn: "জরুরি সতর্কতা",
      titleBn: "বজ্রঝড় ও বজ্রপাতের তীব্র ঝুঁকি",
      titleEn: "Thunderstorm & Lightning Hazard Alert",
      timeWindowBn: "পরবর্তী ২৪-৪৮ ঘণ্টার মধ্যে",
      relevantCropsBn: ["সকল প্রকার মাঠ ফসল ও কৃষক ভাইদের জীবন নিরাপত্তা"],
      affectedActivityBn: "মাঠে অবস্থান, সেচ পাম্প পরিচালনা, ফসল কর্তন",
      reasonBn: "বাতাসে অস্থিরতা ও গভীর সঞ্চারণশীল মেঘের কারণে বজ্রসহ বৃষ্টি ও দমকা হাওয়া বয়ে যেতে পারে।",
      actionStepBn: "মেঘের গর্জন বা বিজলি চমকালে খোলা মাঠে থাকবেন না। বৈদ্যুতিক ও সেচ পাম্পের তার স্পর্শ করবেন না। অবিলম্বে নিরাপদ পাকা দালানে আশ্রয় নিন।",
      sourceAuthority: "বাংলাদেশ আবহাওয়া অধিদপ্তর (BMD) ও কৃষি আবহাওয়া তথ্য সেবা (BAMIS)",
      confidence: "high"
    });
  }

  // 2. ভারী বর্ষণ ও জলাবদ্ধতার ঝুঁকি (Heavy Rain Risk)
  if (maxRainProb3d >= 60 || totalRainMm3d >= 20) {
    alerts.push({
      id: "alert_heavy_rain",
      severity: "warning",
      severityBn: "সতর্কবার্তা",
      titleBn: "ভারী বৃষ্টির পূর্বাভাস: সার ও সেচ স্থগিত রাখুন",
      titleEn: "Heavy Rain Expected: Defer Fertilizer & Irrigation",
      timeWindowBn: "পরবর্তী ২-৩ দিন",
      relevantCropsBn: ["বোরো ধান", "সবজি", "আলু", "ভুট্টা"],
      affectedActivityBn: "ইউরিয়া সার ছিটানো, সেচ প্রয়োগ, ফসল শুকানো ও মাঠে কর্তন",
      reasonBn: `পরবর্তী ৩ দিনে মোট প্রায় ${Math.round(totalRainMm3d)} মিমি বৃষ্টিপাত হতে পারে। বৃষ্টির পূর্বে সার দিলে তা পানিতে ধুয়ে সম্পূর্ণ অপচয় হবে।`,
      actionStepBn: "জমিতে নতুন করে সার বা সেচ দেবেন না। শাকসবজি ও আলুর ক্ষেতে যাতে পানি না জমে সেজন্য ড্রেনের মুখ পরিষ্কার রাখুন। শুকানো শস্য পলিথিন দিয়ে ঢেকে রাখুন।",
      sourceAuthority: "কৃষি সম্প্রসারণ অধিদপ্তর (DAE)",
      confidence: "high"
    });
  }

  // 3. তীব্র তাপপ্রবাহ ও হিট শক ঝুঁকি (Heat Stress)
  if (maxTemp3d >= 35) {
    alerts.push({
      id: "alert_heat_stress",
      severity: "warning",
      severityBn: "সতর্কবার্তা",
      titleBn: "তীব্র তাপমাত্রা ও হিট শকের আশঙ্কা",
      titleEn: "High Heat & Crop Stress Warning",
      timeWindowBn: "দুপুর ১২:০০ থেকে বিকাল ০৪:০০",
      relevantCropsBn: ["বোরো ধান (ফুল ফোটার স্তর)", "গ্রীষ্মকালীন সবজি", "ভুট্টা"],
      affectedActivityBn: "সেচ প্রয়োগ, পরাগায়ন",
      reasonBn: `সর্বোচ্চ তাপমাত্রা ${maxTemp3d}°সে অতিক্রম করতে পারে। ফুল ফোটার সময় অতিরিক্ত গরমে ধানের শীষে চিটা দেখা দিতে পারে।`,
      actionStepBn: "ধানের জমিতে কমপক্ষে ২ ইঞ্চি পানি ধরে রাখুন যাতে শিকড়ের তাপমাত্রা কম থাকে। সকালে বা বিকেলে হালকা সেচ দিন।",
      sourceAuthority: "বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI)",
      confidence: "high"
    });
  }

  // 4. কুয়াশা, স্যাঁতসেঁতে আবহাওয়া ও ফসল সুরক্ষা (High Humidity & Fog Care)
  if (weather.current.humidity >= 80 && minTemp3d <= 16) {
    alerts.push({
      id: "alert_blight_blast",
      severity: "warning",
      severityBn: "সতর্কবার্তা",
      titleBn: "কুয়াশাচ্ছন্ন আবহাওয়া: ক্ষেত পর্যবেক্ষণ ও সুরক্ষা সতর্কতা",
      titleEn: "Crop Monitoring Notice in High Humidity & Fog",
      timeWindowBn: "ভোর ও সকাল বেলা",
      relevantCropsBn: ["আলু", "বোরো ধান", "সরিষা", "পেঁয়াজ"],
      affectedActivityBn: "ক্ষেত পর্যবেক্ষণ ও পানি নিষ্কাশন নিশ্চিতকরণ",
      reasonBn: "উচ্চ আপেক্ষিক আর্দ্রতা (>৮০%) এবং ঠান্ডা রাতের কারণে রোগবালাইয়ের বিস্তার সহজ হয়।",
      actionStepBn: "আলু ও পেঁয়াজ ক্ষেতে নিয়মিত পর্যবেক্ষণ রাখুন এবং ক্ষেতে পানি জমতে দেবেন না। কোনো অস্বাভাবিক দাগ বা লক্ষণ দেখা দিলে সঠিক নির্দেশনার জন্য নিকটস্থ উপসহকারী কৃষি কর্মকর্তার পরামর্শ নিন।",
      sourceAuthority: "বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট (BARI)",
      confidence: "medium"
    });
  }

  // 5. অনুকূল আবহাওয়া ও সেচ/ফসল তোলার সুযোগ (Good Weather Window)
  if (maxRainProb3d < 25 && totalRainMm3d < 2 && maxTemp3d < 34) {
    alerts.push({
      id: "alert_good_weather",
      severity: "good_news",
      severityBn: "অনুকূল সংবাদ",
      titleBn: "ফসল তোলা ও পরিচর্যার চমৎকার সুযোগ",
      titleEn: "Favorable Weather for Fieldwork & Harvesting",
      timeWindowBn: "পরবর্তী ৪-৫ দিন",
      relevantCropsBn: ["সরিষা", "মসুর ডাল", "গম", "শাকসবজি"],
      affectedActivityBn: "ফসল কর্তন, মাড়াই, রোদে শুকানো, আগাছা দমন",
      reasonBn: "আবহাওয়া শুষ্ক ও রোদযুক্ত থাকবে, বৃষ্টির কোনো উল্লেখযোগ্য ঝুঁকি নেই।",
      actionStepBn: "পাকা ফসল দ্রুত কেটে রোদে শুকিয়ে গুদামজাত করুন। ফসলে নিড়ানি দেওয়া ও সুষম সার প্রয়োগের জন্য এটি সবচেয়ে উৎকৃষ্ট সময়।",
      sourceAuthority: "কৃষি আবহাওয়া তথ্য সেবা (BAMIS)",
      confidence: "high"
    });
  }

  // 6. খরা ও সেচ পরামর্শ (Drought Stress)
  if (maxRainProb3d < 20 && totalRainMm3d === 0 && currentTemp >= 27) {
    alerts.push({
      id: "alert_irrigation_need",
      severity: "advisory",
      severityBn: "কৃষি পরামর্শ",
      titleBn: "শুষ্ক আবহাওয়ায় পরিমিত সেচ প্রয়োগের পরামর্শ",
      titleEn: "Irrigation Advisory for Dry Conditions",
      timeWindowBn: "সকাল বা গোধূলি লগ্নে",
      relevantCropsBn: ["ভুট্টা", "গম", "বোরো ধান", "ফলদ বাগান"],
      affectedActivityBn: "সেচ প্রদান",
      reasonBn: "মাটির আর্দ্রতা কমে যাচ্ছে এবং বাষ্পীভবনের হার বৃদ্ধি পাচ্ছে।",
      actionStepBn: "ভুট্টার মোচা আসার সময় ও গমের শীষ আসার সময় জমিতে যেন রসের ঘাটতি না হয় সেদিকে লক্ষ্য রাখুন। ড্রেন দিয়ে নিয়ন্ত্রিত সেচ দিন।",
      sourceAuthority: "কৃষি সম্প্রসারণ অধিদপ্তর (DAE)",
      confidence: "high"
    });
  }

  // Filter if user specifically selected a crop
  if (selectedCropId) {
    const crop = CROPS_DATABASE.find(c => c.id === selectedCropId);
    if (crop) {
      return alerts.filter(a =>
        a.relevantCropsBn.some(rc => rc.includes(crop.bnName) || rc.includes("সকল"))
      );
    }
  }

  return alerts;
}

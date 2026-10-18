import { CROPS_DATABASE, CropData } from "../data/cropDatabase.js";
import { DISTRICTS, District } from "../data/bangladeshLocations.js";

export interface CropRecommendationItem {
  crop: CropData;
  isPrimaryForDistrict: boolean;
  sowingStatus: "active" | "upcoming" | "past";
  sowingStatusBn: string;
  seasonMatch: boolean;
  suitabilityScore: number; // 0-100
  suitabilityLevelBn: "অত্যন্ত উপযুক্ত" | "উপযুক্ত" | "সতর্কতামূলক";
  reasonBn: string;
  recommendedVarietiesBn: string[];
}

export function getCropRecommendations(
  districtId: string,
  targetMonth?: number
): {
  district: District;
  targetMonth: number;
  monthNameBn: string;
  seasonBn: string;
  recommendations: CropRecommendationItem[];
} {
  const district = DISTRICTS.find(d => d.id === districtId) || DISTRICTS[0];
  const month = targetMonth && targetMonth >= 1 && targetMonth <= 12 ? targetMonth : (new Date().getMonth() + 1);

  const banglaMonthsNames = [
    "জানুয়ারি (পৌষ-মাঘ)",
    "ফেব্রুয়ারি (মাঘ-ফাল্গুন)",
    "মার্চ (ফাল্গুন-চৈত্র)",
    "এপ্রিল (চৈত্র-বৈশাখ)",
    "মে (বৈশাখ-জ্যৈষ্ঠ)",
    "জুন (জ্যৈষ্ঠ-আষাঢ়)",
    "জুলাই (আষাঢ়-শ্রাবণ)",
    "আগস্ট (শ্রাবণ-ভাদ্র)",
    "সেপ্টেম্বর (ভাদ্র-আশ্বিন)",
    "অক্টোবর (আশ্বিন-কার্তিক)",
    "নভেম্বর (কার্তিক-অগ্রহায়ণ)",
    "ডিসেম্বর (অগ্রহায়ণ-পৌষ)"
  ];

  let currentSeasonBn = "রবি মৌসুম";
  if (month >= 3 && month <= 6) {
    currentSeasonBn = "খরিফ-১ মৌসুম (প্রাক-বর্ষা)";
  } else if (month >= 7 && month <= 10) {
    currentSeasonBn = "খরিফ-২ মৌসুম (বর্ষা ও শরৎ)";
  } else {
    currentSeasonBn = "রবি মৌসুম (শীতকালীন)";
  }

  const recommendations: CropRecommendationItem[] = CROPS_DATABASE.map(crop => {
    const isPrimary = district.primaryCrops.some(pc => pc.includes(crop.id) || crop.id.includes(pc));

    // Check window
    let sowingStatus: "active" | "upcoming" | "past" = "past";
    let sowingStatusBn = "বপনের সময় অতিক্রান্ত";
    let score = 50;

    const start = crop.sowingWindowStartMonth;
    const end = crop.sowingWindowEndMonth;

    const isInsideWindow =
      start <= end
        ? month >= start && month <= end
        : month >= start || month <= end;

    const nextMonth = month === 12 ? 1 : month + 1;
    const isUpcoming =
      start <= end
        ? nextMonth >= start && nextMonth <= end
        : nextMonth >= start || nextMonth <= end;

    if (isInsideWindow) {
      sowingStatus = "active";
      sowingStatusBn = "এখনই বপন ও রোপণের সর্বোত্তম সময়";
      score += 35;
    } else if (isUpcoming) {
      sowingStatus = "upcoming";
      sowingStatusBn = "শীঘ্রই শুরু হবে (জমি তৈরির প্রস্তুতি নিন)";
      score += 20;
    } else {
      sowingStatus = "past";
      sowingStatusBn = "সাধারণ বপনকাল শেষ (পরবর্তী মৌসুমের জন্য রাখুন)";
      score -= 20;
    }

    if (isPrimary) {
      score += 20;
    }

    score = Math.max(10, Math.min(100, score));

    let suitabilityLevelBn: "অত্যন্ত উপযুক্ত" | "উপযুক্ত" | "সতর্কতামূলক" = "উপযুক্ত";
    if (score >= 80) suitabilityLevelBn = "অত্যন্ত উপযুক্ত";
    else if (score < 55) suitabilityLevelBn = "সতর্কতামূলক";

    let reasonBn = `${district.bnName} জেলার আবহাওয়া ও মাটিতে এই মৌসুমে ${crop.bnName} চাষের বিশেষ সম্ভাবনা রয়েছে।`;
    if (isPrimary && isInsideWindow) {
      reasonBn = `${district.bnName} জেলার জন্য এটি অত্যন্ত সুপারিশকৃত প্রধান ফসল এবং বর্তমানে সঠিক বপনকাল চলছে।`;
    } else if (isUpcoming) {
      reasonBn = `সামনে ${crop.bnName} এর বপনকাল আসছে। আগাম বীজ সংগ্রহ ও জমি প্রস্তুত করে রাখুন।`;
    } else if (sowingStatus === "past") {
      reasonBn = `এই মুহূর্তে নতুন করে বপন করলে কাঙ্ক্ষিত ফলন না পাওয়ার ঝুঁকি রয়েছে।`;
    }

    return {
      crop,
      isPrimaryForDistrict: isPrimary,
      sowingStatus,
      sowingStatusBn,
      seasonMatch: isInsideWindow || isUpcoming,
      suitabilityScore: score,
      suitabilityLevelBn,
      reasonBn,
      recommendedVarietiesBn: crop.varieties.map(v => `${v.bnName} (${v.source})`),
    };
  });

  // Sort by suitability score descending
  recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  return {
    district,
    targetMonth: month,
    monthNameBn: banglaMonthsNames[month - 1],
    seasonBn: currentSeasonBn,
    recommendations
  };
}

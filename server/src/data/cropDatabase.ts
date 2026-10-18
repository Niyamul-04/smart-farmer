export interface CropVariety {
  name: string;
  bnName: string;
  source: string; // BRRI, BARI, BINA etc.
  durationDays: number;
  yieldPerDecimalKg: number; // e.g. 25-30 kg per decimal
  yieldPerBighaMaund: number; // 1 bigha = 33 decimal
  characteristicsBn: string;
  specialTraitBn: string;
}

export interface CropCostBenchmark {
  seedCostPerDecimal: number; // BDT
  fertilizerCostPerDecimal: number;
  pesticideCostPerDecimal: number;
  laborCostPerDecimal: number;
  irrigationCostPerDecimal: number;
  landPrepCostPerDecimal: number;
  transportOtherCostPerDecimal: number;
  avgExpectedYieldPerDecimalKg: number;
  avgSellingPricePerKg: number; // BDT
}

export interface CropData {
  id: string;
  name: string;
  bnName: string;
  category: "cereal" | "oilseed" | "pulse" | "vegetable" | "cash_crop" | "fruit";
  categoryBn: string;
  season: "rabi" | "kharif_1" | "kharif_2" | "year_round";
  seasonBn: string;
  bengaliMonths: string;
  sowingWindowStartMonth: number; // 1-12
  sowingWindowEndMonth: number; // 1-12
  harvestWindowStartMonth: number;
  harvestWindowEndMonth: number;
  durationDaysRange: [number, number];
  waterRequirementBn: string;
  soilSuitabilityBn: string;
  landPreparationBn: string;
  weatherRisksBn: string[];
  preventiveMeasuresBn: string[];
  advisoryThresholds: {
    maxTempAlert?: number; // °C
    minTempAlert?: number; // °C
    heavyRainRisk?: boolean; // sensitive to rainfall
    droughtSensitive?: boolean;
    highHumidityRisk?: boolean; // fungal risk
  };
  varieties: CropVariety[];
  benchmarkCost: CropCostBenchmark;
  sourceAuthority: string;
  sourceUrl: string;
  lastVerifiedDate: string;
  imageUrl: string;
}

export const CROPS_DATABASE: CropData[] = [
  // 1. বোরো ধান (Boro Rice)
  {
    id: "boro_rice",
    name: "Boro Rice",
    bnName: "বোরো ধান",
    category: "cereal",
    categoryBn: "দানা শস্য",
    season: "rabi",
    seasonBn: "রবি মৌসুম",
    bengaliMonths: "কার্তিক - বৈশাখ (নভেম্বর - মে)",
    sowingWindowStartMonth: 11,
    sowingWindowEndMonth: 1,
    harvestWindowStartMonth: 4,
    harvestWindowEndMonth: 5,
    durationDaysRange: [140, 160],
    waterRequirementBn: "উচ্চ সেচ নির্ভর। চারার বৃদ্ধি ও থোড় আসা অবস্থায় জমিতে ২-৩ ইঞ্চি পানি ধরে রাখা প্রয়োজন।",
    soilSuitabilityBn: "পলি দোআঁশ ও এঁটেল দোআঁশ মাটি।",
    landPreparationBn: "জমি ৩-৪ বার আড়াআড়ি চাষ ও মই দিয়ে থকথকে কাদা তৈরি করতে হবে।",
    weatherRisksBn: [
      "বীজতলায় শৈত্যপ্রবাহ (<১০°সে) হলে চারা হলুদ ও ঠান্ডা জনিত ক্ষতি (Cold Injury) হয়।",
      "ফুল ফোটার সময় তাপমাত্রা ৩৫°সে এর বেশি হলে ধান চিটা হয়ে যায় (Heat Shock)।",
      "মেঘলা আকাশ ও আর্দ্র আবহাওয়ায় নেক ব্লাস্ট (Neck Blast) রোগের প্রাদুর্ভাব ঘটে।",
      "হাওর অঞ্চলে বৈশাখ মাসে আগাম পাহাড়ি ঢল ও কালবৈশাখী ঝড়ের ঝুঁকি।"
    ],
    preventiveMeasuresBn: [
      "শৈত্যপ্রবাহের সময় রাতে বীজতলা স্বচ্ছ পলিথিন দিয়ে ঢেকে রাখুন এবং সকালে তুলে দিন।",
      "ব্লাস্ট রোগ প্রতিরোধে ট্রাইসাইক্লাজোল বা ট্রোপিকোনাজল অনুমোদিত মাত্রায় স্প্রে করুন।",
      "হাওরে আগাম বন্যা ঝুঁকি এড়াতে ব্রি ধান২৮ এর পরিবর্তে স্বল্পমেয়াদী ব্রি ধান৮৮ বা ব্রি ধান৯৬ চাষ করুন।"
    ],
    advisoryThresholds: {
      maxTempAlert: 35,
      minTempAlert: 12,
      heavyRainRisk: true,
      droughtSensitive: true,
      highHumidityRisk: true
    },
    varieties: [
      {
        name: "BRRI dhan29",
        bnName: "ব্রি ধান২৯",
        source: "বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI)",
        durationDays: 160,
        yieldPerDecimalKg: 30,
        yieldPerBighaMaund: 25,
        characteristicsBn: "সর্বাধিক ফলনশীল মেগা জাত, চাল মাঝারি মোটা ও সুস্বাদু।",
        specialTraitBn: "সেচ সুবিধা সম্পন্ন এলাকায় সর্বোচ্চ ফলন দেয়।"
      },
      {
        name: "BRRI dhan89",
        bnName: "ব্রি ধান৮৯",
        source: "BRRI",
        durationDays: 155,
        yieldPerDecimalKg: 33,
        yieldPerBighaMaund: 27,
        characteristicsBn: "ব্রি ধান২৯ এর বিকল্প উচ্চফলনশীল জাত, কাণ্ড শক্ত হওয়ায় সহজে হেলে পড়ে না।",
        specialTraitBn: "প্রতি বিঘায় ২-৩ মণ বেশি ফলন দেয়।"
      },
      {
        name: "BRRI dhan88",
        bnName: "ব্রি ধান৮৮",
        source: "BRRI",
        durationDays: 142,
        yieldPerDecimalKg: 28,
        yieldPerBighaMaund: 23,
        characteristicsBn: "স্বল্পমেয়াদী আগাম জাত, ব্রি ধান২৮ এর আদর্শ বিকল্প।",
        specialTraitBn: "হাওর অঞ্চলে আগাম বন্যার হাত থেকে রক্ষা পাওয়ার জন্য আদর্শ।"
      },
      {
        name: "BRRI dhan50 (Banglamati)",
        bnName: "ব্রি ধান৫০ (বাংলামতি)",
        source: "BRRI",
        durationDays: 155,
        yieldPerDecimalKg: 26,
        yieldPerBighaMaund: 21,
        characteristicsBn: "বাসমতীর মতো লম্বা ও সুগন্ধি প্রিমিয়াম চাল।",
        specialTraitBn: "বাজারে সাধারণ ধানের চেয়ে প্রায় দ্বিগুণ দামে বিক্রি হয়।"
      }
    ],
    benchmarkCost: {
      seedCostPerDecimal: 80,
      fertilizerCostPerDecimal: 220,
      pesticideCostPerDecimal: 120,
      laborCostPerDecimal: 350,
      irrigationCostPerDecimal: 250,
      landPrepCostPerDecimal: 120,
      transportOtherCostPerDecimal: 80,
      avgExpectedYieldPerDecimalKg: 30,
      avgSellingPricePerKg: 32
    },
    sourceAuthority: "বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI) ও BAMIS",
    sourceUrl: "https://brri.gov.bd",
    lastVerifiedDate: "২০২৬-০১-১৫",
    imageUrl: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80"
  },

  // 2. রোপা আমন ধান (Ropa Aman Rice)
  {
    id: "aman_rice",
    name: "T. Aman Rice",
    bnName: "রোপা আমন ধান",
    category: "cereal",
    categoryBn: "দানা শস্য",
    season: "kharif_2",
    seasonBn: "খরিফ-২ মৌসুম",
    bengaliMonths: "আষাঢ় - অগ্রহায়ণ (জুলাই - ডিসেম্বর)",
    sowingWindowStartMonth: 6,
    sowingWindowEndMonth: 8,
    harvestWindowStartMonth: 11,
    harvestWindowEndMonth: 12,
    durationDaysRange: [120, 145],
    waterRequirementBn: "প্রধানত বৃষ্টি নির্ভর। তবে গাছে থোড় আসার সময় খরা দেখা দিলে সম্পূরক সেচ জরুরি।",
    soilSuitabilityBn: "মাঝারি উঁচু ও মাঝারি নিচু জমির এঁটেল বা এঁটেল দোআঁশ মাটি।",
    landPreparationBn: "বৃষ্টির পানিতে জমি ৩-৪ বার চাষ ও মই দিয়ে উত্তম কাদা করে চারা রোপণ করতে হয়।",
    weatherRisksBn: [
      "রোপণের পর আকস্মিক বন্যায় চারা ডুবে পচে যাওয়ার ঝুঁকি।",
      "শরতের খরায় (Drought Stress) ফলন বিপর্যয়ের শঙ্কা।",
      "কার্তিক মাসে নিম্নচাপ ও সামুদ্রিক ঘূর্ণিঝড়ের বৃষ্টিতে পাকা ধান হেলে পড়ার ঝুঁকি।"
    ],
    preventiveMeasuresBn: [
      "বন্যাপ্রবণ বা নিচু এলাকায় জলমগ্নতা সহনশীল জাত (ব্রি ধান৫১ বা ব্রি ধান৫২) রোপণ করুন যা ২ সপ্তাহ পানির নিচে বেঁচে থাকে।",
      "উপকূলীয় লবণাক্ত অঞ্চলে ব্রি ধান৭৩ বা ব্রি ধান৭৮ চাষ করুন।",
      "ধান পাকার ৮০% হলুদ হলে দ্রুত কর্তন ও মাড়াই সম্পন্ন করুন।"
    ],
    advisoryThresholds: {
      maxTempAlert: 36,
      heavyRainRisk: true,
      droughtSensitive: true,
      highHumidityRisk: true
    },
    varieties: [
      {
        name: "BRRI dhan49",
        bnName: "ব্রি ধান৪৯",
        source: "BRRI",
        durationDays: 135,
        yieldPerDecimalKg: 24,
        yieldPerBighaMaund: 20,
        characteristicsBn: "জনপ্রিয় আমন জাত, মাঝারি সরু চাল ও সুস্বাদু ভাত।",
        specialTraitBn: "খরা ও মাঝারি রোগবালাই সহনশীল।"
      },
      {
        name: "BRRI dhan87",
        bnName: "ব্রি ধান৮৭",
        source: "BRRI",
        durationDays: 127,
        yieldPerDecimalKg: 28,
        yieldPerBighaMaund: 23,
        characteristicsBn: "উচ্চফলনশীল আগাম আমন জাত, কাণ্ড শক্ত।",
        specialTraitBn: "ব্রি ধান৪৯ এর চেয়ে ৭ দিন আগে পাকে এবং ফলন প্রায় ১৫% বেশি।"
      },
      {
        name: "BRRI dhan51 (Submergence Tolerant)",
        bnName: "ব্রি ধান৫১ (জলমগ্নতা সহনশীল)",
        source: "BRRI",
        durationDays: 142,
        yieldPerDecimalKg: 22,
        yieldPerBighaMaund: 18,
        characteristicsBn: "আকস্মিক বন্যায় ১০-১৫ দিন সম্পূর্ণ পানির নিচে ডুবে থাকলেও নষ্ট হয় না।",
        specialTraitBn: "বন্যাপ্রবণ চরাঞ্চল ও প্লাবনভূমির জন্য মহৌষধ।"
      }
    ],
    benchmarkCost: {
      seedCostPerDecimal: 60,
      fertilizerCostPerDecimal: 160,
      pesticideCostPerDecimal: 100,
      laborCostPerDecimal: 300,
      irrigationCostPerDecimal: 80,
      landPrepCostPerDecimal: 110,
      transportOtherCostPerDecimal: 70,
      avgExpectedYieldPerDecimalKg: 25,
      avgSellingPricePerKg: 30
    },
    sourceAuthority: "বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI)",
    sourceUrl: "https://brri.gov.bd",
    lastVerifiedDate: "২০২৬-০২-০১",
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80"
  },

  // 3. আউশ ধান (Aus Rice)
  {
    id: "aus_rice",
    name: "Aus Rice",
    bnName: "আউশ ধান",
    category: "cereal",
    categoryBn: "দানা শস্য",
    season: "kharif_1",
    seasonBn: "খরিফ-১ মৌসুম",
    bengaliMonths: "চৈত্র - শ্রাবণ (মার্চ - আগস্ট)",
    sowingWindowStartMonth: 3,
    sowingWindowEndMonth: 4,
    harvestWindowStartMonth: 7,
    harvestWindowEndMonth: 8,
    durationDaysRange: [100, 115],
    waterRequirementBn: "স্বল্প পানি নির্ভর। প্রাক-বর্ষার মৌসুমি বৃষ্টিতেই বেশিরভাগ সময় চাষ সম্পন্ন হয়।",
    soilSuitabilityBn: "বেলে দোআঁশ থেকে এঁটেল দোআঁশ মাটি।",
    landPreparationBn: "২-৩ বার চাষ ও মই দিয়ে সরাসরি বীজ বপন অথবা কম বয়সী চারা রোপণ করা হয়।",
    weatherRisksBn: [
      "বপনের সময় প্রারম্ভিক খরা ও অনাবৃষ্টি।",
      "কাটার সময় আষাঢ়-শ্রাবণের অবিরাম ভারী বর্ষণে ধান নষ্ট হওয়া।"
    ],
    preventiveMeasuresBn: [
      "খরা সহনশীল স্বল্পমেয়াদী জাত ব্রি ধান৪৮ নির্বাচন করুন।",
      "বর্ষার আগেই ফসল ঘরে তুলতে মার্চের শেষ সপ্তাহে বপন শেষ করুন।"
    ],
    advisoryThresholds: {
      droughtSensitive: true,
      heavyRainRisk: true
    },
    varieties: [
      {
        name: "BRRI dhan48",
        bnName: "ব্রি ধান৪৮",
        source: "BRRI",
        durationDays: 105,
        yieldPerDecimalKg: 22,
        yieldPerBighaMaund: 18,
        characteristicsBn: "উচ্চফলনশীল আউশ জাত, খরা সহনশীল ও সুস্বাদু চাল।",
        specialTraitBn: "স্বল্প সময়ে ধান কাটার পর সহজে আমন আবাদ করা যায়।"
      },
      {
        name: "BRRI dhan98",
        bnName: "ব্রি ধান৯৮",
        source: "BRRI",
        durationDays: 112,
        yieldPerDecimalKg: 24,
        yieldPerBighaMaund: 20,
        characteristicsBn: "দানাদার ও পুষ্টিকর চাল, পোকার আক্রমণ তুলনামূলক কম।",
        specialTraitBn: "আউশ মৌসুমে সর্বোচ্চ ফলন প্রদানকারী নতুন জাত।"
      }
    ],
    benchmarkCost: {
      seedCostPerDecimal: 50,
      fertilizerCostPerDecimal: 140,
      pesticideCostPerDecimal: 80,
      laborCostPerDecimal: 250,
      irrigationCostPerDecimal: 60,
      landPrepCostPerDecimal: 100,
      transportOtherCostPerDecimal: 60,
      avgExpectedYieldPerDecimalKg: 22,
      avgSellingPricePerKg: 30
    },
    sourceAuthority: "BRRI ও কৃষি সম্প্রসারণ অধিদপ্তর (DAE)",
    sourceUrl: "https://dae.gov.bd",
    lastVerifiedDate: "২০২৬-০১-২০",
    imageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80"
  },

  // 4. গম (Wheat)
  {
    id: "wheat",
    name: "Wheat",
    bnName: "গম",
    category: "cereal",
    categoryBn: "দানা শস্য",
    season: "rabi",
    seasonBn: "রবি মৌসুম",
    bengaliMonths: "কার্তিক - ফাল্গুন (নভেম্বর - মার্চ)",
    sowingWindowStartMonth: 11,
    sowingWindowEndMonth: 12,
    harvestWindowStartMonth: 3,
    harvestWindowEndMonth: 4,
    durationDaysRange: [100, 115],
    waterRequirementBn: "মাঝারি পানি নির্ভর। বৃদ্ধির সময় মোট ২-৩টি হালকা সেচ প্রয়োজন (মুকা বের হওয়া, শীষ আসা ও দানা পুষ্ট হওয়া অবস্থায়)।",
    soilSuitabilityBn: "উঁচু ও মাঝারি উঁচু সুনিষ্কাশিত দোআঁশ ও বেলে-দোআঁশ মাটি।",
    landPreparationBn: "জমি গভীরভাবে ৩-৪ বার চাষ ও মই দিয়ে ঝুরঝুরে ও সমান করতে হবে।",
    weatherRisksBn: [
      "গম ব্লাস্ট রোগ (Wheat Blast) মেঘলা ও আর্দ্র উষ্ণ আবহাওয়ায় মহামারী আকার ধারণ করতে পারে।",
      "দানা ভরার সময় (ফেব্রুয়ারি-মার্চ) তাপমাত্রা ২৮°সে এর বেশি হলে দানা অপুষ্ট ও পাতলা হয়ে যায় (Terminal Heat Stress)।"
    ],
    preventiveMeasuresBn: [
      "অবশ্যই ব্লাস্ট প্রতিরোধী জাত যেমন 'বারি গম ৩৩' (জিংক সমৃদ্ধ) আবাদ করুন।",
      "১৫-৩০ নভেম্বরের মধ্যে বীজ বপন সম্পন্ন করলে প্রান্তিক তাপমাত্রার ক্ষতি এড়ানো যায়।"
    ],
    advisoryThresholds: {
      maxTempAlert: 28,
      highHumidityRisk: true,
      heavyRainRisk: true
    },
    varieties: [
      {
        name: "BARI Gom-33 (Biofortified)",
        bnName: "বারি গম-৩৩ (জিংক সমৃদ্ধ)",
        source: "বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট (BARI)",
        durationDays: 110,
        yieldPerDecimalKg: 18,
        yieldPerBighaMaund: 15,
        characteristicsBn: "গম ব্লাস্ট রোগ প্রতিরোধী এবং উচ্চ জিংক সমৃদ্ধ জাত।",
        specialTraitBn: "ব্লাস্ট আক্রান্ত এলাকা (মেহেরপুর, চুয়াডাঙ্গা, যশোর)-র জন্য বাধ্যতামূলক সুপারিশকৃত।"
      },
      {
        name: "BARI Gom-30",
        bnName: "বারি গম-৩০",
        source: "BARI",
        durationDays: 105,
        yieldPerDecimalKg: 17,
        yieldPerBighaMaund: 14,
        characteristicsBn: "উচ্চ তাপমাত্রা সহনশীল, নাবি বপনের জন্য উপযোগী।",
        specialTraitBn: "দেরিতে আমন কাটার পর ডিসেম্বরের প্রথম সপ্তাহেও বপন করা যায়।"
      }
    ],
    benchmarkCost: {
      seedCostPerDecimal: 70,
      fertilizerCostPerDecimal: 150,
      pesticideCostPerDecimal: 60,
      laborCostPerDecimal: 220,
      irrigationCostPerDecimal: 100,
      landPrepCostPerDecimal: 110,
      transportOtherCostPerDecimal: 50,
      avgExpectedYieldPerDecimalKg: 18,
      avgSellingPricePerKg: 38
    },
    sourceAuthority: "বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট (BARI)",
    sourceUrl: "https://bari.gov.bd",
    lastVerifiedDate: "২০২৬-০১-১০",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80"
  },

  // 5. ভুট্টা (Maize)
  {
    id: "maize",
    name: "Maize / Corn",
    bnName: "ভুট্টা",
    category: "cereal",
    categoryBn: "দানা শস্য",
    season: "rabi",
    seasonBn: "রবি ও খরিফ মৌসুম",
    bengaliMonths: "কার্তিক - চৈত্র (অক্টোবর - এপ্রিল)",
    sowingWindowStartMonth: 10,
    sowingWindowEndMonth: 12,
    harvestWindowStartMonth: 3,
    harvestWindowEndMonth: 5,
    durationDaysRange: [130, 150],
    waterRequirementBn: "মাঝারি থেকে উচ্চ। জমিতে জলাবদ্ধতা সহ্য করতে পারে না, তবে ৪-৫ বার হালকা সেচ ফলন বহু গুণ বাড়িয়ে দেয়।",
    soilSuitabilityBn: "উঁচু ও সুনিষ্কাশিত বেলে দোআঁশ মাটি। উত্তরবঙ্গ ও চরাঞ্চলে সবচেয়ে ভালো হয়।",
    landPreparationBn: "গভীরভাবে চাষ করে জমিতে কম্পোস্ট সার মিশিয়ে সারি বেঁধে বীজ বুনতে হয়।",
    weatherRisksBn: [
      "জমিতে পানি জমলে চারার মূল পচে নষ্ট হয়ে যায়।",
      "ফল আর্মিওয়ার্ম (Fall Armyworm) পোকার তীব্র আক্রমণ হতে পারে শুষ্ক ও উষ্ণ আবহাওয়ায়।",
      "বৈশাখ মাসের কালবৈশাখী ঝড়ে গাছ হেলে পড়ার ঝুঁকি।"
    ],
    preventiveMeasuresBn: [
      "জমিতে পানি নিষ্কাশনের ড্রেন সর্বদা পরিষ্কার রাখুন।",
      "ফল আর্মিওয়ার্ম দমনে ফেরোমোন ফাঁদ ও জৈব বালাইনাশক ব্যবহার করুন।"
    ],
    advisoryThresholds: {
      heavyRainRisk: true,
      droughtSensitive: true
    },
    varieties: [
      {
        name: "BARI Hybrid Maize-9",
        bnName: "বারি হাইব্রিড ভুট্টা-৯",
        source: "BARI",
        durationDays: 145,
        yieldPerDecimalKg: 45,
        yieldPerBighaMaund: 37,
        characteristicsBn: "উচ্চফলনশীল হাইব্রিড, ভুট্টার মোচা বড় ও দানা শক্ত উজ্জ্বল হলুদ।",
        specialTraitBn: "পোল্ট্রি ও মাছের খাদ্যের জন্য সবচেয়ে চাহিদাসম্পন্ন জাত।"
      },
      {
        name: "NK-40 (Syngenta)",
        bnName: "এনকে-৪০",
        source: "DAE নিবন্ধিত",
        durationDays: 140,
        yieldPerDecimalKg: 48,
        yieldPerBighaMaund: 40,
        characteristicsBn: "বাংলাদেশের কৃষকদের মাঝে সর্বাধিক জনপ্রিয় মেগা হাইব্রিড।",
        specialTraitBn: "খরা সহনশীল এবং অধিক মুনাফাজনক।"
      }
    ],
    benchmarkCost: {
      seedCostPerDecimal: 110,
      fertilizerCostPerDecimal: 260,
      pesticideCostPerDecimal: 110,
      laborCostPerDecimal: 320,
      irrigationCostPerDecimal: 160,
      landPrepCostPerDecimal: 130,
      transportOtherCostPerDecimal: 80,
      avgExpectedYieldPerDecimalKg: 45,
      avgSellingPricePerKg: 28
    },
    sourceAuthority: "BARI ও কৃষি সম্প্রসারণ অধিদপ্তর",
    sourceUrl: "https://bari.gov.bd",
    lastVerifiedDate: "২০২৬-০১-২৫",
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80"
  },

  // 6. আলু (Potato)
  {
    id: "potato",
    name: "Potato",
    bnName: "আলু",
    category: "vegetable",
    categoryBn: "কন্দাল সবজি",
    season: "rabi",
    seasonBn: "রবি মৌসুম",
    bengaliMonths: "কার্তিক - ফাল্গুন (অক্টোবর - ফেব্রুয়ারি)",
    sowingWindowStartMonth: 10,
    sowingWindowEndMonth: 11,
    harvestWindowStartMonth: 1,
    harvestWindowEndMonth: 3,
    durationDaysRange: [85, 100],
    waterRequirementBn: "নিয়মিত পরিমিত সেচ প্রয়োজন। তবে আলু তোলার ১৫ দিন আগে সেচ বন্ধ করতে হবে যাতে ত্বক শক্ত হয়।",
    soilSuitabilityBn: "উঁচু সুনিষ্কাশিত বেলে দোআঁশ মাটি (মুন্সীগঞ্জ, বগুড়া, রংপুর, জয়পুরহাট প্রধান)।",
    landPreparationBn: "মাটি ৫-৬ বার চাষ ও মই দিয়ে অত্যন্ত ঝুরঝুরে করতে হবে। লাইন করে বেড তৈরি করতে হবে।",
    weatherRisksBn: [
      "টানা কুয়াশাচ্ছন্ন স্যাঁতসেঁতে আবহাওয়া (আর্দ্রতা >৯০% এবং তাপমাত্রা ১৫-২২°সে) থাকলে মড়ক বা লেইট ব্লাইট (Late Blight) দ্রুত ছড়িয়ে পড়ে।",
      "অসময়ে বৃষ্টিপাত হলে ক্ষেতে পানি জমে আলু পচে যাওয়ার মারাত্মক ঝুঁকি।"
    ],
    preventiveMeasuresBn: [
      "কুয়াশাচ্ছন্ন আবহাওয়ার পূর্বাভাস পেলেই ম্যানকোজেব গ্রুপের ছত্রাকনাশক প্রতি লিটার পানিতে ২ গ্রাম হারে স্প্রে করুন।",
      "বৃষ্টির পূর্বাভাস থাকলে তাৎক্ষণিক ক্ষেতের নালা কেটে পানি বের করে দেওয়ার ব্যবস্থা রাখুন।"
    ],
    advisoryThresholds: {
      highHumidityRisk: true,
      heavyRainRisk: true,
      maxTempAlert: 28
    },
    varieties: [
      {
        name: "Diamant (BARI Alu-7)",
        bnName: "ডায়মন্ড (বারি আলু-৭)",
        source: "BARI",
        durationDays: 90,
        yieldPerDecimalKg: 100,
        yieldPerBighaMaund: 82,
        characteristicsBn: "সাদা রঙের মসৃণ আলু, ভেতরে হালকা হলুদ। বাংলাদেশের সবচেয়ে জনপ্রিয় জাত।",
        specialTraitBn: "সংরক্ষণ ক্ষমতা বেশি এবং কোল্ড স্টোরেজে গুণমান অক্ষুণ্ণ থাকে।"
      },
      {
        name: "Cardinal (BARI Alu-8)",
        bnName: "কার্ডিনাল (বারি আলু-৮)",
        source: "BARI",
        durationDays: 90,
        yieldPerDecimalKg: 95,
        yieldPerBighaMaund: 78,
        characteristicsBn: "লাল চামড়ার ডিম্বাকৃতির সুন্দর আলু।",
        specialTraitBn: "ভোক্তা ও রান্নার জন্য বাজারে চড়া চাহিদা।"
      },
      {
        name: "Asterix (Red Skin)",
        bnName: "অ্যাস্টেরিক্স (লাল আলু)",
        source: "BARI",
        durationDays: 95,
        yieldPerDecimalKg: 105,
        yieldPerBighaMaund: 86,
        characteristicsBn: "রপ্তানিযোগ্য ও চিপস তৈরির উপযোগী প্রিমিয়াম জাত।",
        specialTraitBn: "ব্লাইট রোগ তুলনামূলক কম হয়।"
      }
    ],
    benchmarkCost: {
      seedCostPerDecimal: 450,
      fertilizerCostPerDecimal: 300,
      pesticideCostPerDecimal: 180,
      laborCostPerDecimal: 400,
      irrigationCostPerDecimal: 120,
      landPrepCostPerDecimal: 160,
      transportOtherCostPerDecimal: 120,
      avgExpectedYieldPerDecimalKg: 100,
      avgSellingPricePerKg: 22
    },
    sourceAuthority: "বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট (BARI কন্দাল ফসল গবেষণা কেন্দ্র)",
    sourceUrl: "https://bari.gov.bd",
    lastVerifiedDate: "২০২৬-০১-১৮",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80"
  },

  // 7. সরিষা (Mustard)
  {
    id: "mustard",
    name: "Mustard",
    bnName: "সরিষা",
    category: "oilseed",
    categoryBn: "তৈলবীজ",
    season: "rabi",
    seasonBn: "রবি মৌসুম",
    bengaliMonths: "কার্তিক - মাঘ (অক্টোবর - জানুয়ারি)",
    sowingWindowStartMonth: 10,
    sowingWindowEndMonth: 11,
    harvestWindowStartMonth: 1,
    harvestWindowEndMonth: 2,
    durationDaysRange: [75, 85],
    waterRequirementBn: "স্বল্প পানি নির্ভর। মাত্র ১-২টি হালকা সেচই পর্যাপ্ত। ফুল ফোটার সময় সেচ দিলে ফলন বাড়ে।",
    soilSuitabilityBn: "বেলে দোআঁশ ও পলি দোআঁশ মাটি। আমন ও বোরোর মধ্যবর্তী অন্তর্বর্তীকালীন ফসল হিসেবে দারুণ উপযোগী।",
    landPreparationBn: "আমন ধান কাটার পরই স্বল্প চাষে বা জিরো টিলেজে বীজ বোনা যায়।",
    weatherRisksBn: [
      "মেঘলা আবহাওয়ায় জাব পোকা (Aphid) এর তীব্র আক্রমণ হতে পারে।",
      "পাকা অবস্থায় শিলাবৃষ্টি হলে সম্পূর্ণ ফসল নষ্ট হওয়ার ঝুঁকি থাকে।"
    ],
    preventiveMeasuresBn: [
      "স্বল্পমেয়াদী জাত 'বারি সরিষা-১৪' বা 'বারি সরিষা-১৭' রোপণ করলে ৭৫-৮০ দিনেই ফসল উঠে যায়।",
      "জাব পোকা দেখা দিলে নিম তেলের মিশ্রণ বা ইমিডাক্লোপ্রিড সঠিক মাত্রায় বিকেলের দিকে স্প্রে করুন।"
    ],
    advisoryThresholds: {
      heavyRainRisk: true,
      highHumidityRisk: true
    },
    varieties: [
      {
        name: "BARI Sarisha-14",
        bnName: "বারি সরিষা-১৪",
        source: "BARI",
        durationDays: 78,
        yieldPerDecimalKg: 6,
        yieldPerBighaMaund: 5,
        characteristicsBn: "স্বল্পমেয়াদী জাত, গাছের উচ্চতা কম, ফলন বেশি এবং তেলে ঝাঁজ চমৎকার।",
        specialTraitBn: "আমন ও বোরোর মাঝে সহজেই বাড়তি লাভজনক আবাদ হিসেবে করা যায়।"
      },
      {
        name: "BARI Sarisha-18 (Canola Quality)",
        bnName: "বারি সরিষা-১৮ (ক্যানোলা জাত)",
        source: "BARI",
        durationDays: 85,
        yieldPerDecimalKg: 8,
        yieldPerBighaMaund: 6.5,
        characteristicsBn: "উচ্চফলনশীল জাত এবং তেলের মান ক্যানোলার মতো স্বাস্থ্যসম্মত।",
        specialTraitBn: "তেলের পরিমাণ প্রায় ৪২-৪৩%।"
      }
    ],
    benchmarkCost: {
      seedCostPerDecimal: 40,
      fertilizerCostPerDecimal: 130,
      pesticideCostPerDecimal: 70,
      laborCostPerDecimal: 180,
      irrigationCostPerDecimal: 60,
      landPrepCostPerDecimal: 90,
      transportOtherCostPerDecimal: 40,
      avgExpectedYieldPerDecimalKg: 7,
      avgSellingPricePerKg: 90
    },
    sourceAuthority: "BARI তৈলবীজ গবেষণা কেন্দ্র",
    sourceUrl: "https://bari.gov.bd",
    lastVerifiedDate: "২০২৬-০১-২২",
    imageUrl: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80"
  },

  // 8. মসুর ও ডাল (Lentils / Pulses)
  {
    id: "lentils",
    name: "Lentils",
    bnName: "মসুর ডাল",
    category: "pulse",
    categoryBn: "ডাল শস্য",
    season: "rabi",
    seasonBn: "রবি মৌসুম",
    bengaliMonths: "কার্তিক - ফাল্গুন (নভেম্বর - মার্চ)",
    sowingWindowStartMonth: 10,
    sowingWindowEndMonth: 11,
    harvestWindowStartMonth: 2,
    harvestWindowEndMonth: 3,
    durationDaysRange: [100, 110],
    waterRequirementBn: "অত্যন্ত কম পানি নির্ভর। জমিতে জো অবস্থায় বীজ বুনলে সাধারণত অতিরিক্ত সেচ লাগে না।",
    soilSuitabilityBn: "মাঝারি উঁচু দোআঁশ ও পলি দোআঁশ মাটি (ফরিদপুর, পাবনা, কুষ্টিয়া, যশোর প্রধান অঞ্চল)।",
    landPreparationBn: "২-৩ বার চাষ ও মই দিয়ে সমান করতে হবে। জমিতে নাইট্রোজেন সংবন্ধন করায় মাটির উর্বরতা বৃদ্ধি করে।",
    weatherRisksBn: [
      "জলাবদ্ধতা একেবারেই সহ্য করতে পারে না, সামান্য পানি জমলেই গাছ হলুদ হয়ে মরে যায়।",
      "টানা মেঘলা থাকলে স্টেমফিলিয়াম ব্লাইট (Stemphylium Blight) রোগের ঝুঁকি বাড়ে।"
    ],
    preventiveMeasuresBn: [
      "ব্লাইট প্রতিরোধী আধুনিক জাত 'বারি মসুর-৮' চাষ করুন।",
      "পানি নিষ্কাশনের জন্য ক্ষেতের চারপাশে নিকাশ নালা রাখুন।"
    ],
    advisoryThresholds: {
      heavyRainRisk: true,
      highHumidityRisk: true
    },
    varieties: [
      {
        name: "BARI Masur-8",
        bnName: "বারি মসুর-৮",
        source: "BARI",
        durationDays: 105,
        yieldPerDecimalKg: 8,
        yieldPerBighaMaund: 6.5,
        characteristicsBn: "মরিচা ও স্টেমফিলিয়াম ব্লাইট রোগ প্রতিরোধী, উচ্চ জিংক ও আয়রন সমৃদ্ধ।",
        specialTraitBn: "ডালের আকৃতি ছোট ও রান্না দ্রুত হয়, বাজারে উচ্চ মূল্য পায়।"
      }
    ],
    benchmarkCost: {
      seedCostPerDecimal: 60,
      fertilizerCostPerDecimal: 100,
      pesticideCostPerDecimal: 60,
      laborCostPerDecimal: 190,
      irrigationCostPerDecimal: 40,
      landPrepCostPerDecimal: 90,
      transportOtherCostPerDecimal: 40,
      avgExpectedYieldPerDecimalKg: 7.5,
      avgSellingPricePerKg: 110
    },
    sourceAuthority: "BARI ডাল গবেষণা কেন্দ্র, ঈশ্বরদী",
    sourceUrl: "https://bari.gov.bd",
    lastVerifiedDate: "২০২৬-০১-১২",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
  },

  // 9. পাট (Jute)
  {
    id: "jute",
    name: "Jute (Golden Fibre)",
    bnName: "পাট (সোনালী আঁশ)",
    category: "cash_crop",
    categoryBn: "অর্থকরী আঁশ শস্য",
    season: "kharif_1",
    seasonBn: "খরিফ-১ মৌসুম",
    bengaliMonths: "চৈত্র - ভাদ্র (মার্চ - আগস্ট)",
    sowingWindowStartMonth: 3,
    sowingWindowEndMonth: 5,
    harvestWindowStartMonth: 7,
    harvestWindowEndMonth: 8,
    durationDaysRange: [110, 125],
    waterRequirementBn: "প্রাথমিক অবস্থায় কম পানি লাগে, তবে জাগ দেওয়ার জন্য (Retting) পরিষ্কার পানির প্রাচুর্য প্রয়োজন।",
    soilSuitabilityBn: "দোআঁশ ও পলি দোআঁশ জমি। নদী তীরবর্তী প্লাবনভূমিতে সোনালী আঁশ সবচেয়ে সুন্দর হয়।",
    landPreparationBn: "মাটি গভীর ও ঝুরঝুরে করে ৪-৫ বার চাষ দিতে হবে যাতে বীজ সমানভাবে অঙ্কুরিত হয়।",
    weatherRisksBn: [
      "বপনের পর প্রারম্ভিক খরা হলে অঙ্কুরোদগম ব্যাহত হয়।",
      "কাটার মৌসুমে খাল-বিলে পানি না থাকলে পাট জাগ দেওয়া কঠিন হয়ে পড়ে (Retting water crisis)।"
    ],
    preventiveMeasuresBn: [
      "উন্নত তোষা পাটের জাত 'ও-৯৮৯৭' বা 'বিজেআরআই তোষা পাট-৮' নির্বাচন করুন।",
      "পানি সংকট হলে রিবন রেটিং (Ribbon Retting) পদ্ধতি গ্রহণ করুন।"
    ],
    advisoryThresholds: {
      droughtSensitive: true
    },
    varieties: [
      {
        name: "BJRI Tosha Pat-8 (Robi-1)",
        bnName: "বিজেআরআই তোষা পাট-৮ (রবি-১)",
        source: "বাংলাদেশ পাট গবেষণা ইনস্টিটিউট (BJRI)",
        durationDays: 115,
        yieldPerDecimalKg: 14,
        yieldPerBighaMaund: 11.5,
        characteristicsBn: "আঁশের রঙ উজ্জ্বল সোনালী, মজবুত এবং উৎপাদন সাধারণ জাতের চেয়ে প্রায় ২০% বেশি।",
        specialTraitBn: "পাটখড়ির গুণমান অত্যন্ত উন্নত।"
      }
    ],
    benchmarkCost: {
      seedCostPerDecimal: 40,
      fertilizerCostPerDecimal: 140,
      pesticideCostPerDecimal: 70,
      laborCostPerDecimal: 320,
      irrigationCostPerDecimal: 50,
      landPrepCostPerDecimal: 110,
      transportOtherCostPerDecimal: 70,
      avgExpectedYieldPerDecimalKg: 13,
      avgSellingPricePerKg: 75
    },
    sourceAuthority: "বাংলাদেশ পাট গবেষণা ইনস্টিটিউট (BJRI)",
    sourceUrl: "https://bjri.gov.bd",
    lastVerifiedDate: "২০২৬-০১-২০",
    imageUrl: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&w=600&q=80"
  },

  // 10. পেঁয়াজ (Onion)
  {
    id: "onion",
    name: "Onion",
    bnName: "পেঁয়াজ",
    category: "vegetable",
    categoryBn: "মসলা শস্য",
    season: "rabi",
    seasonBn: "রবি ও গ্রীষ্মকালীন",
    bengaliMonths: "কার্তিক - চৈত্র (নভেম্বর - এপ্রিল)",
    sowingWindowStartMonth: 11,
    sowingWindowEndMonth: 12,
    harvestWindowStartMonth: 3,
    harvestWindowEndMonth: 4,
    durationDaysRange: [120, 135],
    waterRequirementBn: "নিয়মিত হালকা সেচ প্রয়োজন। মাটি শুকিয়ে শক্ত হলে কন্দের বৃদ্ধি ব্যাহত হয়।",
    soilSuitabilityBn: "উঁচু সুনিষ্কাশিত বেলে দোআঁশ মাটি (ফরিদপুর, পাবনা, রাজবাড়ী, রাজশাহী প্রধান পেঁয়াজ অঞ্চল)।",
    landPreparationBn: "জমি গভীরভাবে ৪-৫ বার চাষ করে আগাছামুক্ত বেড তৈরি করে চারা রোপণ করতে হয়।",
    weatherRisksBn: [
      "ঘন কুয়াশা ও স্যাঁতসেঁতে আবহাওয়ায় পার্পল ব্লচ (Purple Blotch) বা পাতা পোড়া রোগ হয়।",
      "তোলার সময় বৃষ্টি হলে পেঁয়াজে পচন ধরে এবং গুদামে সংরক্ষণ করা যায় না।"
    ],
    preventiveMeasuresBn: [
      "কুয়াশার সময় রোভরাল বা প্রপিকোনাজল অনুমোদিত মাত্রায় স্প্রে করুন।",
      "ফসল তোলার পর ছায়াযুক্ত স্থানে ৩-৪ দিন শুকিয়ে সংরক্ষণ করুন।"
    ],
    advisoryThresholds: {
      highHumidityRisk: true,
      heavyRainRisk: true
    },
    varieties: [
      {
        name: "BARI Piaj-1 (Taherpuri Selection)",
        bnName: "বারি পেঁয়াজ-১ (তাহেরপুরী)",
        source: "BARI মসলা গবেষণা কেন্দ্র",
        durationDays: 130,
        yieldPerDecimalKg: 60,
        yieldPerBighaMaund: 50,
        characteristicsBn: "ঝাঁঝালো, গাঢ় লালচে রঙ ও অসাধারণ সংরক্ষণ ক্ষমতা।",
        specialTraitBn: "বাজারে সর্বোচ্চ দামে বিক্রি হয় এবং পচন কম ধরে।"
      },
      {
        name: "BARI Piaj-4 (Summer Variety)",
        bnName: "বারি পেঁয়াজ-৪ (গ্রীষ্মকালীন)",
        source: "BARI",
        durationDays: 110,
        yieldPerDecimalKg: 65,
        yieldPerBighaMaund: 53,
        characteristicsBn: "অসময়ে গ্রীষ্ম-বর্ষায় চাষ করা যায়।",
        specialTraitBn: "অসময়ে বাজারে পেঁয়াজের চড়া দামে বিপুল মুনাফা দেয়।"
      }
    ],
    benchmarkCost: {
      seedCostPerDecimal: 200,
      fertilizerCostPerDecimal: 220,
      pesticideCostPerDecimal: 120,
      laborCostPerDecimal: 380,
      irrigationCostPerDecimal: 120,
      landPrepCostPerDecimal: 130,
      transportOtherCostPerDecimal: 80,
      avgExpectedYieldPerDecimalKg: 60,
      avgSellingPricePerKg: 45
    },
    sourceAuthority: "BARI মসলা গবেষণা কেন্দ্র, শিবগঞ্জ, বগুড়া",
    sourceUrl: "https://bari.gov.bd",
    lastVerifiedDate: "২০২৬-০১-২৮",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80"
  },

  // 11. মরিচ (Chilli)
  {
    id: "chilli",
    name: "Green Chilli",
    bnName: "কাঁচা মরিচ",
    category: "cash_crop",
    categoryBn: "মসলা শস্য",
    season: "year_round",
    seasonBn: "রবি ও খরিফ উভয় মৌসুম",
    bengaliMonths: "কার্তিক - জ্যৈষ্ঠ (অক্টোবর - মে)",
    sowingWindowStartMonth: 10,
    sowingWindowEndMonth: 12,
    harvestWindowStartMonth: 1,
    harvestWindowEndMonth: 6,
    durationDaysRange: [150, 180],
    waterRequirementBn: "পরিমিত সেচ, জমিতে এক ফোঁটা পানিও জমে থাকা চলবে না।",
    soilSuitabilityBn: "উঁচু ও সুনিষ্কাশিত বেলে দোআঁশ মাটি (বগুড়া, জামালপুর, চাঁদপুর চরাঞ্চল বিখ্যাত)।",
    landPreparationBn: "বেড তৈরি করে নালা কেটে চারা লাগাতে হয়।",
    weatherRisksBn: [
      "বৃষ্টি হলে জমিতে পানি জমে গোড়া পচা (Root Rot) ও ডাইব্যাক (Die-back) রোগ হয়।",
      "কুয়াশায় অ্যানথ্রাকনোজ (Anthracnose) বা ফল পচা রোগ বাড়ে।"
    ],
    preventiveMeasuresBn: [
      "উঁচু বেডে চাষ করুন এবং নিকাশ নালা নিশ্চিত করুন।",
      "ছত্রাক আক্রমণ প্রতিরোধে কার্বেনডাজিম স্প্রে করুন।"
    ],
    advisoryThresholds: {
      heavyRainRisk: true,
      highHumidityRisk: true
    },
    varieties: [
      {
        name: "BARI Morich-2",
        bnName: "বারি মরিচ-২",
        source: "BARI",
        durationDays: 160,
        yieldPerDecimalKg: 35,
        yieldPerBighaMaund: 28,
        characteristicsBn: "প্রচুর ফলন, মরিচ সোজা এবং তীব্র সুগন্ধি ও ঝাল।",
        specialTraitBn: "কাঁচা ও শুকনো উভয় হিসেবেই বাজারজাত করা যায়।"
      }
    ],
    benchmarkCost: {
      seedCostPerDecimal: 150,
      fertilizerCostPerDecimal: 240,
      pesticideCostPerDecimal: 160,
      laborCostPerDecimal: 400,
      irrigationCostPerDecimal: 120,
      landPrepCostPerDecimal: 120,
      transportOtherCostPerDecimal: 90,
      avgExpectedYieldPerDecimalKg: 35,
      avgSellingPricePerKg: 70
    },
    sourceAuthority: "BARI ও কৃষি সম্প্রসারণ অধিদপ্তর",
    sourceUrl: "https://dae.gov.bd",
    lastVerifiedDate: "২০২৬-০১-১৮",
    imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80"
  },

  // 12. তরমুজ (Watermelon)
  {
    id: "watermelon",
    name: "Watermelon",
    bnName: "তরমুজ",
    category: "fruit",
    categoryBn: "ফল ফসল",
    season: "rabi",
    seasonBn: "রবি / প্রাক-গ্রীষ্ম",
    bengaliMonths: "পৌষ - বৈশাখ (ডিসেম্বর - মে)",
    sowingWindowStartMonth: 12,
    sowingWindowEndMonth: 1,
    harvestWindowStartMonth: 3,
    harvestWindowEndMonth: 5,
    durationDaysRange: [80, 95],
    waterRequirementBn: "মাঝারি পানি নির্ভর। কাদা ও অতিরিক্ত পানি ক্ষতিকর, তবে বালু জমিতে নিয়মিত হালকা সেচ প্রয়োজন।",
    soilSuitabilityBn: "উপকূলীয় চরাঞ্চল, বেলে ও বেলে দোআঁশ মাটি (পটুয়াখালী, বরগুনা, ভোলা, নোয়াখালী প্রধান অঞ্চল)।",
    landPreparationBn: "মাদায় গোবর ও সার দিয়ে গর্ত প্রস্তুত করে বীজ বপন করতে হয়।",
    weatherRisksBn: [
      "মার্চ-এপ্রিল মাসে অসময়ে বৃষ্টি ও জোয়ারের পানিতে ক্ষেত তলিয়ে যাওয়া।",
      "পাকা ফল অবস্থায় অতিরিক্ত বৃষ্টিতে তরমুজ ফেটে যাওয়া।"
    ],
    preventiveMeasuresBn: [
      "আগাম জাত নির্বাচন করে চৈত্র মাসের মধ্যেই কর্তন সম্পন্ন করুন।",
      "উপকূলীয় বেড়িবাঁধ এলাকায় উঁচু কান্দিতে মালচিং পেপার দিয়ে চাষ করুন।"
    ],
    advisoryThresholds: {
      heavyRainRisk: true,
      maxTempAlert: 38
    },
    varieties: [
      {
        name: "Glory / Pakiza Hybrid",
        bnName: "গ্লোরি / পাকিজা হাইব্রিড",
        source: "DAE নিবন্ধিত",
        durationDays: 85,
        yieldPerDecimalKg: 120,
        yieldPerBighaMaund: 98,
        characteristicsBn: "ভেতরে টুকটুকে লাল, অত্যন্ত মিষ্টি ও রসালো, ফল গড়ে ৮-১২ কেজি ওজনের হয়।",
        specialTraitBn: "উপকূলীয় জেলাগুলোর কৃষকদের সর্বোচ্চ লাভজনক ফসল।"
      }
    ],
    benchmarkCost: {
      seedCostPerDecimal: 180,
      fertilizerCostPerDecimal: 250,
      pesticideCostPerDecimal: 140,
      laborCostPerDecimal: 350,
      irrigationCostPerDecimal: 120,
      landPrepCostPerDecimal: 140,
      transportOtherCostPerDecimal: 150,
      avgExpectedYieldPerDecimalKg: 120,
      avgSellingPricePerKg: 25
    },
    sourceAuthority: "কৃষি সম্প্রসারণ অধিদপ্তর (উপকূলীয় কৃষি উইং)",
    sourceUrl: "https://dae.gov.bd",
    lastVerifiedDate: "২০২৬-০২-০৫",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80"
  }
];

export interface Division {
  id: string;
  name: string;
  bnName: string;
  lat: number;
  lon: number;
  districtsCount: number;
}

export interface Upazila {
  id: string;
  name: string;
  bnName: string;
  lat: number;
  lon: number;
}

export interface District {
  id: string;
  name: string;
  bnName: string;
  divisionId: string;
  divisionName: string;
  divisionBnName: string;
  lat: number;
  lon: number;
  aeZone: string;
  aeZoneBn: string;
  primaryCrops: string[];
  upazilas: Upazila[];
}

export const DIVISIONS: Division[] = [
  { id: "dhaka", name: "Dhaka", bnName: "ঢাকা", lat: 23.8103, lon: 90.4125, districtsCount: 13 },
  { id: "chattogram", name: "Chattogram", bnName: "চট্টগ্রাম", lat: 22.3569, lon: 91.7832, districtsCount: 11 },
  { id: "rajshahi", name: "Rajshahi", bnName: "রাজশাহী", lat: 24.3745, lon: 88.6042, districtsCount: 8 },
  { id: "khulna", name: "Khulna", bnName: "খুলনা", lat: 22.8456, lon: 89.5403, districtsCount: 10 },
  { id: "barishal", name: "Barishal", bnName: "বরিশাল", lat: 22.7010, lon: 90.3535, districtsCount: 6 },
  { id: "sylhet", name: "Sylhet", bnName: "সিলেট", lat: 24.8949, lon: 91.8687, districtsCount: 4 },
  { id: "rangpur", name: "Rangpur", bnName: "রংপুর", lat: 25.7439, lon: 89.2752, districtsCount: 8 },
  { id: "mymensingh", name: "Mymensingh", bnName: "ময়মনসিংহ", lat: 24.7471, lon: 90.4203, districtsCount: 4 }
];

export const DISTRICTS: District[] = [
  // --- DHAKA DIVISION ---
  {
    id: "dhaka",
    name: "Dhaka",
    bnName: "ঢাকা",
    divisionId: "dhaka",
    divisionName: "Dhaka",
    divisionBnName: "ঢাকা",
    lat: 23.8103,
    lon: 90.4125,
    aeZone: "Madhupur Tract & Ganges Floodplain",
    aeZoneBn: "মধুপুর গড় ও গঙ্গা প্লাবনভূমি",
    primaryCrops: ["boro_rice", "vegetables", "mustard"],
    upazilas: [
      { id: "dhamrai", name: "Dhamrai", bnName: "ধামরাই", lat: 23.9167, lon: 90.2167 },
      { id: "dohar", name: "Dohar", bnName: "দোহার", lat: 23.5833, lon: 90.1333 },
      { id: "keraniganj", name: "Keraniganj", bnName: "কেরানীগঞ্জ", lat: 23.6833, lon: 90.3167 },
      { id: "nawabganj", name: "Nawabganj", bnName: "নবাবগঞ্জ", lat: 23.6667, lon: 90.1667 },
      { id: "savar", name: "Savar", bnName: "সাভার", lat: 23.8583, lon: 90.2667 }
    ]
  },
  {
    id: "gazipur",
    name: "Gazipur",
    bnName: "গাজীপুর",
    divisionId: "dhaka",
    divisionName: "Dhaka",
    divisionBnName: "ঢাকা",
    lat: 24.0023,
    lon: 90.4264,
    aeZone: "Madhupur Tract",
    aeZoneBn: "মধুপুর গড় অঞ্চল",
    primaryCrops: ["aman_rice", "vegetables", "jackfruit", "boro_rice"],
    upazilas: [
      { id: "gazipur_sadar", name: "Gazipur Sadar", bnName: "গাজীপুর সদর", lat: 24.0023, lon: 90.4264 },
      { id: "kaliakair", name: "Kaliakair", bnName: "কালিয়াকৈর", lat: 24.0667, lon: 90.2167 },
      { id: "kaliganj_g", name: "Kaliganj", bnName: "কালীগঞ্জ", lat: 23.9167, lon: 90.5667 },
      { id: "kapasia", name: "Kapasia", bnName: "কাপাসিয়া", lat: 24.1167, lon: 90.5667 },
      { id: "sreepur", name: "Sreepur", bnName: "শ্রীপুর", lat: 24.2000, lon: 90.4667 }
    ]
  },
  {
    id: "tangail",
    name: "Tangail",
    bnName: "টাঙ্গাইল",
    divisionId: "dhaka",
    divisionName: "Dhaka",
    divisionBnName: "ঢাকা",
    lat: 24.2513,
    lon: 89.9167,
    aeZone: "Young Jamuna Floodplain & Madhupur Tract",
    aeZoneBn: "যমুনা প্লাবনভূমি ও মধুপুর গড়",
    primaryCrops: ["boro_rice", "aman_rice", "mustard", "pineapple"],
    upazilas: [
      { id: "tangail_sadar", name: "Tangail Sadar", bnName: "টাঙ্গাইল সদর", lat: 24.2513, lon: 89.9167 },
      { id: "basail", name: "Basail", bnName: "বাসাইল", lat: 24.2167, lon: 90.0500 },
      { id: "bhuapur", name: "Bhuapur", bnName: "ভূঞাপুর", lat: 24.4667, lon: 89.8667 },
      { id: "delduar", name: "Delduar", bnName: "দেলদুয়ার", lat: 24.1417, lon: 89.9667 },
      { id: "ghatail", name: "Ghatail", bnName: "ঘাটাইল", lat: 24.5000, lon: 90.0000 },
      { id: "gopalpur", name: "Gopalpur", bnName: "গোপালপুর", lat: 24.5500, lon: 89.9167 },
      { id: "kalihati", name: "Kalihati", bnName: "কালিহাতী", lat: 24.3833, lon: 90.0000 },
      { id: "madhupur", name: "Madhupur", bnName: "মধুপুর", lat: 24.6167, lon: 90.0333 },
      { id: "mirzapur", name: "Mirzapur", bnName: "মির্জাপুর", lat: 24.1000, lon: 90.1000 },
      { id: "nagarpur", name: "Nagarpur", bnName: "নাগরপুর", lat: 23.9833, lon: 89.8833 },
      { id: "sakhipur", name: "Sakhipur", bnName: "সখিপুর", lat: 24.3167, lon: 90.1667 }
    ]
  },
  {
    id: "kishoreganj",
    name: "Kishoreganj",
    bnName: "কিশোরগঞ্জ",
    divisionId: "dhaka",
    divisionName: "Dhaka",
    divisionBnName: "ঢাকা",
    lat: 24.4449,
    lon: 90.7766,
    aeZone: "Old Brahmaputra & Sylhet Basin (Haor)",
    aeZoneBn: "পুরাতন ব্রহ্মপুত্র ও হাওর অববাহিকা",
    primaryCrops: ["boro_rice", "mustard", "jute", "vegetables"],
    upazilas: [
      { id: "kishoreganj_sadar", name: "Kishoreganj Sadar", bnName: "কিশোরগঞ্জ সদর", lat: 24.4449, lon: 90.7766 },
      { id: "austagram", name: "Austagram (Haor)", bnName: "অষ্টগ্রাম (হাওর)", lat: 24.2667, lon: 91.1167 },
      { id: "bajitpur", name: "Bajitpur", bnName: "বাজিতপুর", lat: 24.2167, lon: 90.9500 },
      { id: "bhairab", name: "Bhairab", bnName: "ভৈরব", lat: 24.0500, lon: 90.9833 },
      { id: "itna", name: "Itna (Haor)", bnName: "ইটনা (হাওর)", lat: 24.5333, lon: 91.1833 },
      { id: "karimganj", name: "Karimganj", bnName: "করিমগঞ্জ", lat: 24.4667, lon: 90.8833 },
      { id: "katiadi", name: "Katiadi", bnName: "কটিয়াদী", lat: 24.2667, lon: 90.8000 },
      { id: "kuliarchar", name: "Kuliarchar", bnName: "কুলিয়ারচর", lat: 24.1500, lon: 90.9000 },
      { id: "mithamain", name: "Mithamain (Haor)", bnName: "মিঠামইন (হাওর)", lat: 24.4333, lon: 91.1167 },
      { id: "nikli", name: "Nikli", bnName: "নিকলী", lat: 24.3167, lon: 90.9333 },
      { id: "pakundia", name: "Pakundia", bnName: "পাকুন্দিয়া", lat: 24.3333, lon: 90.6833 },
      { id: "tarail", name: "Tarail", bnName: "তাড়াইল", lat: 24.5500, lon: 90.8667 }
    ]
  },
  {
    id: "manikganj",
    name: "Manikganj",
    bnName: "মানিকগঞ্জ",
    divisionId: "dhaka",
    divisionName: "Dhaka",
    divisionBnName: "ঢাকা",
    lat: 23.8617,
    lon: 90.0003,
    aeZone: "Young Jamuna Floodplain",
    aeZoneBn: "যমুনা প্লাবনভূমি",
    primaryCrops: ["mustard", "boro_rice", "vegetables", "jute"],
    upazilas: [
      { id: "manikganj_sadar", name: "Manikganj Sadar", bnName: "মানিকগঞ্জ সদর", lat: 23.8617, lon: 90.0003 },
      { id: "daulatpur_m", name: "Daulatpur", bnName: "দৌলতপুর", lat: 23.9833, lon: 89.8333 },
      { id: "ghior", name: "Ghior", bnName: "ঘিওর", lat: 23.8833, lon: 89.8333 },
      { id: "harirampur", name: "Harirampur", bnName: "হরিরামপুর", lat: 23.7333, lon: 89.9667 },
      { id: "saturia", name: "Saturia", bnName: "সাটুরিয়া", lat: 23.9333, lon: 90.0333 },
      { id: "shibalaya", name: "Shibalaya", bnName: "শিবালয়", lat: 23.8333, lon: 89.8000 },
      { id: "singair", name: "Singair", bnName: "সিংগাইর", lat: 23.8167, lon: 90.1500 }
    ]
  },
  {
    id: "munshiganj",
    name: "Munshiganj",
    bnName: "মুন্সীগঞ্জ",
    divisionId: "dhaka",
    divisionName: "Dhaka",
    divisionBnName: "ঢাকা",
    lat: 23.5422,
    lon: 90.5305,
    aeZone: "Old Meghna Estuarine Floodplain",
    aeZoneBn: "মেঘনা মোহনা প্লাবনভূমি",
    primaryCrops: ["potato", "boro_rice", "mustard", "vegetables"],
    upazilas: [
      { id: "munshiganj_sadar", name: "Munshiganj Sadar", bnName: "মুন্সীগঞ্জ সদর", lat: 23.5422, lon: 90.5305 },
      { id: "gazaria", name: "Gazaria", bnName: "গজারিয়া", lat: 23.5500, lon: 90.6167 },
      { id: "lohajang", name: "Lohajang", bnName: "লৌহজং", lat: 23.4667, lon: 90.3167 },
      { id: "sirajdikhan", name: "Sirajdikhan", bnName: "সিরাজদিখান", lat: 23.6000, lon: 90.3833 },
      { id: "sreenagar", name: "Sreenagar", bnName: "শ্রীনগর", lat: 23.5333, lon: 90.2833 },
      { id: "tongibari", name: "Tongibari", bnName: "টংগিবাড়ী", lat: 23.5000, lon: 90.4500 }
    ]
  },
  {
    id: "narayanganj",
    name: "Narayanganj",
    bnName: "নারায়ণগঞ্জ",
    divisionId: "dhaka",
    divisionName: "Dhaka",
    divisionBnName: "ঢাকা",
    lat: 23.6337,
    lon: 90.4965,
    aeZone: "Middle Meghna Floodplain",
    aeZoneBn: "মধ্য মেঘনা প্লাবনভূমি",
    primaryCrops: ["vegetables", "boro_rice", "mustard"],
    upazilas: [
      { id: "narayanganj_sadar", name: "Narayanganj Sadar", bnName: "নারায়ণগঞ্জ সদর", lat: 23.6337, lon: 90.4965 },
      { id: "araihazar", name: "Araihazar", bnName: "আড়াইহাজার", lat: 23.7833, lon: 90.6500 },
      { id: "bandar", name: "Bandar", bnName: "বন্দর", lat: 23.6000, lon: 90.5167 },
      { id: "rupganj", name: "Rupganj", bnName: "রূপগঞ্জ", lat: 23.8000, lon: 90.5167 },
      { id: "sonargaon", name: "Sonargaon", bnName: "সোনারগাঁও", lat: 23.6500, lon: 90.6000 }
    ]
  },
  {
    id: "narsingdi",
    name: "Narsingdi",
    bnName: "নরসিংদী",
    divisionId: "dhaka",
    divisionName: "Dhaka",
    divisionBnName: "ঢাকা",
    lat: 23.9322,
    lon: 90.7154,
    aeZone: "Old Brahmaputra Floodplain",
    aeZoneBn: "পুরাতন ব্রহ্মপুত্র প্লাবনভূমি",
    primaryCrops: ["banana", "vegetables", "boro_rice", "jute"],
    upazilas: [
      { id: "narsingdi_sadar", name: "Narsingdi Sadar", bnName: "নরসিংদী সদর", lat: 23.9322, lon: 90.7154 },
      { id: "belabo", name: "Belabo", bnName: "বেলাবো", lat: 24.1000, lon: 90.8500 },
      { id: "monohardi", name: "Monohardi", bnName: "মনোহরদী", lat: 24.1333, lon: 90.7000 },
      { id: "palash", name: "Palash", bnName: "পলাশ", lat: 23.9833, lon: 90.6333 },
      { id: "raipura", name: "Raipura", bnName: "রায়পুরা", lat: 23.9833, lon: 90.8667 },
      { id: "shibpur", name: "Shibpur", bnName: "শিবপুর", lat: 24.0333, lon: 90.7333 }
    ]
  },
  {
    id: "faridpur",
    name: "Faridpur",
    bnName: "ফরিদপুর",
    divisionId: "dhaka",
    divisionName: "Dhaka",
    divisionBnName: "ঢাকা",
    lat: 23.6071,
    lon: 89.8429,
    aeZone: "Low Ganges River Floodplain",
    aeZoneBn: "নিম্ন গঙ্গা নদী প্লাবনভূমি",
    primaryCrops: ["onion", "jute", "boro_rice", "lentil"],
    upazilas: [
      { id: "faridpur_sadar", name: "Faridpur Sadar", bnName: "ফরিদপুর সদর", lat: 23.6071, lon: 89.8429 },
      { id: "alfadanga", name: "Alfadanga", bnName: "আলফাডাঙ্গা", lat: 23.2833, lon: 89.7000 },
      { id: "bhanga", name: "Bhanga", bnName: "ভাঙ্গা", lat: 23.3833, lon: 89.9833 },
      { id: "boalmari", name: "Boalmari", bnName: "বোয়ালমারী", lat: 23.3833, lon: 89.7000 },
      { id: "charbhadrasan", name: "Charbhadrasan", bnName: "চরভদ্রাসন", lat: 23.6000, lon: 90.0333 },
      { id: "madhukhali", name: "Madhukhali", bnName: "মধুখালী", lat: 23.5333, lon: 89.6333 },
      { id: "nagarkanda", name: "Nagarkanda", bnName: "নগরকান্দা", lat: 23.4167, lon: 89.9000 },
      { id: "sadarpur", name: "Sadarpur", bnName: "সদরপুর", lat: 23.4833, lon: 90.0333 },
      { id: "saltha", name: "Saltha", bnName: "সালথা", lat: 23.4667, lon: 89.7833 }
    ]
  },
  {
    id: "gopalganj",
    name: "Gopalganj",
    bnName: "গোপালগঞ্জ",
    divisionId: "dhaka",
    divisionName: "Dhaka",
    divisionBnName: "ঢাকা",
    lat: 23.0051,
    lon: 89.8266,
    aeZone: "Gopalganj-Khulna Beels",
    aeZoneBn: "গোপালগঞ্জ-খুলনা বিল অঞ্চল",
    primaryCrops: ["boro_rice", "jute", "fish_aquaculture", "mustard"],
    upazilas: [
      { id: "gopalganj_sadar", name: "Gopalganj Sadar", bnName: "গোপালগঞ্জ সদর", lat: 23.0051, lon: 89.8266 },
      { id: "kashiani", name: "Kashiani", bnName: "কাশিয়ানী", lat: 23.2167, lon: 89.7833 },
      { id: "kotalipara", name: "Kotalipara", bnName: "কোটালীপাড়া", lat: 22.9833, lon: 90.0000 },
      { id: "muksudpur", name: "Muksudpur", bnName: "মুকসুদপুর", lat: 23.3167, lon: 89.8667 },
      { id: "tungipara", name: "Tungipara", bnName: "টুঙ্গিপাড়া", lat: 22.9000, lon: 89.8833 }
    ]
  },
  {
    id: "madaripur",
    name: "Madaripur",
    bnName: "মাদারীপুর",
    divisionId: "dhaka",
    divisionName: "Dhaka",
    divisionBnName: "ঢাকা",
    lat: 23.1641,
    lon: 90.1897,
    aeZone: "Low Ganges River Floodplain",
    aeZoneBn: "নিম্ন গঙ্গা প্লাবনভূমি",
    primaryCrops: ["jute", "mustard", "boro_rice", "lentil"],
    upazilas: [
      { id: "madaripur_sadar", name: "Madaripur Sadar", bnName: "মাদারীপুর সদর", lat: 23.1641, lon: 90.1897 },
      { id: "kalkini", name: "Kalkini", bnName: "কালকিনি", lat: 23.0667, lon: 90.2333 },
      { id: "rajoir", name: "Rajoir", bnName: "রাজৈর", lat: 23.2000, lon: 90.0333 },
      { id: "shibchar", name: "Shibchar", bnName: "শিবচর", lat: 23.3500, lon: 90.1667 }
    ]
  },
  {
    id: "rajbari",
    name: "Rajbari",
    bnName: "রাজবাড়ী",
    divisionId: "dhaka",
    divisionName: "Dhaka",
    divisionBnName: "ঢাকা",
    lat: 23.7574,
    lon: 89.6445,
    aeZone: "Low Ganges River Floodplain",
    aeZoneBn: "পদ্মা-গঙ্গা প্লাবনভূমি",
    primaryCrops: ["onion", "jute", "sugarcane", "boro_rice"],
    upazilas: [
      { id: "rajbari_sadar", name: "Rajbari Sadar", bnName: "রাজবাড়ী সদর", lat: 23.7574, lon: 89.6445 },
      { id: "baliakandi", name: "Baliakandi", bnName: "বালিয়াকান্দি", lat: 23.6167, lon: 89.5333 },
      { id: "goalandaghat", name: "Goalanda", bnName: "গোয়ালন্দ", lat: 23.7333, lon: 89.7667 },
      { id: "pangsha", name: "Pangsha", bnName: "পাংশা", lat: 23.7833, lon: 89.4167 },
      { id: "kalukhali", name: "Kalukhali", bnName: "কালুখালী", lat: 23.7000, lon: 89.5000 }
    ]
  },
  {
    id: "shariatpur",
    name: "Shariatpur",
    bnName: "শরীয়তপুর",
    divisionId: "dhaka",
    divisionName: "Dhaka",
    divisionBnName: "ঢাকা",
    lat: 23.2423,
    lon: 90.4348,
    aeZone: "Low Ganges & Meghna Floodplain",
    aeZoneBn: "গঙ্গা ও মেঘনা নিম্ন প্লাবনভূমি",
    primaryCrops: ["boro_rice", "jute", "wheat", "vegetables"],
    upazilas: [
      { id: "shariatpur_sadar", name: "Shariatpur Sadar", bnName: "শরীয়তপুর সদর", lat: 23.2423, lon: 90.4348 },
      { id: "bhedarganj", name: "Bhedarganj", bnName: "ভেদরগঞ্জ", lat: 23.1833, lon: 90.4333 },
      { id: "damudya", name: "Damudya", bnName: "ডামুড্যা", lat: 23.1333, lon: 90.4667 },
      { id: "gosairhat", name: "Gosairhat", bnName: "গোসাইরহাট", lat: 23.0667, lon: 90.4667 },
      { id: "naria", name: "Naria", bnName: "নড়িয়া", lat: 23.3167, lon: 90.4000 },
      { id: "zajira", name: "Zajira", bnName: "জাজিরা", lat: 23.3500, lon: 90.3167 }
    ]
  },

  // --- CHATTOGRAM DIVISION ---
  {
    id: "chattogram",
    name: "Chattogram",
    bnName: "চট্টগ্রাম",
    divisionId: "chattogram",
    divisionName: "Chattogram",
    divisionBnName: "চট্টগ্রাম",
    lat: 22.3569,
    lon: 91.7832,
    aeZone: "Chittagong Coastal Plain",
    aeZoneBn: "চট্টগ্রাম উপকূলীয় সমভূমি",
    primaryCrops: ["aman_rice", "boro_rice", "vegetables", "watermelon"],
    upazilas: [
      { id: "anwara", name: "Anwara", bnName: "আনোয়ারা", lat: 22.2167, lon: 91.9167 },
      { id: "banshhali", name: "Banshkhali", bnName: "বাঁশখালী", lat: 22.0333, lon: 91.9500 },
      { id: "boalkhali", name: "Boalkhali", bnName: "বোয়ালখালী", lat: 22.3833, lon: 91.9167 },
      { id: "chandanaish", name: "Chandanaish", bnName: "চন্দনাইশ", lat: 22.2167, lon: 92.0500 },
      { id: "fatikchhari", name: "Fatikchhari", bnName: "ফটিকছড়ি", lat: 22.6833, lon: 91.8000 },
      { id: "hathazari", name: "Hathazari", bnName: "হাটহাজারী", lat: 22.5000, lon: 91.8000 },
      { id: "mirsharai", name: "Mirsharai", bnName: "মীরসরাই", lat: 22.7667, lon: 91.5833 },
      { id: "patiya", name: "Patiya", bnName: "পটিয়া", lat: 22.3000, lon: 91.9833 },
      { id: "rangunia", name: "Rangunia", bnName: "রাঙ্গুনিয়া", lat: 22.4667, lon: 92.0500 },
      { id: "raozan", name: "Raozan", bnName: "রাউজান", lat: 22.5333, lon: 91.9167 },
      { id: "sandwip", name: "Sandwip (Island)", bnName: "সন্দ্বীপ (দ্বীপ)", lat: 22.4833, lon: 91.4333 },
      { id: "satkania", name: "Satkania", bnName: "সাতকানিয়া", lat: 22.0833, lon: 92.0500 },
      { id: "sitakunda", name: "Sitakunda", bnName: "সীতাকুণ্ড", lat: 22.6167, lon: 91.6667 }
    ]
  },
  {
    id: "coxs_bazar",
    name: "Cox's Bazar",
    bnName: "কক্সবাজার",
    divisionId: "chattogram",
    divisionName: "Chattogram",
    divisionBnName: "চট্টগ্রাম",
    lat: 21.4272,
    lon: 92.0058,
    aeZone: "Chittagong Coastal Plain & Hills",
    aeZoneBn: "উপকূলীয় ও পাহাড়ি অঞ্চল",
    primaryCrops: ["salt_farming", "betel_leaf", "aman_rice", "watermelon"],
    upazilas: [
      { id: "cox_sadar", name: "Cox's Bazar Sadar", bnName: "কক্সবাজার সদর", lat: 21.4272, lon: 92.0058 },
      { id: "chakaria", name: "Chakaria", bnName: "চকোরিয়া", lat: 21.7833, lon: 92.0833 },
      { id: "kutubdia", name: "Kutubdia", bnName: "কুতুবদিয়া", lat: 21.8167, lon: 91.8667 },
      { id: "maheshkhali", name: "Maheshkhali", bnName: "মহেশখালী", lat: 21.5500, lon: 91.9667 },
      { id: "ramu", name: "Ramu", bnName: "রামু", lat: 21.4333, lon: 92.1000 },
      { id: "teknaf", name: "Teknaf", bnName: "টেকনাফ", lat: 20.8667, lon: 92.3000 },
      { id: "ukhiya", name: "Ukhiya", bnName: "উখিয়া", lat: 21.2833, lon: 92.1500 },
      { id: "pekua", name: "Pekua", bnName: "পেকুয়া", lat: 21.8000, lon: 91.9667 }
    ]
  },
  {
    id: "cumilla",
    name: "Cumilla",
    bnName: "কুমিল্লা",
    divisionId: "chattogram",
    divisionName: "Chattogram",
    divisionBnName: "চট্টগ্রাম",
    lat: 23.4607,
    lon: 91.1809,
    aeZone: "Old Meghna Estuarine Floodplain",
    aeZoneBn: "মেঘনা মোহনা প্লাবনভূমি",
    primaryCrops: ["boro_rice", "aman_rice", "potato", "vegetables"],
    upazilas: [
      { id: "cumilla_sadar", name: "Cumilla Adarsha Sadar", bnName: "কুমিল্লা আদর্শ সদর", lat: 23.4607, lon: 91.1809 },
      { id: "barura", name: "Barura", bnName: "বরুড়া", lat: 23.3667, lon: 91.0500 },
      { id: "brahmanpara", name: "Brahmanpara", bnName: "ব্রাহ্মণপাড়া", lat: 23.6167, lon: 91.1167 },
      { id: "burichang", name: "Burichang", bnName: "বুড়িচং", lat: 23.5500, lon: 91.1333 },
      { id: "chandina", name: "Chandina", bnName: "চান্দিনা", lat: 23.4833, lon: 91.0000 },
      { id: "chauddagram", name: "Chauddagram", bnName: "চৌদ্দগ্রাম", lat: 23.2167, lon: 91.3167 },
      { id: "daudkandi", name: "Daudkandi", bnName: "দাউদকান্দি", lat: 23.5333, lon: 90.7167 },
      { id: "debidwar", name: "Debidwar", bnName: "দেবিদ্বার", lat: 23.6000, lon: 90.9833 },
      { id: "homna", name: "Homna", bnName: "হোমনা", lat: 23.6833, lon: 90.7833 },
      { id: "laksam", name: "Laksam", bnName: "লাকসাম", lat: 23.2333, lon: 91.1333 },
      { id: "muradnagar", name: "Muradnagar", bnName: "মুরাদনগর", lat: 23.6500, lon: 90.9500 }
    ]
  },
  {
    id: "feni",
    name: "Feni",
    bnName: "ফেনী",
    divisionId: "chattogram",
    divisionName: "Chattogram",
    divisionBnName: "চট্টগ্রাম",
    lat: 23.0159,
    lon: 91.3976,
    aeZone: "Chittagong Coastal & Old Meghna Floodplain",
    aeZoneBn: "উপকূলীয় ও মেঘনা প্লাবনভূমি",
    primaryCrops: ["aman_rice", "boro_rice", "watermelon", "vegetables"],
    upazilas: [
      { id: "feni_sadar", name: "Feni Sadar", bnName: "ফেনী সদর", lat: 23.0159, lon: 91.3976 },
      { id: "chhagalnaiya", name: "Chhagalnaiya", bnName: "ছাগলনাইয়া", lat: 23.0333, lon: 91.5167 },
      { id: "daganbhuiyan", name: "Daganbhuiyan", bnName: "দাগনভূঞা", lat: 22.9333, lon: 91.3000 },
      { id: "parshuram", name: "Parshuram", bnName: "পরশুরাম", lat: 23.2167, lon: 91.4333 },
      { id: "fulgazi", name: "Fulgazi", bnName: "ফুলগাজী", lat: 23.1333, lon: 91.4333 },
      { id: "sonagazi", name: "Sonagazi", bnName: "সোনাগাজী", lat: 22.8500, lon: 91.3833 }
    ]
  },
  {
    id: "brahmanbaria",
    name: "Brahmanbaria",
    bnName: "ব্রাহ্মণবাড়িয়া",
    divisionId: "chattogram",
    divisionName: "Chattogram",
    divisionBnName: "চট্টগ্রাম",
    lat: 23.9571,
    lon: 91.1119,
    aeZone: "Old Meghna Estuarine & Haor Margin",
    aeZoneBn: "মেঘনা মোহনা ও হাওর সীমান্ত",
    primaryCrops: ["boro_rice", "mustard", "jute", "vegetables"],
    upazilas: [
      { id: "brahmanbaria_sadar", name: "Brahmanbaria Sadar", bnName: "ব্রাহ্মণবাড়িয়া সদর", lat: 23.9571, lon: 91.1119 },
      { id: "akhaura", name: "Akhaura", bnName: "আখাউড়া", lat: 23.8667, lon: 91.2167 },
      { id: "bancharampur", name: "Bancharampur", bnName: "বাঞ্ছারামপুর", lat: 23.7667, lon: 90.8167 },
      { id: "kasba", name: "Kasba", bnName: "কসবা", lat: 23.7333, lon: 91.1667 },
      { id: "nabinagar", name: "Nabinagar", bnName: "নবীনগর", lat: 23.8833, lon: 90.9667 },
      { id: "nasirnagar", name: "Nasirnagar (Haor)", bnName: "নাসিরনগর (হাওর)", lat: 24.2000, lon: 91.2167 },
      { id: "sarail", name: "Sarail", bnName: "সরাইল", lat: 24.1167, lon: 91.1167 },
      { id: "ashuganj", name: "Ashuganj", bnName: "আশুগঞ্জ", lat: 24.0333, lon: 91.0167 }
    ]
  },
  {
    id: "noakhali",
    name: "Noakhali",
    bnName: "নোয়াখালী",
    divisionId: "chattogram",
    divisionName: "Chattogram",
    divisionBnName: "চট্টগ্রাম",
    lat: 22.8696,
    lon: 91.0993,
    aeZone: "Young Meghna Estuarine Floodplain",
    aeZoneBn: "মেঘনা উপকূলীয় চরাঞ্চল",
    primaryCrops: ["aman_rice", "soybean", "watermelon", "groundnut"],
    upazilas: [
      { id: "noakhali_sadar", name: "Noakhali Sadar", bnName: "নোয়াখালী সদর", lat: 22.8696, lon: 91.0993 },
      { id: "begumganj", name: "Begumganj", bnName: "বেগমগঞ্জ", lat: 22.9500, lon: 91.1000 },
      { id: "chatkhil", name: "Chatkhil", bnName: "চাটখিল", lat: 23.0500, lon: 90.9667 },
      { id: "companiganj_n", name: "Companiganj", bnName: "কোম্পানীগঞ্জ", lat: 22.7833, lon: 91.2833 },
      { id: "hatiya", name: "Hatiya (Island)", bnName: "হাতিয়া (দ্বীপ)", lat: 22.3667, lon: 91.1167 },
      { id: "senbagh", name: "Senbagh", bnName: "সেনবাগ", lat: 22.9833, lon: 91.2333 },
      { id: "subarnachar", name: "Subarnachar", bnName: "সুবর্ণচর", lat: 22.7000, lon: 91.0833 }
    ]
  },
  {
    id: "chandpur",
    name: "Chandpur",
    bnName: "চাঁদপুর",
    divisionId: "chattogram",
    divisionName: "Chattogram",
    divisionBnName: "চট্টগ্রাম",
    lat: 23.2333,
    lon: 90.6667,
    aeZone: "Active Meghna & Lower Meghna Floodplain",
    aeZoneBn: "মেঘনা অববাহিকা প্লাবনভূমি",
    primaryCrops: ["boro_rice", "potato", "chilli", "soybean"],
    upazilas: [
      { id: "chandpur_sadar", name: "Chandpur Sadar", bnName: "চাঁদপুর সদর", lat: 23.2333, lon: 90.6667 },
      { id: "faridganj", name: "Faridganj", bnName: "ফরিদগঞ্জ", lat: 23.1167, lon: 90.7500 },
      { id: "haimchar", name: "Haimchar", bnName: "হাইমচর", lat: 23.0667, lon: 90.6333 },
      { id: "haziganj", name: "Haziganj", bnName: "হাজীগঞ্জ", lat: 23.2500, lon: 90.8500 },
      { id: "kachua_c", name: "Kachua", bnName: "কচুয়া", lat: 23.3500, lon: 90.9000 },
      { id: "matlab_north", name: "Matlab North", bnName: "মতলব উত্তর", lat: 23.4667, lon: 90.7000 },
      { id: "matlab_south", name: "Matlab South", bnName: "মতলব দক্ষিণ", lat: 23.3500, lon: 90.7000 },
      { id: "shahrasti", name: "Shahrasti", bnName: "শাহরাস্তি", lat: 23.2167, lon: 90.9500 }
    ]
  },
  {
    id: "lakshmipur",
    name: "Lakshmipur",
    bnName: "লক্ষ্মীপুর",
    divisionId: "chattogram",
    divisionName: "Chattogram",
    divisionBnName: "চট্টগ্রাম",
    lat: 22.9425,
    lon: 90.8412,
    aeZone: "Young Meghna Estuarine Floodplain",
    aeZoneBn: "মেঘনা মোহনা উপকূল",
    primaryCrops: ["soybean", "betel_nut", "aman_rice", "groundnut"],
    upazilas: [
      { id: "lakshmipur_sadar", name: "Lakshmipur Sadar", bnName: "লক্ষ্মীপুর সদর", lat: 22.9425, lon: 90.8412 },
      { id: "raipur", name: "Raipur", bnName: "রায়পুর", lat: 23.0333, lon: 90.7667 },
      { id: "ramganj", name: "Ramganj", bnName: "রামগঞ্জ", lat: 23.1000, lon: 90.8667 },
      { id: "ramgati", name: "Ramgati", bnName: "রামগতি", lat: 22.6167, lon: 90.9833 },
      { id: "kamalnagar", name: "Kamalnagar", bnName: "কমলনগর", lat: 22.7500, lon: 90.9000 }
    ]
  },
  {
    id: "rangamati",
    name: "Rangamati",
    bnName: "রাঙ্গামাটি",
    divisionId: "chattogram",
    divisionName: "Chattogram",
    divisionBnName: "চট্টগ্রাম",
    lat: 22.6533,
    lon: 92.1753,
    aeZone: "Northern and Eastern Hills",
    aeZoneBn: "পার্বত্য পাহাড়ি অঞ্চল",
    primaryCrops: ["ginger", "turmeric", "banana", "pineapple"],
    upazilas: [
      { id: "rangamati_sadar", name: "Rangamati Sadar", bnName: "রাঙ্গামাটি সদর", lat: 22.6533, lon: 92.1753 },
      { id: "baghaichhari", name: "Baghaichhari", bnName: "বাঘাইছড়ি", lat: 23.3333, lon: 92.1667 },
      { id: "barkal", name: "Barkal", bnName: "বরকল", lat: 22.7333, lon: 92.3500 },
      { id: "kaptai", name: "Kaptai", bnName: "কাপ্তাই", lat: 22.5000, lon: 92.2167 },
      { id: "naniarchar", name: "Naniarchar", bnName: "নানিয়ারচর", lat: 22.8667, lon: 92.1333 }
    ]
  },
  {
    id: "khagrachhari",
    name: "Khagrachhari",
    bnName: "খাগড়াছড়ি",
    divisionId: "chattogram",
    divisionName: "Chattogram",
    divisionBnName: "চট্টগ্রাম",
    lat: 23.1193,
    lon: 91.9847,
    aeZone: "Northern and Eastern Hills",
    aeZoneBn: "পার্বত্য পাহাড়ি অঞ্চল",
    primaryCrops: ["mango", "turmeric", "ginger", "aman_rice"],
    upazilas: [
      { id: "khagrachhari_sadar", name: "Khagrachhari Sadar", bnName: "খাগড়াছড়ি সদর", lat: 23.1193, lon: 91.9847 },
      { id: "dighinala", name: "Dighinala", bnName: "দিঘীনালা", lat: 23.2500, lon: 92.0500 },
      { id: "panchhari", name: "Panchhari", bnName: "পানছড়ি", lat: 23.3167, lon: 91.9000 },
      { id: "ramgarh", name: "Ramgarh", bnName: "রামগড়", lat: 22.9833, lon: 91.7000 }
    ]
  },
  {
    id: "bandarban",
    name: "Bandarban",
    bnName: "বান্দরবান",
    divisionId: "chattogram",
    divisionName: "Chattogram",
    divisionBnName: "চট্টগ্রাম",
    lat: 22.1953,
    lon: 92.2184,
    aeZone: "Northern and Eastern Hills",
    aeZoneBn: "পার্বত্য পাহাড়ি অঞ্চল",
    primaryCrops: ["jhum_rice", "papaya", "coffee", "cashew_nut"],
    upazilas: [
      { id: "bandarban_sadar", name: "Bandarban Sadar", bnName: "বান্দরবান সদর", lat: 22.1953, lon: 92.2184 },
      { id: "thanchi", name: "Thanchi", bnName: "থানচি", lat: 21.7833, lon: 92.4333 },
      { id: "rowangchhari", name: "Rowangchhari", bnName: "রোয়াংছড়ি", lat: 22.1667, lon: 92.3333 },
      { id: "ruma", name: "Ruma", bnName: "রুমা", lat: 22.0500, lon: 92.4000 },
      { id: "lama", name: "Lama", bnName: "লামা", lat: 21.7833, lon: 92.2000 }
    ]
  },

  // --- RAJSHAHI DIVISION ---
  {
    id: "rajshahi",
    name: "Rajshahi",
    bnName: "রাজশাহী",
    divisionId: "rajshahi",
    divisionName: "Rajshahi",
    divisionBnName: "রাজশাহী",
    lat: 24.3745,
    lon: 88.6042,
    aeZone: "High Barind Tract & Active Ganges Floodplain",
    aeZoneBn: "বরেন্দ্র অঞ্চল ও পদ্মা অববাহিকা",
    primaryCrops: ["mango", "boro_rice", "wheat", "tomato"],
    upazilas: [
      { id: "bagha", name: "Bagha", bnName: "বাঘা", lat: 24.1833, lon: 88.8333 },
      { id: "bagmara", name: "Bagmara", bnName: "বাগমারা", lat: 24.5667, lon: 88.8000 },
      { id: "charghat", name: "Charghat", bnName: "চারঘাট", lat: 24.2833, lon: 88.7500 },
      { id: "durgapur_r", name: "Durgapur", bnName: "দুর্গাপুর", lat: 24.4500, lon: 88.7667 },
      { id: "godagari", name: "Godagari (Barind)", bnName: "গোদাগাড়ী (বরেন্দ্র)", lat: 24.4667, lon: 88.3333 },
      { id: "mohonpur", name: "Mohonpur", bnName: "মোহনপুর", lat: 24.5333, lon: 88.6500 },
      { id: "paba", name: "Paba", bnName: "পবা", lat: 24.4333, lon: 88.6333 },
      { id: "puthia", name: "Puthia", bnName: "পুঠিয়া", lat: 24.3667, lon: 88.8333 },
      { id: "tanore", name: "Tanore (Barind)", bnName: "তানোর (বরেন্দ্র)", lat: 24.6000, lon: 88.5833 }
    ]
  },
  {
    id: "bogura",
    name: "Bogura",
    bnName: "বগুড়া",
    divisionId: "rajshahi",
    divisionName: "Rajshahi",
    divisionBnName: "রাজশাহী",
    lat: 24.8465,
    lon: 89.3777,
    aeZone: "Level Barind Tract & Karatoya-Bangali Floodplain",
    aeZoneBn: "সমতল বরেন্দ্র ও করতোয়া-বাঙালি প্লাবনভূমি",
    primaryCrops: ["chilli", "potato", "boro_rice", "maize"],
    upazilas: [
      { id: "bogura_sadar", name: "Bogura Sadar", bnName: "বগুড়া সদর", lat: 24.8465, lon: 89.3777 },
      { id: "adamdighi", name: "Adamdighi", bnName: "আদমদিঘী", lat: 24.7833, lon: 89.0333 },
      { id: "dhunat", name: "Dhunat", bnName: "ধুনট", lat: 24.6833, lon: 89.5333 },
      { id: "dhupchanchia", name: "Dhupchanchia", bnName: "দুপচাঁচিয়া", lat: 24.8667, lon: 89.1667 },
      { id: "gabtali", name: "Gabtali", bnName: "গাবতলী", lat: 24.8833, lon: 89.5167 },
      { id: "kahaloo", name: "Kahaloo", bnName: "কাহালু", lat: 24.8333, lon: 89.2667 },
      { id: "nandigram", name: "Nandigram", bnName: "নন্দীগ্রাম", lat: 24.6833, lon: 89.2167 },
      { id: "sariakandi", name: "Sariakandi (Char)", bnName: "সারিয়াকান্দি (চরাঞ্চল)", lat: 24.8833, lon: 89.6167 },
      { id: "shajahanpur", name: "Shajahanpur", bnName: "শাজাহানপুর", lat: 24.7667, lon: 89.3833 },
      { id: "sherpur_b", name: "Sherpur", bnName: "শেরপুর", lat: 24.6667, lon: 89.4167 },
      { id: "shibganj_b", name: "Shibganj", bnName: "শিবগঞ্জ", lat: 25.0000, lon: 89.3167 },
      { id: "sonatala", name: "Sonatala", bnName: "সোনাতলা", lat: 25.0500, lon: 89.5000 }
    ]
  },
  {
    id: "pabna",
    name: "Pabna",
    bnName: "পাবনা",
    divisionId: "rajshahi",
    divisionName: "Rajshahi",
    divisionBnName: "রাজশাহী",
    lat: 24.0064,
    lon: 89.2372,
    aeZone: "High & Low Ganges Floodplain",
    aeZoneBn: "গঙ্গা ও চলনবিল প্লাবনভূমি",
    primaryCrops: ["onion", "mustard", "boro_rice", "garlic"],
    upazilas: [
      { id: "pabna_sadar", name: "Pabna Sadar", bnName: "পাবনা সদর", lat: 24.0064, lon: 89.2372 },
      { id: "atgharia", name: "Atgharia", bnName: "আটঘরিয়া", lat: 24.1333, lon: 89.2500 },
      { id: "bera", name: "Bera", bnName: "বেড়া", lat: 24.0667, lon: 89.6167 },
      { id: "bhangura", name: "Bhangura (Chalan Beel)", bnName: "ভাঙ্গুড়া (চলনবিল)", lat: 24.2167, lon: 89.3833 },
      { id: "chatmohar", name: "Chatmohar (Chalan Beel)", bnName: "চাটমোহর (চলনবিল)", lat: 24.2333, lon: 89.2833 },
      { id: "faridpur_p", name: "Faridpur", bnName: "ফরিদপুর", lat: 24.1667, lon: 89.4500 },
      { id: "ishwardi", name: "Ishwardi", bnName: "ঈশ্বরদী", lat: 24.1500, lon: 89.0667 },
      { id: "santhia", name: "Santhia", bnName: "সাঁথিয়া", lat: 24.0667, lon: 89.5333 },
      { id: "sujanagar", name: "Sujanagar", bnName: "সুজানগর", lat: 23.9167, lon: 89.4333 }
    ]
  },
  {
    id: "sirajganj",
    name: "Sirajganj",
    bnName: "সিরাজগঞ্জ",
    divisionId: "rajshahi",
    divisionName: "Rajshahi",
    divisionBnName: "রাজশাহী",
    lat: 24.4534,
    lon: 89.7008,
    aeZone: "Active Jamuna & Karatoya Floodplain",
    aeZoneBn: "যমুনা চর ও চলনবিল অঞ্চল",
    primaryCrops: ["mustard", "boro_rice", "dairy_fodder", "jute"],
    upazilas: [
      { id: "sirajganj_sadar", name: "Sirajganj Sadar", bnName: "সিরাজগঞ্জ সদর", lat: 24.4534, lon: 89.7008 },
      { id: "belkuchi", name: "Belkuchi", bnName: "বেলকুচি", lat: 24.2833, lon: 89.7000 },
      { id: "chauhali", name: "Chauhali", bnName: "চৌহালী", lat: 24.2167, lon: 89.7333 },
      { id: "kamarkhanda", name: "Kamarkhanda", bnName: "কামারখন্দ", lat: 24.3667, lon: 89.6500 },
      { id: "kazipur", name: "Kazipur (Char)", bnName: "কাজীপুর (চরাঞ্চল)", lat: 24.6667, lon: 89.6500 },
      { id: "rayganj", name: "Rayganj", bnName: "রায়গঞ্জ", lat: 24.5000, lon: 89.5333 },
      { id: "shahjadpur", name: "Shahjadpur", bnName: "শাহজাদপুর", lat: 24.1833, lon: 89.6000 },
      { id: "tarash", name: "Tarash (Chalan Beel)", bnName: "তাড়াশ (চলনবিল)", lat: 24.4333, lon: 89.3833 },
      { id: "ullapara", name: "Ullapara", bnName: "উল্লাপাড়া", lat: 24.3167, lon: 89.5667 }
    ]
  },
  {
    id: "naogaon",
    name: "Naogaon",
    bnName: "নওগাঁ",
    divisionId: "rajshahi",
    divisionName: "Rajshahi",
    divisionBnName: "রাজশাহী",
    lat: 24.7936,
    lon: 88.9318,
    aeZone: "High & Level Barind Tract",
    aeZoneBn: "উচ্চ ও সমতল বরেন্দ্র অঞ্চল",
    primaryCrops: ["boro_rice", "aman_rice", "mango", "mustard"],
    upazilas: [
      { id: "naogaon_sadar", name: "Naogaon Sadar", bnName: "নওগাঁ সদর", lat: 24.7936, lon: 88.9318 },
      { id: "atrai", name: "Atrai", bnName: "আত্রাই", lat: 24.6167, lon: 88.9667 },
      { id: "badalgachhi", name: "Badalgachhi", bnName: "বদলগাছী", lat: 24.9667, lon: 88.9000 },
      { id: "dhamoirhat", name: "Dhamoirhat", bnName: "ধামইরহাট", lat: 25.1333, lon: 88.8500 },
      { id: "manda", name: "Manda", bnName: "মান্দা", lat: 24.7833, lon: 88.6667 },
      { id: "mohadobpur", name: "Mohadevpur", bnName: "মহাদেবপুর", lat: 24.9167, lon: 88.7500 },
      { id: "niamatpur", name: "Niamatpur (Barind)", bnName: "নিয়ামতপুর (বরেন্দ্র)", lat: 24.8500, lon: 88.5667 },
      { id: "patnitala", name: "Patnitala", bnName: "পত্নীতলা", lat: 25.0500, lon: 88.7333 },
      { id: "porsha", name: "Porsha (Barind)", bnName: "পোরশা (বরেন্দ্র)", lat: 25.0333, lon: 88.4833 },
      { id: "raninagar", name: "Raninagar", bnName: "রাণীনগর", lat: 24.7333, lon: 88.9667 },
      { id: "sapahar", name: "Sapahar (Mango)", bnName: "সাপাহার (আম প্রধান)", lat: 25.1167, lon: 88.5833 }
    ]
  },
  {
    id: "natore",
    name: "Natore",
    bnName: "নাটোর",
    divisionId: "rajshahi",
    divisionName: "Rajshahi",
    divisionBnName: "রাজশাহী",
    lat: 24.4206,
    lon: 88.9324,
    aeZone: "Chalan Beel & High Ganges Floodplain",
    aeZoneBn: "চলনবিল ও গঙ্গা প্লাবনভূমি",
    primaryCrops: ["garlic", "sugarcane", "boro_rice", "fish_aquaculture"],
    upazilas: [
      { id: "natore_sadar", name: "Natore Sadar", bnName: "নাটোর সদর", lat: 24.4206, lon: 88.9324 },
      { id: "bagatipara", name: "Bagatipara", bnName: "বাগাতিপাড়া", lat: 24.3167, lon: 88.9500 },
      { id: "baraigram", name: "Baraigram", bnName: "বড়াইগ্রাম", lat: 24.3000, lon: 89.1667 },
      { id: "gurudaspur", name: "Gurudaspur (Chalan Beel)", bnName: "গুরুদাসপুর (চলনবিল)", lat: 24.3667, lon: 89.2500 },
      { id: "lalpur", name: "Lalpur", bnName: "লালপুর", lat: 24.1833, lon: 88.9833 },
      { id: "singra", name: "Singra (Chalan Beel)", bnName: "সিংড়া (চলনবিল)", lat: 24.5000, lon: 89.1500 }
    ]
  },
  {
    id: "chapainawabganj",
    name: "Chapainawabganj",
    bnName: "চাঁপাইনবাবগঞ্জ",
    divisionId: "rajshahi",
    divisionName: "Rajshahi",
    divisionBnName: "রাজশাহী",
    lat: 24.5965,
    lon: 88.2776,
    aeZone: "High Barind Tract & Active Ganges Floodplain",
    aeZoneBn: "আমের রাজধানী ও বরেন্দ্র অঞ্চল",
    primaryCrops: ["mango", "wheat", "boro_rice", "tomato"],
    upazilas: [
      { id: "chapainawabganj_sadar", name: "Chapainawabganj Sadar", bnName: "চাঁপাইনবাবগঞ্জ সদর", lat: 24.5965, lon: 88.2776 },
      { id: "bholahat", name: "Bholahat", bnName: "ভোলাহাট", lat: 24.9167, lon: 88.1833 },
      { id: "gomastapur", name: "Gomastapur", bnName: "গোমস্তাপুর", lat: 24.7833, lon: 88.2833 },
      { id: "nachole", name: "Nachole (Barind)", bnName: "নাচোল (বরেন্দ্র)", lat: 24.7333, lon: 88.4167 },
      { id: "shibganj_c", name: "Shibganj (Mango Hub)", bnName: "শিবগঞ্জ (আমের মোকাম)", lat: 24.6833, lon: 88.1667 }
    ]
  },
  {
    id: "joypurhat",
    name: "Joypurhat",
    bnName: "জয়পুরহাট",
    divisionId: "rajshahi",
    divisionName: "Rajshahi",
    divisionBnName: "রাজশাহী",
    lat: 25.1015,
    lon: 89.0277,
    aeZone: "Level Barind Tract",
    aeZoneBn: "সমতল বরেন্দ্র অঞ্চল",
    primaryCrops: ["potato", "boro_rice", "sugarcane", "poultry_feed"],
    upazilas: [
      { id: "joypurhat_sadar", name: "Joypurhat Sadar", bnName: "জয়পুরহাট সদর", lat: 25.1015, lon: 89.0277 },
      { id: "akkelpur", name: "Akkelpur", bnName: "আক্কেলপুর", lat: 24.9667, lon: 89.0167 },
      { id: "kalai", name: "Kalai", bnName: "কালাই", lat: 25.0667, lon: 89.1833 },
      { id: "khetlal", name: "Khetlal", bnName: "ক্ষেতলাল", lat: 24.9833, lon: 89.1500 },
      { id: "panchbibi", name: "Panchbibi", bnName: "পাঁচবিবি", lat: 25.2000, lon: 89.0167 }
    ]
  },

  // --- KHULNA DIVISION ---
  {
    id: "khulna",
    name: "Khulna",
    bnName: "খুলনা",
    divisionId: "khulna",
    divisionName: "Khulna",
    divisionBnName: "খুলনা",
    lat: 22.8456,
    lon: 89.5403,
    aeZone: "Ganges Tidal Floodplain & Saline Soils",
    aeZoneBn: "লবণাক্ত জোয়ারভাটা প্লাবনভূমি",
    primaryCrops: ["shrimp_aquaculture", "aman_rice", "watermelon", "sesame"],
    upazilas: [
      { id: "batiaghata", name: "Batiaghata", bnName: "বটিয়াঘাটা", lat: 22.7500, lon: 89.5167 },
      { id: "dacope", name: "Dacope (Sundarbans)", bnName: "দাকোপ (সুন্দরবন সংলগ্ন)", lat: 22.5667, lon: 89.5167 },
      { id: "dumuria", name: "Dumuria", bnName: "ডুমুরিয়া", lat: 22.8000, lon: 89.4167 },
      { id: "koyra", name: "Koyra (Coastal)", bnName: "কয়রা (উপকূলীয়)", lat: 22.3333, lon: 89.3000 },
      { id: "paikgachha", name: "Paikgachha", bnName: "পাইকগাছা", lat: 22.5833, lon: 89.3333 },
      { id: "phultala", name: "Phultala", bnName: "ফুলতলা", lat: 22.9667, lon: 89.4667 },
      { id: "rupsha", name: "Rupsha", bnName: "রূপসা", lat: 22.8333, lon: 89.5833 },
      { id: "terokhada", name: "Terokhada", bnName: "তেরখাদা", lat: 22.9500, lon: 89.6667 }
    ]
  },
  {
    id: "jashore",
    name: "Jashore",
    bnName: "যশোর",
    divisionId: "khulna",
    divisionName: "Khulna",
    divisionBnName: "খুলনা",
    lat: 23.1664,
    lon: 89.2081,
    aeZone: "High Ganges River Floodplain (Vegetable & Flower Capital)",
    aeZoneBn: "সবজি ও ফুলের রাজধানী",
    primaryCrops: ["vegetables", "flowers", "boro_rice", "jute"],
    upazilas: [
      { id: "jashore_sadar", name: "Jashore Sadar", bnName: "যশোর সদর", lat: 23.1664, lon: 89.2081 },
      { id: "abhaynagar", name: "Abhaynagar", bnName: "অভয়নগর", lat: 23.0167, lon: 89.4333 },
      { id: "bagherpara", name: "Bagherpara", bnName: "বাঘারপাড়া", lat: 23.2167, lon: 89.3500 },
      { id: "chaugachha", name: "Chaugachha", bnName: "চৌগাছা", lat: 23.2667, lon: 89.0167 },
      { id: "jhikargachha", name: "Jhikargachha (Gadkhali Flower)", bnName: "ঝিকরগাছা (গদখালী ফুল বাজার)", lat: 23.1000, lon: 89.1333 },
      { id: "keshabpur", name: "Keshabpur", bnName: "কেশবপুর", lat: 22.9000, lon: 89.2167 },
      { id: "manirampur", name: "Manirampur", bnName: "মণিরামপুর", lat: 23.0167, lon: 89.2333 },
      { id: "sharsha", name: "Sharsha (Benapole)", bnName: "শার্শা (বেনাপোল)", lat: 23.0667, lon: 88.9333 }
    ]
  },
  {
    id: "satkhira",
    name: "Satkhira",
    bnName: "সাতক্ষীরা",
    divisionId: "khulna",
    divisionName: "Khulna",
    divisionBnName: "খুলনা",
    lat: 22.7185,
    lon: 89.0705,
    aeZone: "Ganges Tidal Plain & Coastal Salinity Zone",
    aeZoneBn: "উপকূলীয় লবণাক্ত অঞ্চল ও সুন্দরবন",
    primaryCrops: ["mango_himsagar", "shrimp", "aman_rice", "mustard"],
    upazilas: [
      { id: "satkhira_sadar", name: "Satkhira Sadar", bnName: "সাতক্ষীরা সদর", lat: 22.7185, lon: 89.0705 },
      { id: "assasuni", name: "Assasuni", bnName: "আশাশুনি", lat: 22.5500, lon: 89.1833 },
      { id: "debhata", name: "Debhata", bnName: "দেবহাটা", lat: 22.5667, lon: 88.9667 },
      { id: "kalaroa", name: "Kalaroa", bnName: "কলারোয়া", lat: 22.8667, lon: 89.0333 },
      { id: "kaliganj_s", name: "Kaliganj", bnName: "কালীগঞ্জ", lat: 22.4500, lon: 89.0333 },
      { id: "shyamnagar", name: "Shyamnagar (Coastal)", bnName: "শ্যামনগর (উপকূলীয়)", lat: 22.3333, lon: 89.1000 },
      { id: "tala", name: "Tala", bnName: "তালা", lat: 22.7500, lon: 89.2500 }
    ]
  },
  {
    id: "kushtia",
    name: "Kushtia",
    bnName: "কুষ্টিয়া",
    divisionId: "khulna",
    divisionName: "Khulna",
    divisionBnName: "খুলনা",
    lat: 23.9013,
    lon: 89.1205,
    aeZone: "High Ganges River Floodplain",
    aeZoneBn: "উচ্চ গঙ্গা নদী প্লাবনভূমি",
    primaryCrops: ["tobacco", "boro_rice", "sesame", "onion"],
    upazilas: [
      { id: "kushtia_sadar", name: "Kushtia Sadar", bnName: "কুষ্টিয়া সদর", lat: 23.9013, lon: 89.1205 },
      { id: "bheramara", name: "Bheramara", bnName: "ভেড়ামারা", lat: 24.0167, lon: 88.9833 },
      { id: "daulatpur_k", name: "Daulatpur", bnName: "দৌলতপুর", lat: 24.0000, lon: 88.8500 },
      { id: "khoksa", name: "Khoksa", bnName: "খোকসা", lat: 23.8000, lon: 89.2833 },
      { id: "kumarkhali", name: "Kumarkhali", bnName: "কুমারখালী", lat: 23.8667, lon: 89.2333 },
      { id: "mirpur_k", name: "Mirpur", bnName: "মিরপুর", lat: 23.9333, lon: 88.9833 }
    ]
  },
  {
    id: "jhenaidah",
    name: "Jhenaidah",
    bnName: "ঝিনাইদহ",
    divisionId: "khulna",
    divisionName: "Khulna",
    divisionBnName: "খুলনা",
    lat: 23.5450,
    lon: 89.1526,
    aeZone: "High Ganges Floodplain",
    aeZoneBn: "গঙ্গা উচ্চ প্লাবনভূমি",
    primaryCrops: ["banana", "vegetables", "boro_rice", "mustard"],
    upazilas: [
      { id: "jhenaidah_sadar", name: "Jhenaidah Sadar", bnName: "ঝিনাইদহ সদর", lat: 23.5450, lon: 89.1526 },
      { id: "harinakunda", name: "Harinakunda", bnName: "হরিণাকুণ্ডু", lat: 23.6333, lon: 89.0500 },
      { id: "kaliganj_jh", name: "Kaliganj", bnName: "কালীগঞ্জ", lat: 23.4000, lon: 89.1333 },
      { id: "kotchandpur", name: "Kotchandpur", bnName: "কোটচাঁদপুর", lat: 23.4000, lon: 89.0167 },
      { id: "maheshpur", name: "Maheshpur", bnName: "মহেশপুর", lat: 23.3500, lon: 88.9167 },
      { id: "shailkupa", name: "Shailkupa", bnName: "শৈলকুপা", lat: 23.6833, lon: 89.2500 }
    ]
  },
  {
    id: "chuadanga",
    name: "Chuadanga",
    bnName: "চুয়াডাঙ্গা",
    divisionId: "khulna",
    divisionName: "Khulna",
    divisionBnName: "খুলনা",
    lat: 23.6402,
    lon: 88.8418,
    aeZone: "High Ganges Floodplain (Extreme Temperature Zone)",
    aeZoneBn: "উচ্চ তাপমাত্রা ও গঙ্গা সমভূমি",
    primaryCrops: ["corn_maize", "mango", "sugarcane", "boro_rice"],
    upazilas: [
      { id: "chuadanga_sadar", name: "Chuadanga Sadar", bnName: "চুয়াডাঙ্গা সদর", lat: 23.6402, lon: 88.8418 },
      { id: "alamdanga", name: "Alamdanga", bnName: "আলমডাঙ্গা", lat: 23.7667, lon: 88.9500 },
      { id: "damurhuda", name: "Damurhuda", bnName: "দামুড়হুদা", lat: 23.6167, lon: 88.7833 },
      { id: "jibannagar", name: "Jibannagar", bnName: "জীবননগর", lat: 23.4167, lon: 88.8167 }
    ]
  },
  {
    id: "meherpur",
    name: "Meherpur",
    bnName: "মেহেরপুর",
    divisionId: "khulna",
    divisionName: "Khulna",
    divisionBnName: "খুলনা",
    lat: 23.7712,
    lon: 88.6318,
    aeZone: "High Ganges Floodplain",
    aeZoneBn: "গঙ্গা সমভূমি",
    primaryCrops: ["corn_maize", "jute", "garlic", "banana"],
    upazilas: [
      { id: "meherpur_sadar", name: "Meherpur Sadar", bnName: "মেহেরপুর সদর", lat: 23.7712, lon: 88.6318 },
      { id: "gangni", name: "Gangni", bnName: "গাংনী", lat: 23.8000, lon: 88.7500 },
      { id: "mujibnagar", name: "Mujibnagar", bnName: "মুজিবনগর", lat: 23.6500, lon: 88.6000 }
    ]
  },
  {
    id: "bagerhat",
    name: "Bagerhat",
    bnName: "বাগেরহাট",
    divisionId: "khulna",
    divisionName: "Khulna",
    divisionBnName: "খুলনা",
    lat: 22.6516,
    lon: 89.7859,
    aeZone: "Ganges Tidal Floodplain & Mangrove Margin",
    aeZoneBn: "জোয়ারভাটা প্লাবনভূমি ও সুন্দরবন সীমান্ত",
    primaryCrops: ["betel_nut", "coconut", "shrimp", "aman_rice"],
    upazilas: [
      { id: "bagerhat_sadar", name: "Bagerhat Sadar", bnName: "বাগেরহাট সদর", lat: 22.6516, lon: 89.7859 },
      { id: "chitalmari", name: "Chitalmari", bnName: "চিতলমারী", lat: 22.7833, lon: 89.8667 },
      { id: "fakirhat", name: "Fakirhat", bnName: "ফকিরহাট", lat: 22.7833, lon: 89.7000 },
      { id: "kachua_b", name: "Kachua", bnName: "কচুয়া", lat: 22.6500, lon: 89.8833 },
      { id: "mollahat", name: "Mollahat", bnName: "মোল্লাহাট", lat: 22.9333, lon: 89.8167 },
      { id: "mongla", name: "Mongla (Port)", bnName: "মোংলা (বন্দর)", lat: 22.4833, lon: 89.6000 },
      { id: "morrelganj", name: "Morrelganj", bnName: "মোরেলগঞ্জ", lat: 22.4500, lon: 89.8500 },
      { id: "rampal", name: "Rampal", bnName: "রামপাল", lat: 22.5667, lon: 89.6667 },
      { id: "sarankhola", name: "Sarankhola", bnName: "শরণখোলা", lat: 22.3000, lon: 89.7833 }
    ]
  },
  {
    id: "magura",
    name: "Magura",
    bnName: "মাগুরা",
    divisionId: "khulna",
    divisionName: "Khulna",
    divisionBnName: "খুলনা",
    lat: 23.4873,
    lon: 89.4199,
    aeZone: "Middle & Low Ganges Floodplain",
    aeZoneBn: "মধ্য গঙ্গা প্লাবনভূমি",
    primaryCrops: ["mustard", "boro_rice", "jute", "vegetables"],
    upazilas: [
      { id: "magura_sadar", name: "Magura Sadar", bnName: "মাগুরা সদর", lat: 23.4873, lon: 89.4199 },
      { id: "mohammadpur", name: "Mohammadpur", bnName: "মহম্মদপুর", lat: 23.4000, lon: 89.6000 },
      { id: "shalikha", name: "Shalikha", bnName: "শালিখা", lat: 23.3500, lon: 89.3333 },
      { id: "sreepur_m", name: "Sreepur", bnName: "শ্রীপুর", lat: 23.6000, lon: 89.4333 }
    ]
  },
  {
    id: "narail",
    name: "Narail",
    bnName: "নড়াইল",
    divisionId: "khulna",
    divisionName: "Khulna",
    divisionBnName: "খুলনা",
    lat: 23.1725,
    lon: 89.5127,
    aeZone: "Low Ganges River Floodplain",
    aeZoneBn: "নিম্ন গঙ্গা প্লাবনভূমি",
    primaryCrops: ["boro_rice", "jute", "fish", "mustard"],
    upazilas: [
      { id: "narail_sadar", name: "Narail Sadar", bnName: "নড়াইল সদর", lat: 23.1725, lon: 89.5127 },
      { id: "kalia", name: "Kalia", bnName: "কালিয়া", lat: 23.0333, lon: 89.6333 },
      { id: "lohagagara", name: "Lohagara", bnName: "লোহাগড়া", lat: 23.1833, lon: 89.6500 }
    ]
  },

  // --- BARISHAL DIVISION ---
  {
    id: "barishal",
    name: "Barishal",
    bnName: "বরিশাল",
    divisionId: "barishal",
    divisionName: "Barishal",
    divisionBnName: "বরিশাল",
    lat: 22.7010,
    lon: 90.3535,
    aeZone: "Ganges Tidal Floodplain (Non-saline)",
    aeZoneBn: "জোয়ারভাটা প্লাবনভূমি (স্বাদুপানি)",
    primaryCrops: ["aman_rice", "guava", "betel_leaf", "boro_rice"],
    upazilas: [
      { id: "barishal_sadar", name: "Barishal Sadar", bnName: "বরিশাল সদর", lat: 22.7010, lon: 90.3535 },
      { id: "agailjhara", name: "Agailjhara", bnName: "আগৈলঝাড়া", lat: 22.9667, lon: 90.1500 },
      { id: "babuganj", name: "Babuganj", bnName: "বাবুগঞ্জ", lat: 22.8333, lon: 90.3167 },
      { id: "bakerganj", name: "Bakerganj", bnName: "বাকেরগঞ্জ", lat: 22.5500, lon: 90.3333 },
      { id: "banaripara", name: "Banaripara (Floating Guava)", bnName: "বানারীপাড়া (ভাসমান পেয়ারা বাজার)", lat: 22.7833, lon: 90.1667 },
      { id: "gaurnadi", name: "Gaurnadi", bnName: "গৌরনদী", lat: 22.9667, lon: 90.2333 },
      { id: "hizla", name: "Hizla", bnName: "হিজলা", lat: 22.9000, lon: 90.5000 },
      { id: "mehendiganj", name: "Mehendiganj", bnName: "মেহেন্দীগঞ্জ", lat: 22.8167, lon: 90.5333 },
      { id: "muladi", name: "Muladi", bnName: "মুলাদী", lat: 22.9167, lon: 90.4167 },
      { id: "wazirpur", name: "Wazirpur", bnName: "উজিরপুর", lat: 22.8167, lon: 90.2333 }
    ]
  },
  {
    id: "patuakhali",
    name: "Patuakhali",
    bnName: "পটুয়াখালী",
    divisionId: "barishal",
    divisionName: "Barishal",
    divisionBnName: "বরিশাল",
    lat: 22.3596,
    lon: 90.3299,
    aeZone: "Ganges Tidal Floodplain (Saline coastal)",
    aeZoneBn: "উপকূলীয় জোয়ারভাটা অঞ্চল",
    primaryCrops: ["watermelon", "aman_rice", "mungbean", "chilli"],
    upazilas: [
      { id: "patuakhali_sadar", name: "Patuakhali Sadar", bnName: "পটুয়াখালী সদর", lat: 22.3596, lon: 90.3299 },
      { id: "bauphal", name: "Bauphal", bnName: "বাউফল", lat: 22.4167, lon: 90.5667 },
      { id: "dashmina", name: "Dashmina", bnName: "দশমিনা", lat: 22.2833, lon: 90.5833 },
      { id: "dumki", name: "Dumki", bnName: "দুমকি", lat: 22.4500, lon: 90.3833 },
      { id: "galachipa", name: "Galachipa", bnName: "গলাচিপা", lat: 22.1667, lon: 90.4167 },
      { id: "kalapara", name: "Kalapara (Kuakata)", bnName: "কলাপাড়া (কুয়াকাটা)", lat: 21.9833, lon: 90.2333 },
      { id: "mirzaganj", name: "Mirzaganj", bnName: "মির্জাগঞ্জ", lat: 22.3667, lon: 90.2333 },
      { id: "rangabali", name: "Rangabali (Coastal Island)", bnName: "রাঙ্গাবালী (উপকূলীয় চরাঞ্চল)", lat: 21.9167, lon: 90.4667 }
    ]
  },
  {
    id: "bhola",
    name: "Bhola",
    bnName: "ভোলা",
    divisionId: "barishal",
    divisionName: "Barishal",
    divisionBnName: "বরিশাল",
    lat: 22.6859,
    lon: 90.6481,
    aeZone: "Young Meghna Estuarine Floodplain (Island District)",
    aeZoneBn: "মেঘনা মোহনা দ্বীপ জেলা",
    primaryCrops: ["buffalo_dairy", "chilli", "peanut", "aman_rice"],
    upazilas: [
      { id: "bhola_sadar", name: "Bhola Sadar", bnName: "ভোলা সদর", lat: 22.6859, lon: 90.6481 },
      { id: "burhanuddin", name: "Burhanuddin", bnName: "বোরহানউদ্দিন", lat: 22.5000, lon: 90.7167 },
      { id: "char_fasson", name: "Char Fasson", bnName: "চরফ্যাশন", lat: 22.1833, lon: 90.7500 },
      { id: "daulatkhan", name: "Daulatkhan", bnName: "দৌলতখান", lat: 22.6000, lon: 90.7667 },
      { id: "lalmohan", name: "Lalmohan", bnName: "লালমোহন", lat: 22.3333, lon: 90.7333 },
      { id: "manpura", name: "Manpura (Island)", bnName: "মনপুরা (দ্বীপ)", lat: 22.3000, lon: 90.9667 },
      { id: "tazumuddin", name: "Tazumuddin", bnName: "তজুমদ্দিন", lat: 22.4167, lon: 90.8333 }
    ]
  },
  {
    id: "pirojpur",
    name: "Pirojpur",
    bnName: "পিরোজপুর",
    divisionId: "barishal",
    divisionName: "Barishal",
    divisionBnName: "বরিশাল",
    lat: 22.5841,
    lon: 89.9720,
    aeZone: "Ganges Tidal Floodplain",
    aeZoneBn: "জোয়ারভাটা প্লাবনভূমি",
    primaryCrops: ["coconut", "betel_nut", "aman_rice", "hog_plum"],
    upazilas: [
      { id: "pirojpur_sadar", name: "Pirojpur Sadar", bnName: "পিরোজপুর সদর", lat: 22.5841, lon: 89.9720 },
      { id: "bhandaria", name: "Bhandaria", bnName: "ভাণ্ডারিয়া", lat: 22.4833, lon: 90.0667 },
      { id: "kawkhali_p", name: "Kawkhali", bnName: "কাউখালী", lat: 22.6167, lon: 90.0667 },
      { id: "mathbaria", name: "Mathbaria", bnName: "মঠবাড়িয়া", lat: 22.2833, lon: 89.9667 },
      { id: "nazirpur", name: "Nazirpur", bnName: "নাজিরপুর", lat: 22.7167, lon: 90.0000 },
      { id: "nesarabad", name: "Nesarabad (Swarupkathi Timber & Guava)", bnName: "স্বরূপকাঠি (ভাসমান বাগান)", lat: 22.7500, lon: 90.1000 },
      { id: "indurkani", name: "Indurkani", bnName: "ইন্দুরকানী", lat: 22.4667, lon: 89.9833 }
    ]
  },
  {
    id: "barguna",
    name: "Barguna",
    bnName: "বরগুনা",
    divisionId: "barishal",
    divisionName: "Barishal",
    divisionBnName: "বরিশাল",
    lat: 22.1587,
    lon: 90.1256,
    aeZone: "Ganges Tidal Floodplain (Coastal)",
    aeZoneBn: "উপকূলীয় জোয়ারভাটা অঞ্চল",
    primaryCrops: ["watermelon", "mungbean", "aman_rice", "khesari"],
    upazilas: [
      { id: "barguna_sadar", name: "Barguna Sadar", bnName: "বরগুনা সদর", lat: 22.1587, lon: 90.1256 },
      { id: "amtali", name: "Amtali", bnName: "আমতলী", lat: 22.1333, lon: 90.2333 },
      { id: "bamna", name: "Bamna", bnName: "বামনা", lat: 22.3000, lon: 90.0833 },
      { id: "betagi", name: "Betagi", bnName: "বেতাগী", lat: 22.4167, lon: 90.1667 },
      { id: "patharghata", name: "Patharghata (Coastal Port)", bnName: "পাথরঘাটা (উপকূলীয় মৎস্য মোকাম)", lat: 22.0500, lon: 89.9667 },
      { id: "taltali", name: "Taltali", bnName: "তালতলী", lat: 22.0167, lon: 90.1833 }
    ]
  },
  {
    id: "jhalokathi",
    name: "Jhalokathi",
    bnName: "ঝালকাঠি",
    divisionId: "barishal",
    divisionName: "Barishal",
    divisionBnName: "বরিশাল",
    lat: 22.6406,
    lon: 90.1987,
    aeZone: "Ganges Tidal Floodplain",
    aeZoneBn: "জোয়ারভাটা অঞ্চল",
    primaryCrops: ["guava", "hog_plum", "boro_rice", "coconut"],
    upazilas: [
      { id: "jhalokathi_sadar", name: "Jhalokathi Sadar", bnName: "ঝালকাঠি সদর", lat: 22.6406, lon: 90.1987 },
      { id: "kathalia", name: "Kathalia", bnName: "কাঠালিয়া", lat: 22.4167, lon: 90.1333 },
      { id: "nalchhiti", name: "Nalchhiti", bnName: "নলছিটি", lat: 22.6000, lon: 90.2667 },
      { id: "rajapur", name: "Rajapur", bnName: "রাজাপুর", lat: 22.5500, lon: 90.1333 }
    ]
  },

  // --- SYLHET DIVISION ---
  {
    id: "sylhet",
    name: "Sylhet",
    bnName: "সিলেট",
    divisionId: "sylhet",
    divisionName: "Sylhet",
    divisionBnName: "সিলেট",
    lat: 24.8949,
    lon: 91.8687,
    aeZone: "Eastern Surma-Kushiyara Floodplain & Hills",
    aeZoneBn: "সুরমা-কুশিয়ারা ও পাহাড়ি চা বাগান",
    primaryCrops: ["tea", "citrus_fruits", "boro_rice", "aman_rice"],
    upazilas: [
      { id: "sylhet_sadar", name: "Sylhet Sadar", bnName: "সিলেট সদর", lat: 24.8949, lon: 91.8687 },
      { id: "balaganj", name: "Balaganj", bnName: "বালাগঞ্জ", lat: 24.6667, lon: 91.8333 },
      { id: "beanibazar", name: "Beanibazar", bnName: "বিয়ানীবাজার", lat: 24.8333, lon: 92.1667 },
      { id: "bishwanath", name: "Bishwanath", bnName: "বিশ্বনাথ", lat: 24.7833, lon: 91.7333 },
      { id: "companiganj_s", name: "Companiganj (Bholaganj)", bnName: "কোম্পানীগঞ্জ (ভোলাগঞ্জ)", lat: 25.0833, lon: 91.7500 },
      { id: "fenchuganj", name: "Fenchuganj", bnName: "ফেঞ্চুগঞ্জ", lat: 24.7167, lon: 91.9500 },
      { id: "golapganj", name: "Golapganj", bnName: "গোলাপগঞ্জ", lat: 24.8667, lon: 92.0167 },
      { id: "gowainghat", name: "Gowainghat (Jaflong)", bnName: "গোয়াইনঘাট (জাফলং)", lat: 25.1000, lon: 92.0000 },
      { id: "jaintiapur", name: "Jaintiapur", bnName: "জৈন্তাপুর", lat: 25.1333, lon: 92.1167 },
      { id: "kanaighat", name: "Kanaighat", bnName: "কানাইঘাট", lat: 25.0167, lon: 92.2667 },
      { id: "zakiganj", name: "Zakiganj", bnName: "জকিগঞ্জ", lat: 24.8833, lon: 92.3667 }
    ]
  },
  {
    id: "moulvibazar",
    name: "Moulvibazar",
    bnName: "মৌলভীবাজার",
    divisionId: "sylhet",
    divisionName: "Sylhet",
    divisionBnName: "সিলেট",
    lat: 24.4829,
    lon: 91.7774,
    aeZone: "Sylhet Hills & Haor Basin (Tea Capital)",
    aeZoneBn: "চায়ের রাজধানী ও হাইল হাওর",
    primaryCrops: ["tea", "pineapple", "lemon", "haor_boro_rice"],
    upazilas: [
      { id: "moulvibazar_sadar", name: "Moulvibazar Sadar", bnName: "মৌলভীবাজার সদর", lat: 24.4829, lon: 91.7774 },
      { id: "barlekha", name: "Barlekha (Hakaluki Haor)", bnName: "বড়লেখা (হাকালুকি হাওর)", lat: 24.7000, lon: 92.2000 },
      { id: "kamalganj", name: "Kamalganj", bnName: "কমলগঞ্জ", lat: 24.3667, lon: 91.8667 },
      { id: "kulaura", name: "Kulaura", bnName: "কুলাউড়া", lat: 24.5167, lon: 92.0333 },
      { id: "rajanagar", name: "Rajnagar", bnName: "রাজনগর", lat: 24.5667, lon: 91.8667 },
      { id: "sreemangal", name: "Sreemangal (Tea Valley)", bnName: "শ্রীমঙ্গল (চা উপত্যকা)", lat: 24.3000, lon: 91.7333 },
      { id: "juri", name: "Juri", bnName: "জুড়ী", lat: 24.6000, lon: 92.1167 }
    ]
  },
  {
    id: "habiganj",
    name: "Habiganj",
    bnName: "হবিগঞ্জ",
    divisionId: "sylhet",
    divisionName: "Sylhet",
    divisionBnName: "সিলেট",
    lat: 24.3749,
    lon: 91.4155,
    aeZone: "Eastern Surma Floodplain & Haor Basin",
    aeZoneBn: "হাওর ও সমভূমি অঞ্চল",
    primaryCrops: ["boro_rice", "tea", "vegetables", "mustard"],
    upazilas: [
      { id: "habiganj_sadar", name: "Habiganj Sadar", bnName: "হবিগঞ্জ সদর", lat: 24.3749, lon: 91.4155 },
      { id: "ajmiriganj", name: "Ajmiriganj (Deep Haor)", bnName: "আজমিরীগঞ্জ (গভীর হাওর)", lat: 24.5500, lon: 91.2500 },
      { id: "bahubal", name: "Bahubal", bnName: "বাহুবল", lat: 24.3500, lon: 91.5500 },
      { id: "baniyachong", name: "Baniyachong (Largest Village)", bnName: "বানিয়াচং (বৃহত্তম গ্রাম)", lat: 24.5333, lon: 91.3667 },
      { id: "chunarughat", name: "Chunarughat", bnName: "চুনারুঘাট", lat: 24.2167, lon: 91.5167 },
      { id: "lakhai", name: "Lakhai", bnName: "লাখাই", lat: 24.2833, lon: 91.2167 },
      { id: "madhabpur", name: "Madhabpur", bnName: "মাধবপুর", lat: 24.1833, lon: 91.3000 },
      { id: "nabiganj", name: "Nabiganj", bnName: "নবীগঞ্জ", lat: 24.5667, lon: 91.5167 }
    ]
  },
  {
    id: "sunamganj",
    name: "Sunamganj",
    bnName: "সুনামগঞ্জ",
    divisionId: "sylhet",
    divisionName: "Sylhet",
    divisionBnName: "সিলেট",
    lat: 25.0658,
    lon: 91.3950,
    aeZone: "Sylhet Basin (Primary Haor Wetland Zone)",
    aeZoneBn: "প্রধান হাওর অববাহিকা (আকস্মিক বন্যাপ্রবণ)",
    primaryCrops: ["haor_boro_rice", "indigenous_fish", "duck_farming"],
    upazilas: [
      { id: "sunamganj_sadar", name: "Sunamganj Sadar", bnName: "সুনামগঞ্জ সদর", lat: 25.0658, lon: 91.3950 },
      { id: "bishwambarpur", name: "Bishwambarpur", bnName: "বিশ্বম্ভরপুর", lat: 25.1833, lon: 91.3333 },
      { id: "chhatak", name: "Chhatak", bnName: "ছাতক", lat: 25.0333, lon: 91.6667 },
      { id: "derai", name: "Derai (Haor)", bnName: "দিরাই (হাওর)", lat: 24.7833, lon: 91.3500 },
      { id: "dharmapasha", name: "Dharmapasha (Tanguar Haor)", bnName: "ধর্মপাশা (টাঙ্গুয়ার হাওর)", lat: 24.9000, lon: 91.0167 },
      { id: "dowarabazar", name: "Dowarabazar", bnName: "দোয়ারাবাজার", lat: 25.0500, lon: 91.5667 },
      { id: "jagannathpur", name: "Jagannathpur", bnName: "জগন্নাথপুর", lat: 24.7667, lon: 91.5500 },
      { id: "jamalganj", name: "Jamalganj", bnName: "জামালগঞ্জ", lat: 24.9833, lon: 91.2333 },
      { id: "shantiganj", name: "Shantiganj", bnName: "শান্তিগঞ্জ", lat: 24.9000, lon: 91.4333 },
      { id: "tahirpur", name: "Tahirpur (Tanguar Haor)", bnName: "তাহিরপুর (টাঙ্গুয়ার হাওর)", lat: 25.2000, lon: 91.1833 }
    ]
  },

  // --- RANGPUR DIVISION ---
  {
    id: "rangpur",
    name: "Rangpur",
    bnName: "রংপুর",
    divisionId: "rangpur",
    divisionName: "Rangpur",
    divisionBnName: "রংপুর",
    lat: 25.7439,
    lon: 89.2752,
    aeZone: "Tista Meander Floodplain",
    aeZoneBn: "তিস্তা অববাহিকা প্লাবনভূমি",
    primaryCrops: ["potato", "tobacco", "boro_rice", "haribhanga_mango"],
    upazilas: [
      { id: "rangpur_sadar", name: "Rangpur Sadar", bnName: "রংপুর সদর", lat: 25.7439, lon: 89.2752 },
      { id: "badarganj", name: "Badarganj", bnName: "বদরগঞ্জ", lat: 25.6833, lon: 89.0500 },
      { id: "gangachhara", name: "Gangachhara (Tista Basin)", bnName: "গংগাচড়া (তিস্তা তীরবর্তী)", lat: 25.8500, lon: 89.2167 },
      { id: "kaunia", name: "Kaunia", bnName: "কাউনিয়া", lat: 25.7167, lon: 89.4167 },
      { id: "mithapukur", name: "Mithapukur (Haribhanga Mango)", bnName: "মিঠাপুকুর (হাঁড়িভাঙ্গা আম)", lat: 25.5833, lon: 89.2833 },
      { id: "pirgachha", name: "Pirgachha", bnName: "পীরগাছা", lat: 25.5833, lon: 89.4000 },
      { id: "pirganj_r", name: "Pirganj", bnName: "পীরগঞ্জ", lat: 25.4167, lon: 89.3167 },
      { id: "taraganj", name: "Taraganj", bnName: "তারাগঞ্জ", lat: 25.8167, lon: 89.0167 }
    ]
  },
  {
    id: "dinajpur",
    name: "Dinajpur",
    bnName: "দিনাজপুর",
    divisionId: "rangpur",
    divisionName: "Rangpur",
    divisionBnName: "রংপুর",
    lat: 25.6217,
    lon: 88.6355,
    aeZone: "Old Himalayan Piedmont Plain (Granary of North)",
    aeZoneBn: "উত্তরের শস্যভাণ্ডার ও লিচু প্রধান",
    primaryCrops: ["lychee", "kataribhog_rice", "maize", "wheat", "potato"],
    upazilas: [
      { id: "dinajpur_sadar", name: "Dinajpur Sadar", bnName: "দিনাজপুর সদর", lat: 25.6217, lon: 88.6355 },
      { id: "birampur", name: "Birampur", bnName: "বিরামপুর", lat: 25.2167, lon: 88.9833 },
      { id: "birganj", name: "Birganj", bnName: "বীরগঞ্জ", lat: 25.8500, lon: 88.6667 },
      { id: "bochaganj", name: "Bochaganj", bnName: "বোচাগঞ্জ", lat: 25.8000, lon: 88.4667 },
      { id: "fulbari_d", name: "Fulbari", bnName: "ফুলবাড়ী", lat: 25.5000, lon: 88.8833 },
      { id: "ghoraghat", name: "Ghoraghat", bnName: "ঘোড়াঘাট", lat: 25.2500, lon: 89.2167 },
      { id: "hakimpur", name: "Hakimpur (Hili)", bnName: "হাকিমপুর (হিলি)", lat: 25.2833, lon: 89.0167 },
      { id: "kaharole", name: "Kaharole", bnName: "কাহারোল", lat: 25.7833, lon: 88.6000 },
      { id: "khansama", name: "Khansama", bnName: "খানসামা", lat: 25.9333, lon: 88.7167 },
      { id: "nawabganj_d", name: "Nawabganj", bnName: "নবাবগঞ্জ", lat: 25.4167, lon: 89.0833 },
      { id: "parbatipur", name: "Parbatipur", bnName: "পার্বতীপুর", lat: 25.6667, lon: 88.9167 }
    ]
  },
  {
    id: "gaibandha",
    name: "Gaibandha",
    bnName: "গাইবান্ধা",
    divisionId: "rangpur",
    divisionName: "Rangpur",
    divisionBnName: "রংপুর",
    lat: 25.3288,
    lon: 89.5404,
    aeZone: "Tista & Active Brahmaputra Floodplain",
    aeZoneBn: "তিস্তা ও ব্রহ্মপুত্র চর অঞ্চল",
    primaryCrops: ["jute", "maize", "boro_rice", "chilli"],
    upazilas: [
      { id: "gaibandha_sadar", name: "Gaibandha Sadar", bnName: "গাইবান্ধা সদর", lat: 25.3288, lon: 89.5404 },
      { id: "fulchhari", name: "Fulchhari (Jamuna Char)", bnName: "ফুলছড়ি (যমুনা চরাঞ্চল)", lat: 25.1833, lon: 89.6167 },
      { id: "gobindaganj", name: "Gobindaganj", bnName: "গোবিন্দগঞ্জ", lat: 25.1333, lon: 89.3833 },
      { id: "palashbari", name: "Palashbari", bnName: "পলাশবাড়ী", lat: 25.2833, lon: 89.3500 },
      { id: "sadullapur", name: "Sadullapur", bnName: "সাদুল্লাপুর", lat: 25.3833, lon: 89.4667 },
      { id: "saghata", name: "Saghata (Char)", bnName: "সাঘাটা (চরাঞ্চল)", lat: 25.1000, lon: 89.5833 },
      { id: "sundarganj", name: "Sundarganj (Tista Basin)", bnName: "সুন্দরগঞ্জ (তিস্তা অববাহিকা)", lat: 25.5667, lon: 89.5167 }
    ]
  },
  {
    id: "kurigram",
    name: "Kurigram",
    bnName: "কুড়িগ্রাম",
    divisionId: "rangpur",
    divisionName: "Rangpur",
    divisionBnName: "রংপুর",
    lat: 25.8054,
    lon: 89.6362,
    aeZone: "Active Brahmaputra & Dharla Floodplain",
    aeZoneBn: "ধরলা ও ব্রহ্মপুত্র চর (বন্যা ও শীতপ্রবণ)",
    primaryCrops: ["maize", "groundnut", "potato", "boro_rice"],
    upazilas: [
      { id: "kurigram_sadar", name: "Kurigram Sadar", bnName: "কুড়িগ্রাম সদর", lat: 25.8054, lon: 89.6362 },
      { id: "bhurungamari", name: "Bhurungamari", bnName: "ভুরুঙ্গামারী", lat: 26.1333, lon: 89.6833 },
      { id: "char_rajibpur", name: "Char Rajibpur", bnName: "চর রাজিবপুর", lat: 25.4000, lon: 89.7833 },
      { id: "chilmari", name: "Chilmari (River Port)", bnName: "চিলমারী (নদীবন্দর)", lat: 25.5500, lon: 89.6833 },
      { id: "nageshwari", name: "Nageshwari", bnName: "নাগেশ্বরী", lat: 25.9667, lon: 89.6833 },
      { id: "phulbari_k", name: "Phulbari", bnName: "ফুলবাড়ী", lat: 25.9500, lon: 89.5667 },
      { id: "rajarhat", name: "Rajarhat", bnName: "রাজারহাট", lat: 25.8000, lon: 89.5500 },
      { id: "rowmari", name: "Rowmari", bnName: "রৌমারী", lat: 25.5667, lon: 89.8500 },
      { id: "ulipur", name: "Ulipur", bnName: "উলিপুর", lat: 25.6667, lon: 89.6333 }
    ]
  },
  {
    id: "lalmonirhat",
    name: "Lalmonirhat",
    bnName: "লালমনিরহাট",
    divisionId: "rangpur",
    divisionName: "Rangpur",
    divisionBnName: "রংপুর",
    lat: 25.9923,
    lon: 89.2847,
    aeZone: "Tista & Dharla Floodplain",
    aeZoneBn: "তিস্তা ও ধরলা সমভূমি",
    primaryCrops: ["tobacco", "maize", "potato", "chilli"],
    upazilas: [
      { id: "lalmonirhat_sadar", name: "Lalmonirhat Sadar", bnName: "লালমনিরহাট সদর", lat: 25.9923, lon: 89.2847 },
      { id: "aditmari", name: "Aditmari", bnName: "আদিতমারী", lat: 25.9167, lon: 89.3333 },
      { id: "hatibandha", name: "Hatibandha", bnName: "হাতীবান্ধা", lat: 26.1500, lon: 89.1333 },
      { id: "kaliganj_l", name: "Kaliganj", bnName: "কালীগঞ্জ", lat: 26.0000, lon: 89.2167 },
      { id: "patgram", name: "Patgram (Tin Bigha)", bnName: "পাটগ্রাম (তিনবিঘা করিডোর)", lat: 26.3500, lon: 89.0167 }
    ]
  },
  {
    id: "nilphamari",
    name: "Nilphamari",
    bnName: "নীলফামারী",
    divisionId: "rangpur",
    divisionName: "Rangpur",
    divisionBnName: "রংপুর",
    lat: 25.9318,
    lon: 88.8560,
    aeZone: "Tista Meander Floodplain",
    aeZoneBn: "তিস্তা সেচ অঞ্চল",
    primaryCrops: ["maize", "boro_rice", "potato", "ginger"],
    upazilas: [
      { id: "nilphamari_sadar", name: "Nilphamari Sadar", bnName: "নীলফামারী সদর", lat: 25.9318, lon: 88.8560 },
      { id: "dimla", name: "Dimla (Tista Barrage)", bnName: "ডিমলা (তিস্তা ব্যারাজ)", lat: 26.1333, lon: 88.9333 },
      { id: "domar", name: "Domar", bnName: "ডোমার", lat: 26.1000, lon: 88.8333 },
      { id: "jaldhaka", name: "Jaldhaka", bnName: "জলঢাকা", lat: 26.0167, lon: 88.9833 },
      { id: "kishoreganj_n", name: "Kishoreganj", bnName: "কিশোরগঞ্জ", lat: 25.9000, lon: 89.0333 },
      { id: "saidpur", name: "Saidpur", bnName: "সৈয়দপুর", lat: 25.7833, lon: 88.9000 }
    ]
  },
  {
    id: "panchagarh",
    name: "Panchagarh",
    bnName: "পঞ্চগড়",
    divisionId: "rangpur",
    divisionName: "Rangpur",
    divisionBnName: "রংপুর",
    lat: 26.3411,
    lon: 88.5542,
    aeZone: "Old Himalayan Piedmont (Plainland Tea & Extreme Cold)",
    aeZoneBn: "সমতল চা বাগান ও হিমালয় সংলগ্ন এলাকা",
    primaryCrops: ["plainland_tea", "watermelon", "potato", "peanut"],
    upazilas: [
      { id: "panchagarh_sadar", name: "Panchagarh Sadar", bnName: "পঞ্চগড় সদর", lat: 26.3411, lon: 88.5542 },
      { id: "atwari", name: "Atwari", bnName: "আটোয়ারী", lat: 26.3000, lon: 88.5000 },
      { id: "boda", name: "Boda", bnName: "বোদা", lat: 26.2000, lon: 88.6000 },
      { id: "debiganj", name: "Debiganj", bnName: "দেবীগঞ্জ", lat: 26.1167, lon: 88.7500 },
      { id: "tetulia", name: "Tetulia (Northernmost Peak)", bnName: "তেঁতুলিয়া (সর্বউত্তরের উপজেলা)", lat: 26.4833, lon: 88.3500 }
    ]
  },
  {
    id: "thakurgaon",
    name: "Thakurgaon",
    bnName: "ঠাকুরগাঁও",
    divisionId: "rangpur",
    divisionName: "Rangpur",
    divisionBnName: "রংপুর",
    lat: 26.0337,
    lon: 88.4617,
    aeZone: "Old Himalayan Piedmont Plain",
    aeZoneBn: "হিমালয় পাদদেশীয় সমভূমি",
    primaryCrops: ["wheat", "maize", "sugarcane", "potato"],
    upazilas: [
      { id: "thakurgaon_sadar", name: "Thakurgaon Sadar", bnName: "ঠাকুরগাঁও সদর", lat: 26.0337, lon: 88.4617 },
      { id: "baliadangi", name: "Baliadangi", bnName: "বালিয়াডাঙ্গী", lat: 26.1000, lon: 88.2833 },
      { id: "haripur", name: "Haripur", bnName: "হরিপুর", lat: 25.9667, lon: 88.1333 },
      { id: "pirganj_t", name: "Pirganj", bnName: "পীরগঞ্জ", lat: 25.8500, lon: 88.3667 },
      { id: "ranisankail", name: "Ranisankail", bnName: "রাণীশংকৈল", lat: 25.9500, lon: 88.2500 }
    ]
  },

  // --- MYMENSINGH DIVISION ---
  {
    id: "mymensingh",
    name: "Mymensingh",
    bnName: "ময়মনসিংহ",
    divisionId: "mymensingh",
    divisionName: "Mymensingh",
    divisionBnName: "ময়মনসিংহ",
    lat: 24.7471,
    lon: 90.4203,
    aeZone: "Old Brahmaputra Floodplain (BAU Hub)",
    aeZoneBn: "পুরাতন ব্রহ্মপুত্র ও বাকৃবি অঞ্চল",
    primaryCrops: ["boro_rice", "aman_rice", "mustard", "fish_aquaculture"],
    upazilas: [
      { id: "mymensingh_sadar", name: "Mymensingh Sadar", bnName: "ময়মনসিংহ সদর", lat: 24.7471, lon: 90.4203 },
      { id: "bhaluka", name: "Bhaluka", bnName: "ভালুকা", lat: 24.2333, lon: 90.3833 },
      { id: "dhobaura", name: "Dhobaura", bnName: "ধোবাউড়া", lat: 25.0833, lon: 90.5333 },
      { id: "fulbaria", name: "Fulbaria", bnName: "ফুলবাড়ীয়া", lat: 24.6333, lon: 90.2667 },
      { id: "gaffargaon", name: "Gaffargaon", bnName: "গফরগাঁও", lat: 24.4333, lon: 90.5500 },
      { id: "gauripur", name: "Gauripur", bnName: "গৌরীপুর", lat: 24.7667, lon: 90.5667 },
      { id: "haluaghat", name: "Haluaghat (Border Hills)", bnName: "হালুয়াঘাট (সীমান্ত পাহাড়ি)", lat: 25.1333, lon: 90.3500 },
      { id: "ishwarganj", name: "Ishwarganj", bnName: "ঈশ্বরগঞ্জ", lat: 24.6833, lon: 90.6000 },
      { id: "muktagachha", name: "Muktagachha", bnName: "মুক্তাগাছা", lat: 24.7667, lon: 90.2667 },
      { id: "nandail", name: "Nandail", bnName: "নান্দাইল", lat: 24.5667, lon: 90.6833 },
      { id: "phulpur", name: "Phulpur", bnName: "ফুলপুর", lat: 24.9500, lon: 90.3500 },
      { id: "tarakanda", name: "Tarakanda", bnName: "তারাকান্দা", lat: 24.8833, lon: 90.4167 },
      { id: "trishal", name: "Trishal (Fish Aquaculture)", bnName: "ত্রিশাল (মৎস্য খামার)", lat: 24.5833, lon: 90.3833 }
    ]
  },
  {
    id: "jamalpur",
    name: "Jamalpur",
    bnName: "জামালপুর",
    divisionId: "mymensingh",
    divisionName: "Mymensingh",
    divisionBnName: "ময়মনসিংহ",
    lat: 24.9375,
    lon: 89.9378,
    aeZone: "Old Brahmaputra & Jamuna Floodplain",
    aeZoneBn: "ব্রহ্মপুত্র ও যমুনা অববাহিকা",
    primaryCrops: ["chilli", "mustard", "boro_rice", "jute"],
    upazilas: [
      { id: "jamalpur_sadar", name: "Jamalpur Sadar", bnName: "জামালপুর সদর", lat: 24.9375, lon: 89.9378 },
      { id: "bakshiganj", name: "Bakshiganj", bnName: "বকশীগঞ্জ", lat: 25.2167, lon: 89.8667 },
      { id: "dewanganj", name: "Dewanganj", bnName: "দেওয়ানগঞ্জ", lat: 25.1333, lon: 89.7833 },
      { id: "islampur", name: "Islampur (Char)", bnName: "ইসলামপুর (চরাঞ্চল)", lat: 24.9833, lon: 89.7833 },
      { id: "madarganj", name: "Madarganj", bnName: "মাদারগঞ্জ", lat: 24.9000, lon: 89.7500 },
      { id: "melandaha", name: "Melandaha", bnName: "মেলান্দহ", lat: 24.9667, lon: 89.8333 },
      { id: "sarishabari", name: "Sarishabari", bnName: "সরিষাবাড়ী", lat: 24.7500, lon: 89.8333 }
    ]
  },
  {
    id: "netrokona",
    name: "Netrokona",
    bnName: "নেত্রকোণা",
    divisionId: "mymensingh",
    divisionName: "Mymensingh",
    divisionBnName: "ময়মনসিংহ",
    lat: 24.8709,
    lon: 90.7279,
    aeZone: "Sylhet Basin & Northern Piedmont (Haor Hub)",
    aeZoneBn: "হাওর ও গারো পাহাড় সীমান্ত",
    primaryCrops: ["haor_boro_rice", "aman_rice", "fish", "mustard"],
    upazilas: [
      { id: "netrokona_sadar", name: "Netrokona Sadar", bnName: "নেত্রকোণা সদর", lat: 24.8709, lon: 90.7279 },
      { id: "atpara", name: "Atpara", bnName: "আটপাড়া", lat: 24.8000, lon: 90.8667 },
      { id: "barhatta", name: "Barhatta", bnName: "বারহাট্টা", lat: 24.9000, lon: 90.8833 },
      { id: "durgapur_n", name: "Durgapur (Birishiri)", bnName: "দুর্গাপুর (বিরিশিরি চিনামাটি)", lat: 25.1167, lon: 90.6833 },
      { id: "khaliajuri", name: "Khaliajuri (Deep Haor)", bnName: "খালিয়াজুরী (গভীর হাওর)", lat: 24.7000, lon: 91.1333 },
      { id: "kalmakanda", name: "Kalmakanda", bnName: "কলমাকান্দা", lat: 25.0833, lon: 90.8833 },
      { id: "kendua", name: "Kendua", bnName: "কেন্দুয়া", lat: 24.6500, lon: 90.7833 },
      { id: "madan", name: "Madan (Haor)", bnName: "মদন (হাওর)", lat: 24.7333, lon: 90.9667 },
      { id: "mohangonj", name: "Mohanganj (Haor Gateway)", bnName: "মোহনগঞ্জ (হাওরের প্রবেশদ্বার)", lat: 24.8667, lon: 90.9667 },
      { id: "purbadhala", name: "Purbadhala", bnName: "পূর্বধলা", lat: 24.9333, lon: 90.6000 }
    ]
  },
  {
    id: "sherpur",
    name: "Sherpur",
    bnName: "শেরপুর",
    divisionId: "mymensingh",
    divisionName: "Mymensingh",
    divisionBnName: "ময়মনসিংহ",
    lat: 25.0205,
    lon: 90.0153,
    aeZone: "Northern Piedmont Plain & Garo Hills",
    aeZoneBn: "গারো পাহাড় পাদদেশীয় সমভূমি",
    primaryCrops: ["tulshimala_rice", "boro_rice", "mustard", "vegetables"],
    upazilas: [
      { id: "sherpur_sadar", name: "Sherpur Sadar", bnName: "শেরপুর সদর", lat: 25.0205, lon: 90.0153 },
      { id: "jhenaigati", name: "Jhenaigati (Garo Hills)", bnName: "ঝিনাইগাতী (গারো পাহাড়)", lat: 25.1833, lon: 90.0667 },
      { id: "nakla", name: "Nakla", bnName: "নকলা", lat: 24.9833, lon: 90.1833 },
      { id: "nalitabari", name: "Nalitabari (Madhutila)", bnName: "নালিতাবাড়ী (মধুটিলা)", lat: 25.0833, lon: 90.2000 },
      { id: "sreebardi", name: "Sreebardi", bnName: "শ্রীবরদী", lat: 25.1500, lon: 89.9333 }
    ]
  }
];

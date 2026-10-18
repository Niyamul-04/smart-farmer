import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DIVISIONS, DISTRICTS, District, Upazila } from "./data/bangladeshLocations.js";
import { CROPS_DATABASE, CropData } from "./data/cropDatabase.js";
import { fetchWeatherData } from "./services/weatherService.js";
import { getCropRecommendations } from "./services/cropRecommendationService.js";
import { calculateCropProfitability, compareCrops, LandUnit } from "./services/profitCalculatorService.js";
import { generateFarmingAlerts } from "./services/advisoryEngine.js";
import { askNiyamulAI } from "./services/aiService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory custom crop modifications for admin demo
let dynamicCrops = [...CROPS_DATABASE];

// --- HEALTH CHECK ---
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "আবহাওয়া বন্ধু (Abhawa Bondhu) API",
    version: "1.0.0",
    divisionsCount: DIVISIONS.length,
    districtsCount: DISTRICTS.length,
    cropsCount: dynamicCrops.length,
    currentTime: new Date().toISOString()
  });
});

// --- LOCATIONS API ---
app.get("/api/locations/divisions", (_req: Request, res: Response) => {
  res.json({ success: true, divisions: DIVISIONS });
});

app.get("/api/locations/districts", (req: Request, res: Response) => {
  const { divisionId } = req.query;
  if (divisionId && typeof divisionId === "string") {
    const filtered = DISTRICTS.filter(d => d.divisionId.toLowerCase() === divisionId.toLowerCase());
    return res.json({ success: true, districts: filtered });
  }
  res.json({ success: true, districts: DISTRICTS });
});

app.get("/api/locations/upazilas", (req: Request, res: Response) => {
  const { districtId } = req.query;
  if (!districtId || typeof districtId !== "string") {
    return res.status(400).json({ success: false, message: "districtId is required" });
  }

  const district = DISTRICTS.find(d => d.id === districtId.toLowerCase());
  if (!district) {
    return res.status(404).json({ success: false, message: "District not found" });
  }

  res.json({
    success: true,
    district: { id: district.id, name: district.name, bnName: district.bnName },
    upazilas: district.upazilas
  });
});

app.get("/api/locations/search", (req: Request, res: Response) => {
  const query = (req.query.q as string || "").trim().toLowerCase();
  if (!query || query.length < 1) {
    return res.json({ success: true, results: [] });
  }

  const results: Array<{
    type: "division" | "district" | "upazila";
    id: string;
    name: string;
    bnName: string;
    parentNameBn?: string;
    lat: number;
    lon: number;
    districtId?: string;
  }> = [];

  // Search divisions
  for (const div of DIVISIONS) {
    if (div.name.toLowerCase().includes(query) || div.bnName.includes(query)) {
      results.push({
        type: "division",
        id: div.id,
        name: div.name,
        bnName: div.bnName,
        lat: div.lat,
        lon: div.lon
      });
    }
  }

  // Search districts
  for (const dist of DISTRICTS) {
    if (dist.name.toLowerCase().includes(query) || dist.bnName.includes(query)) {
      results.push({
        type: "district",
        id: dist.id,
        name: dist.name,
        bnName: dist.bnName,
        parentNameBn: dist.divisionBnName,
        lat: dist.lat,
        lon: dist.lon,
        districtId: dist.id
      });
    }

    // Search upazilas
    for (const upz of dist.upazilas) {
      if (upz.name.toLowerCase().includes(query) || upz.bnName.includes(query)) {
        results.push({
          type: "upazila",
          id: upz.id,
          name: upz.name,
          bnName: upz.bnName,
          parentNameBn: `${dist.bnName} জেলা`,
          lat: upz.lat,
          lon: upz.lon,
          districtId: dist.id
        });
      }
    }
  }

  res.json({ success: true, count: results.length, results: results.slice(0, 15) });
});

// Reverse geocoding: Find nearest district and upazila from coordinates
app.get("/api/locations/reverse", (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string);
  const lon = parseFloat(req.query.lon as string);

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ success: false, message: "Valid lat and lon are required" });
  }

  let nearestDistrict: District = DISTRICTS[0];
  let minDistrictDist = Infinity;

  for (const d of DISTRICTS) {
    const dist = Math.hypot(d.lat - lat, d.lon - lon);
    if (dist < minDistrictDist) {
      minDistrictDist = dist;
      nearestDistrict = d;
    }
  }

  let nearestUpazila: Upazila = nearestDistrict.upazilas[0];
  let minUpazilaDist = Infinity;

  for (const u of nearestDistrict.upazilas) {
    const dist = Math.hypot(u.lat - lat, u.lon - lon);
    if (dist < minUpazilaDist) {
      minUpazilaDist = dist;
      nearestUpazila = u;
    }
  }

  res.json({
    success: true,
    coordinates: { lat, lon },
    district: nearestDistrict,
    upazila: nearestUpazila,
    distanceKm: Math.round(minDistrictDist * 111) // approx 111 km per degree
  });
});

// --- WEATHER API ---
app.get("/api/weather", async (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string) || 23.8103;
  const lon = parseFloat(req.query.lon as string) || 90.4125;
  const districtName = (req.query.district as string) || "Dhaka";
  const districtBn = (req.query.districtBn as string) || "ঢাকা";
  const upazilaName = req.query.upazila as string;
  const upazilaBn = req.query.upazilaBn as string;

  try {
    const weather = await fetchWeatherData(lat, lon, districtName, districtBn, upazilaName, upazilaBn);
    res.json({ success: true, weather });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve weather", error: String(error) });
  }
});

// --- CROPS & RECOMMENDATIONS API ---
app.get("/api/crops", (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: dynamicCrops.length,
    crops: dynamicCrops
  });
});

app.get("/api/crops/recommendations", (req: Request, res: Response) => {
  const districtId = (req.query.districtId as string) || "dhaka";
  const month = req.query.month ? parseInt(req.query.month as string, 10) : undefined;

  const result = getCropRecommendations(districtId, month);
  res.json({ success: true, ...result });
});

app.get("/api/crops/:id", (req: Request, res: Response) => {
  const crop = dynamicCrops.find(c => c.id === req.params.id);
  if (!crop) {
    return res.status(404).json({ success: false, message: "Crop not found" });
  }
  res.json({ success: true, crop });
});

// --- FARMING ALERTS API ---
app.get("/api/advisories/active", async (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string) || 23.8103;
  const lon = parseFloat(req.query.lon as string) || 90.4125;
  const cropId = req.query.cropId as string;
  const district = (req.query.district as string) || "Dhaka";
  const districtBn = (req.query.districtBn as string) || "ঢাকা";

  try {
    const weather = await fetchWeatherData(lat, lon, district, districtBn);
    const alerts = generateFarmingAlerts(weather, cropId);
    res.json({
      success: true,
      location: { lat, lon, district, districtBn },
      count: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to generate alerts", error: String(error) });
  }
});

// --- PROFITABILITY PLANNER API ---
app.post("/api/profitability/calculate", (req: Request, res: Response) => {
  const { districtId, cropId, landArea, landUnit, expenses, expectedYieldKg, expectedSellingPricePerKg } = req.body;

  if (!cropId || landArea === undefined) {
    return res.status(400).json({ success: false, message: "cropId and landArea are required" });
  }

  const result = calculateCropProfitability({
    districtId: districtId || "dhaka",
    cropId,
    landArea: parseFloat(landArea) || 1,
    landUnit: (landUnit as LandUnit) || "decimal",
    expenses,
    expectedYieldKg: expectedYieldKg ? parseFloat(expectedYieldKg) : undefined,
    expectedSellingPricePerKg: expectedSellingPricePerKg ? parseFloat(expectedSellingPricePerKg) : undefined
  });

  res.json({ success: true, calculation: result });
});

app.post("/api/profitability/compare", (req: Request, res: Response) => {
  const { districtId, landArea, landUnit, cropIds } = req.body;

  if (!Array.isArray(cropIds) || cropIds.length === 0) {
    return res.status(400).json({ success: false, message: "cropIds array is required" });
  }

  const results = compareCrops(
    districtId || "dhaka",
    parseFloat(landArea) || 33, // default 1 bigha
    (landUnit as LandUnit) || "decimal",
    cropIds
  );

  res.json({ success: true, comparisons: results });
});

// --- NIYAMUL AI (নিয়ামুল এআই) CHAT API ---
app.post("/api/ai/chat", async (req: Request, res: Response) => {
  const { messages, districtId, lat, lon } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, message: "messages array is required" });
  }

  try {
    let weatherData: any = undefined;
    if (lat !== undefined && lon !== undefined) {
      weatherData = await fetchWeatherData(parseFloat(lat), parseFloat(lon));
    }

    const aiResult = await askNiyamulAI(messages, weatherData, districtId);
    res.json({ success: true, ...aiResult });
  } catch (error) {
    console.error("Niyamul AI chat error:", error);
    res.status(500).json({
      success: false,
      message: "নিয়ামুল এআই সার্ভারে সাময়িক সমস্যা হয়েছে",
      reply: "দুঃখিত, এই মুহূর্তে উত্তর তৈরিতে সাময়িক বিঘ্ন ঘটেছে। অনুগ্রহ করে আবার প্রশ্নটি করুন।"
    });
  }
});

// --- ADMIN API ---
app.get("/api/admin/crops", (_req: Request, res: Response) => {
  res.json({
    success: true,
    crops: dynamicCrops
  });
});

app.post("/api/admin/crops", (req: Request, res: Response) => {
  const newCrop: CropData = req.body;
  if (!newCrop.id || !newCrop.bnName || !newCrop.name) {
    return res.status(400).json({ success: false, message: "Invalid crop payload" });
  }

  const existingIdx = dynamicCrops.findIndex(c => c.id === newCrop.id);
  if (existingIdx >= 0) {
    dynamicCrops[existingIdx] = { ...dynamicCrops[existingIdx], ...newCrop, lastVerifiedDate: new Date().toISOString().split("T")[0] };
  } else {
    dynamicCrops.push({ ...newCrop, lastVerifiedDate: new Date().toISOString().split("T")[0] });
  }

  res.json({ success: true, message: "Crop updated successfully", crop: newCrop });
});

app.get("/api/admin/stats", (_req: Request, res: Response) => {
  res.json({
    success: true,
    serverUptimeSeconds: Math.round(process.uptime()),
    divisionsCount: DIVISIONS.length,
    districtsCount: DISTRICTS.length,
    upazilasTotalCount: DISTRICTS.reduce((acc, d) => acc + d.upazilas.length, 0),
    activeCropsCount: dynamicCrops.length,
    sourcesConfigured: [
      { name: "Open-Meteo Weather API", status: "Active (Cached 15m)", type: "Meteorological" },
      { name: "বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI)", status: "Verified 2026", type: "Rice Varieties & Advisories" },
      { name: "বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট (BARI)", status: "Verified 2026", type: "Crops, Veg & Spices" },
      { name: "কৃষি সম্প্রসারণ অধিদপ্তর (DAE) ও BAMIS", status: "Verified 2026", type: "Crop Calendars & Benchmarks" }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`আবহাওয়া বন্ধু (Abhawa Bondhu) Server running on http://localhost:${PORT}`);
});

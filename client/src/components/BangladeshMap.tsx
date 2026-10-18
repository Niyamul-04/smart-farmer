import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "../context/LocationContext";
import L from "leaflet";
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw, ArrowRight, Layers, Sparkles } from "lucide-react";

export const BangladeshMap: React.FC<{ onSelectDistrictWeather?: () => void }> = ({ onSelectDistrictWeather }) => {
  const { language, toBengaliNumber } = useLanguage();
  const {
    divisions,
    districts,
    selectedDistrict,
    selectedUpazila,
    selectDistrict,
    selectUpazila,
    setLocationByCoordinates,
    requestBrowserLocation,
    isGeolocating
  } = useLocation();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeDivisionFilter, setActiveDivisionFilter] = useState<string>("all");
  const [activeLayer, setActiveLayer] = useState<"districts" | "divisions">("districts");

  // Fix Leaflet's default icon paths in bundler environments
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center of Bangladesh
    const map = L.map(mapContainerRef.current, {
      center: [23.8103, 90.4125],
      zoom: 7,
      minZoom: 6,
      maxZoom: 14,
      zoomControl: false,
    });

    // OpenStreetMap Tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Click anywhere on map to fetch nearest coordinate weather
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      // Keep within Bangladesh general bounding box approx (20.5 to 26.8 lat, 88.0 to 92.8 lon)
      if (lat >= 20.5 && lat <= 26.8 && lng >= 88.0 && lng <= 92.8) {
        setLocationByCoordinates(lat, lng);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers based on Active Filter and Districts
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer || districts.length === 0) return;

    markersLayer.clearLayers();

    // Custom Marker Icons using Tailwind SVG HTML
    const createCustomIcon = (isSelected: boolean, isDivision: boolean) => {
      const bg = isSelected ? "#059669" : isDivision ? "#d97706" : "#2563eb";
      const size = isSelected ? 34 : isDivision ? 30 : 22;
      return L.divIcon({
        className: "custom-map-marker",
        html: `
          <div style="
            background-color: ${bg};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: ${size > 26 ? 14 : 11}px;
            font-weight: bold;
          ">
            ${isDivision ? "🏛️" : "📍"}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2]
      });
    };

    const displayedDistricts =
      activeDivisionFilter === "all"
        ? districts
        : districts.filter(d => d.divisionId === activeDivisionFilter);

    // Plot Districts
    displayedDistricts.forEach(dist => {
      const isSelected = selectedDistrict?.id === dist.id;
      const marker = L.marker([dist.lat, dist.lon], {
        icon: createCustomIcon(isSelected, false),
        title: dist.bnName
      });

      const popupContent = `
        <div style="font-family: 'Hind Siliguri', sans-serif; min-width: 180px;">
          <h3 style="margin: 0 0 4px 0; color: #0f172a; font-size: 16px; font-weight: bold;">
            ${language === "bn" ? dist.bnName : dist.name}
          </h3>
          <p style="margin: 0 0 6px 0; color: #64748b; font-size: 12px;">
            ${language === "bn" ? dist.divisionBnName + " বিভাগ" : dist.divisionName + " Division"}
          </p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 6px 8px; border-radius: 8px; margin-bottom: 8px; font-size: 11px; color: #166534;">
            <strong>${language === "bn" ? "কৃষি অঞ্চল:" : "AEZ:"}</strong> ${language === "bn" ? dist.aeZoneBn : dist.aeZone}
          </div>
          <button id="btn-select-${dist.id}" style="
            width: 100%;
            background-color: #059669;
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
          ">
            ${language === "bn" ? "আবহাওয়া ও ফসল দেখুন" : "View Weather & Crops"}
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("popupopen", () => {
        const btn = document.getElementById(`btn-select-${dist.id}`);
        if (btn) {
          btn.onclick = () => {
            selectDistrict(dist.id);
            if (onSelectDistrictWeather) {
              onSelectDistrictWeather();
            }
          };
        }
      });

      marker.addTo(markersLayer);
    });

    // If a district is currently selected, pan smoothly to it
    if (selectedDistrict) {
      map.flyTo([selectedDistrict.lat, selectedDistrict.lon], Math.max(map.getZoom(), 8), {
        duration: 1.2
      });
    }
  }, [districts, activeDivisionFilter, selectedDistrict, language]);

  const resetToBangladesh = () => {
    setActiveDivisionFilter("all");
    mapInstanceRef.current?.flyTo([23.8103, 90.4125], 7, { duration: 1 });
  };

  const handleDivisionClick = (divId: string) => {
    setActiveDivisionFilter(divId);
    const div = divisions.find(d => d.id === divId);
    if (div && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([div.lat, div.lon], 8.5, { duration: 1 });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      {/* Title & Hierarchy Breadcrumbs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{language === "bn" ? "প্রশাসনিক মানচিত্র এক্সপ্লোরার" : "Administrative Map Explorer"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {language === "bn" ? "বাংলাদেশের ৬৪ জেলার ইন্টারেক্টিভ মানচিত্র" : "Interactive Map of Bangladesh (64 Districts)"}
          </h1>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <span
              onClick={resetToBangladesh}
              className="text-emerald-700 font-semibold cursor-pointer hover:underline"
            >
              {language === "bn" ? "বাংলাদেশ" : "Bangladesh"}
            </span>
            <span>&gt;</span>
            <span className="text-slate-700 font-medium">
              {activeDivisionFilter === "all"
                ? language === "bn"
                  ? "সকল বিভাগ"
                  : "All Divisions"
                : language === "bn"
                ? divisions.find(d => d.id === activeDivisionFilter)?.bnName + " বিভাগ"
                : divisions.find(d => d.id === activeDivisionFilter)?.name + " Division"}
            </span>
            {selectedDistrict && (
              <>
                <span>&gt;</span>
                <span className="text-emerald-800 font-bold">
                  {language === "bn" ? selectedDistrict.bnName : selectedDistrict.name}
                  {selectedUpazila && ` (${language === "bn" ? selectedUpazila.bnName : selectedUpazila.name})`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetToBangladesh}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            title="সমগ্র বাংলাদেশ ভিউতে ফিরে যান"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "সম্পূর্ণ দেশ" : "Full BD"}</span>
          </button>

          <button
            onClick={requestBrowserLocation}
            disabled={isGeolocating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <Navigation className={`w-3.5 h-3.5 ${isGeolocating ? "animate-spin" : ""}`} />
            <span>{language === "bn" ? "আমার জিপিএস" : "My GPS"}</span>
          </button>
        </div>
      </div>

      {/* Division Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => {
            setActiveDivisionFilter("all");
            mapInstanceRef.current?.flyTo([23.8103, 90.4125], 7);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeDivisionFilter === "all"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          {language === "bn" ? "সকল বিভাগ (৮)" : "All Divisions (8)"}
        </button>

        {divisions.map(div => (
          <button
            key={div.id}
            onClick={() => handleDivisionClick(div.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeDivisionFilter === div.id
                ? "bg-emerald-600 text-white shadow-sm font-bold"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {language === "bn" ? div.bnName : div.name}
            <span className="text-[10px] opacity-75 ml-1">({toBengaliNumber(div.districtsCount)})</span>
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[550px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-md">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Map Zoom Controls & Overlay Guide */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-slate-200">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Instruction Toast */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-20 bg-slate-900/85 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs flex items-center justify-between gap-3 max-w-md border border-slate-700">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {language === "bn"
                ? "মানচিত্রের যেকোনো জেলায় ট্যাপ করুন অথবা যেকোনো স্থানে ক্লিক করে নিকটতম আবহাওয়া জানুন।"
                : "Tap any district marker or click anywhere on Bangladesh to inspect weather."}
            </span>
          </div>
        </div>
      </div>

      {/* Upazilas of the Currently Selected District */}
      {selectedDistrict && (
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="text-emerald-600">🌾</span>
              <span>
                {language === "bn"
                  ? `${selectedDistrict.bnName} জেলার উপজেলাসমূহ (${toBengaliNumber(selectedDistrict.upazilas.length)} টি)`
                  : `Upazilas in ${selectedDistrict.name} (${selectedDistrict.upazilas.length})`}
              </span>
            </h2>
            <span className="text-xs text-slate-500">
              {language === "bn" ? "উপজেলায় ক্লিক করে আবহাওয়া আপডেট করুন" : "Click upazila to update weather"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {selectedDistrict.upazilas.map(upz => {
              const isUpzSelected = selectedUpazila?.id === upz.id;
              return (
                <button
                  key={upz.id}
                  onClick={() => selectUpazila(upz.id)}
                  className={`p-2.5 rounded-xl text-xs text-left transition-all border ${
                    isUpzSelected
                      ? "bg-emerald-600 text-white font-bold border-emerald-700 shadow-sm"
                      : "bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="font-semibold truncate">
                    {language === "bn" ? upz.bnName : upz.name}
                  </div>
                  <div className={`text-[10px] mt-0.5 truncate ${isUpzSelected ? "text-emerald-100" : "text-slate-500"}`}>
                    {toBengaliNumber(upz.lat.toFixed(2))}°N, {toBengaliNumber(upz.lon.toFixed(2))}°E
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

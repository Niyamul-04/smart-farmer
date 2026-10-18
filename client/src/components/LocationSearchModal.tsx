import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "../context/LocationContext";
import { Search, MapPin, X, ChevronRight, Navigation, Check } from "lucide-react";
import { District, Upazila } from "../types";

export const LocationSearchModal: React.FC = () => {
  const { language } = useLanguage();
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    divisions,
    districts,
    selectedDistrict,
    selectDistrict,
    selectUpazila,
    requestBrowserLocation,
    isGeolocating,
    geolocationError
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivisionTab, setSelectedDivisionTab] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search API integration with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/locations/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.results);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isSearchModalOpen) return null;

  const filteredDistricts =
    selectedDivisionTab === "all"
      ? districts
      : districts.filter(d => d.divisionId === selectedDivisionTab);

  const handleSelectDistrict = (distId: string) => {
    selectDistrict(distId);
    setIsSearchModalOpen(false);
  };

  const handleSelectUpazila = (upz: Upazila) => {
    selectUpazila(upz.id);
    setIsSearchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-emerald-100 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-base sm:text-lg">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>{language === "bn" ? "স্থান ও জেলা নির্বাচন করুন" : "Select Location & District"}</span>
          </div>
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Quick Button */}
        <div className="px-4 pt-3 pb-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <button
            onClick={requestBrowserLocation}
            disabled={isGeolocating}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-all shadow-sm"
          >
            <Navigation className={`w-4 h-4 text-emerald-600 ${isGeolocating ? "animate-spin" : ""}`} />
            <span>
              {isGeolocating
                ? language === "bn"
                  ? "বর্তমান অবস্থান নির্ণয় করা হচ্ছে..."
                  : "Detecting location..."
                : language === "bn"
                ? "আমার বর্তমান অবস্থান ব্যবহার করুন (GPS)"
                : "Use My Current Location (GPS)"}
            </span>
          </button>

          {selectedDistrict && (
            <span className="text-xs text-slate-600 font-medium">
              {language === "bn" ? "বর্তমান: " : "Current: "}
              <strong className="text-emerald-700">
                {language === "bn" ? selectedDistrict.bnName : selectedDistrict.name}
              </strong>
            </span>
          )}
        </div>

        {geolocationError && (
          <div className="px-4 py-2 bg-amber-50 text-amber-800 text-xs border-b border-amber-200">
            {geolocationError}
          </div>
        )}

        {/* Search Input */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === "bn" ? "যেকোনো জেলা, উপজেলা বা বিভাগের নাম লিখুন..." : "Type any district, upazila, or division..."}
              autoFocus
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results (if querying) */}
        {searchQuery.trim().length > 0 ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {language === "bn" ? "অনুসন্ধানের ফলাফল" : "Search Results"} ({searchResults.length})
            </div>

            {isSearching ? (
              <div className="text-center py-8 text-sm text-slate-500">
                {language === "bn" ? "খোঁজা হচ্ছে..." : "Searching..."}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-500">
                {language === "bn" ? "কোনো ফলাফল পাওয়া যায়নি। বানান যাচাই করুন।" : "No results found."}
              </div>
            ) : (
              searchResults.map((item, idx) => (
                <button
                  key={`${item.type}-${item.id}-${idx}`}
                  onClick={() => {
                    if (item.type === "district") {
                      handleSelectDistrict(item.id);
                    } else if (item.type === "upazila" && item.districtId) {
                      selectDistrict(item.districtId);
                      selectUpazila(item.id);
                      setIsSearchModalOpen(false);
                    } else if (item.type === "division") {
                      setSelectedDivisionTab(item.id);
                      setSearchQuery("");
                    }
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      {item.type === "district" ? (language === "bn" ? "জেলা" : "Dist") : item.type === "upazila" ? (language === "bn" ? "উপজেলা" : "Upz") : (language === "bn" ? "বিভাগ" : "Div")}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">
                        {language === "bn" ? item.bnName : item.name}
                      </div>
                      {item.parentNameBn && (
                        <div className="text-xs text-slate-500">
                          {item.parentNameBn}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))
            )}
          </div>
        ) : (
          /* Division Tabs & 64 Districts Grid */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Division Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-3 border-b border-slate-100 bg-slate-50 scrollbar-none">
              <button
                onClick={() => setSelectedDivisionTab("all")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDivisionTab === "all"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {language === "bn" ? "সকল জেলা (৬৪)" : "All Districts (64)"}
              </button>
              {divisions.map(div => (
                <button
                  key={div.id}
                  onClick={() => setSelectedDivisionTab(div.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedDivisionTab === div.id
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {language === "bn" ? div.bnName : div.name}
                </button>
              ))}
            </div>

            {/* Districts Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredDistricts.map(dist => {
                  const isSelected = selectedDistrict?.id === dist.id;
                  return (
                    <button
                      key={dist.id}
                      onClick={() => handleSelectDistrict(dist.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-1 ring-emerald-500"
                          : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-800"
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-sm font-semibold truncate">
                          {language === "bn" ? dist.bnName : dist.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {language === "bn" ? dist.divisionBnName : dist.divisionName}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>

              {/* Upazilas of Currently Selected District */}
              {selectedDistrict && selectedDistrict.upazilas.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>🌾</span>
                    <span>
                      {language === "bn"
                        ? `${selectedDistrict.bnName} জেলার উপজেলাসমূহ`
                        : `Upazilas in ${selectedDistrict.name}`}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDistrict.upazilas.map(upz => (
                      <button
                        key={upz.id}
                        onClick={() => handleSelectUpazila(upz)}
                        className="text-xs bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                      >
                        {language === "bn" ? upz.bnName : upz.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from "react";
import { Division, District, Upazila } from "../types";

interface LocationContextType {
  selectedDistrict: District | null;
  selectedUpazila: Upazila | null;
  coordinates: { lat: number; lon: number };
  divisions: Division[];
  districts: District[];
  isLoadingLocations: boolean;
  isGeolocating: boolean;
  geolocationError: string | null;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  selectDistrict: (districtId: string) => void;
  selectUpazila: (upazilaId: string) => void;
  setLocationByCoordinates: (lat: number, lon: number, nameHint?: string) => Promise<void>;
  requestBrowserLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedUpazila, setSelectedUpazila] = useState<Upazila | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number }>({ lat: 23.8103, lon: 90.4125 });
  const [isLoadingLocations, setIsLoadingLocations] = useState<boolean>(true);
  const [isGeolocating, setIsGeolocating] = useState<boolean>(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // Load divisions and districts from backend API
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoadingLocations(true);
        const [divRes, distRes] = await Promise.all([
          fetch("/api/locations/divisions").then(r => r.json()),
          fetch("/api/locations/districts").then(r => r.json())
        ]);

        if (divRes.success) setDivisions(divRes.divisions);
        if (distRes.success && distRes.districts.length > 0) {
          setDistricts(distRes.districts);
          
          // Try to recover saved district from localStorage
          const savedDistrictId = localStorage.getItem("abhawa_selected_district");
          const defaultDist = distRes.districts.find((d: District) => d.id === savedDistrictId) || distRes.districts[0];
          setSelectedDistrict(defaultDist);
          setCoordinates({ lat: defaultDist.lat, lon: defaultDist.lon });
          if (defaultDist.upazilas && defaultDist.upazilas.length > 0) {
            setSelectedUpazila(defaultDist.upazilas[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load locations:", err);
      } finally {
        setIsLoadingLocations(false);
      }
    }
    loadData();
  }, []);

  const selectDistrict = (districtId: string) => {
    const d = districts.find(item => item.id.toLowerCase() === districtId.toLowerCase());
    if (d) {
      setSelectedDistrict(d);
      setCoordinates({ lat: d.lat, lon: d.lon });
      setSelectedUpazila(d.upazilas[0] || null);
      localStorage.setItem("abhawa_selected_district", d.id);
    }
  };

  const selectUpazila = (upazilaId: string) => {
    if (!selectedDistrict) return;
    const u = selectedDistrict.upazilas.find(item => item.id === upazilaId);
    if (u) {
      setSelectedUpazila(u);
      setCoordinates({ lat: u.lat, lon: u.lon });
    }
  };

  const setLocationByCoordinates = async (lat: number, lon: number, nameHint?: string) => {
    setCoordinates({ lat, lon });
    try {
      const res = await fetch(`/api/locations/reverse?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (data.success && data.district) {
        setSelectedDistrict(data.district);
        setSelectedUpazila(data.upazila || data.district.upazilas[0]);
        localStorage.setItem("abhawa_selected_district", data.district.id);
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };

  const requestBrowserLocation = () => {
    if (!navigator.geolocation) {
      setGeolocationError("আপনার ব্রাউজারে জিপিএস অবস্থান নির্ণয় সমর্থিত নয়।");
      return;
    }

    setIsGeolocating(true);
    setGeolocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await setLocationByCoordinates(latitude, longitude);
        setIsGeolocating(false);
      },
      (err) => {
        setIsGeolocating(false);
        if (err.code === 1) {
          setGeolocationError("অবস্থান অনুমতির অনুমোদন পাওয়া যায়নি। ব্রাউজার সেটিংসে গিয়ে লোকেশন পারমিশন দিন।");
        } else {
          setGeolocationError("অবস্থান নির্ণয়ে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে তালিকা থেকে জেলা নির্বাচন করুন।");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <LocationContext.Provider
      value={{
        selectedDistrict,
        selectedUpazila,
        coordinates,
        divisions,
        districts,
        isLoadingLocations,
        isGeolocating,
        geolocationError,
        isSearchModalOpen,
        setIsSearchModalOpen,
        selectDistrict,
        selectUpazila,
        setLocationByCoordinates,
        requestBrowserLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

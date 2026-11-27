import { useCallback, useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { NAV_ITEMS, Navbar } from './components/Navbar';
import { RecyclingGuideSection } from './components/RecyclingGuideSection';
import { SustainabilityInsightsSection } from './components/SustainabilityInsightsSection';
import { WasteCategoriesSection } from './components/WasteCategoriesSection';
import { WasteIdentifierSection } from './components/WasteIdentifierSection';
import { INDIAN_STATE_CITY_GUIDANCE } from './data/wasteContent';
import type { IndianLocation, ScanHistoryEntry } from './types/waste';

const HISTORY_STORAGE_KEY = 'ecosmart_ai_india_scan_history_v2';
const LOCATION_STORAGE_KEY = 'ecosmart_ai_india_location_v1';

const DEFAULT_LOCATION: IndianLocation = {
  state: INDIAN_STATE_CITY_GUIDANCE[0].state,
  city: INDIAN_STATE_CITY_GUIDANCE[0].cities[0].city,
};

function loadInitialHistory(): ScanHistoryEntry[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 12) : [];
  } catch {
    return [];
  }
}

function loadInitialLocation(): IndianLocation {
  try {
    const raw = window.localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!raw) return DEFAULT_LOCATION;
    const parsed = JSON.parse(raw) as Partial<IndianLocation>;
    const validState = INDIAN_STATE_CITY_GUIDANCE.find(
      (s) => s.state === parsed.state
    );
    if (!validState) return DEFAULT_LOCATION;
    const validCity = validState.cities.find((c) => c.city === parsed.city);
    return {
      state: validState.state,
      city: validCity ? validCity.city : validState.cities[0].city,
    };
  } catch {
    return DEFAULT_LOCATION;
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [history, setHistory] = useState<ScanHistoryEntry[]>(loadInitialHistory);
  const [location, setLocation] = useState<IndianLocation>(loadInitialLocation);
  const [pendingTextQuery, setPendingTextQuery] = useState<string | null>(null);
  const [openCameraSignal, setOpenCameraSignal] = useState<number>(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(history.slice(0, 12))
      );
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [history]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        LOCATION_STORAGE_KEY,
        JSON.stringify(location)
      );
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [location]);

  // Track which section is currently visible for active navigation highlighting
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleStartCameraScan = useCallback(() => {
    handleNavigate('identify');
    setOpenCameraSignal((n) => n + 1);
  }, [handleNavigate]);

  const handleAddHistory = useCallback((entry: ScanHistoryEntry) => {
    setHistory((prev) => [entry, ...prev].slice(0, 12));
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleAskAiItem = useCallback(
    (itemName: string) => {
      setPendingTextQuery(itemName);
      handleNavigate('identify');
    },
    [handleNavigate]
  );

  const handleClearPendingQuery = useCallback(() => {
    setPendingTextQuery(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8] text-[#0F2419]">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="flex-1">
        <HeroSection
          totalScans={history.length}
          selectedLocationLabel={`${location.city}, ${location.state}`}
          onStartScan={handleStartCameraScan}
          onExploreCategories={() => handleNavigate('categories')}
        />

        <WasteIdentifierSection
          history={history}
          location={location}
          onChangeLocation={setLocation}
          onAddHistory={handleAddHistory}
          onClearHistory={handleClearHistory}
          pendingTextQuery={pendingTextQuery}
          onClearPendingQuery={handleClearPendingQuery}
          openCameraSignal={openCameraSignal}
        />

        <WasteCategoriesSection
          location={location}
          onChangeLocation={setLocation}
          onAskAiItem={handleAskAiItem}
        />

        <RecyclingGuideSection onAskAiItem={handleAskAiItem} />

        <SustainabilityInsightsSection sessionScansCount={history.length} />
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

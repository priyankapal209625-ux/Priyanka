import { Building2, Info, MapPin, ShieldCheck } from 'lucide-react';
import { INDIAN_STATE_CITY_GUIDANCE } from '../data/wasteContent';
import type { IndianLocation } from '../types/waste';

interface LocalGuidanceSelectorProps {
  location: IndianLocation;
  onChangeLocation: (next: IndianLocation) => void;
  compact?: boolean;
}

export function LocalGuidanceSelector({
  location,
  onChangeLocation,
  compact = false,
}: LocalGuidanceSelectorProps) {
  const selectedStateObj =
    INDIAN_STATE_CITY_GUIDANCE.find((s) => s.state === location.state) ??
    INDIAN_STATE_CITY_GUIDANCE[0];

  const selectedCityObj =
    selectedStateObj.cities.find((c) => c.city === location.city) ??
    selectedStateObj.cities[0];

  const handleStateChange = (newState: string) => {
    const stateEntry =
      INDIAN_STATE_CITY_GUIDANCE.find((s) => s.state === newState) ??
      INDIAN_STATE_CITY_GUIDANCE[0];
    onChangeLocation({
      state: stateEntry.state,
      city: stateEntry.cities[0].city,
    });
  };

  if (compact) {
    return (
      <div className="mb-5 p-3.5 rounded-lg bg-[#F7FAF8] border border-[#E2EBE5]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F2419]">
            <MapPin className="w-3.5 h-3.5 text-[#0F7A4A]" aria-hidden="true" />
            <span>Your Location in India (for local guidance)</span>
          </div>
          <span className="text-[11px] text-[#62786C]">
            Bin colours &amp; timings vary by municipality
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="scanner-state-select" className="sr-only">
              Select Indian State or Union Territory
            </label>
            <select
              id="scanner-state-select"
              value={selectedStateObj.state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-3 py-2 min-h-[40px] text-xs font-medium text-[#0F2419] bg-white border border-[#D4E2D9] rounded-lg focus:border-[#0F7A4A] focus:outline-none"
            >
              {INDIAN_STATE_CITY_GUIDANCE.map((entry) => (
                <option key={entry.state} value={entry.state}>
                  {entry.state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="scanner-city-select" className="sr-only">
              Select Indian City
            </label>
            <select
              id="scanner-city-select"
              value={selectedCityObj.city}
              onChange={(e) =>
                onChangeLocation({
                  state: selectedStateObj.state,
                  city: e.target.value,
                })
              }
              className="w-full px-3 py-2 min-h-[40px] text-xs font-medium text-[#0F2419] bg-white border border-[#D4E2D9] rounded-lg focus:border-[#0F7A4A] focus:outline-none"
            >
              {selectedStateObj.cities.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-xl bg-[#EFF6F1] border border-[#D4E2D9] p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 pb-6 border-b border-[#D4E2D9]">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0F7A4A] mb-1.5">
            <MapPin className="w-4 h-4" aria-hidden="true" />
            <span>Local Waste Management Guidance (India)</span>
          </div>
          <h3 className="text-xl font-bold text-[#0F2419]">
            Select your State and City for locally relevant guidance
          </h3>
          <p className="mt-1.5 text-sm text-[#3E5448]">
            Four-stream segregation applies across India under SWM Rules, 2026,
            but bin colours, collection schedules, and authorised drop-off
            points vary between cities and municipalities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[380px]">
          <div>
            <label
              htmlFor="local-state-select"
              className="block text-xs font-semibold text-[#2A4235] mb-1"
            >
              State / Union Territory
            </label>
            <select
              id="local-state-select"
              value={selectedStateObj.state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[42px] text-sm font-medium text-[#0F2419] bg-white border border-[#C6D8CC] rounded-lg focus:border-[#0F7A4A] focus:outline-none"
            >
              {INDIAN_STATE_CITY_GUIDANCE.map((entry) => (
                <option key={entry.state} value={entry.state}>
                  {entry.state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="local-city-select"
              className="block text-xs font-semibold text-[#2A4235] mb-1"
            >
              City / Region
            </label>
            <select
              id="local-city-select"
              value={selectedCityObj.city}
              onChange={(e) =>
                onChangeLocation({
                  state: selectedStateObj.state,
                  city: e.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 min-h-[42px] text-sm font-medium text-[#0F2419] bg-white border border-[#C6D8CC] rounded-lg focus:border-[#0F7A4A] focus:outline-none"
            >
              {selectedStateObj.cities.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Municipality & SPCB Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-3">
          <Building2
            className="w-5 h-5 text-[#0F7A4A] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-semibold text-[#62786C]">
              Relevant Urban Local Body (ULB)
            </p>
            <p className="mt-0.5 text-sm font-bold text-[#0F2419]">
              {selectedCityObj.localBody}
            </p>
            <p className="mt-1.5 text-sm text-[#3E5448] leading-relaxed">
              {selectedCityObj.guidanceNote}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldCheck
            className="w-5 h-5 text-[#0F7A4A] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-semibold text-[#62786C]">
              Authorised E-Waste &amp; Special Care Oversight
            </p>
            <p className="mt-0.5 text-sm font-bold text-[#0F2419]">
              {selectedStateObj.spcbName}
            </p>
            <p className="mt-1.5 text-sm text-[#3E5448] leading-relaxed">
              For batteries, electronics, CFL bulbs, and household chemicals,
              verify CPCB or {selectedStateObj.spcbName} authorised recyclers
              and producer EPR take-back points before handover.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[#D4E2D9] flex items-start gap-2.5 text-xs text-[#3E5448]">
        <Info className="w-4 h-4 text-[#0F7A4A] shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          <strong>Important note:</strong> EcoSmart AI provides general Indian
          segregation guidance and does not invent local collection centre
          addresses or ward schedules. Always confirm exact pickup days, bin
          colours, and drop-off points with your local municipal office or RWA.
        </p>
      </div>
    </div>
  );
}

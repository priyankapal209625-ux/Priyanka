import { ArrowRight, Camera } from 'lucide-react';
import { HERO_IMAGE_URL } from '../data/wasteContent';
import { SafeImage } from './SafeImage';

interface HeroSectionProps {
  totalScans: number;
  selectedLocationLabel: string;
  onStartScan: () => void;
  onExploreCategories: () => void;
}

export function HeroSection({
  totalScans,
  selectedLocationLabel,
  onStartScan,
  onExploreCategories,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="bg-white border-b border-[#E2EBE5] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-14 lg:pb-16">
        {/* Balanced 2-column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-[#0F7A4A] mb-3">
              Smart Waste Management Assistant for India · SWM Rules, 2026
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-[#0F2419] leading-[1.08] max-w-xl">
              Sort every waste item accurately across India’s four streams.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#3E5448] leading-relaxed max-w-xl">
              Upload a photo or describe any Indian household, school, or market
              waste item. EcoSmart AI classifies it into Wet, Dry, Sanitary, or
              Special Care Waste with safe disposal steps and reuse guidance.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onStartScan}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 min-h-[46px] text-sm sm:text-base font-semibold text-white bg-[#0F7A4A] rounded-lg hover:bg-[#0B613B] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Camera className="w-4 h-4" aria-hidden="true" />
                <span>Identify Waste Now</span>
              </button>

              <button
                type="button"
                onClick={onExploreCategories}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] text-sm sm:text-base font-medium text-[#0F2419] bg-[#F7FAF8] border border-[#D4E2D9] rounded-lg hover:bg-[#EFF6F1] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Explore 4 Waste Streams</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E2EBE5] flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#62786C]">
              <span>Wet · Dry · Sanitary · Special Care</span>
              <span aria-hidden="true">·</span>
              <span>State &amp; City Guidance ({selectedLocationLabel})</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[280px] sm:min-h-[360px] rounded-xl overflow-hidden border border-[#E2EBE5] bg-[#EFF6F1]">
              <SafeImage
                src={HERO_IMAGE_URL}
                alt="Sunlit modern zero-waste sorting counter with glass jars, folded kraft paper, indoor plants, and a ceramic compost caddy"
                fallbackTitle="EcoSmart Zero-Waste Sorting Station"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Verified FY 2024–25 Indian Waste Strip (Uniform Year & Unit) */}
        <div className="mt-10 pt-8 border-t border-[#E2EBE5]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <p className="text-xs font-medium text-[#62786C]">
              India National Waste Snapshot (FY 2024–25) · Uniform unit:
              tonnes/year · Official MoHUA, MoEFCC &amp; CPCB data
            </p>
            {totalScans > 0 && (
              <p className="text-xs font-medium text-[#0F7A4A] font-mono tabular-nums">
                Session items checked: {totalScans}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div>
              <p className="text-xs font-medium text-[#62786C]">
                Urban Solid Waste Generated (FY 2024–25)
              </p>
              <p className="mt-1.5 text-xl sm:text-2xl font-bold text-[#0F2419] font-mono tabular-nums">
                5,91,89,130
              </p>
              <p className="text-xs font-medium text-[#3E5448]">tonnes/year</p>
              <p className="mt-1 text-xs text-[#62786C]">
                MoHUA / SBM-U 2.0 Parliament Data, 2024–25 (1,62,162 TPD × 365)
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-[#62786C]">
                Urban Solid Waste Processed (FY 2024–25)
              </p>
              <p className="mt-1.5 text-xl sm:text-2xl font-bold text-[#0F7A4A] font-mono tabular-nums">
                4,81,20,505
              </p>
              <p className="text-xs font-medium text-[#3E5448]">tonnes/year</p>
              <p className="mt-1 text-xs text-[#62786C]">
                MoHUA / SBM-U 2.0 Parliament Data, 2024–25 (1,31,837 TPD × 365)
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-[#62786C]">
                E-Waste Generated (FY 2024–25)
              </p>
              <p className="mt-1.5 text-xl sm:text-2xl font-bold text-[#0369A1] font-mono tabular-nums">
                13,97,956
              </p>
              <p className="text-xs font-medium text-[#3E5448]">tonnes/year</p>
              <p className="mt-1 text-xs text-[#62786C]">
                MoEFCC / CPCB E-Waste EPR Portal, 2024–25
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-[#62786C]">
                E-Waste Recycled via EPR (FY 2024–25)
              </p>
              <p className="mt-1.5 text-xl sm:text-2xl font-bold text-[#0F7A4A] font-mono tabular-nums">
                11,59,228
              </p>
              <p className="text-xs font-medium text-[#3E5448]">tonnes/year</p>
              <p className="mt-1 text-xs text-[#62786C]">
                MoEFCC / CPCB E-Waste EPR Portal, 2024–25
              </p>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-[#62786C]">
            Note: All four figures above are for FY 2024–25 in tonnes/year for
            direct comparison. CPCB’s latest published national Plastic Waste
            total (FY 2022–23: 41,36,188 tonnes/year) is displayed in
            Sustainability Insights below.
          </p>
        </div>
      </div>
    </section>
  );
}

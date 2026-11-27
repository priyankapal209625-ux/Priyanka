import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Lightbulb,
  Recycle,
  Search,
} from 'lucide-react';
import {
  PLASTIC_RESIN_CODES,
  RECYCLING_GUIDES,
} from '../data/wasteContent';

interface RecyclingGuideSectionProps {
  onAskAiItem: (itemName: string) => void;
}

export function RecyclingGuideSection({
  onAskAiItem,
}: RecyclingGuideSectionProps) {
  const [activeMaterialId, setActiveMaterialId] = useState(RECYCLING_GUIDES[0].id);
  const [selectedResinCode, setSelectedResinCode] = useState<number>(1);
  const [customMaterialQuery, setCustomMaterialQuery] = useState('');

  const activeGuide =
    RECYCLING_GUIDES.find((g) => g.id === activeMaterialId) ?? RECYCLING_GUIDES[0];

  const activeResin =
    PLASTIC_RESIN_CODES.find((r) => r.code === selectedResinCode) ??
    PLASTIC_RESIN_CODES[0];

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = customMaterialQuery.trim();
    if (cleaned.length >= 2) {
      onAskAiItem(cleaned);
      setCustomMaterialQuery('');
    }
  };

  return (
    <section
      id="recycling-guide"
      className="py-16 lg:py-20 bg-[#F7FAF8] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-2xl mb-8">
          <p className="text-sm font-semibold text-[#0F7A4A] mb-2">
            03. Indian Recycling &amp; Reuse Guide
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F2419]">
            Practical recycling and reuse for everyday Indian items
          </h2>
          <p className="mt-3 text-base text-[#3E5448] leading-relaxed">
            From dairy milk packets and raddi newspapers to vegetable peels, old
            clothes, and electronic waste—select a material below to learn clean
            preparation, safe disposal, and household reuse methods.
          </p>
        </div>

        {/* Material Selector Tabs */}
        <div
          role="tablist"
          aria-label="Indian material recycling guides"
          className="flex flex-wrap items-center gap-2 mb-6"
        >
          {RECYCLING_GUIDES.map((guide) => {
            const isActive = guide.id === activeMaterialId;
            return (
              <button
                key={guide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveMaterialId(guide.id)}
                className={`px-4 py-2.5 min-h-[42px] text-sm font-semibold rounded-lg border transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0F7A4A] text-white border-[#0F7A4A]'
                    : 'bg-white text-[#2A4235] border-[#E2EBE5] hover:border-[#0F7A4A] hover:text-[#0F7A4A]'
                }`}
              >
                {guide.name}
              </button>
            );
          })}
        </div>

        {/* Active Material Guide Panel */}
        <div className="bg-white border border-[#E2EBE5] rounded-xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-6 border-b border-[#E2EBE5]">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#62786C]">
                <span
                  className={`font-semibold ${
                    activeGuide.category === 'Special Care Waste'
                      ? 'text-[#B91C1C]'
                      : activeGuide.category === 'Wet Waste'
                      ? 'text-[#0F7A4A]'
                      : 'text-[#0369A1]'
                  }`}
                >
                  {activeGuide.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeGuide.channelLabel}</span>
              </div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-[#0F2419]">
                {activeGuide.name}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#3E5448] leading-relaxed">
                {activeGuide.overview}
              </p>
            </div>

            <div className="lg:text-right shrink-0 space-y-1.5 lg:max-w-[290px]">
              <p className="text-xs font-semibold text-[#62786C]">
                India Context
              </p>
              <p className="text-sm font-semibold text-[#0F2419]">
                {activeGuide.keyFact}
              </p>
              <p className="text-xs text-[#62786C]">
                Source: {activeGuide.keyFactSource}
              </p>
            </div>
          </div>

          {/* 3-Column Guide Details */}
          <div className="mt-7 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0F2419] mb-4">
                <Recycle className="w-4 h-4 text-[#0F7A4A]" aria-hidden="true" />
                <h4>Preparation &amp; Disposal Steps</h4>
              </div>
              <ol className="space-y-3 text-sm text-[#3E5448]">
                {activeGuide.prepSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-semibold text-[#0F7A4A] mt-0.5 tabular-nums">
                      0{idx + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0F2419] mb-4">
                <Lightbulb className="w-4 h-4 text-[#0F7A4A]" aria-hidden="true" />
                <h4>Practical Reuse &amp; Reduction</h4>
              </div>
              <ul className="space-y-3 text-sm text-[#3E5448]">
                {activeGuide.reuseIdeas.map((idea, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 text-[#0F7A4A] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#9A3412] mb-4">
                <AlertCircle className="w-4 h-4 text-[#B45309]" aria-hidden="true" />
                <h4>Avoid Doing This</h4>
              </div>
              <ul className="space-y-3 text-sm text-[#3E5448]">
                {activeGuide.avoidList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs font-semibold text-[#B45309] mt-0.5"
                    >
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive Plastic Resin Code Decoder (#1 - #7) */}
        <div className="mt-8 bg-white border border-[#E2EBE5] rounded-xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#0F2419]">
                Plastic Resin Code Decoder (#1 – #7)
              </h3>
              <p className="mt-1 text-sm text-[#62786C]">
                Check the number printed inside the triangle on Indian plastic
                bottles, milk pouches, or tubs to see how easily it recycles.
              </p>
            </div>

            <div
              role="group"
              aria-label="Plastic resin codes 1 through 7"
              className="flex flex-wrap items-center gap-2"
            >
              {PLASTIC_RESIN_CODES.map((resin) => {
                const isSelected = resin.code === selectedResinCode;
                return (
                  <button
                    key={resin.code}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedResinCode(resin.code)}
                    className={`w-11 h-11 rounded-lg font-mono text-sm font-semibold border transition-colors cursor-pointer tabular-nums ${
                      isSelected
                        ? 'bg-[#0F7A4A] text-white border-[#0F7A4A]'
                        : 'bg-[#F7FAF8] text-[#0F2419] border-[#D4E2D9] hover:border-[#0F7A4A]'
                    }`}
                  >
                    #{resin.code}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-[#E2EBE5] grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-4">
              <p className="text-xs font-mono text-[#62786C]">
                Resin #{activeResin.code} · {activeResin.abbr}
              </p>
              <h4 className="mt-1 text-lg font-bold text-[#0F2419]">
                {activeResin.name}
              </h4>
              <p
                className={`mt-2 text-sm font-semibold ${
                  activeResin.recyclability === 'Commonly Recycled'
                    ? 'text-[#0F7A4A]'
                    : activeResin.recyclability === 'Depends on Local Facility'
                    ? 'text-[#0369A1]'
                    : 'text-[#B45309]'
                }`}
              >
                Status: {activeResin.recyclability}
              </p>
            </div>

            <div className="md:col-span-4">
              <p className="text-xs font-semibold text-[#62786C] mb-1">
                Common Items in India
              </p>
              <p className="text-sm text-[#3E5448] leading-relaxed">
                {activeResin.commonItems}
              </p>
            </div>

            <div className="md:col-span-4">
              <p className="text-xs font-semibold text-[#62786C] mb-1">
                Practical Sorting Advice
              </p>
              <p className="text-sm text-[#3E5448] leading-relaxed">
                {activeResin.tip}
              </p>
            </div>
          </div>
        </div>

        {/* Inline AI Material Lookup Bar */}
        <form
          onSubmit={handleCustomSubmit}
          className="mt-6 bg-[#EFF6F1] border border-[#D4E2D9] rounded-xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h3 className="text-base font-bold text-[#0F2419]">
              Unsure about a specific Indian packaging or household item?
            </h3>
            <p className="text-sm text-[#3E5448]">
              Ask EcoSmart AI about kulhads, mosquito repellent bottles, blister
              medicine packs, tetrapaks, or broken tube lights.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            <label htmlFor="guide-ai-lookup" className="sr-only">
              Ask EcoSmart AI about any item
            </label>
            <div className="relative flex-1 md:w-72">
              <Search
                className="w-4 h-4 text-[#62786C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="guide-ai-lookup"
                type="text"
                value={customMaterialQuery}
                onChange={(e) => setCustomMaterialQuery(e.target.value)}
                placeholder="e.g., mosquito liquid refill, milk pouch..."
                className="w-full pl-10 pr-3.5 py-2.5 min-h-[42px] text-sm text-[#0F2419] bg-white border border-[#D4E2D9] rounded-lg placeholder:text-[#7E9488] focus:border-[#0F7A4A] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[42px] text-sm font-semibold text-white bg-[#0F7A4A] rounded-lg hover:bg-[#0B613B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Ask AI</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

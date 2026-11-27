import { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  Leaf,
  Recycle,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';
import { WASTE_CATEGORIES } from '../data/wasteContent';
import type { CategoryGuideItem, IndianLocation } from '../types/waste';
import { LocalGuidanceSelector } from './LocalGuidanceSelector';
import { SafeImage } from './SafeImage';

interface WasteCategoriesSectionProps {
  location: IndianLocation;
  onChangeLocation: (next: IndianLocation) => void;
  onAskAiItem: (itemName: string) => void;
}

function getCategoryStyle(id: CategoryGuideItem['id']) {
  switch (id) {
    case 'wet-waste':
      return {
        accentText: 'text-[#0F7A4A]',
        activeBorder: 'border-[#0F7A4A]',
        softBg: 'bg-[#EBF7F0]',
        Icon: Leaf,
      };
    case 'dry-waste':
      return {
        accentText: 'text-[#0369A1]',
        activeBorder: 'border-[#0369A1]',
        softBg: 'bg-[#EFF7FC]',
        Icon: Recycle,
      };
    case 'sanitary-waste':
      return {
        accentText: 'text-[#B45309]',
        activeBorder: 'border-[#B45309]',
        softBg: 'bg-[#FEF6EC]',
        Icon: ShieldAlert,
      };
    case 'special-care-waste':
    default:
      return {
        accentText: 'text-[#B91C1C]',
        activeBorder: 'border-[#B91C1C]',
        softBg: 'bg-[#FEF2F2]',
        Icon: AlertTriangle,
      };
  }
}

export function WasteCategoriesSection({
  location,
  onChangeLocation,
  onAskAiItem,
}: WasteCategoriesSectionProps) {
  const [selectedId, setSelectedId] = useState<CategoryGuideItem['id']>('wet-waste');
  const [filterQuery, setFilterQuery] = useState('');

  const selectedCategory =
    WASTE_CATEGORIES.find((cat) => cat.id === selectedId) ?? WASTE_CATEGORIES[0];
  const selectedStyle = getCategoryStyle(selectedCategory.id);

  const normalizedQuery = filterQuery.trim().toLowerCase();
  const filteredExamples = normalizedQuery
    ? WASTE_CATEGORIES.flatMap((cat) =>
        cat.examples
          .filter((ex) => ex.toLowerCase().includes(normalizedQuery))
          .map((ex) => ({
            item: ex,
            categoryTitle: cat.title,
            channel: cat.handlingChannel,
          }))
      )
    : [];

  return (
    <section
      id="categories"
      className="py-16 lg:py-20 bg-white border-y border-[#E2EBE5] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Quick Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#0F7A4A] mb-2">
              02. Indian Waste Segregation System · SWM Rules, 2026
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F2419]">
              Four mandatory waste streams at source
            </h2>
            <p className="mt-3 text-base text-[#3E5448] leading-relaxed">
              Under India’s Solid Waste Management Rules, 2026 (MoEFCC),
              households, schools, and establishments separate waste into four
              streams: Wet, Dry, Sanitary, and Special Care Waste.
            </p>
          </div>

          <div className="w-full lg:w-80">
            <label htmlFor="category-example-search" className="sr-only">
              Filter Indian waste examples
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#62786C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="category-example-search"
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search examples (milk, flowers, diaper, CFL)"
                className="w-full pl-10 pr-9 py-2.5 text-sm text-[#0F2419] bg-[#F7FAF8] border border-[#D4E2D9] rounded-lg placeholder:text-[#7E9488] focus:bg-white focus:border-[#0F7A4A] focus:outline-none"
              />
              {filterQuery && (
                <button
                  type="button"
                  aria-label="Clear example filter"
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#62786C] hover:text-[#0F2419] cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Search Matches when typing */}
        {normalizedQuery && (
          <div className="mb-8 p-5 rounded-xl bg-[#F7FAF8] border border-[#E2EBE5]">
            <p className="text-xs font-semibold text-[#3E5448] mb-3">
              Matching Indian examples for &ldquo;{filterQuery.trim()}&rdquo; ({filteredExamples.length})
            </p>
            {filteredExamples.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredExamples.map((match) => (
                  <button
                    key={`${match.categoryTitle}-${match.item}`}
                    type="button"
                    onClick={() => onAskAiItem(match.item)}
                    className="flex items-center justify-between gap-3 p-3 bg-white border border-[#E2EBE5] rounded-lg hover:border-[#0F7A4A] text-left transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0F2419] truncate">
                        {match.item}
                      </p>
                      <p className="text-xs text-[#62786C] truncate">
                        {match.categoryTitle} · {match.channel}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#0F7A4A] shrink-0" aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-[#3E5448]">
                  Not in our quick examples yet—ask EcoSmart AI directly for
                  safe disposal instructions.
                </p>
                <button
                  type="button"
                  onClick={() => onAskAiItem(filterQuery.trim())}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#0F7A4A] rounded-lg hover:bg-[#0B613B] whitespace-nowrap cursor-pointer"
                >
                  <span>Ask AI about &ldquo;{filterQuery.trim()}&rdquo;</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4 Balanced Stream Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WASTE_CATEGORIES.map((category) => {
            const style = getCategoryStyle(category.id);
            const isSelected = category.id === selectedId;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedId(category.id)}
                aria-pressed={isSelected}
                className={`group text-left flex flex-col justify-between p-5 rounded-xl border bg-white transition-colors duration-150 cursor-pointer ${
                  isSelected
                    ? `${style.activeBorder} ring-1 ring-[#0F7A4A]/20 bg-[#F7FAF8]`
                    : 'border-[#E2EBE5] hover:border-[#B6CFC0]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg ${style.softBg} flex items-center justify-center`}
                    >
                      <style.Icon
                        className={`w-4 h-4 ${style.accentText}`}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#62786C]">
                      Stream {category.streamNumber}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F2419]">
                    {category.title}
                  </h3>

                  <p className="mt-2 text-sm text-[#3E5448] leading-relaxed">
                    {category.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#E2EBE5] flex items-center justify-between gap-2 text-xs">
                  <span className="text-[#62786C] truncate">
                    {category.examples.length} examples
                  </span>
                  <span
                    className={`font-semibold whitespace-nowrap ${
                      isSelected ? style.accentText : 'text-[#0F2419]'
                    }`}
                  >
                    {isSelected ? 'Viewing rules' : 'Inspect rules'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Category Detailed Breakdown Panel */}
        <div className="mt-8 rounded-xl bg-[#F7FAF8] border border-[#E2EBE5] p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 border-b border-[#E2EBE5] items-center">
            <div className={selectedCategory.imageUrl ? 'lg:col-span-8' : 'lg:col-span-12'}>
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg ${selectedStyle.softBg} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <selectedStyle.Icon
                    className={`w-5 h-5 ${selectedStyle.accentText}`}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-xs font-mono font-semibold text-[#62786C]">
                    Stream {selectedCategory.streamNumber} · Solid Waste Management Rules, 2026
                  </p>
                  <h3 className="mt-0.5 text-2xl font-bold text-[#0F2419]">
                    {selectedCategory.title} — Handling Rules
                  </h3>
                  <p className="mt-1 text-sm text-[#3E5448]">
                    {selectedCategory.handlingChannel}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm sm:text-base text-[#3E5448] leading-relaxed max-w-3xl">
                <strong className="text-[#0F2419]">Why separation matters: </strong>
                {selectedCategory.whyItMatters}
              </p>

              {selectedCategory.safetyNotice && (
                <div className="mt-4 p-4 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3">
                  <AlertTriangle
                    className="w-5 h-5 text-[#B91C1C] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-[#7F1D1D]">
                    <strong>Safety requirement: </strong>
                    {selectedCategory.safetyNotice}
                  </p>
                </div>
              )}
            </div>

            {selectedCategory.imageUrl && (
              <div className="lg:col-span-4">
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#E2EBE5] bg-white">
                  <SafeImage
                    src={selectedCategory.imageUrl}
                    alt={selectedCategory.imageAlt ?? selectedCategory.title}
                    fallbackTitle={selectedCategory.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1: Clickable Examples */}
            <div>
              <h4 className="text-sm font-semibold text-[#0F2419] mb-3">
                Common Indian Examples (Click to Ask AI)
              </h4>
              <div className="space-y-2">
                {selectedCategory.examples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => onAskAiItem(example)}
                    className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 min-h-[40px] bg-white border border-[#E2EBE5] rounded-lg text-left text-sm text-[#0F2419] hover:border-[#0F7A4A] hover:text-[#0F7A4A] transition-colors cursor-pointer"
                  >
                    <span className="truncate">{example}</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0 text-[#62786C]" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Best Practices */}
            <div>
              <h4 className="text-sm font-semibold text-[#0F7A4A] mb-3">
                Do This
              </h4>
              <ul className="space-y-3 text-sm text-[#3E5448]">
                {selectedCategory.doRules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <Check
                      className="w-4 h-4 text-[#0F7A4A] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Avoid These Mistakes */}
            <div>
              <h4 className="text-sm font-semibold text-[#9A3412] mb-3">
                Avoid This
              </h4>
              <ul className="space-y-3 text-sm text-[#3E5448]">
                {selectedCategory.dontRules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <X
                      className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Indian State & City Local Guidance Selector */}
        <LocalGuidanceSelector
          location={location}
          onChangeLocation={onChangeLocation}
        />
      </div>
    </section>
  );
}

import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { RotateCcw } from 'lucide-react';
import {
  INDIA_EWASTE_HIGHLIGHTS,
  INDIA_MSW_STATUS_DATA,
  INDIA_PLASTIC_TREND_DATA,
  INDIA_POLICY_MILESTONES,
  INDIAN_SUSTAINABILITY_HABITS,
} from '../data/wasteContent';

interface SustainabilityInsightsSectionProps {
  sessionScansCount: number;
}

export function SustainabilityInsightsSection({
  sessionScansCount,
}: SustainabilityInsightsSectionProps) {
  // Honest, transparent weekly-to-yearly habit planner (pure arithmetic: weekly × 52, no invented multipliers)
  const [waterBottlesAvoidedPerWeek, setWaterBottlesAvoidedPerWeek] = useState(5);
  const [milkPacketsRinsedPerWeek, setMilkPacketsRinsedPerWeek] = useState(7);
  const [clothBagTripsPerWeek, setClothBagTripsPerWeek] = useState(4);
  const [wetSegregationDaysPerWeek, setWetSegregationDaysPerWeek] = useState(7);

  const handleResetPlanner = () => {
    setWaterBottlesAvoidedPerWeek(5);
    setMilkPacketsRinsedPerWeek(7);
    setClothBagTripsPerWeek(4);
    setWetSegregationDaysPerWeek(7);
  };

  const yearlyBottlesAvoided = waterBottlesAvoidedPerWeek * 52;
  const yearlyMilkPacketsSaved = milkPacketsRinsedPerWeek * 52;
  const yearlyClothBagTrips = clothBagTripsPerWeek * 52;
  const yearlySegregatedDays = Math.min(365, wetSegregationDaysPerWeek * 52);

  return (
    <section
      id="insights"
      className="py-16 lg:py-20 bg-white border-t border-[#E2EBE5] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-semibold text-[#0F7A4A] mb-2">
            04. India Sustainability Insights
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F2419]">
            Official Indian waste data and practical reduction habits
          </h2>
          <p className="mt-3 text-base text-[#3E5448] leading-relaxed">
            Explore verified national waste statistics published by the Central
            Pollution Control Board (CPCB) and Ministry of Environment, Forest
            and Climate Change (MoEFCC), and plan realistic weekly waste
            reduction habits for your home or school.
          </p>
        </div>

        {/* Charts Grid — 100% Official Indian CPCB Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: India Municipal Solid Waste Management (CPCB 2021-22) */}
          <div className="bg-[#F7FAF8] border border-[#E2EBE5] rounded-xl p-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-[#0F2419]">
                India Municipal Solid Waste Flow (Tonnes Per Day)
              </h3>
              <p className="mt-1 text-xs text-[#62786C]">
                Source: Central Pollution Control Board (CPCB), Annual Report on
                Solid Waste Management, 2021–22
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={INDIA_MSW_STATUS_DATA}
                  layout="vertical"
                  margin={{ top: 4, right: 24, left: 16, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#DCE6DF"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 185000]}
                    tickFormatter={(val: number) => `${Math.round(val / 1000)}k`}
                    tick={{ fill: '#62786C', fontSize: 12 }}
                    axisLine={{ stroke: '#D4E2D9' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="stage"
                    width={126}
                    tick={{ fill: '#0F2419', fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value, _name, item) => {
                      const payload = item?.payload as
                        | { shareLabel: string }
                        | undefined;
                      const formatted = Number(value).toLocaleString('en-IN');
                      return [
                        `${formatted} TPD (${payload?.shareLabel ?? ''})`,
                        'Volume',
                      ];
                    }}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2EBE5',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#0F2419',
                    }}
                  />
                  <Bar dataKey="tpd" radius={[0, 6, 6, 0]} barSize={24}>
                    {INDIA_MSW_STATUS_DATA.map((entry) => (
                      <Cell key={entry.stage} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-4 pt-4 border-t border-[#E2EBE5] text-xs text-[#3E5448] leading-relaxed">
              Out of{' '}
              <strong className="text-[#0F2419] font-mono tabular-nums">
                1,70,339 TPD
              </strong>{' '}
              generated across India,{' '}
              <strong className="text-[#0F2419] font-mono tabular-nums">
                91,511 TPD
              </strong>{' '}
              (~54%) was treated while{' '}
              <strong className="text-[#0F2419] font-mono tabular-nums">
                41,455 TPD
              </strong>{' '}
              went to landfills and{' '}
              <strong className="text-[#0F2419] font-mono tabular-nums">
                37,373 TPD
              </strong>{' '}
              remained unaccounted. Clean source segregation directly helps
              cities treat more waste.
            </p>
          </div>

          {/* Chart 2: India Plastic Waste Generation Trend (CPCB 2018-19 to 2022-23) */}
          <div className="bg-[#F7FAF8] border border-[#E2EBE5] rounded-xl p-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-[#0F2419]">
                India Plastic Waste Generation (Lakh Tonnes / Year)
              </h3>
              <p className="mt-1 text-xs text-[#62786C]">
                Source: CPCB Annual Reports under Plastic Waste Management
                Rules, 2018–19 to 2022–23
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={INDIA_PLASTIC_TREND_DATA}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#DCE6DF"
                  />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: '#0F2419', fontSize: 12, fontWeight: 500 }}
                    axisLine={{ stroke: '#D4E2D9' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 48]}
                    unit="L"
                    tick={{ fill: '#62786C', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(_val, _name, item) => {
                      const payload = item?.payload as
                        | { exactTpa: string }
                        | undefined;
                      return [payload?.exactTpa ?? '', 'Plastic Waste'];
                    }}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2EBE5',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#0F2419',
                    }}
                  />
                  <Bar
                    dataKey="lakhTonnes"
                    fill="#0F7A4A"
                    radius={[6, 6, 0, 0]}
                    barSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-4 pt-4 border-t border-[#E2EBE5] text-xs text-[#3E5448] leading-relaxed">
              Reported plastic waste generation rose from{' '}
              <strong className="text-[#0F2419] font-mono tabular-nums">
                33.60 lakh TPA
              </strong>{' '}
              in 2018–19 to{' '}
              <strong className="text-[#0F2419] font-mono tabular-nums">
                41.36 lakh TPA
              </strong>{' '}
              in 2022–23—highlighting why reducing single-use plastics and
              rinsing recyclable bottles and milk packets matters every day.
            </p>
          </div>
        </div>

        {/* Official India E-Waste Snapshot & National Rules */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#F7FAF8] border border-[#E2EBE5] rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#0F2419]">
              India E-Waste Generation Snapshot
            </h3>
            <p className="mt-1 text-xs text-[#62786C]">
              Source: MoEFCC / CPCB Parliamentary Data (E-Waste EPR Portal),
              2021–22 to 2024–25
            </p>

            <div className="mt-5 divide-y divide-[#E2EBE5]">
              {INDIA_EWASTE_HIGHLIGHTS.map((row) => (
                <div
                  key={row.year}
                  className="py-3 flex items-center justify-between text-sm"
                >
                  <span className="font-medium text-[#3E5448]">
                    FY {row.year}
                  </span>
                  <span className="font-mono font-semibold text-[#0F2419] tabular-nums">
                    {row.metricTonnes}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 pt-4 border-t border-[#E2EBE5] text-xs text-[#62786C] leading-relaxed">
              Note: From FY 2023–24, figures reflect tracking under the revamped
              digital CPCB E-Waste EPR portal. Always hand over electronics and
              batteries only to CPCB/SPCB-authorised recyclers.
            </p>
          </div>

          <div className="lg:col-span-7 bg-[#F7FAF8] border border-[#E2EBE5] rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#0F2419]">
              Key Indian Waste Management Frameworks
            </h3>
            <p className="mt-1 text-xs text-[#62786C]">
              Official national regulations issued by MoEFCC, Government of India
            </p>

            <div className="mt-5 space-y-5 divide-y divide-[#E2EBE5]">
              {INDIA_POLICY_MILESTONES.map((policy) => (
                <div key={policy.title} className="pt-4 first:pt-0">
                  <h4 className="text-sm font-bold text-[#0F2419]">
                    {policy.title}
                  </h4>
                  <p className="mt-0.5 text-xs font-medium text-[#0F7A4A]">
                    {policy.source}
                  </p>
                  <p className="mt-1.5 text-sm text-[#3E5448] leading-relaxed">
                    {policy.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Indian Household & School Waste Reduction Planner */}
        <div className="mt-8 rounded-xl border border-[#E2EBE5] bg-white overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-[#E2EBE5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#0F2419]">
                Household &amp; School Waste Reduction Planner
              </h3>
              <p className="mt-1 text-sm text-[#62786C]">
                Set realistic weekly habits to calculate the exact number of
                items your family or hostel room can avoid or segregate cleanly
                across 52 weeks.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetPlanner}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] text-xs font-semibold text-[#0F2419] bg-[#F7FAF8] border border-[#D4E2D9] rounded-lg hover:bg-[#EFF6F1] whitespace-nowrap self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset planner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E2EBE5]">
            {/* Sliders */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <label
                    htmlFor="slider-water-bottles"
                    className="font-medium text-[#0F2419]"
                  >
                    Single-use water bottles replaced with a steel bottle
                  </label>
                  <span className="font-mono font-semibold text-[#0F7A4A] tabular-nums">
                    {waterBottlesAvoidedPerWeek} bottles / week
                  </span>
                </div>
                <input
                  id="slider-water-bottles"
                  type="range"
                  min={0}
                  max={25}
                  step={1}
                  value={waterBottlesAvoidedPerWeek}
                  onChange={(e) =>
                    setWaterBottlesAvoidedPerWeek(Number(e.target.value))
                  }
                  className="w-full accent-[#0F7A4A] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <label
                    htmlFor="slider-milk-packets"
                    className="font-medium text-[#0F2419]"
                  >
                    Dairy milk packets rinsed &amp; saved cleanly for Dry Waste
                  </label>
                  <span className="font-mono font-semibold text-[#0F7A4A] tabular-nums">
                    {milkPacketsRinsedPerWeek} packets / week
                  </span>
                </div>
                <input
                  id="slider-milk-packets"
                  type="range"
                  min={0}
                  max={28}
                  step={1}
                  value={milkPacketsRinsedPerWeek}
                  onChange={(e) =>
                    setMilkPacketsRinsedPerWeek(Number(e.target.value))
                  }
                  className="w-full accent-[#0F7A4A] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <label
                    htmlFor="slider-jhola-trips"
                    className="font-medium text-[#0F2419]"
                  >
                    Sabzi mandi / kirana trips using a cloth jhola
                  </label>
                  <span className="font-mono font-semibold text-[#0F7A4A] tabular-nums">
                    {clothBagTripsPerWeek} trips / week
                  </span>
                </div>
                <input
                  id="slider-jhola-trips"
                  type="range"
                  min={0}
                  max={14}
                  step={1}
                  value={clothBagTripsPerWeek}
                  onChange={(e) => setClothBagTripsPerWeek(Number(e.target.value))}
                  className="w-full accent-[#0F7A4A] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <label
                    htmlFor="slider-wet-days"
                    className="font-medium text-[#0F2419]"
                  >
                    Days per week Wet kitchen scraps are segregated separately
                  </label>
                  <span className="font-mono font-semibold text-[#0F7A4A] tabular-nums">
                    {wetSegregationDaysPerWeek} days / week
                  </span>
                </div>
                <input
                  id="slider-wet-days"
                  type="range"
                  min={0}
                  max={7}
                  step={1}
                  value={wetSegregationDaysPerWeek}
                  onChange={(e) =>
                    setWetSegregationDaysPerWeek(Number(e.target.value))
                  }
                  className="w-full accent-[#0F7A4A] cursor-pointer"
                />
              </div>
            </div>

            {/* Transparent Arithmetic Readout */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-[#F7FAF8] flex flex-col justify-between">
              <div className="space-y-5">
                <p className="text-xs font-semibold text-[#0F7A4A]">
                  Your 52-Week Projected Actions (Weekly × 52)
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#62786C]">
                      Single-Use Bottles Avoided
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#0F7A4A] font-mono tabular-nums">
                      {yearlyBottlesAvoided.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#62786C]">
                      Clean Milk Pouches Recovered
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#0F2419] font-mono tabular-nums">
                      {yearlyMilkPacketsSaved.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#62786C]">
                      Cloth Jhola Shopping Trips
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#0F2419] font-mono tabular-nums">
                      {yearlyClothBagTrips.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#62786C]">
                      Days Wet Waste Segregated
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#0F2419] font-mono tabular-nums">
                      {yearlySegregatedDays} / 365
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#E2EBE5] text-xs text-[#3E5448] space-y-1.5">
                <p>
                  Session progress:{' '}
                  <strong className="text-[#0F2419] font-mono tabular-nums">
                    {sessionScansCount}
                  </strong>{' '}
                  item{sessionScansCount === 1 ? '' : 's'} checked with EcoSmart
                  AI so far.
                </p>
                <p className="text-[#62786C]">
                  Counts above are simple 52-week projections based strictly on
                  the weekly habits you selected.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* High-Impact Everyday Habits for India */}
        <div className="mt-12 pt-10 border-t border-[#E2EBE5]">
          <h3 className="text-xl font-bold text-[#0F2419] mb-6">
            Four high-impact habits for Indian households, schools, and communities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INDIAN_SUSTAINABILITY_HABITS.map((habit) => (
              <div
                key={habit.index}
                className="p-5 rounded-xl bg-[#F7FAF8] border border-[#E2EBE5] flex flex-col justify-between"
              >
                <div>
                  <p className="font-mono text-xs font-semibold text-[#0F7A4A]">
                    {habit.index}.
                  </p>
                  <h4 className="mt-1.5 text-base font-bold text-[#0F2419]">
                    {habit.title}
                  </h4>
                  <p className="mt-2 text-sm text-[#3E5448] leading-relaxed">
                    {habit.description}
                  </p>
                </div>
                <p className="mt-4 pt-3 border-t border-[#E2EBE5] text-xs font-medium text-[#62786C]">
                  {habit.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

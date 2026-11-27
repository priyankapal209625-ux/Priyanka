import { ArrowUp } from 'lucide-react';
import { NAV_ITEMS } from './Navbar';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-white border-t border-[#E2EBE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pb-8 border-b border-[#E2EBE5]">
          <div>
            <p
              className="text-lg font-bold tracking-tight text-[#0F2419]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              EcoSmart AI
            </p>
            <p className="mt-1.5 text-sm text-[#62786C] max-w-md">
              Smart Waste Management Assistant designed for Indian households,
              students, schools, and communities under India’s Solid Waste
              Management (SWM) Rules, 2026.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className="text-sm font-medium text-[#3E5448] hover:text-[#0F7A4A] transition-colors duration-150 whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-[#62786C]">
          <p>
            Official Indian environmental data referenced from Central Pollution
            Control Board (CPCB), Ministry of Environment, Forest and Climate
            Change (MoEFCC), Government of India, and State Pollution Control
            Boards (SPCBs/PCCs). Local bin colours, pickup schedules, and
            drop-off points vary by municipality—please verify with your local
            Urban Local Body (ULB).
          </p>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F2419] hover:text-[#0F7A4A] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

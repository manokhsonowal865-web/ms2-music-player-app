import React from 'react';
import { Home, Compass, Flame, Library, Search } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useMusic();

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'assamese' as const, label: 'Assamese', icon: Compass },
    { id: 'ms2-originals' as const, label: 'MS2 Hits', icon: Flame },
    { id: 'library' as const, label: 'Library', icon: Library },
    { id: 'search' as const, label: 'Search', icon: Search },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 safe-bottom">
      <div className="grid grid-cols-5 items-center h-13 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] w-full py-1 text-center transition-all cursor-pointer relative"
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-amber-400 -translate-y-0.5'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span
                className={`text-[10px] tracking-tight leading-none mt-0.5 font-medium ${
                  isActive ? 'text-amber-400 font-semibold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-5 h-0.5 bg-amber-400 rounded-full glow-gold-sm" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

import React from 'react';
import { Sliders, Download, Sparkles } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  onOpenEq: () => void;
  onOpenAndroidGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEq, onOpenAndroidGuide }) => {
  const { activeTab, setActiveTab } = useMusic();
  const { isInstallable, install } = usePWAInstall();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#050811]/90 backdrop-blur-md border-b border-amber-500/15">
      <div className="max-w-7xl mx-auto px-4 h-15 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand element */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-400/30 glow-gold-sm bg-slate-900 flex items-center justify-center relative">
            <img 
              src="/src/assets/images/ms2_brand_logo_1792664665840.jpg" 
              alt="MS2 Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="brand-font font-black tracking-wider text-base text-white">MS2</span>
              <span className="text-[10px] font-bold text-amber-400 tracking-widest bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/30">.-SM</span>
            </div>
            <span className="text-[10px] text-slate-400 tracking-wide font-medium mt-0.5">Original Android Player</span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'home' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('assamese')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'assamese' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Assamese
          </button>
          <button
            onClick={() => setActiveTab('ms2-originals')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'ms2-originals' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            MS2.-SM Originals
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'library' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            My Library
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'search' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Search
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenEq}
            aria-label="Equalizer"
            className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 flex items-center justify-center text-slate-300 hover:text-amber-400 transition cursor-pointer"
            title="Audio Equalizer"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {isInstallable ? (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-black bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-400 hover:to-amber-600 rounded-xl glow-gold-sm transition cursor-pointer whitespace-nowrap shrink-0 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install PWA</span>
            </button>
          ) : (
            <button
              onClick={onOpenAndroidGuide}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition cursor-pointer whitespace-nowrap shrink-0"
              title="Android PWA & APK Packaging Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Android APK</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 600);
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#050811] flex flex-col items-center justify-center transition-opacity duration-600 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center animate-in zoom-in-95 duration-700">
        {/* Glowing Logo Container */}
        <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-amber-400/80 glow-gold shadow-2xl p-1 bg-slate-950 mb-6">
          <img
            src="/src/assets/images/ms2_brand_logo_1792664665840.jpg"
            alt="MS2 Logo"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Wordmark and Tag */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wider brand-font">
              MS2 MUSIC
            </h1>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/40">
              .-SM
            </span>
          </div>
          <p className="text-xs text-slate-400 tracking-widest uppercase mt-2 font-medium">
            Original Android Music Player
          </p>
        </div>

        {/* Loading Indicator */}
        <div className="mt-8 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-0" />
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-150" />
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-300" />
        </div>
      </div>
    </div>
  );
};

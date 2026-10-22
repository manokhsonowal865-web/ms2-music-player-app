import React from 'react';
import { X, RotateCcw, Sliders } from 'lucide-react';
import { useMusic, EQ_PRESETS } from '../context/MusicContext';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EqualizerModal: React.FC<EqualizerModalProps> = ({ isOpen, onClose }) => {
  const {
    currentEqPreset,
    eqGains,
    setEqualizerPreset,
    setEqualizerBandGain,
  } = useMusic();

  if (!isOpen) return null;

  const bandLabels = [
    { label: '60 Hz', sub: 'Bass' },
    { label: '250 Hz', sub: 'Low Mid' },
    { label: '1 kHz', sub: 'Vocal' },
    { label: '4 kHz', sub: 'Presence' },
    { label: '12 kHz', sub: 'Treble' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#0a0f1d] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Audio Equalizer</h3>
              <p className="text-xs text-slate-400">Hardware 5-Band Biquad Filter</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="my-4">
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            Sound Presets
          </label>
          <div className="grid grid-cols-3 gap-2">
            {EQ_PRESETS.map((preset) => {
              const isActive = currentEqPreset === preset.name;
              return (
                <button
                  key={preset.name}
                  onClick={() => setEqualizerPreset(preset.name)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium transition cursor-pointer text-center truncate ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-bold glow-gold-sm shadow'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-amber-500/30'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5 Vertical Sliders */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 my-2">
          <div className="grid grid-cols-5 gap-2 items-end h-44 pb-2">
            {bandLabels.map((band, idx) => {
              const gain = eqGains[idx] || 0;
              return (
                <div key={band.label} className="flex flex-col items-center h-full justify-between">
                  <span className="text-[10px] font-mono tabular-nums text-amber-400 font-semibold">
                    {gain > 0 ? `+${gain}` : gain} dB
                  </span>
                  
                  {/* Vertical Slider Track */}
                  <div className="relative flex items-center justify-center flex-1 my-2">
                    <input
                      type="range"
                      min={-12}
                      max={12}
                      step={1}
                      value={gain}
                      onChange={(e) => setEqualizerBandGain(idx, parseFloat(e.target.value))}
                      className="w-28 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer -rotate-90 origin-center"
                    />
                  </div>

                  <div className="text-center mt-2">
                    <p className="text-[11px] font-semibold text-white leading-none">{band.label}</p>
                    <p className="text-[9px] text-slate-500 leading-none mt-0.5">{band.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800/80">
          <button
            onClick={() => setEqualizerPreset('Flat')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Flat</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs glow-gold-sm hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

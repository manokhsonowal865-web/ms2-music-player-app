import React from 'react';
import { Moon, X, Check } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({ isOpen, onClose }) => {
  const { sleepTimerRemaining, setSleepTimer } = useMusic();

  if (!isOpen) return null;

  const timerOptions = [
    { label: 'Off', minutes: null },
    { label: '15 Minutes', minutes: 15 },
    { label: '30 Minutes', minutes: 30 },
    { label: '45 Minutes', minutes: 45 },
    { label: '60 Minutes', minutes: 60 },
    { label: '90 Minutes', minutes: 90 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-[#0a0f1d] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Sleep Timer</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sleepTimerRemaining && (
          <div className="my-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
            <p className="text-xs text-amber-300">
              Music will automatically pause in{' '}
              <span className="font-bold font-mono">
                {Math.floor(sleepTimerRemaining / 60)}m {sleepTimerRemaining % 60}s
              </span>
            </p>
          </div>
        )}

        <div className="space-y-1.5 my-3">
          {timerOptions.map((opt) => {
            const isSelected =
              opt.minutes === null
                ? sleepTimerRemaining === null
                : sleepTimerRemaining !== null &&
                  Math.abs(Math.ceil(sleepTimerRemaining / 60) - opt.minutes) <= 1;

            return (
              <button
                key={opt.label}
                onClick={() => {
                  setSleepTimer(opt.minutes);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-bold glow-gold-sm'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

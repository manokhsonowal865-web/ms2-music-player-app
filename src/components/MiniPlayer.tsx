import React from 'react';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const MiniPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    playNext,
    toggleFavorite,
    isFavorite,
    setFullPlayerOpen,
  } = useMusic();

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFav = isFavorite(currentSong.id);

  return (
    <div className="fixed bottom-16 md:bottom-3 left-0 right-0 z-30 px-3 max-w-2xl mx-auto">
      <div 
        onClick={() => setFullPlayerOpen(true)}
        className="w-full bg-[#0d1424]/95 backdrop-blur-xl border border-amber-500/25 rounded-2xl shadow-2xl p-2.5 flex items-center justify-between gap-3 cursor-pointer group hover:border-amber-400/50 transition-all relative overflow-hidden"
      >
        {/* Top Progress Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800/80">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-200 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Left: Spinning Vinyl / Cover Artwork */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md border border-amber-500/20 bg-slate-900">
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'animate-spin-slow' : 'animate-spin-paused'
              }`}
            />
            {/* Center vinyl pin */}
            <div className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full bg-black/80 border border-amber-400/70" />
          </div>

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-white truncate max-w-[150px] sm:max-w-xs">
                {currentSong.title}
              </span>
              {currentSong.isMS2Original && (
                <span className="text-[9px] font-bold text-amber-300 bg-amber-500/15 px-1 py-0.2 rounded border border-amber-400/30 shrink-0">
                  MS2
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400 truncate max-w-[150px] sm:max-w-xs">
              {currentSong.artist}
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="flex items-center gap-1 shrink-0"
        >
          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(currentSong.id)}
            aria-label="Favorite"
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-amber-400 transition cursor-pointer"
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          {/* Play / Pause Button */}
          <button
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 flex items-center justify-center glow-gold-sm hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-slate-950" />
            ) : (
              <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={playNext}
            aria-label="Next track"
            className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

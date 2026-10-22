import React, { useState } from 'react';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  ListMusic,
  Sliders,
  Moon,
  Plus,
  Radio,
  Share2
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { AudioVisualizer } from './AudioVisualizer';

interface FullPlayerModalProps {
  onOpenEq: () => void;
  onOpenSleepTimer: () => void;
  onOpenAddToPlaylist: () => void;
}

export const FullPlayerModal: React.FC<FullPlayerModalProps> = ({
  onOpenEq,
  onOpenSleepTimer,
  onOpenAddToPlaylist,
}) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffle,
    queue,
    queueIndex,
    isFullPlayerOpen,
    sleepTimerRemaining,
    setFullPlayerOpen,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    toggleFavorite,
    isFavorite,
    playSong,
    removeFromQueue,
  } = useMusic();

  const [showQueue, setShowQueue] = useState(false);

  if (!isFullPlayerOpen || !currentSong) return null;

  const isFav = isFavorite(currentSong.id);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#050811] flex flex-col justify-between overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-200">
      {/* Background ambient gold & dark blue glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Action Bar */}
      <div className="relative z-10 max-w-lg mx-auto w-full px-5 pt-4 pb-2 flex items-center justify-between">
        <button
          onClick={() => setFullPlayerOpen(false)}
          className="w-11 h-11 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition"
          aria-label="Collapse player"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-bold tracking-widest text-amber-400/90 uppercase">
            MS2.-SM AUDIO ENGINE
          </span>
          <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">
            {currentSong.album || 'MS2 Music Player'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenEq}
            className="w-10 h-10 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-amber-400 flex items-center justify-center cursor-pointer transition"
            title="Equalizer"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer transition ${
              showQueue
                ? 'bg-amber-400 text-slate-950 border-amber-300 glow-gold-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Center Area: Artwork & Visualizer OR Queue List */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full px-6 py-4">
        {showQueue ? (
          /* Queue Drawer */
          <div className="w-full h-80 sm:h-96 bg-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-3xl p-4 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">Up Next</span>
                <span className="text-xs text-slate-400">({queue.length} songs)</span>
              </div>
              <button
                onClick={() => setShowQueue(false)}
                className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
              >
                Back to Visualizer
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-2 divide-y divide-slate-800/40">
              {queue.map((song, idx) => {
                const isCurrent = idx === queueIndex;
                return (
                  <div
                    key={`${song.id}-${idx}`}
                    onClick={() => playSong(song)}
                    className={`flex items-center justify-between py-2 px-2 rounded-xl transition cursor-pointer ${
                      isCurrent ? 'bg-amber-500/15 border border-amber-500/30' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
                        <img src={song.coverUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-amber-300' : 'text-white'}`}>
                          {song.title}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{song.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isCurrent && (
                        <div className="flex items-center gap-0.5">
                          <span className="w-1 h-3 bg-amber-400 animate-pulse rounded-full" />
                          <span className="w-1 h-4 bg-amber-400 animate-pulse delay-75 rounded-full" />
                          <span className="w-1 h-2 bg-amber-400 animate-pulse delay-150 rounded-full" />
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(idx);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1 text-xs cursor-pointer"
                        title="Remove from queue"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Normal Visual Artwork */
          <div className="w-full flex flex-col items-center">
            {/* Spinning Vinyl & Artwork */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
              {/* Gold outer vinyl glow */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-700 ${
                  isPlaying ? 'glow-gold scale-102 opacity-100' : 'opacity-40'
                }`}
              />

              {/* Vinyl grooves styling */}
              <div
                className={`w-full h-full rounded-full bg-[#0a0f1d] border-4 border-amber-500/40 shadow-2xl p-6 flex items-center justify-center transition-transform duration-700 ${
                  isPlaying ? 'animate-spin-slow' : 'animate-spin-paused'
                }`}
                style={{
                  backgroundImage: `radial-gradient(circle, #0e172a 35%, #050811 70%, #000 100%)`,
                }}
              >
                {/* Circular grooves */}
                <div className="absolute inset-4 rounded-full border border-slate-800/80 pointer-events-none" />
                <div className="absolute inset-8 rounded-full border border-slate-700/40 pointer-events-none" />
                <div className="absolute inset-12 rounded-full border border-amber-500/10 pointer-events-none" />

                {/* Inner Album Cover */}
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-lg">
                  <img
                    src={currentSong.coverUrl}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Spindle hole */}
                  <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-[#050811] border-2 border-amber-300" />
                </div>
              </div>
            </div>

            {/* Real-time spectrum visualizer */}
            <div className="w-64 sm:w-72 mt-3">
              <AudioVisualizer isPlaying={isPlaying} barCount={36} height={32} />
            </div>

            {/* Song Meta Info */}
            <div className="w-full mt-4 flex items-center justify-between">
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white truncate brand-font">
                    {currentSong.title}
                  </h2>
                  {currentSong.isMS2Original && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40 shrink-0">
                      MS2.-SM
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span className="font-medium text-slate-300">{currentSong.artist}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400/90">{currentSong.language}</span>
                  {currentSong.genre && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{currentSong.genre}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Favorite Toggle Button */}
              <button
                onClick={() => toggleFavorite(currentSong.id)}
                aria-label="Add to favorites"
                className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <Heart
                  className={`w-6 h-6 transition-transform active:scale-125 ${
                    isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-400 hover:text-white'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Area: Scrubber, Controls, Volume & Quick Actions */}
      <div className="relative z-10 max-w-lg mx-auto w-full px-6 pb-6 pt-2">
        {/* Scrubber Range Bar */}
        <div className="w-full mb-3">
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #f59e0b 0%, #fbbf24 ${progressPercent}%, #1e293b ${progressPercent}%, #1e293b 100%)`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-mono tabular-nums mt-1.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Primary Controls Row: Shuffle, Prev, Play/Pause, Next, Repeat */}
        <div className="flex items-center justify-between my-2">
          {/* Shuffle Button */}
          <button
            onClick={toggleShuffle}
            aria-label="Shuffle"
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition cursor-pointer ${
              isShuffle
                ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          {/* Previous Button */}
          <button
            onClick={playPrevious}
            aria-label="Previous track"
            className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-18 h-18 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-200 text-slate-950 flex items-center justify-center glow-gold hover:scale-105 active:scale-95 transition shadow-2xl cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-slate-950" />
            ) : (
              <Play className="w-8 h-8 fill-slate-950 translate-x-0.5" />
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={playNext}
            aria-label="Next track"
            className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <SkipForward className="w-6 h-6" />
          </button>

          {/* Repeat Button */}
          <button
            onClick={toggleRepeat}
            aria-label="Repeat mode"
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition cursor-pointer relative ${
              repeatMode !== 'off'
                ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
            {repeatMode === 'one' && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>
        </div>

        {/* Volume & Utility Strip */}
        <div className="flex items-center justify-between gap-4 pt-3 mt-2 border-t border-slate-800/60">
          {/* Volume slider */}
          <div className="flex items-center gap-2 flex-1 max-w-[180px]">
            <button
              onClick={toggleMute}
              className="text-slate-400 hover:text-amber-400 cursor-pointer"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #f59e0b 0%, #fbbf24 ${(isMuted ? 0 : volume) * 100}%, #1e293b ${(isMuted ? 0 : volume) * 100}%, #1e293b 100%)`,
              }}
            />
          </div>

          {/* Action buttons: Add to Playlist, Sleep Timer */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddToPlaylist}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-amber-300 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Playlist</span>
            </button>

            <button
              onClick={onOpenSleepTimer}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                sleepTimerRemaining
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-amber-300'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>
                {sleepTimerRemaining
                  ? `${Math.ceil(sleepTimerRemaining / 60)}m`
                  : 'Timer'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

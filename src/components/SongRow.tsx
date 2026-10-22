import React from 'react';
import { Play, Pause, Heart, Plus } from 'lucide-react';
import { Song } from '../types/music';
import { useMusic } from '../context/MusicContext';

interface SongRowProps {
  song: Song;
  index?: number;
  onAddToPlaylist?: (song: Song) => void;
  showIndex?: boolean;
}

export const SongRow: React.FC<SongRowProps> = ({
  song,
  index,
  onAddToPlaylist,
  showIndex = true,
}) => {
  const { currentSong, isPlaying, playSong, togglePlayPause, isFavorite, toggleFavorite } = useMusic();

  const isCurrent = currentSong?.id === song.id;
  const isPlayingCurrent = isCurrent && isPlaying;
  const isFav = isFavorite(song.id);

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return '0:38';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleClick = () => {
    if (isCurrent) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group w-full flex items-center justify-between py-2 px-3 rounded-2xl transition-all cursor-pointer min-h-[56px] ${
        isCurrent
          ? 'bg-amber-500/15 border border-amber-500/30'
          : 'hover:bg-slate-900/60 border border-transparent'
      }`}
    >
      {/* Left zone: Index/Play + Cover + Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
        {showIndex && (
          <div className="w-5 text-center shrink-0">
            {isPlayingCurrent ? (
              <div className="flex items-center justify-center gap-0.5">
                <span className="w-1 h-3 bg-amber-400 animate-pulse rounded-full" />
                <span className="w-1 h-4 bg-amber-400 animate-pulse delay-75 rounded-full" />
                <span className="w-1 h-2 bg-amber-400 animate-pulse delay-150 rounded-full" />
              </div>
            ) : (
              <span className="text-xs font-mono tabular-nums text-slate-500 group-hover:hidden">
                {index !== undefined ? index + 1 : ''}
              </span>
            )}
            <Play className="w-3.5 h-3.5 text-amber-400 hidden group-hover:block mx-auto" />
          </div>
        )}

        {/* Thumbnail */}
        <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-slate-800 bg-slate-900 shadow">
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {isPlayingCurrent && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Pause className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          )}
        </div>

        {/* Text metadata */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4
              className={`text-xs sm:text-sm font-semibold truncate ${
                isCurrent ? 'text-amber-300 font-bold' : 'text-white'
              }`}
            >
              {song.title}
            </h4>
            {song.isMS2Original && (
              <span className="text-[8px] font-bold text-amber-400 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/25 shrink-0">
                MS2.-SM
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate mt-0.5">
            <span className="truncate">{song.artist}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400/80 shrink-0">{song.language}</span>
          </div>
        </div>
      </div>

      {/* Right zone: Duration + Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-mono tabular-nums text-slate-400 hidden sm:inline-block">
          {formatDuration(song.duration)}
        </span>

        {/* Add to Playlist button */}
        {onAddToPlaylist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToPlaylist(song);
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition cursor-pointer"
            title="Add to playlist"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

        {/* Favorite toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(song.id);
          }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition cursor-pointer"
          title="Favorite"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFav ? 'fill-amber-400 text-amber-400' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
};
